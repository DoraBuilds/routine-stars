# Accounts v2 (Email-Only Auth + Deterministic Household + Real Sync)

Last updated: 2026-05-18

This doc defines the “Accounts v2” contract for Routine Stars: how sign-in works, how we deterministically pick the correct household for a parent, how data sync converges across devices, and what we must implement to pass App Store / Play Store requirements related to accounts.

This is a design doc only (no code changes).

---

## Goals (Ship-Blocking)

1. **Email-only sign-in** (magic link) works reliably on:
   - web (GitHub Pages / browser)
   - iOS app (Capacitor wrapper)
   - Android app (Capacitor wrapper)
2. **A parent’s account is the same on every device**:
   - if the parent signs in with the same email, they see the same household and the same kids/routines
   - devices **converge** to the same state after edits (no split-brain)
3. **Deterministic household selection**:
   - one parent = one household for MVP
   - no “random household selection” queries
4. **Sync is automatic**:
   - after a change is saved on Device A, Device B updates without manual refresh
5. **App-store requirements are met**:
   - deep link callback works inside installed apps
   - in-app account deletion exists
   - data retention policy is defined and enforced

---

## Non-Goals (Explicitly Not in Accounts v2)

- Password auth (email + password)
- OAuth providers (Google, Apple, etc.) for MVP
- Co-parent invites / multiple members per household (future)
- Multiple households per parent (future)
- Real-time multi-writer collaboration semantics for the same record (we will define safe conflict rules, not a full CRDT system)

---

## Core Principles

1. **Cloud is source of truth**
   - Supabase Postgres is canonical.
   - Local storage is a cache/offline layer only.
   - Local must not silently “win” over cloud after the first successful sync.
2. **Determinism over cleverness**
   - Always pick the same household for the same user.
   - When uncertainty exists (rare), show an explicit recovery UX, not silent guesses.
3. **Make writes explicit, and reads consistent**
   - Every user-visible change is written to Supabase.
   - Every device reads from Supabase on boot and stays updated thereafter.
4. **MVP constraints are enforced at the database layer**
   - “One household per parent” must be true even if a buggy client tries otherwise.

---

## Vocabulary

- **Parent**: authenticated Supabase user (email magic link session).
- **Household**: the parent’s family container (kids, routines, settings).
- **Member**: relationship between parent user and household (root authorization).
- **Client**: browser app or Capacitor app.

---

## Architecture Overview

**Backend**: Supabase
- Auth: email magic link
- Database: Postgres
- Security: Row Level Security (RLS)
- Realtime: optional (recommended for v2 “auto update”)
- Edge Functions: required for privileged operations (account deletion)

**Frontend**:
- React app
- A thin “auth + household bootstrap + sync engine”
- Local storage used only as:
  - session-adjacent cached household snapshot
  - offline read cache (best-effort)

---

## Auth Design (Email-Only)

### UX: Sign in vs Create account

Even though Supabase magic links can be used for both, the UI must clearly separate:

- **Create account**
  - ask for parent name (display name) + email
  - CTA: `Create account`
  - success message: “Check your email to finish creating your account.”
- **Sign in**
  - ask for email only
  - CTA: `Send sign-in link`
  - success message: “Check your email to sign in.”

Important UX rule:
- After pressing the CTA, **disable the button** and swap it to a “Email sent” state to prevent repeated sends and confusion.

### Callback URLs (Web + Capacitor)

We must support *multiple redirect targets*:

1. Web (GitHub Pages):
   - `https://dorabuilds.github.io/routine-stars/auth/callback`
2. iOS installed app (Universal Link preferred; custom scheme fallback):
   - Universal Link example: `https://routinestars.app/auth/callback`
   - Custom scheme example: `routinestars://auth/callback`
3. Android installed app (App Links preferred; custom scheme fallback):
   - App Link example: `https://routinestars.app/auth/callback`
   - Custom scheme example: `routinestars://auth/callback`

Supabase Auth settings must allow all intended redirect URLs.

### Capacitor deep link requirements (ship-blocking)

To pass review and to be reliable:

- iOS:
  - Universal Links configured (apple-app-site-association hosted on domain)
  - The app handles incoming links and forwards them to the web layer (Capacitor)
- Android:
  - App Links configured (assetlinks.json hosted on domain)
  - Intent filters set for the callback path

