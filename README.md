# Quantum Quest: Kavin's Physics Adventure

A local-first, buildless Sec 3 Physics platform adventure for Chapter 1: Physical Quantities, Units and Measurements.

## Run locally

From this folder:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://localhost:8766. Use the same browser and address to retain progress. No packages, build step, API keys or sign-in are needed. Game art and lessons are local; optional embedded YouTube videos need internet access. Progress uses the separate `kavin_physics_v1` local-storage key and does not modify the quadratics game. Existing local progress is preserved by the arcade upgrade.

## Play the quest

- Click the world map to focus it. Arrow keys or A/D move; Space jumps; E enters the nearest world. Touch controls and direct portal links are also available.
- Choose a cyan, pink or lime astronaut suit on the home screen.
- Each world follows Mission -> Learn + watch -> Understand + try -> Prove + capture.
- Completing a new experiment earns 60 XP. Demonstrating a new skill independently earns 25 XP, once. Each captured world crystal earns 150 XP, once.
- Every 250 XP advances a player level. Replaying completed skills does not farm XP.
- Capture a world crystal by completing its experiment and independently demonstrating its five skills. Captures have a reward screen and appear on the trophy shelf.
- Memory quests unlock after capture, at approximately days 1, 3 and 7. Passing with at least four of five independent answers earns a one-time 100 XP seal at each stage. A missed review moves the next attempt to the following day. Replays cannot advance the schedule early.
- Seven captured crystals unlock the Glitch Engine: a 14-question boss challenge, two questions per world. At least 12 independent answers in a fully completed run wins a one-time 300 XP reward.
- Guided video recap questions support learning and do not award mastery or XP.

## Included

- Seven stations with briefing, original lesson notes, worked examples, an interactive experiment and generated independent checks.
- SI quantities and units, prefixes and standard form, dimensional conversions, instrument selection, scales and parallax, pendulum timing, scalars and parallel vectors.
- Original SVG apparatus, keyboard/touch controls, pause/step animation and reduced-motion support.
- Targeted fresh questions for skills not yet independently demonstrated.
- Saved in-progress questions, first-try versus assisted tracking, a local parent journal and progress JSON export.
- A ten-question mixed quick check, untimed or timed for ten minutes.
- Seven original pixel-art platform worlds, player movement, suit colours, skill gems, crystal captures, levels, boss battle and scheduled memory seals.
- Seven topic-matched concept videos and a bonus pendulum-wave YouTube Short, with creator attribution, click-to-load players and direct link fallbacks.

A station is certified when its experiment is complete and all five skills have been demonstrated on a fresh question, first try, without a hint. This can happen across several checks. First-try stats retain earlier mistakes.

## Local edition limits

No cloud accounts or cross-device sync yet. The quick check and boss battle do not replace the proposed full structured mock paper. Free-text explanations are taught through notes and structured questions rather than automatically graded. The pendulum animation is a teaching model, not a reaction-time measurement tool. Videos were selected using creator titles/descriptions and topic fit; a full viewing review is still pending. One embedded pendulum player was verified to load and expose playback controls; availability of other embeds may vary. Memory quests are in-app dates, with no external reminders or notifications.

## GitHub Pages

Repository: https://github.com/prasarju469/kavin-physics

Game URL: https://prasarju469.github.io/kavin-physics/

GitHub Pages serves the root of `main`, matching the maths game’s deployment setup. All links and script paths are relative, and routing uses URL hashes so direct world links work under the repository path. Push updates to `main` to trigger a Pages rebuild. The textbook PDF and local progress exports are excluded.

Progress is saved per browser and site address. Localhost progress does not automatically transfer to the published site.

## Files

- `content.js`: chapter-aligned lessons and rulebook content.
- `questions.js`: 35 parameterised question templates and generation helpers.
- `widgets.js`: interactive lab experiments and shared instrument diagrams.
- `app.js`: routing, assessment sessions, progress and local journal.
- `style.css`: responsive visual design.
- `arcade.css`: pixel-platform art direction and game layouts.
- `game.js`: one-time rewards, player ranks, recall scheduling, sprite art and platform movement.
- `videos.js`: creator-attributed videos and guided concept recap cards.

## Check the question bank

```sh
node check-content.cjs
node check-game.cjs
```

This validates 1,400 generated questions across 35 skills, including dimensional factors, standard-form reconstruction, elapsed time, diagram bounds, distinct choices and topic coverage. Browser checks also covered all seven experiments, an entire station check plus targeted retry and certification, saved answers after reload, timed-mode resume, and the journal's first-try/assisted counts.

The game checks cover non-duplicated crystal/XP rewards, migration, level calculation, early and failed recall attempts, the full 1/3/7-day memory schedule, player jumping, platform collision, world boundaries and video mappings. Arcade browser checks covered a complete world capture, XP increases, a level-up, the reward dialog, preserved earlier progress, scheduled memory quests, boss gating, and a video recap without XP.

Original exercises and diagrams are informed by the supplied chapter. The game does not reproduce textbook pages.
