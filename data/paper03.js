window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 3,
  title: "Mock Exam 3",
  scenarios: [
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P3-S2-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Meridian Cloud Logistics onboarded a new backend engineer, Priya, to the shipment-tracking repo. Every other engineer's Claude Code sessions consistently follow the team's convention of using Result<T, E> return types instead of throwing exceptions, but Priya's sessions never apply this convention even though she cloned the repository fresh. Investigation shows the convention is documented only in a CLAUDE.md file. What is the most likely cause?",
          options: [
            { key: "A", text: "The convention is written in ~/.claude/CLAUDE.md on another engineer's laptop, so it never reached Priya's clone of the repository." },
            { key: "B", text: "Priya's editor has not loaded the project-level CLAUDE.md because she has not yet run /memory, which some engineers believe must be executed once per machine to activate memory files before any convention in them can take effect." },
            { key: "C", text: "CLAUDE.md files only apply to the engineer who originally authored them, regardless of scope." },
            { key: "D", text: "The convention needs to be duplicated into a .claude/rules/ file with an explicit path glob before it takes effect, since plain CLAUDE.md conventions are cached per-clone and never propagate to repositories checked out after the file was first committed." }
          ],
          correct: ["A"],
          explanation: "User-level CLAUDE.md (~/.claude/CLAUDE.md) is personal and is not shared with teammates via version control, so if the convention was only ever added to one engineer's user-level file it would never reach a teammate's clone -- the fix is moving it to the project-level CLAUDE.md. B is wrong because /memory only inspects which memory files are loaded, it does not load them. C is false -- project and directory-level CLAUDE.md files apply to everyone who opens that repository. D is unnecessary; project-level CLAUDE.md alone is sufficient and already version-controlled."
        },
        {
          id: "P3-S2-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "The shipment-tracking monorepo contains packages owned by different teams: billing, routing, and notifications. Each team maintains its own detailed standards file (billing-standards.md, routing-standards.md, notifications-standards.md) in a shared /standards directory. The platform lead wants each package's CLAUDE.md to pull in only the standards relevant to that package, without duplicating content or loading unrelated standards into every session. What should they do?",
          options: [
            { key: "A", text: "Concatenate all three standards files into a single root CLAUDE.md so every session has full context." },
            { key: "B", text: "Store all standards as .claude/skills/ entries so engineers invoke them manually per package." },
            { key: "C", text: "In each package's CLAUDE.md, use @import to reference only that package's relevant standards file." },
            { key: "D", text: "Move each standards file into a subdirectory CLAUDE.md inside /standards itself, since CLAUDE.md files are inherited upward through parent directories into any package that imports from that path." }
          ],
          correct: ["C"],
          explanation: "@import lets a CLAUDE.md reference external files, so each package can selectively import only the standards relevant to it, keeping files modular without duplication. A loads irrelevant content into every session, wasting context. B turns always-needed standards into something that must be manually invoked, which is unreliable for universal conventions. D does not scope anything to the consuming packages, since a CLAUDE.md applies to the directory it lives in and its descendants, not to importers elsewhere in the tree."
        },
        {
          id: "P3-S2-Q3",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Meridian's codebase has React components, Go microservices, and Terraform modules all mixed under a single apps/ directory tree, several levels deep. Test files (*.test.tsx, *_test.go) are scattered throughout every area rather than grouped together, and the team wants Claude Code to automatically apply the same testing conventions to every test file regardless of which subdirectory it lives in. Which configuration approach is most maintainable?",
          options: [
            { key: "A", text: "Add a CLAUDE.md to every subdirectory that contains test files, each repeating the testing conventions, since Claude Code only applies conventions from a CLAUDE.md that lives in the exact same directory as the file currently being edited." },
            { key: "B", text: "Create a .claude/rules/testing.md file with YAML frontmatter specifying a paths field with glob patterns such as [\"**/*.test.tsx\", \"**/*_test.go\"]." },
            { key: "C", text: "Add the testing conventions once to the root CLAUDE.md and trust Claude to infer when they apply." },
            { key: "D", text: "Create a .claude/skills/testing-conventions/SKILL.md that engineers must manually invoke before writing any test file, relying on each engineer to remember to run it consistently across every subdirectory of the monorepo." }
          ],
          correct: ["B"],
          explanation: "Path-scoped rules with glob patterns load conventions based on file path matches regardless of directory, which is exactly suited to conventions for file types spread across many locations. A does not scale and requires duplicating content in every matching subdirectory. C relies on inference instead of explicit matching, which is unreliable. D requires manual invocation rather than automatic application whenever a matching file is edited."
        },
        {
          id: "P3-S2-Q4",
          domain: 3,
          task: "3.3",
          type: "multiple",
          select: 2,
          stem: "An engineer is reviewing how .claude/rules/ files behave in Meridian's monorepo. Which two statements about path-scoped rules are correct? (Select TWO.)",
          options: [
            { key: "A", text: "A rule file's YAML frontmatter paths field accepts glob patterns such as [\"terraform/**/*\"] to scope when the rule loads." },
            { key: "B", text: "Rules in .claude/rules/ only take effect if a matching subdirectory CLAUDE.md is also present." },
            { key: "C", text: "A rule scoped to **/*.test.tsx will load when editing a matching file no matter which directory it is in." },
            { key: "D", text: "Rules in .claude/rules/ must be written in JSON, not YAML frontmatter plus a Markdown body." },
            { key: "E", text: "Path-scoped rules replace the need for a project-level CLAUDE.md entirely in every project." }
          ],
          correct: ["A", "C"],
          explanation: "Rule files use YAML frontmatter with a paths field containing glob patterns (A), and because matching is glob-based rather than directory-based, a rule scoped to a test-file pattern applies anywhere that pattern matches (C). B is false -- rules are independent of subdirectory CLAUDE.md files. D is false -- rules use YAML frontmatter with a Markdown body, not JSON. E is false -- rules complement, not replace, project-level CLAUDE.md for universal standards."
        },
        {
          id: "P3-S2-Q5",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Meridian built a .claude/skills/codebase-audit/SKILL.md skill that Claude Code runs to scan the entire monorepo for deprecated API usage and produce a long findings report. Engineers complain that invoking the skill fills up their main conversation with hundreds of lines of scan output, making it hard to continue their original task afterward. What frontmatter change addresses this?",
          options: [
            { key: "A", text: "Add argument-hint: \"<module-name>\" so engineers must scope the scan manually, since narrowing the scan target is believed to proportionally reduce the length of the findings report the skill ultimately prints into the conversation." },
            { key: "B", text: "Set allowed-tools: [\"Read\"] to prevent the skill from writing output, on the theory that restricting the skill to read-only access will stop scan results from being echoed into the conversation." },
            { key: "C", text: "Move the skill from .claude/skills/ to .claude/commands/ so it runs as a slash command instead." },
            { key: "D", text: "Set context: fork in the skill's frontmatter so the skill runs in an isolated sub-agent context." }
          ],
          correct: ["D"],
          explanation: "context: fork runs a skill in an isolated sub-agent context so its verbose output does not pollute the main conversation. A merely narrows scope but does not solve the context-pollution problem for however large the scan still is. B restricts tool access, not where the output lands, and would likely break a skill that only needs to read many files. C changes invocation mechanism but does not isolate the output from the main session."
        },
        {
          id: "P3-S2-Q6",
          domain: 3,
          task: "3.2",
          type: "multiple",
          select: 2,
          stem: "The team is finishing a .claude/skills/generate-migration/SKILL.md skill that scaffolds a new database migration file from a description. Which two frontmatter configurations are both correct and appropriate for this skill? (Select TWO.)",
          options: [
            { key: "A", text: "allowed-tools must list at least five tools, since skills cannot function with a restricted tool set." },
            { key: "B", text: "argument-hint: \"<table-name> <description>\" so developers see an explanation of required parameters when invoking the skill without arguments." },
            { key: "C", text: "context: fork is required on every skill, regardless of whether its output is short or long." },
            { key: "D", text: "allowed-tools: [\"Write\"] to restrict the skill to file-creation only, preventing it from running arbitrary Bash commands." },
            { key: "E", text: "argument-hint only works for skills invoked from .claude/commands/, not .claude/skills/." }
          ],
          correct: ["B", "D"],
          explanation: "argument-hint surfaces the expected parameters when a developer invokes the skill without arguments (B), and allowed-tools scopes a skill to only the tools it needs, such as Write-only access to prevent unintended destructive actions (D). A is false -- restricting allowed-tools to one or two entries is a recommended practice, not a limitation. C is false -- context: fork suits verbose or exploratory output, it is not mandatory for every skill. E is false -- argument-hint is a skill frontmatter option for .claude/skills/, unrelated to .claude/commands/."
        },
        {
          id: "P3-S2-Q7",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A senior engineer swears they added a rule to never use the deprecated LegacyHttpClient in new code, yet Claude Code keeps suggesting it in a particular package. They want to confirm which CLAUDE.md and rule files are actually being loaded for the current session before debugging further. What should they do first?",
          options: [
            { key: "A", text: "Run the /memory command to list which memory files are currently loaded for the session." },
            { key: "B", text: "Delete and recreate the package's CLAUDE.md file, assuming it is corrupted." },
            { key: "C", text: "Ask Claude directly whether it has read the CLAUDE.md file, and trust its reported answer." },
            { key: "D", text: "Restart the terminal and hope the configuration reloads correctly, since a fresh process sometimes picks up CLAUDE.md edits that an existing session's cached file list has not re-scanned yet." },
          ],
          correct: ["A"],
          explanation: "/memory is the documented command for inspecting which memory files (CLAUDE.md, rules) are loaded in a session, making it the correct first diagnostic step. B is destructive and premature without first confirming what is actually loaded. C relies on the model's self-report about its own context, which is not a reliable diagnostic. D is a vague workaround that does not actually inspect configuration state."
        },
        {
          id: "P3-S2-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "Meridian is migrating its shipment-tracking service from a single Node.js monolith to three separate microservices (ingestion, routing, notifications), a change touching roughly 60 files and requiring decisions about service boundaries and shared data ownership. Which approach should the lead engineer take?",
          options: [
            { key: "A", text: "Use direct execution and let the natural boundaries emerge as files are split incrementally, since Claude Code can always revert an individual file if a boundary choice later turns out to be wrong." },
            { key: "B", text: "Enter plan mode first to explore the codebase, evaluate boundary options, and design an approach before any files are changed." },
            { key: "C", text: "Write exhaustive upfront instructions specifying every file to create, then execute directly." },
            { key: "D", text: "Start in direct execution and switch to plan mode only if unexpected complexity appears, since most multi-file refactors turn out simpler in practice than they first look and upfront planning often wastes time." }
          ],
          correct: ["B"],
          explanation: "Plan mode exists for exactly this situation -- large-scale, multi-file changes with architectural decisions and multiple valid approaches -- enabling safe exploration before committing to changes. A risks costly rework once dependencies surface mid-migration. C assumes the right structure is already known without exploration. D ignores that the complexity is already evident upfront rather than something that might emerge later."
        },
        {
          id: "P3-S2-Q9",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An engineer spent an afternoon in a Claude Code session named debug-notification-lag investigating why notification delivery lags behind shipment events. At the end of the day the session ends, and the next morning they want to continue exactly that investigation with its accumulated findings rather than starting over. What should they do?",
          options: [
            { key: "A", text: "Start a brand-new session and paste in a summary of yesterday's findings from memory." },
            { key: "B", text: "Re-open the same terminal window, assuming Claude Code automatically remembers the prior session." },
            { key: "C", text: "Run claude --resume debug-notification-lag to continue the named session." },
            { key: "D", text: "Use fork_session to branch a new investigation from yesterday's session." }
          ],
          correct: ["C"],
          explanation: "--resume <session-name> is the documented mechanism for continuing a specific prior named conversation with its full accumulated context. A discards potentially valid context unnecessarily. B is not how session state is preserved -- reopening a terminal does not reattach to a named session. D creates a new independent branch for exploring a divergent approach, which is not what is needed when simply continuing the same investigation."
        },
        {
          id: "P3-S2-Q10",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "After a long session analyzing the checkout service's test coverage gaps, two engineers want to try different fixes independently: one wants to add contract tests, the other wants to refactor toward dependency injection to make the code easier to test. Both approaches should start from the same accumulated codebase analysis without either engineer's experiment affecting the other's. What is the best approach?",
          options: [
            { key: "A", text: "Use fork_session to create two independent branches from the shared analysis baseline." },
            { key: "B", text: "Have both engineers resume the same named session sequentially, taking turns." },
            { key: "C", text: "Start two unrelated sessions from scratch so each engineer re-explores the codebase independently." },
            { key: "D", text: "Have one engineer complete their change first, then resume that session for the second approach." }
          ],
          correct: ["A"],
          explanation: "fork_session is designed precisely for exploring divergent approaches from a shared analysis baseline, giving each branch independent state. B forces serialized access and risks one engineer's changes contaminating the other's exploration. C discards the valuable shared analysis and duplicates exploration effort. D makes the second approach dependent on and polluted by the first engineer's actual changes rather than the shared baseline."
        },
        {
          id: "P3-S2-Q11",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A session that previously mapped out the routing service's dependency graph is resumed a week later using --resume, but in the meantime another team refactored three of the files that session had already analyzed. What is the most reliable way to proceed?",
          options: [
            { key: "A", text: "Trust the resumed session's prior analysis of those three files since resumption restores full context." },
            { key: "B", text: "Discard the session entirely and start a brand-new investigation of the whole dependency graph from scratch." },
            { key: "C", text: "Ask the agent to guess which files might be stale based on its own confidence in the prior findings, since a model that performed the original analysis should intuitively sense when its own conclusions have gone out of date." },
            { key: "D", text: "Explicitly tell the agent which specific files changed so it can re-analyze just those files rather than relying on stale tool results." }
          ],
          correct: ["D"],
          explanation: "Informing a resumed session about specific file changes enables targeted re-analysis of just the affected files rather than requiring full re-exploration or risking silently stale conclusions. A is unsafe because resumed tool results are not automatically refreshed and may now be inaccurate. B discards an otherwise valid baseline, wasting the exploration already completed on unaffected files. C relies on the model's self-assessed confidence about staleness, which it has no real way to know without being told."
        },
        {
          id: "P3-S2-Q12",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "An engineer is using Claude Code to understand an unfamiliar inventory-reconciliation module before making a change. The investigation phase alone involves reading dozens of files and produces thousands of lines of exploratory output, and the engineer is worried this will exhaust the context budget needed for the actual implementation phase. What should they do?",
          options: [
            { key: "A", text: "Read every file in the module directly in the main conversation to build complete understanding." },
            { key: "B", text: "Increase the model's context window setting so all exploratory output fits comfortably." },
            { key: "C", text: "Delegate the exploratory reading to an Explore subagent, which isolates the verbose discovery output and returns a condensed summary to the main conversation." },
            { key: "D", text: "Skip exploration and ask Claude to implement the change directly based on its training knowledge of similar inventory-reconciliation modules, since generic architectural patterns usually transfer well enough to avoid a separate investigation phase." }
          ],
          correct: ["C"],
          explanation: "The Explore subagent is specifically designed to isolate verbose discovery output in a separate context, returning only a summary to preserve the main conversation's budget for implementation. A directly causes the context exhaustion the engineer is worried about. B is not a real lever available to the engineer and does not address the underlying inefficiency of dumping raw exploration into one conversation. D risks generating code based on generic assumptions rather than this specific module's actual structure."
        },
        {
          id: "P3-S2-Q13",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "Midway through a long Claude Code session tracing a bug across the shipment-tracking service, the conversation has accumulated so much exploratory Grep and Read output that responses start slowing down and referencing files only vaguely. The engineer wants to keep working in the same session without losing the key findings already established. What should they do?",
          options: [
            { key: "A", text: "Run /compact to reduce context usage while preserving the session's key findings." },
            { key: "B", text: "Abandon the session and start over, since accumulated context cannot be reduced mid-session." },
            { key: "C", text: "Manually delete the CLAUDE.md file to free up context space." },
            { key: "D", text: "Switch to plan mode, which automatically clears prior conversation history." }
          ],
          correct: ["A"],
          explanation: "/compact is the documented mechanism for reducing context usage during extended exploration sessions when context fills with verbose discovery output, while retaining the session's useful state. B unnecessarily discards a session that can be compacted instead. C would not affect conversation history and is unrelated to the problem. D does not describe how plan mode works -- it does not clear history as a side effect."
        },
        {
          id: "P3-S2-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "During a multi-hour pairing session, Claude periodically summarizes earlier parts of a long debugging conversation to save context. The engineer later notices that a summary replaced \"the retry queue backed up to 14,382 messages at 03:12 UTC before the consumer crashed\" with \"the retry queue grew large before crashing,\" and this vague version is now the only record of that incident in context. What is the best way to prevent this going forward?",
          options: [
            { key: "A", text: "Disable summarization entirely and keep the full, unsummarized transcript in context at all times, since any amount of lossy compression risks silently dropping some operationally important numeric detail later." },
            { key: "B", text: "Ask Claude to try harder to remember numbers accurately during future summarizations." },
            { key: "C", text: "Switch to a model with a larger context window so summarization is never triggered." },
            { key: "D", text: "Extract exact figures and timestamps into a persistent notes block that is included in every prompt, separate from the summarized narrative history." }
          ],
          correct: ["D"],
          explanation: "Progressive summarization risks condensing precise numerical details into vague language, so extracting exact facts into a persistent block outside the summarized narrative preserves them regardless of later compaction. A does not scale for genuinely long sessions and defeats the purpose of summarization. B relies on probabilistic model behavior to avoid a known failure mode rather than fixing the underlying process. C treats a structural information-loss problem as if it were purely a capacity problem, which it is not."
        },
        {
          id: "P3-S2-Q15",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "An engineer asks Claude Code to \"convert all callback-style functions in this module to use async/await,\" but across several files the results are inconsistent: some conversions correctly handle error propagation, others silently drop error handling, and some leave a mix of styles. Prose instructions have already been refined twice without improvement. What should the engineer try next?",
          options: [
            { key: "A", text: "Repeat the same prose instruction a third time, emphasizing the word \"consistently\" more strongly." },
            { key: "B", text: "Provide 2-3 concrete before/after code examples showing the exact transformation expected, including correct error handling." },
            { key: "C", text: "Lower the task's priority and accept that some files will need manual follow-up fixes." },
            { key: "D", text: "Split the instruction into a numbered list of twelve highly detailed grammatical rules for async syntax, covering every possible callback shape so no edge case is left to Claude's own interpretation of the conversion." }
          ],
          correct: ["B"],
          explanation: "Concrete input/output examples are the most effective way to communicate an expected transformation when prose descriptions produce inconsistent results, since they show exactly what correct output looks like, including edge cases like error handling. A repeats an already-ineffective strategy. C accepts a quality problem instead of addressing it. D adds more prose detail, which is the same category of intervention that already failed twice."
        }
      ]
    },
    {
      id: 4,
      title: "Developer Productivity with Claude",
      description: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      questions: [
        {
          id: "P3-S4-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "ForgeAssist, Forge Dynamics Manufacturing's internal developer agent, calls a tool, receives results, and must decide whether to keep working or hand back a final answer. Which control-flow rule correctly implements the agentic loop?",
          options: [
            { key: "A", text: "Continue executing tools while stop_reason is \"tool_use\", and terminate the loop once stop_reason is \"end_turn\"." },
            { key: "B", text: "Continue the loop until the assistant's response contains no text content, regardless of stop_reason." },
            { key: "C", text: "Continue the loop for a fixed number of iterations (e.g., 10) regardless of stop_reason, since a conservative fixed cap set well above the typical depth of a task is considered an acceptable safety net in most agent loop implementations." },
            { key: "D", text: "Continue the loop until the response text contains the word \"done\" or \"complete\", since models are generally trained to use clear completion language once a task is genuinely finished." }
          ],
          correct: ["A"],
          explanation: "The agentic loop should branch on stop_reason -- \"tool_use\" means continue the loop with the executed tool results appended to context, and \"end_turn\" means the model has finished and the loop should terminate. B, C, and D are all named anti-patterns: checking for absent text content, using an arbitrary iteration cap as the primary stop condition, and parsing natural-language signals to detect completion are all unreliable compared to using stop_reason directly."
        },
        {
          id: "P3-S4-Q2",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "During testing, ForgeAssist occasionally keeps calling tools well past the point where the legacy-code migration task is actually finished, because the stopping logic scans each assistant message for phrases like \"task complete\" or \"all done\" before ending the loop. What is the problem with this approach, and what should replace it?",
          options: [
            { key: "A", text: "The phrases are too short; lengthening them to full sentences would fix the issue reliably." },
            { key: "B", text: "Parsing natural-language signals to detect completion is unreliable; the loop should instead terminate based on stop_reason being \"end_turn\"." },
            { key: "C", text: "The model is not instructed strongly enough to use the exact phrase; adding few-shot examples of the phrase would fix it." },
            { key: "D", text: "The loop should instead stop after a fixed cap of 20 tool calls regardless of what the model says, since 20 iterations comfortably covers the typical depth needed for a legacy-code migration task like this one." }
          ],
          correct: ["B"],
          explanation: "Parsing natural-language signals to decide when to stop is an explicitly unreliable anti-pattern, because phrasing varies and can appear incidentally; stop_reason is the deterministic signal the API already provides for this purpose. A and C try to patch the unreliable text-matching approach rather than replacing it. D substitutes one anti-pattern (arbitrary iteration caps) for another instead of using stop_reason."
        },
        {
          id: "P3-S4-Q3",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "ForgeAssist integrates with three legacy systems: a COBOL batch scheduler that reports timestamps as Unix epoch integers, a Java inventory service that uses ISO 8601 strings, and a Postgres-backed parts database that returns numeric status codes (0, 1, 2) instead of named statuses. Claude frequently misinterprets these inconsistent formats when reasoning across systems. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a system-prompt instruction telling Claude to interpret each format correctly based on context, since clear natural-language guidance about format conventions is usually sufficient for a capable model to apply consistently across every tool call." },
            { key: "B", text: "Ask engineers to manually normalize values before pasting them into the conversation." },
            { key: "C", text: "Implement a PostToolUse hook that normalizes timestamps and status codes into a consistent format before Claude processes the tool results." },
            { key: "D", text: "Switch all three legacy systems to use the same internal database schema, so every timestamp and status code is emitted in one canonical representation Claude never has to normalize." }
          ],
          correct: ["C"],
          explanation: "A PostToolUse hook can deterministically normalize heterogeneous data formats -- timestamps and status codes -- before Claude ever reasons about them, which is far more reliable than hoping the model infers format correctly from context (A) or relying on manual human intervention (B). D would solve the problem but requires rewriting legacy systems, which is disproportionate when a hook solves it at the integration layer."
        },
        {
          id: "P3-S4-Q4",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "A Bash tool available to ForgeAssist can run arbitrary shell commands against the legacy build server, including destructive ones. The system prompt instructs the agent to \"never run destructive commands like force-pushes or recursive deletes without explicit confirmation,\" but a production incident occurred when the agent ran a force-push to a shared branch anyway. What should Forge Dynamics implement to prevent recurrence?",
          options: [
            { key: "A", text: "Strengthen the system-prompt wording with additional capitalized warnings about destructive commands, since more forceful emphatic phrasing typically makes models far less likely to violate an explicit safety instruction." },
            { key: "B", text: "Add a few-shot example showing the agent refusing to force-push." },
            { key: "C", text: "Lower the model's temperature so it behaves more conservatively." },
            { key: "D", text: "Implement a tool-call interception hook that blocks destructive Bash command patterns programmatically, redirecting to a confirmation workflow." }
          ],
          correct: ["D"],
          explanation: "When a business rule requires guaranteed compliance -- such as never force-pushing without confirmation -- only programmatic enforcement via a hook that intercepts and blocks the tool call provides deterministic guarantees; prompt instructions alone have a non-zero failure rate, as the incident demonstrated. A, B, and C all remain within the probabilistic prompt-based category of fixes that already failed."
        },
        {
          id: "P3-S4-Q5",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "An engineering manager asks ForgeAssist to \"add comprehensive tests to the legacy order-processing module,\" which has no existing test coverage and unclear internal structure. What task decomposition strategy is most appropriate for this open-ended request?",
          options: [
            { key: "A", text: "First map the module's structure and identify high-impact areas, then create a prioritized test plan that adapts as dependencies are discovered." },
            { key: "B", text: "Immediately generate tests for every function in file order, top to bottom, without further analysis." },
            { key: "C", text: "Use a fixed five-step pipeline (parse, mock, assert, run, report) applied identically regardless of what the exploration finds, since standardized pipelines are generally considered best practice for any testing task regardless of codebase familiarity." },
            { key: "D", text: "Ask the engineer to specify the exact list of functions to test before starting any work, since the person requesting the tests presumably already knows which functions in the module matter most and can save exploration time." }
          ],
          correct: ["A"],
          explanation: "Open-ended tasks like adding comprehensive tests to an unfamiliar legacy module benefit from adaptive decomposition: mapping structure first, identifying high-impact areas, then building a plan that adjusts as dependencies are discovered. B ignores structure and risks wasting effort on low-value tests. C is a fixed pipeline suited to predictable, well-understood reviews, not open-ended investigation. D defeats the purpose of using an agent to explore an unfamiliar codebase."
        },
        {
          id: "P3-S4-Q6",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "The ForgeAssist coordinator is being configured to delegate codebase exploration to specialized subagents (one for tracing database calls, one for tracing message-queue consumers). The coordinator currently cannot invoke either subagent. What configuration is most likely missing?",
          options: [
            { key: "A", text: "The subagents need their own separate .mcp.json files to be invocable." },
            { key: "B", text: "The coordinator's allowedTools list does not include \"Task\", which is required to spawn subagents." },
            { key: "C", text: "The subagents must be registered in CLAUDE.md before they can be invoked." },
            { key: "D", text: "The coordinator needs a higher max_tokens setting to support subagent delegation, since spawning and coordinating multiple subagents inherently requires a larger response budget than a single-agent conversation." }
          ],
          correct: ["B"],
          explanation: "The Task tool is the mechanism for spawning subagents, and a coordinator's allowedTools configuration must explicitly include \"Task\" for subagent invocation to be available at all. A, C, and D describe configuration mechanisms unrelated to enabling subagent spawning."
        },
        {
          id: "P3-S4-Q7",
          domain: 2,
          task: "2.5",
          type: "single",
          select: 1,
          stem: "An engineer wants ForgeAssist to find every file in the legacy codebase that references a deprecated function, calculateLegacyTax, including the exact lines where it is called. Which built-in tool is the correct choice for this step?",
          options: [
            { key: "A", text: "Glob, to match files named calculateLegacyTax.*" },
            { key: "B", text: "Bash, to run an arbitrary find and grep pipeline command across the entire repository instead of using a purpose-built search tool." },
            { key: "C", text: "Grep, to search file contents for the string calculateLegacyTax." },
            { key: "D", text: "Write, to create a new file listing suspected callers, since generating a fresh tracking file is a reasonable first step before any search tool is invoked." },
          ],
          correct: ["C"],
          explanation: "Grep is designed for content search -- finding where a pattern like a function name appears inside file contents -- which is exactly this task. A (Glob) matches file paths by name pattern, not file contents, and would not find a function referenced inside unrelated filenames. B works around a purpose-built tool with a less reliable general-purpose shell command. D does not search anything at all."
        },
        {
          id: "P3-S4-Q8",
          domain: 2,
          task: "2.5",
          type: "single",
          select: 1,
          stem: "ForgeAssist attempts to use the Edit tool to change a configuration value inside legacy-config.properties, but the edit fails because the string being replaced appears eleven identical times in the file with no distinguishing context. What is the most reliable way to proceed?",
          options: [
            { key: "A", text: "Keep retrying the same Edit call, since it will eventually succeed through nondeterminism." },
            { key: "B", text: "Use Grep to find all eleven matches and manually pick one at random to edit." },
            { key: "C", text: "Switch to the Bash tool to run a sed command across the whole file, since sed's line-addressed substitution can target the exact occurrence more precisely than a text-based Edit anchor." },
            { key: "D", text: "Read the full file, construct the corrected content in context, and use Write to replace the entire file." }
          ],
          correct: ["D"],
          explanation: "When Edit fails due to non-unique anchor text, Read followed by Write is the documented fallback for reliable file modification, since it lets the full corrected content be constructed with the right single change applied. A will not succeed through retries -- the ambiguity is structural, not transient. B introduces risk of editing the wrong occurrence. C bypasses the built-in tools with a less controlled approach."
        },
        {
          id: "P3-S4-Q9",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "ForgeAssist currently has access to 18 tools spanning build automation, ticket management, database queries, and deployment, all available simultaneously regardless of the task at hand. Engineers report that it frequently calls the wrong tool for straightforward tasks, such as calling a deployment tool when asked to look up a ticket. What is the most effective fix?",
          options: [
            { key: "A", text: "Scope ForgeAssist down to only the 4-5 tools relevant to its current task context, rather than exposing all 18 at once." },
            { key: "B", text: "Add more detailed tool descriptions to all 18 tools so the model can better distinguish between them without reducing the set." },
            { key: "C", text: "Increase the model's context window so it can consider all 18 tool descriptions more carefully." },
            { key: "D", text: "Rename all 18 tools using a consistent naming convention (e.g., tool_01 through tool_18), since a uniform naming scheme helps the model recognize tool families even when the underlying function set stays unchanged." },
          ],
          correct: ["A"],
          explanation: "Giving an agent access to too many tools at once (e.g., 18 instead of a focused 4-5) degrades tool selection reliability by increasing decision complexity; scoping tool access to what is relevant for the current role or task directly addresses this root cause. B treats symptoms without reducing the fundamentally difficult decision space. C does not solve a tool-selection problem with more capacity. D does not address functional overlap or scope at all."
        },
        {
          id: "P3-S4-Q10",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Forge Dynamics wants to share a custom PartsCatalogMCP server configuration with the whole engineering team via version control, while one engineer also wants to experiment privately with an early-access analytics MCP server that should not affect teammates. How should these be configured?",
          options: [
            { key: "A", text: "Configure both servers in a single ~/.claude.json so they are available to everyone automatically." },
            { key: "B", text: "Put PartsCatalogMCP in .mcp.json with env-var credential expansion, and keep the experimental analytics server in the engineer's personal ~/.claude.json." },
            { key: "C", text: "Configure both servers in .mcp.json, and have the engineer comment out the analytics server before every commit, trusting manual discipline to prevent accidentally shipping experimental credentials to the whole team." },
            { key: "D", text: "Configure PartsCatalogMCP in ~/.claude.json so each engineer can tune it individually." }
          ],
          correct: ["B"],
          explanation: "Project-scoped .mcp.json (checked into version control, with environment variable expansion like ${PARTS_API_TOKEN} for credentials) is correct for shared team tooling, while user-scoped ~/.claude.json is correct for personal or experimental servers that should not affect teammates. A and D put a shared dependency in a personal-only location, meaning teammates would not receive it. C is fragile and error-prone, risking accidental commits of experimental configuration."
        },
        {
          id: "P3-S4-Q11",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "ForgeAssist has both the built-in Grep tool and a custom MCP tool, search_legacy_symbols, that performs semantic symbol-aware search across the COBOL and Java codebases (tracking renames, cross-references, and call hierarchies). Despite this capability, ForgeAssist keeps using plain Grep for complex symbol lookups, missing renamed references that search_legacy_symbols would catch. The MCP tool's description currently just says \"Searches the legacy codebase.\" What is the most effective first step?",
          options: [
            { key: "A", text: "Remove the Grep tool entirely so ForgeAssist has no alternative but to use search_legacy_symbols." },
            { key: "B", text: "Add a hook that blocks Grep calls and redirects them to search_legacy_symbols automatically." },
            { key: "C", text: "Rewrite the search_legacy_symbols description to clearly explain its semantic capabilities, inputs, and when to prefer it over plain text search." },
            { key: "D", text: "Instruct engineers to manually request search_legacy_symbols by name in every prompt, since explicitly naming the tool guarantees Claude will use it instead of falling back to plain Grep." }
          ],
          correct: ["C"],
          explanation: "Tool descriptions are the primary mechanism Claude uses for tool selection, and a vague description like \"Searches the legacy codebase\" gives no reason to prefer the MCP tool over the familiar built-in Grep; enhancing the description to explain its specific capabilities directly addresses this. A removes useful functionality rather than fixing selection. B is a blunt workaround that could break cases where plain text search is actually sufficient. D is not scalable and defeats the purpose of automated tool selection."
        },
        {
          id: "P3-S4-Q12",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "ForgeAssist is three hours into exploring the legacy order-processing subsystem across 40+ files. An engineer notices that when asked a new question about a class it discussed an hour earlier, ForgeAssist now gives an answer that conflicts with its own earlier finding, describing \"typical patterns\" instead of the specific class it originally inspected. What should be done to counteract this?",
          options: [
            { key: "A", text: "Reduce the context window size so older findings are dropped faster and cannot conflict." },
            { key: "B", text: "Restart the exploration from scratch every time a new question is asked, to guarantee fresh analysis uncontaminated by any earlier finding that might have degraded or been misremembered." },
            { key: "C", text: "Instruct ForgeAssist to always say \"I don't recall\" rather than risk giving an inconsistent answer." },
            { key: "D", text: "Have ForgeAssist maintain a scratchpad file of key findings as it explores, referencing it when answering later questions instead of relying on conversation memory alone." }
          ],
          correct: ["D"],
          explanation: "Scratchpad files that persist key findings across context boundaries are the documented technique for counteracting the context-degradation effect where extended sessions start giving inconsistent answers referencing \"typical patterns\" instead of specific earlier findings. A does not fix inconsistency; it just discards information faster. B is extremely wasteful and does not scale to a long exploration session. C avoids the symptom without fixing the underlying degradation."
        },
        {
          id: "P3-S4-Q13",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "Forge Dynamics is wrapping the legacy PartsCatalog SOAP service as an MCP tool. The team wants ForgeAssist to handle failures intelligently rather than treating every failure the same way. Which two practices should the tool implementation follow? (Select TWO.)",
          options: [
            { key: "A", text: "Return structured error metadata including errorCategory (e.g., \"transient\", \"validation\", \"permission\") and an isRetryable boolean alongside a human-readable description." },
            { key: "B", text: "Always return a generic \"Operation failed\" message regardless of failure type, so error handling logic stays simple." },
            { key: "C", text: "Treat a successful query that returns zero matching parts the same as a connection timeout, since both represent \"no result\"." },
            { key: "D", text: "Mark business-rule violations (e.g., a part number outside the catalog's valid range) with retriable: false and a customer-friendly explanation." },
            { key: "E", text: "Suppress all errors silently and return an empty result set so the agent never sees a failure." }
          ],
          correct: ["A", "D"],
          explanation: "Structured error metadata (errorCategory, isRetryable) lets the agent make informed recovery decisions (A), and marking business-rule violations as non-retryable with a clear explanation prevents wasted retries while letting the agent communicate appropriately (D). B is the explicitly named anti-pattern of uniform generic error responses that hides the reason for failure. C conflates a valid empty result with an actual access failure, which are meaningfully different situations. E silently suppresses real failures by misrepresenting them as success."
        },
        {
          id: "P3-S4-Q14",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "The ForgeAssist team is reviewing how tool_choice is configured for different parts of the agent. Which two statements correctly describe tool_choice behavior? (Select TWO.)",
          options: [
            { key: "A", text: "tool_choice: \"auto\" guarantees the model will call a tool and never return plain conversational text." },
            { key: "B", text: "tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"} forces the model to call that specific tool rather than choosing among all available tools." },
            { key: "C", text: "tool_choice: \"any\" prevents the model from calling more than one tool across the whole conversation." },
            { key: "D", text: "tool_choice settings apply only to MCP tools, not to tools defined directly in the API request." },
            { key: "E", text: "tool_choice: \"any\" guarantees the model calls some tool rather than responding with only text, without forcing a specific one." }
          ],
          correct: ["B", "E"],
          explanation: "Forced tool selection via {\"type\": \"tool\", \"name\": ...} compels a specific named tool call (B), while \"any\" guarantees some tool is called without specifying which one (E). A is wrong -- \"auto\" leaves the model free to respond with text instead of a tool call. C conflates a single-turn setting with a multi-turn restriction that does not exist. D is false -- tool_choice applies uniformly regardless of whether tools originate from MCP or are defined directly."
        },
        {
          id: "P3-S4-Q15",
          domain: 1,
          task: "1.3",
          type: "multiple",
          select: 2,
          stem: "The ForgeAssist coordinator needs to delegate a codebase-wide refactor investigation to two subagents at once: one tracing database schema usage, one tracing API contract usage. Which two practices will correctly achieve efficient, well-scoped parallel delegation? (Select TWO.)",
          options: [
            { key: "A", text: "Let each subagent automatically inherit the coordinator's full conversation history so no context needs to be passed explicitly." },
            { key: "B", text: "Invoke the two subagents across two separate coordinator turns, one after another, to keep the Task tool calls isolated." },
            { key: "C", text: "Emit both Task tool calls for the database and API subagents within a single coordinator response to run them in parallel." },
            { key: "D", text: "Give each subagent broad tool access to every system the coordinator can reach, in case its investigation expands." },
            { key: "E", text: "Explicitly include the complete relevant findings and goals for each subagent directly in its prompt, since subagents do not automatically inherit parent context." }
          ],
          correct: ["C", "E"],
          explanation: "Emitting multiple Task tool calls within a single coordinator response is what achieves true parallel subagent execution (C), and because subagents operate with isolated context and do not inherit the coordinator's conversation history, complete relevant findings must be explicitly included in each subagent's prompt (E). A is false -- context is never automatically inherited. B serializes what could be parallel work, adding unnecessary latency. D violates scoped tool access and risks cross-specialization misuse."
        }
      ]
    },
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P3-S5-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Atlas Freight Systems wires Claude Code into its CI pipeline with the command claude \"Review this PR for correctness and security issues\" (no additional flags). On every PR, the job hangs for the full 30-minute job timeout and is then killed. What is the correct fix?",
          options: [
            { key: "A", text: "Add the -p (or --print) flag so Claude Code runs in non-interactive mode and exits after producing output." },
            { key: "B", text: "Set an environment variable CLAUDE_CI=true before invoking Claude Code." },
            { key: "C", text: "Pipe /dev/null into the command's stdin as a workaround." },
            { key: "D", text: "Add a --ci flag to suppress Claude Code's interactive prompts, since many CLI tools expose a dedicated continuous-integration mode flag that disables prompts and exits automatically once the task finishes." }
          ],
          correct: ["A"],
          explanation: "The -p / --print flag is the documented way to run Claude Code non-interactively, processing the prompt and exiting without waiting for input -- exactly what a CI job needs. B and D reference flags and environment variables that do not exist in Claude Code. C is a workaround that does not address the actual CLI invocation mode."
        },
        {
          id: "P3-S5-Q2",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Atlas wants the CI pipeline to post Claude's code review findings as individual inline PR comments, which requires each finding to be reliably parseable as structured data (file, line, severity, message) rather than free-form prose. Which combination of flags best achieves this?",
          options: [
            { key: "A", text: "--verbose combined with --output-format text, since verbose mode is commonly assumed to add the structural line-and-severity tagging that downstream PR-comment parsers need." },
            { key: "B", text: "--output-format json combined with --json-schema to enforce a specific findings schema" },
            { key: "C", text: "-p combined with --markdown" },
            { key: "D", text: "--output-format json alone, with no schema, relying on the model to format consistently" }
          ],
          correct: ["B"],
          explanation: "--output-format json produces machine-parseable output, and --json-schema additionally enforces that the output conforms to a specific structure, which is what reliable automated parsing for inline PR comments requires. A produces free-form text, defeating the purpose. C does not address structured output at all. D without a schema still risks structurally inconsistent JSON across runs."
        },
        {
          id: "P3-S5-Q3",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "A developer pushes three additional commits to an open PR after Claude Code's first automated review already flagged five issues. The team wants the re-run review to avoid re-posting the same five comments as duplicates while still catching genuinely new problems introduced by the latest commits. What should the CI configuration do?",
          options: [
            { key: "A", text: "Re-run the review from scratch with no awareness of the prior run, accepting some duplicate comments as an acceptable tradeoff." },
            { key: "B", text: "Disable automated review entirely after the first pass on any given PR." },
            { key: "C", text: "Include the prior review's findings in context on re-run, instructing Claude to report only new or still-unaddressed issues." },
            { key: "D", text: "Increase the model's temperature on re-runs so it generates different wording for the same issues, making duplicates less obvious." }
          ],
          correct: ["C"],
          explanation: "Including prior findings in context and explicitly instructing the model to report only new or unresolved issues is the documented approach for avoiding duplicate comments across re-reviews triggered by new commits. A accepts the exact problem the team wants to avoid. B removes value from every subsequent commit, not just duplicates. D obscures duplicates cosmetically rather than eliminating them."
        },
        {
          id: "P3-S5-Q4",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Atlas's automated test-generation step frequently proposes new test cases that duplicate scenarios already covered by the existing test suite, wasting reviewer time filtering them out. What change to the CI prompt would most directly reduce this?",
          options: [
            { key: "A", text: "Lower the number of tests requested per PR." },
            { key: "B", text: "Instruct Claude to be more \"creative\" when generating test scenarios, since broadening the model's exploration of possible inputs is often assumed to naturally steer it away from scenarios already covered." },
            { key: "C", text: "Add a post-processing step that runs all generated tests and discards the ones that pass, on the assumption that a test which already passes against current code must be redundant with existing coverage." },
            { key: "D", text: "Provide the existing test files as context so test generation can check for and avoid already-covered scenarios." }
          ],
          correct: ["D"],
          explanation: "Including existing test files in context lets Claude check what is already covered and avoid proposing duplicate scenarios, directly addressing the root cause. A reduces volume without addressing redundancy. B is vague and does not change what context the model has. C is expensive and does not prevent redundant tests from being generated in the first place -- it only filters after the fact, and passing is not even a reliable indicator of redundancy."
        },
        {
          id: "P3-S5-Q5",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Atlas's test-generation step frequently proposes shallow tests that check only the happy path and ignore known edge cases like empty shipment manifests or duplicate tracking numbers, because the model has no information about what makes a \"valuable\" test for this codebase. What should the team add to improve generation quality?",
          options: [
            { key: "A", text: "Document testing standards, criteria for valuable tests, and available fixtures in CLAUDE.md so CI-invoked Claude Code has this context." },
            { key: "B", text: "Increase the number of generated tests per PR so edge cases appear by volume alone." },
            { key: "C", text: "Ask reviewers to manually rewrite every generated test before merging." },
            { key: "D", text: "Switch the test-generation step to use the Message Batches API for consistency, since batch processing runs every request through the identical pipeline configuration and should yield more uniform test quality." }
          ],
          correct: ["A"],
          explanation: "CLAUDE.md is the mechanism for providing project context -- such as testing standards, valuable test criteria, and available fixtures -- to CI-invoked Claude Code, directly improving what the model considers when generating tests. B increases quantity without improving relevance. C defeats the purpose of automation. D changes the processing model, not the quality of context informing test generation."
        },
        {
          id: "P3-S5-Q6",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Atlas currently has the same Claude Code session that generated a bug fix also review that fix for correctness before posting it for human approval. Reviewers notice this self-review rarely flags problems with the agent's own reasoning, even when subtle logic errors are present. What explains this and what should change?",
          options: [
            { key: "A", text: "The self-reviewing session needs a stricter system prompt reminding it to be skeptical of its own work, since explicitly instructing a model to doubt its own prior reasoning is generally sufficient to overcome the anchoring effect of context it already generated earlier in the same session." },
            { key: "B", text: "The same session retains its generation reasoning, making it less likely to question its own decisions; an independent review instance without that prior context should perform the review instead." },
            { key: "C", text: "The issue is random variance; running the self-review three times and averaging the results would fix it." },
            { key: "D", text: "Self-review is reliable in general; the specific failures observed are unrelated to session continuity and are better explained as isolated instances of ordinary model variance across different bug-fix scenarios." }
          ],
          correct: ["B"],
          explanation: "A model that generated code retains its own reasoning context in the same session, making it less likely to question its own decisions than an independent instance without that prior reasoning would be -- this is why a separate review instance is more effective. A keeps the same compromised session rather than removing the bias. C does not address the structural reason self-review underperforms. D denies a well-documented limitation."
        },
        {
          id: "P3-S5-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "A pull request modifies 14 files across Atlas's rate-calculation module. A single pass reviewing all 14 files together produces inconsistent depth -- detailed comments on some files, superficial ones on others -- and contradicts itself by flagging a pattern as a bug in one file while approving the identical pattern elsewhere in the same PR. What restructuring best addresses this?",
          options: [
            { key: "A", text: "Require the PR to be split into smaller submissions of 3-4 files before any automated review runs." },
            { key: "B", text: "Run the review three times on the full PR and keep only findings that appear in at least two runs." },
            { key: "C", text: "Split the review into a per-file pass for local issues plus a separate cross-file integration pass for data-flow consistency across files." },
            { key: "D", text: "Switch to a larger-context model so all 14 files receive equal attention in a single pass, since more context capacity should let the model track cross-file consistency without needing to restructure the review itself." }
          ],
          correct: ["C"],
          explanation: "Splitting large reviews into focused per-file passes plus a separate cross-file integration pass directly addresses attention dilution, the actual root cause of inconsistent depth and contradictory findings. A shifts the burden to developers rather than fixing the review process. B would suppress real issues that are only caught intermittently rather than consistently. D misunderstands that a larger context window does not by itself fix attention quality."
        },
        {
          id: "P3-S5-Q8",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Atlas's CI review currently always runs the exact same five-step prompt chain (lint check, type check, security scan, style check, summary) for every PR, regardless of what the PR actually touches. For a PR that only changes a README file, this wastes time running irrelevant steps. For a PR introducing a new payment integration, the fixed steps miss novel architectural concerns the chain was never designed to probe. What should the team consider?",
          options: [
            { key: "A", text: "Keep the fixed five-step chain for all PRs, since consistency is more valuable than relevance." },
            { key: "B", text: "Remove the chain entirely and rely on a single unstructured review prompt for every PR." },
            { key: "C", text: "Add more fixed steps to the chain to cover every possible PR type in advance, so that no matter what a future PR touches, some predetermined step in the chain will already be positioned to catch it." },
            { key: "D", text: "Use fixed chaining for predictable, narrow-scope PRs and a more adaptive review plan for PRs whose scope or risk varies significantly, such as new architectural changes." }
          ],
          correct: ["D"],
          explanation: "Prompt chaining is well-suited to predictable, multi-aspect reviews, but PRs with unusual scope or architectural risk benefit from a decomposition that adapts to what the review actually discovers. A ignores the real mismatch demonstrated by both failure cases. B discards the proven value of structured review steps for the common, predictable case. C tries to anticipate every case upfront rather than adapting dynamically, which does not scale."
        },
        {
          id: "P3-S5-Q9",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Atlas's review prompt currently instructs Claude to \"be conservative and only report high-confidence findings,\" but false positive rates remain high across several finding categories, undermining developer trust even in categories that are usually accurate. What change is most likely to reduce false positives?",
          options: [
            { key: "A", text: "Replace the vague confidence-based instruction with explicit criteria defining which issues to report (bugs, security) versus skip (minor style, local idioms)." },
            { key: "B", text: "Lower the confidence threshold implied by \"conservative\" even further, to \"extremely conservative.\"" },
            { key: "C", text: "Keep the instruction as-is, since vague guidance like \"conservative\" is already the documented best practice." },
            { key: "D", text: "Add a numeric self-reported confidence score (1-10) to each finding and discard any finding scored below 7, since a model's own stated confidence should correlate closely with how accurate that finding actually is." }
          ],
          correct: ["A"],
          explanation: "Explicit, specific criteria for what to report versus skip directly define decision boundaries, whereas general instructions like \"be conservative\" or \"high-confidence\" do not reliably improve precision. B intensifies the same ineffective vague instruction. C mischaracterizes vague guidance as best practice when it is explicitly called out as ineffective. D relies on self-reported confidence scores, which are a known unreliable proxy for actual finding accuracy."
        },
        {
          id: "P3-S5-Q10",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Atlas wants consistent severity classification across its automated review findings (critical, major, minor), but reviewers notice the same underlying issue is sometimes labeled \"critical\" and sometimes \"minor\" across different PRs. What should the team add to the review prompt to fix this?",
          options: [
            { key: "A", text: "Remove severity labels entirely and let developers judge importance themselves." },
            { key: "B", text: "Define explicit severity criteria for each level with concrete code examples illustrating what belongs at each severity." },
            { key: "C", text: "Ask the model to double-check its own severity labels before finalizing output, since a self-review pass over its own classifications should catch and correct any labels that were initially inconsistent." },
            { key: "D", text: "Use a random severity assignment and let human review correct mistakes after the fact, since reviewers already read every finding anyway and relabeling a handful of severities costs little incremental review time per PR." },
          ],
          correct: ["B"],
          explanation: "Defining explicit severity criteria with concrete examples for each level is what achieves consistent classification across runs and PRs. A removes a useful signal rather than making it consistent. C relies on the same model re-evaluating its own ambiguous judgment without new information, which does not reliably fix inconsistency. D introduces noise instead of a fix."
        },
        {
          id: "P3-S5-Q11",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "Atlas wants to understand why its code-review agent's self-review pass almost never catches bugs that an entirely separate Claude session, given the same diff with no prior context, reliably catches. What principle explains this difference, and what architectural change follows from it?",
          options: [
            { key: "A", text: "The self-review pass needs extended thinking enabled to catch more issues." },
            { key: "B", text: "The self-review pass needs to be run twice in the same session for a second opinion." },
            { key: "C", text: "An independent review instance without the generator's reasoning context is more effective at catching subtle issues than self-review in the same session; Atlas should route review through a second, independent Claude instance." },
            { key: "D", text: "The self-review pass is actually working correctly; the separate session is simply non-deterministic and cannot be trusted." }
          ],
          correct: ["C"],
          explanation: "Independent review instances, without the reasoning context carried over from generation, are documented as more effective at catching subtle issues than self-review instructions or extended thinking within the same session. A and B keep the review within the same biased session rather than using an independent one. D dismisses a measurable and explainable difference in effectiveness."
        },
        {
          id: "P3-S5-Q12",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "Atlas wants to route review findings intelligently: straightforward, well-understood issues should be auto-posted, while findings the model itself is unsure about should go to a human for a second look before posting. What approach enables this kind of calibrated routing?",
          options: [
            { key: "A", text: "Post every finding automatically regardless of how uncertain the model appears to be about it." },
            { key: "B", text: "Have the model never express uncertainty, treating every finding as equally certain." },
            { key: "C", text: "Randomly sample 10% of findings for human review regardless of the finding's content." },
            { key: "D", text: "Run a verification pass where the model self-reports a confidence level alongside each finding, enabling findings below a calibrated threshold to be routed to human review." }
          ],
          correct: ["D"],
          explanation: "A verification pass where the model self-reports confidence alongside each finding enables calibrated routing, sending lower-confidence findings to human review while allowing high-confidence ones to post automatically. A ignores the stated goal of differentiated routing. B removes the very signal needed for routing decisions. C ignores the finding's actual uncertainty, which is a worse basis for routing than the model's own self-reported confidence pass."
        },
        {
          id: "P3-S5-Q13",
          domain: 4,
          task: "4.5",
          type: "multiple",
          select: 2,
          stem: "Atlas's engineering manager proposes moving two Claude-powered workflows to the Message Batches API to save cost: (1) a pre-merge check that blocks the merge button until it completes, and (2) a weekly technical-debt report generated Sunday night for Monday morning review. Which two statements about this proposal are correct? (Select TWO.)",
          options: [
            { key: "A", text: "The Message Batches API should also replace the pre-merge check, since batch jobs typically complete faster than synchronous calls." },
            { key: "B", text: "The Message Batches API offers roughly 50% cost savings compared to real-time calls, which is why it is attractive for latency-tolerant workloads like the weekly report." },
            { key: "C", text: "Adopting the Batches API for the pre-merge check is safe because its typical completion time is usually much shorter than real-time calls." },
            { key: "D", text: "The Message Batches API supports full multi-turn tool calling within a single batch request, executing tools mid-request." },
            { key: "E", text: "Batch request/response pairs can be correlated after the fact using custom_id fields." }
          ],
          correct: ["B", "E"],
          explanation: "The Message Batches API offers roughly 50% cost savings, making it well-suited to latency-tolerant workloads like the weekly report (B), and custom_id fields let batch requests and responses be correlated after submission (E). A and C both misstate the API's characteristics -- it has no guaranteed latency SLA and can take up to 24 hours, making it unsuitable for a blocking pre-merge check. D is false -- the Batches API does not support multi-turn tool calling within a single request."
        },
        {
          id: "P3-S5-Q14",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "Atlas's platform architect is documenting lessons learned from redesigning the large multi-file PR review. Which two statements accurately describe the attention-dilution problem and its fix? (Select TWO.)",
          options: [
            { key: "A", text: "Attention dilution is fixed by increasing the model's max_tokens setting for the single combined pass." },
            { key: "B", text: "A fixed-size context window inherently prevents any model from reviewing more than one file per request." },
            { key: "C", text: "Processing many files together in a single pass can cause inconsistent depth of analysis and contradictory findings across files." },
            { key: "D", text: "Splitting a large review into per-file local passes plus a separate cross-file integration pass addresses attention dilution directly." },
            { key: "E", text: "Attention dilution only affects style findings, never correctness or security findings." }
          ],
          correct: ["C", "D"],
          explanation: "Processing many files in one pass can genuinely degrade consistency and cause contradictions (C), and splitting the review into focused per-file passes plus a cross-file integration pass is the documented fix (D). A misattributes the fix to an output-length setting rather than review structure. B is false; models can and do review multiple files in one request, just with potential quality tradeoffs. E is an unsupported overgeneralization -- attention dilution is not limited to style findings."
        },
        {
          id: "P3-S5-Q15",
          domain: 4,
          task: "4.1",
          type: "multiple",
          select: 2,
          stem: "Atlas's security-finding category has an especially high false positive rate, and developers have started ignoring all security findings, including real ones. The team wants to restore trust while they improve the underlying prompt. Which two actions are appropriate immediate steps? (Select TWO.)",
          options: [
            { key: "A", text: "Temporarily disable the security-finding category in CI until its prompt can be improved with more explicit criteria." },
            { key: "B", text: "Permanently remove all severity labels from every finding category to avoid the appearance of false confidence." },
            { key: "C", text: "Tell developers to ignore all CI findings until further notice, across every category." },
            { key: "D", text: "Define explicit criteria for what qualifies as a reportable security issue, with concrete examples, rather than relying on a vague \"flag anything suspicious\" instruction." },
            { key: "E", text: "Keep posting the same high-false-positive security findings unchanged, reasoning that developers will eventually trust them again." }
          ],
          correct: ["A", "D"],
          explanation: "Temporarily disabling a high false-positive category restores developer trust while the prompt is improved (A), and replacing vague instructions with explicit, example-backed criteria is the documented way to reduce false positives for that category (D). B removes a different, unrelated signal rather than fixing the specific problem. C discards the value of all working categories, not just the problematic one. E does nothing to resolve the underlying trust problem and lets it persist or worsen."
        }
      ]
    },
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P3-S6-Q1",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexington Legal Technologies uses a tool_use-based extraction schema to pull line items and totals from vendor invoices attached to contracts. The strict JSON schema guarantees syntactically valid output every time, yet reviewers still find invoices where the extracted line items sum to $4,210.00 while the extracted \"total\" field says $4,310.00. What does this demonstrate?",
          options: [
            { key: "A", text: "Tool use with JSON schemas eliminates syntax errors but does not prevent semantic errors, such as values that are internally inconsistent." },
            { key: "B", text: "The schema is misconfigured and needs additional required fields to prevent this." },
            { key: "C", text: "This indicates tool_choice was set to \"auto\" instead of a forced tool, causing invalid output." },
            { key: "D", text: "JSON schema validation failures like this should never occur if tool_choice is set correctly." }
          ],
          correct: ["A"],
          explanation: "Strict schemas enforced via tool use guarantee syntactic validity but cannot catch semantic errors like line items failing to sum to the stated total -- that requires a separate validation step, such as comparing a calculated total to the stated total. B misdiagnoses a semantic issue as a structural schema gap. C and D incorrectly attribute a semantic consistency problem to tool_choice configuration, which governs whether and which tool is called, not value consistency."
        },
        {
          id: "P3-S6-Q2",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Lexington's contract-extraction schema includes a \"renewal_notice_period\" field. Many older contracts in the archive simply never specify a renewal notice period at all. When this field was configured as required, the model began fabricating plausible-sounding values (e.g., \"30 days\") for contracts where no such term exists. What schema change fixes this?",
          options: [
            { key: "A", text: "Add a few-shot example showing a fabricated 30-day default for missing terms." },
            { key: "B", text: "Make the field optional/nullable so the model can return null when the source document does not contain the information, rather than being forced to invent a value." },
            { key: "C", text: "Remove the field from the schema entirely, since not every contract includes it." },
            { key: "D", text: "Keep the field required, but add an instruction telling the model not to fabricate values." }
          ],
          correct: ["B"],
          explanation: "Designing fields as optional or nullable lets the model accurately represent absent information instead of fabricating a value to satisfy a required field -- this is the documented fix for hallucination caused by over-constrained required fields. A reinforces the exact fabrication behavior that is the problem. C discards a field that is genuinely useful for the many contracts that do specify it. D relies on a prompt instruction to override a structural incentive created by the schema itself, which is less reliable than removing the incentive."
        },
        {
          id: "P3-S6-Q3",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Forge Dynamics' purchase-order extraction system classifies each line item's unit-of-measure (each, kg, meter, liter) using an enum field. Occasionally a supplier's PO uses an unusual or ambiguous unit like \"spool\" or \"lot-of-12\" that does not map cleanly to any predefined enum value, and today the model is forced to guess the closest wrong category. What schema pattern addresses this?",
          options: [
            { key: "A", text: "Expand the enum to include every possible unit of measure any supplier might ever use." },
            { key: "B", text: "Remove the unit-of-measure field entirely, since it cannot be standardized." },
            { key: "C", text: "Add an \"other\" enum value paired with a free-text detail field to capture ambiguous or unrecognized units without forcing a false match." },
            { key: "D", text: "Force all POs with ambiguous units to fail extraction entirely and require full manual entry." }
          ],
          correct: ["C"],
          explanation: "The \"other\" + detail-string pattern is designed exactly for this situation -- it captures extensible, unanticipated categories without forcing an inaccurate match into a predefined enum value. A is impractical since new or unusual units will always eventually appear. B discards a genuinely useful field just because some edge cases are hard to classify. D unnecessarily forces full manual review for all ambiguous-unit POs when the \"other\" pattern already handles most of them."
        },
        {
          id: "P3-S6-Q4",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Lexington's document-ingestion pipeline connects to the firm's document management system through an MCP server exposing two tools: fetch_document_metadata and run_extraction_schema. Every ingestion must call fetch_document_metadata first so the correct schema can be selected, but some runs skip straight to run_extraction_schema and select the wrong schema. What tool_choice configuration enforces the required order?",
          options: [
            { key: "A", text: "Set tool_choice: \"auto\" for both tools so Claude decides for itself which one to call first." },
            { key: "B", text: "Set tool_choice: \"any\" for the whole turn, trusting that any tool call is equally acceptable." },
            { key: "C", text: "Add a system-prompt instruction telling Claude to always call fetch_document_metadata first." },
            { key: "D", text: "Force tool_choice: {\"type\": \"tool\", \"name\": \"fetch_document_metadata\"} on the first turn, then process the extraction schema selection in a follow-up turn." }
          ],
          correct: ["D"],
          explanation: "Forcing a specific named tool via tool_choice guarantees fetch_document_metadata is called first, then the model can proceed to the schema-specific extraction tool in a subsequent turn once metadata is known. A leaves the ordering decision probabilistic. B guarantees a tool is called but not which one, so ordering is still not enforced. C relies on prompt-based compliance alone, which has a non-zero failure rate for a sequencing requirement like this."
        },
        {
          id: "P3-S6-Q5",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Lexington's extraction prompt includes detailed prose instructions for handling citations, but results are inconsistent: some documents cite sources inline within paragraphs, others list a formal bibliography at the end, and the model frequently extracts citation data correctly from one style but not the other. What is the most effective improvement?",
          options: [
            { key: "A", text: "Add 2-4 few-shot examples showing correct extraction from documents using each citation style (inline vs bibliography), demonstrating the expected output for each format." },
            { key: "B", text: "Rewrite the prose instructions a third time with more emphatic language about citation handling." },
            { key: "C", text: "Instruct the model to ignore bibliography-style citations entirely and only extract inline citations." },
            { key: "D", text: "Switch to a model with a larger context window so citation sections are never truncated." }
          ],
          correct: ["A"],
          explanation: "Few-shot examples demonstrating correct handling of varied document structures -- such as inline citations versus bibliographies -- are the most effective way to achieve consistent extraction across structural variety, letting the model generalize to similarly varied cases. B repeats an already-ineffective prose-only approach. C discards legitimate citation data rather than handling it correctly. D does not address a structural-format inconsistency with a capacity fix."
        },
        {
          id: "P3-S6-Q6",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "An extraction run against a long-form lease agreement fails Pydantic validation because the \"lease_term_months\" field was returned as the string \"36 months\" instead of an integer. The pipeline needs an automated way to recover without human intervention for this kind of error. What should it do?",
          options: [
            { key: "A", text: "Discard the document entirely and flag it for full manual re-entry." },
            { key: "B", text: "Send a follow-up request that includes the original document, the failed extraction, and the specific validation error, asking the model to correct just that issue." },
            { key: "C", text: "Lower the strictness of the schema so string values are always accepted for this field." },
            { key: "D", text: "Retry the exact same extraction request unchanged, hoping for a different random result." }
          ],
          correct: ["B"],
          explanation: "Retry-with-error-feedback -- including the original document, the failed extraction, and the specific validation error -- gives the model exactly what it needs to self-correct a structural formatting error like a string where an integer is expected. A discards a document that a simple retry could likely fix. C weakens the schema in a way that could let other, real format errors pass through unnoticed. D repeats the identical request with no new information, which does not reliably fix a structural error without the feedback the model needs."
        },
        {
          id: "P3-S6-Q7",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "Lexington wraps its document management system's document-fetch endpoint as an MCP tool, fetch_document, used by the extraction pipeline. Today, every failure -- a document that does not exist, a connection timeout to the DMS, and a request for a document the requesting user lacks permission to view -- all return the same generic 'Fetch failed' message. The extraction agent currently retries every failure identically, including permission failures that will never succeed no matter how many times they are retried. What should the MCP tool implementation change?",
          options: [
            { key: "A", text: "Return structured error responses with errorCategory (e.g., \"transient\", \"permission\", \"not_found\") and an isRetryable boolean so the agent can decide when retrying is appropriate." },
            { key: "B", text: "Keep the generic message, but have the agent always retry exactly three times regardless of error type." },
            { key: "C", text: "Stop returning any error at all, and instead silently return an empty document body on any failure." },
            { key: "D", text: "Add a confidence score to each error so the agent can judge for itself whether to retry based on the score." }
          ],
          correct: ["A"],
          explanation: "Structured error metadata including errorCategory and an isRetryable boolean lets the agent distinguish retryable transient failures (timeouts) from non-retryable ones (permission errors), preventing wasted retries on failures that can never succeed. B keeps the uniform-response anti-pattern and wastes retries on permission failures. C silently masks real failures as if the request had succeeded. D substitutes an unreliable self-reported confidence signal for the deterministic categorical metadata the agent actually needs."
        },
        {
          id: "P3-S6-Q8",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Lexington's extraction pipeline currently passes the full 40-field raw OCR output for every invoice into every downstream validation and summarization step, even though only 8 of those fields are ever used after the initial extraction pass. As batch volume grows, this bloats context in later steps and slows multi-document summarization. What should change?",
          options: [
            { key: "A", text: "Increase the context window so the full 40-field payload fits comfortably at every step." },
            { key: "B", text: "Keep passing all 40 fields everywhere, since trimming risks losing information some future step might need." },
            { key: "C", text: "Summarize all 40 fields into a single vague paragraph before passing them downstream." },
            { key: "D", text: "Trim each tool's output to only the fields relevant to downstream steps (the 8 used fields) before they accumulate in context." }
          ],
          correct: ["D"],
          explanation: "Trimming verbose tool outputs to only the fields relevant downstream prevents token consumption that is disproportionate to the data's actual relevance, directly addressing the bloat. A treats a relevance problem as a capacity problem. B preserves the inefficiency indefinitely out of unfounded caution. C risks losing exactly the precise values, as with progressive summarization, that later steps may need."
        },
        {
          id: "P3-S6-Q9",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Lexington's whole extraction team shares a ContractVaultMCP server that connects to the firm's document management system, and it must be available to every engineer who clones the ingestion-pipeline repository, with its API token supplied via an environment variable rather than committed to source control. Separately, one engineer wants to experiment privately with an early-access OCR-correction MCP server that should not affect teammates. How should these be configured?",
          options: [
            { key: "A", text: "Configure ContractVaultMCP in the project's .mcp.json using environment variable expansion (e.g., ${CONTRACT_VAULT_TOKEN}) for the token, and configure the experimental OCR server in the engineer's personal ~/.claude.json." },
            { key: "B", text: "Configure both servers in the engineer's personal ~/.claude.json so each person can enable only what they need." },
            { key: "C", text: "Configure ContractVaultMCP's token directly in .mcp.json as a plaintext value, since the file is only readable by the team." },
            { key: "D", text: "Configure both servers in .mcp.json, and have the engineer delete the OCR server entry before every commit." }
          ],
          correct: ["A"],
          explanation: "Project-scoped .mcp.json with environment variable expansion is correct for shared team tooling without committing secrets to source control, while a personal, experimental server belongs in the user-scoped ~/.claude.json so it does not affect teammates. B puts a shared team dependency somewhere teammates would never receive it. C commits a secret token directly into version control, which environment variable expansion exists to avoid. D is fragile and risks accidental commits of experimental configuration."
        },
        {
          id: "P3-S6-Q10",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Lexington wants ongoing assurance that its \"high-confidence, auto-approved\" extractions (about 70% of volume) remain accurate over time, without manually re-reviewing all of them. What technique is most appropriate?",
          options: [
            { key: "A", text: "Trust the high-confidence designation permanently once it is established, with no further checks." },
            { key: "B", text: "Apply stratified random sampling of high-confidence extractions on an ongoing basis to measure error rates and detect novel error patterns." },
            { key: "C", text: "Review only the extractions flagged as low-confidence, since high-confidence ones are by definition accurate." },
            { key: "D", text: "Increase the confidence threshold required for auto-approval until review volume drops to zero." }
          ],
          correct: ["B"],
          explanation: "Stratified random sampling of high-confidence extractions provides ongoing measurement of actual error rates and can surface novel error patterns that confidence scores alone would miss. A assumes confidence scores are infallible over time, which is unverified. C ignores the real possibility of a high-confidence extraction later turning out wrong. D does not measure anything -- it just reduces volume without verifying accuracy."
        },
        {
          id: "P3-S6-Q11",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Lexington reports 97% overall extraction accuracy across its whole contract archive and considers automating away human review entirely. A deeper audit later reveals that accuracy on short-form vendor NDAs is 99%, but accuracy on multi-exhibit commercial leases is only 81%. What does this reveal about the original 97% figure, and what should the team do before automating further?",
          options: [
            { key: "A", text: "The 97% figure is fully reliable and automation should proceed as planned." },
            { key: "B", text: "The discrepancy is explained entirely by sample size differences and requires no further action." },
            { key: "C", text: "Aggregate accuracy figures can mask poor performance on specific document types; the team should analyze accuracy by document type and field before reducing human review." },
            { key: "D", text: "Since 97% exceeds a typical threshold, field-level analysis is unnecessary regardless of document type." }
          ],
          correct: ["C"],
          explanation: "An aggregate accuracy metric can conceal poor performance concentrated in specific document types or fields, so validating accuracy by document type and field segment before automating further is essential -- exactly what the deeper audit revealed here. A ignores the newly discovered discrepancy. B dismisses a real accuracy gap without justification. D treats a single aggregate number as sufficient despite clear evidence of segment-level variation."
        },
        {
          id: "P3-S6-Q12",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "While researching a vendor's payment history for a contract renewal, two credible internal reports give different figures for the vendor's average late-payment rate last year: one says 4.2%, the other says 6.8%, apparently measured over slightly different periods. How should the synthesis output handle this conflict?",
          options: [
            { key: "A", text: "Arbitrarily select the lower figure, since it reflects more favorably on the vendor relationship." },
            { key: "B", text: "Average the two figures into a single 5.5% value and present it without noting there were two sources." },
            { key: "C", text: "Omit both figures entirely to avoid presenting any disputed data." },
            { key: "D", text: "Preserve both values with source attribution and relevant context (such as differing measurement periods) rather than arbitrarily selecting or blending one." }
          ],
          correct: ["D"],
          explanation: "When credible sources conflict, the correct approach is to annotate the conflict with source attribution and relevant context rather than arbitrarily resolving it by selection, blending, or omission -- this preserves information the reader needs to judge the discrepancy themselves. A, B, and C all discard meaningful information about the disagreement between sources."
        },
        {
          id: "P3-S6-Q13",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "A new extraction schema for Forge Dynamics' invoice pipeline is under review. Which two design choices correctly follow documented best practices for reducing hallucination and handling ambiguous categories? (Select TWO.)",
          options: [
            { key: "A", text: "Mark every field as required so the model is forced to always extract a confident value." },
            { key: "B", text: "Make fields nullable/optional whenever the source documents may not always contain that information, rather than marking everything required." },
            { key: "C", text: "Use only free-text fields everywhere instead of enums, since enums are always too restrictive." },
            { key: "D", text: "Require tool_choice: \"auto\" for every extraction call to maximize model flexibility." },
            { key: "E", text: "Add an \"other\" enum value paired with a free-text detail field for categories that do not fit the predefined enum list." }
          ],
          correct: ["B", "E"],
          explanation: "Nullable optional fields prevent the model from fabricating values to satisfy fields the source document does not actually contain (B), and an \"other\" + detail pattern lets ambiguous or unanticipated categories be captured without forcing a false match (E). A creates the exact incentive to fabricate values that nullable fields are meant to prevent. C discards the real benefits enums provide for well-defined categories. D is unrelated to schema field design and, in fact, \"auto\" risks the model not calling the extraction tool at all."
        },
        {
          id: "P3-S6-Q14",
          domain: 4,
          task: "4.2",
          type: "multiple",
          select: 2,
          stem: "Lexington's extraction model struggles with two recurring ambiguous patterns: informal measurements in older contracts (e.g., \"roughly half the warehouse\") and documents that mix narrative prose with embedded structured tables in the same section. Which two interventions directly address these patterns? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct the model to reject any document containing informal measurement language." },
            { key: "B", text: "Add few-shot examples showing correct handling of informal or approximate measurement language, including how to represent uncertainty in the output." },
            { key: "C", text: "Remove all narrative sections from documents before extraction so only tables are processed." },
            { key: "D", text: "Add few-shot examples demonstrating correct extraction from documents that mix narrative prose with embedded tables in the same section." },
            { key: "E", text: "Increase max_tokens so the model can process longer documents without truncation." }
          ],
          correct: ["B", "D"],
          explanation: "Few-shot examples are the documented technique for demonstrating correct handling of ambiguous or inconsistently formatted source material -- both informal measurement language (B) and mixed narrative/table structures (D) are the kinds of varied patterns few-shot examples help the model generalize to. A discards legitimate documents rather than handling them. C discards narrative content that may contain information the structured extraction still needs. E addresses document length, not the structural or linguistic ambiguity described."
        },
        {
          id: "P3-S6-Q15",
          domain: 1,
          task: "1.3",
          type: "multiple",
          select: 2,
          stem: "Lexington's main extraction pipeline currently dumps the full, often 80-page, source contract directly into every downstream processing step, including a final summarization step that only needs the extracted clause data, not the raw document. The team wants to use a dedicated extraction subagent to improve this. Which two changes reflect correct subagent design principles? (Select TWO.)",
          options: [
            { key: "A", text: "Assume the extraction subagent automatically has access to the main pipeline's full conversation history and prior findings without needing to pass anything explicitly." },
            { key: "B", text: "Give the extraction subagent access to every tool available in the main pipeline, including unrelated billing and reporting tools, in case it needs them later." },
            { key: "C", text: "Have the extraction subagent always return its full internal reasoning transcript to downstream steps so nothing is lost." },
            { key: "D", text: "Spawn an extraction subagent via the Task tool, and have it return structured extracted data (clauses, dates, parties) rather than the full raw document text to downstream steps." },
            { key: "E", text: "Include the complete relevant content and extraction goals directly in the subagent's prompt, since subagents do not automatically inherit parent context." }
          ],
          correct: ["D", "E"],
          explanation: "Spawning an isolated subagent via the Task tool and having it return structured extracted data rather than the raw document reduces what downstream steps must process (D), and because subagents do not automatically inherit the parent's context, the relevant content and goals must be explicitly included in the subagent's prompt (E). A is false -- context is never automatically inherited between agents. B violates scoped tool access by provisioning unrelated tools. C defeats the purpose of returning condensed structured data by passing along verbose reasoning instead."
        }
      ]
    }
  ]
});