Fallback:
- custom scheme (`routinestars://...`) supported for development and as a backup

### Session persistence

Requirement:
- After the user completes the magic link flow, the app must store and restore the Supabase session quickly.

Acceptance criteria:
- returning to the app should not take “~1 minute” to recognize a session
- session restore should complete in a couple seconds on normal networks

---

## Deterministic Household (One Household Per Parent)

### The problem we must prevent

If the client does something like:
- “select * from households where user is a member limit 1”

…then multiple households can exist (due to bugs, race conditions, migrations, or a past test account), and the app will pick whichever row Postgres happens to return first. That creates “split devices” instantly.

### Deterministic contract (MVP)

For Accounts v2:

- Each authenticated parent has exactly one household.
- The canonical household id is deterministically derived from membership:
  - “the household where `created_by_user_id = auth.uid()`”
  - if none exists: create it

### Required DB invariants

1. Guardrail: prevent two households created by the same user.
   - Add a unique constraint on `households(created_by_user_id)` for MVP.
2. Guardrail: ensure the creator is a member of their household.
   - Enforce via RPC bootstrap transaction.

### Required RPC behavior (bootstrap)

We need a single server-side operation that is safe under RLS:

**RPC: `bootstrap_household(parent_display_name text)`**
- if the household exists for this user, return it
- if it doesn’t, create:
  - `households` row
  - `household_members` row with role `owner`
  - optional `profiles`/metadata row for parent display name (or store name on household)
- always return:
  - household id
  - household metadata
  - “am I member?” boolean (should always be true after bootstrap)

Why RPC:
- It guarantees atomicity (no partial create)
- It guarantees determinism (always the same household)
- It avoids clients needing to piece together multiple writes under RLS

---

## Data Ownership + RLS Model

Root authorization rule:
- A user can only read/write data in households where they are a member.

Implementation shape:
- `household_members` is the root table checked by RLS.
- All other tables join back to `household_members` via `household_id`.

Minimum requirement:
- Inserts/updates to `child_profiles`, `routines`, `routine_tasks`, etc. must succeed only when:
  - the row’s `household_id` belongs to a household the user is a member of.

---

## Sync Model (So Devices Converge)

### Target behavior

- Device A creates/renames a child or edits a routine.
- The change is written to Supabase immediately.
- Device B receives the update automatically and refreshes UI state.

### Why the current system can “split”

The usual causes of split-brain in client-heavy apps are:

- some writes never actually reach the database (client thinks they did)
- local storage overwrites a newer cloud snapshot
- device B never refreshes after device A wrote changes
- household selection is non-deterministic (two households exist, devices end up on different ones)

Accounts v2 resolves this with a strict sync contract.

### The sync contract

1. **On app boot (after session restore):**
   - call `bootstrap_household(...)` (or a read-only “get my household” if bootstrap already done)
   - fetch cloud snapshot for the household:
     - household settings
     - child profiles
     - routines + routine tasks
     - schedules (if separate)
   - write the snapshot into local cache with a `cloud_synced_at` timestamp
2. **On any user edit:**
   - write to Supabase first (or write-through with optimistic UI)
   - on success, update local cache
   - on failure, show error + retry (do not silently keep local-only edits as if saved)
3. **While app is open:**
   - keep device updated via one of:
     - Supabase Realtime subscriptions (recommended)
     - polling every N seconds as a fallback
4. **On return from background / tab refocus:**
   - do a quick “cloud refresh” (lightweight re-fetch of updated rows)

### Conflict rules (MVP)

We need a rule that is safe and predictable, without building a full conflict-free system.

MVP conflict resolution:

- For entity tables (`child_profiles`, `routines`, `routine_tasks`, household settings):
  - **Last write wins** based on `updated_at` (server timestamp).
  - Clients must not set `updated_at` themselves; the DB does.
- For ordered lists (routine tasks sort order):
  - treat each reorder as a full “order update” for the affected routine
  - last write wins at the routine level (updated_at)

Important UX principle:
- If two devices edit the *same* thing at the *same* time, one change may be overwritten. For MVP, this is acceptable as long as:
  - data does not disappear silently
  - the system converges

Future improvement:
- row versioning (`version int`) + compare-and-swap updates, or per-field merges.

### Offline behavior (MVP)

