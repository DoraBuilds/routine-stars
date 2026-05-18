# In-App Account Deletion (Supabase Email-Only Auth)

## Goal

Allow a parent to permanently delete their account **from inside the app** (App Store requirement) without exposing Supabase admin access or the Supabase dashboard to end users.

## User Experience

- Entry point: `Parent Settings` -> `Parent Account` card -> `Danger zone` -> `Delete account`.
- Confirmation: modal confirm dialog, with a clear warning that deletion is permanent.
- Result:
  - The parent is signed out.
  - Device-local cached data is cleared so stale profiles do not remain visible.

## Architecture

### Why an Edge Function

Deleting a Supabase Auth user requires **admin privileges**. We do not (and must never) ship service role keys in the client.

Instead, the client calls a Supabase **Edge Function** which:

1. Verifies the caller is authenticated (JWT verification).
2. Uses the **service role** key (server-side only) to delete the auth user.

Because the database schema references `auth.users(id)` with `on delete cascade`, deleting the auth user automatically deletes the household and all related rows.

### Security Model

- Client sends `Authorization: Bearer <access_token>`.
- Edge Function verifies the JWT using `SUPABASE_JWT_SECRET`.
- The only user id deleted is the `sub` in the verified token.

## Implementation

### Edge Function

- Path: `supabase/functions/delete-account/index.ts`
- HTTP:
  - `POST /functions/v1/delete-account`
  - `OPTIONS` handled for CORS
- Env required:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_JWT_SECRET`

### Client

- The app calls `POST ${VITE_SUPABASE_URL}/functions/v1/delete-account` using the current session access token.
- On success the app clears `localStorage` key `routine_stars_data` and signs out.

## Deployment Notes

This repo includes the Edge Function source, but it must be deployed to Supabase:

- `supabase functions deploy delete-account`
- Ensure the required env vars are set for the function in Supabase.

