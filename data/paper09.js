window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 9,
  title: "Mock Exam 9",
  scenarios: [
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P9-S2-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A new engineer named Priya joins the DriveAssist perception team at Ridgeline Motors. Every other engineer's Claude Code sessions automatically apply the team's naming conventions and null-safety checks for perception code, but Priya's sessions never apply them even though she cloned the same repository and the same CLAUDE.md file her teammates see in their editor tabs. What is the most likely explanation?",
          options: [
            { key: "A", text: "Priya's local Claude Code installation is an older version lacking CLAUDE.md parsing support entirely, which would explain why none of the file's directives apply during her sessions regardless of where they're defined." },
            { key: "B", text: "The conventions require a project-level .mcp.json entry that Priya has not configured locally, since MCP server registration is the mechanism Claude Code uses to load any project-wide behavioral convention." },
            { key: "C", text: "The conventions live in a teammate's personal ~/.claude/CLAUDE.md file, not the project's committed .claude/CLAUDE.md, so new clones never receive them." },
            { key: "D", text: "CLAUDE.md files only take effect after the first successful commit in a new clone, because Claude Code treats an uncommitted working tree as ineligible for project-level configuration loading." }
          ],
          correct: ["C"],
          explanation: "User-level ~/.claude/CLAUDE.md applies only to that individual user and is never shared via version control, so teammates relying on it will not see it reflected for new clones. There's no version-compatibility issue implied (A), and MCP server config (B) and commit-triggered activation (D) describe mechanisms unrelated to CLAUDE.md's configuration hierarchy."
        },
        {
          id: "P9-S2-Q2",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A Ridgeline Motors engineer asks Claude Code to review the driveassist-ui, fleet-db, and telemetry-api packages for a shared breaking-change in a logging utility, where each package's review is independent and doesn't depend on findings from the others. The engineer wants the reviews to finish as quickly as possible. Which invocation pattern best fits this situation?",
          options: [
            { key: "A", text: "Spawn a single subagent and instruct it to review all three packages one after another inside its own isolated context window, since consolidating everything under one subagent avoids any risk of duplicated or conflicting tool calls." },
            { key: "B", text: "Run the three reviews sequentially in the main conversation thread, carrying the growing review notes forward from one package to the next, since preserving every prior note is assumed to make later findings more thorough." },
            { key: "C", text: "Dispatch one subagent per package in parallel via the Task tool, since the reviews are independent." },
            { key: "D", text: "Ask the engineer to manually copy each package's logging-utility usage into a separate chat tab for side-by-side comparison, since manual inspection lets a human apply judgment calls an automated review might miss." }
          ],
          correct: ["C"],
          explanation: "Because the three package reviews are independent, parallel subagent dispatch via the Task tool minimizes wall-clock time and keeps each subagent's context scoped to its own package. Sequential review in the main thread (B) is slower and needlessly carries irrelevant notes forward. A single subagent working serially (A) forfeits the concurrency benefit entirely. Manual copying across chat tabs (D) is not an agentic workflow and doesn't scale."
        },
        {
          id: "P9-S2-Q3",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "The Ridgeline Motors platform team wants a /review-adas slash command that runs their safety-critical code review checklist for every engineer, automatically available the moment someone clones the driveassist monorepo. Where should the command file live?",
          options: [
            { key: "A", text: "~/.claude/commands/review-adas.md on the tech lead's laptop" },
            { key: "B", text: "The CLAUDE.md file at the project root, under a \"commands:\" YAML block" },
            { key: "C", text: "A .claude/config.json file listing available commands" },
            { key: "D", text: ".claude/commands/review-adas.md inside the repository" }
          ],
          correct: ["D"],
          explanation: "Project-scoped commands in .claude/commands/ are version-controlled and automatically available to every developer who clones or pulls the repository. ~/.claude/commands/ (A) is personal and not shared. Neither a CLAUDE.md YAML commands block (B) nor a .claude/config.json file (C) is a real mechanism for defining slash commands."
        },
        {
          id: "P9-S2-Q4",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "The three linters Ridgeline Motors runs across driveassist-ui, fleet-db, and telemetry-api each emit warnings in a different shape (one as plain text lines, one as a JSON array, one as a semicolon-delimited string), and Claude Code's fix suggestions become unreliable when it has to parse all three formats inline mid-task. What is the best way to address this before the agent reasons over the lint results?",
          options: [
            { key: "A", text: "Increase the context window available to the agentic loop so more raw lint output can be processed per turn." },
            { key: "B", text: "Add a CLAUDE.md note asking Claude Code to mentally normalize the three formats whenever it encounters them, since a documented convention is assumed to be followed as consistently as a programmatic transformation step on every single turn." },
            { key: "C", text: "Ask engineers to manually reformat each linter's output into a shared format before pasting it into the conversation, since manual review by someone already familiar with each linter's quirks is assumed to guarantee consistency across all three tools every time." },
            { key: "D", text: "Register a PostToolUse hook on the lint-running tool that transforms all three raw outputs into one consistent structured shape before Claude Code sees them." }
          ],
          correct: ["D"],
          explanation: "A PostToolUse hook deterministically normalizes heterogeneous tool output into one consistent structure before the model has to reason over it, which is exactly the role hooks play for data normalization. A CLAUDE.md note (B) is a probabilistic prompt-level instruction with no guarantee. Manual reformatting (C) doesn't scale and reintroduces human error. A larger context window (A) doesn't fix inconsistent formatting, only processes more of it."
        },
        {
          id: "P9-S2-Q5",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors wants Claude Code to create and update Jira tickets directly from a driveassist session as engineers discover follow-up work during code review. A well-maintained, actively updated community MCP server already exposes Jira's issue-creation and transition APIs with the project's required custom fields. What is the most pragmatic way to get this capability?",
          options: [
            { key: "A", text: "Configure the existing community Jira MCP server in .mcp.json rather than building a custom integration from scratch." },
            { key: "B", text: "Write a brand-new in-house MCP server that re-implements Jira's REST API from the ground up, since building fully custom tooling guarantees complete control over every endpoint, auth flow, and custom field mapping the team could ever need." },
            { key: "C", text: "Ask engineers to keep updating Jira manually outside of Claude Code to avoid any integration risk." },
            { key: "D", text: "Have Claude Code generate raw HTTP requests to the Jira REST API inline in each session instead of using MCP, since handwritten requests are assumed to reproduce the same auth handling, pagination, and error semantics the server already provides." }
          ],
          correct: ["A"],
          explanation: "When a well-maintained community MCP server already covers the required functionality, configuring it is the most pragmatic path and avoids duplicating maintenance effort. Building a custom server from scratch (B) is unnecessary engineering cost for capability that already exists. Manual Jira updates (C) forfeits the automation benefit entirely. Ad hoc inline HTTP requests (D) bypass MCP's standardized tool interface and lose its discovery and error-handling conventions."
        },
        {
          id: "P9-S2-Q6",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A Claude Code session reviewing the driveassist-planning module runs for over an hour and accumulates a long transcript of file reads and intermediate findings. The engineer notices that a critical finding identified early in the session is being overlooked in the final summary, even though later, less important findings are reflected accurately. What is the most likely cause, and how should it be addressed?",
          options: [
            { key: "A", text: "Claude Code deliberately deprioritizes the first finding of any session as a matter of policy." },
            { key: "B", text: "The model has a hard per-session memory limit and has permanently discarded the earlier message, so the session must be restarted from scratch, since conversational memory is allocated on a strict first-in-first-out basis once a fixed token ceiling is reached." },
            { key: "C", text: "Information placed earlier in a long context is more prone to being underweighted relative to more recent content, so critical findings should be restated or pinned near the end of the conversation before requesting a summary." },
            { key: "D", text: "The summary request itself is malformed, which is the only thing that could cause a finding to be omitted, since a correctly phrased request is assumed to guarantee every prior finding is weighted equally regardless of its position in the transcript." }
          ],
          correct: ["C"],
          explanation: "Content positioned earlier in a long context window can be underweighted relative to more recent information, so restating or pinning critical findings near the point a summary is requested helps preserve them. There is no hard discard of early messages (B) as long as the content remains in context, nor any deliberate first-finding deprioritization policy (A). A malformed summary request (D) is only one of several possible causes and not the most likely one given the described pattern."
        },
        {
          id: "P9-S2-Q7",
          domain: 3,
          task: "3.4",
          type: "multiple",
          select: 2,
          stem: "Which two of the following Ridgeline Motors tasks are the best candidates for starting in plan mode rather than direct execution? (Select TWO.)",
          options: [
            { key: "A", text: "Migrating the driveassist-ui package from Redux to a new state management library across 60+ components, with two viable library candidates." },
            { key: "B", text: "Adding a single null-check before dereferencing a sensor reading in one function, per a clear stack trace from last night's crash report." },
            { key: "C", text: "Fixing a typo in a log message string inside telemetry-api." },
            { key: "D", text: "Restructuring the perception and planning services into a new shared message bus, affecting service boundaries across both modules." },
            { key: "E", text: "Updating a single unit test assertion to match a renamed function signature." }
          ],
          correct: ["A", "D"],
          explanation: "Plan mode suits large-scale, multi-file changes with multiple valid approaches or architectural decisions, exactly matching the Redux migration (A) with two candidate libraries and the service restructuring (D) affecting boundaries. B, C, and E are small, well-scoped changes with a single clear fix, better suited to direct execution."
        },
        {
          id: "P9-S2-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "An engineer asks Claude Code to plan a multi-phase refactor of the legacy fleet-db module. During the investigation phase, Claude Code performs extensive file reads and pattern searches that consume a large portion of the context window before any plan is produced, leaving little room for the implementation phase. What change best addresses this?",
          options: [
            { key: "A", text: "Delegate the verbose discovery phase to the Explore subagent, which isolates exploration output and returns a concise summary to the main session." },
            { key: "B", text: "Increase the iteration cap on the agentic loop so more discovery steps can run before planning begins, since a higher ceiling lets the agent exhaustively enumerate every file in the legacy module before committing to any plan." },
            { key: "C", text: "Disable plan mode and proceed directly to implementation to avoid the discovery phase entirely." },
            { key: "D", text: "Ask the engineer to manually paste relevant file contents into the prompt instead of letting Claude Code read files, since manual curation by someone familiar with the legacy module is assumed to be at least as thorough as an automated exploration pass." }
          ],
          correct: ["A"],
          explanation: "The Explore subagent isolates verbose discovery output in a separate context, preserving the main session's budget for subsequent planning and implementation. An iteration cap (B) doesn't address context consumption. Skipping plan mode (C) removes a valuable step for a complex refactor. Manual pasting (D) is impractical and doesn't scale to a multi-phase legacy investigation."
        },
        {
          id: "P9-S2-Q9",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "During a long Claude Code session refactoring the telemetry-api package, the agent repeatedly reads large files in full even after it has already summarized their relevant contents earlier in the same session, causing the context window to fill with duplicated raw file content. What is the most effective way to manage context in this large-codebase exploration?",
          options: [
            { key: "A", text: "Switch to a model with a larger context window, since a sufficiently large window can absorb unlimited duplicate full-file reads without any practical ceiling on how much redundant raw content accumulates." },
            { key: "B", text: "Ask the agent to read every file in the package at the start of the session so nothing needs to be re-read later." },
            { key: "C", text: "Disable the Read tool entirely for the remainder of the session once the first few files have been read, since the agent is assumed to already hold everything it needs from those initial reads for the rest of the refactor." },
            { key: "D", text: "Prefer targeted Grep/Glob searches and read only the specific sections needed, replacing earlier full-file reads with concise summaries once their relevant content has been extracted." }
          ],
          correct: ["D"],
          explanation: "Favoring targeted search and reading only needed sections, then replacing earlier raw content with concise extracted summaries, keeps the context budget focused on what remains relevant across a long exploration. Reading every file upfront (B) front-loads the exact duplication problem at scale. Disabling Read (C) blocks legitimate follow-up reads. A larger context window (A) delays rather than resolves the inefficiency of repeatedly storing redundant raw content."
        },
        {
          id: "P9-S2-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "An engineer asks Claude Code to implement a VIN (vehicle identification number) checksum validator for the fleet-db package but isn't sure how to precisely specify every edge case up front (malformed input, legacy 15-character VINs, checksum mismatches). What iterative approach is most likely to converge on a correct implementation efficiently?",
          options: [
            { key: "A", text: "Write a test suite covering expected behavior and edge cases first, then iterate by sharing each test failure with Claude Code to guide corrections." },
            { key: "B", text: "Describe every edge case in as much prose detail as possible in a single upfront message before any code is written, since a sufficiently exhaustive specification is assumed to eliminate the need for any later correction." },
            { key: "C", text: "Ask Claude Code to generate the implementation first, then write tests afterward that match whatever behavior it produced." },
            { key: "D", text: "Set an arbitrary cap of three implementation attempts and accept whichever version passes the most manual spot checks." }
          ],
          correct: ["A"],
          explanation: "Test-driven iteration \u2014 writing tests first and sharing concrete failures \u2014 surfaces edge cases progressively and gives the model precise, actionable correction signals. Exhaustive upfront prose (B) still depends on anticipating every case, which the engineer admits is difficult. Writing tests to match existing behavior (C) validates against whatever was built rather than the actual requirement. An arbitrary attempt cap (D) is unrelated to correctness."
        },
        {
          id: "P9-S2-Q11",
          domain: 3,
          task: "3.5",
          type: "multiple",
          select: 2,
          stem: "Claude Code's generated pull request for driveassist-planning has two problems: (1) a race condition where a shared state variable is both mutated by the fix for issue #1 and read by the fix for issue #2, and (2) an unrelated unused-import warning in a file neither fix touches. Which two statements correctly describe how to address these issues? (Select TWO.)",
          options: [
            { key: "A", text: "Alternate turns between the two interacting fixes, describing one piece at a time to keep each message short." },
            { key: "B", text: "Report the race condition together with its related fix in a single detailed message, since the two interact and a change to one affects the other." },
            { key: "C", text: "Report all three items together in one message regardless of whether they interact, because grouping always produces the fastest results." },
            { key: "D", text: "Fix the unused import first, then wait for that commit before even describing the race condition." },
            { key: "E", text: "Report the unused-import warning as a separate, sequential fix, since it is independent of the other two issues." }
          ],
          correct: ["B", "E"],
          explanation: "Interacting issues, like the race condition's two interdependent fixes, should be addressed together in one detailed message so Claude can reason about them jointly, while independent issues, like the unused import, are better handled sequentially. C ignores the interacting-versus-independent distinction. A and D needlessly fragment the interacting fixes, risking an incomplete or inconsistent resolution."
        },
        {
          id: "P9-S2-Q12",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Two engineers on the same Ridgeline Motors team report that Claude Code behaves inconsistently: one sees the repository's commit-message conventions applied automatically, the other doesn't, despite both working in the same cloned repository. What is the fastest way to diagnose the discrepancy?",
          options: [
            { key: "A", text: "Ask both engineers to paste their entire terminal history into a shared document, since diffing two full terminal histories line-by-line is assumed to eventually surface any configuration discrepancy between the sessions." },
            { key: "B", text: "Run the /memory command in each engineer's session to see exactly which CLAUDE.md files are being loaded." },
            { key: "C", text: "Reinstall Claude Code for the engineer experiencing the problem." },
            { key: "D", text: "Assume it's a random model inconsistency and retry the same prompt five times." }
          ],
          correct: ["B"],
          explanation: "/memory surfaces exactly which memory files are loaded in a given session, directly revealing hierarchy or scoping discrepancies such as a stray user-level override. Comparing terminal history (A) is slow and doesn't expose which config is loaded. Reinstalling (C) and assuming randomness (D) don't investigate the actual configuration state at all."
        },
        {
          id: "P9-S2-Q13",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An engineer paused a two-day investigation into a flaky sensor-fusion test in driveassist-perception. Since then, two unrelated files that were part of the original investigation have been substantially rewritten by a teammate, and most of the original session's tool results are now stale. What is the most reliable way to continue?",
          options: [
            { key: "A", text: "Run claude --resume <session-name> and continue exactly where the session left off, since resuming is assumed to preserve the exact prior reasoning trail as fully valid regardless of how much the underlying codebase has since changed." },
            { key: "B", text: "Resume the prior session and ask Claude to assume nothing has changed in the codebase since the last message." },
            { key: "C", text: "Start a new session and inject a structured summary of prior findings, explicitly noting which files were since rewritten and need re-analysis." },
            { key: "D", text: "Discard all prior findings and re-run the full investigation from scratch with no context of the earlier two days of work." }
          ],
          correct: ["C"],
          explanation: "When prior tool results are substantially stale, starting fresh with an injected structured summary is more reliable than resuming, and explicitly flagging the rewritten files enables targeted re-analysis instead of trusting stale results. Resuming as-is (A) or assuming nothing changed (B) would have Claude reason over outdated file contents. Discarding everything (D) wastes the two days of still-valid findings unnecessarily."
        },
        {
          id: "P9-S2-Q14",
          domain: 1,
          task: "1.7",
          type: "multiple",
          select: 2,
          stem: "A Ridgeline Motors engineer has completed a thorough shared analysis of the fleet-db query layer and now wants to explore two different refactoring strategies (introducing a repository interface vs. switching to a query builder library) without either exploration contaminating the other. Which two statements about using fork_session here are correct? (Select TWO.)",
          options: [
            { key: "A", text: "fork_session is required anytime a session is resumed, even when exploring only one approach." },
            { key: "B", text: "fork_session automatically merges the two branches' final code changes into a single pull request." },
            { key: "C", text: "fork_session can create two independent branches from the same completed analysis baseline, letting each refactoring strategy be explored separately." },
            { key: "D", text: "fork_session should be used instead of --resume whenever more than one engineer is involved, regardless of whether divergent exploration is needed." },
            { key: "E", text: "Each forked branch explores divergently from the shared baseline without one branch's changes leaking into the other." }
          ],
          correct: ["C", "E"],
          explanation: "fork_session is designed exactly for this case: branching from a shared baseline to explore divergent approaches independently, with changes in one branch not affecting the other. A misstates when forking is needed (only for divergent exploration, not every resume). B fabricates automatic merge behavior. D conflates engineer count with the actual trigger for forking, which is divergent exploration."
        },
        {
          id: "P9-S2-Q15",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "An engineer reviewing the driveassist-planning module notices Claude Code keeps citing a logging convention that contradicts what's written in the repo's CLAUDE.md, as though a different, outdated set of project instructions is in effect. The engineer suspects a stale or conflicting memory file is being loaded instead of (or alongside) the current one. What is the most direct way to confirm this?",
          options: [
            { key: "A", text: "Run the /memory command to inspect exactly which CLAUDE.md files (project, user, and any nested paths) are currently loaded into the session." },
            { key: "B", text: "Ask Claude Code directly \"which CLAUDE.md are you using?\" and trust its self-reported answer as definitive, since the model is assumed to always have accurate introspective awareness of which configuration files were loaded into its own context." },
            { key: "C", text: "Delete the repo's CLAUDE.md file entirely and see whether the contradictory convention disappears." },
            { key: "D", text: "Restart the session and assume the issue will resolve itself without further investigation." }
          ],
          correct: ["A"],
          explanation: "/memory directly surfaces which CLAUDE.md files (project-level, user-level, and any nested ones) are actually loaded, making it the most direct way to confirm whether a stale or conflicting file is in effect. Asking Claude to self-report (B) relies on the model's own account rather than the actual loaded configuration. Deleting CLAUDE.md (C) is destructive and doesn't diagnose the root cause. Restarting and hoping (D) doesn't investigate anything."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P9-S3-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence's coordinator agent sends a request to Claude that includes the web_search tool definition. The response comes back with stop_reason: \"tool_use\". What should the coordinator's agentic loop do next?",
          options: [
            { key: "A", text: "Parse the assistant's accompanying text for phrases like \"I need to search\" to decide whether to actually run the tool." },
            { key: "B", text: "Treat tool_use as a terminal state and present the response to the client immediately, since stop_reason values other than \"end_turn\" are assumed to always indicate the task is already finished." },
            { key: "C", text: "Execute the requested tool call(s), append the tool result(s) to the conversation history, and send the updated conversation back to Claude for the next iteration." },
            { key: "D", text: "Increment a hard-coded iteration counter and stop the loop once it exceeds 3, regardless of stop_reason, since a fixed cap is assumed to be a safe universal substitute for checking the actual stop_reason value on every turn." }
          ],
          correct: ["C"],
          explanation: "The agentic loop continues when stop_reason is \"tool_use\": execute the requested tool(s), append results to context, and send the updated conversation back for the next iteration, terminating only on \"end_turn\". Treating tool_use as terminal (B) would drop the requested action entirely. Parsing assistant text for intent (A) and an arbitrary iteration cap (D) are both anti-patterns called out for loop control."
        },
        {
          id: "P9-S3-Q2",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "A document_analysis subagent at Arclight Media Intelligence is invoked mid-task but produces analysis that ignores a key client preference (\"exclude paywalled sources\") that was established earlier in the coordinator's conversation with the user. Why does this happen?",
          options: [
            { key: "A", text: "The document_analysis subagent's system prompt is outdated and needs a software update." },
            { key: "B", text: "Subagents operate with isolated context and do not automatically inherit the coordinator's conversation history." },
            { key: "C", text: "The coordinator exceeded its allowedTools list, so the Task tool silently dropped part of the request, since allowedTools violations are assumed to selectively discard only the offending instruction rather than blocking the whole call." },
            { key: "D", text: "The subagent's context window is too small to hold the client preference alongside the documents, since a fixed context ceiling is assumed to be the limiting factor whenever an earlier instruction fails to carry through." }
          ],
          correct: ["B"],
          explanation: "Subagents have isolated context and do not automatically inherit the coordinator's conversation history, so any relevant constraint, like excluding paywalled sources, must be explicitly passed into the subagent's prompt. An outdated system prompt (A) and an allowedTools violation (C) aren't implied by the symptom. Context window size (D) is a capacity issue, not the reason a known preference was never communicated."
        },
        {
          id: "P9-S3-Q3",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence runs its research system on the topic \"impact of streaming platforms on local journalism.\" Every subagent completes without error, but the final report only discusses local television news, entirely omitting local radio and print newspapers. The coordinator's logs show it decomposed the topic into \"streaming vs. local TV news ratings,\" \"streaming subscriber growth near TV markets,\" and \"TV newsroom staffing changes.\" What is the most likely root cause?",
          options: [
            { key: "A", text: "The web_search subagent's queries are not returning enough articles about local journalism in general, since insufficient search recall is assumed to be the default explanation whenever a final report is missing expected coverage." },
            { key: "B", text: "The synthesis subagent dropped radio- and print-related findings while condensing the subagent outputs." },
            { key: "C", text: "The coordinator's task decomposition was too narrow, assigning subagents only TV-related subtopics and omitting radio and print entirely." },
            { key: "D", text: "The report-generation subagent's template only has sections for television coverage, since a fixed report template is assumed to constrain which subtopics the coordinator can even decompose the research question into." }
          ],
          correct: ["C"],
          explanation: "The coordinator's own logs reveal the root cause directly: it decomposed the topic into only TV-related subtasks, completely omitting radio and print. The subagents executed their assigned tasks correctly within that narrow scope, so A, B, and D incorrectly blame downstream agents that behaved as instructed."
        },
        {
          id: "P9-S3-Q4",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An Arclight Media Intelligence analyst resumed yesterday's streaming-journalism research session this morning to keep refining the final report. Midway through, the editor asks for a second, much narrower version of the report that focuses only on local radio, while the original broad version still needs to ship unchanged. The analyst wants to explore the narrower angle without risking the in-progress broad report. What is the best way to proceed?",
          options: [
            { key: "A", text: "Fork the resumed session into a new session that branches from the current point, so the narrower exploration happens in its own copy while the original session's state and history remain untouched." },
            { key: "B", text: "Keep working in the same resumed session and simply ask the coordinator to \"forget\" the broad-report instructions once the narrower request comes in." },
            { key: "C", text: "Start a brand-new session from scratch for the narrower angle, since discarding all prior context is assumed to be the only way to guarantee the two versions never influence each other." },
            { key: "D", text: "Append the narrower request to the same session's history and rely on the coordinator to mentally keep the two report versions separate as it continues." }
          ],
          correct: ["A"],
          explanation: "Forking creates a new session that branches from the current state, preserving the original session's history untouched while allowing independent exploration in the fork, exactly what's needed here. Asking the coordinator to \"forget\" prior instructions (B) is unreliable and doesn't actually remove them from context. Starting entirely from scratch (C) discards the useful shared research already gathered for the broad report. Continuing in one session for both versions (D) risks the two reports' instructions and content bleeding into each other."
        },
        {
          id: "P9-S3-Q5",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "When the coordinator passes web_search results and document_analysis findings to the synthesis subagent at Arclight Media Intelligence, analysts later find it difficult to trace which specific finding came from which original article once the final report is published, because the prompt mixed narrative content and source details together in paragraphs. What change would best preserve provenance through the synthesis step?",
          options: [
            { key: "A", text: "Instruct the synthesis subagent to re-search the web for each finding to re-confirm its source before including it." },
            { key: "B", text: "Increase the synthesis subagent's context window, since a larger window is assumed to let it retain the mapping between claims and sources purely through added token capacity, without any change to how the data itself is structured." },
            { key: "C", text: "Ask the report-generation subagent to add citations based on its best guess after synthesis is complete, since a plausible-sounding citation assigned after the fact is assumed to be as traceable as metadata carried through from the original source." },
            { key: "D", text: "Use a structured data format that separates each finding's content (the claim or summary) from its provenance metadata (source URL, document name, publication date) when passing context to the synthesis subagent." }
          ],
          correct: ["D"],
          explanation: "Separating content from metadata in a structured format preserves attribution (source URLs, document names, dates) as findings move between agents, exactly the stated requirement. Re-searching to reconfirm (A) adds unnecessary latency and cost instead of fixing the handoff format. A larger context window (B) doesn't solve a structural organization problem. Guessing citations after the fact (C) risks misattribution rather than preventing it."
        },
        {
          id: "P9-S3-Q6",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence's coordinator needs results from both the web_search and document_analysis subagents before synthesis can begin, and the two subagents' tasks don't depend on each other. Currently the coordinator invokes web_search, waits for its full response, then invokes document_analysis in a separate turn, adding noticeable latency. What change reduces latency without changing what work is done?",
          options: [
            { key: "A", text: "Cache the web_search subagent's previous results so document_analysis can reuse them instead of running independently." },
            { key: "B", text: "Merge web_search and document_analysis into one subagent so only one Task call is ever needed, since consolidating both roles is assumed to always reduce latency regardless of how their work is actually structured." },
            { key: "C", text: "Give the coordinator tool_choice: \"any\" so it is forced to call a tool on every turn." },
            { key: "D", text: "Emit both Task tool calls for web_search and document_analysis in a single coordinator response so they execute in parallel." }
          ],
          correct: ["D"],
          explanation: "Emitting multiple Task tool calls in a single coordinator response spawns independent subagents in parallel, reducing latency when their work doesn't depend on each other. Merging the subagents (B) changes the architecture and loses role separation unnecessarily. tool_choice: \"any\" (C) only guarantees some tool is called, not parallelism. Caching (A) doesn't apply since the two subagents perform unrelated work, not the same work twice."
        },
        {
          id: "P9-S3-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence runs two kinds of research jobs: (1) a recurring \"quarterly competitor coverage audit\" that always follows the same steps\u2014search, analyze, synthesize, report\u2014and (2) one-off investigative requests like \"map every entity involved in this emerging controversy,\" where the right next step depends entirely on what's discovered along the way. How should task decomposition differ between these two jobs?",
          options: [
            { key: "A", text: "Use dynamic adaptive decomposition for both jobs, since it is always the more thorough approach regardless of predictability." },
            { key: "B", text: "Use fixed, sequential prompt chaining for the predictable quarterly audit, and dynamic decomposition that adapts subtasks to findings for the open-ended request." },
            { key: "C", text: "Use fixed sequential prompt chaining for both jobs to keep the system architecture consistent across all research types." },
            { key: "D", text: "Decompose the quarterly audit dynamically but handle the investigative request with a fixed four-step pipeline, since keeping output format uniform is assumed to matter more than whether decomposition strategy matches each job's predictability." }
          ],
          correct: ["B"],
          explanation: "Predictable, repeatable workflows like the quarterly audit are well suited to fixed prompt chaining, while open-ended investigations benefit from dynamic decomposition that adapts as findings emerge. Applying dynamic decomposition everywhere (A) adds unnecessary overhead to a predictable workflow. Fixed chaining for both (C) and the reversed pairing (D) both apply the wrong pattern to at least one job type."
        },
        {
          id: "P9-S3-Q8",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence has two tools available to its subagents: analyze_content (\"Analyzes content and returns insights\") and analyze_sentiment (\"Analyzes sentiment and returns insights\"). Logs show the document_analysis subagent frequently calls analyze_content when it should call analyze_sentiment for sentiment-specific requests, and vice versa. What is the most effective first step?",
          options: [
            { key: "A", text: "Add a routing classifier upstream of the subagent that pre-selects which of the two tools to call based on keyword detection." },
            { key: "B", text: "Increase the subagent's temperature setting so it explores tool choices more creatively." },
            { key: "C", text: "Rewrite both tool descriptions to clearly differentiate their inputs, outputs, and intended use cases, for example renaming analyze_content to something web-article-specific and clarifying analyze_sentiment's distinct scope." },
            { key: "D", text: "Merge both tools into a single generic analyze tool, since eliminating the choice entirely is assumed to be strictly better than clarifying the two tools' distinct scopes, regardless of any specialized functionality lost in the process." }
          ],
          correct: ["C"],
          explanation: "Tool descriptions are the primary mechanism the model uses for tool selection; near-identical minimal descriptions like these directly cause misrouting, so rewriting them to clearly differentiate purpose is the appropriate first step. A routing classifier (A) is over-engineered before a low-effort prompt fix has been tried. Temperature (B) doesn't address description ambiguity. Merging into one generic tool (D) is a bigger architectural change than warranted as a first step."
        },
        {
          id: "P9-S3-Q9",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 3,
          stem: "The web_search subagent at Arclight Media Intelligence sometimes returns zero results because nothing in the index matched the query (a legitimate empty result), and other times because the search provider blocked or rate-limited the request before any real search ran (an access failure) \u2014 but both cases currently come back to the coordinator as the same empty array, so the coordinator silently treats blocked access as \"nothing found\" and omits that source's coverage from the report without flagging the gap. Which three elements should the structured tool response include so the coordinator can tell these cases apart? (Select THREE.)",
          options: [
            { key: "A", text: "A status field indicating whether the call actually completed against the provider and returned a real answer, versus failing before any search was performed." },
            { key: "B", text: "The specific error code or reason the provider returned when the request was blocked, rate-limited, or denied (e.g., 403, quota_exceeded)." },
            { key: "C", text: "An explicit flag confirming this was a successful search that legitimately matched zero results, distinct from a call that never completed." },
            { key: "D", text: "A single generic \"no results\" string used identically whether the search succeeded with zero matches or failed outright, since collapsing both outcomes into one message is assumed to be simpler for the coordinator to parse than tracking two separate states." },
            { key: "E", text: "Automatic silent retries of the same query up to five times before anything is returned to the coordinator, since retrying alone is assumed to resolve the ambiguity without the response itself needing any additional structure." }
          ],
          correct: ["A", "B", "C"],
          explanation: "A completion status, the specific provider error reason, and an explicit zero-match confirmation together let the coordinator distinguish a genuine empty result from a blocked or failed call, so it can retry, try an alternative source, or flag a real coverage gap instead of silently dropping it. A single generic \"no results\" string (D) is exactly the collapsed signal causing the problem. Silent retries alone (E) don't give the coordinator any way to tell the two cases apart even after retrying."
        },
        {
          id: "P9-S3-Q10",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "A web_search subagent at Arclight Media Intelligence returns zero articles for the query \"Northwind Beverages Q3 recall coverage\" and a separate timeout occurs on a different query for \"Solace Health merger rumors.\" Both are reported to the coordinator as the same status: \"no results.\" Why is this a problem?",
          options: [
            { key: "A", text: "It wastes tokens by including too much detail in both responses, since the current terse \"no results\" status is assumed to already carry everything the coordinator needs to make a recovery decision." },
            { key: "B", text: "It violates the requirement that all subagent tool calls must use tool_choice: \"any\"." },
            { key: "C", text: "It means the synthesis subagent will have no findings to report for either topic." },
            { key: "D", text: "It conflates a valid empty result (a genuine no-match search) with an access failure (a timeout needing a retry decision), preventing the coordinator from responding appropriately to each." }
          ],
          correct: ["D"],
          explanation: "Distinguishing access failures from valid empty results matters because each warrants a different coordinator response: a timeout may merit a retry or alternative approach, while a genuine zero-result search does not. The two cases here are collapsed into an identical status, hiding that distinction. The report isn't about excess token detail (A), tool_choice configuration (B), or whether synthesis has findings (C), which is a downstream consequence, not the root problem."
        },
        {
          id: "P9-S3-Q11",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "Arclight Media Intelligence originally gave every subagent access to all 16 available tools (web search, document parsing, sentiment scoring, fact verification, source ranking, etc.), reasoning that any subagent might eventually need any tool. Tool selection accuracy across the system has since degraded noticeably. Which two changes best address this while preserving necessary cross-agent functionality? (Select TWO.)",
          options: [
            { key: "A", text: "Restrict each subagent's tool access to only the tools relevant to its specific role (e.g., web_search gets search tools, synthesis does not)." },
            { key: "B", text: "Consolidate all 16 tools into one general-purpose do_task tool that accepts a free-text description of the desired action." },
            { key: "C", text: "Leave all 16 tools available to every subagent, but add a system prompt reminder listing which tools each subagent \"should\" prefer." },
            { key: "D", text: "Give the synthesis subagent a single scoped verify_fact tool for its frequent simple fact-checks, routing more complex verification through the coordinator." },
            { key: "E", text: "Give every subagent a copy of the full tool set but disable 10 of them at random per session to reduce apparent complexity." }
          ],
          correct: ["A", "D"],
          explanation: "Scoping each subagent to its relevant tools (A) reduces decision complexity and misuse of out-of-specialization tools, while a narrow cross-role tool like verify_fact (D) serves a high-frequency simple need without over-provisioning. A merged mega-tool (B) just replaces tool-selection complexity with underspecified free-text routing. A system prompt reminder (C) still presents all 16 tools to the model, so selection complexity remains. Random disabling (E) doesn't scope tools deliberately."
        },
        {
          id: "P9-S3-Q12",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Arclight Media Intelligence's engineering team maintains a custom internal MCP server for querying their proprietary media-mentions database, shared by the whole team, authenticated with a rotating API token. One analyst also wants to experiment with a personal MCP server for a third-party translation API, used only in their own sessions. How should these be configured?",
          options: [
            { key: "A", text: "Configure the shared media-mentions server in the project-scoped .mcp.json with ${MEDIA_API_TOKEN} environment variable expansion for the token, and configure the analyst's experimental translation server in their personal ~/.claude.json." },
            { key: "B", text: "Configure both servers in .mcp.json, since any MCP server used by any team member must be project-scoped." },
            { key: "C", text: "Configure both servers in ~/.claude.json to avoid committing any server configuration to version control." },
            { key: "D", text: "Hard-code the rotating API token directly into .mcp.json so the server definition is self-contained and portable." }
          ],
          correct: ["A"],
          explanation: "Shared, team-wide MCP servers belong in project-scoped .mcp.json with environment variable expansion keeping the credential out of version control, while personal/experimental servers belong in user-scoped ~/.claude.json. Forcing both into .mcp.json (B) misapplies project scope to a personal experiment. Forcing both into ~/.claude.json (C) deprives the team of shared access. Hard-coding a credential into .mcp.json (D) commits a secret into source."
        },
        {
          id: "P9-S3-Q13",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Analysts frequently ask the coordinator to list what topics and date ranges are already covered by existing Arclight Media Intelligence reports before starting new research, causing repeated exploratory tool calls just to browse the catalog. What is the most effective way to reduce this overhead?",
          options: [
            { key: "A", text: "Add a new web_search query at the start of every session that searches Arclight's own report archive." },
            { key: "B", text: "Expose the existing report catalog (titles, topics, date ranges) as an MCP resource so the agent can view it directly without issuing exploratory tool calls." },
            { key: "C", text: "Increase the coordinator's context window so it can hold the full list of prior reports in every prompt." },
            { key: "D", text: "Instruct the coordinator in its system prompt to \"remember\" previously discussed topics across sessions." }
          ],
          correct: ["B"],
          explanation: "MCP resources are designed to expose content catalogs directly, reducing exploratory tool calls needed just to browse what's available. A web_search query against the archive (A) still requires a tool call each time. A larger context window (C) doesn't eliminate the need to look the catalog up. Instructing the model to \"remember\" across sessions (D) isn't a real persistence mechanism."
        },
        {
          id: "P9-S3-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "The synthesis subagent at Arclight Media Intelligence has a limited context budget, but the document_analysis subagent currently returns its full reasoning chain and verbose intermediate notes alongside its conclusions for every analyzed document. What change would most effectively help synthesis operate within its context budget without losing necessary information?",
          options: [
            { key: "A", text: "Truncate document_analysis's output at a fixed character limit regardless of which content is most relevant." },
            { key: "B", text: "Have the coordinator summarize document_analysis's verbose output into a single vague paragraph before forwarding it." },
            { key: "C", text: "Modify document_analysis to return structured data \u2014 key facts, relevant excerpts, and relevance scores \u2014 instead of its verbose content and reasoning chain." },
            { key: "D", text: "Reduce the number of documents document_analysis is allowed to analyze per research topic." }
          ],
          correct: ["C"],
          explanation: "Having the upstream agent return structured facts instead of verbose content and reasoning chains preserves the information downstream agents actually need while fitting a limited context budget. A fixed character truncation (A) risks cutting relevant content arbitrarily. Vague summarization (B) risks losing specific values the guide warns against condensing away. Reducing document coverage (D) sacrifices research breadth instead of fixing the format problem."
        },
        {
          id: "P9-S3-Q15",
          domain: 5,
          task: "5.6",
          type: "multiple",
          select: 2,
          stem: "Arclight Media Intelligence's report-generation subagent currently converts every finding \u2014 quarterly ad-spend figures, qualitative sentiment themes, and technical methodology notes \u2014 into the same paragraph-style prose for the final report, and separately, two credible sources cited conflicting subscriber-growth percentages that get silently resolved by picking one value. Which two changes would most improve the report's reliability and usefulness? (Select TWO.)",
          options: [
            { key: "A", text: "Render financial figures like ad-spend data as tables rather than forcing them into prose, while keeping qualitative themes in narrative form." },
            { key: "B", text: "Always select the statistic from the most recently published source and omit the other without comment." },
            { key: "C", text: "Omit conflicting statistics entirely from the report to avoid presenting contradictory information to the client." },
            { key: "D", text: "Convert all content types, including financial figures, into prose to keep the report's formatting uniform." },
            { key: "E", text: "When sources conflict on a statistic, include both values with source attribution rather than arbitrarily selecting one." }
          ],
          correct: ["A", "E"],
          explanation: "Rendering content types appropriately, tables for financial data, prose for qualitative themes, alongside preserving conflicting values with source attribution, both improve clarity and trustworthiness. B silently resolves a conflict without disclosure, which can misrepresent certainty to the client. D forces an unsuitable uniform format onto data better suited to tables. C discards information the client may need to weigh themselves."
        }
      ]
    },
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P9-S5-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' CI pipeline runs claude \"Review this diff for memory-safety issues\" as part of every pull request build, but the job hangs until it times out after 10 minutes with no output. What is the correct fix?",
          options: [
            { key: "A", text: "Run claude -p \"Review this diff for memory-safety issues\" so Claude Code runs in non-interactive mode and exits after producing output." },
            { key: "B", text: "Set a CLAUDE_HEADLESS=true environment variable before invoking claude, since environment-level flags are assumed to control the CLI's interactive-versus-headless behavior independent of any command-line argument." },
            { key: "C", text: "Redirect the command's stdin from /dev/null without changing any flags." },
            { key: "D", text: "Add a --batch flag to the invocation to force the job to run asynchronously, since an asynchronous batch flag is assumed to be the standard way the CLI avoids blocking on interactive input in CI." }
          ],
          correct: ["A"],
          explanation: "The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode; it processes the prompt, outputs the result, and exits without waiting for input, which is exactly what CI requires. B and D reference flags/variables that don't exist, and redirecting stdin (C) doesn't address Claude Code's actual non-interactive invocation mechanism."
        },
        {
          id: "P9-S5-Q2",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors wants its CI-invoked Claude Code review to post findings as individual inline PR comments, each with a file path, line number, severity, and message, parsed by a downstream GitHub Action. Free-form text output has been unreliable to parse. What CLI configuration should they use?",
          options: [
            { key: "A", text: "Run Claude Code normally and have the GitHub Action apply a regex to extract fields from the free-form text output, since regex extraction is assumed to become reliable enough for production once prompt phrasing is sufficiently consistent." },
            { key: "B", text: "Run Claude Code with --output-format json and --json-schema pointing to a schema for file, line, severity, and message." },
            { key: "C", text: "Add --strict-json to the invocation to force valid JSON without specifying a schema." },
            { key: "D", text: "Ask Claude in the prompt to \"always respond in JSON\" without any CLI flags, since a prose instruction alone is assumed to be as enforceable as a schema-validated output-format flag." }
          ],
          correct: ["B"],
          explanation: "--output-format json combined with --json-schema enforces machine-parseable structured output matching a defined schema, exactly what a downstream action needs to reliably post inline comments. Regex-parsing free-form text (A) is the unreliable approach being replaced. --strict-json (C) isn't a real flag, and a prose instruction alone (D) doesn't guarantee schema compliance."
        },
        {
          id: "P9-S5-Q3",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' CI-invoked code reviews frequently flag violations of conventions (fixture naming, approved mocking libraries, review severity thresholds) that are well documented for interactive development but apparently unknown to the CI job. What is the most effective way to give CI-invoked Claude Code this context?",
          options: [
            { key: "A", text: "Pass the entire conventions document as a single giant inline prompt string on every CI invocation, since repeating it verbatim each time is assumed to guarantee the same context Claude would otherwise load automatically from project configuration." },
            { key: "B", text: "Configure the conventions in a user-level ~/.claude/CLAUDE.md on the CI runner's service account." },
            { key: "C", text: "Ensure the CI job runs Claude Code from the repository root (or an equivalent working directory) so it loads the project's CLAUDE.md containing the testing standards, fixture conventions, and review criteria." },
            { key: "D", text: "Hard-code the conventions into the --json-schema file used for output formatting, since a schema that constrains the shape of the output is assumed to also be capable of carrying free-form review-criteria text the same way a CLAUDE.md file does." }
          ],
          correct: ["C"],
          explanation: "CLAUDE.md is the mechanism for providing project context to CI-invoked Claude Code, so ensuring the CI job loads the project-level file gives it the same testing standards and review criteria used interactively. Inlining the whole document per invocation (A) is brittle and wasteful compared to the existing mechanism. A user-level file on the CI service account (B) is scoped to that account rather than the project. The JSON schema (D) defines output structure, not review criteria."
        },
        {
          id: "P9-S5-Q4",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "After a developer pushes a new commit addressing some but not all findings from Claude's first-pass review, the second CI run re-reviews the full diff from scratch and posts a fresh batch of comments, duplicating comments about issues that were already flagged (and not yet fixed) in the first pass. How should the pipeline be changed to avoid duplicate comments?",
          options: [
            { key: "A", text: "Disable PR comments entirely after the first review pass to prevent any possibility of duplicates." },
            { key: "B", text: "Have the second run post comments with a different reviewer username so developers can tell the passes apart, since relabeling the source of each comment is assumed to resolve the underlying duplication rather than merely making it easier to spot." },
            { key: "C", text: "Increase the CI job's timeout, since a longer timeout is assumed to give the review process enough extra time to automatically notice and suppress repeated findings on its own, without any explicit deduplication instruction." },
            { key: "D", text: "Include the prior review's findings in context on the re-run, and instruct Claude to report only new or still-unaddressed issues instead of regenerating a full comment set." }
          ],
          correct: ["D"],
          explanation: "Including prior review findings in context and instructing Claude to report only new or still-unaddressed issues directly prevents duplicate comments across re-runs. Disabling comments (A) removes the feature entirely. A different username (B) doesn't stop the duplication, just relabels it. A longer timeout (C) doesn't address the actual cause, which is a lack of awareness of prior findings."
        },
        {
          id: "P9-S5-Q5",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' CI review prompt defines severity only in the abstract (\"critical = could cause a production failure; minor = style preference\"), and the model keeps miscategorizing borderline findings, for example labeling a missing null-check on a sensor read as \"minor\" when it's actually a crash risk. What change is most likely to fix this miscalibration?",
          options: [
            { key: "A", text: "Temporarily disable review for the categories causing the most noise until the false-positive rate can be investigated, since suppressing an entire category is assumed to restore developer trust just as effectively as fixing why individual findings are miscategorized." },
            { key: "B", text: "Add a short set of few-shot examples pairing concrete code snippets with their correct severity label and a one-line justification, so the model calibrates against real precedent instead of applying abstract severity adjectives." },
            { key: "C", text: "Rephrase the severity definitions with stronger adjectives (e.g., \"severe,\" \"critical,\" \"must-fix\") to make the distinction clearer, since swapping in more emphatic wording is assumed to sharpen the model's severity judgment as effectively as grounding it in concrete examples." },
            { key: "D", text: "Ask the model to \"double-check severity before finalizing\" as an added instruction at the end of the prompt." }
          ],
          correct: ["B"],
          explanation: "Concrete few-shot examples pairing code snippets with their correct severity label and reasoning give the model real precedent to calibrate against, directly addressing why abstract definitions led to miscategorization. Disabling a noisy category (A) hides the symptom instead of fixing the underlying judgment. Stronger adjectives (C) is still an abstract definition, just more emphatic wording, not grounded examples. A generic double-check instruction (D) doesn't define what severity actually means in practice."
        },
        {
          id: "P9-S5-Q6",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' review prompt flags five categories of issues: security, memory-safety, null-handling, naming-style, and architecture. Developer feedback shows the naming-style category has an 85% false-positive rate and is actively eroding trust in the other four categories, which remain highly accurate. What is the most effective immediate action while a better prompt for naming-style is developed?",
          options: [
            { key: "A", text: "Keep all five categories active but mark naming-style findings as \"low priority\" so developers can choose to ignore them." },
            { key: "B", text: "Temporarily disable the naming-style category in the review prompt to restore developer trust in the other four accurate categories, while separately iterating on naming-style criteria." },
            { key: "C", text: "Increase the overall confidence threshold for all five categories equally, since adjusting one shared threshold is assumed simpler to maintain than managing each category's enablement independently, even though it also suppresses the four accurate categories." },
            { key: "D", text: "Merge naming-style into the architecture category so its findings appear under a more trusted label." }
          ],
          correct: ["B"],
          explanation: "Temporarily disabling a high false-positive category restores trust in the accurate categories immediately, while the team iterates on that category's prompt separately. Marking findings \"low priority\" (A) still surfaces the noisy category and continues eroding trust. Raising the threshold for all categories (C) unnecessarily degrades the four accurate ones. Relabeling naming-style under architecture (D) hides the problem instead of fixing it."
        },
        {
          id: "P9-S5-Q7",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' review bot runs on every push to a long-lived feature branch, and by the tenth re-review the findings have drifted: the summary now paraphrases earlier paraphrases of earlier paraphrases, and a specific line number cited in the first review has silently become inaccurate by the fifth. What is happening, and what should change?",
          options: [
            { key: "A", text: "Repeated summarization across re-reviews compounds small losses of detail each pass, so the bot should re-derive findings from the current diff and file state each run rather than summarizing the prior summary." },
            { key: "B", text: "The bot's context window shrinks slightly with each re-review, since capacity is assumed to degrade with repeated use over time unless replaced with a model advertising a larger nominal context limit for every subsequent invocation." },
            { key: "C", text: "Line numbers are inherently unreliable in any automated review and should never be cited regardless of how recent the review is." },
            { key: "D", text: "The drift is caused by the branch being too long-lived, so the fix is an organizational policy limiting branch age rather than anything about the review process." }
          ],
          correct: ["A"],
          explanation: "Progressive summarization compounds small inaccuracies with each pass, so anchoring each re-review to the current diff and file state rather than summarizing prior summaries prevents drift. Context window size (B) isn't the stated mechanism of the problem. Line numbers are reliable when derived fresh from current file state (C overstates the issue). A branch-age policy (D) doesn't address the actual cause, which is re-summarizing summaries."
        },
        {
          id: "P9-S5-Q8",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "The review pipeline gives Claude two tools, flag_finding (records an issue for the PR summary) and report_issue (opens a tracked ticket in the issue tracker for follow-up work), but both tool descriptions simply say \"use this tool to report a problem you find,\" and Claude frequently calls the wrong one for a given situation. What change to the tool descriptions would most reliably fix this?",
          options: [
            { key: "A", text: "Rename report_issue to report_issue_v2 so Claude treats it as the newer, preferred option." },
            { key: "B", text: "Rewrite each description to state its distinct purpose: flag_finding for issues resolved within the current review, report_issue for tracked follow-up work beyond this PR." },
            { key: "C", text: "Merge the two tools into one combined tool, since eliminating the choice entirely is assumed to remove the ambiguity more reliably than clarifying what distinguishes their scopes and intended follow-up actions." },
            { key: "D", text: "Remove report_issue from the toolset entirely so only flag_finding remains available." },
          ],
          correct: ["B"],
          explanation: "Clear, differentiated descriptions stating each tool's distinct purpose and usage condition give the model the information it needs to select correctly, directly fixing the ambiguity causing miscalls. A version-style rename (A) adds no disambiguating information. Merging the tools (C) loses the distinct tracked-ticket capability. Removing one tool (D) eliminates needed functionality rather than fixing the description."
        },
        {
          id: "P9-S5-Q9",
          domain: 4,
          task: "4.2",
          type: "multiple",
          select: 2,
          stem: "Ridgeline Motors wants to improve Claude's handling of ambiguous review cases, such as when a null-check pattern is correct in most modules but could mask a real bug in the safety-critical braking module. Which two practices would most effectively improve the review's judgment on genuinely ambiguous cases like this? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct Claude to always flag any null-check pattern in any module, removing the need to reason about context at all." },
            { key: "B", text: "Remove all few-shot examples so the model relies purely on its general training to judge ambiguous cases." },
            { key: "C", text: "Add few-shot examples that show the reasoning behind why one of two plausible interpretations was chosen for a specific ambiguous case, not just the final verdict." },
            { key: "D", text: "Tell Claude to ask the developer a clarifying question any time a null-check pattern appears, pausing the review until a reply is given." },
            { key: "E", text: "Add few-shot examples covering a representative ambiguous case per module type, allowing the model to generalize similar judgment to novel patterns it hasn't seen before." }
          ],
          correct: ["C", "E"],
          explanation: "Few-shot examples that show the reasoning for an ambiguous case, not merely its outcome, help the model generalize sound judgment to new, unseen variations, which is exactly what's needed for context-dependent cases like the braking module. Blanket-flagging every instance (A) eliminates nuance rather than improving it. Removing few-shot examples entirely (B) discards a proven technique. Pausing for a clarifying reply (D) is impractical in a non-interactive CI pipeline."
        },
        {
          id: "P9-S5-Q10",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors has the same Claude Code session that generated a bug fix for driveassist-planning also review its own diff before the PR is opened, hoping to catch mistakes early. In practice, this self-review rarely identifies any issues with the generated code, even when a second human reviewer later finds real bugs. Why does this happen?",
          options: [
            { key: "A", text: "Self-review always requires extended thinking to be enabled, which was not configured for this session." },
            { key: "B", text: "Self-review sessions do not have access to the Read tool, since tool availability is assumed to be restricted specifically during any self-review pass to prevent the session from re-reading its own prior output." },
            { key: "C", text: "The model's context window is too small to hold both the generation and review tasks in one session." },
            { key: "D", text: "The same session retains its original reasoning context from generation, making it less likely to question decisions it already committed to, compared to an independent review instance without that context." }
          ],
          correct: ["D"],
          explanation: "A session retains its original reasoning from generation, making it less likely to question its own earlier decisions; an independent review instance without that prior reasoning context is more effective at catching subtle issues. Read-tool availability (B) and context window size (C) aren't the stated limitation, and extended thinking (A) is an unrelated configuration, not a requirement for self-review."
        },
        {
          id: "P9-S5-Q11",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "A 22-file pull request touching the telemetry-api, driveassist-ui, and fleet-db packages gets a single combined review pass from Claude Code. The results show detailed, high-quality feedback on the first few files, increasingly generic comments on later files, and a contradictory finding, flagging a repeated pattern as risky in one file while approving the identical pattern elsewhere in the same PR. What task-decomposition change best addresses this?",
          options: [
            { key: "A", text: "Ask three independent reviewers to each review the full 22-file diff and keep only findings all three agree on." },
            { key: "B", text: "Split the review into per-file local analysis passes, each receiving full attention, plus a separate cross-file integration pass that specifically examines data flow between the files." },
            { key: "C", text: "Require the pull request to be split into smaller PRs of 3-4 files before any review can run." },
            { key: "D", text: "Switch to a model variant advertised as supporting a larger context window and resubmit the same single-pass review." }
          ],
          correct: ["B"],
          explanation: "Splitting a large multi-file review into per-file passes plus a separate cross-file integration pass directly addresses attention dilution and contradictory findings across files, a core task-decomposition strategy for complex workflows. Requiring three-way consensus reviews (A) would actually suppress intermittently-caught real bugs. Forcing smaller PRs (C) shifts the burden to developers without improving the review system itself. A larger context window (D) doesn't solve attention quality degradation across many files."
        },
        {
          id: "P9-S5-Q12",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' review pipeline currently relies on a prompt instruction telling Claude \"do not approve a PR if any critical finding is open,\" but engineers have occasionally bypassed this by editing the review comment and merging anyway, since the instruction has no mechanical enforcement. What change would make this enforcement reliable rather than advisory?",
          options: [
            { key: "A", text: "Reword the prompt instruction in stronger language, such as \"you must never approve under any circumstances.\"" },
            { key: "B", text: "Add a merge-gate check in the CI pipeline that blocks the merge button whenever the review's structured output contains an open critical-severity finding, independent of what the prompt says." },
            { key: "C", text: "Ask engineers to self-report whether they bypassed a critical finding before merging." },
            { key: "D", text: "Increase the frequency of re-reviews so critical findings are mentioned more often in the PR thread." }
          ],
          correct: ["B"],
          explanation: "A mechanical merge-gate check that reads the review's structured output and blocks the merge button enforces the policy regardless of prompt wording, closing the loophole of editing or ignoring a comment. Stronger prompt wording (A) remains advisory and still only a prompt-level instruction. Self-reporting (C) relies on the same bypassable honor system. More frequent re-reviews (D) doesn't add any enforcement mechanism."
        },
        {
          id: "P9-S5-Q13",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "Ridgeline Motors' post_pr_comment MCP tool currently returns a bare \"request failed\" string for every failure, whether the cause is a transient network timeout, an expired auth token, or a comment body exceeding the platform's character limit. Claude's responses to failures are inconsistent as a result, sometimes retrying a non-retryable failure and sometimes giving up on a retryable one. What change to the tool's error response would most improve this?",
          options: [
            { key: "A", text: "Return structured error responses including an errorCategory (e.g. transient_network, auth_expired, payload_too_large) and an isRetryable flag, so Claude can decide correctly whether to retry, refresh credentials, or truncate the comment." },
            { key: "B", text: "Keep the bare string but make it longer and more apologetic in tone." },
            { key: "C", text: "Have the tool silently retry every failure internally up to five times before ever returning control to Claude." },
            { key: "D", text: "Stop returning any error information at all and have the tool return an empty success response instead." }
          ],
          correct: ["A"],
          explanation: "A structured error response with an explicit category and retryability flag gives Claude the exact information needed to choose the correct recovery action per failure type. A longer but still unstructured string (B) doesn't add actionable distinctions. Silent internal retries (C) waste time on non-retryable failures like payload-too-large. Suppressing errors entirely (D) hides real failures from the agent and the user."
        },
        {
          id: "P9-S5-Q14",
          domain: 3,
          task: "3.6",
          type: "multiple",
          select: 2,
          stem: "Ridgeline Motors' automated test-generation step frequently suggests test cases that duplicate scenarios already covered by the existing test suite, and often proposes low-value tests (e.g., asserting that a getter returns what was just set) instead of meaningful edge cases. Which two changes would most effectively improve the quality and relevance of generated tests? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct the model to \"generate as many tests as possible\" to maximize the chance that some are valuable." },
            { key: "B", text: "Disable test generation for any file that already has any existing tests, regardless of coverage gaps." },
            { key: "C", text: "Ask the model to generate tests without seeing any existing code, so its suggestions are not biased by current implementation details." },
            { key: "D", text: "Provide the existing test files in context so the generation step can see what scenarios are already covered and avoid duplicating them." },
            { key: "E", text: "Document testing standards, examples of valuable test criteria, and available fixtures in CLAUDE.md so the generation step has clear guidance on what counts as a worthwhile test." }
          ],
          correct: ["D", "E"],
          explanation: "Providing existing tests in context prevents duplicate suggestions, and documenting standards and fixtures in CLAUDE.md steers generation toward genuinely valuable tests. Generating more tests indiscriminately (A) increases volume without addressing value and likely worsens low-value output. Blanket-disabling generation for any partially tested file (B) blocks valid new coverage. Hiding existing code from the model (C) removes context it needs to avoid duplication at all."
        },
        {
          id: "P9-S5-Q15",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Developers at Ridgeline Motors frequently disagree with Claude's severity labels on CI findings: a null-pointer risk in a logging-only code path is sometimes labeled \"critical\" while a similar risk in the braking control path is sometimes labeled \"minor,\" undermining trust in which findings deserve urgent human review. What change would most improve consistency of severity classification so human attention is routed correctly?",
          options: [
            { key: "A", text: "Define explicit severity criteria in the prompt with concrete code examples illustrating what qualifies as critical, major, and minor for this codebase, rather than leaving severity to the model's unguided judgment." },
            { key: "B", text: "Remove severity labels entirely and have developers triage every finding manually instead." },
            { key: "C", text: "Instruct the model to default to \"major\" for any finding it isn't fully confident about." },
            { key: "D", text: "Add a numeric 1-10 confidence score alongside each finding so developers can infer severity themselves." }
          ],
          correct: ["A"],
          explanation: "Defining explicit severity criteria with concrete code examples for each level produces consistent classification, directly addressing the mismatched labels observed here. Removing severity labels (B) discards useful triage information instead of fixing it. Defaulting uncertain findings to \"major\" (C) doesn't define what each level actually means. A confidence score (D) conflates confidence with severity, which are different dimensions of a finding."
        }
      ]
    },
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P9-S6-Q1",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press ingests manuscripts from journals, conference proceedings, and preprint servers, each requiring a different extraction schema (journal_article_schema, conference_paper_schema, preprint_schema). When a new document arrives, the pipeline cannot always tell in advance which schema applies. What tool_choice configuration should the initial extraction call use?",
          options: [
            { key: "A", text: "tool_choice: \"any\", so the model is required to call one of the three schema-specific extraction tools (guaranteeing structured output) while still choosing which one fits the document." },
            { key: "B", text: "tool_choice: \"auto\", so the model can return conversational text describing the document type before extraction." },
            { key: "C", text: "A forced tool_choice naming journal_article_schema as the default, since defaulting to the statistically most common schema is assumed to produce fewer errors than requiring the model to actively determine which schema the document matches." },
            { key: "D", text: "No tool_choice configuration, relying on the system prompt to instruct the model to \"always call a tool,\" since a prompt-level instruction is assumed to produce the same guaranteed tool invocation as an explicit tool_choice setting." }
          ],
          correct: ["A"],
          explanation: "tool_choice: \"any\" guarantees the model calls one of the available extraction tools rather than returning text, while still letting it select the schema matching the actual document type, which is exactly needed when the document type is unknown upfront. \"auto\" (B) allows a text-only response instead of guaranteed extraction. Forcing a specific schema (C) would misclassify non-journal documents. Omitting tool_choice and relying on prompt wording (D) is probabilistic, not guaranteed."
        },
        {
          id: "P9-S6-Q2",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press's pipeline first extracts core bibliographic metadata (title, authors, DOI) using an extract_metadata tool, then runs enrichment tools (extract_funding_sources, extract_citation_network) that depend on the metadata already being extracted. Occasionally the model calls an enrichment tool before extract_metadata has run, producing enrichment records with no linked metadata. What configuration guarantees the correct order?",
          options: [
            { key: "A", text: "Add a system prompt instruction stating \"always call extract_metadata before any enrichment tool,\" since a direct prompt instruction is assumed to reliably enforce ordering across tool calls just as effectively as a mechanical tool_choice constraint." },
            { key: "B", text: "Use tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"} to force that specific tool on the first turn, then process the enrichment tools in a follow-up turn." },
            { key: "C", text: "Set tool_choice: \"any\" on the first turn so the model is forced to call some tool, any tool, before continuing." },
            { key: "D", text: "Rename the enrichment tools to begin with \"zz_\" so they sort after extract_metadata alphabetically in the tool list, since alphabetical ordering in a tool definitions array is assumed to influence the sequence in which the model chooses to invoke them." }
          ],
          correct: ["B"],
          explanation: "A forced tool_choice naming extract_metadata guarantees it runs first on that turn, after which enrichment tools can be processed in a follow-up turn with guaranteed ordering. A prompt instruction alone (A) is probabilistic and is exactly the failure already observed. tool_choice: \"any\" (C) guarantees some tool is called but not which one, so an enrichment tool could still run first. Alphabetical tool naming (D) has no effect on model tool-selection order."
        },
        {
          id: "P9-S6-Q3",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press's peer_review_status field is defined as an enum with values \"peer_reviewed\", \"not_peer_reviewed\", and \"preprint\". For several conference submissions, the source document doesn't clearly state whether peer review occurred, and the model has started guessing, sometimes incorrectly labeling ambiguous cases as \"peer_reviewed\". What schema change would best address this?",
          options: [
            { key: "A", text: "Remove the peer_review_status field entirely since it cannot always be determined with certainty." },
            { key: "B", text: "Change the field type from enum to free-text string, since open-ended prose is assumed to capture nuanced uncertainty more faithfully than any fixed enum value could, regardless of downstream processing needs." },
            { key: "C", text: "Add an \"unclear\" enum value so the model can honestly represent ambiguous cases instead of guessing among the three definitive values." },
            { key: "D", text: "Set the field to required with a default value of \"not_peer_reviewed\" for any ambiguous case, since silently defaulting to one of the existing enum values is assumed to be functionally equivalent to honestly flagging the case as undetermined." }
          ],
          correct: ["C"],
          explanation: "Adding an \"unclear\" enum value gives the model an honest, structured way to represent genuine ambiguity instead of guessing among definitive values. Removing the field (A) loses information for the many cases where it is determinable. A free-text field (B) sacrifices the structured enum's downstream usability. Defaulting ambiguous cases to a specific value (D) silently fabricates a determination that wasn't actually made."
        },
        {
          id: "P9-S6-Q4",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Source documents at Lexicon Scholarly Press express publication dates inconsistently \u2014 \"March 2023\", \"2023-03-15\", \"15/03/2023\", and \"Spring 2023 issue\" \u2014 and the extraction schema defines publication_date as a strict ISO 8601 date string. Extractions frequently fail schema validation or silently produce incorrect dates. What should be added alongside the strict schema to address this?",
          options: [
            { key: "A", text: "Change the schema field type from a strict date string to an open-ended free-text string, since accepting any input format unchanged is assumed simpler than defining explicit interpretation rules for every date variant the source documents might contain." },
            { key: "B", text: "Remove the publication_date field from the schema since source formats are too inconsistent to standardize." },
            { key: "C", text: "Ask the model to \"guess the most likely date\" whenever the source format doesn't match ISO 8601 exactly, since a general instruction to guess is assumed to produce the same consistent interpretation as explicit rules for each date variant." },
            { key: "D", text: "Include format normalization rules in the prompt (e.g., how to interpret month-only, day-first, and seasonal date references) so the model consistently converts varied source formats to the required ISO 8601 output." }
          ],
          correct: ["D"],
          explanation: "Format normalization rules alongside a strict output schema tell the model exactly how to interpret varied source formats (month-only, day-first, seasonal) and consistently convert them to the required ISO 8601 output. Loosening the schema to free text (A) defeats the purpose of a validated structured field. Removing the field (B) discards useful data most documents do contain. Asking the model to \"guess\" (C) is vague and doesn't define the actual interpretation rules needed."
        },
        {
          id: "P9-S6-Q5",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press's schema marks funding_source as a required field. For manuscripts with no funding disclosure section, the model has started fabricating plausible-sounding funding bodies (e.g., inventing a grant number) rather than leaving the field empty. What schema change best prevents this?",
          options: [
            { key: "A", text: "Add a confidence score alongside funding_source so fabricated values can be filtered out after the fact." },
            { key: "B", text: "Keep funding_source required, but add a note asking the model to \"only report real funding sources,\" since a direct admonition against fabrication is assumed to override the structural pressure a required field places on the model." },
            { key: "C", text: "Make funding_source optional/nullable so the model can return null when a document contains no funding disclosure, rather than being forced to fabricate a value to satisfy a required field." },
            { key: "D", text: "Replace funding_source with a boolean has_funding field so the model no longer needs to name a source." }
          ],
          correct: ["C"],
          explanation: "Designing optional/nullable fields for information that may not exist in the source prevents the model from being forced to fabricate a value just to satisfy a required field. A prompt note alone (B) doesn't remove the structural pressure of a required field. A confidence score (A) treats the symptom after the fact instead of preventing fabrication. Replacing the field with a boolean (D) discards useful information for the many documents that do disclose funding."
        },
        {
          id: "P9-S6-Q6",
          domain: 4,
          task: "4.2",
          type: "multiple",
          select: 2,
          stem: "Lexicon Scholarly Press notices that when a manuscript's author-affiliation section is formatted as a table instead of inline prose, the model frequently returns null for the required affiliation field even though the information is clearly present in the table. Which two changes would most directly address this? (Select TWO.)",
          options: [
            { key: "A", text: "Remove the requirement that affiliation be a required field, so the model is never forced to attempt extraction from tables." },
            { key: "B", text: "Add few-shot examples showing correct extraction of affiliation data specifically from table-formatted source sections, alongside the existing prose-format examples." },
            { key: "C", text: "Increase the character limit on the affiliation field so longer affiliation strings can be captured." },
            { key: "D", text: "Add a few-shot example showing a case where a field is genuinely absent from the source (correctly returning null) alongside the table-format extraction examples, so the model distinguishes \"absent\" from \"present but differently formatted.\"" },
            { key: "E", text: "Ask the model to summarize the entire document in one paragraph before attempting any field extraction." }
          ],
          correct: ["B", "D"],
          explanation: "Few-shot examples covering the table-format case teach the model to recognize affiliation data regardless of layout, while a contrasting genuinely-absent example reinforces when null is actually correct, together reducing both false nulls and false fabrication. Removing the requirement (A) works around the symptom instead of fixing recognition. A character limit increase (C) doesn't address format recognition at all. An unrelated summarization step (E) doesn't target the extraction failure."
        },
        {
          id: "P9-S6-Q7",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press's extraction prompt includes a prose description of citation formats to expect: \"citations may appear inline or in a bibliography.\" In practice, inline-citation-only manuscripts frequently have their citations missed entirely, while bibliography-style manuscripts extract correctly. What change would most reliably fix extraction for the inline-citation case?",
          options: [
            { key: "A", text: "Expand the prose description with more adjectives emphasizing that inline citations are \"equally important\" to extract, since stronger emphasis is assumed functionally equivalent to providing a concrete worked example of the pattern currently missed." },
            { key: "B", text: "Add few-shot examples specifically demonstrating correct citation extraction from an inline-citation-only manuscript, alongside the existing bibliography-style example." },
            { key: "C", text: "Remove the bibliography-style example so the model focuses exclusively on the more frequently failing inline case." },
            { key: "D", text: "Add a post-processing regex step that scans the raw text for citation-like patterns after extraction completes." }
          ],
          correct: ["B"],
          explanation: "Few-shot examples demonstrating correct extraction from varied document structures, here an inline-citation-only manuscript alongside the existing bibliography-style example, directly address this structural failure mode. More emphatic prose (A) doesn't give the model a concrete pattern to follow. Removing the working bibliography example (C) would likely regress that case instead of fixing the inline one. A regex post-processing step (D) is brittle and bypasses the extraction pipeline's reasoning entirely."
        },
        {
          id: "P9-S6-Q8",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Some manuscripts at Lexicon Scholarly Press describe their research methodology in a dedicated \"Methods\" section, while others embed methodological details throughout the introduction and results sections with no dedicated section at all. The extraction pipeline reliably captures methodology_summary only for the dedicated-section case. What is the most effective fix?",
          options: [
            { key: "A", text: "Require all manuscripts to be reformatted with a dedicated Methods section before submission, since a uniform intake requirement is assumed reasonable regardless of how many external authors and publishers would need to comply." },
            { key: "B", text: "Lower the methodology_summary field to optional so it is simply skipped for manuscripts without a dedicated section." },
            { key: "C", text: "Add a few-shot example demonstrating correct methodology_summary extraction from a manuscript where methodological details are embedded throughout the text rather than isolated in a dedicated section." },
            { key: "D", text: "Instruct the model to search specifically for a heading containing the word \"Methods\" before attempting extraction." }
          ],
          correct: ["C"],
          explanation: "A few-shot example demonstrating correct extraction from the embedded-details structure directly teaches the model to handle that varied document structure, matching the technique used for inline citations versus bibliographies. Requiring reformatted submissions (A) isn't feasible for an external document intake system. Making the field optional (B) loses data that is genuinely present, just differently structured. Searching for a \"Methods\" heading (D) fails exactly for manuscripts that have no such heading."
        },
        {
          id: "P9-S6-Q9",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press ingests manuscripts from three different publisher submission systems, each of which exposes a fetch_manuscript MCP tool that returns metadata in a different shape: one nests author names under authors[].full_name, another under authors[].name, and the third returns a single contributors string that mixes authors and editors together. Claude's extraction accuracy drops whenever it has to reconcile these shapes inline mid-task. What should be done before the extraction step reasons over the fetched manuscript?",
          options: [
            { key: "A", text: "Register a PostToolUse hook on each fetch_manuscript tool that normalizes the author/contributor data into one consistent shape (e.g. authors: [{name, role}]) before the extraction step runs." },
            { key: "B", text: "Add a CLAUDE.md note describing all three submission systems' shapes and trust the model to reconcile them correctly each time." },
            { key: "C", text: "Ask the publishers to agree on a single submission format, and extract nothing until they comply." },
            { key: "D", text: "Increase the extraction step's context window so it can hold all three raw shapes simultaneously." }
          ],
          correct: ["A"],
          explanation: "A PostToolUse hook deterministically normalizes the heterogeneous author/contributor shapes into one consistent structure before the model reasons over them, which is exactly the intercept-and-normalize role hooks play. A CLAUDE.md note (B) is a probabilistic prompt-level instruction with no guarantee of correct reconciliation every time. Waiting on publisher format agreement (C) isn't practical or within the team's control. A larger context window (D) doesn't fix inconsistent structure, only holds more of it."
        },
        {
          id: "P9-S6-Q10",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press's extraction pipeline has a coordinator agent that dispatches one subagent per manuscript to extract metadata, then a separate subagent to cross-check extracted citations against a reference database. The team wants each per-manuscript extraction to stay isolated so that one manuscript's unusual formatting quirks don't influence another manuscript's extraction in the same batch. Which design choice best ensures this isolation?",
          options: [
            { key: "A", text: "Have all manuscripts processed by one long-running subagent that handles them sequentially in a single shared context." },
            { key: "B", text: "Give the coordinator a single shared scratchpad that every per-manuscript subagent reads from and writes to." },
            { key: "C", text: "Spawn a fresh subagent instance per manuscript, each with its own isolated context window, and have the coordinator pass only that manuscript's data into its invocation." },
            { key: "D", text: "Run all manuscripts in the coordinator's own context directly, without delegating to subagents at all." }
          ],
          correct: ["C"],
          explanation: "Spawning a fresh, isolated subagent per manuscript with only that manuscript's data passed in prevents one document's formatting quirks from leaking into another's extraction, which is the core benefit of the coordinator-subagent pattern. A single sequential subagent (A) shares context across manuscripts, risking exactly the cross-contamination described. A shared scratchpad (B) reintroduces shared state between manuscripts. Processing everything in the coordinator's own context (D) forfeits isolation and the parallelism benefit entirely."
        },
        {
          id: "P9-S6-Q11",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "Lexicon Scholarly Press's fetch_manuscript MCP tool currently returns a bare \"fetch failed\" string for every failure, whether the cause is the publisher's submission system being temporarily unreachable, an expired API credential, or a manuscript ID that simply doesn't exist in that system. Claude's responses to these failures are inconsistent as a result. Which two changes to the tool's error response would most improve this? (Select TWO.)",
          options: [
            { key: "A", text: "Return structured error responses including an errorCategory (e.g. transient_unavailable, auth_expired, not_found) so Claude can select the correct recovery action per failure type." },
            { key: "B", text: "Include an isRetryable flag alongside the category so Claude can distinguish failures worth retrying (temporary unavailability) from ones that are not (a manuscript ID that doesn't exist)." },
            { key: "C", text: "Keep the single \"fetch failed\" string but have Claude guess the cause based on how long the request took to fail." },
            { key: "D", text: "Have the tool automatically retry every failure internally up to ten times before ever returning control to Claude." },
            { key: "E", text: "Stop returning any error information at all and have the tool return an empty result instead so retries are unnecessary." }
          ],
          correct: ["A", "B"],
          explanation: "An explicit error category plus an isRetryable flag together give Claude the structured information needed to choose the correct recovery path for each distinct failure cause. Guessing from timing (C) is unreliable and not a substitute for structured data. Silent internal retries (D) waste time on non-retryable failures like a nonexistent manuscript ID. Suppressing errors entirely (E) hides real failures rather than resolving them."
        },
        {
          id: "P9-S6-Q12",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "Midway through a long extraction session for a batch of manuscripts, Lexicon Scholarly Press updates the JSON schema to add a new required field and the publisher sends a revised version of several source documents. The team wants to resume the session cleanly rather than restart the entire batch from scratch. What approach best supports this?",
          options: [
            { key: "A", text: "Resume the session from its last saved state, but first inject a structured summary noting the schema change and which documents were revised, so the resumed context reflects the new reality rather than stale assumptions." },
            { key: "B", text: "Resume the session exactly as it was paused, without any update, since schema and document changes are automatically detected on resume." },
            { key: "C", text: "Discard the paused session state entirely and restart the full batch from the first manuscript, even those already successfully extracted." },
            { key: "D", text: "Fork the session into two identical copies and apply the schema change to only one, keeping both in production simultaneously." }
          ],
          correct: ["A"],
          explanation: "Resuming with an injected structured summary of what changed keeps the session's context accurate without discarding prior progress, which is the core value of deliberate session resumption. Resuming with no update (B) risks the agent continuing to apply the old schema and stale document versions. Restarting the entire batch (C) wastes the work already completed on successfully extracted manuscripts. Forking into two diverging production copies (D) introduces inconsistency rather than cleanly continuing one workflow."
        },
        {
          id: "P9-S6-Q13",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "An extraction workflow needs to call a lookup_journal_impact_factor tool mid-task to enrich a manuscript's metadata before producing its final structured output, gathering the tool's result and incorporating it before deciding the extraction is complete. An engineer proposes implementing this as a Message Batches API job instead of an agentic loop to save cost. What is the correct evaluation?",
          options: [
            { key: "A", text: "The Batches API is the better fit, since batch processing is always cheaper regardless of what the workflow needs to do mid-task." },
            { key: "B", text: "An agentic loop is required here, since the task needs to gather context (the impact-factor lookup), take an action, and incorporate the result before iterating toward completion, which the Batches API's single-turn-per-request model doesn't support." },
            { key: "C", text: "Either approach works equally well, since impact-factor lookups never affect the final extracted output." },
            { key: "D", text: "The Batches API should be used, with the impact-factor tool called in a completely separate, unrelated batch job afterward." }
          ],
          correct: ["B"],
          explanation: "The need to gather context via a tool call, act on it, and incorporate the result before finishing the task is exactly the gather-act-verify-iterate pattern of an agentic loop, which the Batches API's single-turn-per-request design does not support mid-request. Assuming batch processing is always preferable (A) ignores this functional requirement. Claiming the lookup never affects output (C) contradicts the stated enrichment purpose. A disconnected follow-up batch job (D) doesn't restore the mid-task incorporation the workflow needs."
        },
        {
          id: "P9-S6-Q14",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Lexicon Scholarly Press reports 97% overall extraction accuracy and is considering reducing human review further to cut costs. A closer look shows that while journal-article extractions are 99% accurate, conference-proceedings extractions are only 84% accurate, and this gap was invisible in the aggregate figure. What should the team do before reducing human review?",
          options: [
            { key: "A", text: "Reduce human review uniformly across all document types, since the 97% aggregate figure already exceeds the team's quality bar." },
            { key: "B", text: "Reduce human review only for conference proceedings, since journal articles are already performing above target." },
            { key: "C", text: "Increase the overall required accuracy threshold to 99% and treat any extraction below that as a hard failure requiring reprocessing." },
            { key: "D", text: "Analyze accuracy by document type and field to confirm consistent performance across all segments, since an aggregate accuracy figure can mask poor performance on specific document types like conference proceedings." }
          ],
          correct: ["D"],
          explanation: "Aggregate accuracy metrics can mask poor performance on specific document types or fields, so validating accuracy by document type and field is necessary before reducing review on any segment. Reducing review uniformly (A) would compound the exact blind spot just discovered. Reducing review specifically for the worse-performing segment (B) is backwards. Raising the threshold to a hard pass/fail gate (C) doesn't address the underlying per-type accuracy gap."
        },
        {
          id: "P9-S6-Q15",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "Lexicon Scholarly Press gives Claude two extraction tools, extract_table_data (pulls values from a table into structured rows) and extract_financial_summary (produces a rolled-up summary of funding and budget figures for the whole manuscript), but both are described only as \"extracts data from the document,\" and Claude frequently calls the wrong one or calls both redundantly. Which two changes would most reliably fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Rewrite each tool's description to state its distinct scope and output: extract_table_data for row-level values from a specific table, extract_financial_summary for a document-wide rolled-up financial overview." },
            { key: "B", text: "Document in each description when the other tool should be used instead, so Claude can distinguish a request for one specific table from a request for an overall financial rollup." },
            { key: "C", text: "Merge the two tools into a single tool so Claude never has to choose between them again." },
            { key: "D", text: "Rename extract_financial_summary to extract_financial_summary_v2 so Claude treats it as the newer, preferred option." },
            { key: "E", text: "Remove extract_table_data from the toolset so only extract_financial_summary remains available." }
          ],
          correct: ["A", "B"],
          explanation: "Clear, differentiated descriptions stating each tool's distinct scope and output, including when to prefer the other tool, give the model the disambiguating information it needs to choose correctly. Merging the tools (C) loses the distinct row-level extraction capability. A version-style rename (D) adds no disambiguating information. Removing one tool (E) eliminates needed functionality rather than fixing the description."
        }
      ]
    }
  ]
});
