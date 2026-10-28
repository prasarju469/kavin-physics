# XP policy validation — 28 October 2026

- Legacy XP opening credit is preserved and migration is repeatable without changing it.
- Completed assessments use the shared Editing curve; 1,000 XP equals $2.
- Identical repeats earn zero; 7/10 to 10/10 earns the remaining 60 XP.
- Four-question quizzes cap at 40 XP; 35-question assessments cap at 350 XP.
- Ledger merging preserves independent earnings and best results from concurrent devices.
- Firestore transactions merge only the relevant subject payload and refuse corrupt cloud data.
- Account isolation, offline retry and existing progress checks pass.
- Local browser QA used mock accounts with no Firebase writes. Maths, Physics and Editing displayed their preserved opening balances. Coding quiz awards survived reload; a repeated perfect quiz added no XP. The parent dashboard displayed all four subject balances and their combined earned value.

Run `node check-xp.cjs` in this repository. The source backups are retained locally under the parent workspace's `tmp/xp-alignment-backup/`. Real student records were not used for simulated assessment answers. Existing live balances migrate when the updated application next loads/saves.
