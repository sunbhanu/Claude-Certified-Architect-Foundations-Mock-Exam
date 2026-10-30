# Mock Exam Spec – Claude Certified Architect – Foundations (CCAR-F)

Source of truth for content: `docs/official-exam-guide.txt` (official Anthropic exam guide v1.0).

## Real exam format (replicate exactly)
- 60 items, 120 minutes, closed book.
- 4 scenarios per exam, drawn from a bank of 6. Each scenario frames 15 questions.
- Item types: multiple-choice (select 1 of 4, A–D) and multiple-response (e.g. "Select TWO" from 5 options A–E). Each item states how many responses to select.
- Scaled score 100–1000, pass = 720. Score report: pass/fail + scaled score + % correct per domain.
- Domain weights: D1 Agentic Architecture & Orchestration 27%, D2 Tool Design & MCP Integration 18%, D3 Claude Code Configuration & Workflows 20%, D4 Prompt Engineering & Structured Output 20%, D5 Context Management & Reliability 15%.

## The 6 scenarios (ids used in data)
1. Customer Support Resolution Agent (Agent SDK, MCP tools get_customer, lookup_order, process_refund, escalate_to_human; 80%+ first-contact resolution). Primary: D1, D2, D5
2. Code Generation with Claude Code (slash commands, CLAUDE.md, plan mode vs direct execution). Primary: D3, D5
3. Multi-Agent Research System (coordinator + web search, document analysis, synthesis, report subagents). Primary: D1, D2, D5
4. Developer Productivity with Claude (Agent SDK, built-in tools Read/Write/Edit/Bash/Grep/Glob, MCP servers, legacy codebases). Primary: D2, D3, D1
5. Claude Code for Continuous Integration (automated review, test generation, PR feedback, minimise false positives). Primary: D3, D4
6. Structured Data Extraction (unstructured docs -> JSON schema validated output, edge cases, downstream integration). Primary: D4, D5

## Paper -> scenario assignment (15 questions per scenario, in this order)
| Paper | Scenarios |
|---|---|
| 1 | 1, 2, 3, 5 |
| 2 | 1, 3, 4, 6 |
| 3 | 2, 4, 5, 6 |
| 4 | 1, 2, 4, 6 |
| 5 | 1, 3, 5, 6 |
| 6 | 2, 3, 4, 5 |
| 7 | 1, 2, 3, 6 |
| 8 | 1, 4, 5, 6 |
| 9 | 2, 3, 5, 6 |
| 10 | 1, 3, 4, 5 |

Domain mix per paper should approximate 16/11/12/12/9 (D1..D5) across the 60 items (±3 per domain is OK, scenarios constrain this).

## Data file format
One file per paper: `data/paper01.js` … `data/paper10.js`. Plain JS (NOT JSON fetch – must work from file:// with no server):

```js
window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 1,
  title: "Mock Exam 1",
  scenarios: [
    {
      id: 1,                       // scenario bank id 1..6
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. ...", // full scenario text as in the guide
      questions: [
        {
          id: "P1-S1-Q1",          // P<paper>-S<scenarioId>-Q<n>
          domain: 1,               // 1..5
          task: "1.4",             // task statement from the guide
          type: "single",          // "single" | "multiple"
          select: 1,               // number of answers to select (1 for single; 2 or 3 for multiple)
          stem: "Production data shows ... What change would most effectively address this?",
          options: [
            { key: "A", text: "..." },
            { key: "B", text: "..." },
            { key: "C", text: "..." },
            { key: "D", text: "..." }
          ],
          correct: ["A"],          // array of keys; length === select
          explanation: "Why the correct answer(s) are right AND why each distractor is wrong."
        }
      ]
    }
  ]
});
```

## Question writing rules
- Original questions only (do not copy the 12 sample questions from the guide verbatim). Same style/difficulty as the samples in section 9 of the guide.
- Scenario-based: each stem describes a concrete production situation (logs, metrics, symptoms, constraints) and asks for the BEST / MOST effective / FIRST / root-cause choice.
- All 4 options must be plausible; distractors should be typical anti-patterns named in the guide (prompt-only enforcement where determinism is needed, self-reported confidence, sentiment escalation, arbitrary iteration caps, parsing natural language to stop loops, giving agents too many tools, generic error messages, silently swallowing errors, bigger context window as a fix, over-engineered classifiers, non-existent CLI flags/config files, user-level config for team settings, etc.).
- Don't make the correct answer systematically the longest. Spread correct letters evenly across A/B/C/D (and E).
- Per paper: ~10–12 multiple-response items ("select": 2, rarely 3) with 5 options A–E; the rest single-answer with 4 options A–D. Stem of a multiple-response item must end with "(Select TWO.)" or "(Select THREE.)".
- Cover a broad range of task statements (1.1–1.7, 2.1–2.5, 3.1–3.6, 4.1–4.6, 5.1–5.6). Facts must match the guide (e.g. -p/--print, --output-format json, --json-schema, .mcp.json + ${ENV_VAR}, ~/.claude.json, .claude/commands/, .claude/skills/SKILL.md with context: fork / allowed-tools / argument-hint, .claude/rules/ with YAML `paths:` globs, @import, /memory, /compact, --resume <name>, fork_session, Explore subagent, Task tool + allowedTools, PostToolUse hooks, stop_reason "tool_use"/"end_turn", tool_choice "auto"/"any"/{"type":"tool","name":...}, Message Batches API 50% cheaper, ≤24h window, no SLA, custom_id, no multi-turn tool calling in batch, MCP isError, errorCategory/isRetryable).
- Out-of-scope topics must NOT appear (fine-tuning, auth/billing, vision, computer use, streaming, rate limits, cloud-provider specifics, tokenization, RLHF…).
- Explanations: 2–5 sentences, state the principle and why each distractor fails.
