# Physics

A local-first, buildless Sec 3 Physics course for Chapter 1: Physical Quantities, Units and Measurements.

## Run locally

From this folder:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://localhost:8766. Use the same browser and address to retain progress. No packages or build step are needed. Sign in with the same approved Google account as the maths game. Firebase Authentication manages login, and Firestore syncs progress to the player account. Game art and lessons are local; sign-in, cloud saves and optional YouTube videos need internet access. Physics uses a separate subject payload and account-specific browser cache. See [account setup and recovery](ACCOUNT-SETUP.md).

## Learn the chapter

Seven topics follow the chapter: quantities and units, prefixes, conversions, instruments, readings and measurements, pendulums, and vectors.

Each topic follows Learn → Worked examples → Practice → Topic check. Guided examples save unfinished answers. Practice permits hints and retries. The independent check requires ten correct answers without hints; an error ends the run, explains the correction and requires a fresh attempt. Completing the worked steps and check unlocks the next topic. Previously started topics remain accessible.

After all seven topics, the chapter check samples all 35 skill families. Scheduled recall supports later revision. Optional experiments and videos supplement the teaching. Explanation and drawing prompts should also be attempted on paper; the app does not automatically grade these.

XP and subject-specific gaming tokens use the existing reward policy. Old balances, reward IDs, qualifications, experiment completions and saved sessions are preserved. Repeating assessments only rewards improvements. Existing experiment completion satisfies the supporting-work requirement; new learners complete the guided worked steps.

Parent and student views share the course interface; parent analytics remain in the separate dashboard.

## Verify

Run `node check-course.cjs`, `node check-content.cjs`, `node check-mastery.cjs`, `node check-game.cjs`, `node check-cloud.cjs`, `node check-xp.cjs`, and `node check-tokens.cjs`.

## GitHub Pages

Repository: https://github.com/prasarju469/kavin-physics

Game URL: https://prasarju469.github.io/kavin-physics/

GitHub Pages serves the root of `main`, matching the maths game’s deployment setup. All links and script paths are relative, and routing uses URL hashes so direct world links work under the repository path. Push updates to `main` to trigger a Pages rebuild. The textbook PDF and local progress exports are excluded.

Each approved Google account has its own cloud progress and browser backup. Earlier anonymous progress can be explicitly imported when starting a new student account. Localhost anonymous progress does not automatically transfer to GitHub Pages.

## Files

- `content.js`: chapter-aligned lessons and rulebook content.
- `questions.js`: 35 parameterised question templates and generation helpers.
- `widgets.js`: interactive lab experiments and shared instrument diagrams.
- `app.js`: routing, assessment sessions, progress and local journal.
- `style.css`: responsive visual design.
- `arcade.css`: pixel-platform art direction and game layouts.
- `game.js`: one-time rewards, player ranks, recall scheduling, sprite art and platform movement.
- `videos.js`: creator-attributed videos and guided concept recap cards.
- `firebase-config.js` and `cloud.js`: Google account login, isolated subject saves and teacher subscriptions.

## Check the question bank

```sh
node check-content.cjs
node check-game.cjs
node check-cloud.cjs
```

This validates 1,400 generated questions across 35 skills, including dimensional factors, standard-form reconstruction, elapsed time, diagram bounds, distinct choices and topic coverage. Earlier browser checks (before the strict mastery redesign) also covered all seven experiments, an entire station check plus targeted retry and certification, saved answers after reload, timed-mode resume, and the journal's first-try/assisted counts.

The game checks cover non-duplicated crystal/XP rewards, migration, level calculation, early and failed recall attempts, the full 1/3/7/14/30-day memory schedule, player jumping, platform collision, world boundaries and video mappings. Earlier arcade browser checks covered a complete world capture, XP increases, a level-up, the reward dialog, preserved earlier progress, scheduled memory quests, boss gating, and a video recap without XP.

Original exercises and diagrams are informed by the supplied chapter. The game does not reproduce textbook pages.

## Strict mastery update

See [CURRICULUM.md](CURRICULUM.md) for source mapping, ten-in-a-row qualification, one-error resets, 35/35 boss, 30-day retention and migration rules. Practice XP is separate from qualification and retained mastery. Run `node check-mastery.cjs` for the new gate and recall tests.

## Shared XP policy — 28 October 2026

1,000 XP = $2. Existing balances become a preserved opening credit. New completed assessments use the Editing score curve, scaled by question count; retries pay only improvements under a stable content ID. Hints and corrections do not deduct XP. Completion badges and guided training do not add cash bonuses. Cloud transactions merge XP ledgers so stale saves do not lower the balance. Arcade tokens remain separate. See XP-POLICY.md. Run `node check-xp.cjs` for reward and migration checks.

## Subject gaming tokens

Maze Chase, Snake, Block Breaker and Tetris reuse Editing’s game engines. Each subject has its own wallet: one token per earned XP, including a one-time matching credit for preserved XP. Games cost 80 tokens per minute (750 ms per token), charged only during active play; pausing, leaving the tab and returning to learning stop play. XP is never deducted. Saved balances do not expire. No XP or token transfers between subjects.

The `gameTokens` field is separate from Physics’s existing `arcade` learning progress. Per-session spending counters merge with cloud saves without refunding stale spending; browser locks prevent simultaneous play in two tabs of the same subject/account. Parent testing uses a separate fictional balance. Run `node check-tokens.cjs` for credit, isolation, spending, reload and merge checks. Existing Editing balances and its arcade are unchanged.

## Common Editing presentation

All four subjects use `learning-shell.css` and `learning-shell.js`: Editing’s paper palette, local fonts, independent XP/completion/token cards, header account actions, navigation tabs, buttons, surfaces and responsive rules. The tower climb, physics realms, maths map and Coding runner remain subject-specific. Existing XP, token and completion records are unchanged. Canonical shell sources live in `../shared-learning/shell`; run its `sync.py` after changing the shared CSS or JS to keep the four checkouts aligned.
