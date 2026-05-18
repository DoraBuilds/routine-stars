# Memory

This file captures durable project decisions so future work stays aligned.

## Binding Doc

- Accounts v2 contract lives in `docs/accounts-v2.md` (email-only auth, deterministic household, sync rules, App Store account requirements).
- Store submission checklist (accounts only): `docs/app-store-account-readiness.md`.

## Accounts (Ship-Blocking)

- Goal: parent accounts with **email-only** sign in for MVP, and **cross-device sync** (iPad + laptop see the same household).
- Supabase is the backend: Auth + Postgres + RLS.
- Canonical data model: **cloud is source of truth** for household configuration.
  - Local storage is an offline/cache layer and must never become a competing source of truth.
- Deterministic household selection is required (no random “pick 1 household” queries).
  - Prevent multiple households per parent going forward (DB guard + RPC behavior).
- Account deletion must be available in-app, and must not require any Supabase dashboard access.

## Key URLs (Current)

- Supabase project ref: `yftabzdnrdfiwpuhjwgv` (`https://yftabzdnrdfiwpuhjwgv.supabase.co`).
- Web app: `https://dorabuilds.github.io/routine-stars/`
- Web auth callback: `https://dorabuilds.github.io/routine-stars/auth/callback`

## App Store Requirements (Account-Related)

- Email-only sign-in is acceptable for now (no Google/Facebook). If third-party providers are added later on iOS, Sign in with Apple is required.
- Auth must work inside the installed app:
  - iOS Universal Links + Android App Links (Capacitor) are required for email link callbacks.
  - Implementation + setup steps are documented in `docs/auth-deeplinks-capacitor.md`.
- In-app account deletion is required (user can delete their account from within the app).

## Current Priorities

1. Make “create child / edit routines” reliably save to Supabase during setup.
2. Make sync automatic across devices (realtime/polling + safe conflict rules).
3. Implement in-app account deletion via a secure server-side action (Edge Function), not client-side service keys.

## Account Deletion (Implemented)

- Edge Function: `supabase/functions/delete-account/index.ts` verifies the caller JWT and deletes the `auth.users` row via `auth.admin.deleteUser(sub)`.
- Client: `src/lib/auth/auth-context.tsx` exposes `deleteAccount()` which calls the Edge Function and clears device-local cache (`routine_stars_data`) on success.
- UX: `src/components/AccountSettingsCard.tsx` adds a `Danger zone` section with a confirmation dialog.
- Design doc: `docs/account-deletion.md`
