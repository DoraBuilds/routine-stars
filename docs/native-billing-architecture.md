# Native Billing Architecture

As of April 20, 2026, Routine Stars should plan its first paid native launch around store-compliant billing, not external web checkout.

## Decision

For a native-first launch, use:

- Apple App Store: one-time non-consumable In-App Purchase for a household lifetime unlock
- Google Play: one-time non-consumable product for a household lifetime unlock

Do not make external checkout the primary native-app purchase path for MVP.

## Why

Routine Stars sells digital app access. On both Apple and Google Play, that keeps us inside digital-goods billing rules for a native store app.

External web billing is still useful later for web sales, support workflows, or approved regional programs, but it is not the safest default path for a first native paid launch.

## What This Means

The commercial product should be:

- free app download
- one parent account per household
- one-time `EUR 9.99` household lifetime unlock
- restore purchases on new devices through the parent account

This is a better fit than a paid-upfront app because:

- we still need parent sign-in and cloud sync after install
- free download lowers install friction for families evaluating the app
- store purchase restoration maps naturally to household entitlement sync
- Android and iOS both support one-time unlock products

## Platform Notes

### Apple

Apple's current guidance still treats digital features and access as App Store billing territory for native apps. Apple also states that paid apps and in-app purchases are subject to commission, with a reduced rate available through the App Store Small Business Program.

Implication:

- if Routine Stars is a native App Store app, the safe MVP is App Store monetization
- a one-time non-consumable unlock is the cleanest fit for the product shape
- external purchase links are not a universal escape hatch and add policy complexity

### Google Play

Google Play's current billing docs explicitly support one-time products for digital upgrades and permanent unlocks. Google also documents that digital goods sold through Play are subject to the Play service fee, with 15% available on the first USD 1M for enrolled developers.

Implication:

- Google Play should use a non-consumable one-time product for the household unlock
- any external-offer path should be treated as an advanced follow-on, not the MVP billing path

## Recommended MVP Architecture

1. Parent creates or signs in to a Routine Stars account.
2. App checks household entitlement status from Supabase.
3. If unpaid, parent sees a calm parent-gated purchase screen.
4. Native app launches store purchase flow.
5. App validates the purchase with backend verification.
6. Backend writes a durable household entitlement record.
7. All signed-in devices read the same paid status from Supabase.

## Data Model Additions

Add backend records for:

- `household_entitlements`
- `purchase_events`
- `store_accounts` or purchase-source metadata

Each entitlement should include:

- household id
- platform (`ios` or `android`)
- store product id
- source transaction id / purchase token
- entitlement status
- granted timestamp
- verification timestamp

## Implementation Priorities

1. Finish household sync and daily progress sync.
2. Add a purchase gate in parent flows only.
3. Implement Apple non-consumable purchase flow.
4. Implement Google Play one-time product flow.
5. Add server-side verification and durable entitlement writes.
6. Add restore-purchases flows on both platforms.
7. Add refund and revoked-entitlement handling.

## Explicit Non-Goals For MVP

- Stripe checkout as the primary purchase path inside native apps
- subscriptions
- per-child pricing
- family sharing across multiple paid households
- advanced regional external-offer programs

## Sources

- Apple App Review Guidelines:
  [https://developer.apple.com/app-store/review/guidelines/](https://developer.apple.com/app-store/review/guidelines/)
- Apple App Store Small Business Program:
  [https://developer.apple.com/app-store/small-business-program/](https://developer.apple.com/app-store/small-business-program/)
- Apple membership details and commission summary:
  [https://developer.apple.com/programs/whats-included/](https://developer.apple.com/programs/whats-included/)
- Apple In-App Purchase:
  [https://developer.apple.com/in-app-purchase/](https://developer.apple.com/in-app-purchase/)
- Google Play one-time products:
  [https://developer.android.com/google/play/billing/one-time-products](https://developer.android.com/google/play/billing/one-time-products)
- Google Play service fees:
  [https://support.google.com/googleplay/android-developer/answer/10632485](https://support.google.com/googleplay/android-developer/answer/10632485)
- Google Play service fee overview:
  [https://support.google.com/googleplay/android-developer/answer/112622](https://support.google.com/googleplay/android-developer/answer/112622)
- Google Play external offers:
  [https://developer.android.com/google/play/billing/external](https://developer.android.com/google/play/billing/external)
