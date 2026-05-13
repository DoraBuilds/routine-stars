# Mobile Build (Capacitor)

This project packages the Vite web app into iOS + Android using Capacitor.

## Prereqs

### iOS

- Xcode installed

### Android

- Java (JDK) installed
- Android Studio installed (includes Android SDK)

## Common Workflow

1. Build web assets:

```bash
npm run build
```

2. Sync into native projects:

```bash
npm run cap:sync
```

## iOS

Open the Xcode workspace:

```bash
npm run cap:open:ios
```

Build and run from Xcode on a simulator or device.

## Android

Open the Android project:

```bash
npm run cap:open:android
```

If Gradle sync fails, confirm:
- A JDK is installed and configured
- Android SDK is installed via Android Studio

## Notes

- The bundle id/app id lives in `capacitor.config.ts` (`appId`). Update it to your final store identifier before publishing.
- Supabase auth deep links require additional configuration (universal links/app links) before magic links work inside the installed app.

