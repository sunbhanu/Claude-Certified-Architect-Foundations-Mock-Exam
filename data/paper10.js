window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 10,
  title: "Mock Exam 10",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P10-S1-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Aurora Marketplace's support agent loop was implemented to terminate as soon as the assistant's text response contains the word 'resolved,' rather than inspecting the API's stop_reason field. This causes the loop to sometimes stop before any tool has actually been called, and sometimes to keep running past a genuinely final answer that happened not to use that word. What is the most effective fix?",
          options: [
            { key: "A", text: "Expand the keyword list to include 'completed,' 'done,' and 'resolved the issue' so more phrasings are caught." },
            { key: "B", text: "Have a second Claude call classify whether the first response text means the case is resolved, and use that classification to stop the loop, which keeps termination flexible without maintaining brittle keyword lists in application code." },
            { key: "C", text: "Add a hard cap of 8 iterations so a runaway loop cannot continue indefinitely even if the keyword check misfires, which bounds worst-case latency and cost without requiring any change to the unreliable termination signal driving the loop." },
            { key: "D", text: "Check whether stop_reason equals 'end_turn' to terminate the loop, and continue executing tools and feeding results back into the conversation while stop_reason is 'tool_use.'" }
          ],
          correct: ["D"],
          explanation: "The agentic loop should be driven by stop_reason ('tool_use' means continue executing tools and returning results; 'end_turn' means stop), not by parsing assistant text for keywords. Option A is the same anti-pattern with a longer keyword list. Option C treats a correctness bug as a safety-net problem and would cut off legitimate multi-step resolutions. Option B adds another unreliable natural-language classifier on top of the original unreliable one instead of using the structured signal the API already provides."
        },
        {
          id: "P10-S1-Q2",
          domain: 1,
          task: "1.4",
          type: "multiple",
          select: 2,
          stem: "Aurora's finance team mandates that every process_refund call above $750 must be routed to escalate_to_human with zero tolerance for violations, but the platform team wants to avoid a large engineering rewrite this sprint. An existing hook already blocks process_refund until get_customer has returned a verified customer ID. Which two actions together best satisfy both the compliance guarantee and the proportionate-effort constraint? (Select TWO.)",
          options: [
            { key: "A", text: "Add a few-shot example to the system prompt showing the agent escalating a $900 refund request." },
            { key: "B", text: "Add a system prompt instruction telling the agent to always escalate refunds above $750, and monitor compliance through weekly log review." },
            { key: "C", text: "Build a programmatic interception point that blocks any process_refund call above $750 from reaching the backend and redirects it to the escalation workflow." },
            { key: "D", text: "Extend the existing verification hook's condition to also check the refund amount parameter and redirect to escalate_to_human above $750, rather than writing an entirely new hook." },
            { key: "E", text: "Replace process_refund with a machine-learned risk classifier that gates execution on a predicted risk score." }
          ],
          correct: ["C", "D"],
          explanation: "A programmatic interception (hook) that blocks and redirects refunds above the threshold gives a deterministic, zero-tolerance guarantee, and extending the existing hook is the smallest change that achieves it. Options B and A rely on probabilistic prompt compliance, which the finance team's 'zero tolerance' requirement explicitly rules out. Option E introduces a new ML system when the threshold check is a simple deterministic comparison, which is disproportionate engineering effort."
        },
        {
          id: "P10-S1-Q3",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Aurora's three backend tools return timestamps in three different formats (Unix epoch, ISO 8601, and 'MM/DD/YYYY'). In 9% of multi-event cases the agent misorders events because it reasons incorrectly about which happened first. What is the most effective first step?",
          options: [
            { key: "A", text: "Increase max_tokens so the model has more room to reason carefully about comparing the different date formats, on the theory that more generated reasoning tokens will reliably reduce misordering mistakes." },
            { key: "B", text: "Add a PostToolUse hook that normalizes every timestamp field to a single format (e.g. ISO 8601) before the tool result reaches the model." },
            { key: "C", text: "Add a system prompt instruction asking the agent to convert all timestamps to a common format before reasoning about event order, so the model never has to interpret mixed formats itself." },
            { key: "D", text: "Add a few-shot example demonstrating correct chronological reasoning across mixed timestamp formats." }
          ],
          correct: ["B"],
          explanation: "A PostToolUse hook that normalizes heterogeneous timestamp formats before the model ever sees them removes the ambiguity at its source and guarantees consistency. Options C and D rely on the model correctly performing date-format conversion and comparison on every turn, which is exactly the kind of probabilistic reasoning causing the 9% error rate. Option D adds no new information to resolve the comparison and option A does not address the actual source of the error."
        },
        {
          id: "P10-S1-Q4",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "A customer message raises three distinct concerns in one message: a wrong item shipped, being double-billed, and a question about loyalty points. The agent currently resolves only the first concern and stops. Which two practices correctly restructure how the agent handles multi-concern requests? (Select TWO.)",
          options: [
            { key: "A", text: "Ask the customer to resubmit the message as three separate tickets, one per concern, so each can be investigated in isolation." },
            { key: "B", text: "Pick only the highest-value concern (the double billing) and defer the rest to a follow-up message." },
            { key: "C", text: "Fully resolve and, if needed, escalate the wrong-item concern end-to-end before even looking at the billing or loyalty questions." },
            { key: "D", text: "Decompose the message into its distinct concerns before beginning any investigation." },
            { key: "E", text: "Investigate each concern with the relevant tools using the shared conversation context, then synthesize one unified reply covering all three." }
          ],
          correct: ["D", "E"],
          explanation: "Multi-concern requests should be decomposed into distinct items up front and then investigated in parallel using shared context before a single synthesized response is produced. Option C describes the current broken sequential behavior that caused the complaint. Option A shifts the decomposition burden onto the customer instead of fixing the agent, and option B silently drops concerns rather than addressing all of them."
        },
        {
          id: "P10-S1-Q5",
          domain: 1,
          task: "1.7",
          type: "single",
          select: 1,
          stem: "A billing dispute case is reopened three days after it was last worked. In the intervening time, the order's refund status changed from 'pending' to 'completed' in the backend, so the agent's prior tool results are now stale. What is the most reliable way to continue the investigation?",
          options: [
            { key: "A", text: "Resume the previous named session with --resume and let the agent proceed using its existing tool results from three days ago, since cached tool output is cheaper than re-querying systems and keeps the investigation consistent." },
            { key: "B", text: "Resume the previous named session with --resume and instruct the agent to generically 'double check everything' before responding, trusting broad self-verification language to surface whichever specific facts happen to have changed since the case was last touched." },
            { key: "C", text: "Start a new session, inject a structured summary of the prior findings, and explicitly tell the agent the refund status has since changed to 'completed' so it re-checks only what's relevant." },
            { key: "D", text: "Start a completely new session with no reference to any prior findings so the agent re-investigates the case from scratch." }
          ],
          correct: ["C"],
          explanation: "Starting fresh with an injected structured summary and an explicit note about what changed is more reliable than resuming with stale tool results, because it directs the agent to the specific fact that invalidated the prior analysis. Option A silently relies on outdated data. Option B is too vague to reliably trigger targeted re-verification. Option D discards valid prior findings and forces unnecessary full re-exploration."
        },
        {
          id: "P10-S1-Q6",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "Human agents handling Aurora's escalated billing disputes report they must re-ask customers for information already provided to the bot, because the current escalation message is just 'Customer needs help with a billing issue.' What change to the escalation payload most effectively fixes this?",
          options: [
            { key: "A", text: "Add an urgency flag to the escalation so human agents prioritize the ticket higher in the queue." },
            { key: "B", text: "Forward the complete raw conversation transcript verbatim so the human agent can read through everything themselves, ensuring no detail is lost or filtered by the agent's own interpretation and that the human has complete context." },
            { key: "C", text: "Compile a structured handoff summary containing the customer ID, root cause analysis, disputed amount, and a recommended action, since the human agent lacks access to the conversation transcript." },
            { key: "D", text: "Add a sentiment score to the escalation payload so the human agent knows how upset the customer currently is, on the assumption that knowing the customer's emotional tone will compensate for the missing factual details about the case itself." }
          ],
          correct: ["C"],
          explanation: "A structured handoff summary with customer details, root cause, amounts, and a recommended action gives the human agent exactly what they need without re-investigation. Raw transcript dumping (B) still requires the human to manually extract the relevant facts, which is what's causing the current friction. Urgency flags and sentiment scores (A, D) don't address the missing-context problem at all."
        },
        {
          id: "P10-S1-Q7",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Aurora's VIP policy-exception reviews follow a fixed compliance sequence (verify identity, check loyalty tier, apply exception), while its account-fraud investigations vary unpredictably based on what evidence turns up. Which decomposition strategy should the architecture use for each workflow?",
          options: [
            { key: "A", text: "Use dynamic, adaptive decomposition for both, since Claude can discover the right steps for any workflow at runtime, even the strictly ordered compliance sequence." },
            { key: "B", text: "Use a fixed sequential pipeline for the VIP compliance review, and dynamic, adaptive decomposition for the fraud investigation." },
            { key: "C", text: "Use a fixed sequential pipeline for both, hardcoding the fraud investigation steps based on the most common pattern seen in past logs." },
            { key: "D", text: "Alternate between the two strategies randomly across cases to avoid predictable agent behavior that bad actors could exploit, treating unpredictability itself as a security control." }
          ],
          correct: ["B"],
          explanation: "Fixed sequential pipelines (prompt chaining) suit predictable, compliance-mandated step orders like the VIP review, while dynamic adaptive decomposition suits open-ended investigations like fraud, where the next step depends on what is discovered. Option A ignores the value of predictability for compliance steps. Option C forces an unpredictable investigation into a rigid template based on historical bias. Option D introduces arbitrary randomness with no grounding in either workflow's actual requirements."
        },
        {
          id: "P10-S1-Q8",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Aurora's escalate_to_human tool currently accepts a single required parameter, reason: string. Human agents report having to re-ask customers for context already established earlier in the conversation (order ID, steps already attempted, customer sentiment) before they can help. The team has bandwidth for one tool-design change this week. What is the most proportionate first step?",
          options: [
            { key: "A", text: "Redesign escalate_to_human's input schema to require structured fields (order ID, issue summary, steps already attempted, customer sentiment) so every escalation arrives with the context a human needs to act on immediately." },
            { key: "B", text: "Keep the single reason string, but add a system-prompt instruction asking the agent to always write a very detailed paragraph into that field, trusting prose alone to reliably cover every required context item every time." },
            { key: "C", text: "Build a separate tool that logs the full conversation transcript to a shared database, and have the human manually search that database for context after receiving an escalation that still contains only the original reason string." },
            { key: "D", text: "Replace escalate_to_human entirely with a message instructing the customer to call the support line directly, removing the agent's ability to hand off any conversational context to a human at all." }
          ],
          correct: ["A"],
          explanation: "Structured required fields in the tool's own input schema guarantee every escalation includes the specific context items humans need, rather than leaving that up to how thoroughly the model happens to narrate a free-text field. Option B relies on probabilistic prompt compliance to populate an unstructured string consistently, which isn't guaranteed. Option C adds an extra manual lookup step to every handoff instead of delivering the needed context within the handoff itself. Option D removes the escalation mechanism's context entirely rather than improving it, which is far more drastic than the proportionate-effort constraint allows."
        },
        {
          id: "P10-S1-Q9",
          domain: 2,
          task: "2.2",
          type: "multiple",
          select: 2,
          stem: "lookup_order currently returns the bare string 'Operation failed' whenever anything goes wrong, whether the order truly doesn't exist, the backend timed out, or the customer lacks permission to view a cancelled order. Which two changes should the team make so the agent can respond appropriately to each situation? (Select TWO.)",
          options: [
            { key: "A", text: "Replace the JSON response with one plain-text sentence summarizing whatever went wrong, to keep things simple for the model." },
            { key: "B", text: "Automatically retry every failed lookup_order call three times before surfacing anything to the agent." },
            { key: "C", text: "For a genuinely empty search result (an order ID that simply does not exist), return a normal successful response indicating no matches, rather than an error." },
            { key: "D", text: "Return a single generic isError: true flag with no further detail so the agent always escalates to a human to be safe." },
            { key: "E", text: "Return structured metadata with an errorCategory field (e.g. transient, validation, permission) and an isRetryable boolean on every failure." }
          ],
          correct: ["E", "C"],
          explanation: "Structured error metadata lets the agent distinguish retryable transient failures from permission or validation failures, and distinguishing a valid empty result from an access failure prevents the agent from treating a legitimate 'no matches' as an error needing escalation. Automatically retrying everything (B) wastes calls on non-retryable failures like permission errors, and generic flags or plain-text summaries (D, A) remove exactly the information the agent needs to decide how to respond."
        },
        {
          id: "P10-S1-Q10",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "In addition to its four support tools, Aurora's agent has accumulated access to 16 internal reporting, analytics, and admin tools added 'just in case.' Tool selection accuracy has dropped noticeably since then. What is the most effective fix?",
          options: [
            { key: "A", text: "Keep all 20 tools available but set tool_choice to 'any' so the agent is forced to pick one every turn, which guarantees a tool call happens but still leaves all 20 competing options in context for every single decision." },
            { key: "B", text: "Add detailed descriptions to all 16 extra tools so the model can distinguish them more easily while keeping full access, so no capability is lost and routing improves purely through better documentation." },
            { key: "C", text: "Keep all 20 tools but add a system prompt instruction ranking the four support tools as preferred, relying on the model to consistently honor a soft preference ordering across every turn despite having all 20 tools competing for attention." },
            { key: "D", text: "Restrict the agent's available tools to only get_customer, lookup_order, process_refund, and escalate_to_human, removing the unrelated tools from its context." }
          ],
          correct: ["D"],
          explanation: "Giving an agent access to far more tools than its role requires increases decision complexity and degrades selection reliability; scoping the agent to only the tools it needs directly addresses this. Options A, B, and C all keep the full 20-tool set in context and only adjust how the model is nudged toward the right choice, which doesn't remove the underlying complexity causing the degradation."
        },
        {
          id: "P10-S1-Q11",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Aurora wants the lookup_order MCP server's backend bearer token to be usable by the whole support engineering team through the version-controlled repository, without ever committing the raw secret value. What is the correct configuration approach?",
          options: [
            { key: "A", text: "Store the token in CLAUDE.md as a documented setup note for new teammates to copy manually, since CLAUDE.md is already version-controlled and every engineer reads it during onboarding, making it a natural single source of truth for setup steps." },
            { key: "B", text: "Configure the server only in each engineer's personal ~/.claude.json with their own hardcoded token value, which keeps every secret out of version control entirely even though it means re-deriving the MCP server configuration by hand for each new teammate." },
            { key: "C", text: "Hardcode the current token directly into .mcp.json so every teammate who pulls the repo has working credentials immediately, avoiding every per-engineer setup step or environment variable for new hires, since the token rotates only rarely." },
            { key: "D", text: "Configure the server in the project-scoped .mcp.json using environment variable expansion, e.g. \"Authorization\": \"Bearer ${ORDER_SERVICE_TOKEN}\", so each teammate supplies the token through their own environment." }
          ],
          correct: ["D"],
          explanation: "Project-scoped .mcp.json with environment variable expansion lets the whole team share the tool configuration through version control while each person's actual secret value stays out of the committed file. Hardcoding the token (C) commits a live secret. Personal-only configuration (B) prevents team-wide sharing, and documenting it in CLAUDE.md (A) is not a supported credential mechanism and still risks the secret being pasted into a shared file."
        },
        {
          id: "P10-S1-Q12",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Over a 25-turn dispute case, the running conversation summary has degraded the original $214.37 refund amount into 'a refund around two hundred dollars,' and the agent is about to process the wrong amount. What is the most effective fix?",
          options: [
            { key: "A", text: "Switch to a larger-context model so the full conversation never needs to be summarized at all." },
            { key: "B", text: "Increase the summarization frequency so the running summary is regenerated more often and stays fresher, ensuring order IDs and refund amounts are reconstructed from recent turns each time the summary is rewritten." },
            { key: "C", text: "Instruct the agent, via the system prompt, to always double-check dollar amounts before finalizing a refund." },
            { key: "D", text: "Extract transactional facts like the exact refund amount, order number, and dates into a persistent case-facts block included in every prompt, separate from the summarized history." }
          ],
          correct: ["D"],
          explanation: "Persisting exact transactional facts outside the summarized history prevents the progressive-summarization risk of numeric values being gradually vagued out. Option C is a probabilistic instruction that doesn't stop the underlying summary from losing precision. Option B still allows numeric degradation between summarization passes. Option A avoids the symptom for a while but doesn't fix the pattern and isn't a reliable architectural guarantee."
        },
        {
          id: "P10-S1-Q13",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "Early in a conversation, before the agent has investigated anything, a customer writes 'This is ridiculous, just get me a real person.' What should the agent do?",
          options: [
            { key: "A", text: "Ask the customer to describe the issue in more detail first, then decide whether escalation is warranted." },
            { key: "B", text: "Run a sentiment-analysis pass and only escalate if the detected frustration score exceeds a configured threshold." },
            { key: "C", text: "Attempt to resolve the issue first, since investigation is usually fast, and escalate afterward only if resolution fails, which minimizes unnecessary handoffs and keeps human agent workload low across the support team." },
            { key: "D", text: "Immediately honor the explicit request and escalate to a human, since an explicit customer request for a human agent is itself a valid escalation trigger regardless of case complexity." }
          ],
          correct: ["D"],
          explanation: "An explicit, unambiguous request for a human agent should be honored immediately rather than deferred behind further investigation. Options A and C delay escalation the customer has already explicitly requested, risking further frustration. Option B substitutes an unreliable sentiment proxy for a signal the customer has already given directly in their own words."
        },
        {
          id: "P10-S1-Q14",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "lookup_order returns two different customer accounts, both named 'J. Rivera' in the same shipping city, and get_customer returns no further disambiguating field. What should the agent do?",
          options: [
            { key: "A", text: "Select the account with the more recent order, since recency is the most likely intended match." },
            { key: "B", text: "Proceed with whichever match the tool returned first, since the backend likely already ranks results by relevance, and it avoids an extra round trip that would slow down the customer's interaction." },
            { key: "C", text: "Ask the customer for an additional identifier, such as an order number or email address, before proceeding, rather than guessing between the two matches." },
            { key: "D", text: "Escalate to a human immediately without attempting any clarification, since any ambiguity is inherently a policy gap." }
          ],
          correct: ["C"],
          explanation: "When tool results return multiple matches, the agent should request an additional identifier rather than heuristically guessing which account is correct. Options A and B both guess, risking acting on the wrong customer's account. Option D escalates a routine clarification need that the agent is fully capable of resolving itself by simply asking a follow-up question."
        },
        {
          id: "P10-S1-Q15",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "A single lookup_order call returns 40+ fields (warehouse routing codes, internal SKUs, carrier contract IDs, and more), but only about 5 fields matter for return and refund decisions. Across a long session these accumulate and now dominate the context window. What is the most effective fix?",
          options: [
            { key: "A", text: "Trim the tool output to only the fields relevant to the current task (e.g. order status, item, amount, date, return window) before it enters context." },
            { key: "B", text: "Ask the backend team to add even more fields so the agent never needs to make a second lookup_order call." },
            { key: "C", text: "Summarize the full 40-field response into a short paragraph before adding it to context, which keeps the conversation small while preserving the key facts the agent needs later." },
            { key: "D", text: "Periodically run /compact to shrink the conversation once it grows too large." }
          ],
          correct: ["A"],
          explanation: "Trimming verbose tool outputs down to the fields actually relevant to the task is the direct fix for context bloated with irrelevant data. Summarizing the whole response (C) still carries irrelevant content forward and risks losing precision on the fields that do matter. Running /compact periodically (D) is a reasonable broader tactic but doesn't stop the same bloated responses from recurring on every future call, and adding more fields (B) makes the problem worse."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P10-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Helios Energy Trading's research system is asked to produce a report on the 'global carbon credit market outlook.' All subagents complete successfully, but the final report covers only the EU: pricing trends, offset verification standards, and the carbon border tariff, entirely omitting North American cap-and-trade, voluntary markets, and Asia-Pacific schemes. The coordinator's logs show it decomposed the topic into exactly those three EU-only subtasks. What is the most likely root cause?",
          options: [
            { key: "A", text: "The web search subagent's queries were not broad enough and need to be expanded to cover more regions." },
            { key: "B", text: "The document analysis subagent is filtering out non-EU sources due to overly restrictive relevance criteria, a plausible explanation given that relevance filters commonly over-prune results when their criteria are tuned too narrowly for the topic." },
            { key: "C", text: "The coordinator's task decomposition was too narrow, assigning subtasks that covered only one geographic market instead of the full global scope the topic implied." },
            { key: "D", text: "The synthesis subagent lacks instructions for identifying coverage gaps in the findings it receives from other agents, so the report reads as complete even though upstream searches never covered those regions." }
          ],
          correct: ["C"],
          explanation: "The coordinator's own decomposition into three EU-specific subtasks is the direct, logged cause of the narrow coverage; the subagents executed exactly what they were assigned correctly. Options A, B, and D all incorrectly blame downstream agents that performed their assigned (too-narrow) scope correctly."
        },
        {
          id: "P10-S3-Q2",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "After the EU-only carbon market report, Helios wants an iterative refinement step that prevents the same narrow-coverage failure from recurring. Which design best achieves this?",
          options: [
            { key: "A", text: "Add a fixed requirement that every report must explicitly mention exactly four named regions, regardless of topic, on the theory that a hardcoded regional checklist guarantees broad coverage without needing the coordinator to adaptively evaluate what the topic actually requires." },
            { key: "B", text: "Have the coordinator evaluate the synthesis output for topic gaps, re-delegate targeted queries to the search and analysis subagents for missing regions, and re-invoke synthesis until coverage is sufficient." },
            { key: "C", text: "Run the original three EU subtasks a second time and average the two synthesis outputs together." },
            { key: "D", text: "Have the synthesis subagent detect gaps in its own output and silently fill them in using its general knowledge instead of new sourced research, which is faster and avoids another round of searches and subagent cost." }
          ],
          correct: ["B"],
          explanation: "A coordinator-driven iterative refinement loop that evaluates synthesis output for gaps and re-delegates targeted follow-up research is the pattern designed to catch and correct incomplete coverage. Option A hardcodes an arbitrary region count unrelated to the actual topic. Option C repeats the same narrow scope rather than expanding it. Option D fabricates uncited content instead of sourcing it, undermining the system's cited-report requirement."
        },
        {
          id: "P10-S3-Q3",
          domain: 1,
          task: "1.3",
          type: "multiple",
          select: 2,
          stem: "Helios's coordinator currently invokes the web search subagent, waits for it to finish, then invokes the document analysis subagent and waits again, adding roughly 50 seconds of avoidable latency per report even though the two subagents don't depend on each other's output. Which two changes correctly address the latency without compromising coordinator observability? (Select TWO.)",
          options: [
            { key: "A", text: "Merge the web search and document analysis subagents into a single subagent that performs both jobs." },
            { key: "B", text: "Confirm the coordinator's allowedTools configuration includes 'Task' so it is permitted to spawn subagents at all." },
            { key: "C", text: "Run both subagents sequentially as before, but shorten each one's individual timeout so the total wall-clock time is capped." },
            { key: "D", text: "Emit both the web search and document analysis Task tool calls in a single coordinator response so they execute in parallel." },
            { key: "E", text: "Have the web search and document analysis subagents communicate results directly to each other, bypassing the coordinator." }
          ],
          correct: ["B", "D"],
          explanation: "Emitting multiple Task tool calls in a single coordinator response lets independent subagents run in parallel, and this is only possible if the coordinator's allowedTools actually includes 'Task' in the first place. Option E breaks the hub-and-spoke pattern by routing information around the coordinator, losing observability and centralized error handling. Option A is an unnecessary architectural merge, and option C just shortens timeouts without removing the sequential wait."
        },
        {
          id: "P10-S3-Q4",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "The synthesis subagent's prompt currently just says 'use the research findings,' relying on Claude to pull them from shared memory. In practice, the synthesis subagent regularly states details that never actually appeared in either the web search or document analysis subagent's output. What is the root cause and fix?",
          options: [
            { key: "A", text: "Subagents do not automatically inherit the coordinator's conversation history; the coordinator must include the complete web search and document analysis findings directly in the synthesis subagent's prompt." },
            { key: "B", text: "The synthesis subagent needs a larger context window so it can hold more of the coordinator's memory." },
            { key: "C", text: "The synthesis subagent should be given its own web search tool access so it can re-verify details on its own." },
            { key: "D", text: "The coordinator should pass fewer findings to synthesis so there is less room for it to fabricate details." }
          ],
          correct: ["A"],
          explanation: "Subagents operate with isolated context and do not automatically inherit the coordinator's conversation history, so findings must be explicitly included in the subagent's prompt. A larger context window (B) doesn't help if the data was never passed in the first place. Giving synthesis its own search tool (C) blurs role boundaries rather than fixing the context-passing gap, and passing fewer findings (D) would worsen coverage without addressing the actual cause of fabrication."
        },
        {
          id: "P10-S3-Q5",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Helios runs an open-ended brief ('assess emerging risks to grid reliability over the next decade') and also a recurring fixed audit ('weekly check of five named utilities' outage disclosures'). Which decomposition approach should it use for each?",
          options: [
            { key: "A", text: "Use dynamic, adaptive decomposition for the open-ended grid-risk brief, and a fixed sequential pipeline for the recurring five-utility audit." },
            { key: "B", text: "Use a fixed sequential pipeline for both tasks so subagent behavior stays fully predictable across every run, treating predictability as the overriding priority even for the open-ended brief where the right steps can't be known in advance." },
            { key: "C", text: "Use dynamic decomposition for both tasks, since adaptability is always preferable regardless of task shape." },
            { key: "D", text: "Reuse whichever pattern the most recent prior report on a similar topic used, regardless of how open-ended the new brief is, because consistency across reports makes outputs easier for readers to compare." }
          ],
          correct: ["A"],
          explanation: "Fixed sequential pipelines suit predictable, repeatable workloads like the recurring named-utility audit, while dynamic adaptive decomposition suits open-ended investigation where the right subtasks depend on what's discovered. Option B forces an unpredictable brief into a rigid template. Option C discards the efficiency and consistency benefits of a fixed pipeline for a task that doesn't need adaptability. Option D ignores the actual shape of the current task in favor of precedent."
        },
        {
          id: "P10-S3-Q6",
          domain: 1,
          task: "1.7",
          type: "multiple",
          select: 2,
          stem: "A named research session investigating 'LNG spot price volatility' was paused for two weeks. The underlying source documents have since been updated with new quarterly data, and the analyst wants to continue rather than restart the entire investigation. Which two actions are correct? (Select TWO.)",
          options: [
            { key: "A", text: "Use --resume with the session name to continue the existing investigation context." },
            { key: "B", text: "Use fork_session to branch off a new independent session without mentioning that any documents changed." },
            { key: "C", text: "Resume silently and trust the agent to notice the new quarterly data on its own." },
            { key: "D", text: "Start an entirely new session with no reference to the prior investigation, re-running every subagent from scratch." },
            { key: "E", text: "Explicitly tell the agent which specific source documents changed so it targets re-analysis of those rather than redoing everything." }
          ],
          correct: ["A", "E"],
          explanation: "Resuming the named session preserves the still-valid prior context, and explicitly flagging which documents changed lets the agent re-analyze only what's necessary rather than requiring full re-exploration. Resuming silently (C) risks the agent reasoning from stale data without being told. Restarting entirely (D) wastes the valid portions of the prior work, and forking without noting the change (B) carries the same staleness risk into a new branch."
        },
        {
          id: "P10-S3-Q7",
          domain: 2,
          task: "2.1",
          type: "single",
          select: 1,
          stem: "Helios's subagents have access to two tools: analyze_content ('Analyzes content and returns insights') and extract_market_data ('Extracts data and returns insights'). The coordinator routes incoming web articles to the wrong one roughly 30% of the time. What is the most effective first step?",
          options: [
            { key: "A", text: "Rename and rewrite the descriptions so each tool states its specific input type and boundary cases distinguishing it from the other (e.g. extract_market_data for structured exchange/price feeds, analyze_content for narrative articles)." },
            { key: "B", text: "Merge both tools into one tool that auto-detects the content type internally." },
            { key: "C", text: "Add a keyword-matching pre-router that inspects the source URL before the coordinator ever evaluates it." },
            { key: "D", text: "Instruct the coordinator, via its system prompt, to always prefer extract_market_data whenever it is unsure." }
          ],
          correct: ["A"],
          explanation: "Clear, differentiated tool descriptions are the primary mechanism for reliable tool selection, and the near-identical generic descriptions here are the direct cause of the misrouting. Option D is a blunt keyword-based bias that will misroute narrative content toward the wrong tool. Option C bypasses the model's own reasoning with a brittle heuristic, and option B is a larger architectural change than the ambiguous-description problem warrants as a first step."
        },
        {
          id: "P10-S3-Q8",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "80% of the synthesis subagent's verification needs are simple fact checks (a reported price, a stated date); 20% need deeper multi-source digging. Every verification currently round-trips through the coordinator to the web search subagent, adding noticeable latency. What is the best fix that balances speed against scope control?",
          options: [
            { key: "A", text: "Give the synthesis subagent full access to the web search subagent's entire toolset so it can resolve any verification itself, removing the coordinator round trip and keeping verification context entirely local." },
            { key: "B", text: "Give the synthesis subagent a narrow, scoped verify_fact tool for simple lookups, while deeper verifications still route through the coordinator to the web search subagent." },
            { key: "C", text: "Have the synthesis subagent batch all its verification needs until the end of its pass and send them to the coordinator all at once." },
            { key: "D", text: "Pre-fetch and cache extra context for every source during the initial search phase so synthesis never needs to verify anything later, front-loading the cost of verification before synthesis begins instead of handling it on demand as it comes up." }
          ],
          correct: ["B"],
          explanation: "A scoped, high-frequency cross-role tool for the common simple case applies least-privilege while still routing the rarer complex cases through the coordinator's existing pattern. Full toolset access (A) over-provisions the synthesis agent and blurs role boundaries. Batching to the end (C) can create blocking dependencies when later synthesis steps need an earlier fact first. Speculative pre-fetching (D) cannot reliably anticipate what synthesis will actually need to verify."
        },
        {
          id: "P10-S3-Q9",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Helios lists three MCP servers (news-wire, exchange-data, regulatory-filings) in .mcp.json. The team notices that the moment Claude Code connects, it already has tools from all three servers available at once, with no additional configuration step. Is this expected, and what follows from it?",
          options: [
            { key: "A", text: "This is a misconfiguration; MCP servers should be connected one at a time and disconnected before the next is used, to avoid tool collisions, because simultaneous connections would otherwise pollute the context window with duplicated tool definitions and naming conflicts." },
            { key: "B", text: "This indicates the three servers are sharing a single authentication token, which should be split into one token per server immediately, since simultaneous tool availability at connection time is otherwise difficult to explain without a shared credential." },
            { key: "C", text: "This only happens because the servers are personal, user-scoped servers; project-scoped servers would instead load lazily on first use, deferring tool discovery until the moment a specific tool from that server is actually invoked in conversation." },
            { key: "D", text: "This is expected: tools from all configured MCP servers are discovered at connection time and made available simultaneously, so descriptions across servers should be reviewed together to avoid naming or purpose overlap." }
          ],
          correct: ["D"],
          explanation: "Tools from every configured MCP server are discovered at connection time and are simultaneously available to the agent, so this behavior is expected and the team should proactively review tool names and descriptions across servers for overlap. Option A describes a manual connect/disconnect workflow MCP doesn't use. Option C mischaracterizes project vs. user scoping, which affects who can see the configuration, not load timing. Option B draws an unsupported conclusion about authentication from simultaneous tool availability."
        },
        {
          id: "P10-S3-Q10",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Analysts frequently ask the agent to 'list open items in the regulatory-filings tracker' before starting research, and answering this currently costs the web-search and document-analysis subagents several exploratory tool calls just to enumerate what's available. What MCP feature most directly reduces this overhead?",
          options: [
            { key: "A", text: "Add a new MCP tool called list_all_filings that returns the entire tracker's contents on every call, so the agent can always reason over the complete tracker without needing to formulate a targeted query." },
            { key: "B", text: "Expose the regulatory-filings tracker's catalog as an MCP resource so the agent can see available filings up front without exploratory tool calls." },
            { key: "C", text: "Increase the polling frequency of the regulatory-filings MCP server so new filings appear faster, under the assumption that fresher polling intervals will also reduce the number of exploratory calls needed to enumerate what's available." },
            { key: "D", text: "Cache the most recent tool call result and automatically replay it for any similarly worded query, trusting surface-level wording similarity to reliably indicate that two different requests want the exact same underlying data." }
          ],
          correct: ["B"],
          explanation: "MCP resources are designed to expose content catalogs so an agent has visibility into available data without needing exploratory tool calls, which directly reduces the overhead described. A new tool (A) still requires an explicit tool call each time. Polling frequency (C) is unrelated to exploratory call overhead, and naive result caching (D) risks returning stale or mismatched data for queries that only superficially resemble each other."
        },
        {
          id: "P10-S3-Q11",
          domain: 5,
          task: "5.3",
          type: "multiple",
          select: 2,
          stem: "The web search subagent hits an intermittent DNS failure on one source mid-task; a single retry succeeds 90% of the time. Which two practices correctly handle this and its propagation to the coordinator? (Select TWO.)",
          options: [
            { key: "A", text: "Attempt one local retry for the transient failure within the subagent before giving up on that source." },
            { key: "B", text: "If the retry also fails, propagate to the coordinator with details of what was attempted and any partial results gathered." },
            { key: "C", text: "Silently return a successful empty result if the retry fails, so the coordinator doesn't need to handle an error path." },
            { key: "D", text: "Propagate the failure to the coordinator immediately without attempting any local retry, since all network errors are equally urgent." },
            { key: "E", text: "Terminate the entire research run as a precaution whenever any single source becomes unreachable." }
          ],
          correct: ["A", "B"],
          explanation: "Subagents should implement local recovery for transient errors and propagate to the coordinator only what they cannot resolve locally, including what was attempted and any partial results. Option C suppresses the failure by misrepresenting it as success, preventing any recovery decision. Option D skips the high-value local retry step unnecessarily, and option E massively overreacts to a single recoverable source failure by halting the entire system."
        },
        {
          id: "P10-S3-Q12",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "A document-analysis subagent can only retrieve 6 of 10 requested regulatory filings because 4 are paywalled. It completes analysis of the 6 it has and must report its result. How should this be represented?",
          options: [
            { key: "A", text: "Mark the task as fully failed, since not all requested documents were retrieved, discarding the six filings that were successfully analyzed instead of reporting partial coverage alongside an explicit note of what's missing." },
            { key: "B", text: "Automatically substitute publicly available news summaries for the 4 paywalled filings without flagging the substitution, so the reader receives a seamless report that never appears to have missing coverage." },
            { key: "C", text: "Return the analysis as if it were complete and comprehensive, without mentioning the 4 missing filings, so the coordinator has no way of knowing the report's coverage is actually partial rather than exhaustive." },
            { key: "D", text: "Return the analysis of the 6 retrieved filings along with an explicit coverage annotation noting the 4 unavailable filings as a gap, so the coordinator can decide how to proceed." }
          ],
          correct: ["D"],
          explanation: "Returning partial results with an explicit coverage annotation of what's missing lets the coordinator make an informed decision about how to proceed or disclose the limitation. Marking the whole task failed (A) discards six filings' worth of valid analysis unnecessarily. Options C and B both hide the gap from the coordinator, risking a report that silently overstates its own completeness."
        },
        {
          id: "P10-S3-Q13",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "Two credible sources report different figures for the same quarter's LNG export volume: a government statistics office reports 18.2 million tonnes, a private market-data provider reports 19.6 million tonnes. How should the synthesis subagent handle this in the final report?",
          options: [
            { key: "A", text: "Report only the government figure, since government sources are always authoritative for trade statistics, and presenting a single definitive figure keeps the report clear for readers." },
            { key: "B", text: "Average the two figures and report 18.9 million tonnes as the agreed value." },
            { key: "C", text: "Omit the statistic entirely from the report since the two sources disagree." },
            { key: "D", text: "Preserve both values along with their source attribution, explicitly noting the discrepancy rather than arbitrarily selecting one." }
          ],
          correct: ["D"],
          explanation: "Conflicting statistics from credible sources should be preserved with source attribution and an explicit note of the conflict, letting readers and downstream decisions account for the discrepancy. Averaging (B) fabricates a number neither source actually reported. Treating one source as categorically authoritative (A) is an unsupported assumption, and omitting the statistic (C) discards genuinely useful information just because it's contested."
        },
        {
          id: "P10-S3-Q14",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "A cited finding about carbon credit prices doesn't include when the underlying data was collected. Two weeks later a follow-up report contains a contradictory figure, and the team initially assumes the market shifted dramatically, before realizing the two findings were actually from different collection dates all along. What requirement would have prevented this confusion from the start?",
          options: [
            { key: "A", text: "Requiring subagents to include publication or data-collection dates in structured outputs so later readers can correctly interpret genuine change versus apparent contradiction." },
            { key: "B", text: "Requiring subagents to only cite sources published within the last 7 days." },
            { key: "C", text: "Requiring the synthesis subagent to discard any finding more than one week old." },
            { key: "D", text: "Requiring the coordinator to re-run the original search every time a new report is generated, regardless of topic, so every report rests on results gathered at generation time rather than on any prior data." }
          ],
          correct: ["A"],
          explanation: "Requiring publication or collection dates in structured outputs lets downstream readers correctly interpret whether differing figures reflect a real change over time or a simple temporal mismatch. Options B and C would have discarded exactly the older, still-relevant data instead of contextualizing it. Option D is a costly blanket re-run policy that doesn't address the actual missing metadata."
        },
        {
          id: "P10-S3-Q15",
          domain: 5,
          task: "5.4",
          type: "single",
          select: 1,
          stem: "A six-hour research session into Helios's historical trading-desk incident reports has accumulated so much verbose exploration output that the agent starts referencing 'typical compliance filings' instead of the specific filings it identified earlier in the same session. What combination of changes best addresses this context degradation?",
          options: [
            { key: "A", text: "Instruct the agent, in its next response, to be more careful and specific going forward, so later answers stop drifting from facts established earlier in the long investigation." },
            { key: "B", text: "Have the agent maintain a scratchpad file recording key findings as it goes, and use /compact to reduce accumulated verbose output once the session grows large." },
            { key: "C", text: "Increase max_tokens so the model has more room to hold the entire session's detail in memory." },
            { key: "D", text: "Restart the investigation from scratch every hour to avoid any accumulation of context." }
          ],
          correct: ["B"],
          explanation: "A scratchpad file persists key findings across context boundaries, and periodic /compact reduces accumulated verbose discovery output, together counteracting the context degradation seen in extended sessions. A single corrective instruction (A) doesn't address the accumulated volume of prior context. A larger max_tokens budget (C) doesn't fix attention degradation over a long session, and restarting hourly (D) discards legitimate progress along with the noise."
        }
      ]
    },
    {
      id: 4,
      title: "Developer Productivity with Claude",
      description: "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      questions: [
        {
          id: "P10-S4-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "A new engineer joins the Meridian Benefits Portal team and doesn't get the team's required 'always run lint before suggesting a commit' instruction that everyone else seems to follow automatically. Investigation shows the instruction lives only in a senior engineer's ~/.claude/CLAUDE.md. What is the correct fix?",
          options: [
            { key: "A", text: "Ask every new engineer to manually copy the senior engineer's ~/.claude/CLAUDE.md file into their own home directory during onboarding." },
            { key: "B", text: "Move the instruction into the project-level CLAUDE.md in the repository so it is version-controlled and shared with every teammate." },
            { key: "C", text: "Duplicate the instruction into every subdirectory CLAUDE.md so it cannot be missed." },
            { key: "D", text: "Add the instruction to a .claude/commands/lint.md slash command instead, so engineers invoke it explicitly, which still version-controls the instruction but turns a mandatory pre-commit standard into something optional each engineer must remember to run." }
          ],
          correct: ["B"],
          explanation: "User-level CLAUDE.md settings apply only to that individual user and are not shared via version control, which is exactly why the new engineer never received them; moving the instruction to project-level configuration fixes this at the source. Manually copying personal files (A) doesn't scale and will be missed again. Duplicating into every subdirectory (C) is unnecessary and hard to maintain when a single project-level file already covers it, and turning it into an on-demand command (D) makes a mandatory standard optional."
        },
        {
          id: "P10-S4-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Meridian's root CLAUDE.md has grown to 900 lines covering API conventions, database migration rules, Terraform deployment notes, and frontend style guides, and engineers report skimming past sections irrelevant to their current task. What is the most maintainable restructuring?",
          options: [
            { key: "A", text: "Delete the least-used sections to shorten the file, accepting some loss of documented conventions, on the assumption that whatever content is referenced least often is also the content least likely to matter to any given engineer's current task." },
            { key: "B", text: "Move the entire file to ~/.claude/CLAUDE.md so it only loads for engineers who opt in." },
            { key: "C", text: "Split the content into topic-specific files under .claude/rules/ (e.g. api-conventions.md, migrations.md, deployment.md, frontend-style.md) instead of one monolithic file." },
            { key: "D", text: "Convert the whole file into a single .claude/commands/standards.md slash command that engineers run manually at the start of each session, ensuring only the relevant standards are pulled into context when needed." }
          ],
          correct: ["C"],
          explanation: ".claude/rules/ exists precisely to organize topic-specific conventions as an alternative to a monolithic CLAUDE.md, which also allows path-based conditional loading in the future. Deleting content (A) loses documented standards rather than reorganizing them. Moving the file to user-level (B) removes it from the shared, version-controlled configuration teammates rely on. Turning it into an on-demand command (D) makes universal standards optional rather than always-loaded."
        },
        {
          id: "P10-S4-Q3",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Meridian wants a /migrate-check command that validates a database migration file against the team's schema conventions, available to every engineer the moment they clone or pull the repository. Where should this command file live?",
          options: [
            { key: "A", text: ".claude/commands/migrate-check.md in the project repository." },
            { key: "B", text: "~/.claude/commands/migrate-check.md in each engineer's home directory." },
            { key: "C", text: "CLAUDE.md under a 'Commands' heading describing the check in prose." },
            { key: "D", text: ".claude/config.json with a commands array listing the check." }
          ],
          correct: ["A"],
          explanation: "Project-scoped slash commands belong in .claude/commands/ within the repository so they are version-controlled and automatically available to every teammate who clones or pulls it. ~/.claude/commands/ (B) is for personal commands not shared with the team. CLAUDE.md (C) provides context and instructions, not invokable command definitions, and .claude/config.json (D) describes a configuration file that doesn't exist in Claude Code."
        },
        {
          id: "P10-S4-Q4",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "A new skill, codebase-map, produces very verbose intermediate output (full file trees, dependency graphs) while exploring the legacy monolith, and engineers complain it floods their main conversation with content they don't actually need to see. What frontmatter configuration addresses this?",
          options: [
            { key: "A", text: "argument-hint: '<directory>', so engineers are prompted for which directory to map, which keeps the skill's output focused on a single directory and prevents runaway exploration." },
            { key: "B", text: "allowed-tools: ['Read', 'Grep'], restricting the skill to read-only exploration tools, which narrows what the skill can do but leaves its verbose intermediate output flowing directly into the main conversation exactly as before." },
            { key: "C", text: "A longer description field explaining to Claude that the output should be summarized." },
            { key: "D", text: "context: fork, so the skill runs in an isolated sub-agent context and only its final result returns to the main conversation." }
          ],
          correct: ["D"],
          explanation: "context: fork is specifically designed to isolate verbose or exploratory skill output in a sub-agent context, preventing it from polluting the main conversation. allowed-tools (B) restricts which tools the skill can use but doesn't change where its output lands. argument-hint (A) only prompts for missing arguments, and a longer description (C) doesn't change the skill's actual execution context."
        },
        {
          id: "P10-S4-Q5",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Meridian's test files (*.test.ts) are scattered throughout dozens of directories alongside the code they test, and the team wants one consistently-applied set of testing conventions regardless of which directory a given test file lives in. What is the most maintainable approach?",
          options: [
            { key: "A", text: "Add the testing conventions to the root CLAUDE.md under a 'Testing' heading and trust Claude to apply them only to test files, which avoids a more complex rules configuration and keeps all conventions together in one familiar location." },
            { key: "B", text: "Place a CLAUDE.md file in every directory that contains a test file, each repeating the same testing conventions, which guarantees the rules are visible locally but creates dozens of copies that will inevitably drift out of sync over time." },
            { key: "C", text: "Create a .claude/skills/testing-conventions/SKILL.md that engineers must manually invoke before writing any test." },
            { key: "D", text: "Create a .claude/rules/testing.md file with YAML frontmatter paths: ['**/*.test.ts'] so the rule loads automatically whenever a matching file is being edited, regardless of location." }
          ],
          correct: ["D"],
          explanation: "Glob-pattern path-scoped rules apply conventions by file type regardless of directory location, which is exactly the scattered-test-file situation described. Directory-level CLAUDE.md files (B) can't easily cover files spread across many unrelated directories without duplication. A root-level heading (A) relies on inference rather than guaranteed conditional loading, and a manually invoked skill (C) depends on the engineer remembering to run it every time."
        },
        {
          id: "P10-S4-Q6",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Meridian has both a directory-scoped convention (everything under terraform/ follows specific formatting) and a cross-cutting file-type convention (all *.sql migration files follow a naming convention, regardless of which directory they live in). What is the most appropriate rule organization?",
          options: [
            { key: "A", text: "Use a .claude/rules/ file with paths: ['terraform/**/*'] for the directory-scoped convention, and a separate .claude/rules/ file with paths: ['**/*.sql'] for the cross-cutting file-type convention." },
            { key: "B", text: "Use directory-level CLAUDE.md files for both, adding a terraform/CLAUDE.md and copying the SQL conventions into every directory that contains migration files, so each directory has its own explicit copy of the conventions that Claude always sees." },
            { key: "C", text: "Use a single .claude/rules/ file with paths: ['**/*'] so the conventions always load regardless of which file is being edited, treating the directory-scoped terraform convention and the cross-cutting SQL convention as if they were one undifferentiated rule set." },
            { key: "D", text: "Put both conventions in the root CLAUDE.md, since mixing directory-scoped and cross-cutting rules in one place is simpler to maintain, even though it means both load into every single conversation regardless of which files are actually being touched." }
          ],
          correct: ["A"],
          explanation: "Separate, correctly-scoped rule files let each convention load only when relevant: the terraform directory glob for the directory-scoped rule, and the *.sql glob for the convention that cuts across directories. Directory-level CLAUDE.md duplication (B) doesn't scale to files spread across many directories. A catch-all '**/*' glob (C) defeats the entire purpose of conditional loading by always applying both rule sets. Putting everything in the root CLAUDE.md (D) reintroduces the always-loaded, undifferentiated context the path-scoped rules were meant to avoid."
        },
        {
          id: "P10-S4-Q7",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "A ticket reads: 'Add a null check before the date parsing in calculateBenefitEligibility, since it throws on empty applicant records; stack trace attached.' Which approach best fits this task?",
          options: [
            { key: "A", text: "Plan mode, because touching a financial eligibility function always carries enough risk to warrant architectural planning, regardless of how narrow, well-understood, or already-diagnosed the specific change actually turns out to be." },
            { key: "B", text: "Direct execution, since the change is single-file, the root cause is already identified by the attached stack trace, and the scope is clear." },
            { key: "C", text: "Plan mode, because any production bug fix should be explored and planned first, regardless of scope, treating 'touches production' as a blanket trigger for planning even when the root cause and fix are already fully known." },
            { key: "D", text: "Direct execution, but only after first running a 45-minute plan-mode exploration of the entire eligibility module to be thorough and avoid any risk of missing a dependency." }
          ],
          correct: ["B"],
          explanation: "A single-file fix with a clear stack trace and a well-scoped change is exactly the kind of well-understood task direct execution is designed for. Options A and C treat 'financial' or 'production' as automatic triggers for planning regardless of actual complexity, and option D adds a disproportionate exploration phase to a task whose root cause is already known."
        },
        {
          id: "P10-S4-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "Meridian is migrating from its in-house data-access layer to a well-known open-source ORM across roughly 60 files, with several valid migration strategies (incremental per-module vs. big-bang) and real tradeoffs depending on each module's relationships. What is the best approach?",
          options: [
            { key: "A", text: "Enter plan mode first to explore the current data layer's usage patterns and decide on a migration approach before making any changes, then execute the plan." },
            { key: "B", text: "Start direct execution on the first module and let the pattern discovered there dictate the approach for the remaining 59 files, which avoids spending time on up-front exploration that might turn out to be unnecessary." },
            { key: "C", text: "Write comprehensive upfront instructions specifying the exact target structure for all 60 files without first exploring the current codebase, assuming the target ORM structure can be fully specified correctly before any module's actual relationships are examined." },
            { key: "D", text: "Use direct execution throughout, switching to plan mode only if something unexpected turns up partway through, deferring any upfront exploration of the current data layer until after changes are already underway." }
          ],
          correct: ["A"],
          explanation: "Plan mode is designed for large-scale, multi-file changes with multiple valid approaches and real architectural tradeoffs, which is exactly this migration. Option B risks costly rework once later modules reveal dependencies the first module didn't have. Option C assumes the right structure is already known without exploring the current code, and option D ignores that the complexity is already evident from the task description rather than something that might only emerge later."
        },
        {
          id: "P10-S4-Q9",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "Engineers describe the desired transformation for a legacy date-format normalizer only in prose ('convert all applicant-submitted dates to ISO 8601'), and the generated function handles ambiguous formats inconsistently (e.g. '03/04/25' is interpreted differently from one run to the next). What is the most effective way to clarify intent?",
          options: [
            { key: "A", text: "Rewrite the prose instruction with more adjectives emphasizing precision and correctness." },
            { key: "B", text: "Provide 2-3 concrete input/output examples covering the ambiguous formats (e.g. '03/04/25' -> '2025-03-04' under a documented day-first convention), since prose alone is being interpreted inconsistently." },
            { key: "C", text: "Ask Claude to pick whichever interpretation of ambiguous dates it finds 'most standard.'" },
            { key: "D", text: "Add a code comment reminding future maintainers that date parsing is tricky." }
          ],
          correct: ["B"],
          explanation: "Concrete input/output examples are the most effective way to communicate expected transformations when prose descriptions alone produce inconsistent results, since they pin down exactly how the ambiguous cases should resolve. Rewriting the prose with stronger wording (A) doesn't remove the underlying ambiguity. Leaving the interpretation to the model's own judgment (C) is precisely what caused the inconsistency, and a code comment (D) doesn't change runtime behavior at all."
        },
        {
          id: "P10-S4-Q10",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Meridian's team has completed an analysis of the legacy eligibility module and now wants to compare two different refactoring approaches (extract-service vs. extract-library) starting from that same completed analysis, without the two comparisons interfering with each other's exploration. What is the right mechanism?",
          options: [
            { key: "A", text: "Use --resume twice on the same named session sequentially: apply one approach, revert it, then apply the other." },
            { key: "B", text: "Use a single session and ask the agent to consider both approaches in the same response, picking whichever seems better." },
            { key: "C", text: "Start two unrelated new sessions with no reference to the prior analysis, so each refactoring approach is evaluated from a clean slate, which prevents either approach from being biased by earlier exploration." },
            { key: "D", text: "Use fork_session twice from the shared analysis session to create two independent branches, one exploring extract-service and one exploring extract-library." }
          ],
          correct: ["D"],
          explanation: "fork_session is designed to create independent branches from a shared analysis baseline for exploring divergent approaches, which is exactly comparing two refactoring strategies from the same starting point. Reusing one named session sequentially (A) forces the two explorations to interfere with each other through revert/reapply cycles. Starting from a clean slate twice (C) wastes the already-completed shared analysis, and considering both in one response (B) doesn't give either approach a genuinely independent, fully-explored comparison."
        },
        {
          id: "P10-S4-Q11",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A coordinator-style agent that explores the Meridian monolith by spawning an Explore subagent for deep file discovery fails with an error indicating the Task tool isn't available, even though the coordinator's system prompt clearly instructs it to delegate exploration. What is the likely cause and fix?",
          options: [
            { key: "A", text: "The coordinator's allowedTools configuration does not include 'Task'; it must be added for the coordinator to be permitted to spawn subagents at all." },
            { key: "B", text: "The Explore subagent's own AgentDefinition is missing a system prompt, which is the actual cause of the failure, because without its own system prompt the subagent cannot receive delegated instructions." },
            { key: "C", text: "The coordinator needs a larger max_tokens budget to fit the subagent's instructions." },
            { key: "D", text: "The monolith's MCP server is misconfigured and is specifically blocking the Task tool." }
          ],
          correct: ["A"],
          explanation: "Spawning subagents via the Task tool requires that the coordinator's allowedTools configuration explicitly include 'Task'; a system prompt instructing delegation is not enough on its own. A missing subagent system prompt (B) would affect the subagent's behavior once spawned, not whether it can be spawned at all. max_tokens (C) and MCP server configuration (D) are unrelated to whether the Task tool itself is permitted for the coordinator."
        },
        {
          id: "P10-S4-Q12",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Meridian wants to let an individual engineer experiment with a personal code-search MCP server they're evaluating, without affecting the shared project configuration the whole team relies on. Where should this personal server be configured?",
          options: [
            { key: "A", text: "In the project-scoped .mcp.json so it's available to everyone immediately." },
            { key: "B", text: "In the engineer's user-scoped ~/.claude.json, which coexists with the project's shared servers without affecting teammates." },
            { key: "C", text: "In a .claude/rules/ file scoped to the engineer's personal directory." },
            { key: "D", text: "In CLAUDE.md under a 'Personal Tools' heading." }
          ],
          correct: ["B"],
          explanation: "User-scoped ~/.claude.json is the correct place for personal or experimental MCP servers, and it is loaded alongside the project's shared servers without altering what teammates see. Adding it to the project-scoped .mcp.json (A) would expose the experimental server to the whole team. .claude/rules/ (C) scopes conventions by file path, not MCP server availability, and CLAUDE.md (D) is not a mechanism for configuring MCP servers at all."
        },
        {
          id: "P10-S4-Q13",
          domain: 2,
          task: "2.4",
          type: "multiple",
          select: 2,
          stem: "Meridian's shared project .mcp.json configures the internal ticketing MCP server with a bearer token. Which two practices are correct for this configuration? (Select TWO.)",
          options: [
            { key: "A", text: "Use environment variable expansion (e.g. '${TICKETING_TOKEN}') in .mcp.json so the raw secret value is never committed to version control." },
            { key: "B", text: "Hardcode the current token value directly into .mcp.json for simplicity, rotating the committed file whenever the token changes." },
            { key: "C", text: "Configure it only in each engineer's personal ~/.claude.json so each person can use a different, personal ticketing account." },
            { key: "D", text: "Configure it as a project-scoped server in .mcp.json since it's shared, team-wide tooling rather than a personal experiment." },
            { key: "E", text: "Store the token value as a comment in CLAUDE.md so new engineers know what to paste into their environment." }
          ],
          correct: ["A", "D"],
          explanation: "Project-scoped .mcp.json is correct for shared, team-wide tooling, and environment variable expansion keeps the actual secret out of the committed configuration file. Hardcoding the token (B) commits a live secret to version control. Configuring it only per-user (C) undermines the point of a shared team server, and pasting the secret into CLAUDE.md as a comment (E) still exposes it in a version-controlled file."
        },
        {
          id: "P10-S4-Q14",
          domain: 2,
          task: "2.5",
          type: "single",
          select: 1,
          stem: "Meridian's codebase re-exports a core validateApplication function from three different wrapper modules under different local names (checkEligibility, validateApp, runValidation) ahead of a planned refactor. An engineer needs to find every call site across the monolith. What is the most effective approach?",
          options: [
            { key: "A", text: "Read every file in the repository in full to visually scan for any call to validateApplication." },
            { key: "B", text: "Use Glob to find files named *validate*.ts, assuming all call sites live in similarly-named files." },
            { key: "C", text: "First identify all the exported names the function is re-exported under, then use Grep to search for each of those names across the codebase." },
            { key: "D", text: "Use Bash to run a single shell pipeline that greps only for the literal string 'validateApplication,' skipping the re-exported names, which is fast and yields a short, easily reviewed list." }
          ],
          correct: ["C"],
          explanation: "Tracing function usage across wrapper modules requires first identifying every exported name the function is re-exported under, then searching the codebase for each of those names with Grep, since call sites reference the local wrapper names rather than the original function name. Reading every file in full (A) is far less efficient than targeted content search. Filename-based Glob search (B) misses call sites in files whose names don't happen to contain 'validate,' and grepping only the original name (D) would miss every call site that uses one of the three wrapper names instead."
        },
        {
          id: "P10-S4-Q15",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "An open-ended ticket says 'add comprehensive tests to the legacy benefits-eligibility module,' which has no existing test coverage and unclear internal structure. Which two practices correctly reflect an adaptive decomposition approach for this task? (Select TWO.)",
          options: [
            { key: "A", text: "Map the module's structure and identify the highest-impact, highest-risk code paths before writing any tests." },
            { key: "B", text: "Build a prioritized test plan that adapts as new dependencies are discovered during implementation." },
            { key: "C", text: "Generate one test per function in strict file order without first studying the module's structure." },
            { key: "D", text: "Fix the total number of tests to write upfront based on the module's line count, regardless of what's found." },
            { key: "E", text: "Test only the five largest files, skipping the rest of the module entirely." }
          ],
          correct: ["A", "B"],
          explanation: "For open-ended tasks like adding comprehensive tests to an unfamiliar legacy module, the effective pattern is to first map structure and identify high-impact areas, then build a plan that adapts as dependencies are discovered. Option C skips the structural mapping step entirely and proceeds mechanically. Options D and E both commit to an arbitrary, fixed scope (line-count-based total or largest-files-only) that ignores what the investigation actually reveals about risk and impact."
        }
      ]
    },
    /*__SCENARIO_5__*/
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P10-S5-Q1",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Ledgerline's CI pipeline reuses the exact same Claude Code session that just generated a bug-fix commit to also perform the automated review of that commit, on the theory that the session already has full context of the change. Reviewers notice this review step rarely flags anything, even when a near-identical bug recurs in a later PR. What is the most effective fix?",
          options: [
            { key: "A", text: "Increase the review step's temperature and max_tokens so the session has more room to second-guess its own prior output before finalizing a review verdict." },
            { key: "B", text: "Add a stricter system-prompt instruction telling the session to review its own work with maximum skepticism, trusting that an explicit self-skepticism instruction alone can overcome the structural bias of a session reviewing code it just wrote." },
            { key: "C", text: "Invoke a fresh, independent Claude Code session with no memory of having written the change, scoped only to the review task, so the review isn't shaped by the same reasoning that produced the original code." },
            { key: "D", text: "Re-run the identical code-generation session a second time and diff the two outputs, treating any differences between the two runs as the review's findings." }
          ],
          correct: ["C"],
          explanation: "An independent review instance, with no memory of authoring the change, avoids the structural bias of a session reviewing its own reasoning, which is the documented fix for this exact failure mode. A stricter self-skepticism instruction (B) is still probabilistic and doesn't remove the underlying bias. Increasing temperature or max_tokens (A) doesn't address why the session undervalues its own mistakes. Diffing two runs of the same generation session (D) compares two outputs produced by the same biased reasoning process and would miss blind spots common to both runs."
        },
        {
          id: "P10-S5-Q2",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Ledgerline's nightly test-generation step keeps producing low-value tests that duplicate scenarios already in the suite and that ignore the team's fixture conventions. The team wants a durable fix rather than re-explaining the same standards on every invocation. What is the most proportionate fix?",
          options: [
            { key: "A", text: "Document the testing standards, valuable test criteria, and available fixtures in CLAUDE.md, so that context is loaded automatically on every CI invocation without being repeated by hand each time." },
            { key: "B", text: "Add a long inline prompt to the CI job definition itself that repeats the full fixture and testing-standards documentation on every single invocation, duplicating that same text in the pipeline configuration alongside the version-controlled project it already describes." },
            { key: "C", text: "Provide the existing test files as the only context, without separately documenting any conventions, trusting the model to infer the team's fixture conventions purely by pattern-matching against examples." },
            { key: "D", text: "Switch test generation to a model with a larger context window so it can hold more of the existing suite at once, without otherwise specifying which conventions or criteria it should apply." }
          ],
          correct: ["A"],
          explanation: "CLAUDE.md is the documented mechanism for giving CI-invoked Claude Code durable project context (testing standards, fixture conventions, review criteria) without re-supplying it on every run. Option B achieves the same repetition problem by duplicating the standards inline in the pipeline config, where it drifts out of sync with the real conventions. Option C relies on implicit pattern-matching from examples alone for conventions that generalize more reliably when stated explicitly, and option D increases capacity without addressing which conventions the model should actually be applying."
        },
        {
          id: "P10-S5-Q3",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "After developers push new commits addressing earlier review feedback, Ledgerline's pipeline re-runs the review and posts a fresh comment repeating several findings that were already fixed, frustrating developers. What change most directly fixes this?",
          options: [
            { key: "A", text: "Disable automated review entirely after the first pass on each PR, requiring a human to check all subsequent commits, which eliminates repeated automated comments on already-reviewed code." },
            { key: "B", text: "Lower the review's overall severity threshold so fewer findings are reported in general." },
            { key: "C", text: "Include the prior review findings in the context of the re-run, and instruct Claude to report only new or still-unaddressed issues." },
            { key: "D", text: "Increase the delay between a commit push and the review run so more changes accumulate before each review, on the assumption that a longer wait alone will somehow cause already-fixed findings to stop being reported." }
          ],
          correct: ["C"],
          explanation: "Including prior findings in context and instructing Claude to report only new or unresolved issues directly prevents duplicate comments on already-fixed problems. Disabling automated review (A) removes value from every later commit, not just the duplicates. Lowering the severity threshold (B) risks hiding genuinely new issues rather than filtering out already-fixed ones, and delaying reviews (D) doesn't address the duplication at all."
        },
        {
          id: "P10-S5-Q4",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Ledgerline's review prompt says 'flag comments that are inaccurate,' and in practice it flags many comments that are merely incomplete or terse but not actually factually wrong, producing a high false-positive rate that developers are starting to ignore. What is the best fix?",
          options: [
            { key: "A", text: "Narrow the criterion to something explicit and testable, such as 'flag a comment only when its claimed behavior contradicts what the code actually does,' rather than a vague accuracy standard." },
            { key: "B", text: "Add an instruction telling the model to 'be more conservative' and 'only report high-confidence findings.'" },
            { key: "C", text: "Tell the model to only flag comments on functions longer than 20 lines, since longer functions are riskier, substituting an arbitrary structural proxy for the actual question of whether a given comment's claim is factually wrong." },
            { key: "D", text: "Remove comment-accuracy checking from the review entirely rather than attempting to fix the false-positive rate, which guarantees that no inaccurate comment findings are ever posted to developers on any pull request." }
          ],
          correct: ["A"],
          explanation: "Replacing a vague standard with an explicit, testable categorical criterion directly targets the actual source of the false positives. General instructions like 'be more conservative' (B) don't reliably improve precision compared to specific criteria. An arbitrary function-length filter (C) is unrelated to whether a comment's claim is actually false, and removing the check entirely (D) discards a potentially valuable category instead of fixing its definition."
        },
        {
          id: "P10-S5-Q5",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Of Ledgerline's five review categories (security, correctness, style, test-coverage, documentation), the 'style' category has a 68% false-positive rate and is actively eroding developer trust in the other four categories, which perform well. What should the team do first, before attempting to rework the style prompt?",
          options: [
            { key: "A", text: "Lower the confidence threshold across all five categories so fewer findings of every type are surfaced, suppressing legitimate findings in the four well-performing categories along with the problematic style findings." },
            { key: "B", text: "Keep posting style findings as-is, on the assumption that developers will eventually learn to ignore just that one category without that learned skepticism ever spilling over into how they treat the other four, better-performing categories." },
            { key: "C", text: "Temporarily disable the style category in automated review output while its prompt is reworked, preserving trust in the four well-performing categories." },
            { key: "D", text: "Permanently remove the style category from Claude's review scope and replace it with a generic linter, without first attempting to fix the prompt, which gives developers a cleaner and more focused review." }
          ],
          correct: ["C"],
          explanation: "Temporarily disabling the single high false-positive category protects developer trust in the categories that are already working well while the problematic prompt is improved. Lowering thresholds across all five categories (A) unnecessarily suppresses good findings in the well-performing categories too. Leaving it as-is (B) continues to erode trust, and permanently removing it without attempting a fix (D) abandons the category rather than repairing it."
        },
        {
          id: "P10-S5-Q6",
          domain: 4,
          task: "4.2",
          type: "multiple",
          select: 2,
          stem: "Ledgerline's test-generation prompt produces inconsistent output format across runs (sometimes a short paragraph, sometimes a bulleted list, sometimes code-only), making automated parsing unreliable. The team also finds the model sometimes misreasons about genuinely ambiguous edge cases, such as whether a near-zero balance should count as 'zero' for a threshold check. Which two changes most directly address both problems? (Select TWO.)",
          options: [
            { key: "A", text: "Add a post-processing regex step that attempts to reformat whatever shape the model happens to return." },
            { key: "B", text: "Add a few-shot example demonstrating correct reasoning about the near-zero-balance edge case, so the model can generalize similar judgment calls." },
            { key: "C", text: "Tell the model to always use its own best judgment on formatting, trusting it to be consistent." },
            { key: "D", text: "Increase max_tokens so the model has more room to write out its reasoning before producing a final answer." },
            { key: "E", text: "Add 2-4 few-shot examples showing the exact desired output format (test name, scenario, expected assertion) to standardize structure." }
          ],
          correct: ["E", "B"],
          explanation: "Few-shot examples demonstrating the desired output format directly standardize structure, and few-shot examples demonstrating reasoning on an ambiguous case let the model generalize similar judgment calls to new situations. Telling the model to trust its own judgment (C) is what's already producing inconsistency. A larger max_tokens budget (D) doesn't constrain output shape, and a brittle regex reformatter (A) tries to patch the symptom after the fact rather than fixing the underlying inconsistency."
        },
        {
          id: "P10-S5-Q7",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Ledgerline's review prompt needs to distinguish genuinely risky patterns (e.g. unchecked arithmetic on money fields) from superficially similar but acceptable local patterns (the same arithmetic already guarded by a validated-input decorator used throughout the codebase), and prose instructions alone keep misclassifying the acceptable pattern as risky. What is the best fix?",
          options: [
            { key: "A", text: "Add a rule that flags all unchecked arithmetic on money fields regardless of surrounding guards, accepting some false positives as the cost of safety and avoiding any reliance on model judgment." },
            { key: "B", text: "Provide few-shot examples contrasting the acceptable guarded pattern with the genuinely risky unguarded pattern, so the model learns to generalize the distinction." },
            { key: "C", text: "Instruct the model to skip any pattern that 'looks like it might be intentional,' relying on a vague impression of intentionality to stand in for actually recognizing the specific validated-input decorator that makes a pattern safe." },
            { key: "D", text: "Remove the decorator-guarded files from the review's scope entirely so they are never analyzed, which also means any genuinely risky unguarded code that happens to live in those same files would go completely unreviewed." }
          ],
          correct: ["B"],
          explanation: "Few-shot examples that contrast an acceptable pattern with a genuinely risky one directly teach the model the distinguishing feature (the decorator guard), letting it generalize correctly to new occurrences. A blanket flag-everything rule (A) is exactly what's causing the false positives. A vague 'looks intentional' instruction (C) is unlikely to reliably recognize the specific guard pattern, and excluding entire files (D) could hide genuinely risky code that happens to live in the same files."
        },
        {
          id: "P10-S5-Q8",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Ledgerline wants its review findings to always come back as valid structured JSON matching a fixed findings schema, with zero tolerance for malformed output breaking the PR-comment bot. What is the most reliable mechanism?",
          options: [
            { key: "A", text: "Ask the model, in the system prompt, to always double-check its JSON for syntax errors before responding, relying entirely on the model's own self-review to catch malformed output before the PR-comment bot ever receives it." },
            { key: "B", text: "Post-process the model's free-text response with a best-effort JSON parser that attempts to recover malformed output, which requires no change to how the model is invoked or prompted and works with any response." },
            { key: "C", text: "Define a findings tool with the required JSON schema as its input parameters, and extract the structured result from the tool_use response rather than parsing free-form text." },
            { key: "D", text: "Lower the temperature setting to make output more deterministic and therefore less likely to contain syntax errors, which nudges the probability distribution without ever structurally guaranteeing that the output parses as valid JSON." }
          ],
          correct: ["C"],
          explanation: "Tool use with a JSON schema is the most reliable way to guarantee schema-compliant structured output, since the structured result comes from the tool_use response rather than free-form text that might contain syntax errors. A prompt instruction to self-check (A) is still probabilistic. A best-effort recovery parser (B) is a workaround for a problem tool use eliminates at the source, and lowering temperature (D) reduces but does not eliminate the risk of malformed output."
        },
        {
          id: "P10-S5-Q9",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Ledgerline supports three review schemas (security-review, test-coverage-review, doc-review), and a given pipeline step doesn't know in advance which one applies to a given file type, but it must always get back some structured finding rather than free text. What tool_choice configuration is correct?",
          options: [
            { key: "A", text: "tool_choice: \"auto\", so the model can decide whether to call a tool or just respond with text depending on the file." },
            { key: "B", text: "tool_choice: {\"type\": \"tool\", \"name\": \"security-review\"}, forcing the security schema regardless of file type, even for files where a test-coverage or documentation finding would be the actually relevant structured result." },
            { key: "C", text: "tool_choice: \"any\", which guarantees the model calls one of the available tools without forcing a specific one." },
            { key: "D", text: "Omitting tool_choice entirely, since the default behavior already guarantees a tool call, on the mistaken assumption that the SDK's default is equivalent to forcing tool use rather than leaving the choice up to the model." }
          ],
          correct: ["C"],
          explanation: "tool_choice: 'any' guarantees the model calls a tool (so a structured finding is always returned) while still letting it pick the schema appropriate to the file, which is exactly what's needed here. 'auto' (A) allows the model to return plain text instead of calling any tool at all. Forcing a single named tool (B) would wrongly apply the security schema to files that need a different one, and omitting tool_choice (D) defaults to 'auto' behavior, not a guaranteed tool call."
        },
        {
          id: "P10-S5-Q10",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Ledgerline's extraction schema for test-coverage findings requires an 'affected_function' field, but roughly 12% of findings are file-level and have no single affected function. The model has started inventing plausible-sounding function names to satisfy the requirement. What is the best schema fix?",
          options: [
            { key: "A", text: "Keep the field required but add an instruction telling the model not to make things up." },
            { key: "B", text: "Make the field a free-text string with no validation so any value, true or invented, passes schema checks, which eliminates validation failures for findings that lack a clear location." },
            { key: "C", text: "Remove file-level findings from the review scope entirely so the field is always applicable." },
            { key: "D", text: "Make the 'affected_function' field optional/nullable, so the model can omit it for file-level findings instead of fabricating a value." }
          ],
          correct: ["D"],
          explanation: "Making a field nullable when the source information may genuinely not exist prevents the model from fabricating a value just to satisfy a required-field constraint. A prompt instruction not to fabricate (A) is still probabilistic and doesn't remove the pressure the required field creates. Excluding file-level findings entirely (C) discards a legitimate finding type, and removing validation (B) doesn't stop fabrication, it just stops catching it."
        },
        {
          id: "P10-S5-Q11",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "A findings validation step rejects an extraction because the sum of three reported 'lines_changed' sub-counts doesn't equal the reported 'total_lines_changed.' What is the most effective next step?",
          options: [
            { key: "A", text: "Retry the same extraction request unchanged, assuming the model will self-correct on a second attempt." },
            { key: "B", text: "Send a follow-up request including the original diff, the failed extraction, and the specific validation error (the mismatched sum), asking the model to correct it." },
            { key: "C", text: "Discard the entire PR review and ask a human to redo it manually, since the model has shown it cannot be trusted with arithmetic." },
            { key: "D", text: "Silently recompute 'total_lines_changed' server-side from the sub-counts and ignore the model's reported total without telling it anything went wrong, which is the quickest and cheapest way to get a correct total." }
          ],
          correct: ["B"],
          explanation: "Including the original input, the failed extraction, and the specific validation error in a follow-up request gives the model exactly the information it needs to self-correct a semantic error. Retrying unchanged (A) gives the model no new information to fix the mistake. Discarding the whole review (C) overreacts to a single correctable arithmetic error, and silently recomputing without surfacing the discrepancy (D) hides a signal that might indicate a deeper extraction problem."
        },
        {
          id: "P10-S5-Q12",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "For 8% of PRs, a required 'linked_ticket_id' field comes back empty because the PR description genuinely never mentions a ticket at all; the information simply isn't present anywhere in the input. The team keeps retrying these with error-feedback prompts, without success. What should they conclude?",
          options: [
            { key: "A", text: "Retrying is appropriate here because every validation failure is eventually resolvable given enough retries." },
            { key: "B", text: "The retries are failing because the validation error message isn't detailed enough; adding more detail will eventually make retries succeed, because the model should eventually produce the missing ticket IDs from the source text." },
            { key: "C", text: "Retrying is ineffective for this case because the required information is absent from the source material, not malformed; the field should instead be nullable or flagged for human follow-up." },
            { key: "D", text: "Switching to a stricter JSON schema with additional format constraints will resolve the missing ticket IDs." }
          ],
          correct: ["C"],
          explanation: "Retries are only effective for format or structural errors; when the required information is simply absent from the source document, no amount of retrying or error-message detail will recover it, so the field should be made nullable or routed for human follow-up instead. Options A, B, and D all assume the problem is retry mechanics or schema strictness rather than genuinely missing source data."
        },
        {
          id: "P10-S5-Q13",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Ledgerline's nightly technical-debt report processes roughly 400 files and isn't needed until the next morning's stand-up; its current real-time API cost is a significant recurring line item. Which processing approach is most appropriate?",
          options: [
            { key: "A", text: "Keep using the real-time synchronous API so results are available immediately, accepting the higher cost since the report is considered important, and to avoid the operational complexity of managing asynchronous batch jobs." },
            { key: "B", text: "Switch the nightly report to the Batches API but add a timeout fallback that reverts to real-time calls if the batch takes more than 2 hours." },
            { key: "C", text: "Switch the nightly report to the Message Batches API for its roughly 50% cost savings, since the up-to-24-hour processing window comfortably fits before the morning deadline." },
            { key: "D", text: "Keep the report real-time but reduce the number of files analyzed each night to cut costs." }
          ],
          correct: ["C"],
          explanation: "The Message Batches API's 50% cost savings and up-to-24-hour window make it well-suited for a non-blocking, overnight report that isn't needed until morning. Keeping it real-time (A) pays a cost premium for latency the use case doesn't require. A 2-hour timeout fallback (B) adds unnecessary complexity when the batch window already comfortably fits the deadline. Reducing analyzed files (D) cuts cost by sacrificing coverage instead of using the cheaper, latency-tolerant API designed for exactly this workload."
        },
        {
          id: "P10-S5-Q14",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Ledgerline promises downstream teams a 30-hour SLA for its weekly compliance-document batch analysis, using the Message Batches API (up to a 24-hour processing window, with no guaranteed latency). To reliably meet the 30-hour SLA even in a worst case, how often should Ledgerline submit batches, and why?",
          options: [
            { key: "A", text: "Submit a new batch every 4 hours, so that even a batch taking close to the full 24-hour window still completes with roughly 6 hours of margin before the 30-hour SLA deadline relative to its submission time." },
            { key: "B", text: "Submit one batch at the start of the week and nothing else, since the 24-hour window is already within the 30-hour SLA, and it minimizes overhead by avoiding multiple batches that would each need separate result handling and monitoring." },
            { key: "C", text: "Submit batches continuously with no fixed cadence, relying on status polling to catch anything that's running long." },
            { key: "D", text: "Submit a new batch every 28 hours, since that's just inside the 30-hour SLA window." }
          ],
          correct: ["A"],
          explanation: "Because any individual batch could take close to the full 24-hour window with no guaranteed SLA, a 4-hour submission cadence leaves a reliable margin (roughly 6 hours) against the 30-hour commitment for documents submitted at any point in that cadence. Submitting only once (B) leaves no margin and no recourse if that single batch runs long. Submitting with no fixed cadence (C) provides no calculable guarantee, and a 28-hour cadence (D) leaves essentially no safety margin at all against the 30-hour SLA."
        },
        {
          id: "P10-S5-Q15",
          domain: 4,
          task: "4.6",
          type: "multiple",
          select: 3,
          stem: "Ledgerline is redesigning its review-quality architecture. Which three practices are supported by sound review-reliability principles? (Select THREE.)",
          options: [
            { key: "A", text: "Use a second, independent Claude instance with no access to the original generating session's reasoning context to review generated code, since a self-reviewing session retains its own reasoning and is less likely to question its earlier decisions." },
            { key: "B", text: "Split a large multi-file review into focused per-file passes for local issues, plus a separate cross-file integration pass for data-flow issues, to avoid attention dilution." },
            { key: "C", text: "Have the model self-report a confidence score alongside each finding during a verification pass, to enable calibrated routing of lower-confidence findings to deeper human review." },
            { key: "D", text: "Rely on the original generating session's own extended-thinking self-review as a full substitute for an independent second review instance." },
            { key: "E", text: "Increase the generating model's context window so it can review all files from the PR in a single uninterrupted pass without needing any per-file structure." }
          ],
          correct: ["A", "B", "C"],
          explanation: "Independent review instances without the generator's reasoning context catch issues self-review misses, splitting large reviews into per-file plus integration passes avoids attention dilution, and self-reported confidence scores enable calibrated routing of findings to human review. Option D treats self-review as sufficient when it is specifically called out as a weaker substitute for independent review, and option E assumes a larger context window alone fixes attention-quality issues, which it does not."
        }
      ]
    }
  ]
});

