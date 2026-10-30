window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 7,
  title: "Mock Exam 7",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P7-S1-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Your Alpine Peaks Hotels support agent handles a billing dispute. Trace logs show: turn 1, Claude responds with the text \"Let me pull up your reservation first.\" and in the same turn also issues a tool_use call to lookup_order; stop_reason is \"tool_use\". Your orchestration code terminates the loop at this turn because it detects non-empty assistant text content, so the tool call is never executed and the guest receives only the acknowledgement sentence. What is the root cause of this failure?",
          options: [
            { key: "A", text: "The agent's system prompt does not instruct it to call lookup_order before responding." },
            { key: "B", text: "The loop's termination logic checks for assistant text content instead of checking stop_reason, so it exits before the requested tool call runs." },
            { key: "C", text: "The arbitrary iteration cap configured in the loop is set too low for this conversation, even though the trace log shows only a single turn executed before the loop stopped, nowhere near a plausible cap." },
            { key: "D", text: "The lookup_order tool's description overlaps with get_customer's, so the model can't reliably judge which backend lookup applies to a booking-number query like this one." }
          ],
          correct: ["B"],
          explanation: "The agentic loop should continue executing tool calls whenever stop_reason is \"tool_use\", regardless of whether the response also contains accompanying text. Checking for text content as a stopping signal is an anti-pattern because Claude routinely narrates before or alongside a tool call. A is wrong because the model did call the tool. C is wrong because no iteration limit was reached. D is wrong because tool selection succeeded; the pending call was simply never executed."
        },
        {
          id: "P7-S1-Q2",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "A separate defect report shows the opposite failure: a refund investigation loops through 40+ tool_use/tool_result pairs without ever stopping, repeatedly re-calling lookup_order and get_customer with near-identical arguments. Your current safeguard is a hard cap of 50 iterations that aborts the conversation with a generic error. What change would most directly fix the underlying problem rather than just masking it?",
          options: [
            { key: "A", text: "Lower the iteration cap to 15 so runaway loops are caught sooner." },
            { key: "B", text: "Add a confidence self-score field the model must emit each turn so the loop can exit once the score is above 0.9, since a numeric self-assessment would give the loop a clean, easily-thresholded signal instead of relying on parsing free-form text." },
            { key: "C", text: "Parse the assistant's natural-language explanation each turn for phrases like \"I have the information I need\" and stop when detected, since customers' completion language tends to follow fairly predictable, recognizable patterns across most conversations." },
            { key: "D", text: "Verify that the loop only continues when stop_reason is \"tool_use\" and exits cleanly on \"end_turn\", then investigate why the model isn't reaching end_turn (for example, tool results not being appended to context correctly)." }
          ],
          correct: ["D"],
          explanation: "Runaway loops are usually a symptom of incorrect control flow around stop_reason, or of tool results not being appended to context so the model never realizes it already has the answer. Fixing the actual lifecycle check addresses the cause. A only reduces blast radius without fixing the defect. B and C substitute unreliable self-reported or natural-language signals for the deterministic stop_reason check, an explicit anti-pattern."
        },
        {
          id: "P7-S1-Q3",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "A guest messages: \"My room charge is $40 higher than quoted, and separately, housekeeping never restocked the minibar for three nights — can you fix the billing and send someone up?\" The agent currently investigates and resolves only the billing discrepancy, then closes the conversation without addressing the minibar complaint, because it treated the message as a single request. What is the most effective fix?",
          options: [
            { key: "A", text: "Decompose the message into its distinct concerns (billing error, service failure) up front, investigate each using shared context, then synthesize one combined resolution." },
            { key: "B", text: "Instruct the agent to always ask the guest which issue to resolve first." },
            { key: "C", text: "Add a tool_choice: \"any\" constraint so the agent is forced to call a tool on every turn." },
            { key: "D", text: "Increase the context window available to the agent so it can hold both issues in memory simultaneously, since a larger window is generally assumed to help an agent track multiple concerns at once." }
          ],
          correct: ["A"],
          explanation: "Multi-concern requests should be split into distinct items, each investigated using shared context, then merged into one coherent reply. B adds unnecessary friction and risks the guest feeling unheard. C only forces tool invocation and doesn't address decomposition. D is not a fix: the problem is workflow logic, not context capacity."
        },
        {
          id: "P7-S1-Q4",
          domain: 1,
          task: "1.4",
          type: "multiple",
          select: 3,
          stem: "A guest's case is escalated mid-investigation to a human agent who has no access to the conversation transcript. Which THREE elements should the structured handoff summary always include so the human agent can act immediately? (Select THREE.)",
          options: [
            { key: "A", text: "The customer's identifier/account ID already verified via get_customer" },
            { key: "B", text: "The full raw chat transcript, unedited, for the human to re-read in full" },
            { key: "C", text: "A root cause analysis of what the investigation found so far" },
            { key: "D", text: "The agent's internal chain-of-thought reasoning trace" },
            { key: "E", text: "A recommended next action for the human agent to take" }
          ],
          correct: ["A", "C", "E"],
          explanation: "Structured handoffs should give a human agent who lacks transcript access everything needed to act immediately: a verified customer identifier, root cause findings, and a recommended action — not a raw, unfiltered chat log or an internal reasoning trace, which are verbose and not what the escalation protocol requires. B and D add noise without the structured facts a human needs to move quickly."
        },
        {
          id: "P7-S1-Q5",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Policy requires that process_refund calls above $500 be routed to a human for approval. Your system prompt states this rule clearly, but audit logs show 3% of large refunds were still auto-approved by the agent over the last month. What is the most reliable fix?",
          options: [
            { key: "A", text: "Rephrase the policy sentence in the system prompt using stronger, more emphatic language, since more forceful wording has anecdotally reduced violation rates in similar prompt-engineering situations." },
            { key: "B", text: "Add a few-shot example showing the agent declining to auto-approve a $600 refund, since demonstrating the correct behavior once should generalize to every future refund above the threshold." },
            { key: "C", text: "Implement a tool-call interception hook that inspects process_refund arguments before execution and blocks/redirects any call above $500 to escalate_to_human." },
            { key: "D", text: "Lower the model's temperature to make its behavior more deterministic, since more deterministic sampling should reduce variance in behavior across repeated, similar refund requests over time." }
          ],
          correct: ["C"],
          explanation: "Business rules with zero tolerance for failure need programmatic enforcement — a hook that inspects outgoing tool calls guarantees compliance regardless of prompt phrasing. A and B are prompt-based approaches with a non-zero failure rate, which is exactly what's being observed. D is out of scope and does not guarantee rule compliance."
        },
        {
          id: "P7-S1-Q6",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A guest calls back two days after an agent used --resume to continue their named session. In the interim, a backend batch job corrected their stored loyalty tier, but the resumed session still references the old tier because it's relying on the tool result cached from the first call. What is the best way to handle this?",
          options: [
            { key: "A", text: "Always start a brand-new session for every returning call to avoid any stale data." },
            { key: "B", text: "Inform the resumed session explicitly that the loyalty tier has changed and prompt it to re-call get_customer rather than trusting the cached result." },
            { key: "C", text: "Increase the TTL on cached tool results so they refresh automatically." },
            { key: "D", text: "Disable --resume entirely for this agent and rely only on full transcripts pasted into a new session." }
          ],
          correct: ["B"],
          explanation: "When resuming a session after an underlying fact has changed, the agent should be told about the specific change so it can re-fetch accurate data. A throws away valid context for the rest of the conversation unnecessarily. C does not exist as an Agent SDK mechanism. D is an overreaction that loses the benefit of resumption."
        },
        {
          id: "P7-S1-Q7",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Logs show the agent calls get_customer in 20% of cases where a guest asks \"what's the status of booking #88421?\" — a request that should route to lookup_order. Both tools currently have one-line descriptions: get_customer: \"Retrieves guest account information.\" lookup_order: \"Retrieves booking details.\" What is the most effective first step?",
          options: [
            { key: "A", text: "Merge both tools into a single lookup_entity tool that infers which backend to query." },
            { key: "B", text: "Add 5-8 few-shot examples to the system prompt showing booking-number queries routed to lookup_order." },
            { key: "C", text: "Build a keyword pre-router that intercepts the guest's message before Claude sees it." },
            { key: "D", text: "Expand each tool's description with its expected input formats, example queries, and explicit boundaries versus the other tool." }
          ],
          correct: ["D"],
          explanation: "Minimal tool descriptions are the most common root cause of misrouting between similar tools; expanding descriptions with input formats, examples, and explicit boundaries is the lowest-effort, highest-leverage fix. B adds token overhead without resolving the underlying ambiguity. C bypasses the model's own reasoning with brittle keyword matching. A is a bigger architectural change than warranted as a first step."
        },
        {
          id: "P7-S1-Q8",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "When process_refund fails, every failure currently returns the same payload: { \"isError\": true, \"content\": \"Operation failed\" }. The agent responds inconsistently — sometimes retrying a call that will never succeed (an invalid refund amount), sometimes giving up on a transient gateway timeout that would have succeeded on retry. What should the MCP tool return instead?",
          options: [
            { key: "A", text: "Structured error metadata including an errorCategory (transient/validation/permission), an isRetryable boolean, and a human-readable description." },
            { key: "B", text: "The same generic message, but logged server-side with a stack trace for engineers to review later." },
            { key: "C", text: "A numeric HTTP-style status code only, leaving interpretation to the agent's judgment, since numeric codes are a well-established pattern in traditional REST APIs even without explicit category or retry semantics." },
            { key: "D", text: "A fallback that silently returns a successful empty response so the conversation isn't interrupted, since preserving an uninterrupted flow is usually considered more important than surfacing backend failures." }
          ],
          correct: ["A"],
          explanation: "Structured error metadata lets the agent distinguish retryable transient failures from validation errors it should not retry, enabling appropriate recovery decisions. B doesn't change what the agent itself receives. C still leaves the agent guessing at meaning. D is a dangerous anti-pattern that hides real failures as false successes."
        },
        {
          id: "P7-S1-Q9",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "Your single customer-support agent currently has access to 16 tools, including several unrelated marketing and loyalty-program analytics tools bundled in from a shared internal tool catalog. Selection accuracy among the four core support tools (get_customer, lookup_order, process_refund, escalate_to_human) has degraded. Which TWO changes would most directly improve tool selection reliability? (Select TWO.)",
          options: [
            { key: "A", text: "Add a dedicated routing classifier model that pre-selects a tool before Claude is invoked." },
            { key: "B", text: "Remove the unrelated marketing/analytics tools from this agent's available tool set, keeping only the tools relevant to its support role." },
            { key: "C", text: "Rewrite the system prompt to mention each tool's name once more for emphasis." },
            { key: "D", text: "Expand the descriptions of the four core tools so each clearly states its purpose and boundaries relative to the others." },
            { key: "E", text: "Increase the maximum number of tokens the agent is allowed to generate per turn." }
          ],
          correct: ["B", "D"],
          explanation: "Reducing tool count to only what the role needs, combined with clear, differentiated descriptions, directly targets the two documented causes of selection degradation: too many tools and ambiguous descriptions. A is over-engineered infrastructure. C does not resolve ambiguity. E is unrelated to tool selection."
        },
        {
          id: "P7-S1-Q10",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "A developer adds a new internal booking-sync MCP server to ~/.claude.json on their own laptop to experiment with it, expecting the whole support team to pick it up automatically after their next pull. Two weeks later, teammates report the server isn't available to them. What is the most likely explanation?",
          options: [
            { key: "A", text: "The server's tools were never discovered because tools from multiple MCP servers aren't available simultaneously." },
            { key: "B", text: "The .mcp.json environment variable expansion syntax was written incorrectly." },
            { key: "C", text: "~/.claude.json is a user-level, personal configuration file that isn't shared via version control, unlike project-scoped .mcp.json." },
            { key: "D", text: "The server needs to be restarted manually by every teammate before its tools appear." }
          ],
          correct: ["C"],
          explanation: "~/.claude.json is scoped to the individual user and never propagates to teammates; shared team tooling belongs in the project-level .mcp.json file, which is checked into version control. A is false — tools from all configured servers are available simultaneously once connected. B and D are unrelated speculative causes not supported by the scenario."
        },
        {
          id: "P7-S1-Q11",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "Which TWO statements about tool_choice configuration are accurate? (Select TWO.)",
          options: [
            { key: "A", text: "tool_choice: \"any\" guarantees the model will call some tool but leaves the choice of which tool to Claude." },
            { key: "B", text: "tool_choice: \"auto\" guarantees a tool is called on every turn." },
            { key: "C", text: "Forced tool selection, e.g. { \"type\": \"tool\", \"name\": \"extract_metadata\" }, guarantees that specific named tool is called." },
            { key: "D", text: "tool_choice has no effect on whether Claude returns conversational text instead of a tool call." },
            { key: "E", text: "tool_choice: \"any\" and forced tool selection are functionally identical." }
          ],
          correct: ["A", "C"],
          explanation: "\"any\" forces a tool call but lets the model choose which tool, while a forced selection pins a specific named tool. \"auto\" is the default and may still return plain text instead of a tool call, so B is false. D is false because tool_choice directly controls this behavior. E conflates two distinct modes."
        },
        {
          id: "P7-S1-Q12",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A refund case spans 18 conversational turns. Midway through, the agent progressively summarizes earlier turns to save context, and by turn 15 it tells the guest their refund is \"approximately $200-ish\" instead of the exact $214.37 that was confirmed earlier. What is the best fix?",
          options: [
            { key: "A", text: "Disable summarization entirely so the full transcript is always sent in every request, since always transmitting the complete transcript guarantees no numerical detail is ever lost to lossy compression." },
            { key: "B", text: "Round all dollar amounts to the nearest ten so inconsistency is less noticeable." },
            { key: "C", text: "Ask the guest to repeat the exact amount whenever it's needed." },
            { key: "D", text: "Extract transactional facts (amounts, order IDs, dates) into a persistent \"case facts\" block that is included in every prompt outside the summarized history." }
          ],
          correct: ["D"],
          explanation: "A dedicated case-facts block preserves precise figures that must never be lossy-summarized, while still allowing the rest of the conversation to be condensed. A defeats the purpose of summarization and doesn't scale. B deliberately degrades accuracy. C is poor customer experience and unreliable."
        },
        {
          id: "P7-S1-Q13",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "get_customer returns two matching accounts for the same phone number — one belongs to a corporate travel account, the other to a personal account with a pending refund. The agent currently picks whichever record appears first in the returned list and proceeds. What should it do instead?",
          options: [
            { key: "A", text: "Default to the personal account, since most support requests are personal in nature." },
            { key: "B", text: "Ask the guest for an additional identifier (for example, a confirmation number or email) to disambiguate before proceeding." },
            { key: "C", text: "Attempt the refund against both accounts and let the guest confirm which charge it affected." },
            { key: "D", text: "Escalate immediately to a human without attempting any clarification." }
          ],
          correct: ["B"],
          explanation: "When a tool result returns multiple matches, the correct pattern is to request an additional identifier rather than guessing heuristically, which risks acting on the wrong account. A and C both act on an unverified guess, risking a misapplied refund. D is premature — clarification is a simple step the agent can handle itself."
        },
        {
          id: "P7-S1-Q14",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "Management proposes detecting guest frustration via sentiment analysis on each message and auto-escalating once negative sentiment crosses a threshold, hoping this will fix the current 55% first-contact resolution rate against an 80% target. Why is this unlikely to fix the underlying problem?",
          options: [
            { key: "A", text: "Sentiment doesn't reliably correlate with actual case complexity — calm guests can have complex policy-exception cases, and frustrated guests can have simple ones the agent should resolve directly." },
            { key: "B", text: "Sentiment analysis requires a larger context window than the agent currently has." },
            { key: "C", text: "Sentiment analysis cannot be implemented without fine-tuning a custom model, and building, labeling, and training such a model would require far more engineering investment than the team has budgeted." },
            { key: "D", text: "Sentiment analysis would conflict with the escalate_to_human tool's input schema, since that schema has no dedicated field for a sentiment score, requiring a breaking change to every existing integration." }
          ],
          correct: ["A"],
          explanation: "Sentiment-based escalation is an unreliable proxy for complexity, which is the real driver of resolution calibration. B, C, and D are fabricated technical constraints not grounded in how the system actually works."
        },
        {
          id: "P7-S1-Q15",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "When lookup_order returns zero matching bookings for a guest-provided reference number, the current code path treats this the same as a tool execution failure and automatically retries the call three times before giving up. What is the issue with this behavior?",
          options: [
            { key: "A", text: "Retrying three times is too few; it should retry at least ten times." },
            { key: "B", text: "The tool should be replaced with one that never returns zero results, since a lookup system that always finds something would eliminate this entire category of ambiguous retry-versus-accept decisions for the agent to make." },
            { key: "C", text: "A successful query that legitimately found no matching booking is a valid empty result, not an access failure, and should not trigger retries — the agent should ask the guest to double-check the reference number instead." },
            { key: "D", text: "The retries should happen silently without informing the guest of any delay." }
          ],
          correct: ["C"],
          explanation: "Valid empty results (a successful query that found nothing) must be distinguished from access failures like timeouts; retrying a search that correctly found nothing wastes time and doesn't change the outcome. A just scales up the same mistake. B is unrealistic. D ignores the real fix, which is recognizing the result type correctly."
        }
      ]
    },
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P7-S2-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Cascade Robotics' lead engineer added company-wide testing conventions by running Claude Code locally and saving instructions into her personal ~/.claude.json file, then told the team \"just pull the repo, the conventions are in place.\" A new hire joins, clones the repo, and Claude Code generates tests that ignore the team's fixture conventions entirely. What is the most likely root cause?",
          options: [
            { key: "A", text: "The new hire needs to run /memory to manually reload the configuration, since /memory is designed to refresh whichever configuration sources are currently loaded into context for the active session on their machine." },
            { key: "B", text: "The conventions were saved to a user-level, personal configuration file instead of a project-level CLAUDE.md, so they were never committed to version control and aren't available to the new hire." },
            { key: "C", text: "CLAUDE.md files require a restart of Claude Code before new team members can see them." },
            { key: "D", text: "The conventions must be duplicated into a .claude/commands/ file to take effect project-wide, since slash commands are the only configuration mechanism Claude Code shares automatically across a cloned repository." }
          ],
          correct: ["B"],
          explanation: "Project-wide conventions must live in a project-level CLAUDE.md (or .claude/rules/) that is checked into version control; anything saved to a personal, user-level file never reaches teammates. A, C, and D describe mechanisms that don't fix the actual scoping mistake."
        },
        {
          id: "P7-S2-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "An engineer reports that Claude Code behaves inconsistently between two machines on the same project, applying different conventions on each. Running /memory on both machines shows machine A loads the project CLAUDE.md plus a personal rule in ~/.claude.json, while machine B loads only the project CLAUDE.md. What is the most likely explanation for the inconsistency?",
          options: [
            { key: "A", text: "The project-level CLAUDE.md file differs between the two checkouts due to an uncommitted local edit, meaning the two machines are silently running different effective instructions despite both appearing to load the same named file from source control." },
            { key: "B", text: "Machine B's Claude Code installation is an outdated version that ignores CLAUDE.md entirely." },
            { key: "C", text: ".claude/rules/ path-specific rules require a project restart to synchronize across machines, which would mean the discrepancy should disappear immediately after both engineers fully quit and relaunch their Claude Code sessions on each affected machine." },
            { key: "D", text: "Machine A has a personal, user-level override in ~/.claude.json layered on top of the shared project CLAUDE.md, while machine B does not have that personal file, so the two machines aren't operating on identical effective configuration." }
          ],
          correct: ["D"],
          explanation: "/memory reveals exactly which configuration sources are loaded; here it shows machine A has an extra personal, user-level layer that machine B lacks, explaining the behavioral difference. The project CLAUDE.md itself is the same on both machines per the /memory output, ruling out A. B and C invent mechanisms (silent version-based ignoring, restart-based sync) that don't reflect how Claude Code configuration layering actually works."
        },
        {
          id: "P7-S2-Q3",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "A /refactor-analysis skill was added to .claude/skills/ to run a verbose exploratory analysis of candidate refactors across the codebase. Developers complain that invoking it floods the main conversation with hundreds of lines of exploratory reasoning, after which they have to scroll past it to continue their actual task. What change to the skill's SKILL.md would fix this?",
          options: [
            { key: "A", text: "Add an argument-hint so developers know what parameters to pass." },
            { key: "B", text: "Reduce the skill's allowed-tools to only Read, preventing it from writing files." },
            { key: "C", text: "Set context: fork in the frontmatter so the skill runs in an isolated sub-agent context and returns only a summary to the main session." },
            { key: "D", text: "Rename the skill file to SKILL.MD in uppercase so Claude Code treats it as isolated." }
          ],
          correct: ["C"],
          explanation: "context: fork is the documented mechanism for isolating a skill's verbose execution from the main conversation, preventing it from polluting shared context. A and B are reasonable configuration choices but don't address context pollution. D is not a real mechanism — file name casing has no isolation effect."
        },
        {
          id: "P7-S2-Q4",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "A developer creates a /deploy-check slash command intended for the whole team and saves it in ~/.claude/commands/deploy-check.md on their own machine. After the next sprint, no other teammate sees the command appear. What's the fix?",
          options: [
            { key: "A", text: "Move the command file into the project's .claude/commands/ directory so it's version-controlled and shared with everyone who clones the repo." },
            { key: "B", text: "Rename the file to start with a dot so Claude Code recognizes it as shared." },
            { key: "C", text: "Add the command's contents to the project CLAUDE.md under a \"Commands\" heading instead." },
            { key: "D", text: "Ask each teammate to manually copy the file into their own ~/.claude/commands/ directory." }
          ],
          correct: ["A"],
          explanation: "Project-scoped commands belong in .claude/commands/ within the repository so version control distributes them automatically. B is not a real mechanism. C conflates commands with context instructions — CLAUDE.md doesn't define invocable slash commands. D defeats the purpose of having shared, version-controlled tooling."
        },
        {
          id: "P7-S2-Q5",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Cascade Robotics wants a consistent convention applied to every test file, regardless of which directory it lives in (Button.test.tsx sits next to Button.tsx, auth.test.ts sits in a separate __tests__ folder). An engineer creates .claude/rules/testing.md with frontmatter paths: [\"tests/**/*\"], but the rule never activates when editing Button.test.tsx. What is the root cause?",
          options: [
            { key: "A", text: ".claude/rules/ files only apply to files that are also referenced in CLAUDE.md." },
            { key: "B", text: "Rule files require an allowed-tools frontmatter field to activate at all." },
            { key: "C", text: "Only one rules file can be active per session, and another conflicting rule somewhere else in the project is silently taking precedence, which would explain why this particular glob appears overridden even though its frontmatter syntax looks correct on close inspection." },
            { key: "D", text: "The glob pattern \"tests/**/*\" only matches files under a literal tests/ directory, but the actual test files are scattered throughout the codebase; a pattern like \"**/*.test.*\" would match them regardless of location." }
          ],
          correct: ["D"],
          explanation: "Path-specific rules only load when a file matches the configured glob; a directory-anchored pattern won't match files that live elsewhere. A type-based glob like **/*.test.* matches by filename pattern anywhere in the tree, which is the whole advantage of path-specific rules over directory-bound CLAUDE.md files. A, B, and C describe mechanisms that don't exist."
        },
        {
          id: "P7-S2-Q6",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Database-model files follow a repository pattern and live exclusively under src/models/, while React components and their conventions are scattered across many feature folders. For the database models specifically (never found elsewhere in the repo), which approach is simplest and equally maintainable?",
          options: [
            { key: "A", text: "A .claude/rules/ file with paths: [\"**/*\"] so it always applies everywhere." },
            { key: "B", text: "A skill in .claude/skills/ that must be manually invoked before editing any model file, since an explicit invocation step would make developers consciously aware the conventions are about to apply." },
            { key: "C", text: "Renaming every model file to share a common suffix so a glob can match them, even though they're already consolidated under one directory." },
            { key: "D", text: "A CLAUDE.md file placed directly in src/models/, since those conventions never apply outside that single directory." }
          ],
          correct: ["D"],
          explanation: "When conventions are confined to files that already live in one directory, a subdirectory CLAUDE.md is simple and sufficient; path-specific rules add value specifically when matching files are scattered across many directories, which isn't the case here. A is overly broad. B requires manual invocation, contradicting automatic application. C is unnecessary churn."
        },
        {
          id: "P7-S2-Q7",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "Cascade Robotics is migrating its monolithic robot-fleet dashboard into three microservices, affecting roughly 60 files and requiring decisions about where service boundaries and shared state live. Which approach should the lead take?",
          options: [
            { key: "A", text: "Enter plan mode to explore the codebase and dependencies and design the service boundaries before any changes are made." },
            { key: "B", text: "Start direct execution immediately, letting the natural boundaries emerge as files are split." },
            { key: "C", text: "Write exhaustive upfront instructions specifying the exact structure, then use direct execution." },
            { key: "D", text: "Use direct execution and only consider plan mode if the migration turns out to be harder than expected." }
          ],
          correct: ["A"],
          explanation: "Architectural decisions with multiple valid approaches and large-scale, multi-file impact are exactly what plan mode is designed for — it prevents costly rework by validating the design before committing changes. B risks late discovery of bad boundaries. C assumes the right structure is already known without exploration. D ignores that the complexity is already evident upfront."
        },
        {
          id: "P7-S2-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "During the microservices migration, the lead wants to understand how the fleet-telemetry module's internal dependencies work before the formal plan-mode design session, without burning through the main conversation's context on dozens of file reads and greps. What should they use?",
          options: [
            { key: "A", text: "Ask Claude to summarize the entire codebase from memory without reading any files." },
            { key: "B", text: "Run the investigation in direct execution mode so results show up immediately, letting the lead start the formal plan-mode session sooner without waiting for a subagent to finish and report back." },
            { key: "C", text: "Delegate the discovery phase to an Explore subagent, which isolates the verbose exploration output and returns a summary to the main conversation." },
            { key: "D", text: "Increase the context window configuration before starting the investigation." }
          ],
          correct: ["C"],
          explanation: "The Explore subagent exists specifically to isolate verbose discovery output during multi-phase tasks, preserving the main conversation's context budget. A would be unreliable and ungrounded. B doesn't address the context-consumption problem. D is not a real lever in this context."
        },
        {
          id: "P7-S2-Q9",
          domain: 3,
          task: "3.5",
          type: "multiple",
          select: 2,
          stem: "Engineers ask Claude Code to \"normalize all telemetry field names to snake_case\" across a legacy service. Results are inconsistent: some fields are renamed correctly, others are skipped, and a few get renamed to camelCase by mistake. Which TWO changes would most reliably fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Rewrite the instruction in more emphatic language, e.g., \"ALWAYS use snake_case, no exceptions.\"" },
            { key: "B", text: "Provide 2-3 concrete input/output examples showing exact field names before and after the transformation." },
            { key: "C", text: "Ask the model to self-report a confidence score after each file and manually review low-confidence ones." },
            { key: "D", text: "Write a small test suite asserting the expected renamed output, then iterate by sharing the specific test failures with Claude." },
            { key: "E", text: "Instruct Claude to think for longer before responding." }
          ],
          correct: ["B", "D"],
          explanation: "Concrete examples and test-driven iteration with real failure feedback are the documented techniques for resolving inconsistent transformation output when prose instructions alone are ambiguous. A only intensifies the same ambiguous prose. C adds overhead without correcting the underlying inconsistency. E is not a controllable, reliable lever."
        },
        {
          id: "P7-S2-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "A bug report says \"the CSV importer sometimes crashes.\" Claude Code's first fix attempt doesn't resolve it because the actual failure mode is specific (null values in a particular optional column) and wasn't captured in the vague description. What's the most effective next step?",
          options: [
            { key: "A", text: "Rewrite the entire importer from scratch in a different language, since a full rewrite would eliminate any legacy code paths that might be silently responsible for mishandling this particular null-value case." },
            { key: "B", text: "Ask Claude to add more defensive try/catch blocks throughout the importer, since broad exception handling would at least stop the crash even without identifying the specific null-value case." },
            { key: "C", text: "Increase the number of retries the importer performs on failure." },
            { key: "D", text: "Provide a specific failing test case with the exact input row (including the null value) and the expected output, so Claude can target the real failure mode." }
          ],
          correct: ["D"],
          explanation: "A concrete test case with the exact problematic input and expected output is the most effective way to communicate a precise failure mode, especially for edge cases like null handling. A, B, and C are generic changes that don't target the actual root cause."
        },
        {
          id: "P7-S2-Q11",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Cascade Robotics' nightly CI pipeline calls Claude Code to review each pull request. Last week, three PRs caused the pipeline to hang for the full timeout window and then fail, with no review ever posted. Investigation shows Claude Code was invoked without any special flags, in the pipeline's default interactive-capable mode. What is the most likely root cause?",
          options: [
            { key: "A", text: "The pipeline's runner ran out of memory during the review." },
            { key: "B", text: "--output-format json was missing, so the output couldn't be parsed." },
            { key: "C", text: "The -p (--print) flag was omitted, so Claude Code could attempt to wait for interactive input instead of running non-interactively to completion." },
            { key: "D", text: "The CLAUDE.md file was too large for the CI environment to load, since CI runners typically enforce stricter memory and file-size limits than a local development machine." }
          ],
          correct: ["C"],
          explanation: "The -p/--print flag is required to run Claude Code non-interactively in automated pipelines; without it, the process can behave in ways unsuited to CI and hang rather than completing. B would cause a parsing failure, not a hang. A and D are unsupported guesses not indicated by the symptoms."
        },
        {
          id: "P7-S2-Q12",
          domain: 3,
          task: "3.6",
          type: "multiple",
          select: 2,
          stem: "The team wants Claude Code's PR review findings posted automatically as inline comments by a parsing script. Early attempts fail because the script can't reliably parse free-form review text. Which TWO flags/practices should be used together to fix this? (Select TWO.)",
          options: [
            { key: "A", text: "--output-format json to produce machine-parseable output." },
            { key: "B", text: "A larger CLAUDE.md file with more verbose formatting instructions." },
            { key: "C", text: "--json-schema to constrain the output to a specific structure the parsing script expects." },
            { key: "D", text: "Running the review twice and concatenating both outputs." },
            { key: "E", text: "Asking Claude to wrap its findings in markdown code fences." }
          ],
          correct: ["A", "C"],
          explanation: "--output-format json combined with --json-schema is the documented approach for producing structured, schema-constrained, machine-parseable CI output. B does not guarantee structure. D adds noise and cost without solving parsing. E is a fragile convention compared to an enforced schema."
        },
        {
          id: "P7-S2-Q13",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "Two engineers want to compare a monolith-first incremental refactor against a strangler-fig microservice extraction, both starting from the same codebase analysis already completed in one Claude Code session. What is the most efficient way to explore both approaches?",
          options: [
            { key: "A", text: "Use fork_session to create two independent branches from the shared analysis baseline, one per approach." },
            { key: "B", text: "Re-run the full codebase analysis twice from scratch, once per approach." },
            { key: "C", text: "Use --resume on the same session twice in parallel terminal windows." },
            { key: "D", text: "Paste the analysis summary manually into two brand-new sessions." }
          ],
          correct: ["A"],
          explanation: "fork_session is designed exactly for exploring divergent approaches from a shared analysis baseline without redoing the expensive discovery work. B wastes the already-completed analysis. C risks conflicting, overlapping conversation state in the same session. D works but is more error-prone and manual than the built-in fork mechanism."
        },
        {
          id: "P7-S2-Q14",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An engineer resumes a named session two weeks after a large refactor shipped that deleted several files the session had previously analyzed in depth. The resumed session confidently references functions in those now-deleted files as if they still existed. What is the best approach here?",
          options: [
            { key: "A", text: "Continue resuming as normal; Claude Code will automatically detect deleted files." },
            { key: "B", text: "Always discard --resume and start over with full re-exploration for every session older than a day, since re-exploring from scratch every single time guarantees the agent never relies on any outdated file references whatsoever regardless of cost." },
            { key: "C", text: "Manually delete the session history file so stale references are purged." },
            { key: "D", text: "Inform the resumed session specifically about which files changed so it can re-analyze just those, or start a new session with a structured summary of what's still valid instead of relying on stale tool results." }
          ],
          correct: ["D"],
          explanation: "Both techniques are valid: targeted notification of specific file changes for resumed sessions, or starting fresh with an injected structured summary when much of the prior context is now stale. A is false — there's no automatic detection. B is excessive for every session. C doesn't address the actual staleness, just removes history."
        },
        {
          id: "P7-S2-Q15",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "During a four-hour legacy-codebase exploration session, Claude's answers start drifting: it begins describing \"typical patterns you'd expect in a system like this\" instead of citing the specific classes and functions it discovered earlier in the same session. What is the most effective fix?",
          options: [
            { key: "A", text: "Restart the session every 30 minutes regardless of progress to avoid any drift, since a hard reset on a fixed schedule guarantees accumulated drift is cleared before it meaningfully affects later answers." },
            { key: "B", text: "Have the agent maintain a scratchpad file recording key findings as they're discovered, and reference it for subsequent questions to counteract context degradation." },
            { key: "C", text: "Switch to a model with a larger context window and continue without any other changes, since a bigger window reduces the relative proportion of the conversation that falls outside the model's effective attention span." },
            { key: "D", text: "Instruct the agent to always prefix answers with \"based on actual code\" to force grounding, since requiring that phrase would act as an enforceable signal that it's citing real discovered code rather than general knowledge." }
          ],
          correct: ["B"],
          explanation: "Scratchpad files that persist key findings across context boundaries directly counteract the degradation where models fall back on generic \"typical pattern\" answers in extended sessions. A is disruptive and loses in-progress context. C doesn't address the degradation pattern described. D is a cosmetic prompt change with no structural guarantee."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P7-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Orbital Research Collective's system is asked to research \"the effects of remote work on urban economies.\" The final report only discusses downtown retail vacancy rates. Coordinator logs show it decomposed the topic into three subtasks: \"retail vacancy in central business districts,\" \"foot traffic decline near office towers,\" and \"ground-floor lease renewal rates.\" Each subagent executed its assigned subtask correctly. What is the most likely root cause of the narrow final report?",
          options: [
            { key: "A", text: "The synthesis subagent dropped findings about housing and commuting during report generation, meaning the raw findings existed somewhere in the pipeline but were lost only at the final synthesis stage." },
            { key: "B", text: "The web search subagent's queries were too narrow and need broader keyword sets." },
            { key: "C", text: "The coordinator's task decomposition was too narrow, assigning only retail-related subtopics and omitting other relevant domains like housing markets, commuting patterns, and suburban migration." },
            { key: "D", text: "The document analysis subagent applied overly strict relevance filters that excluded non-retail sources, meaning relevant housing and commuting documents were retrieved but then discarded before synthesis." }
          ],
          correct: ["C"],
          explanation: "Each subagent executed its narrow assignment correctly — the problem traces back to the coordinator's decomposition, which never created subtasks covering housing, commuting, or migration. A, B, and D incorrectly blame downstream agents operating correctly within the scope they were given."
        },
        {
          id: "P7-S3-Q2",
          domain: 1,
          task: "1.2",
          type: "multiple",
          select: 2,
          stem: "Reviewing a completed report on \"gene-editing regulatory trends,\" you notice the web-search subagent and the document-analysis subagent both independently retrieved and cited the same three regulatory guidance PDFs, while an entire relevant category — academic bioethics commentary — was never covered by either. Which TWO coordinator-level changes would most directly fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct both subagents to search as broadly as possible so nothing is missed." },
            { key: "B", text: "Partition the research scope so each subagent is assigned distinct subtopics or source types (for example, web search handles news/industry sources, document analysis handles the academic bioethics literature) to minimize duplication and close coverage gaps." },
            { key: "C", text: "Reduce the number of subagents from two to one to simplify coordination." },
            { key: "D", text: "Have the coordinator evaluate the synthesis output for gaps and re-delegate targeted follow-up queries to cover the missing academic bioethics angle." },
            { key: "E", text: "Instruct the synthesis subagent to deduplicate citations after the fact, without changing subagent assignments." }
          ],
          correct: ["B", "D"],
          explanation: "Partitioning distinct subtopics/source types up front prevents duplication and gaps, and an iterative refinement loop where the coordinator detects gaps and re-delegates closes any that remain. A makes duplication more likely, not less. C removes needed source-type coverage entirely. E only cleans up symptoms after the fact without fixing the assignment overlap."
        },
        {
          id: "P7-S3-Q3",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "The synthesis subagent's report on \"microplastics in marine food chains\" cites a \"2023 longitudinal field study\" with specific statistics that do not exist in any of the actual search results or document excerpts gathered earlier. Investigation shows the coordinator's prompt to the synthesis subagent said only: \"Synthesize the research findings on microplastics into a report,\" without including the underlying search results or document analysis output. What is the root cause?",
          options: [
            { key: "A", text: "The subagent does not automatically inherit the coordinator's conversation history or the findings of prior subagents; without the actual findings included directly in its prompt, it has no grounded material to synthesize from and fabricates plausible-sounding citations." },
            { key: "B", text: "The synthesis subagent's temperature setting is too high, causing it to invent statistics." },
            { key: "C", text: "The web search subagent failed silently and returned no results at all." },
            { key: "D", text: "The synthesis subagent needs its own web-search tool so it can verify citations independently, since giving it that capability would let it cross-check every statistic against live sources before including them in the final report, regardless of what context it was or wasn't given upfront." }
          ],
          correct: ["A"],
          explanation: "Subagents operate with isolated context and must be given complete findings explicitly in their prompt; omitting them leaves the model nothing grounded to work from, producing fabricated citations. B is an out-of-scope, unsupported explanation. C is contradicted — search did return results, they just weren't passed along. D misdiagnoses the fix as a tool gap rather than a context-passing gap."
        },
        {
          id: "P7-S3-Q4",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A research run on a complex topic took 95 seconds; traces show the coordinator emitted a Task call for the web-search subagent, waited for its full result, then emitted a separate Task call for the document-analysis subagent in the next turn, even though the two subagents don't depend on each other's output. What change would most reduce latency?",
          options: [
            { key: "A", text: "Merge the two subagents into one combined agent so only one Task call is needed." },
            { key: "B", text: "Have the coordinator emit both Task tool calls within the same response so the subagents run in parallel instead of sequentially." },
            { key: "C", text: "Reduce the document-analysis subagent's context window so it processes faster." },
            { key: "D", text: "Cache the web-search results so the document-analysis subagent can reuse them." }
          ],
          correct: ["B"],
          explanation: "Independent subagents should be spawned in parallel by emitting multiple Task calls in a single coordinator response; running them sequentially across separate turns multiplies latency unnecessarily. A sacrifices specialization. C and D don't address the sequential invocation pattern causing the delay."
        },
        {
          id: "P7-S3-Q5",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "For a narrow, well-understood literature-review task (\"summarize the last 5 years of peer-reviewed papers on CRISPR off-target effects\"), versus an open-ended task (\"investigate the broader implications of gene-editing technology for society\"), which decomposition strategy pairing is most appropriate?",
          options: [
            { key: "A", text: "Use dynamic adaptive decomposition for both tasks, since it is always superior to fixed pipelines." },
            { key: "B", text: "Use a fixed sequential pipeline for both tasks, since consistency matters more than adaptability." },
            { key: "C", text: "Use a fixed, predictable pipeline (search papers, extract findings, synthesize) for the narrow literature review, and dynamic decomposition that generates new subtasks based on intermediate findings for the open-ended societal-implications investigation." },
            { key: "D", text: "Use dynamic decomposition for the narrow task and a fixed pipeline for the open-ended task, since applying some form of systematic decomposition to each task matters more than carefully matching the specific decomposition strategy to how open-ended or well-scoped that task happens to be." }
          ],
          correct: ["C"],
          explanation: "Predictable, well-scoped tasks suit fixed prompt-chaining pipelines, while open-ended investigations benefit from adaptive decomposition that reacts to what's discovered along the way. A and B apply one strategy universally regardless of fit. D reverses the appropriate pairing."
        },
        {
          id: "P7-S3-Q6",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "Two researchers want to compare how the report reads when the synthesis subagent is instructed to prioritize recency versus when it's instructed to prioritize source authority, both starting from the same completed web-search and document-analysis findings. What is the most efficient approach?",
          options: [
            { key: "A", text: "Re-run web search and document analysis twice, once for each synthesis style." },
            { key: "B", text: "Manually copy the findings into two separate chat applications outside Claude Code." },
            { key: "C", text: "Run both synthesis styles in the same session, one after another, and compare the two outputs." },
            { key: "D", text: "Use fork_session to branch from the shared findings baseline into two independent sessions, one per synthesis instruction." }
          ],
          correct: ["D"],
          explanation: "fork_session lets you explore divergent approaches from a shared analysis baseline without repeating expensive upstream work. A duplicates already-completed work unnecessarily. B abandons the platform's built-in support. C risks the second run being influenced by the first run's framing still present in context."
        },
        {
          id: "P7-S3-Q7",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "The document-analysis subagent frequently calls a tool named analyze_content (\"Processes content and returns insights\") when it should instead call analyze_document (\"Processes content and returns insights for documents\"), since the two descriptions are nearly identical. What is the most effective fix?",
          options: [
            { key: "A", text: "Rename analyze_content to something web-specific like extract_web_results, and rewrite both descriptions so their purposes, inputs, and boundaries no longer overlap." },
            { key: "B", text: "Delete analyze_content entirely and route all requests through analyze_document." },
            { key: "C", text: "Add a routing instruction to the system prompt telling the agent which tool to prefer by default, since a clear default preference would reduce misrouting even if the two descriptions still overlap." },
            { key: "D", text: "Increase the number of few-shot examples showing analyze_document being called correctly, since enough demonstrations of the preferred tool should outweigh the ambiguity created by the overlapping descriptions." }
          ],
          correct: ["A"],
          explanation: "Eliminating functional overlap through renaming and differentiated descriptions addresses the actual root cause: near-identical descriptions that give the model no basis to distinguish the tools. B removes needed functionality. C and D paper over the ambiguity without fixing the descriptions themselves."
        },
        {
          id: "P7-S3-Q8",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "The web-search subagent's search tool times out after 30 seconds on a slow upstream API. The tool currently returns { \"isError\": true, \"content\": \"search unavailable\" }, and the coordinator has no way to decide whether to retry, try a different query, or proceed with partial results. What should the tool return instead?",
          options: [
            { key: "A", text: "The same message, but in a different text color for visibility in logs, since a visually distinct error would help engineers notice the timeout faster the next time they're reviewing raw log output." },
            { key: "B", text: "Structured error context including failure type (timeout), the query that was attempted, any partial results obtained, and potential alternative approaches." },
            { key: "C", text: "A blank successful result so the pipeline doesn't halt." },
            { key: "D", text: "An automatic switch to a backup search provider with no notification to the coordinator, since a seamless failover would prevent any visible interruption to the pipeline." }
          ],
          correct: ["B"],
          explanation: "Structured error context that distinguishes failure type and preserves what was attempted and partially obtained is what enables the coordinator to make an intelligent recovery decision. A is cosmetic. C silently hides a real failure as success. D removes the coordinator's visibility and control entirely."
        },
        {
          id: "P7-S3-Q9",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "A document-analysis subagent queries internal filings for \"lithium-ion battery recycling patents filed in 2024\" and legitimately finds zero matching documents — none exist in the corpus. The coordinator's current logic treats any zero-result response as a failure and retries the same query three times before giving up. What's wrong with this?",
          options: [
            { key: "A", text: "Three retries is not enough; it should retry five times before giving up." },
            { key: "B", text: "The corpus should be expanded immediately so a zero-result case can never occur again, even though doing so does nothing at all to address how the coordinator currently misinterprets a correctly empty result as an outright access failure requiring a retry." },
            { key: "C", text: "The subagent should guess at related documents instead of returning zero results." },
            { key: "D", text: "A successful query that legitimately found nothing is a valid empty result, not an access failure, and shouldn't trigger retries; the coordinator should instead note the gap and treat it as a genuine absence of matching sources." }
          ],
          correct: ["D"],
          explanation: "Distinguishing a valid empty result from an access failure (like a timeout) is essential — retrying a query that correctly found nothing wastes effort and won't change the outcome. A scales the same mistake. B and C are unrealistic or risk introducing unsupported, fabricated matches."
        },
        {
          id: "P7-S3-Q10",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "The synthesis subagent at Orbital Research Collective has been given all 18 tools available across the whole platform — including web-search and document-fetch tools meant only for the research-gathering subagents — \"just in case it needs them.\" Logs show the synthesis subagent now occasionally attempts its own ad hoc web searches mid-synthesis instead of working from the findings it was given. What's the best fix?",
          options: [
            { key: "A", text: "Add a system prompt instruction telling the synthesis subagent not to use search tools, since a clear prohibition stated directly in the prompt should be sufficient to stop the unwanted behavior without needing to change what tools are actually available to it in the first place." },
            { key: "B", text: "Restrict the synthesis subagent's tool set to only what its role requires (for example, a narrow verify_fact tool), removing broad research tools like web-search and document-fetch that belong to other subagents." },
            { key: "C", text: "Increase the synthesis subagent's context window so it doesn't feel the need to search for more information." },
            { key: "D", text: "Add more few-shot examples showing synthesis without any tool calls." }
          ],
          correct: ["B"],
          explanation: "Scoping each agent's tools to its specialization prevents misuse of tools outside an agent's role, which is the documented root cause of agents attempting tasks like ad hoc searching outside their lane. A is a weaker prompt-only constraint competing with tool availability. C and D don't remove the actual capability causing the misuse."
        },
        {
          id: "P7-S3-Q11",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "You want to guarantee that the report-generation subagent always produces its final output via a tool call (compile_report) rather than occasionally returning a conversational summary as plain text instead. Which tool_choice configuration should you use?",
          options: [
            { key: "A", text: "tool_choice: \"any\", which forces the model to call some tool rather than return plain text, while still letting it choose which tool if more than one is available." },
            { key: "B", text: "tool_choice: \"auto\", the default behavior that allows plain text responses." },
            { key: "C", text: "Remove all other tools from the subagent so it has nothing else to call, without setting tool_choice at all." },
            { key: "D", text: "A system prompt instruction reminding the agent to \"always use a tool.\"" }
          ],
          correct: ["A"],
          explanation: "\"any\" is the documented configuration that guarantees a tool call while leaving tool selection to the model, directly solving the described problem. B is the default that permits exactly the behavior being avoided. C is a workaround that removes flexibility rather than configuring tool_choice. D is a probabilistic prompt-only approach with a non-zero failure rate."
        },
        {
          id: "P7-S3-Q12",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "The document-analysis subagent repeatedly calls a list_available_documents tool and then several get_document_summary calls just to figure out what's in the internal research corpus before it can decide what to actually analyze, consuming significant context and turns on every run. What MCP feature would reduce this exploratory tool-calling overhead?",
          options: [
            { key: "A", text: "A larger get_document_summary response with more fields per document, since richer per-document metadata might let the agent make its analysis decision after fewer rounds of back-and-forth summary calls." },
            { key: "B", text: "A stricter JSON schema on the list_available_documents tool, since tightening the schema ensures consistently structured output even though call volume and exploratory overhead stay the same." },
            { key: "C", text: "An MCP resource exposing a catalog of the corpus (titles, summaries, document hierarchy) that the agent can reference directly, reducing the need for repeated exploratory tool calls." },
            { key: "D", text: "A tool_choice: \"any\" setting on the document-analysis subagent." }
          ],
          correct: ["C"],
          explanation: "MCP resources are designed to expose content catalogs like document hierarchies so agents can reference them directly instead of repeatedly calling tools just to discover what's available. A adds more content per call but doesn't reduce the number of exploratory calls. B and D don't address the discovery-overhead problem at all."
        },
        {
          id: "P7-S3-Q13",
          domain: 5,
          task: "5.6",
          type: "multiple",
          select: 3,
          stem: "To prevent the synthesis subagent from losing source attribution when it merges findings from multiple subagents into a report, which THREE practices should be required of upstream subagents and the synthesis step? (Select THREE.)",
          options: [
            { key: "A", text: "Have each subagent write its findings as plain prose paragraphs without any structured fields, to keep prompts simple." },
            { key: "B", text: "Require subagents to output structured claim-source mappings (the claim, a supporting excerpt, and the source URL/document name) that the synthesis subagent preserves rather than discarding when merging." },
            { key: "C", text: "Require subagents to include publication or data-collection dates in their structured output so temporal context is preserved during synthesis." },
            { key: "D", text: "Instruct the synthesis subagent to rewrite every finding into a single uniform paragraph style regardless of content type, to simplify the final report." },
            { key: "E", text: "Structure the final report with explicit sections distinguishing well-established findings from contested ones, preserving each source's original characterization." }
          ],
          correct: ["B", "C", "E"],
          explanation: "Preserving structured claim-source mappings, temporal metadata, and explicit well-established-vs-contested sectioning are the documented techniques for maintaining provenance through synthesis. A removes the structure needed to preserve attribution in the first place. D collapses meaningfully different content types (for example, financial tables vs. prose) into a uniform format, which is specifically discouraged."
        },
        {
          id: "P7-S3-Q14",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "Two credible sources disagree on the market size for \"lab-grown meat\" — one industry report says $2.1B, a peer-reviewed estimate says $1.4B for the same year. The synthesis subagent currently picks whichever number appeared first in its input and presents it as the figure, without mentioning the other. What's the better approach?",
          options: [
            { key: "A", text: "Annotate the conflict explicitly, presenting both values with their respective source attribution, rather than arbitrarily selecting one." },
            { key: "B", text: "Average the two numbers and present the average as the figure, since splitting the difference gives stakeholders one usable number instead of two conflicting figures they'd otherwise have to reconcile themselves." },
            { key: "C", text: "Always prefer the peer-reviewed source over the industry report by default in all cases, since academic peer review is generally a stronger methodological signal than an industry estimate." },
            { key: "D", text: "Omit the figure entirely from the report whenever two sources disagree, since leaving out a contested figure avoids ever presenting a number that could later turn out to be the less accurate of the two estimates." }
          ],
          correct: ["A"],
          explanation: "Conflicting statistics from credible sources should be annotated with source attribution so the reader can judge for themselves, rather than arbitrarily resolved. B fabricates a third number that neither source actually reported. C is an unjustified blanket rule. D discards useful, properly-attributed information."
        },
        {
          id: "P7-S3-Q15",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "A document-analysis subagent hits a permission error accessing a restricted internal repository. Rather than surfacing this, the subagent's current code catches the exception and returns an empty findings list indistinguishable from a legitimate empty result, and the coordinator proceeds as if that source area had simply been checked and found nothing relevant. What anti-pattern is this?",
          options: [
            { key: "A", text: "Terminating the entire multi-agent workflow immediately upon any single subagent error." },
            { key: "B", text: "Silently suppressing the error by returning an empty result as if it were a successful search, hiding the fact that an entire source was never actually checked." },
            { key: "C", text: "Retrying the permission error automatically until it succeeds." },
            { key: "D", text: "Escalating every subagent error directly to a human reviewer regardless of severity, since routing every failure to a human guarantees none goes completely unnoticed." }
          ],
          correct: ["B"],
          explanation: "Silently suppressing an error as a false \"successful empty result\" is a documented anti-pattern — it hides a real access failure from the coordinator, which then can't annotate the report with the resulting coverage gap. A describes the opposite anti-pattern (over-aggressive termination), not what happened here. C and D aren't what the code actually does in this scenario."
        }
      ]
    },
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P7-S6-Q1",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Cascade Diagnostics extracts structured results from pathology PDF reports using a tool_use schema where \"ordering_physician_npi\" is marked as a required string field. For reports where the physician's NPI number is simply never printed on the scanned document, the model now reliably returns a plausible-looking but fabricated 10-digit NPI instead of indicating the data is missing. What is the most effective fix?",
          options: [
            { key: "A", text: "Change \"ordering_physician_npi\" from a required field to an optional, nullable field, so the model can return null instead of being pressured to invent a value to satisfy the schema." },
            { key: "B", text: "Add a longer description to the field asking the model to \"only extract real NPIs.\"" },
            { key: "C", text: "Increase the temperature of the extraction call so the model is less confident and less likely to fabricate." },
            { key: "D", text: "Switch from tool_use to free-form JSON parsing so the schema is less restrictive." }
          ],
          correct: ["A"],
          explanation: "Required fields pressure the model to produce some value even when the source document doesn't contain the information, driving fabrication; making the field optional/nullable removes that pressure and lets the model accurately report absence. B is a weak prompt-only patch for a schema-design problem. C is not a reliable lever against fabrication. D removes tool_use's schema-compliance guarantees entirely and reintroduces JSON syntax-error risk."
        },
        {
          id: "P7-S6-Q2",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "Extracted invoices from Cascade Diagnostics' billing documents pass schema validation every time — tool_use guarantees valid JSON matching the schema — yet a monthly audit finds 4% of extractions have line items that don't sum to the stated total, and a handful have the patient's copay amount placed in the insurance-paid field instead. Which TWO changes would best catch these problems, since schema validation alone does not? (Select TWO.)",
          options: [
            { key: "A", text: "Add a stricter regex pattern constraint to each numeric field in the schema so only well-formed numbers are accepted." },
            { key: "B", text: "Have the extraction tool also compute and return a \"calculated_total\" field (the sum of line items) alongside \"stated_total\", flagging a discrepancy when they don't match." },
            { key: "C", text: "Switch from tool_use back to prompting the model to output raw JSON text, trusting it to self-check totals before responding." },
            { key: "D", text: "Add a \"conflict_detected\" boolean the model must set when values appear inconsistent with each other (for example, a copay figure appearing where an insurance-paid amount is expected), prompting a self-correction pass." },
            { key: "E", text: "Increase the number of required fields in the schema so more values must be present." }
          ],
          correct: ["B", "D"],
          explanation: "Strict JSON schemas via tool_use eliminate syntax errors but not semantic errors like totals that don't add up or values in the wrong field. Computing a calculated_total to compare against stated_total, and adding a conflict_detected flag for inconsistent-looking values, are the documented techniques for catching these semantic errors. A only constrains formatting, not arithmetic correctness. C removes tool_use's schema guarantees entirely, reintroducing syntax-error risk without fixing semantic errors. E increases fabrication risk rather than catching semantic inconsistencies."
        },
        {
          id: "P7-S6-Q3",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Cascade Diagnostics ingests three different document types from different lab partners — pathology reports, toxicology panels, and genomic sequencing summaries — each needing a different extraction schema. Before processing an incoming PDF, the pipeline doesn't yet know which document type it is. Which tool_choice configuration should be used on the extraction call so the model is guaranteed to return structured output via one of the three extraction tools?",
          options: [
            { key: "A", text: "tool_choice: \"auto\", so the model can decide whether structured extraction is needed." },
            { key: "B", text: "A forced tool selection naming one specific schema, e.g. { \"type\": \"tool\", \"name\": \"extract_pathology_report\" }, applied to every document." },
            { key: "C", text: "tool_choice: \"any\", so the model must call one of the three available extraction tools, but is free to choose which schema actually matches the incoming document." },
            { key: "D", text: "No tool_choice setting, relying on the system prompt to describe each document type." }
          ],
          correct: ["C"],
          explanation: "\"any\" guarantees a tool call while letting the model pick the matching schema when the document type is unknown ahead of time. \"auto\" (A) risks the model returning plain text instead of structured output. Forcing one specific tool (B) would misclassify any document that isn't a pathology report. Omitting tool_choice (D) provides the weakest guarantee of structured output."
        },
        {
          id: "P7-S6-Q4",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Each incoming lab report must first go through an extract_metadata tool (document ID, lab partner, received date) before any clinical-field enrichment tools run, because downstream enrichment depends on the lab partner identified in that first step. Occasionally the model skips straight to an enrichment tool on its own. What should be configured for the first call in the pipeline?",
          options: [
            { key: "A", text: "tool_choice: \"any\" for the first call, so the model picks whichever tool it judges best, since letting it freely choose among all available tools should still eventually converge on calling extract_metadata first." },
            { key: "B", text: "A forced tool selection, tool_choice: { \"type\": \"tool\", \"name\": \"extract_metadata\" }, for the first call specifically, then process subsequent enrichment steps in follow-up turns once metadata is known." },
            { key: "C", text: "A longer system prompt paragraph insisting metadata extraction always comes first." },
            { key: "D", text: "Combine metadata extraction and all enrichment into a single tool so ordering can't be violated, since merging every step into one monolithic call makes it structurally impossible to invoke enrichment before metadata exists." }
          ],
          correct: ["B"],
          explanation: "Forcing a specific named tool for the first call guarantees the required ordering deterministically, after which subsequent steps can proceed normally. A still leaves the choice to the model, which is exactly the unreliable behavior being observed. C is a prompt-only guarantee with a non-zero failure rate. D removes useful separation of concerns and schema clarity for an unrelated reason."
        },
        {
          id: "P7-S6-Q5",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "An extraction for \"tumor margin status\" fails validation because the field is empty. The retry pipeline appends the validation error and resubmits the same document up to five times, but the field remains empty every time. Manual review of the source PDF confirms the pathologist's note simply never mentions margin status at all for this specimen. What should the system do?",
          options: [
            { key: "A", text: "Keep retrying beyond five attempts with a longer validation error message each time, since a more detailed and increasingly specific description might eventually help the model locate margin status information that genuinely isn't present anywhere in the source document at all." },
            { key: "B", text: "Switch the document to a different extraction model and retry from attempt one." },
            { key: "C", text: "Mark the document as a schema syntax error, since tool_use should have prevented this." },
            { key: "D", text: "Recognize that retries are only effective for format/structural errors, not for information that is genuinely absent from the source; stop retrying, return the field as null, and flag the document for human review instead." }
          ],
          correct: ["D"],
          explanation: "Retry-with-error-feedback helps when the model mis-formatted or misplaced an answer, but it cannot invent information that was never in the source document. Recognizing this limit and routing to human review is the correct response. A wastes cost on an unresolvable loop. B doesn't address the actual cause. C mischaracterizes a semantic/absence issue as a schema syntax issue, which tool_use already prevents."
        },
        {
          id: "P7-S6-Q6",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "Developers frequently dismiss a particular recurring finding type (\"possible incomplete margin documentation\") as a false positive. The extraction pipeline currently has no way to analyze why this specific finding type is dismissed so often. What should be added to the structured findings output to enable this analysis?",
          options: [
            { key: "A", text: "A detected_pattern field recording which document construct triggered each finding, enabling systematic analysis of dismissal patterns across many documents." },
            { key: "B", text: "A free-text \"notes\" field where reviewers can type whatever they want." },
            { key: "C", text: "A higher confidence threshold so the finding type stops appearing altogether, since suppressing the finding entirely would stop developers from ever having to make this particular dismissal decision again." },
            { key: "D", text: "A dedicated chat channel where reviewers post complaints about false positives, since centralizing informal complaints in one place would at least make them easier to skim later." }
          ],
          correct: ["A"],
          explanation: "A structured detected_pattern field enables systematic analysis of which patterns drive dismissals across many documents, informing targeted prompt fixes. B is unstructured and hard to analyze at scale. C suppresses the symptom without understanding or fixing the cause. D is an informal process workaround, not a structured data fix."
        },
        {
          id: "P7-S6-Q7",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Cascade Diagnostics' source documents vary widely: some toxicology panels report concentrations as \"less than 5 ng/mL,\" others as \"<5ng/mL,\" and others with a footnote like \"below detectable threshold.\" The current extraction prompt describes the expected numeric format in three paragraphs of prose, but results remain inconsistent across these variants. What is the most effective fix?",
          options: [
            { key: "A", text: "Add one more paragraph of prose clarifying the exact wording expected." },
            { key: "B", text: "Reject any document using footnote-style threshold language as unprocessable." },
            { key: "C", text: "Require every lab partner to standardize their reporting format before submission, since one consistent format across partners would remove the variability causing inconsistent extraction at the source." },
            { key: "D", text: "Provide 2-4 few-shot examples showing each informal format (\"less than 5 ng/mL\", \"<5ng/mL\", \"below detectable threshold\") mapped to the same normalized extracted value." }
          ],
          correct: ["D"],
          explanation: "Few-shot examples are the most effective way to demonstrate correct handling of varied, informally-worded source formats, letting the model generalize to new phrasing it hasn't seen verbatim. A repeats the same ineffective approach. B and C discard valid documents or push an unrealistic external requirement rather than solving the extraction problem."
        },
        {
          id: "P7-S6-Q8",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "A new extraction scenario, \"specimen collected under non-standard conditions (for example, delayed transport, partial sample),\" wasn't explicitly covered in the original few-shot examples, which only showed standard specimen handling. The model now handles this novel scenario by making a reasonable analogous judgment rather than failing or guessing wildly. Why does this generalization work well?",
          options: [
            { key: "A", text: "The schema includes a catch-all \"miscellaneous\" field that absorbs any unexpected case automatically, meaning any unanticipated detail is captured somewhere without the model needing to reason analogously." },
            { key: "B", text: "Few-shot examples demonstrate the type of reasoning and judgment expected, which the model can generalize to novel but analogous patterns rather than only matching pre-specified cases exactly." },
            { key: "C", text: "The model was fine-tuned specifically on non-standard specimen cases." },
            { key: "D", text: "The extraction tool automatically detects novel cases and routes them to a separate, specialized tool, which would explain the reasonable handling without needing any generalization from the original few-shot examples at all." }
          ],
          correct: ["B"],
          explanation: "The value of few-shot examples is in demonstrating the reasoning pattern and judgment criteria, which generalizes beyond the literal examples shown, rather than matching only identical scenarios. A, C, and D describe mechanisms that aren't what's actually happening here, and fine-tuning is out of scope for this extraction pipeline."
        },
        {
          id: "P7-S6-Q9",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Cascade Diagnostics' sample-intake team wants an extraction result the moment a rush pathology report is uploaded, so clinicians can act same-day. An engineer proposes routing all extractions, including rush reports, through the Message Batches API to save 50% on cost. What is the issue with this plan?",
          options: [
            { key: "A", text: "The Batches API only supports a maximum of 10 documents per submission." },
            { key: "B", text: "The Batches API requires a fine-tuned model and cannot be used with standard extraction tools." },
            { key: "C", text: "The Batches API has no guaranteed latency SLA and a processing window of up to 24 hours, making it unsuitable for a same-day, latency-sensitive rush workflow; it's appropriate for non-blocking workloads like overnight or weekly batch processing instead." },
            { key: "D", text: "The Batches API cannot return structured tool_use output at all, meaning every single extraction submitted through it, rush or not, would have to fall back entirely to unstructured free-text parsing downstream instead of relying on schema-validated fields the way the synchronous API does." }
          ],
          correct: ["C"],
          explanation: "The Message Batches API trades guaranteed low latency for a 50% cost discount, with up to a 24-hour window and no SLA — appropriate for latency-tolerant workloads, not time-sensitive rush cases needing a same-day synchronous response. A, B, and D are fabricated constraints not part of how the Batches API actually works."
        },
        {
          id: "P7-S6-Q10",
          domain: 4,
          task: "4.5",
          type: "multiple",
          select: 2,
          stem: "An overnight batch of 500 lab reports is submitted via the Message Batches API. The next morning, 23 submissions come back failed: 15 failed because the PDFs exceeded the model's context limit, and 8 failed due to a transient upstream service error. Which TWO steps should the recovery process take? (Select TWO.)",
          options: [
            { key: "A", text: "Identify the 23 failed documents by their custom_id and resubmit only those, rather than reprocessing all 500." },
            { key: "B", text: "Resubmit the entire batch of 500 from scratch to be safe." },
            { key: "C", text: "For the 15 documents that exceeded the context limit, chunk them into smaller sections before resubmitting, rather than resubmitting them unmodified." },
            { key: "D", text: "Permanently exclude all 23 documents from future processing since batch failures indicate unprocessable content." },
            { key: "E", text: "Switch the whole workload to the synchronous API going forward to avoid any future batch failures." }
          ],
          correct: ["A", "C"],
          explanation: "custom_id lets you identify and resubmit only the failed documents, avoiding wasted reprocessing of the 477 that already succeeded, and oversized documents specifically need chunking before resubmission rather than an unmodified retry that will fail the same way again. B wastes cost and time. D discards recoverable documents unnecessarily. E abandons the batch API's cost savings for the entire workload over a partial, explainable failure rate."
        },
        {
          id: "P7-S6-Q11",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "A team tries to have their extraction tool call a separate internal lookup_reference_range tool mid-request, within a single Message Batches API submission, so the extraction can validate a lab value against the reference range before returning. Every one of these batch requests fails or behaves unexpectedly. What is the root cause?",
          options: [
            { key: "A", text: "The Message Batches API does not support multi-turn tool calling within a single request — it cannot execute a tool mid-request and return results back into the same request for further processing." },
            { key: "B", text: "The lookup_reference_range tool's schema is incompatible with JSON Schema." },
            { key: "C", text: "Batch requests are limited to a single tool per request, and two tools were configured, which would explain the consistent failures seen across every submission even though each individual tool was defined and validated correctly in isolation." },
            { key: "D", text: "The 24-hour processing window was exceeded before the lookup could complete, since a lookup that requires its own round trip would need to finish within whatever time remained in that submission's processing window." }
          ],
          correct: ["A"],
          explanation: "The Batches API is designed for single-turn requests and does not support executing a tool mid-request and feeding results back for further reasoning within that same request — that requires the standard synchronous multi-turn flow. B, C, and D are fabricated constraints that don't reflect the actual limitation."
        },
        {
          id: "P7-S6-Q12",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "The same Claude session that generated a proposed fix for a mis-mapped extraction field is then asked, in that same conversation, to review its own fix for correctness before deployment. It reports high confidence and finds no issues, but a human reviewer later finds the fix only handles one of two mis-mapping cases. What is the most likely explanation, and what should change?",
          options: [
            { key: "A", text: "The model's context window was too small to hold the entire fix; it should be reviewed with a larger window." },
            { key: "B", text: "The review should have used extended thinking within the same session to catch the gap, since more reasoning time before responding ought to surface subtle gaps regardless of whether it's reviewing its own freshly generated work from earlier in that very conversation." },
            { key: "C", text: "The fix itself was correct; the human reviewer made an error." },
            { key: "D", text: "A model reviewing its own just-generated work retains the reasoning context from generation, making it less likely to question its own decisions; an independent Claude instance without that prior reasoning context should perform the review instead." }
          ],
          correct: ["D"],
          explanation: "Self-review within the same session that generated the fix is documented as less effective at catching subtle issues than an independent review instance without the generator's reasoning context. A and B misattribute the problem to context size or a thinking setting rather than self-review bias. C dismisses a documented finding without justification."
        },
        {
          id: "P7-S6-Q13",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Extraction accuracy drops noticeably on long, multi-section genomic sequencing reports (15+ pages covering specimen info, variant findings, methodology, and clinical interpretation) when the entire document is sent through one large extraction prompt at once, compared to shorter single-section reports. What decomposition strategy would most likely improve accuracy?",
          options: [
            { key: "A", text: "Reduce the schema to fewer required fields so the single large prompt has less to extract." },
            { key: "B", text: "Split extraction into per-section passes (specimen info, variant findings, methodology, clinical interpretation extracted separately), followed by a separate cross-section consistency pass that checks, for example, that the clinical interpretation aligns with the variant findings." },
            { key: "C", text: "Submit the entire document twice through the same single large prompt and keep whichever result has higher model-reported confidence." },
            { key: "D", text: "Switch the entire pipeline to the Message Batches API, since batch processing handles long documents more accurately, because batch jobs run on dedicated infrastructure that teams sometimes assume is more careful and thorough than real-time synchronous processing for large inputs." }
          ],
          correct: ["B"],
          explanation: "Long, multi-section documents benefit from the same principle as large code reviews: focused per-section local extraction passes plus a separate cross-section integration pass avoid attention dilution across one long context. A reduces accuracy of a different kind by removing needed fields. C doesn't address the structural cause of the degradation. D changes cost/latency characteristics, not extraction accuracy on long documents."
        },
        {
          id: "P7-S6-Q14",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "An extraction validation-retry loop for toxicology reports is supposed to stop once the extracted JSON passes schema and semantic validation. Instead, one document has looped through 30 retry attempts without stopping. The loop's termination check currently scans the model's accompanying explanation text each attempt for a phrase like \"extraction is now complete and accurate\" before considering the loop done, rather than checking the actual validation result. What is the root cause?",
          options: [
            { key: "A", text: "The document is too large for any extraction schema to handle." },
            { key: "B", text: "The retry loop's maximum attempt count is configured too high." },
            { key: "C", text: "The loop relies on parsing the model's natural-language self-description as the stopping signal instead of checking the deterministic pass/fail result of the validation step, so a confidently-worded but still-invalid extraction never registers as complete." },
            { key: "D", text: "The validation step itself is non-deterministic and needs to be replaced with a schema-only check, since removing any semantic validation step would eliminate inconsistent results from influencing whether the retry loop ever considers an extraction acceptable to stop on." }
          ],
          correct: ["C"],
          explanation: "Parsing natural-language signals to determine when a loop should stop is an unreliable anti-pattern; the loop should instead terminate based on the actual deterministic validation outcome (pass/fail), not the model's self-assessment text. A is unsupported speculation. B only limits the damage rather than fixing the broken termination logic. D incorrectly blames the validation step rather than how its result is checked."
        },
        {
          id: "P7-S6-Q15",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Cascade Diagnostics reports 97% overall extraction accuracy across all document types, and leadership wants to eliminate human review entirely to cut costs. A closer look, however, reveals accuracy is 99.5% on pathology reports but only 84% on genomic sequencing summaries, a document type introduced three months ago in smaller volume. What does this reveal, and what should be done?",
          options: [
            { key: "A", text: "Aggregate accuracy figures can mask poor performance on specific document types or fields; accuracy should be validated by document type and field segment, with continued human review on genomic sequencing summaries until their error rate is also acceptable." },
            { key: "B", text: "The 97% aggregate figure is accurate and sufficient justification to remove human review across all document types immediately, since a number that high across the full document mix should already reflect whatever variation exists among individual document types without further analysis." },
            { key: "C", text: "Genomic sequencing summaries should be permanently excluded from the extraction pipeline since their accuracy is too low to ever improve, given that three months of attempted refinement apparently haven't closed the gap with pathology reports." },
            { key: "D", text: "The discrepancy is likely a measurement error in the accuracy calculation and should be ignored until next quarter's audit, since waiting for the next scheduled review avoids overreacting to what might just be a short-term statistical anomaly limited to this particular newer, lower-volume document type." }
          ],
          correct: ["A"],
          explanation: "A high aggregate accuracy figure can hide significantly worse performance on a specific document type — here, a newer, lower-volume type. Segmenting accuracy analysis by document type and field, and keeping human review in place for weaker segments, is the correct response. B ignores the segment-level finding entirely. C is an overreaction without first attempting prompt refinement. D dismisses a real, measurable discrepancy without justification."
        }
      ]
    }
  ]
});
