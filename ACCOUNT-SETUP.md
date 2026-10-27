# Google player accounts and teacher reports

Quantum Quest reuses the `quadratics-kavin` Firebase project and Google sign-in provider already configured for the maths course. Google handles passwords. This repository contains only the public Firebase web-app configuration.

## Access

- Sign in using the same approved Google account as the maths game.
- Students enter the game and can read/write their own progress.
- Teachers land on the Teacher Command Centre and can watch student Physics reports. The Preview Game button uses the teacher's own progress, never the student's account.
- The app determines teacher access by testing the existing Firestore collection-read permission. A client-side `role` field is not used to grant teacher access.
- Unapproved users are refused by the existing Firestore rules. This integration does not modify those rules or add public access.
- The same Firebase login is shared across the two courses on `prasarju469.github.io`. Switching Google accounts refreshes the Physics session and loads a separate account cache.

The existing maths deployment already uses `prasarju469.github.io`, so no new production authorised domain is needed. For localhost testing, ensure `localhost` is authorised in Firebase Authentication. The login screen reports an unauthorised-domain error if it is missing.

## Subject isolation

The existing Firestore document is `users/{lowercase-email}`:

```text
data                 Existing maths progress JSON
updated              Existing maths save timestamp
physics.data         Physics progress JSON
physics.updated      Physics save timestamp
physics.schema       1
name, role           Shared display metadata
```

Physics writes only its own `physics` payload and shared display metadata using `set(..., {merge: true})`. The companion maths save has also been changed to merge so it preserves the Physics payload.

**Refresh any maths tabs that were already open before this update.** They may still be running the older whole-document save code until reloaded.

## Saves and recovery

- Physics browser backups use `kavin_physics_v1_{email}`. They are isolated per Google account.
- The original anonymous preview key is retained. When a student with no account progress signs in, the app offers an explicit import of earlier browser progress; it does not silently attach shared-browser progress to an account.
- Cloud and account-local saves are compared on sign-in; the newer `updated` timestamp wins, following the maths app's existing strategy. Two devices actively editing at once use last-save-wins, not collaborative merging. Use one playing device at a time.
- Saves are debounced by one second. Unsent data remains in the account's browser cache and is retried when connectivity returns. The account bar shows queued, saving, saved or retry-needed states.
- Sign-out attempts to flush pending saves first. If a network error prevents this, the local account cache remains available on the next sign-in.
- Localhost and GitHub Pages have separate browser storage. Signed-in cloud progress can follow the same approved account across both addresses.

## Teacher reports

Reports subscribe to Firestore changes while the dashboard is open. They show world crystals, experiment completion, independent skill counts, first-try versus assisted answers, memory seals, boss status, supported skills, recent challenges and the last Physics cloud-save time. A student may appear as “Physics quest not started” if they have only played maths.

## Verification

`node check-cloud.cjs` uses fictional accounts and an in-memory Firestore to check approved/denied roles, account-bound writes, recovery/retries, payload snapshots and teacher report mapping. If the maths checkout is alongside this repository, it also executes that app's actual save writer to verify that each subject preserves the other.

The production Firebase login screen and teacher dashboard layout have been checked separately; the dashboard layout check used fictional data. A complete real-account sign-in/save/report round trip requires the approved student and teacher to sign in.
