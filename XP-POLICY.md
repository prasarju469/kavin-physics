# Common XP policy

Effective for new assessment earnings after migration. 1,000 XP = $2 (500 XP = $1).

For 0 through 10 independent correct answers, a ten-question assessment has a cumulative entitlement of 0, 2, 4, 6, 8, 15, 25, 40, 60, 80 or 100 XP. Other fixed question counts scale proportionally; the score band rounds down. A four-question quiz can earn at most 40 XP; a 35-question assessment at most 350 XP.

Every assessment has a stable content ID. A retry pays only the increase over its best previous entitlement. Refreshes, regenerated values and retries do not create new paid IDs. Hint use and incorrect first submissions make that question assisted for that attempt. Corrections support learning but do not change its independent score. A completed assessment is required; simply ticking completion, watching a video, capturing a badge or passing a previously rewarded challenge does not add a bonus. No XP deductions.

Maths pays for completed named drills and mock papers; guided examples, widgets and open-ended training do not pay. Physics topic training and qualification share one reward ID per topic; mixed practice and the boss each have one ID. Each of five scheduled recall stages has a fixed ID, only eligible when due and passed. Retrying a reset recall ladder does not pay for the same stage again. Coding pays for module, section and final quizzes, not self-reported project completion. Editing keeps its existing practice IDs and reward curve. Existing games and mastery gates remain subject-specific.

## Preservation

On first load, each subject captures the previous XP balance as an immutable opening credit. Existing per-assessment records seed baseline entitlements so old work is not paid again. Original progress and old XP metadata remain in the save. Re-running migration does not award or remove XP. Ledger merges preserve the higher balance and the best entitlement per stable ID. Cloud writes use Firestore transactions and merge only the subject payload, preserving the other subjects. Resetting learning progress retains the monetary XP ledger.

Editing arcade tokens remain separate. Spending tokens cannot reduce earned XP or its dollar equivalent. This is an earned-value display; no cash redemption or payment is performed.

The canonical engine is `kavin-coding/shared-learning/shared-rewards.js`; identical copies ship with each standalone app. Run `node check-xp.cjs` in each repository. From the Coding repository, `python3 shared-learning/sync.py --workspace ..` checks that sibling apps ship the same engine.
