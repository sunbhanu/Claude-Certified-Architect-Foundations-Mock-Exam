window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 2,
  title: "Mock Exam 2",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P2-S1-Q1",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "NovaLink Wireless's support agent telemetry shows that in 9% of sessions, the agent calls process_refund immediately after a customer states an order number, without ever calling get_customer to confirm account ownership, resulting in a handful of refunds issued against the wrong billing account. What change would most reliably prevent this?",
          options: [
            { key: "A", text: "Add a programmatic prerequisite that blocks process_refund from executing until get_customer has returned a verified customer ID for the current conversation." },
            { key: "B", text: "Update the system prompt to explicitly instruct the agent that it must call get_customer before process_refund in every case." },
            { key: "C", text: "Add several few-shot examples in the prompt showing the agent calling get_customer first before issuing any refund." },
            { key: "D", text: "Introduce a lightweight classifier that pre-screens each incoming message and only enables process_refund when the message mentions a specific order number." }
          ],
          correct: ["A"],
          explanation: "When a strict tool sequence is required for a financially sensitive action, programmatic enforcement (a prerequisite gate) guarantees compliance in a way prompt instructions cannot. Options B and C rely on probabilistic prompt-following, which still leaves a non-zero failure rate for high-stakes operations. Option D changes which messages trigger the tool rather than enforcing that get_customer runs first, so it does not fix the actual ordering problem."
        },
        {
          id: "P2-S1-Q2",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "NovaLink Wireless's support agent frequently calls lookup_order when customers ask general account questions like \"what's my current plan,\" instead of calling get_customer. Both tools currently have one-line descriptions (\"Retrieves order details\" / \"Retrieves customer account information\") with overlapping accepted identifier formats. What is the most effective first step?",
          options: [
            { key: "A", text: "Merge the two tools into a single get_account_info tool that infers which backend system to query based on the request." },
            { key: "B", text: "Rewrite each tool's description to specify the exact input formats, example queries, and boundary cases that distinguish it from the other tool." },
            { key: "C", text: "Add a natural-language routing step that classifies each message before the agent sees it and restricts which tool is callable, an approach that feels like an appealing extra safety layer sitting in front of tool selection." },
            { key: "D", text: "Add five or more few-shot examples to the system prompt demonstrating correct routing between the two tools, since enough worked examples could in principle teach the model to discriminate between similar-looking tools." }
          ],
          correct: ["B"],
          explanation: "Tool descriptions are the primary signal an LLM uses to choose between similar tools, so sharpening both descriptions with input formats and boundary cases is the lowest-effort, highest-leverage fix. A routing classifier (C) is over-engineered and bypasses the model's own reasoning. Few-shot examples (D) add token overhead without resolving the root ambiguity. Merging the tools (A) is a bigger architectural change than warranted as a first step."
        },
        {
          id: "P2-S1-Q3",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "NovaLink's agent escalates roughly 40% of billing calls even when customers sound calm, because escalation is currently triggered whenever a frustration-detection heuristic based on word choice crosses a threshold. First-contact resolution has dropped well below target as a result. What is the most effective fix?",
          options: [
            { key: "A", text: "Raise the frustration-detection threshold so fewer calls trigger escalation." },
            { key: "B", text: "Have the agent self-report a numeric confidence score before each response and escalate only when confidence is low, treating the model's own stated certainty as if it were a reliable, well-calibrated signal of true case difficulty." },
            { key: "C", text: "Replace the sentiment-based trigger with explicit escalation criteria (customer requests a human, policy gaps or exceptions, inability to make progress) illustrated with few-shot examples." },
            { key: "D", text: "Remove the escalation path for billing calls entirely and require the agent to resolve every case autonomously, reasoning that eliminating an unreliable trigger entirely avoids the risk of it misfiring again on a similar case." }
          ],
          correct: ["C"],
          explanation: "Sentiment-based escalation is an unreliable proxy for actual case complexity, and explicit criteria with few-shot examples directly addresses the real decision boundary the agent needs. Self-reported confidence (B) is similarly unreliable since models are poor judges of their own correctness. Simply raising the threshold (A) is a band-aid that doesn't fix the underlying trigger logic, and removing escalation (D) eliminates a necessary safety valve for genuine policy gaps."
        },
        {
          id: "P2-S1-Q4",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "NovaLink's agent control loop currently decides whether to keep iterating by scanning the assistant's text output for phrases like \"I have completed the request,\" and it occasionally continues looping after the customer's issue is already resolved, re-invoking tools unnecessarily. What is the root-cause fix?",
          options: [
            { key: "A", text: "Set a maximum of 6 tool-call iterations per conversation so the loop cannot run away." },
            { key: "B", text: "Instruct the agent, via the system prompt, to say a fixed completion phrase that the loop can reliably detect, reasoning that a fixed phrase feels like a deterministic signal even though it is still produced through ordinary text generation." },
            { key: "C", text: "Add a secondary model call that reads the transcript and decides whether the conversation is finished, mirroring a verification pattern sometimes used as an extra safety check before continuing a loop." },
            { key: "D", text: "Drive the loop's continue/stop decision from the API response's stop_reason field, continuing on \"tool_use\" and terminating on \"end_turn\" rather than parsing generated text." }
          ],
          correct: ["D"],
          explanation: "Parsing natural-language text to decide whether to stop is an unreliable anti-pattern; stop_reason is the deterministic signal the API already provides for this purpose. An arbitrary iteration cap (A) treats the symptom, not the cause, and can cut off legitimate multi-step work. Instructing a fixed phrase (B) still relies on probabilistic text generation. Adding a second model call (C) is unnecessary overhead when stop_reason already solves the problem directly."
        },
        {
          id: "P2-S1-Q5",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "NovaLink's process_refund tool currently returns the same generic message, \"Operation failed,\" whenever anything goes wrong — whether the refund-processing backend timed out, the requested amount exceeds a policy limit, or the agent lacks permission for an account tier. The agent cannot decide whether to retry, explain a policy limit to the customer, or escalate. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Return structured error metadata that includes an errorCategory (e.g., transient, validation, permission, business) for every failure." },
            { key: "B", text: "Replace the generic text with a slightly more detailed but still uniform message such as \"Refund could not be completed, please try again.\"" },
            { key: "C", text: "Have the agent retry process_refund automatically up to 3 times for every failure type before giving up." },
            { key: "D", text: "Include an isRetryable boolean plus a human-readable description so the agent can decide whether to retry, explain a policy limit, or escalate." },
            { key: "E", text: "Wrap all refund failures in a single isError: true flag with no further detail, since the flag alone signals a problem." }
          ],
          correct: ["A", "D"],
          explanation: "Structured errorCategory values plus an isRetryable flag and human-readable description give the agent exactly the information it needs to choose the right recovery path. A uniform but slightly reworded message (B) still hides the distinction between failure types. Blind retrying of every failure (C) wastes attempts on non-retryable business and permission errors. A bare isError flag with no detail (E) is the same uniform-response anti-pattern the question is trying to fix."
        },
        {
          id: "P2-S1-Q6",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "NovaLink's agent pulls data from three backend MCP tools: one returns timestamps as Unix epoch integers, another as ISO 8601 strings, and a third as free-text dates like \"3 days ago.\" The agent intermittently miscalculates whether an order falls within the 30-day return window. What is the most effective fix?",
          options: [
            { key: "A", text: "Implement a PostToolUse hook that normalizes every tool's timestamp field into a single consistent format before the result is added to the agent's context." },
            { key: "B", text: "Add a system-prompt instruction telling the agent to convert all dates to a common format before reasoning about them, a natural first instinct since the prompt already governs so much of the agent's behavior." },
            { key: "C", text: "Increase the model's context window so it has more room to reason carefully about date comparisons." },
            { key: "D", text: "Have the agent call a dedicated date-parsing tool itself whenever it encounters an ambiguous date format, which seems reasonable since a specialized tool call feels more rigorous than plain reasoning over mixed formats." }
          ],
          correct: ["A"],
          explanation: "A PostToolUse hook deterministically normalizes heterogeneous data formats before the model ever sees them, eliminating the chance of misinterpretation. Relying on a prompt instruction (B) is probabilistic and will fail intermittently, which is exactly the symptom described. A bigger context window (C) does not address a data-format problem. Having the agent call an extra tool (D) adds latency and still depends on the model reliably recognizing ambiguous formats every time."
        },
        {
          id: "P2-S1-Q7",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Each lookup_order call at NovaLink returns a payload with 45 fields (shipping carrier metadata, internal warehouse codes, full billing history), of which only 6 fields are ever relevant to resolving a return request. As conversations lengthen, the agent sometimes references stale or irrelevant fields from earlier in the context. What is the most effective fix?",
          options: [
            { key: "A", text: "Summarize the entire conversation every few turns to shrink the overall context size." },
            { key: "B", text: "Trim lookup_order's response to only the fields relevant to return handling before it is added to the agent's context." },
            { key: "C", text: "Increase the context window so older tool results remain fully available throughout the conversation." },
            { key: "D", text: "Instruct the agent in the system prompt to ignore fields it does not need when reasoning about a case, assuming a clear enough instruction will reliably override dozens of irrelevant fields in every tool result." }
          ],
          correct: ["B"],
          explanation: "Trimming verbose tool output to only the relevant fields before it enters context directly reduces irrelevant noise and token usage at the source. Generic conversation summarization (A) risks condensing exactly the transactional facts (amounts, dates) that need to stay precise. A bigger context window (C) just gives more room for irrelevant data to accumulate without fixing the underlying bloat. Instructing the model to ignore fields (D) is a probabilistic prompt-based workaround rather than a structural fix."
        },
        {
          id: "P2-S1-Q8",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "NovaLink's lookup_order tool returns the same JSON shape — an empty array — both when the order database is temporarily unreachable and when a customer's order number genuinely does not exist in the system. The agent sometimes tells customers their order \"doesn't exist\" when the backend was actually down. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a retry loop in the agent's prompt instructing it to call lookup_order again whenever it receives an empty array." },
            { key: "B", text: "Log all empty-array responses so engineers can manually audit them after the fact." },
            { key: "C", text: "Have the tool explicitly distinguish access failures (e.g., an isError flag with errorCategory: \"transient\") from valid empty results representing a successful query with no matches." },
            { key: "D", text: "Change lookup_order to throw a generic error whenever no results are found, so the agent always treats \"no results\" as a failure." }
          ],
          correct: ["C"],
          explanation: "Distinguishing access failures from valid empty results is exactly the structured-error pattern needed so the agent can decide whether to retry or accurately tell the customer the order doesn't exist. A blanket retry instruction (A) wastes calls on genuinely empty results and relies on prompt compliance. Manual auditing (B) doesn't prevent the agent from giving wrong answers in real time. Treating every empty result as an error (D) would incorrectly flag legitimate \"no such order\" cases as failures."
        },
        {
          id: "P2-S1-Q9",
          domain: 1,
          task: "1.4",
          type: "multiple",
          select: 2,
          stem: "NovaLink's policy caps agent-issued refunds at $150; anything above requires human approval. Currently this limit exists only as a line in the system prompt, and audit logs show the agent has approved refunds above $150 in 3% of cases when a customer pushed back persistently. Which two changes would most effectively close this gap? (Select TWO.)",
          options: [
            { key: "A", text: "Reword the system prompt to state the $150 limit more forcefully, in bold, near the top of the instructions." },
            { key: "B", text: "Add a tool-call interception hook that blocks any process_refund call requesting more than $150 and redirects the conversation to escalate_to_human." },
            { key: "C", text: "Instruct the agent to double-check the refund amount against policy before submitting each process_refund call." },
            { key: "D", text: "Have the agent ask the customer to confirm the amount twice before calling process_refund." },
            { key: "E", text: "When the hook blocks a refund, compile a structured handoff summary (customer ID, order details, requested amount, root cause) so the human agent isn't starting from scratch." }
          ],
          correct: ["B", "E"],
          explanation: "A tool-call interception hook provides deterministic enforcement of the $150 cap that prompt wording alone cannot guarantee, and pairing it with a structured handoff summary ensures the escalation is actionable rather than just a dead end. Reiterating the limit in the prompt (A) or asking the agent to self-check (C) are both still probabilistic compliance, which is what caused the 3% failure rate in the first place. Asking the customer to confirm twice (D) does nothing to enforce the policy threshold itself."
        },
        {
          id: "P2-S1-Q10",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "When NovaLink's escalate_to_human tool occasionally fails to reach the ticketing backend, the agent's current fallback is to quietly tell the customer \"your request has been noted\" and end the conversation without actually creating a ticket. Support leadership discovers several customers were never followed up with. What is the most effective fix?",
          options: [
            { key: "A", text: "Have the agent apologize more explicitly to the customer when escalate_to_human appears to fail, on the theory that a more sincere-sounding apology offsets the lack of any ticket ever being created for a human agent to follow up on later." },
            { key: "B", text: "Add a fixed retry cap of 3 attempts before giving up silently." },
            { key: "C", text: "Terminate the entire conversation and tell the customer to call back later whenever escalate_to_human fails, which at least avoids leaving a frustrated customer waiting indefinitely on an open, unresolved exchange with no ticket ever created." },
            { key: "D", text: "Return structured error context from escalate_to_human (failure type, what was attempted) so the agent can inform the customer accurately and retry or use an alternative path rather than silently treating the failure as success." }
          ],
          correct: ["D"],
          explanation: "Silently suppressing a failure and reporting it as success is a core anti-pattern; structured error context lets the agent make an appropriate recovery decision and keep the customer accurately informed. A more apologetic tone (A) doesn't fix the underlying silent failure. A fixed retry cap with the same silent fallback (B) still ends in the same misleading outcome once retries are exhausted. Terminating the whole conversation (C) is an overreaction that abandons the customer unnecessarily."
        },
        {
          id: "P2-S1-Q11",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "To \"future-proof\" the support agent, engineers gave it 16 MCP tools covering refunds, loyalty points, SIM swaps, roaming add-ons, and device trade-ins, even though a typical case only needs 3-4 of them. Tool-selection accuracy has dropped sharply since the expansion. What is the most effective fix?",
          options: [
            { key: "A", text: "Scope each conversation to only the tools relevant to the detected case type, rather than exposing all 16 tools at once." },
            { key: "B", text: "Add more few-shot examples covering every possible tool so the agent learns to pick correctly among all 16, under the assumption that enough worked examples will eventually teach correct discrimination." },
            { key: "C", text: "Increase the model's context window so it has more space to consider all 16 tool descriptions." },
            { key: "D", text: "Replace tool_choice: \"auto\" with tool_choice: \"any\" so the agent is always forced to call some tool." }
          ],
          correct: ["A"],
          explanation: "Giving an agent too many tools degrades selection reliability by increasing decision complexity, so scoping tool access per case type directly reduces that complexity. Adding more few-shot examples (B) treats the symptom without reducing the actual option space. A larger context window (C) doesn't improve the model's ability to discriminate between 16 similar tools. Forcing tool_choice: \"any\" (D) only guarantees some tool is called, not that the right one is selected."
        },
        {
          id: "P2-S1-Q12",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "A NovaLink customer writes in asking about a damaged device, a billing discrepancy on the same account, and whether a discount code applies to next month's bill, all in one message. The agent currently handles only the first concern it notices and ignores the rest. What is the most effective fix?",
          options: [
            { key: "A", text: "Instruct the agent to always ask the customer to submit one issue at a time in separate messages." },
            { key: "B", text: "Decompose the multi-concern message into its distinct items, investigate each using the available tools, and synthesize a single unified resolution covering all concerns." },
            { key: "C", text: "Route the entire message to escalate_to_human whenever more than one topic is detected, treating any multi-concern message as inherently unsafe for the agent to handle even when every concern individually falls well within its tools." },
            { key: "D", text: "Pick the concern mentioned first in the message and tell the customer to follow up separately about the others, reasoning that handling one concern fully is preferable to risking a partial answer across several at once." }
          ],
          correct: ["B"],
          explanation: "Decomposing a multi-concern request into distinct items and then synthesizing a unified response directly matches how multi-concern requests should be handled, using shared context to investigate each concern. Asking the customer to split their message (A) adds friction and hurts the resolution experience. Escalating every multi-topic message (C) over-escalates cases the agent is fully capable of resolving. Addressing only the first concern (D) is exactly the incomplete behavior the question describes."
        },
        {
          id: "P2-S1-Q13",
          domain: 5,
          task: "5.2",
          type: "multiple",
          select: 2,
          stem: "Two situations are causing trouble for NovaLink's agent: (1) when get_customer returns two matching accounts for the same phone number, the agent currently guesses which one the customer means based on which was created more recently; (2) when a customer asks for a price match against a competitor's promotion, which NovaLink's policy never addresses, the agent attempts to resolve it with a self-invented discount. Which two changes would most effectively address these? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct the agent to always pick the most recently active account when get_customer returns multiple matches." },
            { key: "B", text: "Instruct the agent to apply its best judgment and offer a reasonable discount whenever policy is silent on a request." },
            { key: "C", text: "Instruct the agent to ask the customer for an additional identifier (e.g., account number or billing zip code) whenever multiple matches are returned, rather than selecting heuristically." },
            { key: "D", text: "Have the agent infer the correct account by comparing the stated issue against each account's order history." },
            { key: "E", text: "Escalate to a human agent whenever policy is silent or ambiguous about the customer's specific request, rather than having the agent invent a resolution." }
          ],
          correct: ["C", "E"],
          explanation: "Requesting an additional identifier is the correct response to ambiguous account matches, and escalating when policy is silent avoids the agent fabricating unauthorized exceptions. Heuristic selection based on recency (A) or order-history inference (D) both risk picking the wrong account instead of simply asking for clarification. Letting the agent invent discounts when policy doesn't address a case (B) creates unauthorized financial exposure instead of surfacing the genuine policy gap."
        },
        {
          id: "P2-S1-Q14",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "NovaLink's support engineering team wants every teammate who works on the agent to automatically have access to the production ticketing MCP server, with its API token supplied via an environment variable rather than hardcoded. One engineer is also experimenting with a personal draft MCP server for a new loyalty-points integration that shouldn't affect anyone else yet. What is the correct configuration approach?",
          options: [
            { key: "A", text: "Configure both servers in the engineer's personal ~/.claude.json so changes can be tested safely before sharing." },
            { key: "B", text: "Configure both servers in the project's .mcp.json and ask teammates to comment out the experimental server locally, which keeps one shared file but relies on everyone remembering to comment the same line back out." },
            { key: "C", text: "Configure the ticketing server in the project-scoped .mcp.json with ${TICKETING_API_TOKEN} expansion, and the experimental loyalty-points server in the engineer's personal ~/.claude.json." },
            { key: "D", text: "Hardcode the ticketing token directly into .mcp.json since it is only used internally and committed to version control, treating internal-only usage as if it removes the risk of a credential being exposed to every teammate clone." }
          ],
          correct: ["C"],
          explanation: "Project-scoped .mcp.json with environment variable expansion is the correct way to share team-wide tooling without committing secrets, while personal, experimental servers belong in the user-scoped ~/.claude.json so they don't affect teammates. Putting the shared ticketing server only in personal config (A) means teammates won't automatically get it. Committing the experimental server to the shared file (B) exposes unfinished work to the whole team. Hardcoding a credential into version control (D) is a direct secret-management violation."
        },
        {
          id: "P2-S1-Q15",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A NovaLink support engineer is debugging a multi-day billing dispute case. They resumed the agent's session from two days ago using --resume, but the account's order history has since changed (a new order was placed and a prior refund was reversed), and the agent is now reasoning from stale tool results embedded in the resumed history. What is the most effective approach?",
          options: [
            { key: "A", text: "Keep resuming the same session indefinitely, since --resume always reflects the latest backend state automatically." },
            { key: "B", text: "Fork the session with fork_session to create a parallel branch, without informing the agent of the account changes." },
            { key: "C", text: "Ask the agent to re-run every tool call it made two days ago to confirm whether the state changed." },
            { key: "D", text: "Start a new session and inject a structured summary noting exactly which prior findings are now stale (the new order, the reversed refund) rather than resuming with outdated tool results." }
          ],
          correct: ["D"],
          explanation: "Starting fresh with a structured summary of what has changed is more reliable than resuming a session whose embedded tool results are now stale and misleading. Option A is factually wrong: resumed sessions retain the tool results captured at the time they were made, not live data. Forking without informing the agent of the changes (B) still leaves it reasoning from outdated information. Re-running every prior tool call (C) is unnecessarily expensive compared to a targeted summary of what actually changed."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P2-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Meridian Claims Research runs a coordinator that delegates to web-search, document-analysis, and synthesis subagents. An engineer recently wired the document-analysis subagent to call the web-search subagent directly when it needs a missing precedent, bypassing the coordinator. Error handling has become inconsistent and some results are now silently lost. What is the most effective fix?",
          options: [
            { key: "A", text: "Route all subagent-to-subagent communication through the coordinator, which manages task delegation, result aggregation, and error handling centrally." },
            { key: "B", text: "Give the document-analysis subagent its own retry logic for communicating with web-search directly, independent of the coordinator, treating a direct peer-to-peer channel as a reasonable shortcut around routine coordinator overhead." },
            { key: "C", text: "Merge the web-search and document-analysis subagents into a single subagent to eliminate the need for inter-subagent calls." },
            { key: "D", text: "Add a shared message queue that subagents can read from and write to without coordinator involvement, treating a shared queue as a lightweight decoupling mechanism that avoids routing every message through a single coordinator." }
          ],
          correct: ["A"],
          explanation: "The hub-and-spoke pattern requires the coordinator to manage all inter-subagent communication so it retains observability and consistent error handling. Giving document-analysis its own retry logic (B) still bypasses the coordinator and leaves error handling fragmented. Merging the subagents (C) is a drastic architectural change that sacrifices specialization rather than fixing the routing problem. A shared queue without coordinator involvement (D) reintroduces the same uncontrolled communication path."
        },
        {
          id: "P2-S3-Q2",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Meridian's synthesis subagent receives a single 18,000-word block combining all web-search and document-analysis findings with no internal structure. Reviewers notice that conclusions drawn from the middle third of the findings are consistently omitted from the final report, while findings from the start and end are well represented. What is the most effective fix?",
          options: [
            { key: "A", text: "Ask the synthesis subagent to re-read the combined findings twice before writing the report." },
            { key: "B", text: "Restructure the aggregated input with explicit section headers per finding and place key findings summaries at the beginning, rather than relying on the model to scan a single undifferentiated block." },
            { key: "C", text: "Increase the model's context window so it can hold the entire 18,000-word block without truncation." },
            { key: "D", text: "Shorten the findings by summarizing each one into a single sentence before passing them to synthesis." }
          ],
          correct: ["B"],
          explanation: "This is the classic \"lost in the middle\" effect; organizing input with explicit section headers and placing key summaries up front mitigates position-based omission. Asking the model to re-read twice (A) does not change how position effects bias attention. A larger context window (C) doesn't fix the underlying attention pattern, since the full block already fits. Shortening every finding to one sentence (D) risks losing the numerical and attribution detail needed for a credible report."
        },
        {
          id: "P2-S3-Q3",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Meridian's document-analysis subagent has two tools, analyze_content (\"Analyzes content\") and analyze_document (\"Analyzes a document\"), both accepting a text blob. Logs show the subagent frequently calls analyze_content when it means to extract structured data from a scanned claim form, and vice versa. What is the most effective first step?",
          options: [
            { key: "A", text: "Remove analyze_content entirely and route everything through analyze_document." },
            { key: "B", text: "Add a routing classifier upstream that decides which of the two tools to call based on file extension, an approach that looks precise on paper but silently misroutes any file saved with an unconventional extension." },
            { key: "C", text: "Rename and rewrite the descriptions so each tool's purpose, input format, and boundary with the other is unambiguous (e.g., renaming analyze_content to extract_web_passage with a web-specific description)." },
            { key: "D", text: "Add ten few-shot examples demonstrating correct selection between the two tools." }
          ],
          correct: ["C"],
          explanation: "Renaming and rewriting ambiguous, near-identical descriptions directly removes the functional overlap causing misrouting. Removing one tool outright (A) eliminates functionality that may still be needed. A classifier layer (B) is over-engineered for what is fundamentally a description problem. Ten few-shot examples (D) add significant token overhead without resolving the underlying ambiguity between the two descriptions."
        },
        {
          id: "P2-S3-Q4",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Meridian's coordinator attempts to spawn a synthesis subagent via the Task tool, but the invocation silently fails, and once the configuration is fixed, the synthesis subagent's output shows no awareness of the web-search findings gathered earlier in the same coordinator conversation. What configuration issue most likely explains both problems?",
          options: [
            { key: "A", text: "The coordinator's context window is too small to hold the synthesis subagent's response." },
            { key: "B", text: "Subagents automatically inherit the coordinator's full conversation history, so the missing awareness must be a caching bug, a tempting explanation since context is often assumed to propagate automatically across every layer of a multi-agent system." },
            { key: "C", text: "The synthesis subagent needs its own MCP server configured in .mcp.json to receive findings, on the assumption that findings must always travel through a dedicated server connection rather than through the prompt context the coordinator assembles for it." },
            { key: "D", text: "The coordinator's allowedTools list must include \"Task\" for subagent spawning to succeed, and the web-search findings must be explicitly included in the synthesis subagent's prompt, since subagents do not automatically inherit parent context." }
          ],
          correct: ["D"],
          explanation: "The Task tool requires \"Task\" to be present in allowedTools for the coordinator to spawn subagents at all, and because subagents have isolated context, prior findings must be explicitly placed in the subagent's prompt. Option B states the opposite of how subagent context actually works. A small context window (A) wouldn't explain a silently failing Task invocation. An MCP server (C) is unrelated to passing findings between agents in the same system."
        },
        {
          id: "P2-S3-Q5",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "Meridian is researching \"emerging liability exposure in autonomous-vehicle claims,\" an open-ended topic with many possible subtopics. The coordinator currently always runs the full fixed pipeline (one web-search pass, one document-analysis pass, one synthesis pass) regardless of the query. Reviewers note some research topics are too broad for a single fixed pass, while narrower topics waste subagent calls. Which two changes would most effectively address this? (Select TWO.)",
          options: [
            { key: "A", text: "For open-ended topics, use dynamic decomposition: the coordinator evaluates intermediate findings and re-delegates to search/analysis subagents with targeted follow-up queries until coverage is sufficient." },
            { key: "B", text: "Always run the same fixed three-pass pipeline for every topic, regardless of scope, to keep behavior predictable." },
            { key: "C", text: "Set a hard cap of exactly 3 subagent calls per research topic to prevent runaway costs." },
            { key: "D", text: "Have the coordinator ask the user to manually specify how many subagent passes to run before starting." },
            { key: "E", text: "Have the coordinator dynamically decide which subagents to invoke and how many passes to run based on query complexity and topic breadth, rather than always invoking the full fixed pipeline." }
          ],
          correct: ["A", "E"],
          explanation: "Dynamic, adaptive decomposition lets the coordinator re-delegate with targeted queries and scale the number of passes to the actual breadth of the topic, which is appropriate for open-ended research. Always running the same fixed pipeline (B) is precisely the behavior causing both over- and under-coverage. A hard numeric cap on subagent calls (C) is an arbitrary limit unrelated to actual topic complexity. Requiring the user to manually specify pass counts (D) defeats the purpose of an autonomous research system."
        },
        {
          id: "P2-S3-Q6",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "Two sources cited by Meridian's web-search subagent report different average settlement amounts for a precedent-setting autonomous-vehicle claim: one says $340,000, another says $410,000. The synthesis subagent currently picks whichever number appeared first in its input and omits the other. What is the most effective fix?",
          options: [
            { key: "A", text: "Require the document-analysis and web-search subagents to pass forward both conflicting values with source attribution, and have synthesis explicitly annotate the conflict rather than arbitrarily selecting one." },
            { key: "B", text: "Instruct the synthesis subagent to average the two values and report a single blended figure." },
            { key: "C", text: "Discard both values since they disagree, and omit the settlement amount from the report entirely." },
            { key: "D", text: "Always trust whichever source has the more recent publication date without surfacing the discrepancy, a shortcut that seems reasonable since newer sources are often assumed to supersede older ones in most ordinary research contexts." }
          ],
          correct: ["A"],
          explanation: "Preserving both conflicting values with source attribution and explicitly annotating the conflict lets the report distinguish well-established findings from contested ones, which is far more useful than silently picking one. Averaging (B) fabricates a figure that neither source actually reported. Discarding the finding entirely (C) loses potentially valuable information. Always trusting the more recent date (D) hides a genuine discrepancy the report's reader should know about."
        },
        {
          id: "P2-S3-Q7",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Meridian's synthesis subagent was recently given full access to the web-search subagent's entire tool set \"just in case it needs to double-check something,\" and now frequently performs ad hoc web searches that duplicate the dedicated web-search subagent's work, producing redundant and sometimes contradictory findings. What is the most effective fix?",
          options: [
            { key: "A", text: "Remove all cross-role tool access from synthesis and require it to escalate every fact-check request to the coordinator, even trivial ones, treating centralization as inherently safer despite the added overhead." },
            { key: "B", text: "Give synthesis a single, narrowly scoped verify_fact tool for high-frequency fact-checking needs, while routing more complex research requests back through the coordinator to web-search." },
            { key: "C", text: "Give synthesis the exact same tool set as web-search, since both tools are already proven to work reliably." },
            { key: "D", text: "Add a system-prompt instruction telling synthesis to only search the web when truly necessary, on the assumption that a single qualifying phrase will reliably curb a tool-access pattern that was already granted broadly just in case." }
          ],
          correct: ["B"],
          explanation: "A narrowly scoped cross-role tool for high-frequency needs lets synthesis do lightweight fact-checking without duplicating the web-search subagent's broader role, while complex requests still route through the coordinator. Blocking all cross-role access (A) adds unnecessary coordinator overhead for trivial checks. Giving synthesis the full web-search tool set (C) is the misuse the question describes, just formalized. A vague prompt instruction (D) is probabilistic and unlikely to reliably prevent overuse."
        },
        {
          id: "P2-S3-Q8",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Meridian's coordinator decomposes every research request into exactly three fixed subtasks (\"legal precedent,\" \"settlement figures,\" \"regulatory changes\"), regardless of the actual topic. For a request about \"emerging cybersecurity liability in claims involving connected vehicles,\" this fixed decomposition misses relevant subtopics like breach-disclosure timelines, and the final report has noticeable coverage gaps. What is the most effective fix?",
          options: [
            { key: "A", text: "Add a fourth fixed subtask, \"cybersecurity,\" to the decomposition template so all four topics are always covered." },
            { key: "B", text: "Instruct the report subagent to apologize for coverage gaps in the final report." },
            { key: "C", text: "Have the coordinator analyze the specific query's requirements and dynamically decide which subtopics and subagents to invoke, rather than applying the same three fixed subtasks to every request." },
            { key: "D", text: "Increase the number of fixed subtasks from three to six to cover more ground on every request." }
          ],
          correct: ["C"],
          explanation: "Overly narrow, fixed task decomposition leads to incomplete coverage of broad or novel research topics; the fix is for the coordinator to dynamically analyze each query and select subtopics accordingly. Adding a fourth fixed subtask (A) only patches this one topic and will fail the next novel one. Apologizing in the report (B) doesn't improve coverage at all. Simply adding more fixed subtasks (D) still can't anticipate every future topic the way dynamic decomposition can."
        },
        {
          id: "P2-S3-Q9",
          domain: 5,
          task: "5.3",
          type: "multiple",
          select: 2,
          stem: "Meridian's web-search subagent sometimes times out mid-query and sometimes legitimately finds zero relevant precedents for a narrow topic. Currently both cases are reported to the coordinator as \"no results found,\" and the coordinator cannot tell whether to retry a different query or accept the gap and note it in the report. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Have the web-search subagent always retry 5 times before reporting anything to the coordinator, regardless of failure type." },
            { key: "B", text: "Report structured error context distinguishing timeouts/access failures (which may warrant retry or an alternative query) from valid empty results representing a genuine lack of matching precedents." },
            { key: "C", text: "Suppress timeout errors entirely and just return an empty result list, since the coordinator can't act on them anyway." },
            { key: "D", text: "Have the subagent attempt local recovery for transient timeouts first, and only propagate to the coordinator the failures it cannot resolve itself, along with what was attempted and any partial results." },
            { key: "E", text: "Terminate the entire research pipeline whenever any single web-search query returns zero results." }
          ],
          correct: ["B", "D"],
          explanation: "Distinguishing access failures from valid empty results gives the coordinator the information needed to decide on retries or alternative queries, and local recovery for transient issues reduces unnecessary coordinator-level escalation. Blindly retrying everything 5 times (A) wastes effort on genuine empty-result cases. Suppressing timeout errors (C) is the silent-failure anti-pattern that hides real problems. Terminating the whole pipeline on one empty result (E) is a drastic overreaction to a single subtopic gap."
        },
        {
          id: "P2-S3-Q10",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "Meridian's document-analysis subagent calls a parse_claim_pdf tool that currently throws the same error string, \"could not process document,\" whether the PDF is corrupted, password-protected, or simply too large for the current pass. The subagent cannot decide whether to retry, request a different format, or skip the document and note the gap. What is the most effective fix?",
          options: [
            { key: "A", text: "Wrap every failure in a single isError: true flag with no additional detail, since a boolean is sufficient for an internal tool." },
            { key: "B", text: "Have the subagent always retry parsing up to 5 times regardless of the underlying cause." },
            { key: "C", text: "Silently skip any document that fails to parse and omit it from the findings without any note in the output, which keeps the findings list clean but leaves no record that anything was ever skipped." },
            { key: "D", text: "Return structured error metadata (errorCategory such as validation vs permission, plus isRetryable) so the subagent can decide whether to retry, request an alternative format, or report the gap." }
          ],
          correct: ["D"],
          explanation: "Structured error metadata with categories and an isRetryable flag enables exactly the kind of intelligent per-case decision the subagent needs to make. A bare isError flag (A) is the same uniform, uninformative response causing the problem. Blind retries (B) waste effort on non-retryable cases like password-protected or oversized files. Silently skipping failed documents (C) hides coverage gaps from the coordinator and report."
        },
        {
          id: "P2-S3-Q11",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Meridian's coordinator currently invokes web-search, then waits for its full response, then invokes document-analysis, then waits again — even when the two subagents' work is fully independent for a given query. Research pipeline latency has become a user complaint. What is the most effective fix?",
          options: [
            { key: "A", text: "Emit both Task tool calls for web-search and document-analysis in a single coordinator response so they execute in parallel, rather than sequentially across separate turns." },
            { key: "B", text: "Reduce the amount of context passed to each subagent so each individual call completes faster." },
            { key: "C", text: "Merge web-search and document-analysis into a single subagent so only one Task call is needed." },
            { key: "D", text: "Increase the timeout configured for each subagent so slow calls are less likely to fail." }
          ],
          correct: ["A"],
          explanation: "Emitting multiple Task tool calls in a single coordinator response lets independent subagents run in parallel instead of sequentially, directly reducing latency. Shrinking context (B) may marginally help each call but doesn't address the sequential execution pattern. Merging the subagents (C) sacrifices specialization and isn't necessary to achieve parallelism. Increasing timeouts (D) addresses reliability, not the latency caused by sequential waiting."
        },
        {
          id: "P2-S3-Q12",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Meridian's document-analysis subagent passes findings to synthesis as plain prose paragraphs with no separation between the claim it's making and where it came from. The resulting reports regularly lose track of which precedent came from which source document, undermining credibility with adjusters. What is the most effective fix?",
          options: [
            { key: "A", text: "Instruct the synthesis subagent to simply try harder to remember where each finding came from, treating a reminder about effort as if it could substitute for the structured attribution metadata the findings are currently missing." },
            { key: "B", text: "Use a structured data format that separates each finding's content from its metadata (source document name, page number, publication date) when passing context between agents." },
            { key: "C", text: "Reduce the number of findings passed to synthesis so there is less to keep track of." },
            { key: "D", text: "Have the document-analysis subagent summarize findings into a single short paragraph before passing them on, on the assumption that a terser summary is naturally easier for synthesis to keep straight." }
          ],
          correct: ["B"],
          explanation: "Separating content from metadata in a structured format is the mechanism that preserves attribution when context is passed between agents. A vague instruction to \"try harder\" (A) is not a reliable mechanism for preserving structured metadata. Reducing the number of findings (C) sacrifices coverage rather than fixing the attribution problem. Summarizing into a single paragraph (D) is likely to compress away exactly the source details that need to be preserved."
        },
        {
          id: "P2-S3-Q13",
          domain: 1,
          task: "1.4",
          type: "multiple",
          select: 2,
          stem: "Meridian's report subagent currently finalizes and formats the client-facing report immediately after receiving synthesis output, even when synthesis has explicitly flagged unresolved source conflicts as \"needs coordinator review.\" Two such reports have gone to adjusters with contradictory settlement figures left unresolved. Which two changes would most effectively prevent this? (Select TWO.)",
          options: [
            { key: "A", text: "Add a system-prompt note asking the report subagent to \"please check for unresolved conflicts before finalizing.\"" },
            { key: "B", text: "Have the report subagent silently pick the more recent source whenever it notices a flagged conflict, without informing the coordinator." },
            { key: "C", text: "Add a programmatic prerequisite that blocks the report subagent from finalizing output until the coordinator has confirmed all synthesis-flagged conflicts are resolved." },
            { key: "D", text: "Route unresolved conflicts back through the coordinator for explicit reconciliation before the report subagent is invoked, rather than relying on the report subagent to catch them." },
            { key: "E", text: "Remove the ability for synthesis to flag conflicts at all, so the report subagent never has to handle them." }
          ],
          correct: ["C", "D"],
          explanation: "A programmatic prerequisite that blocks finalization until the coordinator confirms reconciliation, combined with routing conflicts through the coordinator before the report subagent runs, provides deterministic enforcement of the required handoff order. A prompt note asking the subagent to \"please check\" (A) is probabilistic and already failed twice. Having the subagent silently resolve conflicts itself (B) hides the discrepancy rather than surfacing it for proper reconciliation. Removing the ability to flag conflicts (E) would hide real data-quality problems from everyone."
        },
        {
          id: "P2-S3-Q14",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Meridian's web-search subagent currently has to make several exploratory tool calls just to discover what categories of precedent documents exist in the internal legal database before it can search effectively, adding latency to every research session. What is the most effective fix?",
          options: [
            { key: "A", text: "Give the subagent a larger context window so it can hold more exploratory results at once." },
            { key: "B", text: "Add a CLAUDE.md file describing the database's categories so the subagent reads it before searching, under the assumption that a one-time file read reliably substitutes for live visibility into the category list." },
            { key: "C", text: "Expose the database's category index as an MCP resource so the subagent has direct visibility into available categories without needing exploratory tool calls." },
            { key: "D", text: "Add a few-shot example showing the subagent listing categories before searching." }
          ],
          correct: ["C"],
          explanation: "MCP resources are designed precisely to expose content catalogs like a category index, giving the agent visibility without consuming exploratory tool calls. A larger context window (A) doesn't reduce the number of calls needed to discover the categories in the first place. CLAUDE.md (B) configures Claude Code project behavior, not an MCP-exposed database catalog for an agent subsystem. A few-shot example (D) demonstrates a behavior but doesn't actually give the subagent the catalog data it needs."
        },
        {
          id: "P2-S3-Q15",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "Meridian's report subagent currently converts every type of finding — settlement dollar figures, narrative case summaries, and regulatory citation lists — into the same undifferentiated paragraph format. Adjusters report the reports are hard to scan for figures. What is the most effective fix?",
          options: [
            { key: "A", text: "Shorten every finding to a single sentence regardless of type to make the report easier to scan." },
            { key: "B", text: "Convert all findings, including dollar figures, into narrative prose for a more professional tone, reasoning that one consistent writing style reads as more polished even though it buries the figures adjusters need." },
            { key: "C", text: "Remove dollar figures from the report entirely and keep only narrative summaries, treating the omission as an acceptable tradeoff since adjusters can always request the underlying figures separately if a case specifically calls for them." },
            { key: "D", text: "Render different content types appropriately — settlement figures as tables, case narratives as prose, regulatory citations as structured lists — rather than forcing everything into a uniform paragraph format." }
          ],
          correct: ["D"],
          explanation: "Rendering different content types in their most appropriate format (tables for financial data, prose for narrative, structured lists for citations) directly improves scannability instead of flattening everything into uniform prose. Shortening every finding (A) loses necessary detail rather than improving its presentation. Forcing dollar figures into prose (B) is the exact uniform-formatting problem causing the complaint. Removing dollar figures (C) deletes information adjusters need."
        }
      ]
    },
    {
      id: 4,
      title: "Developer Productivity with Claude",
      description: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      questions: [
        {
          id: "P2-S4-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Vantage Pay wants a nightly CI job to invoke the productivity agent and auto-generate a changelog summary for every PR merged that day, with no engineer present to respond to anything. When the team first wired this up using the normal interactive `claude` command inside the pipeline script, the job sat idle until the CI runner's own timeout killed it, apparently waiting on terminal input. What is the most effective fix?",
          options: [
            { key: "A", text: "Keep the interactive command as-is, but lengthen the CI timeout enough that the session eventually completes on its own." },
            { key: "B", text: "Invoke Claude Code with the -p (or --print) flag so it runs in non-interactive mode and returns its output directly, which is the documented way to run it inside automated pipelines." },
            { key: "C", text: "Pipe a scripted sequence of newline keystrokes into the interactive command so it auto-dismisses whatever prompt it is waiting on, under the assumption that scripted input is just as reliable as running in documented non-interactive mode." },
            { key: "D", text: "Schedule the changelog job to run only when an engineer happens to be online to babysit the interactive terminal session, which defeats automation but seems like a safe fallback given that the pipeline is already blocking on terminal input." }
          ],
          correct: ["B"],
          explanation: "The -p/--print flag is the documented mechanism for running Claude Code non-interactively, returning output without blocking on terminal input, which is exactly what an unattended CI job needs. Lengthening the timeout (A) assumes the interactive session will eventually finish on its own, which it won't if it is genuinely waiting for input. Scripting fake keystrokes (C) is a fragile workaround for a problem the -p flag already solves cleanly. Requiring an engineer to be online (D) defeats the entire purpose of automating the job in CI."
        },
        {
          id: "P2-S4-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A new engineer joins the Vantage Pay team and reports that the productivity agent never follows the team's \"always run lint before committing\" convention, even though it works correctly for every existing teammate. Investigation shows the convention is defined only in an existing teammate's ~/.claude/CLAUDE.md file. What is the most effective fix?",
          options: [
            { key: "A", text: "Ask the new engineer to manually copy the existing teammate's ~/.claude/CLAUDE.md file to their own home directory." },
            { key: "B", text: "Move the convention into the project-level CLAUDE.md (or .claude/CLAUDE.md) so it is shared with all teammates via version control." },
            { key: "C", text: "Add the convention to every teammate's personal shell profile instead of CLAUDE.md." },
            { key: "D", text: "Instruct the agent via a one-time slash command to \"always remember to lint before committing.\"" }
          ],
          correct: ["B"],
          explanation: "User-level CLAUDE.md settings apply only to that individual user and are never shared with teammates via version control, which is exactly why the new engineer didn't receive the convention. Manually copying personal config files (A) doesn't scale and isn't version-controlled. A shell profile (C) is unrelated to how Claude Code loads configuration. A one-time slash command (D) doesn't persist across sessions or teammates the way project-level CLAUDE.md does."
        },
        {
          id: "P2-S4-Q3",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Vantage Pay's monorepo has three packages — payments-core, payments-api, and payments-web — each with its own coding-standards document. The root CLAUDE.md currently inlines all three standards documents in full, so an engineer editing a UI component in payments-web loads the backend transaction-handling conventions from payments-core into every session, wasting context and occasionally producing UI code that follows backend-only conventions. What is the most effective fix?",
          options: [
            { key: "A", text: "Keep the single root CLAUDE.md but add bold section headers separating each package's standards so the agent can visually tell them apart." },
            { key: "B", text: "Add a CLAUDE.md inside each package directory that uses the @import syntax to pull in only that package's relevant standards file, keeping universal, cross-package conventions in the root CLAUDE.md." },
            { key: "C", text: "Move each package's standards document into every engineer's personal ~/.claude/CLAUDE.md so it loads automatically regardless of which package they are editing, keeping each environment self-sufficient but outside version control." },
            { key: "D", text: "Run /compact at the start of every session to shrink the combined, all-package standards content before any work begins." }
          ],
          correct: ["B"],
          explanation: "The @import syntax lets each package's CLAUDE.md selectively pull in only the standards file relevant to that package, keeping modular organization while still sharing universal conventions from the root. Reformatting with headers (A) still loads all three documents' full content into every session. Personal user-level config (C) is never shared via version control and would need to be duplicated by every teammate. /compact (D) condenses conversation history, not which standards files are loaded into context in the first place."
        },
        {
          id: "P2-S4-Q4",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A Vantage Pay engineer wants to compare two different approaches to refactoring a legacy interest-calculation module, starting from the same codebase analysis the agent already performed. They want both explorations to proceed independently without one's changes affecting the other. What is the most effective approach?",
          options: [
            { key: "A", text: "Resume the same session with --resume twice in parallel terminal windows." },
            { key: "B", text: "Ask the agent to keep both approaches in mind simultaneously within a single conversation, reasoning that a single thorough context window should let it track two independent refactors without the details bleeding together." },
            { key: "C", text: "Start two entirely new sessions from scratch, each re-running the full codebase analysis independently, treating a full redo as the safest way to guarantee no cross-contamination between the two approaches." },
            { key: "D", text: "Use fork_session to create two independent branches from the existing analysis baseline, letting each explore a different refactoring approach." }
          ],
          correct: ["D"],
          explanation: "fork_session is designed precisely for creating independent branches from a shared analysis baseline to explore divergent approaches without interference. Resuming the same session twice in parallel (A) risks both branches writing conflicting state into one shared session. Holding both approaches in a single conversation (B) risks the agent conflating details between the two. Starting from scratch twice (C) wastes the existing analysis unnecessarily."
        },
        {
          id: "P2-S4-Q5",
          domain: 2,
          task: "2.5",
          type: "multiple",
          select: 2,
          stem: "Vantage Pay's productivity agent is asked to update a specific validation line inside a 2,000-line legacy file. The target text, if (amount <= 0) { throw err; }, appears four times in the file with different surrounding context. The agent's Edit tool call fails because the anchor text isn't unique, and separately, the agent has been reading the entire file from top to bottom before every exploration task even when it only needs to trace one function's callers. Which two changes would most effectively address these issues? (Select TWO.)",
          options: [
            { key: "A", text: "When Edit fails due to a non-unique match, fall back to Read (to load full file contents) followed by Write (to save the modified version) for a reliable targeted change." },
            { key: "B", text: "Increase the Edit tool's internal retry count so it tries harder to find a unique match automatically." },
            { key: "C", text: "Always read the entire file with Read before using Edit, regardless of task, to guarantee full context." },
            { key: "D", text: "Replace Edit entirely with Bash-based sed commands for every file modification going forward." },
            { key: "E", text: "Build codebase understanding incrementally: start with Grep to locate relevant entry points and call sites, then use Read selectively to follow imports and trace flow, rather than reading every file upfront." }
          ],
          correct: ["A", "E"],
          explanation: "Falling back to Read + Write is the established pattern when Edit cannot find a unique anchor, and starting with Grep to locate relevant entry points before selectively reading files avoids unnecessary upfront reading. Retrying Edit automatically (B) won't help when the ambiguity is inherent to the file's content, not transient. Always reading the entire file before every Edit (C) reintroduces the exact inefficiency the question is trying to fix. Replacing Edit with Bash-based sed for everything (D) discards a reliable built-in tool for a more error-prone general-purpose substitute."
        },
        {
          id: "P2-S4-Q6",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Vantage Pay created a \"legacy-audit\" skill that performs a deep structural analysis of a module and produces thousands of tokens of intermediate exploratory output before returning a summary. Engineers notice this verbose output floods the main conversation every time the skill runs. What is the most effective fix?",
          options: [
            { key: "A", text: "Add context: fork to the skill's SKILL.md frontmatter so it runs in an isolated sub-agent context and only a summary is returned to the main conversation." },
            { key: "B", text: "Shorten the skill's instructions so it produces less exploratory output." },
            { key: "C", text: "Add allowed-tools: Read to the skill frontmatter to limit which tools it can use." },
            { key: "D", text: "Move the skill from .claude/skills/ to .claude/commands/ so it behaves as a slash command instead, on the assumption that renaming it will also change where its verbose intermediate output is surfaced." }
          ],
          correct: ["A"],
          explanation: "The context: fork frontmatter option is designed exactly for isolating verbose or exploratory skill output in a sub-agent context so it doesn't pollute the main conversation. Shortening the skill's instructions (B) risks degrading the thoroughness of the analysis rather than isolating its output. Restricting allowed-tools (C) controls tool access, not where output lands. Converting the skill to a command (D) doesn't change where its output is surfaced."
        },
        {
          id: "P2-S4-Q7",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "A Vantage Pay engineer asks the productivity agent to evaluate whether a new frontend state-management library should replace the current one across the payments-web package, which touches 30+ components with varying patterns. The agent's initial compatibility sweep across those components is producing pages of per-component exploratory findings that are flooding the conversation before any actual recommendation has been discussed. What is the most effective adjustment?",
          options: [
            { key: "A", text: "Skip any dedicated discovery phase and enter plan mode immediately, trusting plan mode to automatically condense whatever exploratory output it produces internally." },
            { key: "B", text: "Delegate the initial 30+-component compatibility discovery to the Explore subagent so the verbose per-component findings return as a condensed summary, then move into plan mode with the engineer to decide on a migration approach." },
            { key: "C", text: "Use direct execution across all 30+ components right away, since swapping a state-management library is mostly mechanical find-and-replace work, a framing that undersells how many interacting decisions the swap actually involves." },
            { key: "D", text: "Have the engineer manually open and read through all 30+ components before involving the agent in the migration decision at all." }
          ],
          correct: ["B"],
          explanation: "The Explore subagent exists precisely to isolate verbose discovery output into a returned summary, preserving the main conversation's context before the architecturally significant decision is made in plan mode. Jumping straight into plan mode (A) does not eliminate the underlying verbosity problem during discovery. Direct execution (C) understates the architectural implications of a library migration spanning 30+ components with varying patterns. Requiring the engineer to manually review every component first (D) defeats the purpose of delegating discovery to the agent."
        },
        {
          id: "P2-S4-Q8",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "An engineer asks Vantage Pay's productivity agent to \"add comprehensive tests to the legacy payment-reconciliation module.\" The agent currently starts writing tests for the first file it encounters without first understanding the module's structure or risk areas, producing low-value tests for trivial code paths. What is the most effective decomposition approach?",
          options: [
            { key: "A", text: "Set a fixed quota of exactly 20 test files to write regardless of what the module contains." },
            { key: "B", text: "Write tests in strict alphabetical order of filenames until a time budget is exhausted." },
            { key: "C", text: "First map the module's structure, identify high-impact/high-risk areas, then build a prioritized plan that adapts as dependencies are discovered during testing." },
            { key: "D", text: "Ask the engineer to specify every file that needs tests before starting any work." }
          ],
          correct: ["C"],
          explanation: "For open-ended tasks like adding comprehensive tests to a legacy codebase, first mapping structure and identifying high-impact areas, then adapting the plan as dependencies surface, produces far more valuable coverage than an arbitrary starting point. A fixed quota of test files (A) ignores where risk actually concentrates. Alphabetical ordering (B) has no relationship to code risk or impact. Requiring the engineer to pre-specify every file (D) defeats the purpose of delegating open-ended exploration to the agent."
        },
        {
          id: "P2-S4-Q9",
          domain: 3,
          task: "3.3",
          type: "multiple",
          select: 2,
          stem: "Vantage Pay's test file conventions (naming, fixture usage, assertion style) need to apply to every *.test.ts file in the repository, but these files are scattered across a dozen different directories at varying depths. The team currently maintains a directory-level CLAUDE.md in each of those dozen directories, duplicating the same conventions, and they drift out of sync over time. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Keep directory-level CLAUDE.md files but add a script that periodically syncs their contents." },
            { key: "B", text: "Move all conventions into a single monolithic root CLAUDE.md file covering every topic." },
            { key: "C", text: "Instruct the agent via a slash command to \"remember test conventions\" at the start of every session." },
            { key: "D", text: "Replace the duplicated directory-level files with a single .claude/rules/ file using YAML frontmatter paths: [\"**/*.test.ts\"] so the rule loads only when editing matching files, regardless of directory." },
            { key: "E", text: "Use glob-pattern path scoping instead of per-directory CLAUDE.md files, since the convention applies to files by type (test files) rather than by location." }
          ],
          correct: ["D", "E"],
          explanation: "A single .claude/rules/ file with a glob-pattern paths field applies to file type regardless of directory location, eliminating the duplication and drift of per-directory CLAUDE.md files. A sync script (A) treats the symptom of drift rather than removing the duplication itself. A single monolithic root CLAUDE.md (B) would always load in full and wastes tokens when editing unrelated files. A slash command reminder (C) doesn't persist reliably or scope conventions to the right files."
        },
        {
          id: "P2-S4-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "Vantage Pay asks the productivity agent to design a new rate-limiting middleware for an internal API gateway, a domain the agent hasn't touched in this codebase before. The team wants burst-handling behavior, per-client versus global limits, and failure-mode behavior under backend outages all settled before any code is written, but hasn't fully specified those choices themselves. What is the most effective technique?",
          options: [
            { key: "A", text: "Write one exhaustive prose paragraph up front describing every conceivable edge case the team can think of, an approach that looks thorough on the page but still depends entirely on the team anticipating every consideration themselves in advance." },
            { key: "B", text: "Have the agent silently assume whichever rate-limiting algorithm is most common industry-wide and implement it without asking any questions, to avoid slowing the team down." },
            { key: "C", text: "Use the interview pattern: have the agent ask clarifying questions about per-client versus global limits, burst allowances, and outage behavior before writing any implementation, surfacing considerations the team hasn't fully worked through yet." },
            { key: "D", text: "Have the agent write the entire middleware module first, then schedule a separate review meeting days later to raise any open design questions, since getting a concrete implementation in front of the team often surfaces gaps faster than abstract discussion alone." }
          ],
          correct: ["C"],
          explanation: "The interview pattern — having the agent ask questions before implementing — is specifically suited to unfamiliar domains where the team hasn't fully anticipated considerations like burst handling and failure modes. Assuming an industry-default algorithm (B) risks building the wrong thing for Vantage Pay's actual needs without surfacing any of the open questions. A single long prose paragraph (A) still relies on the team anticipating every edge case themselves, which they've already said they haven't done. Implementing first and reviewing later (D) risks costly rework instead of surfacing considerations before implementation."
        },
        {
          id: "P2-S4-Q11",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "A Vantage Pay engineer asks the productivity agent to (a) fix a single off-by-one error in one validation function with a clear stack trace, and separately (b) migrate the entire legacy ORM layer across 60+ files to a new library with several viable migration strategies. The team currently uses direct execution for both tasks. What is the most effective adjustment?",
          options: [
            { key: "A", text: "Use plan mode for both tasks, since plan mode always produces more reliable code regardless of task size." },
            { key: "B", text: "Use direct execution for the single-file bug fix, and plan mode for the ORM migration, given its architectural implications and multiple valid approaches." },
            { key: "C", text: "Use plan mode only for the bug fix, since it is the more urgent task, and direct execution for the migration, reasoning that urgency alone should determine which process is heavier rather than architectural scope." },
            { key: "D", text: "Split the ORM migration into 60 separate direct-execution sessions, one per file, to avoid needing plan mode." }
          ],
          correct: ["B"],
          explanation: "Direct execution is appropriate for simple, well-scoped changes like a single-file bug fix with a clear stack trace, while plan mode is designed for tasks with architectural implications and multiple valid approaches, exactly describing the ORM migration. Using plan mode for both (A) adds unnecessary overhead to the trivial fix. Reversing the assignment (C) applies the heavyweight process to the simple task and the lightweight process to the complex one. Splitting the migration into 60 independent sessions (D) loses the cross-file architectural view that makes plan mode valuable here."
        },
        {
          id: "P2-S4-Q12",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Vantage Pay's productivity agent currently stops its tool-calling loop after exactly 8 iterations no matter what, which sometimes cuts off legitimate multi-step refactors partway through and sometimes lets trivial tasks run unnecessary extra iterations before the cap kicks in. What is the most effective fix?",
          options: [
            { key: "A", text: "Reduce the cap to 5 iterations so trivial tasks finish faster." },
            { key: "B", text: "Increase the cap to 20 iterations to give the agent more room to finish complex refactors." },
            { key: "C", text: "Keep the cap but add a secondary model call to double-check whether the task looks finished at iteration 8." },
            { key: "D", text: "Drive loop continuation from the API's stop_reason field, continuing while it is \"tool_use\" and stopping on \"end_turn\", rather than relying on an arbitrary iteration count as the primary stopping mechanism." }
          ],
          correct: ["D"],
          explanation: "Using stop_reason as the control-flow signal is the deterministic, task-appropriate way to know when the model is actually finished, rather than guessing with any fixed number. Lowering the cap (A) only makes the premature cutoffs worse. Raising the cap (B) just delays the same fundamental problem to a higher iteration count. Adding a secondary model call (C) is unnecessary overhead when stop_reason already provides a reliable signal."
        },
        {
          id: "P2-S4-Q13",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "A Vantage Pay MCP tool, run_build, wraps the legacy build system. It currently returns isError: true with no further detail whenever anything fails, whether the build server was briefly unreachable, the code has a genuine compile error, or the agent lacks permission to trigger a production build. The agent cannot decide whether retrying is worthwhile. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Add an errorCategory field (e.g., transient, validation, permission) describing the type of failure so the agent understands what actually went wrong." },
            { key: "B", text: "Keep a single isError flag but add a longer, more detailed-sounding generic message for all failure types." },
            { key: "C", text: "Add an isRetryable boolean so the agent avoids wasting retries on non-transient failures like genuine compile errors or permission issues." },
            { key: "D", text: "Have the agent automatically retry every run_build failure exactly twice before giving up." },
            { key: "E", text: "Remove the isError flag entirely and instead have the tool throw an unhandled exception for every failure type." }
          ],
          correct: ["A", "C"],
          explanation: "An errorCategory field combined with an isRetryable boolean gives the agent the structured signal it needs to decide whether retrying makes sense for a given failure type. A longer but still generic message (B) is the same uniform-response anti-pattern dressed up differently. Automatically retrying every failure twice (D) wastes attempts on non-retryable compile errors and permission issues. An unhandled exception for every case (E) is even less informative than the current isError flag."
        },
        {
          id: "P2-S4-Q14",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "An engineer asks Vantage Pay's productivity agent to \"normalize all legacy date strings to a consistent format\" in a data-migration script, but the prose instruction is interpreted inconsistently — sometimes producing MM/DD/YYYY, sometimes ISO 8601, depending on which examples the agent happens to process first. What is the most effective fix?",
          options: [
            { key: "A", text: "Rephrase the instruction using stronger adjectives like \"always\" and \"strictly\" to reduce ambiguity, relying on emphatic wording alone to pin down the one specific transformation prose has already failed to communicate." },
            { key: "B", text: "Add an arbitrary cap on how many date formats the agent is allowed to encounter per run." },
            { key: "C", text: "Provide 2-3 concrete input/output examples showing exactly how specific date formats should be transformed, clarifying the expected transformation where prose alone produced inconsistent results." },
            { key: "D", text: "Increase the model context window so it can consider more of the script at once, on the assumption that giving the model more surrounding text to read will naturally resolve which specific date format the team actually intends." }
          ],
          correct: ["C"],
          explanation: "Concrete input/output examples are the most effective way to communicate an exact expected transformation when prose descriptions alone produce inconsistent results. Stronger adjectives (A) are still prose and don't resolve the underlying ambiguity about the target format. An arbitrary cap on date formats encountered (B) doesn't specify what the correct output format actually is. A larger context window (D) doesn't clarify which format is intended."
        },
        {
          id: "P2-S4-Q15",
          domain: 2,
          task: "2.5",
          type: "single",
          select: 1,
          stem: "Vantage Pay's productivity agent is asked to generate a new boilerplate service file from a template, and separately to add a single import line to an existing 500-line file. The agent currently uses Write for both tasks, regenerating the entire 500-line file's content just to add one import line, which occasionally drops unrelated content due to truncation. What is the most effective fix?",
          options: [
            { key: "A", text: "Use Bash with a custom append command to add the import line instead of any built-in file tool, a low-level substitute that bypasses the Edit tool's unique-anchor matching and reimplements similar logic manually." },
            { key: "B", text: "Use Write for both tasks to keep tool usage simple and consistent." },
            { key: "C", text: "Use Read to display the file to the engineer and ask them to add the import line manually, which avoids any risk of the tool mangling the file but pushes a trivial one-line change back onto the very engineer the agent is meant to assist." },
            { key: "D", text: "Use Write for full new-file creation from a template, and Edit for the targeted single-line import addition to the existing file, reserving Write only for cases where Edit cannot find a unique anchor." }
          ],
          correct: ["D"],
          explanation: "Write is appropriate for full-file operations like generating new boilerplate from scratch, while Edit is designed for targeted modifications using unique text matching, with Write as a fallback only when Edit's anchor isn't unique. Using Write for both tasks (B) is exactly the risky regeneration pattern causing accidental content loss. A custom Bash append command (A) duplicates functionality the built-in tools already handle more reliably. Asking the engineer to edit manually (C) defeats the purpose of using an automation agent for a trivial change."
        }
      ]
    },
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P2-S6-Q1",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Harborview Health Administrative Services' extraction tool defines \"priorAuthorizationNumber\" as a required string field in its JSON schema. Many legitimate provider invoices simply don't include a prior-authorization number because the service didn't require one, yet the model is fabricating plausible-looking numbers to satisfy the required field. What is the most effective fix?",
          options: [
            { key: "A", text: "Make priorAuthorizationNumber an optional (nullable) field in the schema so the model can return null when the source document doesn't contain one, rather than inventing a value." },
            { key: "B", text: "Add a stricter instruction telling the model \"never make up data under any circumstances.\"" },
            { key: "C", text: "Keep the field required, but add a regex validator that rejects clearly fake-looking numbers after extraction." },
            { key: "D", text: "Remove the field from the schema entirely so it never needs to be extracted." }
          ],
          correct: ["A"],
          explanation: "Designing the field as optional/nullable directly removes the pressure on the model to fabricate a value when the source document genuinely lacks one. A blanket prompt instruction (B) is probabilistic and has already failed to prevent fabrication. A post-hoc regex validator (C) only catches obviously fake-looking numbers, not plausible-looking fabrications. Removing the field entirely (D) discards legitimate data when it is actually present on some invoices."
        },
        {
          id: "P2-S6-Q2",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Harborview's extraction pipeline has three separate extraction tools — extract_invoice, extract_prior_auth, and extract_eligibility — but documents arrive through a shared ingestion queue with no reliable type tag attached. With tool_choice currently set to \"auto,\" the model occasionally responds with a prose summary of the document instead of calling any extraction tool, which breaks the downstream parser expecting structured tool output every time. What is the most effective fix?",
          options: [
            { key: "A", text: "Keep tool_choice set to \"auto\" but add a more forceful prompt instruction insisting the model must never reply with prose under any circumstances." },
            { key: "B", text: "Force tool_choice to {\"type\": \"tool\", \"name\": \"extract_invoice\"} for every incoming document, regardless of its actual type, so the pipeline always receives one consistent schema." },
            { key: "C", text: "Set tool_choice to \"any\" so the model must call one of the three extraction tools on every request, while still letting it choose which tool fits the specific incoming document." },
            { key: "D", text: "Add a fourth extract_any tool with a completely freeform, schema-less structure so the model always has some trivial tool to fall back on when unsure, since having an escape hatch available seems safer than forcing a choice among the three typed extractors." }
          ],
          correct: ["C"],
          explanation: "tool_choice: \"any\" guarantees the model calls some tool on every request while still letting it pick the extraction tool matching the actual document type, which is appropriate when the document type isn't known in advance. Forcing a specific tool like extract_invoice (B) breaks every prior-authorization and eligibility document routed to it. A stronger prompt instruction under \"auto\" (A) is still probabilistic and has already failed to prevent prose responses. A freeform fallback tool (D) discards the schema-compliance guarantee that structured extraction depends on."
        },
        {
          id: "P2-S6-Q3",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Harborview's extraction pipeline currently flags \"possible billing discrepancy\" whenever its self-reported confidence in a line-item total is below an arbitrary threshold, producing a high false-positive rate that has eroded reviewers' trust in the flag overall. What is the most effective fix?",
          options: [
            { key: "A", text: "Lower the confidence threshold further so fewer items are flagged." },
            { key: "B", text: "Instruct the model to \"only flag high-confidence discrepancies\" in the prompt, a rewording that still leaves the model privately judging what counts as high enough confidence, the same self-assessed-certainty problem as before." },
            { key: "C", text: "Replace the confidence-threshold trigger with explicit criteria defining exactly what constitutes a discrepancy (e.g., line items that don't sum to the stated total, or amounts in the wrong currency field)." },
            { key: "D", text: "Remove the discrepancy flag feature entirely since it cannot be made reliable." }
          ],
          correct: ["C"],
          explanation: "Explicit, concrete criteria for what counts as a discrepancy address the actual root cause, whereas confidence thresholds and vague instructions like \"be conservative\" don't reliably improve precision. Simply lowering the threshold (A) is still a confidence-based heuristic with the same underlying unreliability. A vague instruction to flag only high-confidence cases (B) suffers from the same self-reported-confidence problem. Removing the feature entirely (D) discards a potentially valuable check instead of fixing its criteria."
        },
        {
          id: "P2-S6-Q4",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Harborview's document-ingestion step currently passes the full raw OCR output of every scanned invoice — including repeated letterhead boilerplate on every page — directly into the extraction prompt. For multi-page invoices, this boilerplate makes up over half of the context, and the model occasionally references the wrong page's data. What is the most effective fix?",
          options: [
            { key: "A", text: "Summarize the entire OCR output into a short paragraph before extraction." },
            { key: "B", text: "Increase the context window so the full OCR output, boilerplate included, always fits comfortably, treating extra capacity as a substitute for actually removing the content consuming it disproportionately." },
            { key: "C", text: "Split each page into a separate extraction call to shrink the per-call context size, treating smaller per-call context as inherently safer even though the repeated boilerplate would still be present on every individual page call." },
            { key: "D", text: "Strip repeated non-informational boilerplate (letterhead, page headers/footers) from the OCR output before it is added to the extraction prompt's context." }
          ],
          correct: ["D"],
          explanation: "Trimming repeated, non-informational boilerplate before it enters the prompt reduces noise at the source without risking loss of the actual invoice data. Summarizing the whole document (A) risks condensing away the precise figures the extraction step needs. A larger context window (B) doesn't remove the irrelevant content disproportionately consuming tokens. Splitting by page (C) adds pipeline complexity without addressing the actual source of the bloat."
        },
        {
          id: "P2-S6-Q5",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 2,
          stem: "Harborview's extraction schema defines a serviceCategory enum with 12 fixed values (e.g., \"office_visit\", \"lab_test\", \"imaging\"). New provider networks are submitting invoices for service types that don't fit any of the 12 categories, and the model is forced to pick the closest wrong category every time, corrupting downstream reporting. Which two schema changes would most effectively address this? (Select TWO.)",
          options: [
            { key: "A", text: "Add a 13th fixed enum value for every new service type the moment it's discovered." },
            { key: "B", text: "Add an \"other\" enum value alongside the 12 fixed categories." },
            { key: "C", text: "Add a companion \"serviceCategoryDetail\" free-text field that captures the specific description whenever \"other\" is selected." },
            { key: "D", text: "Remove the enum constraint entirely and let the model write any free-text category string it wants." },
            { key: "E", text: "Force the model to always pick the single closest matching fixed category, even when none truly fits." }
          ],
          correct: ["B", "C"],
          explanation: "The \"other\" + detail-string pattern lets the schema remain extensible: an \"other\" enum value captures cases outside the fixed set, and a companion free-text field preserves the actual description for later analysis. Continuously adding new fixed enum values (A) is a maintenance burden that always lags behind new service types. Removing the enum entirely (D) sacrifices the consistency enums provide for the categories that do fit. Forcing the model to pick the closest wrong category (E) is exactly the corrupting behavior the question describes."
        },
        {
          id: "P2-S6-Q6",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Harborview's extraction model performs well on invoices with tabular line items but frequently produces incomplete or null line-item extractions when a provider's invoice describes services in narrative paragraph form instead of a table. Prose instructions alone have not resolved this. What is the most effective fix?",
          options: [
            { key: "A", text: "Add 2-4 few-shot examples showing correct line-item extraction from both tabular and narrative-style invoices, demonstrating the expected output for each format." },
            { key: "B", text: "Add a longer, more detailed prose description of what a \"line item\" means in general." },
            { key: "C", text: "Reject narrative-style invoices automatically and request the provider resubmit in tabular form, pushing the burden of reformatting onto providers instead of handling the variation the extraction step should manage." },
            { key: "D", text: "Increase the model's context window so narrative invoices are less likely to be truncated." }
          ],
          correct: ["A"],
          explanation: "Few-shot examples demonstrating correct extraction from both tabular and narrative document structures are the most effective way to handle varied formats when prose alone has already proven insufficient. A longer prose description (B) is the same approach that has already failed to resolve the issue. Rejecting narrative invoices (C) pushes a solvable extraction problem onto providers unnecessarily. A larger context window (D) doesn't address the format-handling gap at all."
        },
        {
          id: "P2-S6-Q7",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Harborview's extraction model regularly produces plausible-looking but incorrect values for a \"serviceDate\" field when invoices use informal, ambiguous shorthand — \"wk of 3/4,\" \"early Jan,\" or a handwritten \"3-4\" that could mean March 4th or April 3rd depending on the originating region. A prose instruction telling the model to \"resolve ambiguous dates using surrounding context\" has not reduced the fabrication rate. What is the most effective fix?",
          options: [
            { key: "A", text: "Add 2-4 few-shot examples showing several informal date formats resolved correctly, including one example where the correct output is null because the true date genuinely cannot be determined, rather than guessed." },
            { key: "B", text: "Expand the existing prose instruction with stronger adjectives like \"carefully\" and \"precisely\" when resolving ambiguous dates." },
            { key: "C", text: "Mark serviceDate as a required field so the model is never permitted to omit a value, which eliminates missing values but does nothing to stop the model from inventing a plausible date when the true one is unknown." },
            { key: "D", text: "Remove the serviceDate field from the extraction schema entirely so the model is never asked to resolve ambiguous dates, treating the removal of a difficult field as equivalent to solving the underlying date-resolution problem." }
          ],
          correct: ["A"],
          explanation: "Few-shot examples are the most effective technique for reducing hallucination in extraction tasks involving informal or inconsistently formatted source data, and an example demonstrating a correct null output teaches the model when to decline rather than guess. Stronger adjectives (B) are still prose instructions of the same kind that already failed to help. Making the field required (C) directly increases pressure to fabricate a value when none can genuinely be determined. Removing the field (D) discards data that is recoverable for the many invoices with unambiguous dates."
        },
        {
          id: "P2-S6-Q8",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "Harborview's validation step checks whether extracted line-item amounts sum to the extracted invoice total. For one invoice, the mismatch is a genuine formatting slip the model can likely self-correct on retry; for another, the invoice total field is a handwritten note that is simply illegible and the true total doesn't appear anywhere in the document. The pipeline currently retries both cases identically up to 3 times. What is the most effective approach?",
          options: [
            { key: "A", text: "Retry both cases the same number of times, since more attempts generally improve accuracy." },
            { key: "B", text: "Stop retrying entirely and route every sum-mismatch case straight to human review without attempting self-correction." },
            { key: "C", text: "Retry with the specific validation error included in the follow-up prompt for the formatting-slip case, since that error is correctable, but recognize that retries are ineffective when the required value is genuinely absent from the source document and route that case directly for human review instead." },
            { key: "D", text: "Increase the number of retry attempts to 10 for all sum-mismatch cases to maximize the chance of eventual success." }
          ],
          correct: ["C"],
          explanation: "Retry-with-error-feedback is effective for format or structural mismatches, but retries are ineffective when the information is simply absent from the source document, so the pipeline should branch based on which situation it's facing. Treating both cases identically (A) wastes retry attempts on a case that can never succeed. Never retrying at all (B) forgoes a genuinely correctable error that retry-with-feedback would likely fix. Increasing attempts to 10 for all cases (D) still wastes effort on the illegible-total case."
        },
        {
          id: "P2-S6-Q9",
          domain: 5,
          task: "5.5",
          type: "multiple",
          select: 2,
          stem: "Harborview's extraction pipeline outputs a field-level confidence score for every extracted value, but currently every invoice is routed to full human review regardless of confidence, consuming reviewer capacity that could be spent elsewhere. A pilot test found that confidence scores do correlate with actual error rates, but only after being checked against a labeled validation set. Which two changes would most effectively set up a reliable confidence-based review workflow? (Select TWO.)",
          options: [
            { key: "A", text: "Calibrate field-level confidence thresholds for routing using a labeled validation set, rather than trusting the model's raw confidence scale directly." },
            { key: "B", text: "Route every invoice to human review until the model achieves 100% accuracy on all fields." },
            { key: "C", text: "Trust the model's raw confidence scores immediately without validation, since a pilot already suggested they correlate with error rates." },
            { key: "D", text: "Route only invoices below the calibrated confidence threshold (or with ambiguous/contradictory source documents) to human review, reserving reviewer capacity for cases that need it most." },
            { key: "E", text: "Disable confidence scoring entirely since it adds extra output fields to every extraction." }
          ],
          correct: ["A", "D"],
          explanation: "Calibrating thresholds against a labeled validation set and then routing only low-confidence or ambiguous cases to review is exactly the prescribed pattern for confidence-based routing that conserves reviewer capacity. Requiring 100% accuracy before reducing review (B) is an unrealistic bar that never allows automation to begin. Trusting raw, uncalibrated confidence scores directly (C) risks routing decisions on a scale that hasn't been validated. Disabling confidence scoring (E) removes the exact signal needed to route intelligently."
        },
        {
          id: "P2-S6-Q10",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Harborview wants to run its extraction pipeline across a backlog of 50,000 historical invoices for a quarterly compliance audit, where results are needed within the next two weeks but not immediately. Separately, the live intake pipeline must extract data from newly scanned invoices before they can be routed to processors within minutes. The team is considering using the Message Batches API for both workflows. What is the most effective approach?",
          options: [
            { key: "A", text: "Use the Message Batches API for both workflows, since it is always cheaper regardless of latency needs." },
            { key: "B", text: "Use the synchronous API for both workflows, since batch processing cannot guarantee any particular response structure, even though a predictable shape is already guaranteed by the extraction schema regardless of which API delivers it." },
            { key: "C", text: "Use the Message Batches API for live intake, since its 50% cost savings outweigh the need for immediate processing." },
            { key: "D", text: "Use the Message Batches API for the non-blocking quarterly audit backlog, and the synchronous API for the latency-sensitive live intake pipeline, since batch processing offers no latency SLA." }
          ],
          correct: ["D"],
          explanation: "The Message Batches API is appropriate for non-blocking, latency-tolerant workloads like a two-week compliance backlog, but it offers no latency SLA and up to a 24-hour processing window, making it unsuitable for a minutes-level live intake pipeline. Using batch for both (A) would break the live intake pipeline's latency requirement. Using the synchronous API for both (B) forgoes the batch API's substantial cost savings on a workload that doesn't need low latency. Using batch for live intake specifically (C) sacrifices the exact timeliness that workflow depends on."
        },
        {
          id: "P2-S6-Q11",
          domain: 4,
          task: "4.6",
          type: "single",
          select: 1,
          stem: "After Harborview's extraction model produces structured output for a complex invoice, the same model instance is asked, within the same session, to double-check its own extraction for errors. It rarely finds any issues, yet a separate audit later finds a meaningful number of subtle field-placement errors in exactly these self-reviewed extractions. What is the most effective fix?",
          options: [
            { key: "A", text: "Route the extracted output to a second, independent Claude instance for review, since it does not retain the generation reasoning context and is more likely to catch subtle issues the original model is unlikely to question." },
            { key: "B", text: "Ask the same model instance to use extended thinking before confirming its own extraction is correct." },
            { key: "C", text: "Have the same model instance self-report a numeric confidence score and only flag extractions below a threshold." },
            { key: "D", text: "Re-run the identical extraction prompt a second time in the same session and compare the two outputs for differences." }
          ],
          correct: ["A"],
          explanation: "An independent review instance without the generator's reasoning context is more effective at catching subtle issues than asking the same session to self-review, since the generating model retains reasoning context that makes it less likely to question its own decisions. Extended thinking within the same session (B) is still subject to that same self-review limitation. A self-reported confidence score (C) is an unreliable proxy for actual correctness. Re-running the same prompt in the same session (D) is likely to reproduce the same reasoning and the same blind spots."
        },
        {
          id: "P2-S6-Q12",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Harborview wants to move its nightly reconciliation step to the Message Batches API for the 50% cost savings. That step currently performs multi-turn tool interaction within a single request: it calls a lookup tool, inspects the returned result, and then issues a follow-up message in the same request asking the model to reconcile that result against the invoice before producing a final answer. What is the most effective course of action?",
          options: [
            { key: "A", text: "Recognize that the Message Batches API does not support multi-turn tool calling within a single request, so the reconciliation workflow needs to be redesigned (e.g., sequential batch submissions correlated by custom_id, or kept on the synchronous API) before moving it to batch." },
            { key: "B", text: "Move the entire reconciliation workflow to the Batches API unchanged, since the 50% cost savings apply no matter how many tool-calling turns a single request performs." },
            { key: "C", text: "Keep the workflow on the Batches API but extend the batch processing window from 24 hours to 48 hours, mistakenly assuming that a longer overall processing window changes how a single request's internal tool-calling behavior works, rather than just how long results take to arrive." },
            { key: "D", text: "Attach a custom_id to each multi-turn exchange so the Batches API can automatically resume the tool conversation across multiple days if the first attempt does not finish, mistakenly assuming custom_id correlates ongoing conversational state the same way a persistent session identifier would across separate requests." }
          ],
          correct: ["A"],
          explanation: "The Batch API does not support multi-turn tool calling within a single request, so a workflow that calls a tool and then issues a follow-up message based on its result cannot simply be moved to batch unchanged. Moving it unchanged (B) will break the reconciliation step the moment it tries to execute its mid-request follow-up. Extending the processing window (C) addresses overall turnaround time, not the request-level inability to chain a tool call and a follow-up message. custom_id (D) exists to correlate independent request/response pairs, not to resume an in-progress multi-turn exchange."
        },
        {
          id: "P2-S6-Q13",
          domain: 4,
          task: "4.3",
          type: "multiple",
          select: 3,
          stem: "Harborview is redesigning its claim-extraction schema after a review found three recurring problems: (1) a \"secondaryInsuranceId\" required field forces the model to fabricate values for the many patients who have no secondary insurance; (2) a \"claimType\" enum with 8 fixed values forces newly emerging claim types into the closest wrong bucket; (3) the schema currently returns a bare JSON string the pipeline parses manually, which occasionally produces syntax errors on malformed output. Which three changes would most effectively address these problems? (Select THREE.)",
          options: [
            { key: "A", text: "Keep all fields required so downstream systems never have to handle missing values." },
            { key: "B", text: "Make \"secondaryInsuranceId\" an optional (nullable) field so the model returns null when a patient genuinely has no secondary insurance, instead of fabricating a value." },
            { key: "C", text: "Force \"claimType\" to always select the closest of the 8 existing fixed values, even when none truly fits, to keep the enum simple." },
            { key: "D", text: "Add an \"other\" value to the \"claimType\" enum alongside a companion free-text detail field for emerging claim types that don't fit the fixed categories." },
            { key: "E", text: "Use tool use (tool_use) with the extraction schema as the tool's input parameters, instead of parsing a raw JSON string, to guarantee schema-compliant output and eliminate syntax errors." }
          ],
          correct: ["B", "D", "E"],
          explanation: "Making genuinely optional fields nullable prevents fabrication, the \"other\" + detail-string pattern keeps enums extensible for emerging categories, and tool use with a JSON schema eliminates syntax errors that come from manually parsing raw JSON strings. Keeping all fields required (A) is exactly what causes fabrication for data that legitimately doesn't exist. Forcing the model into the closest wrong enum bucket (C) is the corrupting behavior the redesign is meant to eliminate."
        },
        {
          id: "P2-S6-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Harborview's pipeline extracts detailed per-invoice data, then a later aggregation step summarizes groups of invoices into a single rolled-up report for finance. Reviewers notice that specific dollar amounts and dates from individual invoices are being condensed into vague phrases like \"several claims around mid-quarter\" by the time they reach the rolled-up report, even though the original extractions were precise. What is the most effective fix?",
          options: [
            { key: "A", text: "Stop producing per-invoice extractions altogether and have finance work directly from scanned documents, which sidesteps the summarization-loss problem but discards the efficiency and structure the extraction pipeline was built to provide in the first place." },
            { key: "B", text: "Instruct the aggregation step to \"be more precise\" when summarizing." },
            { key: "C", text: "Persist the precise transactional facts (amounts, dates, claim numbers) from each extraction into a structured layer that the aggregation step reads directly, rather than relying on it to preserve precision through prose summarization." },
            { key: "D", text: "Increase the aggregation step context window so it can hold more invoices at once, on the assumption that more available context automatically preserves exact dollar amounts and dates rather than just giving the model more material to summarize." }
          ],
          correct: ["C"],
          explanation: "Progressive summarization risks condensing exact numerical values and dates into vague prose, so persisting precise transactional facts into a structured layer that aggregation reads directly avoids that lossy step entirely. Abandoning per-invoice extraction (A) throws away the precision the pipeline already achieves upstream. A vague prompt instruction (B) is still subject to the same summarization pressure already causing the problem. A larger context window (D) doesn't prevent the model from choosing to summarize imprecisely."
        },
        {
          id: "P2-S6-Q15",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Harborview's extraction pipeline flags data-quality issues with severities of \"critical,\" \"moderate,\" and \"minor,\" but reviewers find the same type of issue (e.g., a missing optional field) gets inconsistently labeled across different invoices, sometimes critical and sometimes minor, because the prompt only says to use \"your best judgment\" for severity. What is the most effective fix?",
          options: [
            { key: "A", text: "Remove the severity labels entirely and treat every flagged issue the same way." },
            { key: "B", text: "Instruct the model to \"be consistent\" when assigning severity levels." },
            { key: "C", text: "Have a human reviewer manually re-assign severity after the fact for every flagged issue." },
            { key: "D", text: "Define explicit severity criteria with concrete examples for each level (e.g., missing a required field affecting claim adjudication = critical; missing an optional field with no downstream effect = minor) to achieve consistent classification." }
          ],
          correct: ["D"],
          explanation: "Defining explicit severity criteria with concrete code or data examples for each level is what achieves consistent classification, since vague judgment-based instructions produce exactly the inconsistency described. Removing severity labels (A) discards useful triage information instead of fixing its consistency. Telling the model to \"be consistent\" (B) is the same kind of vague instruction that already failed. Manually re-assigning severity after the fact (C) doesn't scale and defeats the purpose of automated triage."
        }
      ]
    }
  ]
});
