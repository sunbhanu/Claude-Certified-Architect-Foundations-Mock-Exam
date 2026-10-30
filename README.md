# Claude Certified Architect – Foundations: Mock Exam

A fully offline, static, proctored-style mock exam site (plain HTML/CSS/JS, no build, no network).

## Run

- Double-click `index.html` (works over `file://`).
- Optional: `python -m http.server`, then open `http://localhost:8000`.

## Features

- Dashboard with 10 paper cards (best score, attempts, last result), Start/Resume, candidate name, **Exam** vs **Practice** mode, Reset history.
- Instructions / NDA screen, then the exam screen with countdown timer (amber < 15 min, red < 5 min), progress bar, collapsible scenario panel, single/multiple-response items, flag for review, keyboard shortcuts (A–E, N/→, P/←, F).
- Practice mode: untimed, explanation revealed after each answer.
- Review/Navigator grid (answered / unanswered / flagged) with filters and an end-exam confirmation.
- Auto-submit when the timer hits zero.
- Results: PASS/FAIL, scaled score (cut line at 720), raw score, per-domain bars, per-scenario breakdown, time used, filterable answer review, print-friendly layout.
- Persistence in `localStorage` (keys prefixed `ccarf.v1.`): in-progress state uses an absolute deadline so resume is accurate after closing the tab.

## Exam format

60 items, 120 minutes, 4 scenarios (15 questions each) from a bank of 6, multiple-choice and multiple-response items, scaled score 100–1000, pass = 720 (no partial credit on multiple-response). Details: `docs/SPEC.md`.

## Content

- 10 papers × 60 = **600 original scenario-based questions** written against the official exam guide (`docs/official-exam-guide.pdf`, v1.0, exam code CCAR-F), covering every task statement 1.1–5.6.
- Each paper uses 4 of the 6 official scenarios (all 6 rotate across the papers), with domain mix close to the blueprint (D1 27%, D2 18%, D3 20%, D4 20%, D5 15%).
- ~10–12 multiple-response items per paper ("Select TWO/THREE"), the rest single-answer.
- Every item has an explanation covering why the answer is right and why each distractor is wrong; answers are balanced across letters and option lengths (no "longest answer wins" giveaway).
- Scaled score is an approximation (72% raw ≈ 720 scaled); the real exam uses psychometric equating.

| Paper | Scenarios | Emphasis |
|---|---|---|
| 1 | 1, 2, 3, 5 | Foundational / first-step decisions |
| 2 | 1, 3, 4, 6 | Hooks, enforcement, structured MCP errors |
| 3 | 2, 4, 5, 6 | Claude Code configuration & CI |
| 4 | 1, 2, 4, 6 | Context management & sessions |
| 5 | 1, 3, 5, 6 | Batch processing, validation, provenance |
| 6 | 2, 3, 4, 5 | Tool distribution & orchestration design |
| 7 | 1, 2, 3, 6 | Troubleshooting / root cause |
| 8 | 1, 4, 5, 6 | Reliability & human-in-the-loop |
| 9 | 2, 3, 5, 6 | Prompt engineering depth |
| 10 | 1, 3, 4, 5 | Mixed, hardest – tradeoff judgment |

Scenarios: 1 Customer Support Resolution Agent · 2 Code Generation with Claude Code · 3 Multi-Agent Research System · 4 Developer Productivity with Claude · 5 Claude Code for CI · 6 Structured Data Extraction.

## Layout

```
index.html   entry point
css/         styles.css
js/          app.js
data/        paper01.js … paper10.js (exam content)
docs/        SPEC.md, official-exam-guide.pdf/.txt
tools/       validate.js
```

## Validating content

`node tools/validate.js` checks every `data/paper*.js` file (structure, counts, type/select consistency, answer-letter and length-bias stats). Add `--relaxed` to skip the 4×15 count checks for small test files.

The authoritative data format is `docs/SPEC.md`.
