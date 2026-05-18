# Mobile Deep Link Auth (Capacitor) Readiness

This doc makes email link auth work inside the installed iOS/Android app using:
- iOS Universal Links
- Android App Links

This is required for Supabase email (magic link / OTP) callbacks to reliably return to the app after the user taps the email link.

## 1) Pick a Real Domain (Required)

Universal/App links require hosting these files at the domain root:
- `/.well-known/apple-app-site-association`
- `/.well-known/assetlinks.json`

GitHub Pages project sites (like `dorabuilds.github.io/routine-stars/`) cannot serve these from the domain root, so you must use a custom domain like `app.routinestars.com` (or similar).

Templates live in:
- `public/.well-known/apple-app-site-association`
- `public/.well-known/assetlinks.json`

Update them with:
- iOS `TEAMID` + bundle ID (example format: `TEAMID.com.routinestars.app`)
- Android release keystore SHA-256 fingerprint

## 2) Supabase Redirect URLs

In Supabase Auth settings, include the callback URL for your production domain:
- `https://YOUR_DOMAIN/auth/callback`

Keep the existing web redirect for GitHub Pages if you still use it during development:
- `https://dorabuilds.github.io/routine-stars/auth/callback`

## 3) iOS (Universal Links)

In Xcode:
- Enable the `Associated Domains` capability
- Add `applinks:YOUR_DOMAIN`

Ensure the app bundle id matches `com.routinestars.app` and the `apple-app-site-association` file matches your `TEAMID`.

## 4) Android (App Links)

In `AndroidManifest.xml` for the main activity, add an intent filter:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https" android:host="YOUR_DOMAIN" android:pathPrefix="/auth/callback" />
</intent-filter>
```

Also ensure your `assetlinks.json` matches the `package_name` and signing cert fingerprint.

## 5) Runtime Handling (Implemented)

The app now listens for OS deep links on mobile and routes them into the SPA so `/auth/callback` can finalize the session:
- `src/lib/capacitor/deeplinks.ts`
- `src/lib/capacitor/DeepLinkBridge.tsx`
- Mounted in `src/App.tsx`

This supports:
- `https://YOUR_DOMAIN/auth/callback?...`
- For legacy GitHub Pages URLs, it also strips `/routine-stars/` when `BASE_URL` is `/routine-stars/`.

