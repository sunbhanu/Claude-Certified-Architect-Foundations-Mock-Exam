window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 1,
  title: "Mock Exam 1",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P1-S1-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Northwind Commerce's support agent loop currently terminates whenever Claude's response contains any assistant text, even if the response also includes a tool_use block requesting process_refund. Refunds are sometimes left unprocessed while the agent shows a brief acknowledgment to the customer. What is the correct fix?",
          options: [
            { key: "A", text: "Branch on stop_reason instead of text presence: continue the loop and execute pending tool calls whenever stop_reason is \"tool_use\", and only stop when stop_reason is \"end_turn\"." },
            { key: "B", text: "Hide all assistant text until stop_reason equals \"end_turn\" so customers never see a premature acknowledgment." },
            { key: "C", text: "Raise the maximum iteration count so the loop has more chances to reach process_refund before timing out." },
            { key: "D", text: "Add a keyword check for phrases like \"I will process your refund\" to detect a pending tool call." }
          ],
          correct: ["A"],
          explanation: "stop_reason, not the presence of assistant text, is the authoritative signal for whether the model wants to act again; \"tool_use\" means continue the loop and execute the requested tool, \"end_turn\" means stop. Option B still relies on text-content heuristics rather than fixing the control-flow bug. Option C treats a logic error as a capacity problem and mirrors the iteration-cap anti-pattern. Option D parses natural language to infer loop state, an explicitly unreliable anti-pattern."
        },
        {
          id: "P1-S1-Q2",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "In Northwind Commerce's agentic loop, after lookup_order returns a result, the next request sent to Claude omits the tool result entirely and only resends the original user message. Claude then repeatedly re-calls lookup_order for the same order number. What is the root cause and fix?",
          options: [
            { key: "A", text: "Claude's sampling temperature is too high, causing it to forget prior tool calls, since higher temperature is commonly blamed for inconsistent recall of earlier conversational turns in production deployments; lowering temperature will stop the repeated calls." },
            { key: "B", text: "Tool results must be appended to the conversation history before the next request so Claude can reason over the new information." },
            { key: "C", text: "The agent needs a model with a larger context window so it can remember that lookup_order already ran, since larger context windows are sometimes assumed to compensate for missing conversation history." },
            { key: "D", text: "Add an iteration cap of 3 tool calls so the loop stops repeating lookup_order after a few attempts." }
          ],
          correct: ["B"],
          explanation: "The agentic loop must append tool results to conversation history so Claude can incorporate new information when deciding its next action; omitting them makes the model behave as if the tool was never called. Option A misdiagnoses the bug as a sampling issue. Option C treats a plumbing bug as a capacity problem. Option D masks the symptom with an arbitrary cap instead of fixing the missing context."
        },
        {
          id: "P1-S1-Q3",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "Northwind Commerce requires that every process_refund call be preceded by a verified customer ID from get_customer. A review of 500 transcripts shows the system prompt already states this requirement clearly and emphatically, yet 3% of refunds still occur without a prior get_customer call. What should the team implement to guarantee this never happens?",
          options: [
            { key: "A", text: "Rephrase the system prompt instruction to be even more emphatic about the required order of operations." },
            { key: "B", text: "Add three few-shot examples showing get_customer called before process_refund in the conversation transcript." },
            { key: "C", text: "Add a programmatic prerequisite check that blocks the process_refund tool call until a verified customer ID exists in the session state, independent of what the prompt says." },
            { key: "D", text: "Instruct the agent to self-verify by restating \"I have confirmed the customer's identity\" before calling process_refund, since asking the model to narrate its own compliance is a common lightweight technique teams use to reinforce procedural discipline without new infrastructure." }
          ],
          correct: ["C"],
          explanation: "Prompt instructions, however emphatic, are probabilistic and carry a non-zero failure rate; for operations with financial consequences, deterministic enforcement is required. Options A and B are still prompt-based guidance and don't eliminate the residual failure rate. Option D asks the model to self-report compliance, which provides no actual guarantee."
        },
        {
          id: "P1-S1-Q4",
          domain: 1,
          task: "1.4",
          type: "multiple",
          select: 2,
          stem: "When Northwind Commerce's agent escalates a case to a human agent, the handoff currently just includes the last customer message. Human agents report they have to re-read the entire transcript to understand the case. Which two elements should the structured handoff summary include to let humans act without reading the full transcript? (Select TWO.)",
          options: [
            { key: "A", text: "A concise root-cause analysis of why the issue could not be resolved autonomously" },
            { key: "B", text: "A copy of the raw system prompt used by the agent, since prompt internals are sometimes assumed to help a human reviewer understand agent behavior" },
            { key: "C", text: "The verified customer ID, order details, and a recommended next action" },
            { key: "D", text: "The exact timestamp of every tool call made during the session, since precise timing data is sometimes assumed to help reconstruct what the agent was doing" },
            { key: "E", text: "A self-reported confidence score indicating how certain the agent was about its diagnosis" }
          ],
          correct: ["A", "C"],
          explanation: "Effective handoff protocols compile structured summaries so humans unfamiliar with the transcript can act immediately: customer/order details, root cause, and a recommended action. Option D is low-value noise for a human reader. Option B exposes internal implementation detail that doesn't help resolve the case. Option E is an unreliable self-reported metric, not actionable case information."
        },
        {
          id: "P1-S1-Q5",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Northwind Commerce's MCP tools return timestamps in three different formats: Unix epoch from process_refund, ISO 8601 from lookup_order, and a custom \"MM/DD/YYYY HH:mm\" string from get_customer. Claude occasionally miscalculates how long an order has been open because of this inconsistency. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a system prompt instruction asking Claude to convert all timestamp formats to ISO 8601 before reasoning about them, since clear formatting instructions are often assumed sufficient to standardize how a model interprets varied date representations." },
            { key: "B", text: "Replace all three tools with a single generic get_data tool that returns raw database rows." },
            { key: "C", text: "Train a small classifier to detect which timestamp format each value is in before passing it to Claude, since a dedicated classification step is sometimes assumed to be more reliable than a deterministic parser." },
            { key: "D", text: "Implement a PostToolUse hook that normalizes every tool's timestamp fields to a single consistent format before the result reaches the model." }
          ],
          correct: ["D"],
          explanation: "A PostToolUse hook deterministically transforms heterogeneous data at the point of return, guaranteeing consistency regardless of what the model does with it. Option A relies on the model to correctly perform format conversion every time, which is probabilistic. Option B is an unrelated, overly generic tool-consolidation change that doesn't address normalization. Option C is an over-engineered classifier solving a problem that deterministic parsing already solves."
        },
        {
          id: "P1-S1-Q6",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Company policy caps self-service refunds at $500; anything above requires human approval. Despite this being stated in the system prompt, an audit finds two refunds of $750 and $900 processed autonomously last month. What change provides a guaranteed fix rather than a probabilistic improvement?",
          options: [
            { key: "A", text: "Add a tool-call interception hook that blocks refunds over $500 and redirects to escalate_to_human." },
            { key: "B", text: "Add a few-shot example showing the agent refusing to refund amounts over $500." },
            { key: "C", text: "Strengthen the system prompt with a stronger warning and an example of the $500 limit, since stronger wording is sometimes assumed to close enforcement gaps on its own." },
            { key: "D", text: "Ask the agent to double-check the policy document before every process_refund call, since careful self-review is often assumed to catch amount violations before a refund is submitted." }
          ],
          correct: ["A"],
          explanation: "A hook that intercepts the outgoing tool call enforces the $500 threshold deterministically, regardless of prompt phrasing. Options B, C, and D are all prompt-based approaches that remain probabilistic and have already demonstrably failed for this exact rule."
        },
        {
          id: "P1-S1-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "A customer message reads: \"My order #4821 arrived damaged AND I was double-charged for it.\" Northwind Commerce's agent currently only addresses the damage claim and ignores the billing issue, leading to a follow-up contact. What is the best decomposition strategy?",
          options: [
            { key: "A", text: "Ask the customer to submit two separate tickets, one for each issue, so each can be tracked independently." },
            { key: "B", text: "Decompose the message into its two distinct concerns, investigate each one (order condition and billing) using shared context, then synthesize a single unified response covering both." },
            { key: "C", text: "Always resolve only the first issue mentioned and let a follow-up conversation handle the second." },
            { key: "D", text: "Classify the message with a priority score and only act on the highest-priority concern per turn." }
          ],
          correct: ["B"],
          explanation: "Multi-concern requests should be decomposed into distinct items, investigated in parallel with shared context, and then synthesized into one resolution, which is what the customer expects from a single contact. Option A pushes the decomposition burden onto the customer and increases contact volume. Options C and D arbitrarily address only one concern, directly causing the first-contact resolution failure described."
        },
        {
          id: "P1-S1-Q8",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Northwind Commerce's loop implementation currently checks only whether Claude's latest message is non-empty to decide whether to keep going, rather than inspecting a specific field in the API response. Which field should the loop check, and what are the two values it must distinguish between?",
          options: [
            { key: "A", text: "The \"role\" field; distinguishing \"assistant\" from \"user\"." },
            { key: "B", text: "The \"model\" field; distinguishing which Claude model produced the response." },
            { key: "C", text: "The \"stop_reason\" field; distinguishing \"tool_use\" (continue the loop) from \"end_turn\" (terminate the loop)." },
            { key: "D", text: "The \"content\" field; distinguishing whether it contains a string versus a list." }
          ],
          correct: ["C"],
          explanation: "stop_reason is the dedicated signal for loop control: \"tool_use\" means Claude wants to call a tool and the loop must continue, \"end_turn\" means the turn is complete. The other fields (role, model, content type) do not indicate whether further action is required."
        },
        {
          id: "P1-S1-Q9",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Logs show Northwind Commerce's agent frequently calls get_customer when a shopper asks \"Where is my package for order #88213?\" instead of the intended lookup_order. Both tools' descriptions read \"Retrieves customer information\" and \"Retrieves order details\" respectively, and both accept similar-looking alphanumeric identifiers. What is the most effective first step?",
          options: [
            { key: "A", text: "Merge the two tools into one generic lookup_entity tool that infers which backend to query." },
            { key: "B", text: "Add a pre-processing regex layer that detects order-number patterns and forces the lookup_order tool before the agent runs." },
            { key: "C", text: "Increase the model's reasoning effort setting so it thinks longer before selecting a tool." },
            { key: "D", text: "Expand each tool's description with its expected input format, example queries, and explicit boundaries explaining when to use it versus the other tool." }
          ],
          correct: ["D"],
          explanation: "Tool descriptions are the primary signal LLMs use for tool selection, and minimal, overlapping descriptions are the stated root cause of this kind of misrouting; expanding them is the lowest-effort, highest-leverage fix. Option A is a bigger architectural change that isn't the proportionate first step. Option B bypasses the model's own reasoning with a brittle parsing layer. Option C does not address the actual cause, which is ambiguous tool metadata, not insufficient reasoning time."
        },
        {
          id: "P1-S1-Q10",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "Two Northwind Commerce MCP tools, check_balance and verify_payment_method, have near-identical one-line descriptions and are frequently confused by the agent during billing disputes. Which two actions would most directly resolve this ambiguity? (Select TWO.)",
          options: [
            { key: "A", text: "Add a hidden system message instructing the agent to \"always prefer verify_payment_method for billing disputes.\"" },
            { key: "B", text: "Rewrite both descriptions to state their distinct purposes, expected inputs, and example queries that route to each tool." },
            { key: "C", text: "Lower the temperature parameter used for tool-selection requests to reduce randomness." },
            { key: "D", text: "Rename one of the tools so its name itself signals a different purpose (e.g., check_balance to get_account_balance)." },
            { key: "E", text: "Remove one of the two tools entirely so there is nothing to confuse." }
          ],
          correct: ["B", "D"],
          explanation: "Clear, differentiated descriptions and distinctive names directly address why the model confuses functionally similar tools. Option A is a keyword-sensitive instruction that can create new unintended associations rather than fixing the underlying ambiguity. Option C treats a semantic ambiguity problem as a randomness problem, which it is not. Option E removes needed functionality instead of fixing the description."
        },
        {
          id: "P1-S1-Q11",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "Every Northwind Commerce MCP tool currently returns the same generic message, \"Operation failed,\" whenever something goes wrong, whether the backend timed out, the input was invalid, or a business rule was violated. The agent cannot decide whether to retry, ask the customer for different information, or escalate. What should be changed?",
          options: [
            { key: "A", text: "Return structured error metadata from each tool, including an errorCategory (transient/validation/permission/business) and an isRetryable boolean, alongside a human-readable description." },
            { key: "B", text: "Have the agent always retry twice before giving up on any tool error." },
            { key: "C", text: "Add a generic fallback message telling the customer \"please try again later\" whenever any tool fails." },
            { key: "D", text: "Log all errors centrally and have a human review them once per day, since centralized logging combined with periodic human auditing is a common way teams try to retroactively catch systemic reliability issues." }
          ],
          correct: ["A"],
          explanation: "Structured error metadata gives the agent the information it needs to choose the right recovery action for each error type. Option B applies a single strategy to all error types, which is wrong for validation or business errors. Option C papers over the problem without giving the agent any way to act differently. Option D removes the agent from the recovery loop entirely and introduces unacceptable latency."
        },
        {
          id: "P1-S1-Q12",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "process_refund now returns {\"isError\": true, \"errorCategory\": \"business\", \"isRetryable\": false, \"message\": \"Refund exceeds the $200 promotional item cap\"} when a customer requests a refund above the promo limit. What should the agent do with this response?",
          options: [
            { key: "A", text: "Immediately retry the same process_refund call since isError is true." },
            { key: "B", text: "Explain the policy limit to the customer in plain language without retrying, since isRetryable is false and the failure reflects a business rule rather than a transient problem." },
            { key: "C", text: "Escalate to a human immediately, regardless of the content of the message, because any isError response requires escalation and teams often default to routing every tool failure to human review for safety." },
            { key: "D", text: "Silently return a generic apology to the customer without mentioning the actual reason for the refund limit." }
          ],
          correct: ["B"],
          explanation: "isRetryable: false combined with errorCategory \"business\" tells the agent this is a policy constraint, not a transient fault, so retrying is pointless and the correct response is a clear customer-facing explanation. Option A ignores the explicit isRetryable flag. Option C treats every business error as requiring escalation when many, like this one, can be explained and resolved autonomously. Option D suppresses useful information the customer is entitled to."
        },
        {
          id: "P1-S1-Q13",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Northwind Commerce wants to guarantee that whenever a customer reports a billing discrepancy, the agent calls a tool (any of lookup_order, get_customer, or process_refund) rather than responding with conversational text alone, while still letting the model pick which tool is most appropriate. Which tool_choice configuration achieves this?",
          options: [
            { key: "A", text: "tool_choice: \"auto\"" },
            { key: "B", text: "tool_choice: {\"type\": \"tool\", \"name\": \"lookup_order\"}" },
            { key: "C", text: "tool_choice: \"any\"" },
            { key: "D", text: "Omit tool_choice entirely and rely on the system prompt to insist a tool is used." }
          ],
          correct: ["C"],
          explanation: "tool_choice: \"any\" forces the model to call some tool but leaves the choice of which tool to the model's judgment, matching the requirement exactly. \"auto\" (A) still allows the model to respond with plain text instead of calling a tool. A forced named tool (B) removes the model's ability to select the most appropriate tool. Option D again relies on probabilistic prompt compliance instead of a guaranteed API-level constraint."
        },
        {
          id: "P1-S1-Q14",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "A customer writes: \"This is the third time I've had this issue. I want to speak to a human right now, not a bot.\" The order details indicate a routine, easily resolvable shipping delay. What should the agent do?",
          options: [
            { key: "A", text: "Attempt to resolve the shipping delay first since it is a simple case, and only escalate if the customer repeats the request." },
            { key: "B", text: "Run a sentiment analysis check; since frustration is high, escalate automatically regardless of what the customer actually asked for." },
            { key: "C", text: "Ask the customer to rate their confidence that a human could resolve this faster before deciding whether to escalate." },
            { key: "D", text: "Honor the explicit request for a human agent immediately, without first attempting an autonomous resolution." }
          ],
          correct: ["D"],
          explanation: "An explicit, unambiguous customer request for a human is an escalation trigger on its own, independent of how simple the underlying issue appears. Option A ignores the customer's stated preference. Option B conflates sentiment with the actual escalation trigger (an explicit request), an unreliable proxy for complexity. Option C relies on a self-reported, uncalibrated signal rather than the clear instruction already given by the customer."
        },
        {
          id: "P1-S1-Q15",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "A customer asks the agent to match a competitor's advertised price on an item they already purchased. Northwind Commerce's refund policy only describes price adjustments for the company's own subsequent sales and says nothing about competitor price matching. What should the agent do?",
          options: [
            { key: "A", text: "Escalate to a human agent, since the policy is silent on this specific scenario and the agent should not improvise a resolution for a gap in written policy." },
            { key: "B", text: "Approve the price match automatically, reasoning by analogy from the existing own-site price-adjustment policy, since analogous reasoning is sometimes assumed to safely extend policy to unwritten cases." },
            { key: "C", text: "Deny the request outright, since the specific scenario is not explicitly permitted by policy." },
            { key: "D", text: "Ask the customer to provide a screenshot of the competitor's price and then approve the match itself once the screenshot is verified, since requiring visual proof is often treated as a reasonable safeguard before granting any price adjustment." }
          ],
          correct: ["A"],
          explanation: "When policy is ambiguous or silent on a customer's specific request, escalation is the appropriate action rather than the agent inventing a resolution by analogy. Option B has the agent extend policy beyond what is written, an unauthorized judgment call that should be escalated. Option C assumes denial without authority to make that policy call either. Option D has the agent approve a policy exception it has no authority to grant, even after gathering evidence."
        }
      ]
    },
    {
      id: 2,
      title: "Code Generation with Claude Code",
      description: "You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.",
      questions: [
        {
          id: "P1-S2-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A new engineer joins the Vantage Analytics team and clones the dashboard-service repository. They report that Claude Code doesn't follow the team's established testing conventions (using the vitest fixtures in test/fixtures/), even though a teammate's instance follows them perfectly. Investigation shows the conventions are defined in a CLAUDE.md file. Where is the conventions file most likely located that explains this inconsistency?",
          options: [
            { key: "A", text: "In a .claude/rules/testing.md file with no YAML frontmatter, so it loads inconsistently." },
            { key: "B", text: "In the teammate's personal ~/.claude/CLAUDE.md, a user-level file that is never shared with other developers via version control." },
            { key: "C", text: "In the project's root CLAUDE.md, which should apply identically to every developer who clones the repo and is generally considered best practice for shared team-wide conventions." },
            { key: "D", text: "In a .mcp.json file, which only configures MCP servers and not coding conventions, since some teams assume any JSON config file could define project standards." }
          ],
          correct: ["B"],
          explanation: "User-level CLAUDE.md files (~/.claude/CLAUDE.md) apply only to that individual user and are never distributed via the repository, which exactly explains why only one teammate benefits from them. Option C is the correct location for team-wide application but is ruled out because the new engineer explicitly doesn't see the conventions. Option A misdescribes rules files, which do load based on frontmatter, not randomly. Option D is an unrelated configuration mechanism for MCP servers."
        },
        {
          id: "P1-S2-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Vantage Analytics' root CLAUDE.md has grown to over 2,000 lines, mixing React conventions, API handler patterns, deployment steps, and database modeling rules in one undifferentiated document. Developers report Claude frequently applies the wrong conventions to the wrong file type. What is the recommended way to make this more maintainable while keeping it loaded automatically for every session?",
          options: [
            { key: "A", text: "Delete the unused sections and keep only the most recently edited conventions." },
            { key: "B", text: "Move the entire file into a single skill in .claude/skills/conventions/SKILL.md so it's invoked on demand." },
            { key: "C", text: "Split the content into focused topic-specific files under .claude/rules/ (e.g., react.md, api-conventions.md, deployment.md), each loaded based on relevance." },
            { key: "D", text: "Convert the CLAUDE.md file into a .mcp.json resource so it's exposed as a catalog instead." }
          ],
          correct: ["C"],
          explanation: ".claude/rules/ supports splitting a monolithic CLAUDE.md into focused, topic-specific files, which directly addresses the mixing of unrelated conventions. Option B turns an always-loaded standard into an on-demand skill, the wrong tool for universal conventions that should always apply. Option A loses information rather than organizing it. Option D misuses the resource mechanism, which is meant for exposing content catalogs, not storing coding conventions."
        },
        {
          id: "P1-S2-Q3",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "The payments package at Vantage Analytics has its own strict currency-rounding rules documented in standards/currency.md, and the reporting package has unrelated charting conventions in standards/charts.md. The team wants each package's CLAUDE.md to pull in only the standards relevant to that package's maintainers, without duplicating content. What feature should they use?",
          options: [
            { key: "A", text: "Copy and paste the relevant sections from each standards file directly into every package's CLAUDE.md to keep everything explicit." },
            { key: "B", text: "Create one combined CLAUDE.md at the monorepo root containing every standards file's content." },
            { key: "C", text: "Store all standards in .mcp.json and reference them by environment variable, since environment variables are sometimes assumed to be a universal mechanism for sharing any kind of configuration." },
            { key: "D", text: "Use the @import syntax in each package's CLAUDE.md to selectively include only the relevant standards files." }
          ],
          correct: ["D"],
          explanation: "@import lets each package's CLAUDE.md modularly reference only the external standards files relevant to its own maintainers, avoiding duplication. Option A duplicates content and risks drift when standards change. Option B reintroduces the mixing problem the team is trying to avoid. Option C misuses .mcp.json, which configures MCP servers, not documentation imports."
        },
        {
          id: "P1-S2-Q4",
          domain: 3,
          task: "3.2",
          type: "multiple",
          select: 2,
          stem: "Vantage Analytics wants a /deploy-checklist slash command available to every engineer automatically when they clone the dashboard-service repo, and separately, one senior engineer wants a personal /my-snippets command only for themselves that should never affect teammates. Which two placements achieve this correctly? (Select TWO.)",
          options: [
            { key: "A", text: "Place /deploy-checklist in ~/.claude/commands/ so it ships with the repository." },
            { key: "B", text: "Place /my-snippets in .claude/commands/ inside the project repository so only the senior engineer can see it." },
            { key: "C", text: "Place /deploy-checklist in .claude/commands/ inside the repository so it's version-controlled and shared with every developer." },
            { key: "D", text: "Place both commands in the project's root CLAUDE.md under a \"commands\" heading." },
            { key: "E", text: "Place /my-snippets in the senior engineer's personal ~/.claude/commands/ directory so it stays private." }
          ],
          correct: ["C", "E"],
          explanation: "Project-scoped commands belong in .claude/commands/ within the repo so they are version-controlled and shared with every developer; user-scoped personal commands belong in ~/.claude/commands/, which is never distributed via version control. Option A reverses the scoping, making a team command personal only. Option B also reverses it, placing a personal command where the whole team would see it. Option D describes a mechanism that doesn't exist for defining commands."
        },
        {
          id: "P1-S2-Q5",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Vantage Analytics built a .claude/skills/codebase-audit/SKILL.md skill that performs a verbose, multi-file exploration of the codebase and produces a long intermediate trace before returning a summary. Developers complain that invoking this skill fills up their main conversation with exploration noise, making it hard to continue working afterward. What frontmatter option should be added to the skill?",
          options: [
            { key: "A", text: "context: fork, so the skill runs in an isolated sub-agent context and only its final output returns to the main conversation." },
            { key: "B", text: "argument-hint, so developers are prompted for required parameters." },
            { key: "C", text: "allowed-tools: [], so the skill cannot use any tools at all." },
            { key: "D", text: "A longer description field so Claude better understands when to invoke it." }
          ],
          correct: ["A"],
          explanation: "context: fork runs a skill in an isolated sub-agent context specifically to prevent verbose exploratory output from polluting the main conversation, exactly the reported problem. Option B addresses missing-argument prompts, not context pollution. Option C would break the skill entirely since it needs tools to explore the codebase. Option D improves invocation selection, not the noise problem described."
        },
        {
          id: "P1-S2-Q6",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "One Vantage Analytics engineer wants to use the shared .claude/skills/pr-summary/SKILL.md skill but prefers a different output structure for their own use, without affecting how the skill behaves for the rest of the team. What is the recommended approach?",
          options: [
            { key: "A", text: "Edit the shared SKILL.md file directly in the repository to match their preferred structure." },
            { key: "B", text: "Create a personal variant of the skill under ~/.claude/skills/ with a different name, customized to their preference." },
            { key: "C", text: "Add an allowed-tools restriction to the shared skill that only applies to their own account." },
            { key: "D", text: "Ask the rest of the team to vote on whose preferred output format should become the default, since democratic consensus is sometimes assumed to be the fairest way to resolve personal configuration preferences." }
          ],
          correct: ["B"],
          explanation: "Creating a personal skill variant under ~/.claude/skills/ with a distinct name lets one engineer customize behavior without affecting the team-shared skill. Option A directly changes the shared team resource based on one person's preference. Option C describes a frontmatter option that isn't scoped per-user. Option D is a process solution to what is actually a configuration-scoping question."
        },
        {
          id: "P1-S2-Q7",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Vantage Analytics' Terraform infrastructure files live under infra/aws/, infra/gcp/, and infra/shared/modules/, with no single common parent directory besides the repo root. The team wants Terraform-specific conventions to load only when Claude is editing any .tf file, regardless of which subdirectory it's in. What is the most maintainable configuration?",
          options: [
            { key: "A", text: "Create a CLAUDE.md file in each of infra/aws/, infra/gcp/, and infra/shared/modules/ with duplicated Terraform conventions tailored to each cloud provider's own quirks." },
            { key: "B", text: "Add the Terraform conventions to the root CLAUDE.md so they are always loaded for every file type." },
            { key: "C", text: "Create a .claude/rules/terraform.md file with YAML frontmatter specifying paths: [\"**/*.tf\"] so it loads automatically based on file type rather than directory." },
            { key: "D", text: "Create a custom /terraform-check slash command that developers must remember to run manually before editing .tf files, since manual reminders are sometimes assumed sufficient when automation feels like overkill." }
          ],
          correct: ["C"],
          explanation: "Path-scoped rules with glob patterns load based on file type regardless of directory location, exactly suited to Terraform files scattered across multiple unrelated subdirectories. Option A duplicates content across directories and risks drift. Option B loads Terraform-specific conventions for every file type, adding irrelevant context and token usage. Option D requires manual invocation instead of automatic, conditional loading."
        },
        {
          id: "P1-S2-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "A Vantage Analytics engineer needs to fix a null-pointer exception in a single function, calculateDiscount(), where the stack trace clearly identifies the missing null check. Which approach is most appropriate?",
          options: [
            { key: "A", text: "Enter plan mode to explore the entire discount-calculation module before making any change, since broader exploration is generally assumed to be safer for any production code modification." },
            { key: "B", text: "Spawn an Explore subagent to map the codebase's discount logic before deciding on a fix." },
            { key: "C", text: "Fork the current session to try two different null-check implementations in parallel, since exploring multiple implementations at once is sometimes assumed to save time even for simple fixes." },
            { key: "D", text: "Use direct execution, since this is a simple, well-scoped change with a clear root cause already identified by the stack trace." }
          ],
          correct: ["D"],
          explanation: "Direct execution is appropriate for simple, well-understood changes with a clear scope, exactly matching a single-function null-check fix with a known stack trace. Options A, B, and C all add exploration or planning overhead that isn't warranted when the root cause and scope are already known."
        },
        {
          id: "P1-S2-Q9",
          domain: 3,
          task: "3.4",
          type: "multiple",
          select: 2,
          stem: "Vantage Analytics is evaluating two upcoming engineering tasks: (1) migrating the entire dashboard-service from a REST client library to a new GraphQL client across 45+ files, and (2) adding a single missing \"required\" validation to one existing form field. Which two statements correctly describe the appropriate approach for each task? (Select TWO.)",
          options: [
            { key: "A", text: "The validation fix should use direct execution, since it is a simple, well-scoped change affecting a single field." },
            { key: "B", text: "Both tasks should use plan mode, since any codebase change, however small, is sometimes assumed to benefit from upfront architectural review before starting." },
            { key: "C", text: "The GraphQL migration should use direct execution immediately, since the change is mechanical and some teams assume mechanical replacements never require exploration." },
            { key: "D", text: "The GraphQL migration should use plan mode first, since it involves large-scale, multi-file changes and architectural decisions." },
            { key: "E", text: "The validation fix should use plan mode, since any form-related change carries business risk." }
          ],
          correct: ["A", "D"],
          explanation: "Plan mode is designed for complex, multi-file, architecturally significant work like a 45+ file client migration, while direct execution suits simple, well-scoped changes like a single validation addition. Option B over-applies plan mode to trivial changes, adding unnecessary overhead. Option C ignores that a wide-reaching migration benefits from exploring dependencies and approaches before committing. Option E over-applies plan mode based on perceived business risk rather than actual scope and complexity."
        },
        {
          id: "P1-S2-Q10",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "During a multi-hour session exploring Vantage Analytics' legacy billing module, Claude starts giving inconsistent answers about which class handles invoice generation, at one point referencing \"the typical pattern used in this codebase\" instead of the specific InvoiceGenerator class it had correctly identified an hour earlier. What is the most likely cause and best remedy?",
          options: [
            { key: "A", text: "Context degradation from an extended session; have the agent maintain a scratchpad file recording key findings (e.g., class names, file paths) and reference it for subsequent questions." },
            { key: "B", text: "The model has reached its maximum reasoning capability and needs to be restarted with a completely blank context." },
            { key: "C", text: "The codebase itself is inconsistent, so the agent is correctly reporting that patterns vary across the billing module, which is common in legacy systems maintained by multiple teams over several years." },
            { key: "D", text: "Switch to a model with more aggressive sampling so it commits more confidently to one answer." }
          ],
          correct: ["A"],
          explanation: "Long sessions can degrade into generic, \"typical pattern\" answers instead of citing specific findings; persisting key findings in a scratchpad file counteracts this by giving the agent a reliable reference rather than relying on in-context memory alone. Option B overstates the issue as a hard capability limit rather than a context-management fix. Option C assumes the generic answer is accurate without verifying against the earlier, more specific finding. Option D addresses sampling randomness, not the actual cause."
        },
        {
          id: "P1-S2-Q11",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "A Vantage Analytics engineer is investigating how refunds flow through five different services before starting a large refactor. They want the main agent to preserve high-level coordination without its context window filling up with verbose file-by-file exploration output. What approach best achieves this?",
          options: [
            { key: "A", text: "Have the main agent read every file in all five services directly to build a complete mental model." },
            { key: "B", text: "Spawn subagents to investigate specific questions (e.g., \"trace refund flow dependencies\") while the main agent coordinates at a high level using their summaries." },
            { key: "C", text: "Increase the main agent's context window so it can hold all five services' source code simultaneously." },
            { key: "D", text: "Use /compact repeatedly throughout the exploration to discard irrelevant tool output as it accumulates, since aggressive compaction is often assumed to fully solve context growth on its own." }
          ],
          correct: ["B"],
          explanation: "Delegating specific investigative questions to subagents isolates verbose exploration output in their own context while the main agent preserves high-level coordination using their summaries, exactly matching the stated goal. Option A causes exactly the context-filling problem being avoided. Option C treats a context-management problem as a capacity problem. Option D is a reasonable technique for reducing verbose buildup but doesn't delegate the exploration itself the way subagent spawning does."
        },
        {
          id: "P1-S2-Q12",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "A previous Vantage Analytics investigation session crashed midway through analyzing a monorepo migration, after three different agents had each explored a separate service and written findings to disk. The team wants to resume without re-exploring everything from scratch. What is the best design for crash recovery?",
          options: [
            { key: "A", text: "Simply restart the investigation from the beginning, since prior tool outputs can't be trusted after a crash." },
            { key: "B", text: "Ask each agent to summarize its findings from memory once a new session starts." },
            { key: "C", text: "Have each agent export its findings to a known state location, and have the coordinator load a manifest of these exports on resume, injecting them into the resumed agents' prompts." },
            { key: "D", text: "Rely on the conversation's automatic context carryover, since named session resumption is often believed to restore all agent memory automatically without any explicit export step." }
          ],
          correct: ["C"],
          explanation: "Structured state persistence—each agent exporting findings to a known location, with the coordinator loading a manifest on resume—enables reliable recovery without re-exploration. Option A discards valuable completed work unnecessarily. Option B relies on agent \"memory\" that doesn't persist across a crash. Option D incorrectly assumes automatic memory carryover exists without explicit state export and reinjection."
        },
        {
          id: "P1-S2-Q13",
          domain: 5,
          task: "5.4",
          type: "multiple",
          select: 2,
          stem: "Vantage Analytics' agent is midway through a large exploration of an unfamiliar legacy codebase when the context window starts filling with verbose, line-by-line file dumps from Grep and Read calls. Which two techniques should the team apply to manage context during this session? (Select TWO.)",
          options: [
            { key: "A", text: "Switch to a larger context window model so all the verbose output can remain uncompressed, since more capacity is sometimes assumed to solve any context-management problem." },
            { key: "B", text: "Summarize key findings from the current phase before spawning subagents, injecting only the summary into their context." },
            { key: "C", text: "Disable Grep and Read entirely so no verbose output can ever be generated, even though the tools are needed for the exploration task itself." },
            { key: "D", text: "Ask the agent to repeat its findings aloud every few turns to reinforce memory, since verbal repetition is sometimes assumed to substitute for persisted context." },
            { key: "E", text: "Use /compact to reduce context usage once verbose discovery output has accumulated." }
          ],
          correct: ["B", "E"],
          explanation: "/compact directly reduces accumulated verbose context, and summarizing findings before the next phase prevents unnecessary carryover of raw exploration output into subsequent work. Option A treats the symptom as a capacity problem rather than managing what's kept in context. Option C disables tools the exploration actually needs. Option D is not a real context-management mechanism and doesn't reduce token usage."
        },
        {
          id: "P1-S2-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "While debugging a production incident with Claude Code, an engineer pastes a long log excerpt containing exact error counts, timestamps, and a specific commit SHA. After several more turns of back-and-forth, Claude starts discussing the issue using vague language like \"around that time\" and \"a recent change\" rather than the specific values originally provided. What is the most likely cause?",
          options: [
            { key: "A", text: "The log excerpt was too long to be processed at all and was silently dropped." },
            { key: "B", text: "Claude Code automatically redacts specific numeric values after a few turns for privacy reasons, since many engineers assume aggressive data-loss-prevention filtering runs silently in the background." },
            { key: "C", text: "The engineer needs to resend the log excerpt verbatim every single turn." },
            { key: "D", text: "Progressive summarization or context pressure has condensed the precise numerical values and commit SHA into a vaguer internal representation over the course of the conversation." }
          ],
          correct: ["D"],
          explanation: "Progressive summarization risk is a known effect where exact values (counts, timestamps, specific identifiers) get condensed into vague language as a conversation grows. Options A and B describe behaviors that don't reflect how context processing actually works. Option C is an impractical workaround rather than addressing the underlying summarization risk."
        },
        {
          id: "P1-S2-Q15",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "An engineer is using Claude Code to triage a multi-issue bug report referencing order #5521 ($42.10 overcharge), order #5522 (wrong shipping address), and a flaky test in checkout.spec.ts. As the conversation continues across many turns, Claude starts conflating the two order numbers and their respective amounts. What is the best way to prevent this?",
          options: [
            { key: "A", text: "Extract the key transactional facts (order numbers, amounts, issue types) into a persistent \"facts\" block included in every subsequent prompt." },
            { key: "B", text: "Ask Claude to re-read the entire original bug report from the beginning of the conversation before each response." },
            { key: "C", text: "Reduce the number of issues discussed per session to exactly one, regardless of how the bug report is structured, since limiting scope artificially is sometimes assumed to prevent any cross-issue confusion." },
            { key: "D", text: "Increase the model's temperature so it pays closer attention to numeric details, since higher randomness settings are sometimes assumed to sharpen a model's focus on precise figures." }
          ],
          correct: ["A"],
          explanation: "Persisting extracted transactional facts in a dedicated block outside the summarized history prevents exactly this kind of conflation across a long interaction. Option B is inefficient and still relies on the model correctly parsing the original text again each time rather than fixing the underlying issue. Option C is an impractical constraint unrelated to the actual fix. Option D addresses sampling randomness, not information preservation."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P1-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Meridian Insights' coordinator agent always invokes all four subagents (web search, document analysis, synthesis, report generation) for every query, even for simple factual lookups that a single web search could answer. This adds unnecessary latency and cost. What should the coordinator do instead?",
          options: [
            { key: "A", text: "Remove the document analysis and report generation subagents entirely so only two remain." },
            { key: "B", text: "Analyze each incoming query's complexity and dynamically select which subagents to invoke, rather than always routing through the full fixed pipeline." },
            { key: "C", text: "Run all four subagents in parallel instead of sequentially to reduce the latency impact." },
            { key: "D", text: "Cache the results of the full pipeline so repeated simple queries are faster on subsequent runs, since caching is often assumed to solve latency regardless of why the pipeline runs unnecessarily often." }
          ],
          correct: ["B"],
          explanation: "The coordinator's role includes deciding which subagents to invoke based on query complexity, rather than always running the full pipeline regardless of need. Option A removes capability needed for complex queries. Option C reduces latency but still wastes cost and doesn't address the root inefficiency for simple queries. Option D only helps repeated identical queries, not the general problem of unnecessary subagent invocation."
        },
        {
          id: "P1-S3-Q2",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "For the query \"global supply chain disruptions in 2024,\" Meridian Insights' coordinator decomposed the research into three subtasks: \"semiconductor shortages,\" \"shipping container costs,\" and \"port congestion,\" all specific aspects of one broader category (logistics bottlenecks). The final report completely omits labor strikes, raw material shortages, and geopolitical sanctions, even though sources discuss them. What is the most likely root cause?",
          options: [
            { key: "A", text: "The web search subagent used overly narrow search queries for each of the three assigned subtasks." },
            { key: "B", text: "The synthesis subagent failed to identify coverage gaps in the findings it received." },
            { key: "C", text: "The coordinator's task decomposition was too narrow, assigning subagents to only one category of causes instead of covering the full breadth of the topic." },
            { key: "D", text: "The document analysis subagent filtered out sources unrelated to its assigned subtopic." }
          ],
          correct: ["C"],
          explanation: "The decomposition itself only covers logistics-related causes, omitting entire categories (labor, materials, geopolitics) from the start—each subagent executed its narrow assignment correctly. Options A, B, and D all incorrectly blame downstream agents executing correctly within the scope they were actually given."
        },
        {
          id: "P1-S3-Q3",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Meridian Insights' synthesis agent produces a report draft that is missing coverage of recent regulatory changes, a gap the coordinator notices when comparing the draft against the original research brief. What should the coordinator do?",
          options: [
            { key: "A", text: "Publish the report as-is and note the gap in an internal changelog for future reference." },
            { key: "B", text: "Ask the report generation subagent to invent plausible regulatory context to fill the gap, since generating plausible-sounding filler is sometimes seen as faster than re-running research subagents." },
            { key: "C", text: "Terminate the pipeline and restart the entire research process from scratch." },
            { key: "D", text: "Evaluate the synthesis output for the gap, re-delegate to search and analysis subagents with a targeted regulatory query, and re-invoke synthesis once new findings arrive." }
          ],
          correct: ["D"],
          explanation: "Iterative refinement—evaluating synthesis for gaps, re-delegating with targeted queries, and re-invoking synthesis—is the coordinator's responsibility for closing coverage gaps. Option A ships an incomplete report. Option B fabricates content, undermining the report's credibility. Option C discards all valid existing work for a localized gap."
        },
        {
          id: "P1-S3-Q4",
          domain: 1,
          task: "1.3",
          type: "multiple",
          select: 2,
          stem: "Meridian Insights' coordinator spawns a synthesis subagent to combine findings from the web search and document analysis subagents. The synthesis subagent currently receives only the instruction \"synthesize the research findings\" with no further context, and produces generic, unsupported claims. Which two changes should be made to the coordinator's subagent invocation? (Select TWO.)",
          options: [
            { key: "A", text: "Include the complete findings from the web search and document analysis subagents directly in the synthesis subagent's prompt." },
            { key: "B", text: "Assume the synthesis subagent shares memory with the other subagents since they were all spawned by the same coordinator." },
            { key: "C", text: "Reduce the synthesis subagent's system prompt to a single word, \"synthesize,\" to minimize token usage." },
            { key: "D", text: "Use structured data formats that separate claim content from metadata (source URLs, page numbers) so attribution is preserved." },
            { key: "E", text: "Have the synthesis subagent independently re-run the web searches itself to gather its own context." }
          ],
          correct: ["A", "D"],
          explanation: "Subagents don't automatically inherit parent context or share memory, so findings must be explicitly included in the prompt, and structured formats that separate content from metadata preserve source attribution during synthesis. Option B incorrectly assumes automatic context/memory sharing that doesn't exist. Option C removes necessary context entirely. Option E duplicates work the web search subagent already completed instead of passing its findings along."
        },
        {
          id: "P1-S3-Q5",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Meridian Insights' coordinator agent attempts to spawn a subagent via the Task tool, but the call fails silently and no subagent output is returned. The coordinator's configuration restricts its allowedTools to [\"WebSearch\", \"Read\"]. What is the most likely cause?",
          options: [
            { key: "A", text: "The coordinator's allowedTools list does not include \"Task,\" which is required for a coordinator to invoke subagents at all." },
            { key: "B", text: "The subagent being spawned has an invalid AgentDefinition system prompt." },
            { key: "C", text: "The Task tool has a hard limit of two subagents per coordinator invocation." },
            { key: "D", text: "The coordinator needs to use fork_session instead of the Task tool to spawn subagents." }
          ],
          correct: ["A"],
          explanation: "Spawning subagents requires \"Task\" to be present in the coordinator's allowedTools; without it, Task tool calls cannot succeed. Options B, C, and D describe plausible-sounding but incorrect mechanisms—there's no such subagent count limit, and fork_session serves a different purpose (branching sessions, not subagent spawning)."
        },
        {
          id: "P1-S3-Q6",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Meridian Insights wants to reduce the latency of a research task that currently invokes the web search subagent and the document analysis subagent one after another, each taking roughly 20 seconds, for a total of 40 seconds before synthesis can begin. The two subagents' tasks are independent of each other. What should the coordinator do?",
          options: [
            { key: "A", text: "Merge the two subagents into a single subagent that performs both web search and document analysis sequentially internally." },
            { key: "B", text: "Emit both Task tool calls for the web search and document analysis subagents within the same coordinator response, so they execute in parallel rather than across separate turns." },
            { key: "C", text: "Reduce the time each subagent is allowed to spend searching to 10 seconds each." },
            { key: "D", text: "Cache the results of both subagents from the previous research task and reuse them, since caching previous outputs is often assumed to eliminate repeated latency on every subsequent request regardless of context." }
          ],
          correct: ["B"],
          explanation: "Spawning subagents in parallel by emitting multiple Task tool calls in a single response reduces wall-clock latency for genuinely independent subtasks. Option A keeps the work sequential inside one subagent, providing no latency benefit. Option C arbitrarily shortens work without addressing the sequencing issue. Option D only helps if the new task is identical to a prior one, which isn't stated here."
        },
        {
          id: "P1-S3-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Meridian Insights needs its research system to handle two kinds of requests: standard competitive-landscape reports that always follow the same four-step process (search, analyze, synthesize, report), and open-ended investigative requests like \"find all unresolved risks in our European expansion plan\" where the right subtasks can't be known in advance. Which decomposition strategy fits each case?",
          options: [
            { key: "A", text: "Use dynamic adaptive decomposition for both request types, since flexibility is always preferable." },
            { key: "B", text: "Use fixed sequential prompt chaining for both request types, since consistency is always preferable." },
            { key: "C", text: "Use fixed sequential prompt chaining for the standard competitive-landscape reports, and dynamic adaptive decomposition that generates subtasks based on intermediate findings for the open-ended investigative request." },
            { key: "D", text: "Use fixed sequential prompt chaining for the open-ended request and dynamic decomposition for the standard report, to maximize exploration where it is most needed, since more flexibility is often assumed to help regardless of request type." }
          ],
          correct: ["C"],
          explanation: "Predictable, repeatable multi-aspect workflows suit fixed prompt chaining, while open-ended investigation benefits from adaptive decomposition that reacts to what is discovered along the way—matching each pattern to the task that needs it. Options A and B apply one strategy universally, ignoring that the two request types have fundamentally different structures. Option D reverses the appropriate pairing."
        },
        {
          id: "P1-S3-Q8",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A Meridian Insights analyst has been investigating \"renewable energy policy trends in Southeast Asia\" for two days under a named session. They now want to explore two different report framings—one emphasizing investment risk, one emphasizing regulatory trends—starting from the same accumulated research baseline, without the two framings interfering with each other. What should they do?",
          options: [
            { key: "A", text: "Resume the named session with --resume and manually keep a mental note of which framing is currently active, since manual tracking is sometimes assumed to be enough for just two framings." },
            { key: "B", text: "Start two entirely new sessions from scratch, re-running all research for each framing independently." },
            { key: "C", text: "Ask the agent to hold both framings in mind simultaneously within the same session." },
            { key: "D", text: "Use fork_session to create two independent branches from the shared research baseline, one for each framing." }
          ],
          correct: ["D"],
          explanation: "fork_session is designed exactly for this: creating independent branches from a shared analysis baseline to explore divergent approaches without cross-contamination. Option A risks the two framings bleeding into each other within a single session. Option B discards valuable completed research unnecessarily. Option C creates exactly the risk of conflated, inconsistent output that forking avoids."
        },
        {
          id: "P1-S3-Q9",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "Meridian Insights has two MCP tools available to its document analysis subagent: analyze_content (\"Analyzes content and returns insights\") and analyze_document (\"Analyzes a document and returns insights\"). The subagent frequently calls the wrong one when given a PDF report to review. Which two changes would most directly fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Add a note in the system prompt telling the subagent to \"be careful\" when choosing between the two tools." },
            { key: "B", text: "Rename analyze_content to extract_web_results with a description specific to web page content." },
            { key: "C", text: "Remove analyze_content entirely without providing a replacement, since document analysis is the subagent's primary task." },
            { key: "D", text: "Increase the number of retries allowed when the wrong tool is called." },
            { key: "E", text: "Split the overly generic analyze_document tool into purpose-specific tools such as extract_data_points and summarize_content, each with a defined contract." }
          ],
          correct: ["B", "E"],
          explanation: "Renaming and rewriting descriptions to eliminate functional overlap, and splitting an overly generic tool into purpose-specific tools with clear contracts, both directly address why the model can't reliably distinguish near-identical tools. Option A is vague prompt guidance that doesn't fix the underlying ambiguity. Option C removes capability the subagent may still need for web content. Option D treats the symptom (wrong tool calls) without fixing the cause (ambiguous tool design)."
        },
        {
          id: "P1-S3-Q10",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Meridian Insights' document analysis subagent needs to always call a tool rather than respond with free-form text, but the team wants to preserve the subagent's judgment about which of its three available tools (extract_data_points, summarize_content, verify_claim_against_source) is most appropriate for a given document section. Which tool_choice setting should be used?",
          options: [
            { key: "A", text: "tool_choice: \"any\"" },
            { key: "B", text: "tool_choice: \"auto\"" },
            { key: "C", text: "tool_choice: {\"type\": \"tool\", \"name\": \"extract_data_points\"}" },
            { key: "D", text: "No tool_choice parameter, combined with a system prompt instruction to always use a tool." }
          ],
          correct: ["A"],
          explanation: "\"any\" forces a tool call while still letting the model choose which of its available tools fits best, matching both requirements exactly. \"auto\" (B) still permits a plain-text response instead of a tool call. A forced named tool (C) removes the subagent's ability to choose the most appropriate tool. Option D again relies on probabilistic prompt compliance rather than an API-level guarantee."
        },
        {
          id: "P1-S3-Q11",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Meridian Insights gave its synthesis subagent 18 tools spanning web search, document parsing, citation formatting, and report templating, reasoning that \"more capability is always better.\" Tool selection reliability has since dropped noticeably, with the subagent occasionally calling citation-formatting tools when asked to verify a fact. What is the most effective fix?",
          options: [
            { key: "A", text: "Add more few-shot examples demonstrating correct tool usage for each of the 18 tools." },
            { key: "B", text: "Restrict the synthesis subagent's tool set to only those relevant to its specialized role, providing at most a small number of scoped cross-role tools for high-frequency needs." },
            { key: "C", text: "Increase the model's context window so it can better track all 18 tool descriptions at once." },
            { key: "D", text: "Rename all 18 tools to have more descriptive names without reducing the total count." }
          ],
          correct: ["B"],
          explanation: "Giving an agent access to too many tools degrades selection reliability by increasing decision complexity; scoping each subagent's tools to its role (with limited cross-role tools for high-frequency needs) directly addresses this. Option A adds overhead without reducing the fundamental selection complexity. Option C treats a decision-complexity problem as a capacity problem. Option D improves naming but doesn't reduce the number of competing options the model must choose among."
        },
        {
          id: "P1-S3-Q12",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Meridian Insights wants to integrate a company-wide Jira MCP server used by every team, including research, engineering, and support. One engineer proposes building a custom Jira MCP server from scratch tailored to the research team's exact workflow. What is the recommended approach?",
          options: [
            { key: "A", text: "Always build a custom MCP server for any integration to guarantee full control over its behavior." },
            { key: "B", text: "Avoid MCP entirely for Jira integration and use direct REST API calls from within the agent's code instead." },
            { key: "C", text: "Prefer an existing community MCP server for a standard integration like Jira, reserving custom server development for genuinely team-specific workflows that existing servers don't support." },
            { key: "D", text: "Build the custom server, but place its configuration in ~/.claude.json so it's available to the whole company, since many teams assume a single shared config file can act as a global company-wide registry." }
          ],
          correct: ["C"],
          explanation: "Standard integrations like Jira should use existing community MCP servers rather than reinventing them; custom servers are best reserved for workflows that are genuinely team-specific. Option A wastes effort rebuilding something that already exists for a standard use case. Option B abandons the MCP abstraction without justification. Option D also misunderstands scoping—~/.claude.json is user-scoped, not company-wide."
        },
        {
          id: "P1-S3-Q13",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Meridian Insights' research team shares a .mcp.json file in their repository configuring a document-store MCP server, with the server's API token referenced as ${DOCSTORE_API_TOKEN}. A new team member asks why the actual token value isn't visible anywhere in the committed file. What is the correct explanation?",
          options: [
            { key: "A", text: "The token is encrypted automatically by Claude Code whenever .mcp.json is committed to version control." },
            { key: "B", text: "The token was accidentally omitted and the configuration is broken until someone adds it directly to the file." },
            { key: "C", text: ".mcp.json only supports server names and URLs; API tokens must be configured through a separate undocumented mechanism." },
            { key: "D", text: ".mcp.json supports environment variable expansion (e.g., ${DOCSTORE_API_TOKEN}), letting the team share the server configuration via version control while each developer supplies the actual secret through their own environment." }
          ],
          correct: ["D"],
          explanation: "Environment variable expansion in .mcp.json is the documented mechanism for referencing credentials without committing secrets, letting the configuration itself be safely version-controlled. Option A describes a feature that doesn't exist. Option B misreads intentional environment-variable usage as a mistake. Option C incorrectly claims tokens aren't supported at all."
        },
        {
          id: "P1-S3-Q14",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "Meridian Insights' web search tool returns {\"isError\": false, \"results\": []} when a search for a very narrow, newly coined industry term returns no matching articles. The coordinator currently treats every response with an empty results array the same way it treats a timeout: as a failure requiring retry with a different subagent. What is the problem with this behavior?",
          options: [
            { key: "A", text: "The coordinator is failing to distinguish a valid empty result from an actual access failure like a timeout, each of which needs a different recovery decision." },
            { key: "B", text: "The web search subagent should never be allowed to return an empty results array under any circumstances." },
            { key: "C", text: "isError: false responses should always be retried regardless of content, to maximize the chance of finding results, since retrying on any uncertain signal is sometimes assumed to be a safe default." },
            { key: "D", text: "The coordinator should escalate to a human whenever any search returns fewer than five results, since conservative human-in-the-loop thresholds are often assumed to reduce the risk of missed information." }
          ],
          correct: ["A"],
          explanation: "A successful query that legitimately found nothing is different from an access failure, and conflating the two leads to wasted retries on queries that will never return different results. Option B is an unreasonable constraint given legitimately narrow topics exist. Option C ignores that isError: false already signals a successful (if empty) query. Option D introduces an arbitrary, unrelated escalation threshold."
        },
        {
          id: "P1-S3-Q15",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "Meridian Insights' document analysis subagent encounters a corrupted PDF partway through a batch of twelve source documents. It currently stops all document analysis for the entire task and reports a single generic failure to the coordinator, discarding the eleven documents it had already successfully analyzed. What is the recommended behavior instead?",
          options: [
            { key: "A", text: "Keep the current behavior, since any single document failure indicates the whole batch is untrustworthy." },
            { key: "B", text: "Have the subagent treat the corrupted document as an isolated failure, continue analyzing the rest, and report to the coordinator only the unresolved failure plus the partial results already obtained." },
            { key: "C", text: "Silently skip the corrupted document and report full success with no mention of the gap, since eleven out of twelve is a high completion rate that many teams would consider acceptable without further disclosure." },
            { key: "D", text: "Immediately escalate the entire task to a human reviewer the moment any single document fails to parse." }
          ],
          correct: ["B"],
          explanation: "Subagents should implement local recovery for isolated failures and propagate only the unresolved issue along with partial results and context about what was attempted, enabling the coordinator to make an informed decision. Option A discards valid, already-completed work unnecessarily. Option C silently suppresses the error, hiding a real gap from the coordinator. Option D escalates to a human for an issue the system itself can report and route appropriately without human intervention."
        }
      ]
    },
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P1-S5-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Brightline Payments' CI pipeline runs claude \"Review this PR for security issues\" as part of every pull request build. The build step hangs indefinitely and the job is eventually killed by a timeout. Logs show Claude Code is waiting for interactive terminal input. What is the correct fix?",
          options: [
            { key: "A", text: "Set an environment variable CLAUDE_NONINTERACTIVE=1 before invoking the command." },
            { key: "B", text: "Pipe /dev/null into the command as stdin without changing any flags." },
            { key: "C", text: "Add the -p (or --print) flag: claude -p \"Review this PR for security issues\", which runs Claude Code in non-interactive mode, printing the result and exiting." },
            { key: "D", text: "Add a --ci flag to signal that the command is running inside a pipeline." }
          ],
          correct: ["C"],
          explanation: "The -p/--print flag is the documented way to run Claude Code non-interactively: it processes the prompt, prints the result, and exits without waiting for terminal input, exactly what a CI job needs. Options A and D reference flags/environment variables that don't exist in Claude Code. Option B is a workaround that doesn't address the actual interactive-mode behavior being invoked."
        },
        {
          id: "P1-S5-Q2",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Brightline Payments wants ReviewBot's CI findings to be posted as individual inline comments on the pull request, parsed programmatically by a script rather than read as free-form prose. Which combination of CLI flags should the pipeline use?",
          options: [
            { key: "A", text: "-p alone, parsing the printed text output with a custom regex script." },
            { key: "B", text: "--verbose, to get more detail in the printed output for the parsing script to use." },
            { key: "C", text: "--output-format text, since text output is easiest for scripts to parse line by line, especially when the script only needs to extract a handful of known keywords." },
            { key: "D", text: "-p --output-format json, optionally combined with --json-schema to enforce a specific structure, producing machine-parseable output." }
          ],
          correct: ["D"],
          explanation: "--output-format json (optionally paired with --json-schema) produces structured, machine-parseable output designed for exactly this kind of automated downstream processing. Options A and C rely on parsing unstructured or semi-structured prose, which is brittle. Option B adds more text detail but doesn't change the output's structure for parsing."
        },
        {
          id: "P1-S5-Q3",
          domain: 3,
          task: "3.6",
          type: "multiple",
          select: 2,
          stem: "Brightline Payments is setting up a brand-new CI review job using Claude Code. Which two practices are correctly recommended for this integration? (Select TWO.)",
          options: [
            { key: "A", text: "Run Claude Code with the -p flag so the job never blocks waiting for interactive input." },
            { key: "B", text: "Store the entire CLAUDE.md content as a CLI argument passed inline on every invocation instead of as a file in the repository." },
            { key: "C", text: "Document testing standards, fixture conventions, and review criteria in CLAUDE.md so CI-invoked Claude Code has the same context a developer would." },
            { key: "D", text: "Use the same conversation session that generated a code change to also review that change, since it already has full context and reusing it seems efficient." },
            { key: "E", text: "Disable --output-format json in CI since pipelines should only consume plain English summaries." }
          ],
          correct: ["A", "C"],
          explanation: "Running with -p avoids pipeline hangs, and documenting standards in CLAUDE.md gives CI-invoked Claude Code the same context a human reviewer would use. Option B misunderstands how CLAUDE.md is meant to be read, as a repository file rather than an inline argument. Option D is an anti-pattern: the same session that generated code is less effective at reviewing its own changes than an independent instance. Option E discourages structured output that pipelines actually benefit from for automated processing."
        },
        {
          id: "P1-S5-Q4",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "ReviewBot's system prompt currently instructs it to \"only report high-confidence findings and be conservative about what you flag.\" Despite this, false positive rates remain high across multiple categories, and developers have started ignoring its comments entirely. What is the most effective fix?",
          options: [
            { key: "A", text: "Replace the vague conservativeness instruction with specific, categorical criteria defining exactly which issues to report versus which to skip." },
            { key: "B", text: "Keep the current instruction but add the word \"extremely\" before \"conservative\" to strengthen it." },
            { key: "C", text: "Ask the model to self-report a confidence percentage for each finding and only surface findings above 90%, since self-reported confidence scores are often treated as a reliable proxy for true accuracy." },
            { key: "D", text: "Reduce the number of files ReviewBot reviews per PR so it has more attention per file, since spreading attention more thinly across fewer files is sometimes assumed to improve review quality overall." }
          ],
          correct: ["A"],
          explanation: "Vague instructions like \"be conservative\" don't improve precision as effectively as explicit, categorical criteria that define exactly what qualifies as reportable. Option B intensifies the same ineffective vague wording. Option C relies on self-reported confidence, a poorly calibrated proxy for true accuracy. Option D doesn't address the actual cause, which is unclear review criteria rather than insufficient attention per file."
        },
        {
          id: "P1-S5-Q5",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Developers at Brightline Payments have stopped trusting ReviewBot's \"code style\" findings because roughly 70% are false positives, even though its \"security\" and \"correctness\" findings remain highly accurate and well-regarded. What is the recommended near-term action while the prompt for the problematic category is improved?",
          options: [
            { key: "A", text: "Shut down ReviewBot entirely until all categories reach the same accuracy level." },
            { key: "B", text: "Temporarily disable the high false-positive \"code style\" category while keeping the accurate \"security\" and \"correctness\" categories active." },
            { key: "C", text: "Keep all categories enabled and let developers individually decide which comments to ignore, since trusting individual judgment is sometimes assumed to substitute for fixing the false-positive rate." },
            { key: "D", text: "Merge \"code style\" findings into the \"correctness\" category so they're reviewed alongside more trusted findings, since consolidating categories is sometimes assumed to average out accuracy across findings." }
          ],
          correct: ["B"],
          explanation: "Disabling a specific high false-positive category while preserving accurate ones directly limits the damage to developer trust without sacrificing categories that are already working well. Option A discards valuable, accurate functionality unnecessarily. Option C does nothing to address the stated trust problem. Option D doesn't fix the false-positive rate and risks dragging down trust in the accurate category by association."
        },
        {
          id: "P1-S5-Q6",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Brightline Payments wants ReviewBot to classify findings into \"critical,\" \"major,\" and \"minor\" severity levels, but different reviewers currently disagree about what counts as \"major\" versus \"minor\" for the same finding. What should be added to the prompt to achieve consistent classification?",
          options: [
            { key: "A", text: "A single sentence stating \"use your best judgment to assign severity.\"" },
            { key: "B", text: "A numeric scoring formula requiring ReviewBot to multiply impact by likelihood without further guidance, since numeric formulas are sometimes assumed to produce consistency even without clearly defined inputs." },
            { key: "C", text: "Explicit severity criteria accompanied by concrete code examples illustrating what qualifies at each severity level." },
            { key: "D", text: "An instruction to always default to \"minor\" unless the issue is obviously a security vulnerability, since defaulting to a low severity is sometimes assumed to minimize the risk of over-alarming developers." }
          ],
          correct: ["C"],
          explanation: "Defining explicit criteria with concrete examples for each severity level is the approach that achieves consistent classification across cases. Option A relies on unconstrained judgment, which is exactly what produces the inconsistency described. Option B introduces a formula without defining the inputs clearly enough to be consistent. Option D arbitrarily biases classification rather than defining criteria."
        },
        {
          id: "P1-S5-Q7",
          domain: 4,
          task: "4.2",
          type: "multiple",
          select: 2,
          stem: "ReviewBot's output format is inconsistent: sometimes it reports \"location, issue, severity, suggested fix,\" and other times it omits the suggested fix or merges fields together, even though the system prompt describes the desired format in prose. Which two techniques would most reliably fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Rewrite the prose description of the format using more emphatic language (\"ALWAYS include all four fields\")." },
            { key: "B", text: "Enforce the output via tool use with a JSON schema marking all four fields required, eliminating prose formatting entirely." },
            { key: "C", text: "Ask the model to proofread its own output before returning it, checking for missing fields." },
            { key: "D", text: "Provide 2-4 few-shot examples showing the exact desired output format for representative findings." },
            { key: "E", text: "Increase the maximum output token limit so ReviewBot has more room to fit all four fields." }
          ],
          correct: ["B", "D"],
          explanation: "Few-shot examples demonstrate the exact desired format directly rather than describing it, and tool use with a JSON schema structurally guarantees required fields are present, eliminating the inconsistency at its source. Option A only intensifies prose instructions, which have already proven unreliable. Option C relies on the same model's own unreliable self-checking rather than a structural guarantee. Option E addresses token capacity, not formatting compliance."
        },
        {
          id: "P1-S5-Q8",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "ReviewBot needs to distinguish between acceptable repeated code patterns that are intentional within Brightline Payments' codebase (e.g., a specific retry-wrapper idiom used throughout the payments module) and genuinely duplicated logic that should be flagged. A prose instruction describing \"intentional idioms\" produces inconsistent results. What is the most effective fix?",
          options: [
            { key: "A", text: "Instruct ReviewBot to never flag any repeated code pattern, to avoid any risk of a false positive, since eliminating a whole category of findings is sometimes assumed to be an acceptable tradeoff." },
            { key: "B", text: "Add a stricter prose rule defining \"idiom\" more precisely using additional adjectives." },
            { key: "C", text: "Have a separate classifier model pre-scan the codebase to tag which patterns are \"idioms\" before ReviewBot runs, since dedicating a separate model to this subtask is sometimes assumed to be more reliable than prompting alone." },
            { key: "D", text: "Provide few-shot examples contrasting the acceptable idiom with genuine duplication, so the model can generalize to similar but unseen cases." }
          ],
          correct: ["D"],
          explanation: "Few-shot examples that contrast acceptable patterns with genuine issues let the model generalize the distinction to novel but similar cases, which prose alone struggles to convey precisely. Option A eliminates a useful finding category entirely. Option B repeats the ineffective prose-only approach. Option C is an over-engineered solution requiring separate infrastructure for a problem few-shot examples can solve directly in the prompt."
        },
        {
          id: "P1-S5-Q9",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Brightline Payments wants ReviewBot's findings to always be valid JSON with the exact required fields, with zero tolerance for JSON syntax errors that currently occasionally break the posting script. What approach eliminates this class of error?",
          options: [
            { key: "A", text: "Define an extraction tool with a JSON schema as its input parameters and have ReviewBot return its findings via a tool_use call rather than free-form text, since schema-constrained tool use guarantees syntactically valid, schema-compliant output." },
            { key: "B", text: "Ask ReviewBot to double-check its own JSON output for syntax errors before returning it." },
            { key: "C", text: "Add a post-processing regular expression that attempts to repair malformed JSON after the fact." },
            { key: "D", text: "Instruct ReviewBot in the system prompt to \"always return valid JSON\" with an example of valid JSON." }
          ],
          correct: ["A"],
          explanation: "Tool use with a JSON schema guarantees schema-compliant structured output at the API level, eliminating JSON syntax errors by construction. Option B relies on the same unreliable model to self-check its own formatting mistakes. Option C is a fragile workaround for a problem that can be eliminated structurally instead. Option D is prose-based instruction, the exact approach already producing occasional syntax errors."
        },
        {
          id: "P1-S5-Q10",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "ReviewBot's extraction tool schema currently marks a suggested_fix field as required for every finding, but roughly 15% of findings (e.g., \"this function's purpose is unclear without more context\") don't have a concrete suggested fix. ReviewBot has started fabricating generic, unhelpful suggested fixes just to satisfy the schema. What should be changed?",
          options: [
            { key: "A", text: "Remove the suggested_fix field from the schema entirely, since not every finding needs one." },
            { key: "B", text: "Make the suggested_fix field optional (nullable) in the schema, so ReviewBot can omit it when no concrete fix exists rather than fabricating one to satisfy a required field." },
            { key: "C", text: "Keep the field required, but add a system prompt instruction telling ReviewBot not to make things up." },
            { key: "D", text: "Require a minimum character count for suggested_fix so ReviewBot is forced to write something substantive." }
          ],
          correct: ["B"],
          explanation: "Making a field optional/nullable prevents the model from fabricating values just to satisfy a required schema field when the information genuinely doesn't exist. Option A removes useful information for the 85% of findings that do have concrete fixes. Option C relies on prompt instruction to override a structural schema constraint, which is unreliable. Option D would make fabrication worse by demanding more content regardless of whether a real fix exists."
        },
        {
          id: "P1-S5-Q11",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "Brightline Payments' extraction tool for ReviewBot findings includes a category enum field with values \"security,\" \"correctness,\" \"performance,\" and \"style.\" Reviewers occasionally see findings that don't cleanly fit any of these four categories, and ReviewBot currently forces them into the closest-sounding category, producing confusing labels. Which two schema design changes would best address this? (Select TWO.)",
          options: [
            { key: "A", text: "Remove the enum constraint entirely and let category be any free-text string." },
            { key: "B", text: "Keep exactly four enum values and instruct ReviewBot to always choose the \"closest\" one, no matter how approximate." },
            { key: "C", text: "Add an \"other\" enum value paired with a free-text category_detail field for findings that don't fit predefined categories." },
            { key: "D", text: "Add more enum values indefinitely every time a new edge case is discovered, growing the enum without bound." },
            { key: "E", text: "Add an \"unclear\" enum value for genuinely ambiguous cases where the category can't be confidently determined." }
          ],
          correct: ["C", "E"],
          explanation: "An \"other\" value with a detail string handles extensible categorization without losing information, and an \"unclear\" value explicitly represents ambiguous cases rather than forcing an inaccurate category. Option A loses the benefit of enum-based consistency and downstream filtering entirely. Option D creates unbounded schema growth with no graceful fallback for the next unanticipated case. Option B keeps the exact problem described: forcing inaccurate labels onto findings that don't actually fit."
        },
        {
          id: "P1-S5-Q12",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "ReviewBot's test-generation feature occasionally produces a test file that fails Brightline Payments' own test-runner validation step due to a malformed assertion syntax. The team wants ReviewBot to self-correct automatically rather than requiring a human to fix the syntax manually. What is the most effective approach?",
          options: [
            { key: "A", text: "Discard the failed test file and skip test generation for that function entirely." },
            { key: "B", text: "Re-run the exact same generation prompt a second time and hope for a different, valid result." },
            { key: "C", text: "Send a follow-up request including the original function, the failed test file, and the validation error, asking ReviewBot to fix the assertion syntax." },
            { key: "D", text: "Switch to a completely different model for test generation going forward, since swapping models is sometimes assumed to resolve recurring generation quirks without further investigation." }
          ],
          correct: ["C"],
          explanation: "Retry-with-error-feedback—including the original context, the failed output, and the specific validation error—gives the model what it needs to self-correct effectively. Option A loses useful (if flawed) generated work and test coverage. Option B is an unguided retry with no feedback about what actually went wrong. Option D is an overreaction to what is a fixable, well-understood formatting issue."
        },
        {
          id: "P1-S5-Q13",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "ReviewBot flags a finding that a function's inline comment claims it \"validates input before processing,\" but the referenced external validation module (not included in the PR diff ReviewBot was given) is what actually performs that validation. The retry-with-error-feedback loop repeatedly fails to resolve this finding correctly. What is the correct conclusion?",
          options: [
            { key: "A", text: "The retry loop is broken and needs to be run more times with higher temperature." },
            { key: "B", text: "ReviewBot's JSON schema must be missing a required field, which is why retries keep failing." },
            { key: "C", text: "The follow-up prompt needs more few-shot examples of correctly formatted findings, since adding more examples is often assumed to help a model infer missing contextual information." },
            { key: "D", text: "Retries are ineffective here because the needed information is simply absent from what ReviewBot was given, not a format or structural error that feedback can fix." }
          ],
          correct: ["D"],
          explanation: "Retry-with-feedback only helps when the error is a format or structural issue; when the required information genuinely isn't available to the model, no amount of retrying resolves it, which is the case for an external module not included in the diff. Options A, B, and C all assume the problem is retry mechanics or formatting rather than missing source information."
        },
        {
          id: "P1-S5-Q14",
          domain: 4,
          task: "4.5",
          type: "multiple",
          select: 2,
          stem: "Brightline Payments wants to move two existing synchronous Claude workflows to the Message Batches API to save cost: a nightly technical-debt report generated for the next morning's standup, and a pre-merge security gate that blocks a pull request from merging until review completes. Which two statements correctly evaluate this plan? (Select TWO.)",
          options: [
            { key: "A", text: "The nightly technical-debt report is a good fit for the Batches API, since it is non-blocking and latency-tolerant." },
            { key: "B", text: "The pre-merge security gate is also a good fit for the Batches API, since developers can simply wait for the batch to complete before merging, and waiting is often assumed to be an acceptable tradeoff for cost savings." },
            { key: "C", text: "Both workflows should move to the Batches API, since cost savings always outweigh latency considerations in automated pipelines." },
            { key: "D", text: "The Batches API's lack of multi-turn tool calling within a single request means it cannot be used for any Claude Code workflow at all, including the nightly report." },
            { key: "E", text: "The pre-merge security gate should remain on the synchronous API, since the Batches API offers no guaranteed latency SLA within a 24-hour window." }
          ],
          correct: ["A", "E"],
          explanation: "Batch processing suits non-blocking, latency-tolerant work like the overnight report, while a blocking pre-merge check needs predictable low latency that the Batches API's up-to-24-hour, no-SLA window cannot guarantee. Options B and C ignore the real cost of developers blocked on merges for unpredictable batch windows. Option D overstates the batch API's limitation on multi-turn tool calling as a blanket exclusion, when single-pass report generation without mid-request tool execution is a reasonable batch workload."
        },
        {
          id: "P1-S5-Q15",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "Brightline Payments currently has the same Claude session that generated a bug fix also review its own diff for correctness before opening the pull request. Reviewers have noticed this self-review rarely catches subtle logic errors that an independent reviewer later finds. What is the most effective change?",
          options: [
            { key: "A", text: "Use a second, independent Claude instance with no prior reasoning context from the generation session to review the generated code." },
            { key: "B", text: "Add an instruction asking the same session to \"think extra carefully\" before finalizing its self-review, since stronger phrasing is sometimes assumed to compensate for a lack of independence." },
            { key: "C", text: "Have the same session re-read its own diff three times in a row before submitting." },
            { key: "D", text: "Increase the extended-thinking budget for the self-review step within the same session, since a larger thinking budget is sometimes assumed to compensate for a lack of independent perspective." }
          ],
          correct: ["A"],
          explanation: "A model retains reasoning context from generation, making it less likely to question its own decisions in the same session; an independent review instance without that context is more effective at catching subtle issues. Options B, C, and D all keep the review within the same session's existing reasoning context, the actual limitation being described, rather than introducing genuine independence."
        }
      ]
    }
  ]
});
