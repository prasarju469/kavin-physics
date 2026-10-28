# Quantum Quest: Kavin's Physics Adventure

A local-first, buildless Sec 3 Physics platform adventure for Chapter 1: Physical Quantities, Units and Measurements.

## Run locally

From this folder:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://localhost:8766. Use the same browser and address to retain progress. No packages or build step are needed. Sign in with the same approved Google account as the maths game. Firebase Authentication manages login, and Firestore syncs progress to the player account. Game art and lessons are local; sign-in, cloud saves and optional YouTube videos need internet access. Physics uses a separate subject payload and account-specific browser cache. See [account setup and recovery](ACCOUNT-SETUP.md).

## Play the quest

- Click the world map to focus it. Arrow keys or A/D move; Space jumps; E enters the nearest world. Touch controls and direct portal links are also available.
- Choose a cyan, pink or lime astronaut suit on the home screen.
- Each world follows Mission -> Learn + watch -> Understand + try -> Prove + capture.
- Experiments, skills and crystals record learning progress. New cash XP comes from completed assessments under the shared policy; old milestone XP is preserved.
- Every 250 XP advances a player level. Replaying completed skills does not farm XP.
- Capture a world crystal by completing its experiment and a flawless ten-question qualification run. Captures have a reward screen and appear on the trophy shelf.
- Memory quests unlock after capture, at approximately days 1, 3, 7, 14 and 30. Passing with ten of ten independent answers earns a one-time 100 XP seal at each stage. A recall error restarts the ladder with the next attempt on the following day. Replays cannot advance the schedule early.
- Seven captured crystals unlock the Glitch Engine: a 35-question boss challenge, one application per skill family. The completed 35-question assessment follows the shared score curve, worth up to 350 XP; there is no extra boss cash bonus.
- Guided video recap questions support learning and do not award mastery or XP.

## Included

- Seven stations with briefing, original lesson notes, worked examples, an interactive experiment and generated independent checks.
- SI quantities and units, prefixes and standard form, dimensional conversions, instrument selection, scales and parallax, pendulum timing, scalars and parallel vectors.
- Original SVG apparatus, keyboard/touch controls, pause/step animation and reduced-motion support.
- Topic practice with hints, alongside strict qualification runs.
- Saved in-progress questions, first-try versus assisted tracking, a personal journal and progress JSON export.
- Google player accounts, cross-device Physics saves, and a live teacher dashboard using the maths Firebase project and its existing access rules.
- A ten-question mixed quick check, untimed or timed for ten minutes.
- Seven original pixel-art platform worlds, player movement, suit colours, skill gems, crystal captures, levels, boss battle and scheduled memory seals.
- Seven topic-matched concept videos and a bonus pendulum-wave YouTube Short, with creator attribution, click-to-load players and direct link fallbacks.

A station is qualified through a single 10/10 clean run; its experiment is also required for a crystal. One error or hint resets the run. First-try stats retain earlier mistakes.

## Current limits

The quick check and boss battle do not replace the proposed full structured mock paper. Free-text explanations are taught through notes and structured questions rather than automatically graded. The pendulum animation is a teaching model, not a reaction-time measurement tool. Videos were selected using creator titles/descriptions and topic fit; a full viewing review is still pending. One embedded pendulum player was verified to load and expose playback controls; availability of other embeds may vary. Memory quests are in-app dates, with no external reminders or notifications.

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
