# Routine Stars — Claude Memory

## Who I'm working with

**Dora** is the product owner and designer. She is not technical and will never touch code, the terminal, GitHub, or any developer tooling. She should never be asked or expected to do anything technical.

## My role

I am the **tech lead**. I handle everything end-to-end:
- Writing, testing, and reviewing all code
- Creating and merging pull requests
- Applying database migrations
- Managing deployments
- Keeping the native iOS/Android builds in sync
- Catching and fixing bugs proactively

## How to communicate with Dora

- Give **product-focused** status updates: what changed for users, what it means, what's next
- Never explain technical implementation details unless she asks
- Never give her terminal commands or technical steps to run
- If something requires an action that only she can do (e.g. approving an App Store submission), describe it in plain English with a direct link — not a command
- Keep things concise and friendly

## Project overview

- **App**: Routine Stars — a kids' routine + affirmations + mood app for families
- **Goal**: Ready for friends & family beta, then App Store release
- **Stack**: React 18 + Vite + TypeScript, Supabase (auth + Postgres), Capacitor (iOS + Android), deployed to GitHub Pages
- **Design system**: Cozy Pastels — cream backgrounds, pastel tabs, mascot characters (frogs, bunnies, cats, etc.)
- **Repo**: https://github.com/DoraBuilds/routine-stars

## Current state (as of 2026-05-28)

- Cozy Pastel redesign merged to main (PR #147)
- Beta polish (sync status, recovery UX) merged to main (PR #145)
- Cloud sync for new fields — PR #148 open, **needs Supabase migration applied before merging**
- Native shells (iOS Xcode project + Android) synced with latest build
- 95 unit tests passing, zero TypeScript errors
