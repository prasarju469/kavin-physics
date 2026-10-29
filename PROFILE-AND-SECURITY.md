# Account display names and security

The first approved learner login asks for a display name (2–24 characters). The name button in the header edits it later. A single `users/{email}.learningProfile` field is shared across subjects. Google sign-in and server access rules still identify the account; display names do not grant access and need not be unique.

Profile writes use `{merge:true}` and never write subject payloads or XP/token ledgers. Names are rendered through textContent. A failed save leaves the form open for retry. Sign-out/account change removes the profile editor and button.

The public Firebase web key is restricted to Identity Toolkit, Secure Token and Firestore, and the existing GitHub Pages/Firebase hosts plus local development. It is intentionally visible in browser code. Deployed rules require verified approved accounts, limit learner access to their own record, permit parent reads, and deny whole-document deletion by browser clients. Server administration remains separate. Do not revoke the shared key or replace document contents while editing profiles.

Validation: all four cloud/reward regression suites; nine deployed-rule permission cases; approved-host Auth configuration allowed, unrelated host rejected, anonymous learner read rejected. Fictional-account UI verifies validation, merge-only name save and persistence after refresh. Security changes preserve existing account IDs and storage keys.

Parent course access is a read-only view of the authorized learner’s actual saved progress. Authentication remains the parent’s; the browser reads a detached learner snapshot and never merges parent balances into it or submits learner writes. Learning activity, answers, completions and token spending are blocked in this mode. Student access remains unchanged.
