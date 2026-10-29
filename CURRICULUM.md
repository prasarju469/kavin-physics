# Chapter 1: mastery contract and curriculum map

Updated 27 October 2026. The supplied S3 chapter is the teaching baseline, not the boundary of practice.

## Source basis

- Supplied chapter: Physical Quantities, Units and Measurements (14 pages).
- SEAB 2027 G3 Physics K323, page 10, outcomes 1(a–g): https://isomer-user-content.by.gov.sg/334/93155982-3ccb-48e8-9b2b-c058aa5e291b/K323_y27_sy.pdf
- SEAB official subject listing (K323 replaces reference code 6091): https://www.seab.gov.sg/secondary-education-certificate-sec/g3-syllabuses-for-school-candidates-2027/
- K323 assessment objectives, pages 5–6: recall/explanation, numerical and graphical translation, unfamiliar applications, experimental selection and evaluation.

This is a syllabus-aligned expansion, NOT a statistical claim about frequently examined topics. A representative past-paper frequency audit has not been performed. A publicly hosted copy of Bedok Green Secondary’s 2024 Combined Physics prelim was inspected as a limited question-style sample: Paper 1 Q1–3 cover scalar characteristics, thin-wire instrument selection and Earth/atom scales; Paper 2 Q1 links displacement measurement and density. This supports those practice styles, not a frequency claim or equivalence between Combined and Pure papers. Source: https://studykaki.com/wp-content/uploads/2021/03/Bedok-Green-Secondary-Combined-Physics-Prelim-2024.pdf All questions are original; no examination questions or textbook scans are reproduced. The 2027 syllabus is a current reference, not a claim about Kavin's eventual examination year.

## Coverage and extensions

| Topic | Foundation | Application / misconception extension | Source relationship |
|---|---|---|---|
| Units | Magnitude, SI base quantities, quantity vs unit, derived units | Derive acceleration, force and pressure units from supplied formulae; special names do not imply base units | 1(a,b), mathematical application; luminous intensity is SI enrichment beyond the six base quantities listed |
| Prefixes | Conversion and standard form | Full n, µ, m, c, d, k, M, G, T prefix set; atom/paper/human/classroom/Earth scale anchors; changed unit changes numerical magnitude | 1(c,d) |
| Dimensions | Squared/cubed conversion, density, time | Multi-step area/volume, displacement density, mixed minutes/seconds, diagnose linear factor used on area | Chapter consolidation and mathematical application; density previews later content |
| Instruments | Selection, range, resolution, precision/accuracy | Range vs resolution trade-off, displaced volume, stacked-sheet method, averaging cannot remove bias | 1(e), experimental objectives |
| Reading | Ruler offset, scale, meniscus, parallax | Positive zero correction, non-zero scales, marks vs intervals, displaced volume, mirrored pointer | 1(e), experimental objectives |
| Pendulum | Full cycle, period, reaction time, pendulum length | Predict duration, same-direction vs either-direction crossings, off-by-one intervals | Supplied chapter / experimental measurement extension |
| Vectors | Scalar/vector, parallel resultants, scale | Return-to-start displacement, unknown force, equal non-opposite vectors, head-to-tail construction and oblique resultant | 1(f,g) |

70 question templates: 35 foundation and 35 transfer/misconception templates. Numerical templates regenerate values; conceptual checks recur with shuffled options. This is not an infinite bank of unique conceptual questions. Vector scale applications include a head-to-tail grid drawing with magnitude and angle answers (small explicit measurement tolerances); the lesson teaches construction. Freehand drawing input and free-response explanation grading remain future extensions.

## Qualification and retention

- Learning: notes, worked examples, guided steps, optional videos and experiments. Practice permits hints and retries; lifetime practice skills never certify a topic.
- Each topic qualification run: ten questions, one foundation and one application per family, shuffled. Every answer must be correct first time with no hint. One wrong answer or hint ends the run immediately, displays the correction and persists the reset across refresh. The learner explicitly starts a newly generated run from question one.
- A completed flawless run qualifies the topic. Its completed guided steps (or preserved legacy experiment completion) are also required to unlock the next topic. Qualification is kept separate from retained mastery.
- Recall: ten-question flawless runs, scheduled at approximately days 1, 3, 7, 14 and 30 when completed on time. Intervals between successful recalls are 2, 4, 7 and 16 days; late completion shifts the later schedule. Early practice cannot earn seals.
- A due recall error restarts the retention ladder and schedules another attempt for the following day. Historical qualification, learning and error records remain. Seal XP uses the highest awarded stage so recovery cannot farm XP.
- Chapter check: one application from each of all 35 skill families, shuffled, 35/35 without hints. One error ends the entire chapter-check run. No compulsory speed pressure.
- Teacher evidence: topic status, best qualification streak, resets, recall stage, lapses, next due time, first-try statistics, recurring missed skills and recent reset runs.

## Existing account saves

One-time idempotent migration archives old skills/arcade badges in `mastery.legacy`, keeps notes, experiments, statistics and history, and clears obsolete in-flight sessions. Old pass-once skills cannot satisfy the new gates. New rules use `mastery.version = 2`; the cloud document format and account permissions are unchanged.

## Verification

Run `node check-content.cjs`, `node check-mastery.cjs`, `node check-game.cjs`, `node check-cloud.cjs`. Browser QA uses a separate local mock account server; no fabricated student evidence is uploaded to Firebase.
