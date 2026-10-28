# Subject arcade verification — 28 October 2026

The same Maze Chase, Snake, Block Breaker and Tetris engines are copied from Editing. Existing Editing files and saved balances were not modified.

- Automated wallet checks: one-time matching XP credit, incremental new credit, spending leaves XP unchanged, independent subjects, stale saves, concurrent spending merges, pause/reload, exact zero cutoff, crash recovery. Subject reward-policy/cloud merges retain both XP and token debits.
- Local browser fixtures used fictional 100 XP per subject and disabled Firebase. Coding spent to 77.73 tokens; after pause and reload it retained 77.73, while Maths and Physics each remained at 100.
- Visually reviewed Coding Maze Chase, Maths Snake, Physics Block Breaker and Coding Tetris. Phone width 390px retains a scrollable board and direction controls. Back to learning remains accessible at the top.
- Parent cannot spend the earned balance. Fictional test credit runs out at zero and stops Play; exiting test mode restores the unchanged earned balance.

XP and tokens are subject-local. The client and existing Firebase account rules handle persistence; this change does not add server-side assessment validation or anti-cheat authority.

## Layout alignment

Tokens now have an independent yellow header card and Games appears in the subject navigation. The arcade renders inline in the learning area, using locally bundled Editing fonts, paper colour, ink borders, shadows, and active states. Coding's XP and exercise count have separate cards. Reviewed Coding at desktop and 390px, Physics desktop, lesson-to-Games switching and return, and retained token balances.

Shared shell verification: compared all four subjects at desktop and 390px phone width using isolated fixtures with fictional progress and Firebase disabled. Reviewed Maths rules and Physics lessons for contrast, checked Editing set switching and tower flow, and checked Coding lesson-to-Games navigation. Shared CSS/JS are byte-identical across all four repositories. Subject reward, token, content and cloud checks pass.

Horizontal-tab acceptance review: the common strip now scrolls horizontally at every width, with reversible arrow controls shown only on overflow, plus keyboard Left/Right/Home/End. Browser checks covered 1280px desktop and 390px phone layouts; Maths also fitted at 320px and scrolled under a 260px stress width. Physics's legacy mobile `order` rule was caught visually and overridden so the arrows flank the strip.

Disposable browser flows: Editing correct answer advanced the tower one step; Physics wrong/correct density feedback and experiment completion worked; Maths wrong/correct P/S prediction cleared one task; Code Run wrong/correct module responses earned 16 new XP and triggered the runner finish pose. Maze Chase, Block Breaker, Snake and Tetris play/pause were exercised, with Tetris hard drop scoring 36. Each app retained its XP while gaming. No Firebase writes or real learner balance changes were made during these tests.

Metric-card alignment: XP, completion and token cards share a measured 40px height, 9px corners, ink borders/shadows, and the same Editing palette in all four apps. Removed redundant visible captions (earned/practices/exercises/levels/crystals); accessible card names remain. Verified all 24 card measurements at 1280px and 390px and reviewed captured phone layouts side by side. No reward, progress or cloud-save logic changed.
