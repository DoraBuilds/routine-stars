# Paid Launch Roadmap

As of April 20, 2026, Routine Stars is a strong local shared-device routine app with a partial account foundation. The work below prioritizes getting it into a trustworthy first paid release.

## Launch Goal

Ship a first paid version where:

- a parent can buy access in a store-compliant way for native apps
- a parent can create or sign in to an account
- the household data follows them to a second device
- existing local-only families can move forward safely
- children still get the same simple tap-and-go experience on shared devices

## Current State

Working today:

- local shared-device setup and routine flows
- parent auth shell
- first-run household bootstrap in Supabase
- auth-aware new-device entry screen

Not finished yet:

- cloud-backed child profile and routine hydration
- local-to-cloud import
- cloud-backed daily progress sync
- purchase entitlement model
- post-payment fulfillment
- release operations for a paid launch

## Priority Order

### 1. Finish cloud household configuration sync

This is the highest priority because the product promise breaks without it. Parents must be able to sign in on a second device and see the same children, schedules, and routines.

Includes:

- complete Supabase repositories for child profiles, routines, and progress
- hydrate app bootstrap from cloud household data
- persist parent changes back to Supabase
- keep a local offline cache without making it the source of truth

Related issues:

- #13 Create household data schema, RLS, and sync repositories
- #16 Make app bootstrap auth-aware without blocking existing shared-device families

### 2. Ship a safe import path for existing local families

This protects early users and prevents silent data loss.

Includes:

- detect existing local setup after sign-in
- offer `Import this family setup` or `Start fresh instead`
- preserve incomplete setup safely
- keep local data until cloud import succeeds

Related issues:

- #14 Build local-to-cloud import and offline cache strategy
- #17 Add post-login import-or-start-fresh decision for existing local family data

### 3. Add native-first billing for a one-time 9.99 EUR household unlock

Recommended MVP direction:

- use a non-consumable one-time unlock on Apple
- use a non-consumable one-time product on Google Play
- map store purchases to a backend household entitlement

Why this direction:

- Routine Stars is planning a native-first launch
- digital app access in native store apps still falls under store billing rules
- a household lifetime unlock matches the product and avoids subscription complexity

Operational recommendations:

- ship as a free download with a one-time `EUR 9.99` parent unlock
- restore purchases across devices through the parent account
- keep the purchase gate parent-only
- define refund and revoked-entitlement handling before launch

Related issues:

- #19 Add billing architecture for external one-time purchase at €9.99
- #20 Grant paid household access from billing entitlement and webhook fulfillment

Decision doc:

- `docs/native-billing-architecture.md`

### 4. Tie access to a durable paid entitlement

Selling the app is not just taking payment. We need a backend entitlement record that says whether the household has access.

Includes:

- add purchase and entitlement records in Supabase
- receive store verification events or backend verification results
- make fulfillment idempotent
- expose paid vs unpaid state in app bootstrap and parent settings
- route unpaid households to a parent-gated purchase flow

Related issue:

- #20 Grant paid household access from billing entitlement and webhook fulfillment

### 5. Hardening for first paid launch

This is the release-quality layer that makes the product feel trustworthy.

Includes:

- real-device QA across phone and tablet
- support and refund contact path
- privacy policy and terms review
- funnel analytics for purchase and onboarding
- release checklist for keys, webhooks, redirects, and rollback steps

Related issues:

- #3 Run family-pilot real-device QA on phone and tablet
- #21 Prepare first paid launch operations: QA, support, legal copy, and analytics

## Small-PR Build Sequence

To keep pull requests reviewable, build in this order:

1. auth-aware entry and bootstrap
2. cloud repositories for child profiles and routines
3. bootstrap hydration from cloud household config
4. import/start-fresh decision UI
5. local-to-cloud import implementation
6. progress sync and daily reset rules
7. native billing setup
8. entitlement fulfillment and purchase gating
9. launch operations and QA

## Product Decisions Assumed For Now

Unless we decide otherwise later, this roadmap assumes:

- one parent account owns one household
- purchase is one-time, not subscription
- purchase unlock is per household, not per child
- child use stays password-free on shared devices
- native apps use store-compliant billing for digital access
