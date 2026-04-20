# Paid Launch Roadmap

As of April 20, 2026, Routine Stars is a strong local shared-device routine app with a partial account foundation. The work below prioritizes getting it into a trustworthy first paid release.

## Launch Goal

Ship a first paid version where:

- a parent can buy access outside the app
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

### 3. Add billing outside the app for a one-time 9.99 EUR purchase

Recommended MVP direction:

- use Stripe-hosted checkout outside the app
- start with Stripe Payment Links for the lowest-friction external checkout
- use webhook fulfillment to grant a household entitlement after payment

Why this direction:

- Payment Links provide a hosted payment page with very low integration effort
- Stripe Checkout and Payment Links both support hosted one-time payments
- Stripe recommends webhook-based fulfillment so purchase access is granted reliably

Operational recommendations:

- sell one household lifetime unlock
- price it at 9.99 EUR
- treat it as B2C pricing and set tax behavior intentionally for EU markets
- define refund handling before launch

Related issues:

- #19 Add billing architecture for external one-time purchase at €9.99
- #20 Grant paid household access from billing entitlement and webhook fulfillment

Useful references:

- https://docs.stripe.com/payment-links
- https://docs.stripe.com/payments/checkout/how-checkout-works
- https://docs.stripe.com/checkout/fulfillment
- https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior

### 4. Tie access to a durable paid entitlement

Selling the app is not just taking payment. We need a backend entitlement record that says whether the household has access.

Includes:

- add purchase and entitlement records in Supabase
- receive Stripe webhook events
- make fulfillment idempotent
- expose paid vs unpaid state in app bootstrap and parent settings
- route unpaid households to the external purchase page

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
7. external billing setup
8. entitlement fulfillment and purchase gating
9. launch operations and QA

## Product Decisions Assumed For Now

Unless we decide otherwise later, this roadmap assumes:

- one parent account owns one household
- purchase is one-time, not subscription
- purchase unlock is per household, not per child
- child use stays password-free on shared devices
- billing lives outside the app
