# Subject arcade verification — 28 October 2026

The same Maze Chase, Snake, Block Breaker and Tetris engines are copied from Editing. Existing Editing files and saved balances were not modified.

- Automated wallet checks: one-time matching XP credit, incremental new credit, spending leaves XP unchanged, independent subjects, stale saves, concurrent spending merges, pause/reload, exact zero cutoff, crash recovery. Subject reward-policy/cloud merges retain both XP and token debits.
- Local browser fixtures used fictional 100 XP per subject and disabled Firebase. Coding spent to 77.73 tokens; after pause and reload it retained 77.73, while Maths and Physics each remained at 100.
- Visually reviewed Coding Maze Chase, Maths Snake, Physics Block Breaker and Coding Tetris. Phone width 390px retains a scrollable board and direction controls. Back to learning remains accessible at the top.
- Parent cannot spend the earned balance. Fictional test credit runs out at zero and stops Play; exiting test mode restores the unchanged earned balance.

XP and tokens are subject-local. The client and existing Firebase account rules handle persistence; this change does not add server-side assessment validation or anti-cheat authority.
