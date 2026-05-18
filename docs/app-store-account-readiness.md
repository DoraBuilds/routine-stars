# App Store Account Readiness (Accounts Only)

Last updated: 2026-05-18

This checklist covers **only account / auth / device sync** items needed for App Store / Play Store submission readiness. It is intentionally lean and testable.

Binding contract for behavior: `docs/accounts-v2.md`.

---

## Definition Of Done (Accounts)

Accounts are “store-ready” when all of the following are true:

1. **Email-only sign-in works end-to-end** (create account + sign in + sign out).
2. **Same email = same account on every device** (deterministic household; no split devices).
3. **Edits sync automatically across devices** (no manual refresh required).
4. **Session restore is fast** (seconds, not minutes).
5. **In-app account deletion exists** and does not require any admin tooling access.
6. **Privacy disclosures match reality** (App Store privacy label + Google Data Safety + privacy policy).

---

## Checklist

### 1) Auth Callback Reliability (Web + Installed App)

- Web redirect URL works:
  - `https://dorabuilds.github.io/routine-stars/auth/callback`
- Installed apps support email link callbacks:
  - iOS Universal Links for a real domain (not GitHub Pages)
  - Android App Links for the same domain
  - Custom scheme fallback can exist, but Universal/App links should be the primary path for review reliability
- Supabase Auth Redirect URLs include:
  - GitHub Pages callback (dev/web)
  - production domain callback (installed apps)

Reference: `docs/auth-deeplinks-capacitor.md`.

### 2) Deterministic Household (No Split Devices)

- Server-side bootstrap is deterministic:
  - one authenticated user has exactly one household for MVP
  - household selection never uses `limit 1` style queries
- Database enforces “one household per parent”:
  - unique constraint on `households(created_by_user_id)` (MVP guardrail)
- Bootstrap is atomic:
  - a single RPC creates/returns household + membership

Reference: `docs/accounts-v2.md`.

### 3) Device Sync (Automatic Convergence)

- On boot after session restore:
  - bootstrap household (or fetch deterministic household)
  - fetch cloud snapshot
  - cache locally as offline/read fallback
- On edits:
  - writes go to Supabase (write-through)
  - UI only claims “saved” when the cloud write succeeds (or is verifiably queued)
- Cross-device updates happen without manual refresh:
  - Supabase Realtime is preferred
  - polling + refocus refresh is acceptable as fallback
- Conflict rule is documented and implemented (MVP):
  - last write wins by server `updated_at`

Reference: `docs/accounts-v2.md`.

### 4) Session Persistence + Performance

- Session restore completes quickly on normal networks:
  - should feel immediate (a couple seconds), not ~1 minute
- Sign-in and callback flows are resilient on iOS Safari (including private mode limitations):
  - if storage is restricted, app shows a clear recovery path instead of spinning forever

Reference: `docs/accounts-v2.md`.

### 5) In-App Account Deletion

- User can delete account inside the app.
- Deletion is performed by a server-side action (Edge Function), not client-side service keys.
- Deletion clears device-local cache after success.
- Data deletion scope is defined (MVP recommendation: delete household + related rows).

Reference: `docs/account-deletion.md`.

### 6) Privacy (Account-Related)

- A public privacy policy exists and matches the actual stored data:
  - child profile data (names/avatars) is stored for app functionality
  - parents are the only authenticated accounts
- App Store “Privacy Nutrition Label” matches:
  - what is collected
  - whether it’s linked to identity
  - whether it’s used for tracking
- Google Play “Data Safety” matches the same reality.

---

## Lean Test Plan (Accounts)

Minimum automated coverage (web):

- E2E: user signs in via magic link callback and reaches setup without spinning indefinitely.
- E2E: create/edit a child profile in one browser context and verify it appears in a second context automatically (realtime/polling).
- Integration: deterministic household selection returns the same `household_id` for the same user every time.

Minimum manual coverage (installed apps):

- iOS: universal link from email opens installed app and completes auth callback.
- Android: app link from email opens installed app and completes auth callback.