- If offline:
  - user can still enter the child flow using last cached household snapshot
  - parent edits are either disabled or queued with a clear “Not saved yet” indicator
- When back online:
  - refresh from cloud
  - if queued edits exist (optional), replay carefully; otherwise prompt user

---

## “Local Data Import” Rules

We must treat legacy local-only data carefully to avoid accidental merges.

Accounts v2 import rules:

- If the user logs in on a device that already has local `routine_stars_data`:
  - show explicit choice:
    - `Import this device’s family into your account`
    - `Start fresh`
- Never auto-merge local and cloud.
- Import should be a single operation:
  - write data to cloud
  - then re-fetch cloud snapshot
  - only then consider local state “synced”

---

## Required “Recovery” UX States

These states must exist and be user-safe:

1. **Login succeeds, bootstrap fails**
   - show: “We couldn’t finish setting up your family space.”
   - show: `Try again` (retries bootstrap + fetch)
   - show: `Sign out`
2. **Cloud empty**
   - show: setup flow (add first child)
3. **Cloud unreachable**
   - show: offline banner, load cached data if available
4. **Write failed**
   - show: “Not saved” and retry action

Note:
- None of these recovery paths should send users to Supabase dashboards or internal admin URLs.

---

## App Store / Play Store Requirements (Account-Related)

### 1) Deep links must work in installed apps

Requirement:
- A user taps the magic link in email on iOS/Android and the installed app opens and completes sign-in.

Implementation:
- Universal Links (iOS) and App Links (Android) for a production domain.
- Web fallback continues to work for browser usage.

### 2) In-app account deletion (mandatory)

Requirement:
- The user can delete their account inside the app (not “email support”).

Correct implementation pattern:
- Client calls an authenticated endpoint (Supabase Edge Function) to request deletion.
- The Edge Function:
  - validates `auth.uid()`
  - deletes or anonymizes user-owned data per retention policy
  - deletes the auth user

Never do this from the client with service keys.

### 3) Data retention + deletion policy (must be defined)

We must define:

- What data is stored (kids names/avatars, routines, schedules, progress)
- How long it is retained:
  - “until the user deletes the account” for most household data
  - optional: “retain de-identified analytics for X days” (if analytics exists)
- What happens on deletion:
  - delete household + all related data (or anonymize if required for billing/legal, if applicable)

We should keep retention simple for MVP:
- Delete everything tied to the household on account deletion.

### 4) Privacy disclosures

Before submission:
- App Store “Privacy Nutrition Label” and Google “Data Safety” must match what we actually store.
- If children’s data is stored (names/avatars), ensure compliance with:
  - clear “parents only” account model
  - a privacy policy that describes children’s profile data being stored for app functionality

---

## Acceptance Criteria (Definition of Done)

Accounts v2 is “done” when:

1. Create account + sign in work on iPad Safari, laptop browsers, and within Capacitor apps.
2. After sign-in, `bootstrap_household` returns the same `household_id` on every device for the same email.
3. Creating/editing kids and routines writes to Supabase and appears on another device automatically.
4. No device can show a different household for the same parent email (MVP constraint enforced).
5. Sign-in completes quickly:
   - session restore + bootstrap + initial fetch should feel immediate (seconds, not minutes).
6. User can delete account in-app, and the account is actually removed.

---

## Test Plan (Lean but High Value)

### Unit tests (Vitest)

- Household selection logic is deterministic given a user id.
- Sync reducer/merger does not allow local cache to override a newer cloud snapshot.
- “Write succeeded” updates local cache; “write failed” does not.

### Integration/E2E tests (Playwright)

Web-only E2E (fastest and most reliable early signal):

- Magic link callback route parses tokens and establishes a session.
- On first login, bootstrap creates household and membership and app enters setup state.
- Create a child profile on “Device A” (one browser context), verify it appears on “Device B” (second context) after sync.

Capacitor smoke tests (manual initially):
- iOS universal link opens the app and completes callback.
- Android app link opens the app and completes callback.

---

## Rollout Plan (Recommended)

1. Lock the MVP invariant (one household per parent) at DB level.
2. Make bootstrap deterministic via RPC.
3. Implement sync engine (cloud fetch on boot + realtime/polling + refocus refresh).
4. Implement in-app deletion via Edge Function.
5. Add test coverage for determinism + sync convergence.
6. Add production deep link domain + association files for iOS/Android.

