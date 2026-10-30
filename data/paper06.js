window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 6,
  title: "Mock Exam 6",
  scenarios: [
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P6-S2-Q1",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Lumenforge Games wants a /balance-check slash command (runs an internal lint over gameplay balancing config files) to be available automatically to every engineer who clones the monorepo, without each developer manually installing anything. Where should the command file be created?",
          options: [
            { key: "A", text: "In .claude/commands/balance-check.md within the project repository, so it is version-controlled and distributed automatically with the repo." },
            { key: "B", text: "In ~/.claude/commands/balance-check.md in each engineer's home directory., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "C", text: "In CLAUDE.md at the project root, defining the command inline." },
            { key: "D", text: "In a .claude/config.json file listing the command under a \"commands\" array., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." }
          ],
          correct: ["A"],
          explanation: "Project-scoped slash commands belong in .claude/commands/ inside the repository, so they are version-controlled and available to every developer who clones or pulls it. Option B is personal, per-machine, and not shared automatically. CLAUDE.md (C) holds project context and instructions, not command definitions. Option D describes a configuration mechanism that does not exist in Claude Code."
        },
        {
          id: "P6-S2-Q2",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "While iterating on a failing integration test, an engineer's Claude Code session runs the project's build command after every fix attempt. Each run appends the full build log (dependency resolution output, asset bundling steps, hundreds of lines) to the conversation, even though only the final failing test's name and stack trace are relevant to the fix. After a dozen iterations, the session is close to running out of context despite the underlying bug being simple. What is the most effective change?",
          options: [
            { key: "A", text: "Reduce the number of fix attempts allowed before stopping, regardless of whether the bug is fixed., because it requires no new tooling and can be rolled out immediately without further review." },
            { key: "B", text: "Trim each build-log tool result to only the fields relevant to the task (e.g., the failing test name and its stack trace) before it accumulates in context." },
            { key: "C", text: "Ask Claude to summarize the entire build log in one sentence after every run." },
            { key: "D", text: "Switch to a model with a larger context window so the full logs can keep accumulating., because it requires no new tooling and can be rolled out immediately without further review." }
          ],
          correct: ["B"],
          explanation: "Tool results accumulate in context disproportionately to their relevance; trimming verbose output to only the relevant fields prevents this waste. An arbitrary iteration cap (A) is an unrelated anti-pattern for loop termination, not a context-management fix. Repeated full-log summarization (C) still spends tokens re-processing irrelevant content every iteration. A larger context window (D) delays the problem without addressing the actual waste."
        },
        {
          id: "P6-S2-Q3",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Lumenforge's shader files (anything matching *.shader or *.hlsl) must follow a strict performance-budget commenting convention, while gameplay C# scripts follow a different review checklist entirely. Shader and gameplay files are intermixed across many feature folders rather than isolated in one directory. What is the best way to have Claude Code apply the correct convention automatically based on file type rather than location?",
          options: [
            { key: "A", text: "Maintain two separate top-level CLAUDE.md files, one documenting shader conventions and one documenting gameplay conventions., as this is the simplest change to implement without touching established conventions." },
            { key: "B", text: "Add both convention sets to the root CLAUDE.md under two headings and rely on Claude to infer which one applies., as this is the simplest change to implement without touching established conventions." },
            { key: "C", text: "Create .claude/rules/ files with YAML frontmatter specifying glob patterns such as paths: [\"**/*.shader\", \"**/*.hlsl\"] and paths: [\"**/*.cs\"] respectively." },
            { key: "D", text: "Create a skill in .claude/skills/ for shaders that must be manually invoked before editing any shader file." }
          ],
          correct: ["C"],
          explanation: ".claude/rules/ with glob-pattern frontmatter applies conventions based on file type regardless of directory, which is exactly what scattered shader and gameplay files require. Two top-level CLAUDE.md files (A) can't both apply at the project root without conflict. Relying on inference (B) is unreliable. A manually invoked skill (D) is not automatic and depends on the engineer remembering to run it."
        },
        {
          id: "P6-S2-Q4",
          domain: 3,
          task: "3.3",
          type: "multiple",
          select: 2,
          stem: "Lumenforge is deciding between two mechanisms to apply file-type-specific conventions across a monorepo where matching files are scattered across many directories: .claude/rules/ with glob-based YAML frontmatter, or placing a CLAUDE.md file in every subdirectory that might contain a matching file. Which TWO statements correctly describe the tradeoffs? (Select TWO.)",
          options: [
            { key: "A", text: "Subdirectory CLAUDE.md files automatically inherit any glob-based scoping defined in .claude/rules/, so the two mechanisms must be configured together." },
            { key: "B", text: ".claude/rules/ glob patterns match files by pattern regardless of directory, making them a better fit when matching files are scattered across the codebase." },
            { key: "C", text: "Subdirectory CLAUDE.md files are the recommended mechanism specifically because file type, not location, determines which conventions apply." },
            { key: "D", text: "Maintaining a separate CLAUDE.md in every directory that might contain shader or gameplay files duplicates content and becomes harder to keep consistent as new folders are added." },
            { key: "E", text: ".claude/rules/ frontmatter cannot express glob patterns, only exact file paths, so it cannot handle files added later." }
          ],
          correct: ["B", "D"],
          explanation: ".claude/rules/ matches by glob pattern independent of directory (B), while subdirectory CLAUDE.md files are location-bound and duplicate content across many folders as the codebase grows (D). Option A describes a nonexistent inheritance mechanism. Option C reverses the actual logic, since CLAUDE.md is directory-scoped, not file-type-scoped. Option E is factually wrong; .claude/rules/ frontmatter supports glob patterns."
        },
        {
          id: "P6-S2-Q5",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "Lumenforge is migrating its multiplayer networking layer from a custom UDP protocol to a third-party netcode library across roughly 60 gameplay and engine files, with open questions about how existing prediction/rollback logic should map onto the new library's API. Which approach should the lead engineer take when starting this work with Claude Code?",
          options: [
            { key: "A", text: "Begin direct execution immediately, since Claude Code can reveal the right service boundaries as changes are made file by file." },
            { key: "B", text: "Write comprehensive upfront instructions detailing exactly how every file should be changed, then run direct execution." },
            { key: "C", text: "Start with direct execution and only switch to plan mode if unexpected complexity appears partway through." },
            { key: "D", text: "Enter plan mode first to explore the current networking code, evaluate migration approaches, and settle on a design before making any changes." }
          ],
          correct: ["D"],
          explanation: "Plan mode is designed for exactly this kind of large-scale, multi-file change with open architectural questions, letting the team explore and decide before committing to edits. Option A risks costly rework once dependencies surface mid-migration. Option B assumes the right structure is already known without exploration. Option C ignores that the complexity is already evident upfront, not something that might emerge later."
        },
        {
          id: "P6-S2-Q6",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "While investigating how asset loading works before a planned refactor, an engineer's Claude Code session accumulates thousands of lines of file listings and intermediate search output while scanning the asset pipeline, leaving little context budget for the actual refactor afterward. What should the engineer do differently next time?",
          options: [
            { key: "A", text: "Delegate the verbose discovery phase to the Explore subagent so only a concise summary of findings returns to the main conversation." },
            { key: "B", text: "Increase the model's context window setting before starting the investigation." },
            { key: "C", text: "Ask Claude to summarize its own prior output every few turns to keep the transcript shorter., given that it avoids extra engineering overhead and can be verified quickly in a local environment." },
            { key: "D", text: "Run the discovery phase in a completely separate CLAUDE.md file instead of the conversation., given that it avoids extra engineering overhead and can be verified quickly in a local environment." }
          ],
          correct: ["A"],
          explanation: "The Explore subagent exists specifically to isolate verbose discovery output and return only a summary, preserving the main conversation's context budget for implementation. Option B is not a configurable setting available to the engineer. Option C still consumes context with repeated summarization turns. Option D misuses CLAUDE.md, which holds project context, not a place to run investigation steps."
        },
        {
          id: "P6-S2-Q7",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An engineer spent a full day using Claude Code under the session name \"inventory-refactor\" analyzing the crafting inventory system before starting implementation the next morning. No files have changed since the session ended. What is the most reliable way to continue exactly where they left off?",
          options: [
            { key: "A", text: "Start a brand-new session and paste in a short summary of yesterday's findings from memory., since it reuses infrastructure the team already understands and trusts." },
            { key: "B", text: "Run claude --resume inventory-refactor to continue the named session with its full prior context intact." },
            { key: "C", text: "Use fork_session to branch a new independent exploration from the prior session." },
            { key: "D", text: "Re-run the original exploration commands to regenerate the same analysis from scratch., since it reuses infrastructure the team already understands and trusts." }
          ],
          correct: ["B"],
          explanation: "--resume <session-name> continues a specific named prior conversation with its context intact, which is the most reliable option when nothing relevant has changed. Option A risks losing details a memory-based summary would omit. fork_session (C) is for branching divergent approaches, not simple continuation. Option D wastes effort redoing work that is still valid."
        },
        {
          id: "P6-S2-Q8",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "After a shared codebase analysis of the save-game serialization module, two engineers want to independently explore two different refactoring approaches — one replacing the format with JSON, the other with a binary schema — without either exploration affecting the other's context. What should they do?",
          options: [
            { key: "A", text: "Resume the same named session twice in parallel terminals." },
            { key: "B", text: "Start two unrelated sessions from scratch and manually recreate the shared analysis in each., because it minimizes the number of files that need to change for this release." },
            { key: "C", text: "Use fork_session to create two independent branches from the shared analysis baseline, one per approach." },
            { key: "D", text: "Use /compact on the shared session before each engineer begins their own exploration., because it minimizes the number of files that need to change for this release." }
          ],
          correct: ["C"],
          explanation: "fork_session is designed for exactly this case: creating independent branches from a shared analysis baseline so divergent approaches can be explored without cross-contamination. Resuming the same session twice (A) would let one engineer's changes affect the other's context. Option B discards the value of the shared baseline. /compact (D) only reduces context size; it does not create independent branches."
        },
        {
          id: "P6-S2-Q9",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "An engineer spends several days investigating Lumenforge's save-game serialization module across separate Claude Code sessions. By the third day, the agent starts giving inconsistent answers about which classes own versioning logic, at one point describing \"typical patterns\" instead of the specific classes it identified on day one. What should the engineer do to counteract this?",
          options: [
            { key: "A", text: "Start every new session completely fresh with no reference to prior findings, to avoid carrying forward stale conclusions." },
            { key: "B", text: "Increase max_tokens so more raw exploration output can remain in context across sessions." },
            { key: "C", text: "Have the agent maintain a scratchpad file recording key findings (specific class names and responsibilities) and reference it when answering later questions." },
            { key: "D", text: "Ask the agent to rely on general software-engineering conventions instead of memorizing specific class names." }
          ],
          correct: ["C"],
          explanation: "Scratchpad files persist key findings across context boundaries, directly countering the context degradation described. Starting completely fresh (A) discards valid prior findings instead of preserving them. Increasing max_tokens (B) doesn't fix degrading answer quality. Relying on general conventions (D) is the exact symptom to avoid, not a fix."
        },
        {
          id: "P6-S2-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "A new loot-drop probability function keeps producing subtly wrong distributions across several rounds of prompt-only correction. What is the most effective way to drive the implementation toward a correct result?",
          options: [
            { key: "A", text: "Write a test suite covering expected distributions, edge cases, and performance requirements first, then iterate by sharing each failing test's output with Claude." },
            { key: "B", text: "Ask Claude to rate its own confidence in the implementation after each attempt and keep iterating until confidence is reported as high., as this defers the harder design questions to a later iteration instead of addressing them now." },
            { key: "C", text: "Rewrite the original instruction with more emphatic language demanding correctness." },
            { key: "D", text: "Increase the number of iterations allowed before accepting the current implementation., as this defers the harder design questions to a later iteration instead of addressing them now." }
          ],
          correct: ["A"],
          explanation: "Test-driven iteration gives concrete, falsifiable feedback — sharing specific failing-test output guides progressive correction far more reliably than prose adjustments. Self-reported confidence (B) is poorly calibrated and doesn't verify correctness. Emphatic rewording (C) adds no new information. Simply allowing more iterations (D) without structured feedback doesn't guarantee convergence on a correct result."
        },
        {
          id: "P6-S2-Q11",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "During a multi-phase investigation of the asset-streaming pipeline, an engineer's Claude Code session has accumulated so much verbose discovery output (file listings, intermediate search results) that the context window is nearly full, even though the investigation isn't finished. What is the most direct way to continue working within this same session without losing the findings already established?",
          options: [
            { key: "A", text: "Start an entirely new session and manually re-type a summary of everything found so far from memory." },
            { key: "B", text: "Switch models mid-session to one with a larger context window." },
            { key: "C", text: "Ask the agent to stop performing any further tool calls for the rest of the investigation." },
            { key: "D", text: "Use /compact to reduce context usage while retaining the essential findings from the session so far." }
          ],
          correct: ["D"],
          explanation: "/compact is designed to reduce context usage during extended exploration sessions when verbose discovery output has filled the window, while preserving the session's essential findings. Starting over from memory (A) risks losing details a manual summary would omit. Switching models mid-session (B) isn't how Claude Code context management works. Halting tool calls entirely (C) doesn't free existing context and blocks further investigation."
        },
        {
          id: "P6-S2-Q12",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "During review, Claude Code flags three issues in the new matchmaking queue: a race condition in queue insertion, a stale lock read caused by the same underlying mutex misuse, and a timeout value that's too short given that same fix. The three issues are tightly interdependent. What's the most effective way to communicate them for correction?",
          options: [
            { key: "A", text: "Open three sequential, separate conversations, one per issue, to keep each fix isolated., given that it appears to reduce short-term maintenance burden on the on-call engineer." },
            { key: "B", text: "Report only the most severe issue first and withhold the others until it's fixed., given that it appears to reduce short-term maintenance burden on the on-call engineer." },
            { key: "C", text: "Describe all three interacting issues together in a single detailed message so Claude can address them cohesively." },
            { key: "D", text: "Ask Claude to guess which issues are related without stating the connection." }
          ],
          correct: ["C"],
          explanation: "When issues interact (as with the shared mutex misuse here), addressing them together in one detailed message lets Claude account for their interdependence. Splitting them into separate sequential conversations (A) or withholding information (B) risks fixes that don't account for the shared root cause. Letting Claude guess the connection (D) is unreliable when the relationship is already known."
        },
        {
          id: "P6-S2-Q13",
          domain: 3,
          task: "3.2",
          type: "multiple",
          select: 2,
          stem: "Lumenforge creates a project-scoped skill in .claude/skills/asset-audit/SKILL.md to run a verbose, multi-step audit of texture compression settings without polluting the main conversation, restricting it to only the Read and Bash tools, and documenting that it expects an optional folder-path argument. Which TWO SKILL.md frontmatter fields accomplish this? (Select TWO.)",
          options: [
            { key: "A", text: "context: fork — runs the skill in an isolated forked context so verbose audit output doesn't pollute the main conversation." },
            { key: "B", text: "retries: 3 — automatically reruns the skill up to three times if the audit fails." },
            { key: "C", text: "allowed-tools: Read, Bash — restricts the skill to only the tools it needs." },
            { key: "D", text: "argument-hint: <optional> — a built-in validator that rejects invalid folder paths at parse time." },
            { key: "E", text: "cache: true — stores the audit results so the skill does not need to be re-invoked." }
          ],
          correct: ["A", "C"],
          explanation: "context: fork isolates verbose skill output from the main conversation, and allowed-tools restricts the skill to the specific tools it needs. argument-hint is a real frontmatter field, but it is a documentation hint for argument usage, not a validator, which makes D's description incorrect. retries and cache (B, E) are not SKILL.md frontmatter fields."
        },
        {
          id: "P6-S2-Q14",
          domain: 5,
          task: "5.1",
          type: "multiple",
          select: 2,
          stem: "During a long Claude Code session planning the economy rebalance, the engineer periodically summarizes the conversation to save context. After several rounds of summarization, specific numbers — like the exact gold cost of the tier-3 blacksmith upgrade (1,240) — get flattened into vague statements like \"upgrade costs were adjusted.\" Which TWO practices would most effectively prevent this loss? (Select TWO.)",
          options: [
            { key: "A", text: "Summarize more aggressively and more frequently so each summary is shorter." },
            { key: "B", text: "Rely on the model's larger context window to avoid needing summarization in the first place." },
            { key: "C", text: "Extract transactional facts such as exact costs, item names, and thresholds into a persistent \"case facts\" block included in every prompt, outside the summarized history." },
            { key: "D", text: "Ask Claude to self-report a confidence score for whether its summary preserved important numbers." },
            { key: "E", text: "Place key numeric findings at the beginning of any long aggregated context rather than burying them in the middle of verbose prior discussion." }
          ],
          correct: ["C", "E"],
          explanation: "A persistent case-facts block preserves exact transactional values outside lossy summarization, and placing key numbers at the beginning of aggregated context counters the lost-in-the-middle effect. More aggressive summarization (A) worsens the problem. A larger context window (B) doesn't fix summarization-induced loss. Self-reported confidence (D) does not verify that specific numbers were actually preserved."
        },
        {
          id: "P6-S2-Q15",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A solo engineer configures an experimental build-shortcut command only they use by placing it in ~/.claude/commands/. Later, the studio wants every engineer to have access to a shared /release-checklist command going forward. Where should that studio-wide command live, and why?",
          options: [
            { key: "A", text: "In ~/.claude/commands/ on each engineer's machine, copied manually to every laptop., since it matches a pattern the team has used successfully in an unrelated part of the codebase." },
            { key: "B", text: "In CLAUDE.md, describing the command's steps in prose." },
            { key: "C", text: "In a .claude/config.json commands array checked into the repo., since it matches a pattern the team has used successfully in an unrelated part of the codebase." },
            { key: "D", text: "In .claude/commands/ inside the project repository so it is version-controlled and shared automatically with every clone." }
          ],
          correct: ["D"],
          explanation: "Studio-wide commands belong in the project's .claude/commands/ directory so they are version-controlled and distributed automatically to every developer. User-level ~/.claude/commands/ (A) is for personal, non-shared commands and requires manual, error-prone copying. CLAUDE.md (B) holds context and instructions, not executable command definitions. Option D's config.json mechanism does not exist in Claude Code."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P6-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Sentinel Grid Labs' threat-intelligence research system has a coordinator, a web-search subagent, a document-analysis subagent, and a synthesis subagent. An engineer proposes letting the document-analysis subagent call the web-search subagent directly whenever it needs an additional source, bypassing the coordinator, to reduce round trips. What is the strongest argument against this change?",
          options: [
            { key: "A", text: "It breaks the hub-and-spoke pattern, removing the coordinator's visibility into inter-subagent communication, consistent error handling, and overall information flow." },
            { key: "B", text: "Subagents are architecturally incapable of calling the Task tool, so the change is not technically possible." },
            { key: "C", text: "It would increase API costs because every subagent call is billed independently regardless of who initiates it." },
            { key: "D", text: "It would require the synthesis subagent to be retrained on the new communication pattern." }
          ],
          correct: ["A"],
          explanation: "Hub-and-spoke orchestration routes all inter-subagent communication through the coordinator so it retains observability, consistent error handling, and controlled information flow; direct subagent-to-subagent calls undermine all three. Option B is factually wrong as a blanket claim about capability. Option C misidentifies the core architectural concern as a cost issue. Option D invents a retraining requirement that doesn't apply to prompt-based agents."
        },
        {
          id: "P6-S3-Q2",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Sentinel Grid Labs runs its multi-agent system on the topic \"ransomware trends targeting healthcare.\" Every subagent completes successfully, but the final report covers only ransomware delivered via phishing email, entirely omitting trends in RDP exploitation, supply-chain compromise, and double-extortion tactics. The coordinator's logs show it decomposed the topic into \"phishing lures used in healthcare ransomware,\" \"email attachment analysis,\" and \"healthcare phishing awareness statistics.\" What is the most likely root cause?",
          options: [
            { key: "A", text: "The synthesis subagent failed to check the report for coverage gaps before finalizing it." },
            { key: "B", text: "The coordinator's task decomposition was too narrow, assigning subtasks that cover only one ransomware delivery vector instead of the full topic." },
            { key: "C", text: "The web-search subagent's queries were not broad enough and should be expanded independently of the decomposition., because it avoids a dependency on a component that is still being actively refactored." },
            { key: "D", text: "The document-analysis subagent applied overly strict relevance filters that excluded non-phishing sources., because it avoids a dependency on a component that is still being actively refactored." }
          ],
          correct: ["B"],
          explanation: "The coordinator's own logs show it only ever assigned phishing-related subtasks, so every subagent correctly completed the scope it was given — the scope itself was too narrow. Options A, C, and D each incorrectly blame downstream agents that performed correctly within the (too-narrow) assignments they received."
        },
        {
          id: "P6-S3-Q3",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "After refactoring the coordinator agent's configuration, Sentinel Grid Labs notices the coordinator now only ever answers directly instead of delegating to any subagents, even for broad research topics that clearly require multiple specialists. What is the most likely cause?",
          options: [
            { key: "A", text: "The subagents' AgentDefinitions no longer specify a system prompt., as this sidesteps the need to coordinate with another team before shipping." },
            { key: "B", text: "The web-search subagent's MCP server was removed from .mcp.json." },
            { key: "C", text: "The coordinator's allowedTools configuration no longer includes \"Task,\" so it cannot spawn subagents at all." },
            { key: "D", text: "The coordinator's context window is too small to hold subagent output., as this sidesteps the need to coordinate with another team before shipping." }
          ],
          correct: ["C"],
          explanation: "allowedTools must include \"Task\" for a coordinator to invoke the Task tool and spawn any subagents; without it, the coordinator can only answer directly, matching the symptom exactly. A missing subagent system prompt (A) would affect subagent behavior, not whether delegation happens at all. A missing MCP server (B) would break one subagent's tools, not all delegation. Context window size (D) does not prevent spawning subagents."
        },
        {
          id: "P6-S3-Q4",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "The synthesis subagent is producing reports that omit facts the web-search subagent clearly discovered earlier in the same research run, even though both ran within the same overall session. What's the most likely explanation?",
          options: [
            { key: "A", text: "The synthesis subagent's temperature setting is too low to incorporate new information., given that it can be implemented without waiting on an upcoming infrastructure migration., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "B", text: "The web-search subagent's results were cached and expired before synthesis began." },
            { key: "C", text: "The coordinator's hooks are silently discarding web-search output before logging it., given that it can be implemented without waiting on an upcoming infrastructure migration., since it keeps the change reviewable in a single small pull request rather than a larger one." },
            { key: "D", text: "Subagents do not automatically inherit the coordinator's conversation history, so the web-search findings must be included explicitly in the synthesis subagent's prompt." }
          ],
          correct: ["D"],
          explanation: "Subagents operate with isolated context and do not automatically inherit the coordinator's conversation history; findings must be passed explicitly in each subagent's prompt. Temperature (A) affects wording, not knowledge of prior findings. Cache expiry (B) and silently discarding hooks (C) are plausible-sounding but unsupported speculation when the documented behavior (context isolation) already explains the symptom."
        },
        {
          id: "P6-S3-Q5",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Sentinel Grid Labs' coordinator currently invokes the web-search subagent, waits for it to finish, then invokes the document-analysis subagent in a separate turn, even though the two subagents work on independent inputs with no dependency on each other's output. What change would reduce latency without changing what each subagent does?",
          options: [
            { key: "A", text: "Have the coordinator emit both Task tool calls for web-search and document-analysis in a single response so they run in parallel." },
            { key: "B", text: "Merge the two subagents into one combined subagent that does both jobs sequentially." },
            { key: "C", text: "Increase the max_tokens limit for both subagents so each completes faster." },
            { key: "D", text: "Switch both subagents to the Message Batches API to process them together." }
          ],
          correct: ["A"],
          explanation: "Emitting multiple Task tool calls in a single coordinator response spawns the independent subagents in parallel, directly cutting latency without altering their individual jobs. Merging subagents (B) still runs the work sequentially inside one agent. max_tokens (C) controls output length, not execution speed. The Batches API (D) is for non-blocking, latency-tolerant workloads and doesn't support multi-turn tool calling mid-request."
        },
        {
          id: "P6-S3-Q6",
          domain: 5,
          task: "5.3",
          type: "multiple",
          select: 2,
          stem: "The web-search subagent times out mid-research. Sentinel Grid Labs is redesigning how this failure is reported to the coordinator so it can make an intelligent recovery decision. Which TWO elements should the structured error response include? (Select TWO.)",
          options: [
            { key: "A", text: "A generic status string such as \"search unavailable\" so the coordinator doesn't need to parse details." },
            { key: "B", text: "The failure type (e.g., timeout) together with the specific query that was attempted." },
            { key: "C", text: "An automatic decision, made by the subagent, to terminate the entire research workflow." },
            { key: "D", text: "Any partial results already gathered before the timeout, plus potential alternative approaches the coordinator could try." },
            { key: "E", text: "A flag indicating the result set is empty because no matching sources were found." }
          ],
          correct: ["B", "D"],
          explanation: "Structured error context — failure type, attempted query, partial results, and alternatives — gives the coordinator what it needs to decide how to recover. A generic status (A) hides exactly this detail. Letting the subagent unilaterally terminate the whole workflow (C) is an anti-pattern; that decision belongs to the coordinator. A valid-empty-result flag (E) describes a different situation (a successful query with no matches), not a timeout."
        },
        {
          id: "P6-S3-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Every research request at Sentinel Grid Labs — from a one-line CVE lookup to a full industry threat-landscape report — currently triggers the same fixed pipeline: web search, document analysis, synthesis, and report generation, in that order. Simple lookups now take as long as comprehensive reports. What change would most directly address this?",
          options: [
            { key: "A", text: "Reduce the max_tokens limit for simple requests so the pipeline finishes faster regardless of which subagents run., because it requires no new tooling and can be rolled out immediately without further review." },
            { key: "B", text: "Have the coordinator analyze the complexity of each incoming request and dynamically select which subagents to invoke, skipping stages that aren't needed." },
            { key: "C", text: "Run all four subagents in parallel for every request to reduce wall-clock time., because stakeholders have already signed off on a similar approach in a prior release cycle." },
            { key: "D", text: "Cache the full pipeline's output for the most common request types." }
          ],
          correct: ["B"],
          explanation: "Dynamic subagent selection lets the coordinator match the pipeline to query complexity instead of always routing through every stage, directly fixing the mismatch between simple lookups and full reports. Reducing max_tokens (A) shortens output, not pipeline stages. Running every stage in parallel (C) still executes unnecessary stages, just faster. Caching (D) doesn't help with novel lookups and sidesteps the actual decomposition problem."
        },
        {
          id: "P6-S3-Q8",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Sentinel Grid Labs originally gave every subagent access to the full set of 18 tools available across the system — web search, CVE lookup, malware-sample retrieval, document parsing, report formatting, and more — reasoning that more tool access gives subagents more flexibility. Tool-selection logs now show subagents frequently calling the wrong tool for their role. What is the most effective fix?",
          options: [
            { key: "A", text: "Add more few-shot examples demonstrating correct tool selection across all 18 tools., as this is the simplest change to implement without touching established conventions." },
            { key: "B", text: "Increase each subagent's context window so it can reason about more tools at once., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "C", text: "Restrict each subagent's tool access to only the 4-5 tools relevant to its specific role." },
            { key: "D", text: "Rename all 18 tools to include a role prefix, such as synth_ or search_., because it requires no new tooling and can be rolled out immediately without further review." }
          ],
          correct: ["C"],
          explanation: "Giving an agent access to too many tools (18 instead of 4-5) degrades tool-selection reliability by increasing decision complexity; scoping each subagent to only its relevant tools directly addresses the root cause. More few-shot examples (A) adds overhead without removing the irrelevant tools from the choice set. A bigger context window (B) doesn't improve selection quality. Renaming tools with prefixes (D) doesn't reduce how many irrelevant tools each subagent still sees."
        },
        {
          id: "P6-S3-Q9",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "The synthesis subagent frequently needs to double-check simple facts (dates, names, statistics) while combining findings, which today requires returning control to the coordinator, invoking the web-search subagent, and re-invoking synthesis — adding multiple round trips. An audit shows 90% of these checks are simple fact lookups and 10% require deeper investigation. Which TWO changes would most effectively reduce overhead while preserving reliability? (Select TWO.)",
          options: [
            { key: "A", text: "Give the synthesis subagent full, unrestricted access to all web-search tools so it never needs the coordinator again." },
            { key: "B", text: "Give the synthesis subagent a single scoped verify_fact tool for simple lookups." },
            { key: "C", text: "Continue routing the 10% of complex verifications through the coordinator to the web-search subagent." },
            { key: "D", text: "Have the web-search subagent speculatively cache extra context for every source, anticipating what synthesis might ask later." },
            { key: "E", text: "Batch all verification requests until the end of the synthesis pass, then send them to the coordinator all at once." }
          ],
          correct: ["B", "C"],
          explanation: "A scoped verify_fact tool handles the common simple-lookup case directly, while complex verifications still route through the coordinator, preserving separation of concerns for the 10% that need it. Giving unrestricted web-search access (A) over-provisions the synthesis agent and violates scoped tool design. Speculative caching (D) can't reliably predict needs. Batching until the end (E) creates blocking dependencies when later synthesis steps depend on earlier verified facts."
        },
        {
          id: "P6-S3-Q10",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Two MCP tools, analyze_content (\"Analyzes content and returns insights\") and analyze_document (\"Analyzes a document and returns insights\"), are frequently confused by the document-analysis subagent, which sometimes calls analyze_content on PDF reports and analyze_document on raw web page text. What is the most effective fix?",
          options: [
            { key: "A", text: "Merge both tools into a single generic analyze tool that accepts any input type., given that it avoids extra engineering overhead and can be verified quickly in a local environment." },
            { key: "B", text: "Add a disambiguation step where a classifier model decides which tool to call before the subagent runs., given that it avoids extra engineering overhead and can be verified quickly in a local environment." },
            { key: "C", text: "Leave the tools as-is and add a note in the subagent's system prompt listing which tool to prefer., as this is the simplest change to implement without touching established conventions." },
            { key: "D", text: "Rename the tools to reflect their actual scope — for example, extract_web_results and extract_pdf_report — with descriptions specific to each input type." }
          ],
          correct: ["D"],
          explanation: "Renaming overlapping tools and writing descriptions specific to each input type eliminates the functional ambiguity causing misrouting. Merging into one generic tool (A) sacrifices the input-specific handling each format needs. A separate classifier (B) is over-engineered for a description problem. A prompt note (C) relies on probabilistic compliance rather than fixing the underlying ambiguous descriptions."
        },
        {
          id: "P6-S3-Q11",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "The document-analysis subagent's single analyze_document tool currently tries to extract key data points, produce a summary, and verify claims against the source — all in one call — and its output quality is inconsistent across these three jobs. What is the most effective redesign?",
          options: [
            { key: "A", text: "Split analyze_document into three purpose-specific tools — extract_data_points, summarize_content, and verify_claim_against_source — each with a defined input/output contract." },
            { key: "B", text: "Keep one tool but add a parameter the subagent sets to indicate which of the three jobs it wants." },
            { key: "C", text: "Add more detailed few-shot examples showing all three jobs being done well in a single call." },
            { key: "D", text: "Increase the subagent's max_tokens so it has more room to do all three jobs thoroughly." }
          ],
          correct: ["A"],
          explanation: "Splitting an overloaded generic tool into purpose-specific tools with clear input/output contracts is the documented fix for this exact pattern, improving consistency per job. A mode parameter (B) still bundles three distinct jobs behind one ambiguous interface. More few-shot examples (C) can't fully compensate for an overloaded tool contract. More max_tokens (D) doesn't address task conflation."
        },
        {
          id: "P6-S3-Q12",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "The document-analysis subagent's system prompt includes the instruction \"always prioritize searching for the most authoritative sources.\" Logs show this subagent now frequently calls a web_search tool it was never intended to use, instead of its own extract_data_points and summarize_content tools, even for documents already provided to it. What is the most likely cause, and the right fix?",
          options: [
            { key: "A", text: "The subagent's AgentDefinition is missing a tool_choice: \"any\" setting; forcing tool use will fix the misrouting., since it reuses infrastructure the team already understands and trusts., because it minimizes the number of files that need to change for this release., as this defers the harder design questions to a later iteration instead of addressing them now." },
            { key: "B", text: "The word \"searching\" in the system prompt is creating an unintended keyword association with the web_search tool, overriding the subagent's well-written tool descriptions; the prompt should be reworded to avoid search-related keywords unrelated to its actual role." },
            { key: "C", text: "The web_search tool's description is too detailed, making it seem more attractive than the extraction tools., since it reuses infrastructure the team already understands and trusts., because it minimizes the number of files that need to change for this release., as this defers the harder design questions to a later iteration instead of addressing them now." },
            { key: "D", text: "The subagent needs a larger context window so it can read its own tool descriptions more carefully., given that it appears to reduce short-term maintenance burden on the on-call engineer., since it matches a pattern the team has used successfully in an unrelated part of the codebase." }
          ],
          correct: ["B"],
          explanation: "System prompt wording can create unintended keyword-driven tool associations that override otherwise well-written tool descriptions; the fix is reviewing and rewording the prompt, not the tools themselves. Forcing tool_choice (A) doesn't address which tool gets chosen. A more detailed competing description (C) isn't established as the cause here. Context window size (D) doesn't affect how keywords bias selection."
        },
        {
          id: "P6-S3-Q13",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Sentinel Grid Labs wants subagents to be able to browse a large, frequently updated catalog of internal CVE summaries and documentation pages without needing a dedicated tool call (with its own round trip and arguments) just to list what's available. What MCP capability is best suited to this?",
          options: [
            { key: "A", text: "A new MCP tool called list_all_cves that returns the entire catalog as a single large tool result., because it avoids a dependency on a component that is still being actively refactored." },
            { key: "B", text: "An increase in the number of tools available to the subagent so it can query each CVE category separately., given that it appears to reduce short-term maintenance burden on the on-call engineer." },
            { key: "C", text: "MCP resources, which expose browsable content catalogs like documentation hierarchies directly, separate from action-oriented tools." },
            { key: "D", text: "A .mcp.json environment variable that preloads the catalog into every subagent's system prompt., as this sidesteps the need to coordinate with another team before shipping." }
          ],
          correct: ["C"],
          explanation: "MCP resources are the mechanism designed for exposing content catalogs such as documentation hierarchies, distinct from action-oriented tools. A single large list_all_cves tool (A) still re-introduces the tool-call-overhead problem the team wants to avoid. More per-category tools (B) worsens tool-selection load. Preloading via environment variables (D) doesn't scale to a large, frequently updated catalog."
        },
        {
          id: "P6-S3-Q14",
          domain: 2,
          task: "2.4",
          type: "multiple",
          select: 2,
          stem: "Sentinel Grid Labs is deciding whether to adopt a popular open-source community MCP server for threat-intel feeds instead of building and maintaining a custom internal MCP server for the same data. Which TWO considerations are valid for this decision? (Select TWO.)",
          options: [
            { key: "A", text: "Tools from all configured MCP servers, community or custom, are discovered at connection time and become available simultaneously, so overlapping tools between a community server and existing custom tools should be reviewed for ambiguity." },
            { key: "B", text: "A community MCP server removes any need to review its tool descriptions, since community maintainers have already optimized them for every possible use case." },
            { key: "C", text: "Community MCP servers are only usable if configured in ~/.claude.json and can never be shared with the rest of the team via .mcp.json." },
            { key: "D", text: "A custom internal MCP server can be tailored with structured error responses (errorCategory, isRetryable) specific to Sentinel Grid Labs' internal systems, which a generic community server likely won't provide out of the box." },
            { key: "E", text: "Adopting a community server guarantees lower latency than any custom-built server, regardless of implementation." }
          ],
          correct: ["A", "D"],
          explanation: "Because tools from every configured MCP server become simultaneously available, overlap with existing custom tools must be reviewed (A), and a custom server can be purpose-built with the structured error metadata the team needs (D). Option B wrongly assumes community descriptions need no review. Option C is factually wrong — any MCP server, community or custom, can be configured in project-level .mcp.json. Option E asserts a latency guarantee that depends entirely on implementation, not on being community-built."
        },
        {
          id: "P6-S3-Q15",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "During a ransomware research run, the web-search subagent finds one credible source reporting the average ransom payment at $1.2M and another equally credible source reporting $850K for the same period. The synthesis subagent must combine these findings into the final report. What is the best way to handle this?",
          options: [
            { key: "A", text: "Average the two values and report a single blended figure to avoid confusing the reader., since it keeps the change reviewable in a single small pull request rather than a larger one." },
            { key: "B", text: "Discard the lower figure since the higher figure is more attention-grabbing and likely more recent., given that it can be implemented without waiting on an upcoming infrastructure migration." },
            { key: "C", text: "Report only the figure from the source that was retrieved first in the web-search subagent's results., since it matches a pattern the team has used successfully in an unrelated part of the codebase." },
            { key: "D", text: "Preserve both values in the report, explicitly annotated with their respective sources, rather than arbitrarily selecting or averaging one." }
          ],
          correct: ["D"],
          explanation: "When credible sources conflict, the correct pattern is to annotate the conflict with source attribution rather than arbitrarily resolving it. Averaging (A) fabricates a figure neither source reported. Discarding a value based on assumed recency (B) is speculation not supported by the data. Picking whichever was retrieved first (C) is an arbitrary heuristic with no basis in source credibility."
        }
      ]
    },
    {
      id: 4,
      title: "Developer Productivity with Claude",
      description: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      questions: [
        {
          id: "P6-S4-Q1",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "BrightPath's developer-productivity agent has both the built-in Grep tool and an MCP tool called search_codebase (\"Searches code\"). Logs show that even for a simple literal string search like finding every occurrence of \"LegacyPaymentGateway\", the agent reaches for search_codebase, which is slower and returns noisier results than Grep would. What is the most effective first step?",
          options: [
            { key: "A", text: "Rewrite search_codebase's description to clearly state its intended use case (e.g., semantic/cross-file dependency search) and note that simple literal string matches should use Grep instead." },
            { key: "B", text: "Remove the Grep tool entirely so there's no ambiguity about which tool to call." },
            { key: "C", text: "Add a routing layer that intercepts every request and decides which search tool to call based on keyword detection." },
            { key: "D", text: "Increase search_codebase's timeout so it returns results faster regardless of query type." }
          ],
          correct: ["A"],
          explanation: "Tool descriptions are the primary mechanism the model uses for selection; clarifying search_codebase's intended use versus Grep's directly fixes the root cause. Removing Grep (B) eliminates a useful built-in tool instead of fixing the ambiguity. A keyword-based routing layer (C) is over-engineered for a description problem. A longer timeout (D) doesn't address why the wrong tool is chosen in the first place."
        },
        {
          id: "P6-S4-Q2",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "BrightPath's developer-productivity agent queries both a legacy COBOL parser MCP tool (which returns timestamps as Unix epoch integers) and a Confluence MCP tool (which returns timestamps as ISO 8601 strings) within the same investigation. The agent frequently misinterprets or miscompares dates between the two sources because of the inconsistent formats. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a system prompt instruction telling the agent to \"always convert timestamps to a consistent format before comparing them.\", because it avoids a dependency on a component that is still being actively refactored." },
            { key: "B", text: "Implement a PostToolUse hook that normalizes timestamps from both tools into a single consistent format before the agent processes the results." },
            { key: "C", text: "Ask the agent to self-report a confidence score whenever it compares dates from different tools., because stakeholders have already signed off on a similar approach in a prior release cycle." },
            { key: "D", text: "Remove one of the two tools so the agent only ever sees one timestamp format., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." }
          ],
          correct: ["B"],
          explanation: "A PostToolUse hook can deterministically normalize heterogeneous data formats, like Unix epoch versus ISO 8601 timestamps, before the agent reasons about them, guaranteeing consistency. A prompt instruction (A) is probabilistic and has a non-zero failure rate for a problem with a deterministic fix. Self-reported confidence (C) doesn't correct the underlying inconsistency. Removing a tool (D) sacrifices needed functionality instead of fixing the data-format mismatch."
        },
        {
          id: "P6-S4-Q3",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "BrightPath's coordinator agent needs to investigate two unrelated legacy modules — the enrollment API and the grading engine — using two separate subagents with no dependency between their findings. The coordinator currently spawns the enrollment subagent, waits for it to finish, then spawns the grading subagent in a separate turn. What change would reduce overall latency without changing what either subagent does?",
          options: [
            { key: "A", text: "Merge both investigations into a single subagent that handles both modules sequentially." },
            { key: "B", text: "Increase max_tokens for both subagents so each completes its work faster." },
            { key: "C", text: "Have the coordinator poll both subagents' status every few seconds instead of waiting for each to finish., as this sidesteps the need to coordinate with another team before shipping." },
            { key: "D", text: "Have the coordinator emit both Task tool calls, for the enrollment and grading subagents, in a single response so they run in parallel." }
          ],
          correct: ["D"],
          explanation: "Emitting multiple Task tool calls in a single coordinator response spawns independent subagents in parallel, cutting latency without changing either subagent's job. Merging into one sequential subagent (A) still performs the work one step after another. max_tokens (B) controls output length, not execution concurrency. Polling (C) doesn't change that the investigations are still being run one after another."
        },
        {
          id: "P6-S4-Q4",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "BrightPath's developer-productivity agent has access to all 18 available tools — Read, Write, Edit, Bash, Grep, Glob, plus a dozen MCP tools spanning Jira, Confluence, a legacy COBOL parser, and a deployment service — regardless of which task it's handling. Tool-selection logs show frequent wrong-tool calls, including Bash commands used where Grep would suffice and Jira tools invoked during pure code-exploration tasks. What is the most effective fix?",
          options: [
            { key: "A", text: "Add detailed few-shot examples demonstrating correct selection across all 18 tools." },
            { key: "B", text: "Switch to a larger model so it can reason more carefully about all 18 tools at once., given that it can be implemented without waiting on an upcoming infrastructure migration., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "C", text: "Combine all MCP tools into a single do_action tool with a mode parameter." },
            { key: "D", text: "Scope tool access by task: give exploration-focused invocations only Read/Grep/Glob plus the directly relevant MCP tools, rather than exposing all 18 tools everywhere." }
          ],
          correct: ["D"],
          explanation: "Scoping tool access to what each invocation actually needs reduces decision complexity directly, which is the documented fix for too-many-tools degradation. Few-shot examples across 18 tools (A) add overhead without removing irrelevant options. A larger model (B) doesn't fix a structural tool-exposure problem. Combining MCP tools into one do_action tool (C) just hides the overload behind a single ambiguous interface."
        },
        {
          id: "P6-S4-Q5",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "The agent currently has a generic fetch_url tool it uses to retrieve \"related documentation\" during legacy-system investigations, but this sometimes results in it fetching unrelated or untrusted pages outside BrightPath's documentation domain. What is the most effective fix?",
          options: [
            { key: "A", text: "Replace fetch_url with a constrained load_document tool that validates the URL belongs to BrightPath's approved documentation domains before retrieving content." },
            { key: "B", text: "Add a system prompt instruction telling the agent to \"only fetch trustworthy URLs.\"" },
            { key: "C", text: "Keep fetch_url but log every URL it retrieves for later manual audit." },
            { key: "D", text: "Remove fetch_url entirely and require engineers to paste documentation manually into every prompt." }
          ],
          correct: ["A"],
          explanation: "Replacing an unconstrained generic tool with a purpose-built, validating one is the documented fix for this exact anti-pattern. A prompt instruction (B) relies on probabilistic compliance with no enforcement. Logging for later audit (C) doesn't prevent the bad fetches from happening. Removing the tool entirely (D) eliminates useful automation instead of constraining it."
        },
        {
          id: "P6-S4-Q6",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "Two MCP tools, get_ticket (\"Retrieves a ticket\") and get_issue (\"Retrieves an issue\"), both query the same underlying Jira-like system and are frequently confused by the agent, which sometimes calls get_ticket when it should call get_issue's richer response schema and vice versa. Which TWO changes would most effectively resolve this? (Select TWO.)",
          options: [
            { key: "A", text: "Leave both tools named as-is but add a disclaimer in each description saying \"do not confuse with the other tool.\"" },
            { key: "B", text: "Rename and differentiate the tools — for example, get_ticket_summary and get_issue_with_comments — with descriptions that state exactly what each returns and when to use it." },
            { key: "C", text: "Increase the max_tokens limit so the agent has more room to consider both tools before choosing." },
            { key: "D", text: "Consolidate the two near-duplicate tools into a single tool with a clearly documented contract, if their functionality genuinely overlaps." },
            { key: "E", text: "Remove both tools' descriptions entirely so the agent relies solely on the tool names." }
          ],
          correct: ["B", "D"],
          explanation: "Renaming and differentiating overlapping tools (B), or consolidating genuinely overlapping tools into one well-documented tool (D), both directly resolve functional ambiguity. A disclaimer (A) is a weak prompt-level patch that doesn't change the underlying overlap. More max_tokens (C) doesn't improve selection logic. Removing descriptions (E) removes the primary signal the model uses for tool selection, making things worse."
        },
        {
          id: "P6-S4-Q7",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "BrightPath's coordinator delegates \"document the legacy billing module's dependencies\" to an exploration subagent. The subagent returns findings covering the module's direct database calls but nothing about the three external services it calls indirectly through a shared message queue — a real gap in coverage. What should the coordinator do?",
          options: [
            { key: "A", text: "Accept the findings as final and publish the documentation, since the subagent completed its assigned task without errors., because it requires no new tooling and can be rolled out immediately without further review., as this is the simplest change to implement without touching established conventions." },
            { key: "B", text: "Evaluate the returned findings for coverage gaps, then re-delegate to the exploration subagent with a targeted follow-up query about the message-queue-based external service calls, and re-invoke synthesis once that gap is addressed." },
            { key: "C", text: "Spawn an entirely new subagent with a broader, less specific mandate and discard the first subagent's findings." },
            { key: "D", text: "Lower the subagent's temperature setting and re-run the exact same original query, hoping for more complete results." }
          ],
          correct: ["B"],
          explanation: "Iterative refinement loops, where the coordinator evaluates output for gaps and re-delegates with a targeted query before re-invoking synthesis, are the documented pattern for closing real coverage gaps. Accepting incomplete results as final (A) ignores a known gap. Discarding findings and starting over broadly (C) wastes the valid results already gathered. Re-running the identical query (D) doesn't address why the original query missed the indirect dependencies."
        },
        {
          id: "P6-S4-Q8",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "BrightPath's coordinator agent is supposed to spawn a specialized subagent to trace a specific legacy module's dependencies, but logs show it never actually invokes any subagent, even when a task clearly calls for one. What is the most likely cause?",
          options: [
            { key: "A", text: "The subagent's AgentDefinition lacks a system prompt." },
            { key: "B", text: "The MCP server providing the dependency-tracing tool isn't listed in .mcp.json., given that it avoids extra engineering overhead and can be verified quickly in a local environment." },
            { key: "C", text: "The coordinator's allowedTools configuration doesn't include \"Task,\" so it has no way to spawn subagents." },
            { key: "D", text: "The subagent was configured with too few tools to be useful." }
          ],
          correct: ["C"],
          explanation: "allowedTools must include \"Task\" for a coordinator to spawn any subagent at all; without it, delegation simply never happens, matching the observed symptom. A missing subagent system prompt (A) would affect the subagent's own behavior once spawned, not whether spawning occurs. A missing MCP server (B) would break one tool, not all delegation. Too few subagent tools (D) wouldn't prevent the coordinator from invoking it."
        },
        {
          id: "P6-S4-Q9",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A subagent spawned to \"trace all call sites of the LegacyPaymentGateway class\" returns incomplete results because it appears unaware of a related refactor the main agent discussed earlier in the conversation that renamed several call sites. What is the most likely explanation?",
          options: [
            { key: "A", text: "The subagent's tool access is too broad for this narrow task." },
            { key: "B", text: "The main agent's context window is too small to pass along the refactor details., since it reuses infrastructure the team already understands and trusts., because it minimizes the number of files that need to change for this release." },
            { key: "C", text: "The coordinator failed to use fork_session before spawning the subagent." },
            { key: "D", text: "Subagents do not automatically inherit the coordinator's conversation history, so relevant prior findings (like the refactor) must be explicitly included in the subagent's prompt." }
          ],
          correct: ["D"],
          explanation: "Subagents have isolated context and do not automatically inherit the main conversation; the refactor details needed to be passed explicitly in the subagent's prompt. Tool access breadth (A) doesn't affect awareness of prior discussion. A small context window (B) is not established as the cause here. fork_session (C) is for branching exploration, not for passing context into a spawned subagent."
        },
        {
          id: "P6-S4-Q10",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "BrightPath is scoping a task to \"add comprehensive automated tests to the legacy billing module,\" a codebase none of the current engineers originally wrote. Which TWO approaches best fit this open-ended investigation task? (Select TWO.)",
          options: [
            { key: "A", text: "Decompose the work by first mapping the module's structure, then identifying high-impact/high-risk areas, then creating a prioritized plan that adapts as new dependencies are discovered." },
            { key: "B", text: "Use a fixed sequential pipeline defined upfront (e.g., \"test file 1, then file 2, then file 3 in alphabetical order\") regardless of what's discovered along the way." },
            { key: "C", text: "Spawn a subagent to investigate specific open questions (e.g., \"find all callers of the billing calculation function\") while the main agent preserves high-level coordination." },
            { key: "D", text: "Require the agent to write every test it plans to write before exploring any part of the codebase." },
            { key: "E", text: "Skip structure-mapping entirely and begin writing tests for the first file encountered alphabetically." }
          ],
          correct: ["A", "C"],
          explanation: "Adaptive investigation plans that update based on discovered dependencies (A), and delegating specific open questions to subagents while the main agent coordinates (C), are both appropriate for open-ended, unfamiliar-codebase tasks. A rigid alphabetical pipeline (B) ignores what's actually discovered. Planning every test before any exploration (D) assumes knowledge the team doesn't yet have. Skipping structure-mapping (E) risks missing high-impact areas entirely."
        },
        {
          id: "P6-S4-Q11",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "BrightPath runs its productivity agent on the prompt \"document the student-enrollment subsystem,\" and the coordinator decomposes this into \"document the enrollment API routes\" and \"document the enrollment database schema.\" The resulting documentation never covers the enrollment notification/email workflows, a major part of the subsystem, even though every spawned subagent completed its assigned work correctly. What is the most likely root cause?",
          options: [
            { key: "A", text: "The coordinator's task decomposition was too narrow and simply never assigned a subtask covering the notification workflows." },
            { key: "B", text: "The subagent documenting API routes applied overly strict filtering that excluded notification-related endpoints." },
            { key: "C", text: "The database-schema subagent lacked the tools needed to find notification tables." },
            { key: "D", text: "The documentation-formatting step dropped the notification section during final assembly." }
          ],
          correct: ["A"],
          explanation: "Since both subagents completed their assigned scopes correctly and neither was ever assigned the notification workflows, the coordinator's decomposition itself was too narrow. Options B, C, and D each incorrectly blame downstream agents or formatting for a gap that originated in the initial task assignment."
        },
        {
          id: "P6-S4-Q12",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "BrightPath wants to migrate its legacy reporting library, used across roughly 45 files, to a newer actively maintained library with a different API surface and several possible migration strategies (adapter layer vs. direct rewrite vs. incremental file-by-file). What's the best approach to start this work?",
          options: [
            { key: "A", text: "Begin direct execution on the first file and let the right pattern emerge as more files are migrated." },
            { key: "B", text: "Enter plan mode to explore current usage across the 45 files, evaluate the possible migration strategies, and settle on an approach before changing any code." },
            { key: "C", text: "Write a single exhaustive prompt specifying exactly how every one of the 45 files must change, then run direct execution., as this defers the harder design questions to a later iteration instead of addressing them now." },
            { key: "D", text: "Begin in direct execution and switch to plan mode only if the migration takes longer than expected." }
          ],
          correct: ["B"],
          explanation: "Plan mode is designed for large-scale, multi-file changes with multiple valid strategies, letting the team evaluate approaches before committing to edits across 45 files. Direct execution from file one (A) risks costly rework once later files reveal a better strategy. An exhaustive upfront prompt (C) assumes the right structure is already known. Deferring planning until problems appear (D) ignores that the complexity is already evident."
        },
        {
          id: "P6-S4-Q13",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "While mapping the legacy billing module's structure before writing tests, an engineer's session accumulates extensive file-listing and search output, leaving little room for the actual implementation work later in the session. What should the engineer do differently?",
          options: [
            { key: "A", text: "Switch to a model with a larger context window for the mapping phase." },
            { key: "B", text: "Ask Claude to compress its own output into shorter sentences during exploration., given that it appears to reduce short-term maintenance burden on the on-call engineer." },
            { key: "C", text: "Delegate the verbose discovery phase to the Explore subagent so only a concise summary returns to the main conversation." },
            { key: "D", text: "Split the mapping phase across multiple unrelated CLAUDE.md files." }
          ],
          correct: ["C"],
          explanation: "The Explore subagent isolates verbose discovery output and returns only a summary, preserving context budget for the implementation phase that follows. A larger context window (A) doesn't address attention/quality issues from verbose output. Self-compression (B) still consumes turns and tokens. CLAUDE.md (D) holds project context, not a place to offload exploration."
        },
        {
          id: "P6-S4-Q14",
          domain: 5,
          task: "5.6",
          type: "multiple",
          select: 2,
          stem: "BrightPath's subagents independently research \"average grading turnaround time for the district pilot\" from three sources: a support-ticket export, a teacher survey, and a vendor status report. The three sources disagree, and the coordinator's synthesis step currently just picks the support-ticket figure and presents it as the single answer with no caveat. Which TWO changes would best preserve provenance and handle this disagreement responsibly? (Select TWO.)",
          options: [
            { key: "A", text: "Require each subagent to output structured claim-source mappings (which figure came from which source) so the coordinator can preserve attribution through synthesis instead of merging numbers into one unsourced claim." },
            { key: "B", text: "When sources conflict, annotate the disagreement with source attribution for each figure rather than arbitrarily selecting one value as the answer." },
            { key: "C", text: "Instruct subagents to average the three figures together and report only the resulting mean turnaround time." },
            { key: "D", text: "Discard the two figures that don't match the support-ticket export, since that source is the system of record." },
            { key: "E", text: "Ask the coordinator to pick whichever figure sounds most precise and present it without mentioning the other sources." }
          ],
          correct: ["A", "B"],
          explanation: "Structured claim-source mappings preserve attribution through synthesis, and annotating conflicting figures with their sources lets the coordinator (or a human reviewer) reconcile them rather than silently guessing. Averaging the figures (C) fabricates a number no source actually reported and hides the real disagreement. Discarding dissenting sources (D) arbitrarily privileges one source without justification. Picking the most precise-sounding figure (E) hides the conflict instead of surfacing it."
        },
        {
          id: "P6-S4-Q15",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "BrightPath's custom MCP tool for querying the legacy COBOL parser currently returns a generic \"Operation failed\" message whenever anything goes wrong, whether the parser timed out, the input was malformed, or the requested module simply doesn't exist. The agent can't decide whether to retry, ask for different input, or give up. What is the most effective fix?",
          options: [
            { key: "A", text: "Replace the generic message with a slightly more detailed free-text string, such as \"Parser encountered a problem.\", since it matches a pattern the team has used successfully in an unrelated part of the codebase., because it avoids a dependency on a component that is still being actively refactored." },
            { key: "B", text: "Have the agent always retry twice regardless of the error type before giving up." },
            { key: "C", text: "Remove error handling entirely and let exceptions propagate as raw stack traces to the agent." },
            { key: "D", text: "Return structured error metadata including an errorCategory (transient/validation/permission), an isRetryable boolean, and a human-readable description so the agent can decide how to respond." }
          ],
          correct: ["D"],
          explanation: "Structured error metadata lets the agent distinguish transient, validation, and permission failures and decide intelligently whether to retry, request different input, or escalate. A slightly longer free-text message (A) is still uniform and unparseable for decision-making. Blind retries regardless of error type (B) waste attempts on non-retryable failures. Raw stack traces (C) give the agent no structured basis for a recovery decision."
        }
      ]
    },
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P6-S5-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Vantage Ledger's CI pipeline runs claude \"Review this pull request for security issues\" inside a GitHub Actions job, and the job hangs indefinitely waiting for input it will never receive. What is the correct fix?",
          options: [
            { key: "A", text: "Add the -p (or --print) flag so Claude Code runs in non-interactive mode, processes the prompt, and exits after printing the result." },
            { key: "B", text: "Set a CLAUDE_HEADLESS=true environment variable before invoking the command." },
            { key: "C", text: "Pipe the command's output through a timeout wrapper so the job fails gracefully after 10 minutes." },
            { key: "D", text: "Add a --batch flag to run the review asynchronously." }
          ],
          correct: ["A"],
          explanation: "The -p / --print flag is the documented way to run Claude Code non-interactively, exactly what automated pipelines require. CLAUDE_HEADLESS (B) and --batch (D) are non-existent flags/variables. A timeout wrapper (C) only masks the hang with a failure instead of letting the job complete properly."
        },
        {
          id: "P6-S5-Q2",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Vantage Ledger's CI job needs the PR-review findings as machine-parseable output it can post as individual inline PR comments, with each finding strictly matching a predefined fields structure (file, line, severity, message). What CLI configuration best achieves this?",
          options: [
            { key: "A", text: "Rely on the default text output and parse it with a regular expression in the pipeline script., as this sidesteps the need to coordinate with another team before shipping." },
            { key: "B", text: "Use --output-format json together with --json-schema to enforce a schema-compliant, machine-parseable findings structure." },
            { key: "C", text: "Ask Claude in the prompt to \"please respond only in valid JSON\" without any CLI flags." },
            { key: "D", text: "Use the -p flag alone, since it already guarantees structured JSON output." }
          ],
          correct: ["B"],
          explanation: "--output-format json combined with --json-schema is the documented mechanism for enforcing structured, schema-compliant CI output. Regex-parsing free text (A) is brittle and breaks on format drift. Prompt-only instructions for JSON (C) have a non-zero failure rate without schema enforcement. -p alone (D) only enables non-interactive mode; it does not enforce JSON structure."
        },
        {
          id: "P6-S5-Q3",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Vantage Ledger's CI review step includes the complete raw git diff plus the complete CI log (dependency installation output, container setup, cache warnings — several thousand lines) in every automated review prompt for a PR, even though only the actual code changes and any test failure output are relevant to the review. Reviews on larger PRs are now missing issues that simpler PRs reliably catch. What is the most effective fix?",
          options: [
            { key: "A", text: "Reduce the number of files Claude is allowed to review per PR regardless of diff size." },
            { key: "B", text: "Trim the included CI log output to only the sections relevant to the review (the diff itself and any test failure output), rather than passing the full raw log every time." },
            { key: "C", text: "Ask Claude to read the full log but explicitly instruct it to \"focus only on what matters.\", given that it can be implemented without waiting on an upcoming infrastructure migration., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "D", text: "Switch to a model with a larger context window so the full log and diff always fit." }
          ],
          correct: ["B"],
          explanation: "Trimming verbose, largely irrelevant tool output to only the relevant sections directly reduces the context waste causing missed issues on larger PRs. Arbitrarily capping file count (A) doesn't address the irrelevant content already included. A prompt instruction to \"focus on what matters\" (C) is a probabilistic workaround that doesn't remove the actual noise. A larger context window (D) doesn't fix attention dilution from irrelevant content."
        },
        {
          id: "P6-S5-Q4",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A PR modifying 12 files is reviewed in a single Claude Code call that concatenates each file's diff and analysis notes into one long input, in file order, followed by a request for an overall summary of findings. Developers notice that issues found in files 5 through 8 are consistently missing from the final summary, while issues in the first and last files are reliably included. What is the most likely explanation, and the best fix?",
          options: [
            { key: "A", text: "Files 5 through 8 simply have fewer real issues than the other files in this particular PR." },
            { key: "B", text: "The model's temperature setting causes it to randomly omit findings from different files on each run." },
            { key: "C", text: "This is the lost-in-the-middle effect — models reliably process the beginning and end of long inputs but may omit findings from middle sections; placing key findings up front and using explicit section headers mitigates it." },
            { key: "D", text: "The CI pipeline's --json-schema flag is misconfigured and silently drops findings from middle sections., because it requires no new tooling and can be rolled out immediately without further review., as this is the simplest change to implement without touching established conventions." }
          ],
          correct: ["C"],
          explanation: "Models reliably process information at the beginning and end of long inputs but may omit findings from the middle; restructuring with explicit section headers and leading summaries mitigates this. Option A offers no evidence and conveniently ignores the clear positional pattern. Temperature (B) doesn't selectively target middle sections. --json-schema (D) governs output structure, not which findings the model chooses to include."
        },
        {
          id: "P6-S5-Q5",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "Vantage Ledger wants its CI review step to catch subtle logic issues in generated code, but notices that when the same Claude session that wrote a function also reviews it, it rarely questions its own earlier reasoning, even when a bug exists. What change would most improve review effectiveness?",
          options: [
            { key: "A", text: "Use an independent review instance, without access to the generating session's reasoning context, to review the code." },
            { key: "B", text: "Instruct the same session, via the prompt, to \"review your own code critically and skeptically.\"" },
            { key: "C", text: "Enable extended thinking for the same session before it reviews its own output." },
            { key: "D", text: "Have the same session re-read its own code three times before responding." }
          ],
          correct: ["A"],
          explanation: "A second, independent review instance without the generator's prior reasoning context is documented as more effective at catching subtle issues than self-review instructions or repeated self-reading. Prompt-based self-skepticism (B) and extended thinking within the same session (C) don't remove the retained reasoning bias. Re-reading repeatedly in the same session (D) doesn't introduce independent perspective either."
        },
        {
          id: "P6-S5-Q6",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "A PR modifies the ledger-reconciliation module across 16 files. A single review pass over all files at once produces inconsistent depth — detailed feedback for some files, superficial comments for others — and the same anti-pattern is flagged in one file but approved in another file in the same PR. What is the best way to restructure the review?",
          options: [
            { key: "A", text: "Switch to a model with a larger context window so all 16 files get equal attention in one pass." },
            { key: "B", text: "Split the review into per-file local-analysis passes, plus a separate cross-file integration pass examining data flow between files." },
            { key: "C", text: "Require the PR to be split into smaller PRs of 2-3 files before any automated review runs." },
            { key: "D", text: "Run three independent full-PR passes and only report issues flagged in at least two of the three runs., given that it avoids extra engineering overhead and can be verified quickly in a local environment." }
          ],
          correct: ["B"],
          explanation: "Splitting into per-file passes plus a separate cross-file integration pass directly addresses attention dilution, the root cause of inconsistent depth and contradictory findings. A larger context window (A) doesn't fix attention-quality issues. Forcing smaller PRs (C) shifts the burden to developers rather than fixing the review system. Requiring consensus across three full-PR passes (D) would actually suppress detection of issues caught only intermittently."
        },
        {
          id: "P6-S5-Q7",
          domain: 4,
          task: "4.6",
          type: "multiple",
          select: 2,
          stem: "Building on the same 16-file reconciliation-module review above, which TWO statements correctly describe why a multi-pass restructuring (per-file plus integration) addresses the observed problem? (Select TWO.)",
          options: [
            { key: "A", text: "Analyzing each file individually in its own pass ensures consistent depth of analysis regardless of how many other files are in the PR." },
            { key: "B", text: "A separate cross-file integration pass is unnecessary once each file has been reviewed individually, since cross-file issues will always surface within a single file's pass." },
            { key: "C", text: "A dedicated cross-file integration pass can catch issues — like inconsistent handling of the same pattern across files — that a single-file pass cannot see in isolation." },
            { key: "D", text: "Splitting the review into passes requires a larger model specifically because more total tokens are processed overall." },
            { key: "E", text: "Attention dilution only becomes a concern once a PR exceeds 50 modified files, so 16 files alone cannot explain the inconsistency." }
          ],
          correct: ["A", "C"],
          explanation: "Per-file passes guarantee consistent depth regardless of PR size (A), and a dedicated integration pass catches cross-file inconsistencies a single-file pass can't see (C). Option B is false — cross-file issues are exactly what a per-file-only approach misses. Option D invents a model-size requirement unrelated to the actual fix. Option E fabricates a file-count threshold; the 16-file PR already shows the problem."
        },
        {
          id: "P6-S5-Q8",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Vantage Ledger's code-review prompt currently just says \"flag any comment that seems inaccurate,\" and the false-positive rate for comment-accuracy findings is high enough that developers have started ignoring that category entirely. What change would most effectively reduce false positives?",
          options: [
            { key: "A", text: "Add \"only report high-confidence findings\" to the prompt." },
            { key: "B", text: "Add \"be conservative when flagging comment issues\" to the prompt., since it reuses infrastructure the team already understands and trusts., because it minimizes the number of files that need to change for this release., as this defers the harder design questions to a later iteration instead of addressing them now." },
            { key: "C", text: "Replace the vague instruction with an explicit, specific criterion — e.g., \"flag a comment only when the claimed behavior contradicts the code's actual behavior\" — rather than relying on general caution." },
            { key: "D", text: "Remove comment-accuracy checks from the review scope permanently." }
          ],
          correct: ["C"],
          explanation: "Explicit, specific criteria directly define which cases to flag, addressing the root cause of inconsistent classification far more reliably than vague caution-based instructions. \"High-confidence\" (A) and \"be conservative\" (B) are general instructions that don't improve precision compared to specific categorical criteria. Permanently removing the category (D) sacrifices a potentially valuable check rather than fixing its prompt."
        },
        {
          id: "P6-S5-Q9",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "The comment-accuracy finding category at Vantage Ledger has such a high false-positive rate that developers now distrust even the review bot's security and correctness findings, which are otherwise reliable. The team is actively rewriting the comment-accuracy prompt criteria but the fix isn't ready yet. What's the most effective immediate step?",
          options: [
            { key: "A", text: "Permanently delete the comment-accuracy category from the review scope so it never causes false positives., given that it appears to reduce short-term maintenance burden on the on-call engineer." },
            { key: "B", text: "Leave the category enabled and ask developers to simply ignore any findings in it for now." },
            { key: "C", text: "Add a disclaimer to every finding in that category warning developers it might be wrong." },
            { key: "D", text: "Temporarily disable the high false-positive comment-accuracy category while refining its prompt criteria, to restore developer trust in the other review categories." }
          ],
          correct: ["D"],
          explanation: "Temporarily disabling a high false-positive category while its prompt is being refined protects trust in the otherwise-reliable categories without permanently discarding the capability. Permanent deletion (A) is more drastic than necessary for a fixable prompt issue. Leaving it enabled and asking developers to ignore it (B) does nothing to restore trust in the other categories. A disclaimer (C) doesn't stop the noise from undermining confidence."
        },
        {
          id: "P6-S5-Q10",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Vantage Ledger wants its CI review to classify findings as Critical/High/Medium/Low consistently, but with just prose descriptions of each severity level, the model often disagrees with itself across similar findings in different PRs. What is the most effective fix?",
          options: [
            { key: "A", text: "Add 2-4 few-shot examples showing concrete code snippets paired with their correct severity classification for each level." },
            { key: "B", text: "Add a longer prose paragraph describing each severity level in more detail." },
            { key: "C", text: "Remove the Low severity tier entirely to reduce classification ambiguity." },
            { key: "D", text: "Ask the model to also output a numeric confidence score alongside each severity label." }
          ],
          correct: ["A"],
          explanation: "Concrete few-shot examples demonstrating correct severity classification achieve consistency far more reliably than prose descriptions alone. A longer prose paragraph (B) still leaves classification to interpretation. Removing a severity tier (C) doesn't resolve ambiguity within the remaining tiers. A confidence score (D) doesn't make the classification itself more consistent."
        },
        {
          id: "P6-S5-Q11",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Vantage Ledger wants its PR-review step to return findings as a guaranteed-structured list of objects (file, line, severity, message) with no chance of malformed JSON breaking the pipeline's parser. What is the most reliable way to achieve this?",
          options: [
            { key: "A", text: "Ask the model in the prompt to \"always return valid JSON only, no other text.\"" },
            { key: "B", text: "Define an extraction tool with a JSON schema for the findings structure, and use tool_use so the structured output comes from the tool_use response rather than free-text JSON." },
            { key: "C", text: "Post-process the model's free-text response with a JSON-repair library before parsing., since it matches a pattern the team has used successfully in an unrelated part of the codebase., because it avoids a dependency on a component that is still being actively refactored." },
            { key: "D", text: "Lower the temperature to reduce the chance of malformed output." }
          ],
          correct: ["B"],
          explanation: "tool_use with a JSON schema eliminates JSON syntax errors by construction, the most reliable approach for guaranteed schema-compliant output. A prompt-only instruction (A) still has a non-zero failure rate. A JSON-repair post-processing step (C) is a brittle workaround for a problem tool_use avoids entirely. Lowering temperature (D) reduces but does not eliminate the risk of malformed output."
        },
        {
          id: "P6-S5-Q12",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "Vantage Ledger's extraction pipeline needs extract_metadata (document type, filer, date) to run before any enrichment steps (such as cross-referencing the filer against an internal database) can safely execute, since enrichment depends on metadata fields already being present. Which TWO tool_choice-related statements correctly describe how to enforce this with the Claude API? (Select TWO.)",
          options: [
            { key: "A", text: "Set tool_choice: \"auto\" on the first turn, since \"auto\" guarantees the model will always choose extract_metadata first when it's the most logical first step." },
            { key: "B", text: "Set tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"} on the first turn to force that specific tool to be called before any enrichment tool can run." },
            { key: "C", text: "Set tool_choice: \"any\" on the first turn to guarantee extract_metadata specifically is the tool invoked, since \"any\" always selects the most foundational tool." },
            { key: "D", text: "After extract_metadata has returned its result, process subsequent enrichment steps in follow-up turns rather than expecting the model to call every tool in one response." },
            { key: "E", text: "Forcing a specific tool only works for the very last tool call in a pipeline, never the first." }
          ],
          correct: ["B", "D"],
          explanation: "Forced tool selection ({\"type\": \"tool\", \"name\": \"extract_metadata\"}) guarantees that specific tool runs first (B), and subsequent enrichment steps should then be processed in follow-up turns (D). Option A is wrong because \"auto\" lets the model return text or choose any tool — it provides no guarantee. Option C is wrong because \"any\" only guarantees a tool is called, not which one. Option E is a fabricated restriction; forced tool selection can be used at any step, including the first."
        },
        {
          id: "P6-S5-Q13",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Vantage Ledger's manager proposes moving two workflows to the Message Batches API for its 50% cost savings: (1) a blocking pre-merge review that developers wait on before merging, and (2) a technical-debt report generated overnight for the next morning's standup. How should this proposal be evaluated?",
          options: [
            { key: "A", text: "Move both workflows to batch processing, since the cost savings apply equally regardless of workflow type." },
            { key: "B", text: "Keep both workflows on the synchronous API to avoid any batch result-ordering complexity." },
            { key: "C", text: "Move the overnight technical-debt report to the Batches API, since it's latency-tolerant, but keep the blocking pre-merge review on the synchronous API, since developers can't wait up to 24 hours with no SLA." },
            { key: "D", text: "Move both to batch processing but add a fallback that switches to synchronous calls if a batch takes longer than one hour., as this sidesteps the need to coordinate with another team before shipping., given that it can be implemented without waiting on an upcoming infrastructure migration." }
          ],
          correct: ["C"],
          explanation: "The Batches API offers cost savings but has up to a 24-hour window with no latency SLA, making it ideal for the latency-tolerant overnight report but unsuitable for a blocking pre-merge check. Moving both to batch (A) risks developers waiting indefinitely on a merge-blocking task. Keeping both synchronous (B) forfeits savings on a workload where they're appropriate. A one-hour fallback (D) adds unneeded complexity when matching each API to its appropriate use case is simpler."
        },
        {
          id: "P6-S5-Q14",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "A batch of 200 documents submitted to the Message Batches API for nightly processing comes back with 14 failed requests. What is the most efficient way to handle this?",
          options: [
            { key: "A", text: "Resubmit the entire batch of 200 documents again from scratch." },
            { key: "B", text: "Discard the 14 failed documents permanently since batch failures cannot be identified individually., since this keeps the existing pipeline unchanged and avoids introducing additional moving parts." },
            { key: "C", text: "Switch entirely to the synchronous API for all future nightly runs to avoid any batch failures." },
            { key: "D", text: "Use each failed request's custom_id to identify the 14 specific documents, apply any needed modifications (e.g., chunking oversized documents), and resubmit only those." }
          ],
          correct: ["D"],
          explanation: "custom_id fields correlate batch request/response pairs, letting the team identify and resubmit only the failed documents with appropriate fixes. Resubmitting the full batch (A) wastes cost and time on 186 already-successful documents. Batch failures are identifiable (B is factually wrong). Abandoning batch processing entirely (C) discards its cost savings for an unrelated set of workflows."
        },
        {
          id: "P6-S5-Q15",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "A generated PR review flags that a reconciliation function's line items don't sum to the reported total, a semantic error not caught by schema validation. On retry, the model is given the original document, the failed extraction, and the specific discrepancy, and corrects it. In a separate case, a required filer-address field is simply never successfully retried because the source document never contained that information at all. What does this contrast illustrate?",
          options: [
            { key: "A", text: "Retry-with-error-feedback is effective for correctable issues like structural/semantic discrepancies, but ineffective when the required information is genuinely absent from the source document." },
            { key: "B", text: "Retries should always be attempted at least five times regardless of the type of failure." },
            { key: "C", text: "Semantic validation errors can only be caught by increasing the model's temperature on retry." },
            { key: "D", text: "Both types of failure indicate the schema itself is poorly designed and should be loosened." }
          ],
          correct: ["A"],
          explanation: "Retry-with-error-feedback succeeds when the model can correct a format or structural/semantic error using the document it already has, but cannot succeed when the needed information was never in the source at all. A fixed retry count (B) ignores this distinction. Temperature (C) is unrelated to catching semantic validation errors. Loosening the schema (D) would mask a legitimate missing-information case rather than address it, for example by marking the field nullable instead."
        }
      ]
    }
  ]
});
