window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 4,
  title: "Mock Exam 4",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P4-S1-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "SkyWing Airlines' support agent occasionally stops mid-investigation right after calling lookup_order, even though the API response's stop_reason was \"tool_use\". Engineers find the orchestration code mistakenly checks whether the assistant's response contains any readable text to decide whether to keep looping, instead of checking stop_reason directly. What is the correct fix?",
          options: [
            { key: "A", text: "Parse the assistant's text for phrases like \"I will now check the order\" to decide whether to continue looping." },
            { key: "B", text: "Cap the loop at a fixed number of iterations (e.g., 5) and treat reaching the cap as task completion." },
            { key: "C", text: "Continue the loop whenever stop_reason is \"tool_use\", appending tool results to conversation history for the next iteration, and stop only when stop_reason is \"end_turn\"." },
            { key: "D", text: "Treat any assistant message that includes natural-language text as the final answer, even if a tool_use block is also present in the same response, assuming prose and a tool call can never legitimately coexist in one turn." }
          ],
          correct: ["C"],
          explanation: "The agentic loop should key off stop_reason, not the presence of assistant text, because Claude can include explanatory text alongside a tool_use block while still intending to continue. Parsing natural-language phrases (A) and treating any text as a stop signal (D) are both unreliable heuristics named as anti-patterns in the guide. An arbitrary iteration cap (B) is also an anti-pattern when used as the primary termination mechanism rather than stop_reason."
        },
        {
          id: "P4-S1-Q2",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "An audit of SkyWing's support agent finds that in 9% of baggage-compensation cases, process_refund was called before get_customer had returned a verified passenger ID, issuing payouts against unverified identities. The system prompt already instructs verification first in bold text, yet the failures persist. What should the architecture team implement?",
          options: [
            { key: "A", text: "Implement a programmatic prerequisite that blocks process_refund calls until get_customer has returned a verified passenger ID, independent of prompt wording." },
            { key: "B", text: "Add several more few-shot examples to the system prompt reinforcing that verification must always come first." },
            { key: "C", text: "Increase the model's thinking budget so it reasons more carefully through the full get_customer-then-lookup_order-then-process_refund sequence before each financially sensitive tool call." },
            { key: "D", text: "Rewrite the bold warning in the system prompt as an even stricter, all-capitals imperative statement repeated at the start, middle, and end of the instructions." }
          ],
          correct: ["A"],
          explanation: "When a specific tool sequence is required for a critical business rule, programmatic enforcement provides a deterministic guarantee that prompt-based approaches cannot. Options B and D rely on probabilistic prompt compliance, which the audit already shows has a non-zero failure rate for this financially sensitive operation. A larger thinking budget (C) does not change the underlying absence of enforced ordering."
        },
        {
          id: "P4-S1-Q3",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "SkyWing's three backend systems return timestamps in different formats: Unix epoch from the loyalty service, ISO 8601 from the reservations API, and MM/DD/YYYY strings from the legacy refund ledger. The agent frequently miscalculates the 24-hour cancellation window because it reasons inconsistently about these mixed formats within the conversation. What is the most reliable fix?",
          options: [
            { key: "A", text: "Add a system-prompt instruction asking the model to \"normalize all dates to ISO 8601 before reasoning\" and to double-check epoch-versus-calendar conversions for every ledger entry it encounters." },
            { key: "B", text: "Add a fifth optional MCP tool, format_date, that the agent may call whenever it encounters a date string it wants converted." },
            { key: "C", text: "Ask passengers to submit cancellation requests using ISO 8601 date formatting." },
            { key: "D", text: "Implement a PostToolUse hook that converts all three date formats into a single consistent ISO 8601 representation before the tool result reaches the model." }
          ],
          correct: ["D"],
          explanation: "A PostToolUse hook guarantees every tool result is normalized before the model reasons about it, eliminating the inconsistency deterministically. Prompt instructions (A) rely on probabilistic compliance for a problem rooted in the data itself. An optional conversion tool (B) depends on the model remembering to call it every time. Asking passengers to reformat dates (C) does not fix the underlying backend inconsistency the agent must reason over."
        },
        {
          id: "P4-S1-Q4",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A SkyWing support engineer spent yesterday manually auditing a complex multi-day billing dispute, with the investigation stored under the session name billing-dispute-48213. Today the engineer wants to continue exactly where that investigation left off, preserving its full tool-call history, and nothing relevant has changed since yesterday.",
          options: [
            { key: "A", text: "Start a brand-new session and paste a short paragraph summarizing yesterday's findings." },
            { key: "B", text: "Run claude --resume billing-dispute-48213 to continue the named session with its full prior context intact." },
            { key: "C", text: "Re-run every MCP tool call from the previous day at the start of a new session to rebuild the same context." },
            { key: "D", text: "Use fork_session to branch two different resolution paths from yesterday's investigation." }
          ],
          correct: ["B"],
          explanation: "Because nothing relevant has changed, prior tool results remain fully valid, making --resume with the named session the most reliable way to continue with full fidelity. Starting fresh with a vague summary (A) is better reserved for when prior tool results are stale. Re-running identical tool calls (C) wastes effort rebuilding context that already exists. fork_session (D) is designed for exploring divergent approaches, not simple continuation."
        },
        {
          id: "P4-S1-Q5",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "During the same dispute, the engineer wants to explore two candidate resolutions from the identical point in the investigation -- a full refund versus a partial goodwill credit -- without either exploration affecting the other's context.",
          options: [
            { key: "A", text: "Resume the named session twice in two separate terminal windows." },
            { key: "B", text: "Start two unrelated fresh sessions and re-explain the entire dispute from scratch in each." },
            { key: "C", text: "Use fork_session to create two independent branches from the shared investigation baseline, one exploring each resolution." },
            { key: "D", text: "Append both candidate resolutions to the same session in sequence and let the model compare them in a single pass." }
          ],
          correct: ["C"],
          explanation: "fork_session is designed for exactly this case: creating independent branches from a shared analysis baseline to explore divergent approaches without cross-contamination. Resuming the same session twice (A) shares the same underlying state rather than branching it. Starting from scratch (B) discards the valuable shared investigation already completed. Appending both resolutions sequentially in one session (D) risks the two explorations influencing each other rather than remaining independent."
        },
        {
          id: "P4-S1-Q6",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Engineers notice that lookup_order returns the same empty payload both when a passenger genuinely has no matching order and when the backend order database times out mid-query. As a result, the agent sometimes tells passengers \"I don't see any order under that confirmation code\" when the real cause was a transient timeout that should have been retried instead. What is the most effective fix?",
          options: [
            { key: "A", text: "Have lookup_order return a structured result that explicitly distinguishes the two outcomes, e.g. { status: \"not_found\" } versus { status: \"timeout\", retryable: true }, so the agent can decide whether to retry or tell the passenger no order exists." },
            { key: "B", text: "Add a system-prompt instruction telling the model to silently retry lookup_order once whenever it receives an empty result, before telling the passenger no matching order exists." },
            { key: "C", text: "Increase the backend lookup timeout threshold so genuine timeouts happen less often, even though occasional timeouts could still occur during peak booking periods and under heavy load, and would still look identical to a real empty result to the model." },
            { key: "D", text: "Rely on the model inferring from response latency whether the call likely timed out, even though the model has no direct way to observe wall-clock latency between tool calls." }
          ],
          correct: ["A"],
          explanation: "A structured, explicit status field is the only approach that gives the model (and any downstream logic) a reliable, deterministic way to tell \"no order exists\" apart from \"the lookup failed transiently,\" which is the actual root cause of the misleading responses. Blind retrying on every empty result (B) wastes a tool call on every legitimate not-found case and still can't distinguish the two if the retry also returns empty. Raising the timeout threshold (C) only reduces how often the ambiguity occurs; it doesn't remove it. The model has no reliable signal for elapsed latency (D), so inferring timeouts from timing is not a viable mechanism."
        },
        {
          id: "P4-S1-Q7",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "process_refund currently returns the same generic body, {\"status\": \"failed\"}, whether the payment gateway timed out, the requested amount exceeded the passenger's eligible compensation, or the passenger lacks permission for an agent-initiated payout. The agent sometimes retries a policy-violation refund repeatedly because it cannot tell these failures apart. Which TWO fields should the structured error response include? (Select TWO.)",
          options: [
            { key: "A", text: "errorCategory, classifying the failure as transient, validation, permission, or business." },
            { key: "B", text: "isRetryable, a boolean indicating whether the agent should attempt the call again." },
            { key: "C", text: "A raw stack trace from the payment gateway's internal service for debugging." },
            { key: "D", text: "A self-reported confidence score indicating how certain the tool is that the refund would have succeeded." },
            { key: "E", text: "An HTTP-style numeric status code as the only indicator of failure type." }
          ],
          correct: ["A", "B"],
          explanation: "errorCategory and isRetryable let the agent distinguish transient, validation, permission, and business failures and decide retry logic without wasting attempts on non-retryable cases. A raw stack trace (C) leaks irrelevant internals that aren't actionable for the LLM. A self-reported confidence score (D) is an unrelated, unreliable anti-pattern more associated with flawed escalation design. A bare numeric status code (E) is the uniform-response problem being fixed, lacking category and retryability semantics."
        },
        {
          id: "P4-S1-Q8",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Architects want to guarantee that get_customer is always the very first tool call whenever a conversation begins a new passenger interaction, so identity context is loaded before the model reasons about anything else. Which API configuration achieves this guarantee for that turn?",
          options: [
            { key: "A", text: "tool_choice: \"auto\", trusting the model to independently judge when get_customer should run relative to other available tools" },
            { key: "B", text: "tool_choice: \"any\", forcing some tool call to happen but leaving the specific choice of which tool entirely up to the model's own judgment" },
            { key: "C", text: "A system-prompt note stating \"always call get_customer first.\"" },
            { key: "D", text: "tool_choice: {\"type\": \"tool\", \"name\": \"get_customer\"}" }
          ],
          correct: ["D"],
          explanation: "Forcing a specific named tool with tool_choice guarantees that exact tool is called for the turn. \"auto\" (A) leaves tool selection entirely to the model's discretion. \"any\" (B) guarantees a tool call but not which one. A system-prompt note (C) is prompt-based guidance with non-zero failure risk, not a deterministic guarantee."
        },
        {
          id: "P4-S1-Q9",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "SkyWing's four support tools are shared by the whole support engineering team and must never be committed with hardcoded API keys. One engineer also wants to privately test an experimental fifth tool, draft_apology_tool, before proposing it to the team. How should these be configured?",
          options: [
            { key: "A", text: "Define all five tools, including the experimental one, in the project's .mcp.json with the API key hardcoded for simplicity." },
            { key: "B", text: "Define the four shared tools in project-scoped .mcp.json using ${REFUND_API_KEY}-style environment variable expansion, and add the experimental tool only to the engineer's personal ~/.claude.json." },
            { key: "C", text: "Define all five tools in the engineer's personal ~/.claude.json so nothing is shared until the engineer is ready." },
            { key: "D", text: "Define all five tools in the project's .mcp.json but mark the experimental one with a \"disabled\": true flag, which still ships the full tool definition to every teammate's client even though it appears inactive by convention alone." }
          ],
          correct: ["B"],
          explanation: "Project-scoped .mcp.json with environment variable expansion shares the approved tools with the whole team without committing secrets, while user-scoped ~/.claude.json keeps the unapproved experimental tool private to one engineer. Hardcoding a key (A) risks secret exposure. Keeping the shared tools private (C) denies the team their benefit. A \"disabled\": true flag (D) is not a real Claude Code configuration mechanism."
        },
        {
          id: "P4-S1-Q10",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A passenger's dispute spans six message turns. Midway through, the conversation is condensed into a short running summary to save tokens. On turn 7, the agent misquotes the compensation amount the passenger was promised, rounding $187.50 down to \"about $180\" and dropping the original order number entirely. What is the most reliable way to prevent this class of error?",
          options: [
            { key: "A", text: "Summarize less frequently, only every 10 turns instead of every turn, trusting that infrequent condensation will still adequately preserve exact dollar amounts, order numbers, and promised actions over time." },
            { key: "B", text: "Ask the model to double-check its own summary for accuracy before responding." },
            { key: "C", text: "Extract exact transactional facts (amounts, order numbers, dates, promised actions) into a persistent \"case facts\" block included verbatim in every prompt, separate from the summarized narrative history." },
            { key: "D", text: "Increase the summarization length limit so summaries can include more narrative detail, assuming that longer summaries alone will reliably preserve exact dollar figures, order numbers, and promised next actions without a dedicated facts block." }
          ],
          correct: ["C"],
          explanation: "A persistent case-facts block preserves exact numbers, dates, and order identifiers outside of lossy prose summarization, directly addressing the risk that progressive summarization condenses precise values into vague language. Summarizing less often (A) only delays the same failure mode. Asking the model to self-check its own lossy summary (B) is unreliable since it has no ground truth to check against. A longer summary (D) is still prose and remains vulnerable to the same rounding and omission risk."
        },
        {
          id: "P4-S1-Q11",
          domain: 5,
          task: "5.1",
          type: "multiple",
          select: 2,
          stem: "Each lookup_order call returns 42 fields (seat maps, fare rules, meal preferences, baggage tags, and more), but only 5 fields (order ID, status, fare paid, cancellation window, refund eligibility) matter for support resolution. In a long dispute, the agent cites a refund-eligibility finding from an early lookup but misses a near-identical finding buried mid-transcript in a later lookup. Which TWO changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Switch to a model with a larger context window so all 42 fields across every lookup fit comfortably without needing any trimming or reordering of the aggregated results." },
            { key: "B", text: "Trim each lookup_order result to the 5 support-relevant fields before it is added to context." },
            { key: "C", text: "Place key findings near the beginning or end of the aggregated context rather than leaving them buried in the middle." },
            { key: "D", text: "Ask the model to \"carefully re-read the entire conversation\" before each response." },
            { key: "E", text: "Summarize all prior lookups into a single narrative paragraph after each new call." }
          ],
          correct: ["B", "C"],
          explanation: "Trimming verbose tool output to only relevant fields reduces irrelevant noise, and positioning key findings near the start or end counteracts the \"lost in the middle\" effect, where models reliably process boundary content but may miss details buried in the middle of long inputs. A bigger context window (A) does not fix retrieval quality from the middle of a long input. A prompt reminder to re-read carefully (D) is an unreliable prompt-only patch. Narrative summarization (E) risks losing exact numeric details, the same failure mode seen with progressive summarization."
        },
        {
          id: "P4-S1-Q12",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "A passenger calls in as \"J. Smith\" to dispute a baggage fee. get_customer returns three passenger records with similar names and no exact match. The agent picks the record with the most recent flight, assuming it is most likely correct, and issues a credit to the wrong passenger. What should the agent have done instead?",
          options: [
            { key: "A", text: "Proceed with the highest-confidence heuristic match (e.g., most recent activity), since waiting for clarification slows resolution." },
            { key: "B", text: "Randomly select one of the three matches and proceed, correcting the record later if the passenger disputes it." },
            { key: "C", text: "Escalate the entire interaction to a human agent whenever get_customer returns more than one match." },
            { key: "D", text: "Ask the passenger for an additional identifying detail, such as a confirmation code or the last four digits of the card used, before proceeding." }
          ],
          correct: ["D"],
          explanation: "When multiple customer matches are returned, requesting an additional identifier resolves the ambiguity reliably without guessing or over-escalating. Choosing a heuristic match (A) is exactly the anti-pattern that caused the misidentified credit. Random selection (B) is clearly unsafe. Escalating every multi-match case to a human (C) overcorrects when a simple clarifying question would resolve it autonomously."
        },
        {
          id: "P4-S1-Q13",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "SkyWing's refund policy explicitly covers mechanical delays, weather cancellations, and overbooking, but says nothing about compensation when a passenger's connecting flight on a partner airline is cancelled by the partner, not SkyWing. A passenger requests compensation for exactly this scenario. What should the agent do?",
          options: [
            { key: "A", text: "Treat the policy's silence as implicit permission to deny the claim, since no explicit rule in the handbook authorizes paying it under these circumstances." },
            { key: "B", text: "Treat the policy's silence as implicit permission to approve a standard refund, since no rule forbids it either." },
            { key: "C", text: "Autonomously approve a partial, discounted compensation amount as a middle-ground resolution, even though no policy section describes this kind of settlement." },
            { key: "D", text: "Escalate to a human agent, since the policy is silent on this specific scenario rather than merely complex." }
          ],
          correct: ["D"],
          explanation: "Policy gaps, where the written policy is silent on the customer's specific request, are an appropriate escalation trigger distinct from mere case complexity. Assuming the silence implies denial (A) or approval (B) both risk acting against policy intent without authorization. Inventing a partial compensation amount (C) fabricates a policy that doesn't exist and carries similar risk."
        },
        {
          id: "P4-S1-Q14",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "Two passengers submit nearly identical baggage-compensation requests. One writes in all caps with multiple exclamation points; the other is calm and polite. The agent escalates the first to a human and resolves the second autonomously, even though both cases are equally straightforward under policy. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a sentiment classifier that only escalates when frustration exceeds a stricter numeric threshold, assuming that more negative language reliably signals cases that genuinely require a policy exception or human escalation." },
            { key: "B", text: "Add explicit escalation criteria to the system prompt, with few-shot examples, defining escalation based on case characteristics (policy exceptions, explicit human requests, inability to progress) rather than tone." },
            { key: "C", text: "Instruct the agent to mirror the customer's tone so angry customers feel heard before resolution." },
            { key: "D", text: "Require all baggage-compensation requests to be escalated regardless of tone, to be safe." }
          ],
          correct: ["B"],
          explanation: "Explicit, case-characteristic-based escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. Sentiment-based escalation (A), even with a stricter threshold, remains an unreliable proxy because sentiment doesn't correlate with case complexity. Mirroring tone (C) doesn't fix the miscalibrated escalation trigger. Escalating every case regardless of tone (D) overcorrects and undermines the first-contact resolution target."
        },
        {
          id: "P4-S1-Q15",
          domain: 5,
          task: "5.2",
          type: "multiple",
          select: 2,
          stem: "Which TWO of the following are appropriate, reliable triggers for escalating a SkyWing support case to a human agent? (Select TWO.)",
          options: [
            { key: "A", text: "The agent's self-reported confidence score for its proposed resolution falls below 7 out of 10." },
            { key: "B", text: "Sentiment analysis detects that the passenger's message tone is negative or frustrated, even when no policy exception or explicit escalation request is actually involved." },
            { key: "C", text: "The conversation has exceeded 5 message turns without resolution." },
            { key: "D", text: "The passenger explicitly asks to speak with a human agent." },
            { key: "E", text: "SkyWing's policy is silent on the specific exception the passenger is requesting (e.g., partner-airline compensation)." }
          ],
          correct: ["D", "E"],
          explanation: "Honoring explicit requests for a human and escalating when policy is silent or ambiguous (not merely complex) are the two evidence-based triggers described in the guide. Self-reported confidence (A) is poorly calibrated and an unreliable complexity proxy. Sentiment-based escalation (B) does not correlate with actual case complexity. An arbitrary turn-count threshold (C) is unrelated to whether the agent can actually resolve the case."
        }
      ]
    },
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P4-S2-Q1",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A Cascade FinTech engineer spent yesterday's session deeply investigating a reconciliation bug across the ledger-sync module, saved under the session name ledger-sync-investigation. Today they want to continue that exact investigation, including all prior tool calls and findings, without re-explaining any of it, and nothing in the module has changed since.",
          options: [
            { key: "A", text: "Start a new session and paste a two-paragraph summary of yesterday's findings, trusting that a condensed narrative recap will substitute adequately for the full prior tool-call history." },
            { key: "B", text: "Re-run the same Grep and Read commands from yesterday to rebuild the same context from scratch, accepting the extra time cost as the price of certainty." },
            { key: "C", text: "Run claude --resume ledger-sync-investigation to continue the named session with its full history intact." },
            { key: "D", text: "Use fork_session to branch a new exploration from yesterday's endpoint." }
          ],
          correct: ["C"],
          explanation: "With nothing changed since yesterday, prior tool results remain valid, so resuming the named session preserves full fidelity more reliably than a hand-written summary (A). Re-running identical commands (B) wastes effort rebuilding context that already exists. fork_session (D) is for branching divergent exploration, not plain continuation of the same investigation."
        },
        {
          id: "P4-S2-Q2",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "The engineer now wants to compare two divergent refactoring strategies for the ledger-sync module -- one an event-sourced rewrite, one an incremental patch -- starting from the same shared analysis of the current code, without either exploration contaminating the other's context.",
          options: [
            { key: "A", text: "Use fork_session to create two independent branches from the shared analysis baseline, one per strategy." },
            { key: "B", text: "Resume the same named session twice in two separate terminal windows." },
            { key: "C", text: "Run both strategies sequentially in a single session, instructing the model to keep them mentally separate." },
            { key: "D", text: "Start two unrelated sessions and re-explain the module from scratch in each, repeating the full shared analysis independently for both strategies." }
          ],
          correct: ["A"],
          explanation: "fork_session is the designed mechanism for divergent exploration from a shared baseline, keeping each branch's context independent. Resuming the same session twice (B) shares the same underlying state rather than branching it. Running both strategies sequentially in one session (C) risks cross-contamination between them. Starting from scratch in two sessions (D) discards the already-completed shared analysis."
        },
        {
          id: "P4-S2-Q3",
          domain: 1,
          task: "1.7",
          type: "multiple",
          select: 2,
          stem: "Since yesterday's investigation, three files in the ledger-sync module were modified by another engineer. The team wants to resume the named session efficiently rather than re-exploring the whole module. Which TWO practices are most effective? (Select TWO.)",
          options: [
            { key: "A", text: "Resume the session and explicitly tell Claude which specific files changed, prompting targeted re-analysis of just those files." },
            { key: "B", text: "Resume the session and let Claude assume all prior findings about those three files are still accurate." },
            { key: "C", text: "Start the resumed investigation by having Claude re-read only the changed files rather than the entire module." },
            { key: "D", text: "Discard the session and perform a full re-exploration of the entire module from scratch, just to be safe." },
            { key: "E", text: "Resume the session and ask Claude to guess which files might have changed based on commit message patterns, rather than being told explicitly which files were touched." }
          ],
          correct: ["A", "C"],
          explanation: "Informing the resumed session exactly which files changed, and targeting re-analysis to just those files, avoids both stale assumptions (B) and wasteful full re-exploration (D). Guessing which files changed from commit patterns (E) is unreliable and unnecessary when the actual changed files are already known."
        },
        {
          id: "P4-S2-Q4",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A new engineer joins Cascade FinTech and clones the payments-sdk repo. Despite the senior team's long-standing convention of always running the full lint suite before any Edit-based refactor, the new engineer's Claude Code sessions never apply this convention, even though it works correctly for everyone else. Investigation shows the convention is documented only in the senior engineer's ~/.claude/CLAUDE.md. What is the root cause and fix?",
          options: [
            { key: "A", text: "The convention is correct, but the new engineer's machine is misconfigured; reinstall Claude Code." },
            { key: "B", text: "Create a .claude/rules/ file with a paths: [\"**/*\"] pattern instead of using CLAUDE.md for this convention." },
            { key: "C", text: "Manually copy the senior engineer's ~/.claude/CLAUDE.md file to the new engineer's home directory." },
            { key: "D", text: "The convention lives in user-level configuration, which is personal and not shared via version control; move it to the project's CLAUDE.md so every team member receives it." }
          ],
          correct: ["D"],
          explanation: "User-level CLAUDE.md applies only to that individual and isn't version-controlled, so it never reaches teammates; moving the convention to project-level configuration fixes the root cause for everyone, including future hires. A rules file matching every path (B) is a heavier mechanism than needed for a universal convention better suited to CLAUDE.md. Manually copying a personal file (C) is a one-off workaround that doesn't scale or persist."
        },
        {
          id: "P4-S2-Q5",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Cascade's monorepo root CLAUDE.md has ballooned past 600 lines, mixing standards for the payments-sdk, an internal CLI tool, and an admin dashboard, making it hard for any single maintainer to keep current. Maintainers want each package's CLAUDE.md to pull in only the standards relevant to their domain, without duplicating shared content.",
          options: [
            { key: "A", text: "Split the file into three unrelated CLAUDE.md files, one per package, each repeating any shared conventions in full, even though the duplicated sections must then be kept manually synchronized across packages." },
            { key: "B", text: "Use the @import syntax in each package's CLAUDE.md to reference the specific shared standards files relevant to that package's maintainers." },
            { key: "C", text: "Move all content into .claude/rules/ files with paths: [\"**/*\"] so every rule always applies everywhere, regardless of which package or maintainer is actually relevant." },
            { key: "D", text: "Keep the single 600-line file but add markdown headers so maintainers can search for relevant sections." }
          ],
          correct: ["B"],
          explanation: "@import keeps CLAUDE.md modular, letting each package reference only the standards files it needs while keeping shared content defined once. Duplicating shared content across three files (A) reintroduces the maintenance burden. Applying every rule everywhere (C) ignores the package-specific scoping the team actually needs. Adding headers to the same monolithic file (D) doesn't reduce its size or the cognitive load of keeping it current."
        },
        {
          id: "P4-S2-Q6",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Cascade wants a /reconcile-check slash command that runs their standard reconciliation-bug triage checklist, available to every engineer the moment they clone the payments-sdk repo, with no manual setup.",
          options: [
            { key: "A", text: "Create it in ~/.claude/commands/ on each engineer's machine." },
            { key: "B", text: "Document the checklist steps inside CLAUDE.md under a \"Reconciliation Checklist\" heading, assuming every engineer will remember to read and manually follow it before each reconciliation run." },
            { key: "C", text: "Create it in .claude/commands/ within the repository so it's version-controlled and available to everyone on clone." },
            { key: "D", text: "Create a .claude/config.json file with a commands array listing the checklist, rather than relying on a dedicated .claude/commands/ directory convention." }
          ],
          correct: ["C"],
          explanation: "Project-scoped commands in .claude/commands/ are version-controlled and shared automatically with every developer who clones the repo. User-scoped commands (A) are per-developer and never shared. Documenting steps in CLAUDE.md (B) provides guidance but not an invokable slash command. A commands array in .claude/config.json (D) is not a real Claude Code mechanism."
        },
        {
          id: "P4-S2-Q7",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Cascade builds a skill that explores the entire payments-sdk codebase to propose a refactor plan, producing a large volume of intermediate exploratory reasoning. They want this exploration isolated from the main conversation, restricted so it can only write files (not execute arbitrary commands), and able to prompt the developer for a target module name when invoked without one. Which SKILL.md frontmatter combination addresses all three needs?",
          options: [
            { key: "A", text: "context: fork for isolation, allowed-tools limited to write operations for restriction, and argument-hint to prompt for the target module." },
            { key: "B", text: "allowed-tools limited to write operations only, with no other frontmatter needed." },
            { key: "C", text: "argument-hint alone, since it automatically isolates execution context and restricts the skill's tool access without needing any other frontmatter configuration." },
            { key: "D", text: "A .claude/config.json entry marking the skill as \"sandboxed\": true." }
          ],
          correct: ["A"],
          explanation: "context: fork isolates verbose skill output into a sub-agent context, allowed-tools restricts the tool surface to prevent destructive actions, and argument-hint prompts for missing parameters -- no single option covers all three needs. \"sandboxed\": true in config.json (D) is not a real Claude Code mechanism."
        },
        {
          id: "P4-S2-Q8",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Cascade's test files (*.test.ts) are scattered across dozens of directories alongside the code they test, and the team wants a single, consistent set of testing conventions applied automatically whenever Claude edits any test file, regardless of its location, without duplicating the convention into every directory's CLAUDE.md.",
          options: [
            { key: "A", text: "Add a subdirectory CLAUDE.md file in every directory that contains a test file." },
            { key: "B", text: "Add the testing convention as a long section inside the root CLAUDE.md and rely on Claude inferring when it's relevant based on surrounding file names and directory structure." },
            { key: "C", text: "Create a slash command /apply-test-conventions that engineers must run manually before editing each test file, relying on every contributor to remember this step every time." },
            { key: "D", text: "Create a .claude/rules/testing.md file with YAML frontmatter paths: [\"**/*.test.ts\"] so the convention loads whenever a matching file is being edited." }
          ],
          correct: ["D"],
          explanation: "Glob-based path rules apply conventions by file pattern regardless of directory, which is ideal for test files spread throughout a codebase. Directory-level CLAUDE.md files (A) don't scale across many scattered directories. Relying on inference from a monolithic file (B) is unreliable. A manual slash command (C) depends on developers remembering to invoke it rather than loading automatically."
        },
        {
          id: "P4-S2-Q9",
          domain: 3,
          task: "3.4",
          type: "multiple",
          select: 2,
          stem: "Cascade is planning two pieces of work this sprint: (1) migrating the payments-sdk's HTTP client library to a new SDK across 50+ call sites with several viable migration strategies, and (2) adding a single null check to one existing validation function based on a clear stack trace. Which TWO statements correctly describe when to use plan mode vs direct execution? (Select TWO.)",
          options: [
            { key: "A", text: "The HTTP client migration should use plan mode first, since it involves large-scale, multi-file changes with multiple valid approaches that benefit from exploration before committing." },
            { key: "B", text: "The null-check fix should use plan mode first too, since any production change carries risk and deserves upfront planning." },
            { key: "C", text: "Both tasks should start in direct execution and only switch to plan mode if unexpected complexity is discovered." },
            { key: "D", text: "The null-check fix is well-scoped and simple, making direct execution appropriate without a separate planning phase." },
            { key: "E", text: "Plan mode should be skipped entirely for the migration since Claude Code can simply make all 50+ changes as it encounters each call site." }
          ],
          correct: ["A", "D"],
          explanation: "Plan mode is designed for complex, multi-file changes with multiple valid approaches like the migration, while simple, well-scoped changes like a single null check are suited to direct execution without unnecessary planning overhead. Treating every change as needing plan mode (B) ignores task complexity. Starting complex work in direct execution (C) risks costly rework once dependencies emerge. Skipping planning for a 50+ site migration (E) ignores the architectural decisions that benefit from upfront exploration."
        },
        {
          id: "P4-S2-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "Cascade asks Claude Code to \"normalize all incoming transaction records to our canonical format.\" Natural-language descriptions of the canonical format produce inconsistent results across different transaction types. What is the most effective way to get consistent transformations?",
          options: [
            { key: "A", text: "Rewrite the instruction with more adjectives emphasizing consistency, e.g. \"format precisely and consistently every time.\"" },
            { key: "B", text: "Provide 2-3 concrete input/output examples showing exact before-and-after transaction records for the transformation." },
            { key: "C", text: "Ask Claude to self-report a confidence score for each transformed record and flag low-confidence ones for manual review, trusting the model's own self-assessment." },
            { key: "D", text: "Split the single instruction into ten more granular prose sentences describing every edge case verbally, hoping sheer repetition alone improves consistency." }
          ],
          correct: ["B"],
          explanation: "Concrete input/output examples are the most effective way to communicate expected transformations when prose is interpreted inconsistently. More adjectives (A) or more verbose prose (D) don't resolve the same underlying ambiguity. Self-reported confidence (C) doesn't improve the transformation's consistency, only flags uncertainty after the fact."
        },
        {
          id: "P4-S2-Q11",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "During a multi-day investigation into Cascade's legacy settlement engine, the agent starts giving inconsistent answers about which classes handle currency rounding, at one point referencing a \"typical pattern\" instead of the specific classes it identified three days earlier. What technique best counteracts this context degradation across the extended session?",
          options: [
            { key: "A", text: "Restart the investigation from scratch each day to avoid accumulating stale context." },
            { key: "B", text: "Increase the maximum context window so more history is retained automatically." },
            { key: "C", text: "Have the agent maintain a scratchpad file recording key findings (e.g., specific class names and rounding logic) and reference it explicitly for subsequent questions." },
            { key: "D", text: "Instruct the agent to always double-check its previous answers before responding." }
          ],
          correct: ["C"],
          explanation: "Scratchpad files persist key findings across context boundaries so the agent can reference concrete facts instead of drifting toward generic \"typical pattern\" language. Restarting daily (A) discards useful progress. A larger context window (B) doesn't fix degraded reasoning quality in extended sessions. Asking the agent to self-check (D) gives it nothing concrete to check against."
        },
        {
          id: "P4-S2-Q12",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "A single exploration session investigating Cascade's settlement engine has run for several hours and accumulated extensive verbose Grep and Read output. The engineer wants to continue working in the same session, preserving the overall thread of investigation, while reducing the token footprint of accumulated discovery output.",
          options: [
            { key: "A", text: "Use /compact to reduce context usage while continuing in the same session." },
            { key: "B", text: "Start an entirely new session and manually copy-paste the last ten messages." },
            { key: "C", text: "Use fork_session to branch into a lighter-weight parallel session." },
            { key: "D", text: "Switch the Grep tool for a custom MCP search tool that returns less data per call going forward." }
          ],
          correct: ["A"],
          explanation: "/compact is designed to reduce context usage within an extended session that has filled with verbose discovery output, while preserving the overall thread of investigation. Starting over and copy-pasting (B) is manual and lossy. fork_session (C) creates a divergent branch rather than compacting the current one. Swapping tools going forward (D) doesn't address the context already accumulated."
        },
        {
          id: "P4-S2-Q13",
          domain: 5,
          task: "5.4",
          type: "multiple",
          select: 2,
          stem: "Cascade's main coding session needs to answer \"where does the settlement engine validate currency codes, and what are all the call sites of that validation function?\" This requires extensive file reading and grepping across dozens of files. Which TWO benefits does delegating this investigation to an Explore subagent provide? (Select TWO.)",
          options: [
            { key: "A", text: "It automatically fixes any bugs found in the currency validation logic without further instruction, eliminating the need for the engineer to review any of the subagent's findings." },
            { key: "B", text: "It guarantees 100% code coverage of every file in the repository." },
            { key: "C", text: "It eliminates the need to ever use Grep or Glob again for future investigations." },
            { key: "D", text: "It isolates the verbose discovery output (file contents, grep matches) in a separate context, returning only a concise summary to the main conversation." },
            { key: "E", text: "It prevents the main session's context window from being exhausted by exploratory noise, preserving capacity for the actual implementation task." }
          ],
          correct: ["D", "E"],
          explanation: "Explore subagents isolate verbose discovery output and return summaries, preserving the main session's context budget for higher-level coordination and implementation. They don't autonomously fix bugs (A), guarantee full coverage (B), or eliminate the ongoing need for Grep and Glob in future investigations (C), which remain core built-in tools."
        },
        {
          id: "P4-S2-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A long Claude Code session investigating a flaky integration test accumulates the full stdout of a test suite rerun 12 times, each run producing 300+ lines of mostly unchanged passing-test output alongside a handful of relevant failure lines. The session starts losing track of which specific assertion is failing. What is the most effective fix?",
          options: [
            { key: "A", text: "Increase max_tokens so the full output from all 12 reruns, including every unchanged passing-test line and timing detail, can be retained without truncation for later side-by-side comparison." },
            { key: "B", text: "Ask the model to summarize the entire 300+ line output into one sentence after each rerun." },
            { key: "C", text: "Reduce the number of reruns to 3 so less total output accumulates." },
            { key: "D", text: "Trim each test-run result to just the failing test names, assertion messages, and relevant stack frames before adding it to context, discarding unchanged passing output." }
          ],
          correct: ["D"],
          explanation: "Trimming tool output to only the information relevant to the task (the failing assertions) prevents context from being dominated by irrelevant repeated passing-test noise. Raising max_tokens (A) just retains more noise. One-sentence summarization (B) risks losing the specific failing-assertion details needed to debug. Reducing reruns (C) doesn't address the proportion of irrelevant content within each run."
        },
        {
          id: "P4-S2-Q15",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "An extended refactor-planning session reviews 9 candidate modules for extraction into a shared library, presented one after another in a single long message. When asked to recommend the best 3 candidates, the agent's recommendations consistently favor modules 1, 2, 8, and 9, essentially ignoring modules 3 through 7, even though two of them are strong candidates per the engineer's own notes.",
          options: [
            { key: "A", text: "Reduce the candidate list to only 3 modules so there's nothing left to miss." },
            { key: "B", text: "Restructure the input with clear section headers for each candidate and explicitly instruct the agent to evaluate and report on every numbered module individually." },
            { key: "C", text: "Ask the agent to re-read the message a second time before answering." },
            { key: "D", text: "Switch to a model with a larger context window so it can \"see\" all 9 modules at once." }
          ],
          correct: ["B"],
          explanation: "This is the lost-in-the-middle effect, where content in the middle of long inputs is more likely to be under-weighted than content near the beginning or end; explicit section headers plus a requirement to evaluate every item individually mitigate this. Shrinking the list (A) avoids rather than solves the underlying evaluation problem. Asking it to \"re-read\" (C) is a prompt-only patch with no structural change. A larger context window (D) does not by itself fix positional attention bias."
        }
      ]
    },
    {
      id: 4,
      title: "Developer Productivity with Claude",
      description: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      questions: [
        {
          id: "P4-S4-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Fathom Utilities' developer-productivity agent is tasked with \"add input validation to the rate-calculation module and run the test suite.\" Its orchestration loop currently treats any assistant response containing readable prose (even alongside a tool_use block) as a signal to stop and present results, causing it to halt mid-task before actually running the tests.",
          options: [
            { key: "A", text: "Parse the assistant's text for phrases like \"I will now run the tests\" to decide whether to continue." },
            { key: "B", text: "Cap the loop at 3 iterations and treat reaching the cap as task completion." },
            { key: "C", text: "Continue the loop whenever stop_reason is \"tool_use\", regardless of whether the assistant response also includes explanatory text, and only stop when stop_reason is \"end_turn\"." },
            { key: "D", text: "Stop the loop whenever the assistant's response includes any natural-language text, since that usually signals an explanation is ready." }
          ],
          correct: ["C"],
          explanation: "The loop should key off stop_reason, not the presence of assistant text, because Claude can include explanatory text alongside a tool_use block while still intending to continue. Parsing natural-language phrases (A) and treating any text as a stop signal (D) are both unreliable heuristics named as anti-patterns in the guide. An arbitrary iteration cap (B) is also an anti-pattern as a primary termination mechanism."
        },
        {
          id: "P4-S4-Q2",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Fathom wants its productivity agent to spawn a focused subagent that investigates how currency rounding is implemented across the legacy billing monolith, while the main agent continues coordinating the broader refactor task.",
          options: [
            { key: "A", text: "Give the main agent's allowedTools configuration the Task tool so it can invoke the subagent, and include the specific investigation question and any relevant prior findings directly in the subagent's prompt." },
            { key: "B", text: "Simply reference the subagent by name in the system prompt; it will automatically inherit the main agent's full conversation history, findings, and any context accumulated so far without further configuration." },
            { key: "C", text: "Grant the subagent access to every tool available to the main agent so it has maximum flexibility to investigate." },
            { key: "D", text: "Let the main agent and subagent share the same context window so no information needs to be explicitly passed, assuming shared memory alone guarantees the subagent sees every relevant prior finding, constraint, and investigation question without being told." }
          ],
          correct: ["A"],
          explanation: "allowedTools must include \"Task\" for the coordinator to spawn subagents, and because subagents don't automatically inherit parent context, relevant findings and the investigation question must be explicitly included in the subagent's prompt. Subagents don't automatically inherit history (B) or share a context window (D) with the parent. Granting a specialized subagent every tool (C) increases decision complexity and risks tool misuse outside its role."
        },
        {
          id: "P4-S4-Q3",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "An engineer asks the productivity agent to \"add comprehensive test coverage to the legacy billing monolith,\" a 200,000-line codebase with no existing test suite and unclear module boundaries.",
          options: [
            { key: "A", text: "Generate a fixed, sequential checklist upfront (one task per file, in alphabetical order) and execute it without deviation." },
            { key: "B", text: "Immediately start writing tests for the first file encountered via Glob and continue file-by-file in whatever order the filesystem happens to return results, without first weighing which areas carry the most proration or rate-calculation risk, until the task budget runs out." },
            { key: "C", text: "Ask the engineer to manually specify every file that needs coverage before starting any work." },
            { key: "D", text: "First map the codebase's structure, identify high-impact and high-risk areas (e.g., rate calculation, proration logic), then build a prioritized plan that adapts as dependencies and gaps are discovered during execution." }
          ],
          correct: ["D"],
          explanation: "Open-ended, exploratory tasks benefit from adaptive decomposition: mapping structure, prioritizing impact, and adjusting the plan as dependencies emerge. A rigid upfront sequence (A) and arbitrary file ordering (B) don't adapt to what's discovered. Requiring the human to fully specify scope in advance (C) defeats the purpose of using the agent for discovery."
        },
        {
          id: "P4-S4-Q4",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "Fathom's engineering lead is deciding how to decompose two tasks: (1) a quarterly compliance review that must check each of 20 billing modules against a fixed list of 8 regulatory rules, and (2) an open-ended request to \"identify and fix dead code across the legacy monolith.\" Which TWO statements correctly match decomposition strategy to task type? (Select TWO.)",
          options: [
            { key: "A", text: "The compliance review is well-suited to prompt chaining: a fixed sequential pass evaluating each module against the same 8 rules, since the sub-tasks and criteria are predictable and identical across modules." },
            { key: "B", text: "Both tasks should use the same fixed decomposition strategy, since mixing strategies in one engineering team creates inconsistency." },
            { key: "C", text: "The dead-code task is also well-suited to prompt chaining, since \"find dead code\" is a single well-defined, repeatable operation per file." },
            { key: "D", text: "The dead-code task benefits from dynamic, adaptive decomposition, since what's discovered in one module (e.g., an unused internal API) may generate new subtasks, such as checking all its callers, not knowable in advance." },
            { key: "E", text: "The compliance review should use dynamic decomposition since regulatory rules may be reinterpreted differently for each module." }
          ],
          correct: ["A", "D"],
          explanation: "Prompt chaining suits predictable, repeatable multi-aspect work like checking fixed rules against each module, while dynamic decomposition suits open-ended investigation where findings generate new subtasks unpredictably, exactly what \"identify dead code\" requires once discovering an unused API prompts checking its callers. Treating dead-code search as a single repeatable operation (C) misses this dependency-discovery aspect. Forcing one strategy for both tasks (B) ignores their different natures. Treating the fixed-rule compliance review as needing dynamic decomposition (E) overcomplicates a predictable, uniform task."
        },
        {
          id: "P4-S4-Q5",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "An engineer spent all of yesterday using the productivity agent to trace how proration is calculated across the legacy billing monolith's seventeen interconnected classes, saved as session proration-trace. This morning, no code has changed, and they want to continue exactly where the trace left off.",
          options: [
            { key: "A", text: "Start fresh and paste a short summary of yesterday's class names." },
            { key: "B", text: "Run claude --resume proration-trace to continue the investigation with its full prior tool-call history intact." },
            { key: "C", text: "Use fork_session to create a new branch, since any new morning's work should start from a clean fork rather than continuing yesterday's named investigation." },
            { key: "D", text: "Re-run Grep across all seventeen classes again to confirm nothing has changed before continuing." }
          ],
          correct: ["B"],
          explanation: "Because no code has changed, prior tool results remain valid, making --resume with the named session the most reliable way to continue with full fidelity. Starting with a vague summary (A) risks losing detail unnecessarily. fork_session (C) is for branching into divergent exploration, not simple continuation. Re-running identical Grep commands (D) is redundant when nothing has changed."
        },
        {
          id: "P4-S4-Q6",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "After resuming the proration-trace session, the engineer learns another developer merged changes to 2 of the 17 classes overnight (ProrationCalculator and BillingCycleAdjuster), refactoring their internal logic.",
          options: [
            { key: "A", text: "Resume the session and proceed with the agent's existing understanding of all 17 classes, since the prior investigation is \"mostly\" still valid and only two files changed overnight." },
            { key: "B", text: "Discard the session entirely and start a full re-trace of all 17 classes from scratch." },
            { key: "C", text: "Resume the session, explicitly tell the agent which two classes changed, and ask it to re-analyze just those two files rather than the entire trace." },
            { key: "D", text: "Resume the session and ask the agent to infer which classes might have changed based on typical merge patterns, rather than being told directly which specific files were actually touched overnight." }
          ],
          correct: ["C"],
          explanation: "Informing a resumed session about specific file changes enables targeted re-analysis of just those files, rather than assuming stale findings remain valid (A) or discarding all prior work for a costly full re-exploration (B). Asking the agent to guess what changed (D) is unreliable when the actual changed files are already known."
        },
        {
          id: "P4-S4-Q7",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Fathom's productivity agent has access to two MCP tools against the ticketing system: get_issue (\"Retrieves issue information.\") and search_issues (\"Retrieves issue details.\"). Logs show the agent frequently calls get_issue with a vague search phrase instead of calling search_issues, failing because get_issue expects an exact issue key.",
          options: [
            { key: "A", text: "Expand each tool's description with its expected input format (e.g., get_issue requires an exact issue key like FATH-482; search_issues accepts free-text queries), example calls, and boundaries distinguishing the two." },
            { key: "B", text: "Merge both tools into a single issue_tool that infers intent from the input format, detecting whether the caller supplied an exact issue key or a free-text search phrase based purely on string shape heuristics alone." },
            { key: "C", text: "Add a pre-processing regex layer that detects issue-key-shaped strings and routes accordingly." },
            { key: "D", text: "Add five few-shot examples to the system prompt showing correct routing for common phrasings." }
          ],
          correct: ["A"],
          explanation: "Minimal, near-identical tool descriptions are the primary cause of unreliable tool selection; clarifying each tool's input format and boundaries is the direct, low-effort first fix. A regex routing layer (C) bypasses the model's natural-language understanding and is over-engineered as a first step. Few-shot examples (D) add token overhead without fixing the root descriptive ambiguity. Merging the tools (B) is a bigger architectural change not warranted as a first fix."
        },
        {
          id: "P4-S4-Q8",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Before the productivity agent can enrich a legacy class's documentation, it must first call extract_symbols to catalog every public method signature in the file; only then should it proceed to generate documentation. Architects want to guarantee that extract_symbols is the very first tool call in this workflow turn, not left to the model's discretion.",
          options: [
            { key: "A", text: "tool_choice: \"auto\", trusting the model to independently judge when extract_symbols should run relative to other available tools" },
            { key: "B", text: "tool_choice: \"any\", forcing some tool call to happen but leaving the specific choice of which tool entirely up to the model's own judgment" },
            { key: "C", text: "A CLAUDE.md note instructing the agent to \"always call extract_symbols first when documenting a file.\"" },
            { key: "D", text: "tool_choice: {\"type\": \"tool\", \"name\": \"extract_symbols\"}" }
          ],
          correct: ["D"],
          explanation: "Forced tool selection guarantees the named tool is called for that turn. \"auto\" (A) leaves the choice entirely to the model. \"any\" (B) guarantees some tool call but not which one. A prompt-based note in CLAUDE.md (C) is probabilistic guidance rather than a deterministic guarantee."
        },
        {
          id: "P4-S4-Q9",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Fathom's whole engineering team relies on a shared internal deployment-status MCP server configured with a credential that must never be committed to source control. One senior engineer also wants to privately experiment with a new, unapproved documentation-generation MCP server before proposing it to the team.",
          options: [
            { key: "A", text: "Add both servers to the project's .mcp.json, with the credential hardcoded directly for simplicity." },
            { key: "B", text: "Configure the shared deployment-status server in project-scoped .mcp.json using ${DEPLOY_API_TOKEN}-style environment variable expansion, and add the experimental documentation server only to the engineer's personal ~/.claude.json." },
            { key: "C", text: "Configure both servers in the engineer's personal ~/.claude.json until the team formally approves the experimental one." },
            { key: "D", text: "Configure both servers in .mcp.json but add an \"experimental\": true flag to the documentation server's entry to hide it from teammates." }
          ],
          correct: ["B"],
          explanation: "Project-scoped .mcp.json with environment variable expansion shares the approved server with the whole team without committing secrets, while user-scoped ~/.claude.json keeps the unapproved experimental server private. Hardcoding credentials (A) risks secret exposure. Keeping the shared server private (C) denies the team its benefit. An \"experimental\" flag (D) is not a real Claude Code configuration mechanism."
        },
        {
          id: "P4-S4-Q10",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Fathom's team needs both (1) standard integration with their existing Jira instance for ticket lookups, and (2) a way for the agent to browse a catalog of the monolith's internal API documentation pages without needing a tool call for every page.",
          options: [
            { key: "A", text: "Build a custom MCP server from scratch for Jira integration, and expose the documentation catalog only through a search_docs tool that requires a specific query per page before any content ever becomes visible." },
            { key: "B", text: "Build custom MCP servers for both Jira and the documentation catalog, since Fathom's needs are unique." },
            { key: "C", text: "Use an existing community MCP server for the standard Jira integration, and expose the documentation catalog as MCP resources so the agent has visibility into available pages without exploratory tool calls." },
            { key: "D", text: "Use a community MCP server for the documentation catalog and build a custom server for Jira, since ticketing is Fathom-specific." }
          ],
          correct: ["C"],
          explanation: "Standard, well-supported integrations like Jira are better served by existing community MCP servers, reserving custom development for genuinely team-specific workflows; exposing a content catalog as MCP resources gives visibility into available documents without requiring exploratory tool calls for every page. Building custom servers for both (B) duplicates effort unnecessarily. Reversing which integration is custom (D) misapplies the principle, since Jira is the standard integration and the internal catalog is the team-specific need. A search-only interface for the catalog (A) still requires a tool call per page."
        },
        {
          id: "P4-S4-Q11",
          domain: 2,
          task: "2.5",
          type: "single",
          select: 1,
          stem: "The productivity agent needs to find every file in the monolith matching the naming pattern *LegacyAdapter.java, and separately needs to find every place the deprecated method calculateLegacyProration() is called.",
          options: [
            { key: "A", text: "Use Glob to find files matching *LegacyAdapter.java by name, and use Grep to search file contents for calls to calculateLegacyProration()." },
            { key: "B", text: "Use Grep for both tasks, since it can search file names and file contents equally well across the entire legacy monolith without distinguishing path patterns from text patterns." },
            { key: "C", text: "Use Glob for both tasks, treating the method name as a file-path pattern." },
            { key: "D", text: "Use Read to open every file in the monolith and manually scan for both patterns, since this guarantees nothing is missed even in a codebase of this size and complexity." }
          ],
          correct: ["A"],
          explanation: "Glob matches file paths by naming pattern, ideal for *LegacyAdapter.java, while Grep searches file contents for text patterns like method calls. Using Grep for file-name matching (B) or Glob for content search (C) misapplies each tool's purpose. Reading every file manually (D) is far less efficient than targeted search tools."
        },
        {
          id: "P4-S4-Q12",
          domain: 2,
          task: "2.5",
          type: "multiple",
          select: 2,
          stem: "While using Edit to rename a deprecated method call inside LegacyBillingProcessor.java, the agent's Edit call fails because the exact text it's trying to replace appears in four nearly identical places in the file, and the match isn't unique. Which TWO are effective ways to handle this? (Select TWO.)",
          options: [
            { key: "A", text: "Retry the exact same Edit call repeatedly until it eventually succeeds." },
            { key: "B", text: "Use Read to load the full file, construct the corrected version in memory with all four occurrences handled, and use Write to save the full updated file." },
            { key: "C", text: "Delete the file and recreate it from scratch using Write with entirely new content." },
            { key: "D", text: "Include more surrounding context (e.g., the enclosing method name and preceding line) in the Edit call's target text so the match becomes unique." },
            { key: "E", text: "Switch to Bash with a sed command that globally replaces the first occurrence found anywhere in the file, regardless of which of the four occurrences actually needs the fix." }
          ],
          correct: ["B", "D"],
          explanation: "When Edit's text match isn't unique, the documented fallback is Read + Write to reliably rewrite the whole file, or widening the matched text with more surrounding context until it uniquely identifies one location. Retrying the identical failing call (A) won't change the outcome. An untargeted sed replacement (E) risks changing the wrong occurrence. Recreating the file from scratch (C) is unnecessary and risks losing unrelated content."
        },
        {
          id: "P4-S4-Q13",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Fathom's productivity-agent repo has a root CLAUDE.md with general conventions, but the billing module's proration logic has subtle domain rules (e.g., mid-cycle rate changes prorate by calendar day, not billing day) that only apply within that one module's directory.",
          options: [
            { key: "A", text: "Add the proration rules to the root CLAUDE.md under a clearly labeled heading." },
            { key: "B", text: "Create a .claude/rules/proration.md file with paths: [\"**/*\"] so it always applies everywhere." },
            { key: "C", text: "Rely on Claude inferring the domain rules from reading the existing proration code each time." },
            { key: "D", text: "Add a subdirectory CLAUDE.md inside the proration module's directory describing its domain-specific rules, which load automatically whenever Claude works within that directory." }
          ],
          correct: ["D"],
          explanation: "Directory-level CLAUDE.md files are the right mechanism for conventions specific to one area of the codebase, loading automatically within that directory. Putting module-specific rules in the root file (A) spreads irrelevant context everywhere. A rules file matching all paths (B) misapplies a directory-specific concern as a global one. Relying on inference (C) is unreliable compared to explicit documented rules."
        },
        {
          id: "P4-S4-Q14",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Fathom wants a workflow where, on demand, an engineer can trigger a deep \"legacy module health report\" (dead code, missing tests, circular dependencies) for a specified package, but this analysis shouldn't run automatically on every session and shouldn't always be loaded into context.",
          options: [
            { key: "A", text: "Document the health-report procedure in CLAUDE.md so it's always available in context." },
            { key: "B", text: "Build this as a skill in .claude/skills/ with an argument-hint for the target package, invoked on demand rather than always loaded." },
            { key: "C", text: "Add it as a mandatory step in every session via a .claude/rules/ file with paths: [\"**/*\"], ensuring the health-report analysis always runs automatically regardless of what the session is actually about." },
            { key: "D", text: "Create a subdirectory CLAUDE.md in every package directory describing how to generate the report." }
          ],
          correct: ["B"],
          explanation: "Skills are for on-demand, task-specific workflows invoked only when needed, unlike CLAUDE.md (A) and rules files (C), which are always-loaded standards that would add unnecessary context overhead for something used occasionally. Duplicating report instructions into every package's CLAUDE.md (D) doesn't match the on-demand, single-skill design intent either."
        },
        {
          id: "P4-S4-Q15",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Fathom's monolith mixes legacy Java (strict null-check conventions, checked exceptions) with a newer Kotlin services layer (different error-handling idioms), and file types are intermixed within the same directories.",
          options: [
            { key: "A", text: "Create a single CLAUDE.md per directory describing both Java and Kotlin conventions together." },
            { key: "B", text: "Rely on the root CLAUDE.md with both languages' conventions documented and trust Claude to apply the right one by inferring the file's language from its extension, surrounding imports, and neighboring file naming patterns." },
            { key: "C", text: "Create two .claude/rules/ files, one with paths: [\"**/*.java\"] and one with paths: [\"**/*.kt\"], so the appropriate language conventions load automatically based on file extension regardless of directory." },
            { key: "D", text: "Ask engineers to manually specify \"use Java conventions\" or \"use Kotlin conventions\" at the start of every relevant session, relying on them to remember this step consistently across the entire monorepo every single time." }
          ],
          correct: ["C"],
          explanation: "Glob-based path rules scoped by file extension apply the correct conventions automatically regardless of directory, essential when file types are intermixed. Per-directory CLAUDE.md files (A) don't help since both languages share directories. Relying on inference from a single combined file (B) is unreliable. Manual specification each session (D) is unnecessary overhead when automatic scoping is available."
        }
      ]
    },
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P4-S6-Q1",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Ashford Commercial Properties' lease-abstraction system flags \"potential issues\" in extracted lease terms, but reviewers complain half the flags are false positives (e.g., flagging standard escalation clauses as anomalies) while real issues (e.g., renewal options missing a documented exercise deadline) get flagged inconsistently. The prompt simply says \"only flag high-confidence issues.\"",
          options: [
            { key: "A", text: "Tell the model to \"be more conservative\" and \"only report very high-confidence issues.\"" },
            { key: "B", text: "Lower the extraction temperature to reduce randomness in which issues get flagged." },
            { key: "C", text: "Replace the vague confidence instruction with explicit categorical criteria defining exactly which conditions constitute a flaggable issue (e.g., flag only if a renewal option exists without a stated exercise deadline) versus expected variation (e.g., standard escalation clauses)." },
            { key: "D", text: "Add a second model pass that simply re-reads the first model's flags and removes any it disagrees with, without providing it any clearer criteria for what separates a true anomaly from expected lease variation such as standard escalation clauses or routine renewal language variants." }
          ],
          correct: ["C"],
          explanation: "Vague confidence-based instructions like \"be conservative\" don't reliably improve precision; explicit categorical criteria defining exactly what counts as an issue versus expected variation directly addresses the root ambiguity. Lowering temperature (B) doesn't fix criteria ambiguity, only output randomness. An undirected second pass with no clearer criteria (D) just repeats the same ambiguous judgment."
        },
        {
          id: "P4-S6-Q2",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "After the false-positive rate on \"ambiguous renewal clause\" flags reached 60%, tenant-ops stopped trusting the lease-abstraction tool's flags altogether, including its otherwise-reliable \"missing termination notice period\" flags. What is the most effective immediate step while the team works on better criteria for renewal-clause detection?",
          options: [
            { key: "A", text: "Temporarily disable flagging for the high-false-positive renewal-clause category while keeping the reliable termination-notice-period category active, to restore trust in accurate categories." },
            { key: "B", text: "Lower the overall confidence threshold across all categories so fewer flags of any kind are shown." },
            { key: "C", text: "Add a disclaimer telling reviewers that \"some flags may be inaccurate\" without changing the flagging logic." },
            { key: "D", text: "Immediately retrain a custom classifier dedicated to renewal-clause anomaly detection before re-enabling any flags." }
          ],
          correct: ["A"],
          explanation: "Temporarily disabling a specific high-false-positive category preserves trust in the categories that work well, rather than degrading all categories equally (B) or adding a disclaimer that doesn't change underlying behavior (C). Jumping to a custom classifier (D) is a heavier investment than trying improved prompt criteria first."
        },
        {
          id: "P4-S6-Q3",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Ashford's extraction prompt instructs the model to \"summarize each lease's key financial terms,\" but output format varies lease to lease: sometimes a paragraph, sometimes a bulleted list, sometimes a table, making downstream parsing unreliable.",
          options: [
            { key: "A", text: "Add stricter prose instructions repeating \"always use the exact same format\" three times in the prompt, assuming repetition alone will make the model's chosen structure consistent across varied lease formats." },
            { key: "B", text: "Post-process every output with a regex-based reformatter that guesses the intended structure." },
            { key: "C", text: "Ask the model to output in whichever format it judges clearest for each individual lease." },
            { key: "D", text: "Provide 2-4 few-shot examples showing the exact desired output structure (e.g., a consistent field order: base rent, escalation rate, CAM charges, term length) applied to varied source lease formats." }
          ],
          correct: ["D"],
          explanation: "Few-shot examples are the most effective way to achieve consistently formatted, actionable output when prose instructions alone produce inconsistent results. Repeating the same prose instruction (A) doesn't resolve the ambiguity. A regex post-processor (B) is fragile against varying unstructured output. Explicitly deferring format choice to the model (C) guarantees continued inconsistency."
        },
        {
          id: "P4-S6-Q4",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Some Ashford leases state square footage as \"12,500 rentable sq ft,\" others as \"approximately 12.5k RSF,\" and a few describe it only in a narrative paragraph without a clear numeric label. The extraction tool frequently fabricates a square footage value for the narrative-only leases instead of returning null.",
          options: [
            { key: "A", text: "Add a stricter instruction: \"never guess values; only extract what is explicitly stated.\"" },
            { key: "B", text: "Add few-shot examples demonstrating extraction from leases with each of the three formats, including an example where square footage is genuinely absent and the correct output is a null value." },
            { key: "C", text: "Require every lease to be manually reformatted into a standard template before extraction, shifting the burden of handling format variation onto reviewers instead of fixing the underlying prompting approach." },
            { key: "D", text: "Remove the square-footage field from the schema entirely since it's too inconsistently formatted across the three source lease templates currently in use, sidestepping the extraction problem rather than solving it." }
          ],
          correct: ["B"],
          explanation: "Few-shot examples showing varied formats, including an explicit example of correct null-handling when the value is genuinely absent, reduce hallucination more reliably than instructions alone. A blanket \"never guess\" instruction (A) has already proven insufficient against inconsistent formats. Manual reformatting (C) defeats the purpose of automated extraction. Removing the field (D) sacrifices needed data rather than fixing the extraction behavior."
        },
        {
          id: "P4-S6-Q5",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Ashford's extraction pipeline moved from free-text JSON generation to tool_use with a strict JSON schema, which eliminated malformed JSON entirely. Reviewers still occasionally find leases where the extracted \"total_annual_rent\" doesn't equal \"base_rent\" plus \"cam_charges\" as stated in the source document.",
          options: [
            { key: "A", text: "This indicates the schema-based tool_use approach failed and should be abandoned in favor of free-text extraction, since neither method can guarantee the extracted totals logically reconcile with each other." },
            { key: "B", text: "The schema needs additional string-length constraints to prevent this kind of error." },
            { key: "C", text: "This is expected: tool_use with JSON schemas guarantees schema-compliant output but doesn't prevent semantic errors like fields that don't logically reconcile, which require separate validation logic." },
            { key: "D", text: "This means the model is hallucinating and needs a larger context window to see the full document." }
          ],
          correct: ["C"],
          explanation: "Structured tool_use output eliminates JSON syntax errors but not semantic errors like incorrect sums or misplaced values; those require explicit validation logic, such as comparing calculated versus stated totals, not schema format rules. Abandoning tool_use (A) would reintroduce syntax errors without fixing semantic ones. String-length constraints (B) don't address arithmetic consistency. A larger context window (D) doesn't address a reconciliation gap."
        },
        {
          id: "P4-S6-Q6",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "Ashford's pipeline processes mixed document types -- some are leases, some are amendments, some are estoppel certificates -- each needing a different extraction schema, and the document type isn't known before processing begins. Separately, for one specific workflow, the team wants to guarantee that extract_metadata always runs before any enrichment tool, regardless of the document. Which TWO tool_choice configurations correctly address these two needs? (Select TWO.)",
          options: [
            { key: "A", text: "tool_choice: \"auto\", for the mixed-document-type case, since it best guarantees structured output regardless of document type without needing to know the schema in advance." },
            { key: "B", text: "tool_choice: \"any\", to guarantee the model calls one of the available extraction tools even though the specific document type (and therefore which schema applies) isn't known in advance." },
            { key: "C", text: "tool_choice: \"any\" for the metadata-first workflow, since it guarantees a tool call generally." },
            { key: "D", text: "tool_choice: \"auto\" for the metadata-first workflow, to leave it to the model's judgment." },
            { key: "E", text: "tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"}, to force that specific tool to run first before enrichment steps." }
          ],
          correct: ["B", "E"],
          explanation: "\"any\" guarantees some tool call without pre-committing to which schema applies, fitting the mixed-document scenario, while forced tool selection guarantees a named tool runs first, fitting the metadata-first requirement. \"auto\" (A) permits the model to return plain text instead of calling any extraction tool, which doesn't guarantee structured output. \"any\" alone (C) doesn't guarantee which specific tool runs first. \"auto\" for the metadata-first case (D) provides no ordering guarantee at all."
        },
        {
          id: "P4-S6-Q7",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "An extracted lease abstraction fails schema validation because \"lease_term_months\" was returned as the string \"60 months\" instead of an integer. What is the most effective next step?",
          options: [
            { key: "A", text: "Send a follow-up request including the original document, the failed extraction, and the specific validation error (lease_term_months must be an integer, got string \"60 months\"), prompting the model to self-correct." },
            { key: "B", text: "Discard the extraction entirely and route the document straight to human review without attempting correction, even though the validation error clearly indicates an easily correctable field-type formatting mismatch." },
            { key: "C", text: "Manually hardcode a regex that strips the word \"months\" from any similar future output." },
            { key: "D", text: "Lower the strictness of the schema so lease_term_months accepts either strings or integers." }
          ],
          correct: ["A"],
          explanation: "Retry-with-error-feedback, appending the specific validation error to a follow-up request, effectively guides the model toward a corrected, properly typed extraction. Discarding and escalating immediately (B) is premature for a simple format error. Ad hoc regex patches (C) don't generalize. Loosening the schema (D) reintroduces the inconsistency downstream systems were meant to be protected from."
        },
        {
          id: "P4-S6-Q8",
          domain: 4,
          task: "4.4",
          type: "multiple",
          select: 2,
          stem: "Ashford's extraction pipeline encounters two validation failures: (1) security_deposit_amount returned as a string with a currency symbol instead of a plain number, and (2) renewal_option_deadline returned as null when the field is required, because the source lease genuinely never mentions a renewal option at all. Which TWO statements correctly describe how to handle these? (Select TWO.)",
          options: [
            { key: "A", text: "The missing renewal-option case (2) is also a good candidate for retry, since enough retries will eventually surface the information even though it was never actually stated in the source document." },
            { key: "B", text: "Both cases should be escalated directly to human review without attempting any retry." },
            { key: "C", text: "The currency-symbol formatting error (1) is a good candidate for retry with validation-error feedback, since it's a structural format mismatch the model can likely self-correct." },
            { key: "D", text: "The missing renewal-option case (2) will not be fixed by retrying, since the information is genuinely absent from the source document; the schema should allow this field to be nullable instead." },
            { key: "E", text: "Both cases indicate the schema is fundamentally broken and needs to be redesigned from scratch." }
          ],
          correct: ["C", "D"],
          explanation: "Retries are effective for format or structural errors the model can correct from feedback, such as the currency-symbol case, but ineffective when required information simply isn't present in the source document, which calls for a nullable field design rather than repeated retries. Expecting retries to conjure absent information (A) misunderstands retry's limits. Escalating the easily-fixable format error to humans by default (B) wastes reviewer capacity. Concluding the schema is \"fundamentally broken\" (E) overreacts to two distinct, well-understood failure types."
        },
        {
          id: "P4-S6-Q9",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Ashford runs two Claude-powered workflows: (1) a same-day \"new lease intake\" extraction that property managers wait on before entering a lease into the active portfolio system, and (2) a weekly portfolio-wide re-validation of all 3,000 historical lease abstractions for drift and errors, reviewed the following Monday morning.",
          options: [
            { key: "A", text: "Use the Message Batches API for both workflows to capture the 50% cost savings everywhere possible." },
            { key: "B", text: "Use the Message Batches API for new lease intake since 50% savings matters most on the highest-volume workflow, and the synchronous API for the weekly re-validation." },
            { key: "C", text: "Use the synchronous API for both workflows to avoid any batch-related latency uncertainty." },
            { key: "D", text: "Use the synchronous API for new lease intake, since property managers are waiting on results, and the Message Batches API for the weekly re-validation, which tolerates up to a 24-hour processing window." }
          ],
          correct: ["D"],
          explanation: "The synchronous API suits latency-sensitive, blocking workflows like same-day intake where users are actively waiting, while the Message Batches API's cost savings are well-suited to the latency-tolerant weekly re-validation. Using batch for both (A) would make the blocking intake workflow unacceptably slow with no SLA guarantee. Reversing the assignment (B) applies batch to the workflow that can't tolerate its latency. Using synchronous for both (C) forfeits meaningful savings on a genuinely latency-tolerant workload."
        },
        {
          id: "P4-S6-Q10",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "A nightly batch submission of 3,000 lease re-validations completes, but 47 requests failed: 30 due to documents exceeding the model's context limit and 17 due to a transient service error during that submission window.",
          options: [
            { key: "A", text: "Resubmit the entire batch of 3,000 documents from scratch to be safe." },
            { key: "B", text: "Identify the 47 failed documents by their custom_id, resubmit the 17 transient failures as-is, and chunk the 30 oversized documents into smaller sections before resubmitting them." },
            { key: "C", text: "Discard the 47 failed documents permanently, since 2,953 successful results out of 3,000 is already a high success rate and reviewing each custom_id individually would take too long." },
            { key: "D", text: "Switch future batches to the synchronous API entirely to avoid any failures going forward." }
          ],
          correct: ["B"],
          explanation: "custom_id fields let the team precisely identify and resubmit only the failed documents, with appropriate fixes matched to each failure cause: chunking oversized documents, simply retrying transient ones. Resubmitting the full batch (A) wastes cost and time on already-successful documents. Discarding failures (C) leaves gaps in portfolio-wide validation coverage. Abandoning batch processing entirely (D) sacrifices meaningful cost savings over a one-time, explainable failure rate."
        },
        {
          id: "P4-S6-Q11",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "The same Claude session that generated a lease's structured abstraction is then asked, in the same conversation, to \"double-check your own extraction for errors.\" It reports high confidence and finds no issues, but a human reviewer later finds an incorrect escalation-rate value.",
          options: [
            { key: "A", text: "Ask the same session to check itself a second time, since it may simply have been rushed the first time and a more careful second read should reliably catch anything missed." },
            { key: "B", text: "Increase the model's extended-thinking budget for the self-review step so it reasons more thoroughly." },
            { key: "C", text: "Have an independent Claude instance, without the generating session's prior reasoning context, review the extraction against the source document." },
            { key: "D", text: "Have the same session re-read the source document a second time before re-confirming its own answer." }
          ],
          correct: ["C"],
          explanation: "A model that generated an extraction retains reasoning context from that generation, making it less likely to question its own decisions within the same session; an independent review instance without that prior context is more effective at catching subtle errors. Repeating self-review (A, D) or adding more thinking budget to the same self-review (B) don't address the core self-review limitation of retained reasoning bias."
        },
        {
          id: "P4-S6-Q12",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "A single extraction pass reviewing all 40 clauses of one unusually complex ground lease produces inconsistent depth: detailed, careful extraction for the first 10 clauses, but increasingly superficial handling of clauses 25-40, including a missed option-to-purchase clause.",
          options: [
            { key: "A", text: "Split the extraction into focused passes over smaller clause groups (e.g., 10 clauses per pass), then run a separate integration pass checking for cross-clause consistency (e.g., option clauses referencing defined terms elsewhere)." },
            { key: "B", text: "Ask the same single pass to \"pay extra attention to clauses near the end of the document.\"" },
            { key: "C", text: "Switch to a model with a larger context window so all 40 clauses get equal attention in one single pass, assuming that more available tokens alone resolves the attention dilution that causes superficial handling of clauses near the end." },
            { key: "D", text: "Run the single pass three times and keep whichever run extracted the most clauses, assuming that whichever pass happens to surface the greatest raw clause count must also be the most complete and accurate one." }
          ],
          correct: ["A"],
          explanation: "Splitting a large review into smaller, focused passes plus a separate integration pass directly addresses attention dilution across a long single pass. A prompt reminder to \"pay attention\" (B) doesn't structurally fix the dilution. A larger context window (C) doesn't by itself guarantee equal depth of attention. Running the same flawed single-pass approach multiple times and picking the one with the most extractions (D) doesn't ensure correctness, only volume."
        },
        {
          id: "P4-S6-Q13",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Ashford's lease-abstraction system reports 97% overall field-level accuracy across the portfolio, and leadership is ready to remove human review entirely for high-confidence extractions. What should the team verify first?",
          options: [
            { key: "A", text: "Confirm the 97% figure is correct by re-running the exact same aggregate accuracy calculation a second time, using that same single portfolio-wide average blended across every document type and every field." },
            { key: "B", text: "Raise the overall accuracy target to 99% before making any changes to the review process." },
            { key: "C", text: "Survey property managers about their general satisfaction with the extraction tool's output, even though subjective satisfaction scores don't reveal which specific document types or fields are driving the underlying accuracy gap." },
            { key: "D", text: "Break down accuracy by document type (e.g., ground leases vs. simple retail leases vs. amendments) and by field, since an aggregate figure can mask significantly worse performance on specific segments." }
          ],
          correct: ["D"],
          explanation: "Aggregate accuracy metrics can mask poor performance on specific document types or fields that a single overall number hides; segment-level analysis is necessary before reducing human review on any subset. Re-running the same aggregate calculation (A) wouldn't reveal segment-level problems. Raising the target number (B) doesn't address whether existing performance is even distributed. A satisfaction survey (C) doesn't measure extraction accuracy directly."
        },
        {
          id: "P4-S6-Q14",
          domain: 5,
          task: "5.5",
          type: "multiple",
          select: 2,
          stem: "To keep measuring real-world error rates after reducing human review of high-confidence extractions, Ashford's team wants an ongoing quality-assurance process. Which TWO practices best support this? (Select TWO.)",
          options: [
            { key: "A", text: "Implement stratified random sampling of high-confidence extractions across document types, routing the sampled subset to human review to measure ongoing error rates and catch novel error patterns." },
            { key: "B", text: "Only review extractions the model itself flags as low-confidence, since high-confidence extractions are unlikely to contain quality issues worth the reviewer's limited time and attention." },
            { key: "C", text: "Calibrate field-level confidence thresholds using a labeled validation set, rather than relying on an uncalibrated raw model confidence score." },
            { key: "D", text: "Stop reviewing the extraction tool's output entirely once the 97% aggregate accuracy figure is established, to save reviewer time." },
            { key: "E", text: "Sample exclusively from the single largest document type by volume, since it represents most of the portfolio." }
          ],
          correct: ["A", "C"],
          explanation: "Stratified random sampling across document types continues to surface error rates and novel error patterns even in the high-confidence population, and calibrating confidence thresholds against labeled validation data ensures the thresholds used for routing are actually meaningful. Reviewing only flagged low-confidence items (B) misses exactly the population stratified sampling is meant to monitor. Halting all review (D) abandons ongoing quality measurement. Sampling only the largest document type (E) ignores accuracy variation across smaller but still important segments."
        },
        {
          id: "P4-S6-Q15",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A 90-page ground lease is passed to the extraction model in a single request. The model correctly extracts the parties, dates, and base rent (appearing on pages 1-3) and the signature and exhibit details (appearing on the final pages), but misses a significant rent-escalation schedule that appears on page 47, buried in the middle of the document.",
          options: [
            { key: "A", text: "Increase max_tokens so the model's response can be longer." },
            { key: "B", text: "Break the document into logical sections with explicit markers, and either process sections individually and merge results, or explicitly instruct the model to systematically extract from every named section rather than relying on unprompted retrieval from the middle of a 90-page input." },
            { key: "C", text: "Move the rent-escalation schedule to the very end of the document before processing, since the model only handles beginning and end content well." },
            { key: "D", text: "Ask the model to summarize the document first, then extract from the summary." }
          ],
          correct: ["B"],
          explanation: "This is the lost-in-the-middle effect, where content in the middle of long inputs is more likely to be missed than content near the beginning or end; structuring the document into explicit sections, or processing in sections, with instructions to systematically cover every section addresses this directly. Increasing max_tokens (A) affects output length, not input retrieval. Manually relocating content within every document (C) isn't a scalable or reliable practice. Summarizing first (D) risks losing exactly the kind of specific numeric schedule detail needed, the same progressive-summarization risk seen elsewhere."
        }
      ]
    }
  ]
});
