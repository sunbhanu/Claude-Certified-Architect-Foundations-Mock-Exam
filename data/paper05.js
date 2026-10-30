window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  id: 5,
  title: "Mock Exam 5",
  scenarios: [
    {
      id: 1,
      title: "Customer Support Resolution Agent",
      description: "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      questions: [
        {
          id: "P5-S1-Q1",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Solstice Retail's support agent Nova logs show that in roughly 1 in 20 conversations, the agentic loop terminates after a tool_use response without executing the requested tool, leaving the customer without a refund status update. Engineers find the loop control logic checks whether Claude's response contains any text content and stops as soon as text appears, regardless of whether tool calls are also present. What is the root cause of this reliability issue?",
          options: [
            { key: "A", text: "The loop should execute tools whenever stop_reason is \"tool_use\" and only terminate when stop_reason is \"end_turn\", rather than using text content as a termination signal." },
            { key: "B", text: "The loop needs an arbitrary maximum iteration cap to prevent it from running indefinitely." },
            { key: "C", text: "The agent should parse the assistant's natural language for phrases indicating task completion before stopping." },
            { key: "D", text: "The context window is too small to hold the full tool call, so the loop drops it silently." }
          ],
          correct: ["A"],
          explanation: "The agentic loop must key off stop_reason, not the presence of text, since Claude can emit commentary alongside tool_use blocks. Checking for text content as a completion indicator is exactly the anti-pattern described in the guide. B (iteration caps) and C (parsing natural language) are also documented anti-patterns for loop termination, and D misdiagnoses the symptom as a context-size problem when it is a control-flow bug."
        },
        {
          id: "P5-S1-Q2",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "An audit of Nova's refund approvals finds that 7% of process_refund calls occurred using only an email address match from the customer's message, without a prior get_customer call returning a verified customer ID. The system prompt already states \"always verify identity before refunds.\" What change will most reliably eliminate this gap?",
          options: [
            { key: "A", text: "Rewrite the system prompt sentence to be more emphatic, e.g. \"You MUST verify identity before any refund, no exceptions.\"" },
            { key: "B", text: "Add a programmatic prerequisite that blocks process_refund from executing unless a prior get_customer call in the same session returned a verified customer ID." },
            { key: "C", text: "Add three additional few-shot examples showing get_customer being called before process_refund, on the reasoning that enough repeated demonstrations of the correct ordering will make Claude generalize it reliably." },
            { key: "D", text: "Lower the temperature setting used for Nova's requests, on the theory that reduced sampling randomness will make the model follow the stated verification order more consistently across requests." }
          ],
          correct: ["B"],
          explanation: "Prompt wording (A), few-shot examples (C), and temperature tuning (D) are all probabilistic nudges with a non-zero failure rate; none can guarantee the ordering constraint. Only a programmatic gate that blocks process_refund until a verified customer ID exists in context provides the deterministic compliance that an identity-before-financial-operation rule requires."
        },
        {
          id: "P5-S1-Q3",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Nova's three MCP tools return timestamps in inconsistent formats: lookup_order returns ISO 8601 strings, process_refund returns Unix epoch integers, and get_customer returns a numeric status code where 1 means active and 0 means closed. Engineers notice Nova occasionally misinterprets a closed account as active because it reasons directly over the raw numeric code. What is the best way to fix this?",
          options: [
            { key: "A", text: "Add a sentence to the system prompt explaining what each numeric code and timestamp format means, trusting the model to apply this mapping correctly every time it encounters the raw values during reasoning." },
            { key: "B", text: "Replace all three tools with a single tool that returns only pre-formatted strings, removing all structured fields." },
            { key: "C", text: "Implement a PostToolUse hook that normalizes all three tools' outputs into a consistent, human-readable format before Nova processes them." },
            { key: "D", text: "Increase the number of few-shot examples that demonstrate correct interpretation of status codes, on the assumption that enough repeated demonstrations will make the mapping stick consistently going forward." }
          ],
          correct: ["C"],
          explanation: "A PostToolUse hook deterministically transforms heterogeneous tool outputs before the model ever sees them, eliminating the ambiguity entirely. Prompt explanations (A) and few-shot examples (D) rely on the model correctly applying the rule every time, which is why the misinterpretation is already happening. Collapsing to a single tool (B) loses structured fields other logic may need and doesn't directly address normalization."
        },
        {
          id: "P5-S1-Q4",
          domain: 1,
          task: "1.5",
          type: "single",
          select: 1,
          stem: "Solstice's refund policy caps autonomous agent refunds at $500; anything higher requires human approval. A review finds Nova approved several $650-$900 refunds on its own because the system prompt's dollar-amount rule was buried in a long paragraph of policy text. What is the most effective fix?",
          options: [
            { key: "A", text: "Move the $500 threshold to the very first sentence of the system prompt for better visibility." },
            { key: "B", text: "Ask Nova to double-check its own math before submitting any refund amount, reasoning that an explicit self-verification instruction will reliably catch threshold violations before the tool call is made." },
            { key: "C", text: "Add a few-shot example showing a $900 refund being correctly escalated, on the assumption that one additional demonstration will generalize to all future over-threshold refund amounts." },
            { key: "D", text: "Implement a tool-call interception hook that blocks process_refund when the requested amount exceeds $500 and redirects to escalate_to_human." }
          ],
          correct: ["D"],
          explanation: "A dollar-amount compliance threshold is exactly the kind of business rule that needs guaranteed enforcement, not improved prompt phrasing. A hook that programmatically intercepts and blocks the tool call is deterministic regardless of prompt wording. Options A, B, and C are all prompt-based adjustments that remain probabilistic and have already proven insufficient."
        },
        {
          id: "P5-S1-Q5",
          domain: 1,
          task: "1.4",
          type: "single",
          select: 1,
          stem: "When Nova escalates to a human agent, the human has no access to the prior conversation transcript, only a ticket ID. Support leads report that escalated tickets frequently require the human agent to re-ask the customer basic questions already answered. What should the escalate_to_human handoff include to fix this?",
          options: [
            { key: "A", text: "A structured summary containing the customer ID, root cause of the issue, any relevant amounts, and a recommended next action." },
            { key: "B", text: "Just the customer ID, so the human agent can look up the account themselves." },
            { key: "C", text: "A verbatim copy of the entire conversation transcript, unedited, so the human agent has the complete raw record to read through and reconstruct the situation independently." },
            { key: "D", text: "A sentiment score indicating how frustrated the customer seemed during the conversation, so the human agent can gauge urgency and prioritize the ticket before investigating further." }
          ],
          correct: ["A"],
          explanation: "A structured handoff summary with customer ID, root cause, amounts, and recommended action gives the human agent everything needed to act without re-investigation. Option B is too sparse and still forces re-investigation. Option C dumps unstructured data the human must re-read and interpret under time pressure. Option D is not actionable information for resolving the case."
        },
        {
          id: "P5-S1-Q6",
          domain: 1,
          task: "1.6",
          type: "multiple",
          select: 2,
          stem: "A customer messages Nova: \"My order #48213 arrived damaged AND I was double-charged for it.\" Logs show Nova currently investigates only the damage claim and ignores the billing issue, closing the ticket with half the request unresolved. Which two changes would best address this pattern? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct Nova to always ask the customer to submit separate tickets for each issue mentioned in a single message." },
            { key: "B", text: "Add a classifier that scores message \"complexity\" and routes multi-issue messages directly to a human." },
            { key: "C", text: "Decompose multi-concern messages into distinct sub-issues before investigating, then synthesize a single unified resolution covering all of them." },
            { key: "D", text: "Investigate each identified sub-issue using the shared conversation context so findings from one inform the other where relevant." },
            { key: "E", text: "Increase the maximum number of tool calls allowed per turn so Nova has more budget to work with." }
          ],
          correct: ["C", "D"],
          explanation: "Decomposing a multi-concern request into its constituent issues, then investigating each (sharing context) before producing one synthesized response, is the documented pattern for handling such requests without dropping half the request. Option A offloads the problem to the customer rather than fixing the agent. Option E addresses tool-call budget, not the decomposition logic itself. Option B introduces unnecessary ML infrastructure for a problem better solved by prompt/workflow design."
        },
        {
          id: "P5-S1-Q7",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Solstice wants Nova to be able to look up an order, then decide — based on what it finds — whether to check loyalty tier, process a refund, or escalate, without a developer hand-coding every possible path. Which design most directly achieves this?",
          options: [
            { key: "A", text: "A pre-configured decision tree that maps each order status to a fixed next tool call." },
            { key: "B", text: "Model-driven tool selection where Claude reasons over the current conversation and prior tool results to choose the next action at each iteration." },
            { key: "C", text: "A keyword-matching router that inspects the customer's message before every turn and forces a specific tool." },
            { key: "D", text: "A fixed sequential pipeline that always calls the same four tools in the same order." }
          ],
          correct: ["B"],
          explanation: "Model-driven decision-making lets Claude reason about which tool to call next based on evolving context, which is what \"decide based on what it finds\" requires. Options A, C, and D are all pre-configured, deterministic sequences that cannot adapt to findings discovered mid-conversation, defeating the stated goal."
        },
        {
          id: "P5-S1-Q8",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Solstice's billing-dispute conversations are highly variable — the right next step depends heavily on what previous tool calls reveal (prior refund history, dispute reason, account tenure). Account-closure conversations, by contrast, always follow the same four verification steps regardless of circumstances. What is the most appropriate decomposition strategy for each?",
          options: [
            { key: "A", text: "Use dynamic, adaptive decomposition for billing disputes and a fixed sequential pipeline for account closures." },
            { key: "B", text: "Use a fixed sequential pipeline for both, since consistency across conversation types simplifies maintenance." },
            { key: "C", text: "Use dynamic, adaptive decomposition for both, since it maximizes flexibility everywhere." },
            { key: "D", text: "Use a fixed sequential pipeline for billing disputes and dynamic decomposition for account closures, on the premise that this reversed mapping better matches each workflow's actual unpredictability." }
          ],
          correct: ["A"],
          explanation: "Fixed sequential pipelines (prompt chaining) suit predictable, invariant workflows like account closure, while dynamic decomposition suits open-ended investigation where the right next step depends on intermediate findings, like billing disputes. B ignores that billing disputes are unpredictable, C adds unnecessary complexity to a workflow that doesn't need it, and D reverses the appropriate mapping."
        },
        {
          id: "P5-S1-Q9",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "Nova sometimes calls process_refund when the customer only asked to exchange a damaged item for store credit via a separate issue_store_credit tool. Both tools' descriptions read \"Issues a refund-type adjustment to the customer's account\" with no further detail. Which two changes would most effectively reduce this misrouting? (Select TWO.)",
          options: [
            { key: "A", text: "Rewrite each tool's description to state its distinct purpose, accepted inputs, and example queries that should route to it versus the other." },
            { key: "B", text: "Merge both tools into a single adjust_account tool and let Nova pick an \"adjustment_type\" parameter." },
            { key: "C", text: "Add a hard-coded if/else block in application code that intercepts the customer's message before Nova sees it and decides which tool to call." },
            { key: "D", text: "Increase the temperature parameter so Nova considers a wider variety of tool choices." },
            { key: "E", text: "Rename the tools so their names alone signal the difference, e.g. process_cash_refund and issue_store_credit_adjustment." }
          ],
          correct: ["A", "E"],
          explanation: "Clear, differentiated descriptions and unambiguous names are the primary levers for reliable LLM tool selection, directly matching the guide's recommendation to rename and re-describe overlapping tools. Merging the tools (B) just moves the ambiguity into a parameter the model must now disambiguate instead. Bypassing the LLM with hard-coded routing (C) defeats the purpose of using an agent, and raising temperature (D) increases randomness rather than improving selection accuracy."
        },
        {
          id: "P5-S1-Q10",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "get_customer returns isError: true with no further detail whenever the lookup fails, whether the account genuinely doesn't exist, the backend timed out, or the agent lacks permission for a flagged account. Nova responds identically to all three cases by telling the customer \"please try again later,\" even for accounts that will never be found. What is the most effective fix?",
          options: [
            { key: "A", text: "Return a generic \"Operation failed\" message consistently, keeping the interface simple and avoiding the added complexity of maintaining differentiated error types across every MCP tool." },
            { key: "B", text: "Return structured error metadata including an errorCategory (e.g., validation, transient, permission) and an isRetryable boolean so Nova can respond appropriately to each case." },
            { key: "C", text: "Have Nova retry every failed get_customer call exactly three times before giving up, reasoning that repeated attempts will eventually succeed regardless of whether the cause is transient or permanent." },
            { key: "D", text: "Remove the isError flag entirely and have get_customer throw an unhandled exception instead." }
          ],
          correct: ["B"],
          explanation: "Structured error metadata lets the agent distinguish retryable transient failures from permanent validation or permission failures and respond appropriately to each, rather than treating them uniformly. Option A is the uniform-response anti-pattern already causing the problem. Option C wastes retries on non-existent accounts that will never succeed. Option D removes the one signal (isError) the agent currently has, making things worse."
        },
        {
          id: "P5-S1-Q11",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "lookup_order sometimes returns zero matching orders for a customer who genuinely has no order history, and sometimes returns zero matches because the order database connection timed out. Nova's current error handling treats both as \"no orders found\" and tells the customer they have never ordered anything, even when the backend actually failed. What distinction does the tool need to expose?",
          options: [
            { key: "A", text: "The customer's loyalty tier, so the response can be personalized and the agent can decide how generous to be based on the customer's long-term value to Solstice." },
            { key: "B", text: "A self-reported confidence score for how certain the tool is about the result, letting Nova weigh the lookup's reliability before deciding how to phrase its response." },
            { key: "C", text: "The total number of orders Solstice has processed that day, for context, so Nova can reference overall platform activity levels when responding to the customer." },
            { key: "D", text: "The difference between an access failure (the query could not be completed) and a valid empty result (the query succeeded and found nothing)." }
          ],
          correct: ["D"],
          explanation: "Distinguishing a failed/incomplete query (access failure) from a successful query that legitimately returned no results is essential so the agent doesn't present backend failures as confirmed facts about the customer. Loyalty tier (A), a self-reported confidence score (B), and daily order volume (C) are unrelated to resolving this specific failure-versus-empty-result ambiguity."
        },
        {
          id: "P5-S1-Q12",
          domain: 2,
          task: "2.3",
          type: "multiple",
          select: 2,
          stem: "To give Nova maximum flexibility, engineers connected 16 MCP tools spanning support, shipping, marketing, and internal analytics. Tool selection accuracy has since dropped, and Nova occasionally calls marketing tools during refund conversations. Which two changes would most directly address this? (Select TWO.)",
          options: [
            { key: "A", text: "Add a short disclaimer tool description noting \"only use this tool if relevant.\"" },
            { key: "B", text: "Scope Nova's available tools down to the 4-5 tools actually relevant to support resolution." },
            { key: "C", text: "For any tools genuinely needed across roles, keep them narrowly scoped rather than exposing entire other-team toolsets." },
            { key: "D", text: "Keep all 16 tools but reorder them alphabetically in the configuration file." },
            { key: "E", text: "Increase the maximum context window so Nova has more room to consider all 16 tools." }
          ],
          correct: ["B", "C"],
          explanation: "Reducing an agent's tool count to only what its role requires is the documented fix for degraded tool-selection reliability caused by excessive choice; where cross-role access is genuinely needed, it should be scoped narrowly rather than exposing an entire unrelated toolset. A disclaimer (A) and reordering (D) don't change the underlying decision complexity, and a bigger context window (E) doesn't address tool-selection reliability at all."
        },
        {
          id: "P5-S1-Q13",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "Nova is built to run a mandatory audit-logging tool at the very start of every conversation before any other tool runs, regardless of what the customer says. Which tool_choice configuration most directly enforces this for that first call?",
          options: [
            { key: "A", text: "tool_choice: \"auto\", letting Nova decide freely whether to call the audit tool." },
            { key: "B", text: "tool_choice: {\"type\": \"tool\", \"name\": \"log_audit_event\"}, forcing that specific tool to be called first." },
            { key: "C", text: "tool_choice: \"any\", requiring Nova to call some tool but not specifying which one." },
            { key: "D", text: "No tool_choice parameter, relying on the system prompt instruction to call it first." }
          ],
          correct: ["B"],
          explanation: "Forced tool selection with a named tool guarantees that exact tool is called, which is required when a specific tool must run first regardless of context. \"auto\" (A) leaves the decision to the model and may skip it; \"any\" (C) guarantees a tool call but not which one; omitting tool_choice (D) relies on probabilistic prompt compliance, which the scenario already shows is unreliable for hard ordering requirements."
        },
        {
          id: "P5-S1-Q14",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "An engineer wants to try an experimental summarization MCP server with Nova for his own testing, without affecting the shared configuration other developers use in the CI/CD pipeline. Where should this experimental server be configured?",
          options: [
            { key: "A", text: "In the project's .mcp.json, so it is available to the whole team immediately." },
            { key: "B", text: "In the CLAUDE.md file at the project root, documented as a note for future configuration." },
            { key: "C", text: "In the engineer's personal ~/.claude.json, so it's available only in his own environment." },
            { key: "D", text: "Directly hard-coded into Nova's application source code as a constant." }
          ],
          correct: ["C"],
          explanation: "User-scoped configuration in ~/.claude.json is intended for personal or experimental servers that shouldn't be shared with the team, exactly this use case. Project-scoped .mcp.json (A) would push the experimental server to every teammate and the CI pipeline. CLAUDE.md (B) is for instructions/context, not MCP server registration. Hard-coding into source (D) bypasses the configuration system entirely and couples experimentation to the codebase."
        },
        {
          id: "P5-S1-Q15",
          domain: 5,
          task: "5.2",
          type: "single",
          select: 1,
          stem: "get_customer returns two different customer records both matching the name and partial phone number the customer provided during a billing dispute. Nova currently picks the first record returned and proceeds with a refund, twice issuing refunds to the wrong account last month. What should Nova do instead?",
          options: [
            { key: "A", text: "Pick the record with the more recent account-creation date, since that is more likely to be current." },
            { key: "B", text: "Proceed with both accounts simultaneously and let the backend reconcile any discrepancy, trusting that downstream validation will catch any misapplied refund automatically." },
            { key: "C", text: "Escalate immediately to a human without attempting any disambiguation, even for simple cases, since any ambiguity at all is treated as too risky for the agent to resolve." },
            { key: "D", text: "Ask the customer for an additional identifier (such as a full phone number, email, or order number) to disambiguate before proceeding." }
          ],
          correct: ["D"],
          explanation: "When tool results return multiple matching customers, the correct pattern is to request additional identifying information rather than resolve the ambiguity with a heuristic guess, which is exactly what caused the misdirected refunds. A is still a heuristic guess that could easily be wrong. B risks acting against the wrong account. C is an overreaction that escalates a case that could likely be resolved with one clarifying question."
        }
      ]
    },
    {
      id: 3,
      title: "Multi-Agent Research System",
      description: "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.",
      questions: [
        {
          id: "P5-S3-Q1",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Vantage Insights' coordinator agent \"Atlas\" delegates a research request on \"emerging battery chemistries for grid storage\" to web_search_agent and document_analysis_agent, then passes their combined output to synthesis_agent. The resulting report has only one supporting source for a major claim about cost trajectories through 2030, and omits recent regulatory developments entirely. Atlas currently invokes synthesis_agent exactly once per request. What change would most directly fix this pattern?",
          options: [
            { key: "A", text: "Have Atlas evaluate the synthesis output for coverage gaps, re-delegate targeted follow-up queries to web_search_agent and document_analysis_agent, and re-invoke synthesis_agent until coverage is sufficient." },
            { key: "B", text: "Increase the number of search results each web_search_agent call returns from 10 to 50." },
            { key: "C", text: "Replace synthesis_agent with a single larger prompt that asks Atlas to write the report itself." },
            { key: "D", text: "Set a hard requirement that every claim in the report cite at least three sources, rejecting the report otherwise." }
          ],
          correct: ["A"],
          explanation: "An iterative refinement loop — where the coordinator evaluates synthesis for gaps and re-delegates targeted queries before re-synthesizing — is the documented pattern for improving coverage. Option B increases volume without targeting the actual gap (regulatory developments). Option C removes the specialized synthesis step rather than fixing its inputs. Option D is a blunt validation rule that could reject good reports or pass bad ones without actually improving research coverage."
        },
        {
          id: "P5-S3-Q2",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "A newly added coordinator config for Atlas omits \"Task\" from its allowedTools list. During testing, Atlas responds to research requests with a single long text answer and never invokes any subagent. What is the most likely cause?",
          options: [
            { key: "A", text: "The subagents' AgentDefinition files are missing system prompts, which would leave each subagent without role-specific instructions for its assigned research task." },
            { key: "B", text: "The web_search_agent's MCP server is not registered in .mcp.json, which would prevent that specific subagent's search tool from being available once invoked." },
            { key: "C", text: "The coordinator cannot spawn subagents because its allowedTools list does not include \"Task,\" the mechanism used to invoke them." },
            { key: "D", text: "Atlas's context window is too small to hold the subagent results, causing it to silently drop the Task invocations before any subagent can respond." }
          ],
          correct: ["C"],
          explanation: "The Task tool is the mechanism a coordinator uses to spawn subagents, and it must be explicitly present in allowedTools or the coordinator has no way to delegate, which explains the single-response behavior. Missing system prompts (A) would affect subagent behavior, not whether they're invoked at all. A missing MCP registration (B) would cause a tool failure after invocation, not prevent invocation. Context window size (D) is unrelated to whether the Task tool is even callable."
        },
        {
          id: "P5-S3-Q3",
          domain: 1,
          task: "1.3",
          type: "single",
          select: 1,
          stem: "Atlas currently delegates research in three sequential turns: first it emits one Task call to web_search_agent and waits for the result, then emits one Task call to document_analysis_agent and waits, then invokes synthesis_agent. A product review notes that end-to-end report generation takes nearly twice as long as necessary given that the search and document subagents don't depend on each other's output. What change reduces latency without changing what each subagent does?",
          options: [
            { key: "A", text: "Reduce the number of search results web_search_agent is allowed to return, on the theory that processing fewer results per call will make each sequential subagent turn complete faster." },
            { key: "B", text: "Merge web_search_agent and document_analysis_agent into one subagent that does both jobs." },
            { key: "C", text: "Cache the results of previous research requests to skip redundant subagent calls, assuming most incoming requests will closely resemble ones already answered previously." },
            { key: "D", text: "Emit the Task calls to web_search_agent and document_analysis_agent together in a single coordinator response so they execute in parallel." }
          ],
          correct: ["D"],
          explanation: "Emitting multiple Task tool calls within a single coordinator response allows independent subagents to execute in parallel rather than waiting on each other sequentially, directly cutting latency when there's no data dependency between them. A reduces result volume but doesn't address sequencing. B changes subagent responsibilities rather than execution order and loses specialization benefits. C only helps for repeated requests, not the general latency problem described."
        },
        {
          id: "P5-S3-Q4",
          domain: 1,
          task: "1.2",
          type: "single",
          select: 1,
          stem: "Atlas's current design always invokes all four subagents (web_search_agent, document_analysis_agent, synthesis_agent, report_agent) for every request, including simple fact-lookup questions like \"what is the current spot price of lithium carbonate?\" that don't need document analysis or multi-source synthesis. What change better matches the coordinator pattern described for Vantage Insights' use case?",
          options: [
            { key: "A", text: "Have Atlas analyze each incoming query's complexity and dynamically decide which subagents are actually needed rather than always routing through the full pipeline." },
            { key: "B", text: "Keep all four subagents mandatory, but reduce each one's individual token budget to compensate for the extra overhead." },
            { key: "C", text: "Remove document_analysis_agent entirely from the system to simplify the architecture, since fact-lookup questions never seem to need deep document analysis in practice." },
            { key: "D", text: "Add a fixed delay before each subagent call so results arrive more consistently, under the assumption that pacing requests will naturally reduce unnecessary pipeline invocations." }
          ],
          correct: ["A"],
          explanation: "A well-designed coordinator analyzes query requirements and selects which subagents to invoke dynamically, rather than always running the full pipeline regardless of need. B doesn't address unnecessary invocation, just token limits. C permanently removes a capability needed for other, more complex queries. D is unrelated to the decomposition problem and only adds latency."
        },
        {
          id: "P5-S3-Q5",
          domain: 1,
          task: "1.6",
          type: "single",
          select: 1,
          stem: "Vantage Insights has two distinct research workflows: a standardized \"quarterly commodity price summary\" that always follows the same four steps, and an open-ended \"competitive landscape investigation\" where the right next step depends heavily on what prior findings reveal. Which decomposition approach best fits each?",
          options: [
            { key: "A", text: "Dynamic decomposition for both workflows, since treating every task as open-ended is always the more flexible, future-proof default choice." },
            { key: "B", text: "Prompt chaining for both workflows, since enforcing the same fixed sequence everywhere simplifies maintenance and keeps behavior predictable." },
            { key: "C", text: "Prompt chaining (fixed sequential steps) for the quarterly summary; dynamic, adaptive decomposition for the competitive landscape investigation." },
            { key: "D", text: "Dynamic decomposition for the quarterly summary; prompt chaining for the competitive landscape investigation, reversing the mapping to match existing tooling." }
          ],
          correct: ["C"],
          explanation: "Predictable, invariant workflows like a standardized quarterly summary are well suited to fixed prompt chaining, while open-ended investigations whose next steps depend on discovered findings need dynamic, adaptive decomposition. A adds unneeded complexity and unpredictability to a standardized task. B forces a rigid pipeline onto an investigation that needs adaptability. D reverses the appropriate mapping between the two workflows."
        },
        {
          id: "P5-S3-Q6",
          domain: 1,
          task: "1.3",
          type: "multiple",
          select: 2,
          stem: "When web_search_agent passes its findings to synthesis_agent, the current implementation concatenates everything into one plain text blob: claim text, source URLs, and document names all run together in paragraph form. synthesis_agent has started attributing claims to the wrong sources in the final report. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Shorten each claim to a single sentence to reduce the total token count passed to synthesis_agent." },
            { key: "B", text: "Increase web_search_agent's result limit from 10 to 30 so it finds more candidate sources." },
            { key: "C", text: "Have synthesis_agent re-run its own web searches to independently verify each source before writing the report." },
            { key: "D", text: "Use a structured data format that separates claim content from metadata (source URL, document name, page number) so attribution is preserved when passed between agents." },
            { key: "E", text: "Include the complete findings from web_search_agent directly in synthesis_agent's prompt rather than assuming it inherits them automatically." }
          ],
          correct: ["D", "E"],
          explanation: "Structuring content separately from metadata preserves which claim came from which source, and explicitly including complete findings in the subagent's prompt (since subagents don't automatically inherit the coordinator's or another subagent's context) together fix the attribution problem. Shortening claims (A) risks losing the detail needed for accurate citation and doesn't fix the structural mixing of content and metadata. Having synthesis re-search (C) duplicates work and is not its specialized role. More search results (B) doesn't address the attribution bug at all."
        },
        {
          id: "P5-S3-Q7",
          domain: 1,
          task: "1.1",
          type: "single",
          select: 1,
          stem: "Inside document_analysis_agent's own agentic loop, engineers implemented termination logic that stops calling tools as soon as the agent's response contains the word \"summary\" anywhere in its text. The agent now occasionally stops mid-analysis after a partial tool result mentions \"executive summary\" in a document excerpt. What is the correct termination signal to use instead?",
          options: [
            { key: "A", text: "Continue scanning assistant text for the word \"summary\" but add more exclusion keywords, refining the list whenever a new false trigger is discovered in production." },
            { key: "B", text: "Add a hard cap of 5 tool calls regardless of content, assuming that number is generous enough to cover any realistic document analysis workflow." },
            { key: "C", text: "Terminate whenever any tool result contains the word \"summary\", treating that keyword as a reliable signal that analysis has concluded." },
            { key: "D", text: "Continue the loop while stop_reason is \"tool_use\" and terminate only when stop_reason is \"end_turn\"." }
          ],
          correct: ["D"],
          explanation: "Loop control should rely on stop_reason, not on keyword matching within text content, which is unreliable and exactly caused this bug. A merely patches the symptom with more brittle keyword rules. B (iteration caps) and C (keyword matching on tool results) are both anti-patterns for determining loop termination described in the guide."
        },
        {
          id: "P5-S3-Q8",
          domain: 2,
          task: "2.1",
          type: "multiple",
          select: 2,
          stem: "web_search_agent's only tool accepts a single input parameter, query (a plain string), with no way to cap the number of results, restrict results to a date range, or exclude domains a sibling subagent has already covered. As a result, Atlas re-invokes web_search_agent five or six times per request, issuing a series of near-duplicate queries to manually work around these missing controls. Which two tool-definition changes would most effectively reduce this excessive re-invocation? (Select TWO.)",
          options: [
            { key: "A", text: "Extend the tool's input schema with explicit parameters — max_results, published_after, and exclude_domains — so a single call can express what previously required several reissued queries." },
            { key: "B", text: "Tell web_search_agent in its system prompt to \"try to be more efficient and avoid unnecessary repeated searches\" without changing the tool itself." },
            { key: "C", text: "Document each new parameter clearly in the tool's description, including example values, so the model reliably recognizes when and how to use them rather than ignoring undocumented fields." },
            { key: "D", text: "Raise the maximum number of Task calls Atlas is allowed to make per request, so the extra re-invocations simply happen less visibly to the research team." },
            { key: "E", text: "Remove the query parameter entirely and replace it with one large upfront prompt describing everything web_search_agent should search for in a single pass." }
          ],
          correct: ["A", "C"],
          explanation: "Adding the missing parameters directly closes the functional gap causing repeated re-invocation, and documenting them in the tool description ensures the model actually discovers and uses the new controls rather than defaulting to its old query-only pattern. A prompt-only efficiency reminder (B) doesn't give the model any new capability to act on. Raising the Task-call ceiling (D) hides the symptom rather than fixing the underlying tool gap. Collapsing everything into one upfront prompt (E) removes the flexibility of iterative, targeted search entirely."
        },
        {
          id: "P5-S3-Q9",
          domain: 2,
          task: "2.2",
          type: "single",
          select: 1,
          stem: "When web_search_agent's search backend times out, it currently returns {\"isError\": true, \"message\": \"search unavailable\"} with nothing else. Atlas cannot tell whether to retry, skip this subtopic and proceed with partial results, or abort the entire research request, so it currently aborts every time a single search times out. What should web_search_agent return instead?",
          options: [
            { key: "A", text: "{\"isError\": true} with no further detail, so Atlas treats every failure identically." },
            { key: "B", text: "Structured error context including failure type, the query attempted, partial results gathered, and suggested alternative queries." },
            { key: "C", text: "A success response with an empty results array so Atlas doesn't notice the failure." },
            { key: "D", text: "A message instructing Atlas to immediately escalate to a human researcher." }
          ],
          correct: ["B"],
          explanation: "Structured error context — failure type, what was attempted, partial results, and alternatives — gives the coordinator enough information to decide between retry, partial progress, or abort, rather than defaulting to total abort on every transient failure. Option A removes even more information than the current implementation. Option C silently suppresses the error, a documented anti-pattern that hides real failures as if they were valid empty results. Option D escalates to a human unnecessarily for what may be a simple transient timeout."
        },
        {
          id: "P5-S3-Q10",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "synthesis_agent has been given the same 12 tools as web_search_agent and document_analysis_agent \"just in case it needs them.\" Logs show synthesis_agent occasionally invokes the web search tool directly mid-synthesis instead of requesting that Atlas re-delegate a search, producing unvetted, uncited claims. What is the best fix?",
          options: [
            { key: "A", text: "Leave synthesis_agent's tools as-is but add a system prompt reminder not to search the web directly, trusting a clearly worded instruction to reliably override its standing access to the search tool." },
            { key: "B", text: "Remove all tools from synthesis_agent entirely, including any narrowly scoped ones, so it can only process text it's given and has no way to independently verify or supplement any claim at all." },
            { key: "C", text: "Restrict synthesis_agent's tools to only what its synthesis role requires, providing a narrowly scoped verify_fact tool for high-frequency fact-checking needs instead of full web search access." },
            { key: "D", text: "Give synthesis_agent even more tools so it has a complete picture of all available capabilities, reasoning that broader access will help it make better-informed synthesis decisions overall." }
          ],
          correct: ["C"],
          explanation: "Scoping each subagent's tools to its specialization, with only narrowly-scoped cross-role tools where genuinely needed, prevents misuse like a synthesis agent performing ad hoc unvetted searches. A prompt reminder (A) is a probabilistic fix for what is fundamentally a tool-access problem. Removing all tools (B) may be too restrictive if synthesis genuinely needs occasional fact verification. Giving it more tools (D) directly worsens the described problem."
        },
        {
          id: "P5-S3-Q11",
          domain: 2,
          task: "2.3",
          type: "single",
          select: 1,
          stem: "web_search_agent is designed to always perform a search and never simply reply with conversational text, since its sole job is retrieval. In testing, it occasionally responds with \"I don't think a search is necessary here\" instead of calling its search tool. What tool_choice setting would best enforce the intended behavior?",
          options: [
            { key: "A", text: "tool_choice: \"auto\", trusting the model's judgment about whether to search, since the system prompt already states the agent's sole purpose." },
            { key: "B", text: "tool_choice: \"any\", requiring some tool call but allowing the model to choose which." },
            { key: "C", text: "No tool_choice specified, relying only on the system prompt to say \"always search,\" since instructions alone should be sufficient." },
            { key: "D", text: "tool_choice: {\"type\": \"tool\", \"name\": \"get_customer\"}, forcing an unrelated tool so the agent is never left idle." }
          ],
          correct: ["B"],
          explanation: "Setting tool_choice to \"any\" guarantees the model calls some tool rather than returning conversational text, which fits an agent with a single tool whose entire job is to use it. \"auto\" (A) is exactly the setting that allowed the unwanted text-only response. Omitting tool_choice (C) relies on the same unreliable prompt compliance. Forcing an unrelated tool (D) is nonsensical for this agent's actual tool."
        },
        {
          id: "P5-S3-Q12",
          domain: 2,
          task: "2.4",
          type: "single",
          select: 1,
          stem: "Researchers using Atlas frequently ask it to \"list all prior reports we've published about lithium supply chains,\" which currently requires document_analysis_agent to run several exploratory search and list operations across the report archive before answering. What MCP feature would reduce this exploratory tool-call overhead?",
          options: [
            { key: "A", text: "Exposing the report archive's catalog (titles, topics, dates) as an MCP resource that Atlas can reference directly." },
            { key: "B", text: "Adding a tenth exploratory tool that performs an even broader archive search." },
            { key: "C", text: "Increasing the number of search results returned per exploratory call from 10 to 100." },
            { key: "D", text: "Caching the most recent exploratory search's raw output for reuse on the next unrelated query." }
          ],
          correct: ["A"],
          explanation: "MCP resources are designed to expose content catalogs directly to the agent, giving it visibility into available data without requiring exploratory tool calls to discover it. Adding another broad search tool (B) or returning more results per call (C) still requires exploratory search rather than eliminating it. Caching one query's raw output (D) doesn't generalize to different archive questions."
        },
        {
          id: "P5-S3-Q13",
          domain: 5,
          task: "5.6",
          type: "multiple",
          select: 2,
          stem: "document_analysis_agent finds that one industry report states grid-scale battery storage costs fell 18% in the past year, while a second credible source states costs fell 31% over the same period, using a different cost-accounting methodology. synthesis_agent's draft report currently states a single figure (\"costs fell approximately 25%\") without mentioning the discrepancy. Which two changes should the pipeline make? (Select TWO.)",
          options: [
            { key: "A", text: "Instruct synthesis_agent to always prefer whichever source has the larger numeric value." },
            { key: "B", text: "Have document_analysis_agent pass both figures forward with explicit source attribution and methodological context rather than averaging or choosing one." },
            { key: "C", text: "Average the two figures silently and present only the averaged number as the finding." },
            { key: "D", text: "Structure the final report to explicitly distinguish this contested figure from other well-established findings, rather than presenting it as settled consensus." },
            { key: "E", text: "Drop the cost-decline claim from the report entirely since the sources disagree." }
          ],
          correct: ["B", "D"],
          explanation: "Conflicting statistics from credible sources should be annotated with source attribution and preserved, and the report should structurally distinguish contested findings from well-established ones, so readers can judge the evidence themselves. Picking the larger value (A) or silently averaging (C) both arbitrarily discard information the reader needs. Dropping the claim entirely (E) loses valid, useful information rather than presenting it with appropriate caveats."
        },
        {
          id: "P5-S3-Q14",
          domain: 5,
          task: "5.6",
          type: "single",
          select: 1,
          stem: "Two sources document_analysis_agent retrieves report different lithium carbonate prices: one dated March 2024 and one dated November 2025. The current synthesis_agent output flags these as \"conflicting data\" without noting the dates, and a reviewer wrongly concludes the sources are unreliable. What field should document_analysis_agent have included to prevent this misinterpretation?",
          options: [
            { key: "A", text: "A self-reported confidence score for each extracted price, so Atlas can weigh which figure to trust more heavily when reporting." },
            { key: "B", text: "The publication or collection date of each source, included in the structured output passed to synthesis." },
            { key: "C", text: "The total word count of each source document, since longer documents are generally assumed to be more thoroughly researched." },
            { key: "D", text: "A binary flag marking one source as \"primary\" and the other as \"secondary,\" so synthesis always defers to the primary source's figure." }
          ],
          correct: ["B"],
          explanation: "Including publication or collection dates in structured outputs lets downstream agents correctly interpret price differences as a temporal trend rather than a genuine contradiction between unreliable sources. A confidence score (A) doesn't explain why the numbers differ. Word count (C) is irrelevant to interpreting numeric discrepancies. An arbitrary primary/secondary flag (D) doesn't convey the actual reason for the difference and could bias the report incorrectly."
        },
        {
          id: "P5-S3-Q15",
          domain: 5,
          task: "5.3",
          type: "single",
          select: 1,
          stem: "During a competitive landscape investigation, web_search_agent times out after retrieving results for 3 of 5 assigned subtopics, and returns a structured error for the remaining 2 with partial results included. Atlas must now decide how to proceed. What is the best way for Atlas to handle the final report?",
          options: [
            { key: "A", text: "Abort the entire research request since full coverage could not be achieved, on the premise that any partial result is worse than delivering no result at all." },
            { key: "B", text: "Silently present the 3 completed subtopics as if they were the full scope originally requested, without comment, trusting the requester not to notice reduced coverage." },
            { key: "C", text: "Proceed with the 3 completed subtopics and explicitly annotate the final report with a coverage-gap note identifying the 2 subtopics that could not be researched." },
            { key: "D", text: "Re-run all 5 subtopics from scratch using document_analysis_agent instead, ignoring the partial web search results already gathered, assuming a different subagent will succeed." }
          ],
          correct: ["C"],
          explanation: "Proceeding with partial results while explicitly annotating the coverage gap gives the requester an accurate, usable report plus clear knowledge of its limits, which is the documented pattern for handling partial subagent failures. Aborting entirely (A) discards valid completed work over a partial failure. Silently presenting partial results as complete (B) is a dangerous anti-pattern that misleads the reader. Restarting everything with a different subagent (D) wastes the already-gathered partial results and doesn't address why the timeout occurred."
        }
      ]
    }
    ,
    {
      id: 5,
      title: "Claude Code for Continuous Integration",
      description: "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      questions: [
        {
          id: "P5-S5-Q1",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "Fenwick FinTech's new hire reports that Claude Code in their ledger-core checkout doesn't apply any of the team's Python typing conventions or test fixture standards that every other engineer sees automatically. Investigation shows these conventions are defined only in the new hire's own ~/.claude/CLAUDE.md, copied from a teammate's old laptop backup instead of being in the repository. What is the correct fix?",
          options: [
            { key: "A", text: "Move the conventions into the project-level CLAUDE.md in the repository so they are version-controlled and shared automatically with every team member." },
            { key: "B", text: "Ask every engineer to manually copy the same ~/.claude/CLAUDE.md file onto their own machine, repeating the process every time the shared conventions change." },
            { key: "C", text: "Rename the new hire's file to .claude/CLAUDE.md without changing its location, assuming the filename alone determines whether Claude Code treats it as shared." },
            { key: "D", text: "Add the conventions to the CI pipeline's environment variables instead, reasoning that CI already reads environment variables before every pipeline run begins." }
          ],
          correct: ["A"],
          explanation: "User-level CLAUDE.md applies only to that individual and is never shared via version control, which is exactly why the new hire didn't receive it automatically; project-level CLAUDE.md in the repo is loaded for every team member who clones it. B doesn't scale and defeats the purpose of configuration-as-code. C only matters if the location changes to the project directory, which this option doesn't do. D conflates environment configuration with Claude Code's own memory-file mechanism."
        },
        {
          id: "P5-S5-Q2",
          domain: 3,
          task: "3.1",
          type: "single",
          select: 1,
          stem: "ledger-core is a monorepo with a payments package, a reporting package, and a shared-utils package, each with different domain-specific coding standards. The lead wants one maintainable root CLAUDE.md rather than duplicating long standards sections into every package. What approach should they use?",
          options: [
            { key: "A", text: "Keep one single, long root CLAUDE.md containing every package's standards together, since combining everything avoids needing any cross-file references." },
            { key: "B", text: "Use @import syntax in each package's CLAUDE.md to selectively reference the specific standards files relevant to that package's maintainers." },
            { key: "C", text: "Create a .claude/config.json file listing which standards apply to which package, assuming Claude Code reads this mapping automatically at session start." },
            { key: "D", text: "Instruct engineers to read the relevant standards file manually before starting work in each package, trusting memory and discipline instead of automatic loading." }
          ],
          correct: ["B"],
          explanation: "@import lets each package's CLAUDE.md pull in only the standards files relevant to it, keeping configuration modular and avoiding duplication, which matches the stated goal. A single monolithic file (A) is exactly the duplication/maintenance problem being avoided. There is no such .claude/config.json mechanism for this purpose (C) in Claude Code. Manual reading (D) is not a configuration mechanism and relies on engineers remembering to do it."
        },
        {
          id: "P5-S5-Q3",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "Fenwick wants a /review slash command that runs a standardized checklist, available to every engineer the moment they clone ledger-core, with no individual setup steps. Where should the command file live?",
          options: [
            { key: "A", text: "In ~/.claude/commands/ on the engineer's machine." },
            { key: "B", text: "In .claude/commands/ inside the ledger-core repository." },
            { key: "C", text: "Embedded as a section inside the root CLAUDE.md." },
            { key: "D", text: "In a company-wide shared network drive outside the repository." }
          ],
          correct: ["B"],
          explanation: "Commands placed in .claude/commands/ within the repo are version-controlled and automatically available to anyone who clones or pulls the project, satisfying the \"no individual setup\" requirement. User-scoped commands (A) require every engineer to manually create their own copy. CLAUDE.md (C) holds instructions and context, not slash command definitions. A network drive (D) is outside Claude Code's configuration discovery entirely."
        },
        {
          id: "P5-S5-Q4",
          domain: 3,
          task: "3.2",
          type: "single",
          select: 1,
          stem: "A ledger-core skill named analyze-dependencies performs a deep, verbose scan of the dependency graph, producing thousands of lines of intermediate reasoning before returning a short summary. Engineers complain this verbose output fills up their main conversation and makes subsequent requests less coherent. What SKILL.md frontmatter option addresses this directly?",
          options: [
            { key: "A", text: "argument-hint, so engineers are prompted for required parameters." },
            { key: "B", text: "allowed-tools, restricted to only Read operations." },
            { key: "C", text: "context: fork, so the skill runs in an isolated sub-agent context and only its summary reaches the main conversation." },
            { key: "D", text: "A longer description field explaining the skill's verbosity to set expectations." }
          ],
          correct: ["C"],
          explanation: "context: fork runs the skill in an isolated sub-agent context, preventing its verbose intermediate output from polluting the main conversation while still returning a summary. argument-hint (A) only helps with missing invocation arguments. allowed-tools (B) restricts tool access, not output visibility. A longer description (D) doesn't change where the output ends up."
        },
        {
          id: "P5-S5-Q5",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "ledger-core's testing conventions (always mock the database client, never use real timestamps, prefer table-driven test cases) need to apply to every test file, but test files are scattered across dozens of directories alongside non-test source files. A directory-level CLAUDE.md approach would require duplicating the same content in every directory that happens to contain tests. What is the better approach?",
          options: [
            { key: "A", text: "Duplicate a short directory-level CLAUDE.md into every directory containing test files, updating every single copy by hand whenever any convention changes across the monorepo." },
            { key: "B", text: "Put the testing conventions only in the root CLAUDE.md and trust engineers to remember and apply them correctly to test files no matter where they happen to live in the tree." },
            { key: "C", text: "Create a .claude/rules/testing.md file with YAML frontmatter paths: [\"**/*.test.*\"] so the rule loads whenever a matching test file is being edited, regardless of directory." },
            { key: "D", text: "Create one CLAUDE.md per package root covering only that package's test files, still requiring a separate file to be created and maintained for each individual package." }
          ],
          correct: ["C"],
          explanation: "Glob-pattern path rules in .claude/rules/ load conventions based on file pattern rather than directory location, which is exactly suited to conventions (like test file standards) that apply across many directories. Duplicating directory CLAUDE.md files (A) recreates the maintenance burden being avoided. Keeping it only in root CLAUDE.md (B) doesn't guarantee targeted loading and bloats context for non-test work. Package-root files (D) still require one file per package and don't solve the cross-directory scattering problem within a package."
        },
        {
          id: "P5-S5-Q6",
          domain: 3,
          task: "3.3",
          type: "single",
          select: 1,
          stem: "Across ledger-core, Terraform configuration files live inside src/infra/, scripts/deploy/, and tools/provisioning/ — three unrelated directory trees — but all need the same infrastructure-as-code conventions. The team is deciding between adding a CLAUDE.md to each of the three directories or a single .claude/rules/ file. Which is more appropriate, and why?",
          options: [
            { key: "A", text: "A single .claude/rules/ file with paths: [\"**/*.tf\"], since glob patterns apply to matching files regardless of which directory they live in, unlike directory-scoped CLAUDE.md files." },
            { key: "B", text: "Three separate directory-level CLAUDE.md files, one per directory, since directory scoping is more explicit and each individual file can be tailored and maintained independently over time." },
            { key: "C", text: "A single root-level CLAUDE.md containing all infrastructure conventions alongside unrelated application conventions, since consolidating absolutely everything in one place simplifies lookup." },
            { key: "D", text: "No configuration file at all; rely on engineers remembering Terraform conventions from onboarding, since well-trained engineers should never need written reminders at all." }
          ],
          correct: ["A"],
          explanation: "Glob-pattern rules match files by type wherever they live, which is the better fit when the same convention must apply across multiple unrelated directory trees. Three directory CLAUDE.md files (B) require creating and maintaining duplicate content in three places and miss any new directory with Terraform files. A monolithic root file (C) dilutes targeted context with irrelevant conventions loaded for every task. Relying on memory (D) provides no enforcement or consistency at all."
        },
        {
          id: "P5-S5-Q7",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "Two ledger-core tasks are queued: (1) replace the entire legacy ORM with a new query library across 45+ files with several architecturally different migration strategies possible, and (2) add a null check to a single function that is currently throwing a stack-trace-visible NullPointerException. How should each be approached?",
          options: [
            { key: "A", text: "Direct execution for both tasks, since Claude Code can handle any size or complexity of change equally well regardless of architectural ambiguity involved." },
            { key: "B", text: "Plan mode for both tasks, since planning never hurts even for simple, well-understood fixes that already have an obvious single correct implementation." },
            { key: "C", text: "Plan mode for the null-check fix; direct execution for the ORM migration, reversing the mapping to prioritize speed over architectural care here." },
            { key: "D", text: "Plan mode for the ORM migration, given its architectural implications and multiple valid approaches; direct execution for the well-scoped null-check fix." }
          ],
          correct: ["D"],
          explanation: "Plan mode is designed for large-scale, multi-file changes with several valid architectural approaches, exactly the ORM migration, while direct execution suits a simple, well-understood, single-function fix with a clear stack trace. A ignores that scale and ambiguity change the appropriate approach. B wastes planning overhead on a trivial, unambiguous fix. C reverses the appropriate mapping entirely."
        },
        {
          id: "P5-S5-Q8",
          domain: 3,
          task: "3.4",
          type: "single",
          select: 1,
          stem: "An engineer asks Claude Code to \"understand how authentication flows through ledger-core before proposing a refactor.\" The resulting exploration generates extensive file-by-file notes that consume most of the context window before any refactor plan is even proposed. What should be used to prevent this context exhaustion?",
          options: [
            { key: "A", text: "Ask Claude to summarize its own notes every few files during the same exploration, assuming periodic self-summarization alone prevents context buildup entirely." },
            { key: "B", text: "Delegate the verbose discovery phase to the Explore subagent, which isolates detailed discovery output and returns a condensed summary to the main conversation." },
            { key: "C", text: "Reduce the number of files it's allowed to read during exploration, even though that risks building an incomplete understanding of the authentication flow." },
            { key: "D", text: "Switch to a model with a smaller context window to force conciseness, assuming a tighter token budget will naturally produce shorter exploration notes." }
          ],
          correct: ["B"],
          explanation: "The Explore subagent is specifically designed to isolate verbose discovery output in its own context and return a summary, preserving the main conversation's budget for the actual planning and refactor work. Self-summarizing mid-exploration (A) still consumes the main context with the raw notes before summarizing. Limiting files read (C) risks incomplete understanding of the authentication flow. Switching to a smaller-context model (D) makes the problem worse, not better."
        },
        {
          id: "P5-S5-Q9",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "Fenwick asked Claude Code to \"normalize all currency fields to two decimal places and ISO 4217 codes\" across ledger-core's reporting package. Three different attempts produced three different, inconsistent output formats. What is most likely to resolve the ambiguity?",
          options: [
            { key: "A", text: "Provide 2-3 concrete input/output examples showing exactly how specific currency values should be transformed." },
            { key: "B", text: "Repeat the same prose instruction in more emphatic language." },
            { key: "C", text: "Switch to a model with a larger context window." },
            { key: "D", text: "Break the single instruction into ten shorter, separately worded instructions." }
          ],
          correct: ["A"],
          explanation: "Concrete input/output examples communicate the exact expected transformation unambiguously, which resolves inconsistent interpretations that prose descriptions alone produce. Repeating the same prose more emphatically (B) doesn't add new information to disambiguate the task. A larger context window (C) doesn't address instruction ambiguity. Splitting into more verbal instructions (D) is still prose and doesn't anchor the transformation concretely."
        },
        {
          id: "P5-S5-Q10",
          domain: 3,
          task: "3.5",
          type: "single",
          select: 1,
          stem: "Fenwick wants Claude Code to implement a new fee-rounding function with several documented edge cases (negative amounts, zero fees, currencies with three decimal places). Which iteration approach is most likely to produce correct handling of all documented edge cases?",
          options: [
            { key: "A", text: "Describe all edge cases in prose in a single detailed paragraph and ask for one implementation attempt, trusting the description to be unambiguous enough." },
            { key: "B", text: "Ask Claude to implement the function first, then verbally describe which edge cases it should double check, relying on recall rather than concrete failures." },
            { key: "C", text: "Write a test suite covering the documented edge cases first, then iterate by sharing each test failure with Claude to guide progressive correction." },
            { key: "D", text: "Ask Claude to generate 20 different candidate implementations and manually pick the best one, reviewing each against the documented edge cases by eye." }
          ],
          correct: ["C"],
          explanation: "Writing tests first and iterating by sharing concrete failures grounds each correction in an observable, specific mismatch rather than relying on the model correctly inferring every edge case from prose up front. A single prose paragraph (A) is prone to the same inconsistent interpretation problem described elsewhere in the guide. Asking Claude to self-check verbally (B) doesn't provide the concrete failure signal that drives effective correction. Generating many candidates (D) is far less efficient than targeted, test-driven iteration."
        },
        {
          id: "P5-S5-Q11",
          domain: 3,
          task: "3.6",
          type: "single",
          select: 1,
          stem: "Fenwick's CI pipeline invokes Claude Code to generate a PR summary on every push, but the pipeline occasionally hangs indefinitely on a build agent with no human present to respond to an interactive prompt. What CLI flag prevents this?",
          options: [
            { key: "A", text: "--output-format json" },
            { key: "B", text: "--json-schema" },
            { key: "C", text: "--resume <name>" },
            { key: "D", text: "-p (or --print), running Claude Code in non-interactive mode" }
          ],
          correct: ["D"],
          explanation: "The -p/--print flag runs Claude Code non-interactively, which is required in unattended CI environments to prevent hangs waiting for interactive input. --output-format json (A) and --json-schema (B) control output structure but don't address interactivity. --resume (C) continues a named session and is unrelated to non-interactive execution."
        },
        {
          id: "P5-S5-Q12",
          domain: 3,
          task: "3.6",
          type: "multiple",
          select: 2,
          stem: "Fenwick's automated PR review currently posts findings as free-form prose comments, which the downstream bot cannot reliably parse into individual inline comments, and re-running the review after a new commit re-posts findings that were already addressed in the first pass. Which two changes would most effectively fix this? (Select TWO.)",
          options: [
            { key: "A", text: "Run Claude Code with --output-format json and a --json-schema defining each finding's file, line, and severity, so the bot can reliably post structured inline comments." },
            { key: "B", text: "Include the prior review's findings in context when re-running, instructing Claude to report only new or still-unaddressed issues." },
            { key: "C", text: "Increase the model's temperature so it generates more varied phrasing across runs." },
            { key: "D", text: "Switch the review prompt to request a single unstructured paragraph summarizing all findings instead of a list." },
            { key: "E", text: "Re-run the entire review from scratch every time with no memory of prior findings, to keep each pass independent." }
          ],
          correct: ["A", "B"],
          explanation: "Structured JSON output with a defined schema makes findings machine-parseable for inline comments, and supplying prior findings so Claude reports only new or unresolved issues prevents duplicate comments on re-runs. Increasing temperature (C) adds randomness rather than structure. Requesting unstructured paragraphs (D) makes the parsing problem worse. Re-running with no memory of prior findings (E) is exactly what causes the duplicate-comment problem described."
        },
        {
          id: "P5-S5-Q13",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Fenwick's nightly dependency-vulnerability report uses the Message Batches API, which has no guaranteed latency SLA and can take up to 24 hours to complete. The security team has committed to an internal SLA of delivering results within 30 hours of any dependency change. Assuming worst-case 24-hour batch completion, at minimum how frequently must Fenwick submit a new batch to reliably meet the 30-hour SLA?",
          options: [
            { key: "A", text: "Once every 30 hours." },
            { key: "B", text: "Once every 24 hours." },
            { key: "C", text: "Once every 18 hours." },
            { key: "D", text: "Once every 6 hours." }
          ],
          correct: ["D"],
          explanation: "With a worst-case 24-hour batch window, a change submitted just after a batch is sent would otherwise wait until the next submission plus the full 24-hour processing time; to guarantee delivery within 30 hours, the maximum allowable gap between submissions is 30 minus 24, or 6 hours. Submitting every 24 or 30 hours (A, B) could leave a change waiting far longer than the 30-hour commitment in the worst case. 18 hours (C) is more conservative than necessary but doesn't match the tight margin the calculation actually requires with this SLA and window."
        },
        {
          id: "P5-S5-Q14",
          domain: 4,
          task: "4.5",
          type: "multiple",
          select: 2,
          stem: "Fenwick submitted a Message Batches API batch of 500 PR-review requests overnight. The next morning, 460 succeeded, 30 failed due to a transient backend error, and 10 failed because the diff exceeded the per-request context limit. Which two actions should Fenwick take? (Select TWO.)",
          options: [
            { key: "A", text: "Resubmit all 500 requests from scratch to ensure consistency across the batch." },
            { key: "B", text: "Discard the 10 oversized failures permanently, since the batch API cannot process them under any circumstances." },
            { key: "C", text: "Resubmit only the 30 transiently-failed requests, identified by their custom_id, unchanged." },
            { key: "D", text: "Convert the entire workload to the synchronous Messages API going forward, since the batch API is unreliable." },
            { key: "E", text: "Resubmit the 10 oversized requests after chunking each large diff into smaller pieces that fit within the context limit." }
          ],
          correct: ["C", "E"],
          explanation: "custom_id lets Fenwick precisely identify and resubmit only the failed requests; transient failures can simply be retried as-is, while context-limit failures need chunking before resubmission. Resubmitting the full batch (A) wastes the 460 already-successful requests and cost savings. Permanently discarding oversized diffs (B) is unnecessary since chunking resolves the root cause. Abandoning the batch API entirely (D) overreacts to a normal, expected failure rate rather than fixing the specific failure causes."
        },
        {
          id: "P5-S5-Q15",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Fenwick is deciding which API approach to use for two different checks: (1) a pre-merge PR gate that must block the merge button until Claude's review completes within the same CI run, and (2) a monthly audit that reviews every closed PR from the past 30 days for compliance tagging, with no urgency. Which pairing is correct?",
          options: [
            { key: "A", text: "Message Batches API for both, since it is roughly 50% cheaper and that cost savings alone is assumed to outweigh any latency concerns in every single situation, including blocking ones." },
            { key: "B", text: "The synchronous Messages API for both, to keep the architecture simple, even though that forgoes the real cost savings available for the non-blocking, latency-tolerant monthly audit workload." },
            { key: "C", text: "The synchronous API for the pre-merge gate, since the batch API has no guaranteed latency and would block a human-facing action; the Batches API for the non-blocking, latency-tolerant audit." },
            { key: "D", text: "The Message Batches API for the pre-merge gate, since it is cheaper per request; the synchronous API for the monthly audit, exactly inverting the pairing that actually fits each workload's needs." }
          ],
          correct: ["C"],
          explanation: "The Message Batches API has no guaranteed latency SLA and is unsuitable for a blocking, human-facing workflow like a pre-merge gate, while it is well suited to the non-blocking, latency-tolerant monthly audit, where its roughly 50% cost savings matter more than turnaround time. A ignores that blocking workflows cannot tolerate indefinite batch latency. B forgoes real cost savings available for the latency-tolerant audit. D exactly inverts the correct pairing, which would make the pre-merge gate unpredictably slow."
        }
      ]
    }
    ,
    {
      id: 6,
      title: "Structured Data Extraction",
      description: "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      questions: [
        {
          id: "P5-S6-Q1",
          domain: 4,
          task: "4.1",
          type: "single",
          select: 1,
          stem: "Beacon Analytics' extraction pipeline flags \"ambiguous dosage unit\" findings in clinical trial documents at a 44% false-positive rate, far higher than other finding categories, eroding reviewer trust in the whole pipeline. The current prompt instruction reads \"only flag dosage ambiguities you are highly confident about.\" What change would most effectively reduce the false-positive rate?",
          options: [
            { key: "A", text: "Replace the vague confidence instruction with explicit criteria for which dosage patterns qualify as ambiguous versus which common patterns should never be flagged." },
            { key: "B", text: "Keep the same instruction but add the word \"very\" for emphasis: \"only flag dosage ambiguities you are very highly confident about,\" assuming intensity alone resolves the ambiguity." },
            { key: "C", text: "Remove dosage-unit checking from the pipeline entirely until a future redesign, accepting the loss of a potentially valuable finding category in the meantime regardless." },
            { key: "D", text: "Lower the extraction temperature to make the model more conservative about flagging, assuming reduced sampling randomness alone will sharpen precision on this category." }
          ],
          correct: ["A"],
          explanation: "General instructions like \"be conservative\" or confidence-based phrasing don't improve precision; explicit categorical criteria defining exactly what qualifies as an issue is what reduces false positives. B is a cosmetic rewording of the same ineffective confidence-based instruction. Removing the check entirely (C) loses a potentially valuable finding category rather than fixing its precision. Lowering temperature (D) doesn't address the underlying criteria ambiguity causing the false positives."
        },
        {
          id: "P5-S6-Q2",
          domain: 4,
          task: "4.2",
          type: "single",
          select: 1,
          stem: "Beacon's extraction model handles clinical trial methodology sections well when they appear as a labeled \"Methods\" section, but produces empty or incorrect extractions when the same information is embedded inline within narrative prose, a common format in older trial reports. What technique most directly improves handling of this structural variety?",
          options: [
            { key: "A", text: "Add a longer prose instruction describing both formats in more detail, assuming more descriptive text alone will teach the model to recognize each structure." },
            { key: "B", text: "Add 2-4 few-shot examples demonstrating correct extraction from both the labeled-section format and the inline-narrative format." },
            { key: "C", text: "Reject any document that doesn't use a labeled \"Methods\" section, treating inline-narrative formatting as invalid input rather than a legitimate variation." },
            { key: "D", text: "Increase the required confidence threshold before any methodology field is populated, assuming a stricter threshold will suppress incorrect extractions." }
          ],
          correct: ["B"],
          explanation: "Few-shot examples demonstrating correct extraction across varied document structures are the most effective way to generalize handling to structural variety, including formats like inline narrative versus labeled sections. A longer prose description (A) is still abstract and has already proven insufficient for structural variation. Rejecting valid documents (C) discards legitimate data. Raising the confidence threshold (D) suppresses output rather than improving the model's ability to recognize the pattern."
        },
        {
          id: "P5-S6-Q3",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "Beacon's pipeline ingests a mix of document types — clinical trial reports, regulatory filings, and lab result summaries — each requiring a different extraction schema, and the document type is not known before processing. The team wants to guarantee Claude always calls one of the three extraction tools rather than returning a conversational response, while still letting the model choose the correct schema for the document it sees. What tool_choice setting should be used?",
          options: [
            { key: "A", text: "tool_choice: {\"type\": \"tool\", \"name\": \"extract_clinical_trial\"}, forcing one specific schema regardless of document type." },
            { key: "B", text: "tool_choice: \"auto\", trusting the model to decide whether a tool call is appropriate." },
            { key: "C", text: "tool_choice: \"any\", requiring some tool call while letting the model choose which of the three extraction tools fits the document." },
            { key: "D", text: "No tool_choice parameter at all, relying on the system prompt to describe each schema." }
          ],
          correct: ["C"],
          explanation: "\"any\" guarantees a tool call occurs while still letting the model select which of the multiple available tools best matches the document, which is exactly the \"unknown document type, but some extraction must happen\" requirement. Forcing one specific tool (A) would misapply the wrong schema to non-matching documents. \"auto\" (B) could return conversational text instead of calling any extraction tool. Omitting tool_choice (D) relies on probabilistic prompt compliance that doesn't guarantee tool use at all."
        },
        {
          id: "P5-S6-Q4",
          domain: 4,
          task: "4.3",
          type: "single",
          select: 1,
          stem: "A regulatory filing extraction schema marks \"secondary_endpoint\" as a required field. Many older filings simply don't report a secondary endpoint at all. Reviewers have found the model inventing plausible-sounding secondary endpoints to satisfy the required field rather than leaving it empty. What schema design change fixes this?",
          options: [
            { key: "A", text: "Keep the field required, but add a note in the prompt asking the model not to fabricate values." },
            { key: "B", text: "Remove the field from the schema entirely so it's never extracted from any document." },
            { key: "C", text: "Make the field an enum with only two allowed values: \"present\" or \"absent.\"" },
            { key: "D", text: "Make the field optional/nullable, so the model can return null when the source document genuinely doesn't report the information." }
          ],
          correct: ["D"],
          explanation: "Making a field optional/nullable directly removes the pressure to fabricate a value in order to satisfy a required-field constraint, addressing the root schema design issue. A prompt note (A) is a probabilistic instruction competing against the structural pressure of a required field, which has already failed. Removing the field entirely (B) loses the data for documents that do report it. Forcing an enum (C) still doesn't capture the actual endpoint text when one does exist."
        },
        {
          id: "P5-S6-Q5",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "An invoice-extraction tool reports a stated_total of $48,200 on a vendor invoice, but Beacon's validation layer independently recomputes the sum of the extracted line items and gets $46,850 — a $1,350 discrepancy likely caused by a missed line item or a misread quantity. The current schema only outputs stated_total and doesn't catch this. What schema change would catch this class of error?",
          options: [
            { key: "A", text: "Extract calculated_total (the sum of extracted line items) alongside stated_total, and flag a discrepancy whenever the two don't match." },
            { key: "B", text: "Add a free-text \"notes\" field where the model can mention if something seemed off, trusting it to volunteer discrepancies unprompted every time." },
            { key: "C", text: "Round all monetary values to the nearest hundred dollars to reduce apparent discrepancies, treating small mismatches as noise rather than real errors." },
            { key: "D", text: "Remove stated_total from the schema and rely only on the line items, discarding a value that could otherwise serve as a useful cross-check." }
          ],
          correct: ["A"],
          explanation: "Extracting a calculated_total independently from the line items and comparing it to stated_total is exactly the self-correction pattern for catching semantic errors (like missed or misread line items) that tool-use schema validation alone cannot catch, since tool use only guarantees syntactic correctness. A free-text notes field (B) is unreliable and unstructured, unlikely to be consistently populated. Rounding values (C) hides real discrepancies rather than catching them. Removing stated_total (D) discards a useful cross-check value entirely."
        },
        {
          id: "P5-S6-Q6",
          domain: 4,
          task: "4.4",
          type: "single",
          select: 1,
          stem: "A clinical trial report states the enrollment count as \"312 participants\" in its abstract and \"328 participants\" in its results table — the same document contains two different values for the same field. The current extraction schema has one enrollment_count field and the model must silently pick one number. What schema addition would best surface this situation to reviewers?",
          options: [
            { key: "A", text: "A free-text summary field describing the whole document in one paragraph, assuming any inconsistency will naturally surface within that unstructured prose summary." },
            { key: "B", text: "A conflict_detected boolean field (plus both candidate values) that the model sets to true when a document contains inconsistent source data for the same field." },
            { key: "C", text: "A field asking the model to guess which section is \"more authoritative\" and silently use that value, without surfacing the disagreement to anyone downstream." },
            { key: "D", text: "Remove enrollment_count from the schema since it's unreliable in this document type, losing the field entirely even where it is perfectly consistent." }
          ],
          correct: ["B"],
          explanation: "An explicit conflict_detected flag, with both candidate values preserved, surfaces inconsistent source data to reviewers rather than silently resolving it, which matches the documented approach for self-correction validation flows. A generic summary field (A) doesn't structurally flag the specific conflict. Having the model silently guess the \"more authoritative\" value (C) hides a genuine data quality issue from reviewers. Removing the field entirely (D) loses valid data from the many documents where it isn't actually inconsistent."
        },
        {
          id: "P5-S6-Q7",
          domain: 4,
          task: "4.4",
          type: "multiple",
          select: 2,
          stem: "Beacon's reviewers have been dismissing roughly 15% of \"inconsistent units\" findings as false positives, but there is currently no way to analyze why — the findings contain only the flagged text span and severity. Separately, when extraction fails due to a validation error, engineers want to know which failures are worth retrying automatically. Which two changes should Beacon make? (Select TWO.)",
          options: [
            { key: "A", text: "Add a detected_pattern field to each finding that records the specific code or text construct that triggered it, enabling systematic analysis of which patterns reviewers tend to dismiss." },
            { key: "B", text: "Automatically retry every validation failure exactly twice regardless of cause, then give up." },
            { key: "C", text: "Classify validation failures by distinguishing resolvable issues (format or structural mismatches, correctable via retry-with-error-feedback) from unresolvable ones (information genuinely absent from the source document, which no retry will fix)." },
            { key: "D", text: "Stop tracking dismissed findings altogether since reviewer judgment is inherently subjective." },
            { key: "E", text: "Increase the number of retries for every failure from two to ten to improve eventual success rate." }
          ],
          correct: ["A", "C"],
          explanation: "Recording a detected_pattern field enables systematic analysis of which specific patterns drive dismissals, and distinguishing format/structural retry-fixable errors from information genuinely absent in the source (which retries cannot fix) focuses retry effort where it can actually succeed. Blindly retrying every failure a fixed number of times (B, E) wastes effort on unresolvable absent-information cases. Abandoning dismissal tracking (D) discards exactly the data needed to improve precision."
        },
        {
          id: "P5-S6-Q8",
          domain: 4,
          task: "4.5",
          type: "single",
          select: 1,
          stem: "Beacon needs to run nightly extraction over roughly 12,000 newly published clinical trial abstracts, a workload with no interactive user waiting on the result. Which API approach is most appropriate, and why?",
          options: [
            { key: "A", text: "The synchronous Messages API, issuing all 12,000 requests as fast as possible overnight, since raw speed alone is assumed to matter most for this workload regardless of cost." },
            { key: "B", text: "The Message Batches API, but only because it supports multi-turn tool calling within a single batched request, which the team mistakenly assumes drives the cost savings here." },
            { key: "C", text: "The Message Batches API, because the workload is non-blocking and latency-tolerant, and batch processing offers roughly 50% cost savings over the synchronous API at this volume." },
            { key: "D", text: "A custom polling service that checks every 10 seconds whether each of the 12,000 synchronous requests has completed, instead of simply using the batch API's own built-in mechanism." }
          ],
          correct: ["C"],
          explanation: "An overnight, non-blocking, high-volume workload is the textbook fit for the Message Batches API, which costs roughly 50% less than the synchronous API, with the up-to-24-hour window being acceptable since nothing is waiting on immediate results. The synchronous API (A) forgoes the cost savings and unnecessarily taxes rate capacity for an urgency-free task. Batch does NOT support multi-turn tool calling within a request (B), making that justification factually wrong even though batch is still the right choice for other reasons. A custom polling service for synchronous calls (D) reinvents what the batch API already provides more cheaply and simply."
        },
        {
          id: "P5-S6-Q9",
          domain: 4,
          task: "4.5",
          type: "multiple",
          select: 2,
          stem: "Beacon is about to submit its first large batch of 8,000 regulatory filings to the Message Batches API using a newly written extraction prompt that has only been tested on 5 sample documents. Which two practices would most reduce wasted cost and resubmission cycles for this large run? (Select TWO.)",
          options: [
            { key: "A", text: "Submit all 8,000 documents immediately, since the Message Batches API is cheap enough that early mistakes don't matter." },
            { key: "B", text: "Run the new prompt against a larger, more representative sample set first, refining it until first-pass success rate is high before committing the full 8,000-document batch." },
            { key: "C", text: "Skip sampling entirely and treat the first full batch run itself as the testing phase." },
            { key: "D", text: "Design the submission so each request carries a unique custom_id, making it possible to identify and selectively resubmit only the documents that fail." },
            { key: "E", text: "Submit the batch in one extremely large single request containing all 8,000 documents concatenated together to minimize API calls." }
          ],
          correct: ["B", "D"],
          explanation: "Refining the prompt against a representative sample before committing to a large batch maximizes first-pass success and reduces costly resubmission, and unique custom_id values make it possible to isolate and resubmit only the specific documents that failed rather than the whole batch. Submitting the untested prompt at full volume (A, C) risks a high failure rate across thousands of documents before any issue is caught. Concatenating all documents into one giant request (E) is not how the batch API is structured — it issues many independent requests, each needing its own custom_id."
        },
        {
          id: "P5-S6-Q10",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Beacon reports an overall extraction accuracy of 97% across its document corpus and proposes removing human review entirely. A deeper breakdown shows accuracy on scanned handwritten lab forms is only 71%, masked by the much larger volume of clean, typed regulatory filings at 99.5% accuracy. What does this reveal about the proposed change?",
          options: [
            { key: "A", text: "The 97% aggregate figure is accurate and sufficient justification to remove human review everywhere, since one overall number already fully captures real-world performance." },
            { key: "B", text: "Handwritten lab forms should simply be excluded from the corpus going forward entirely, since their lower accuracy drags down an otherwise strong aggregate result." },
            { key: "C", text: "The model's confidence scores must be miscalibrated since the aggregate accuracy figure is so high, even though calibration is actually a separate, unrelated concern." },
            { key: "D", text: "Aggregate accuracy can mask poor performance on specific document types; accuracy should be validated by document type and field segment before reducing human review." }
          ],
          correct: ["D"],
          explanation: "A single aggregate metric can hide a document type or field segment performing far worse than the average, which is exactly the case here; validating accuracy by segment is necessary before automating away review for any of them. A ignores the segment-level discrepancy uncovered. B discards real data rather than addressing the accuracy gap through appropriate review. C conflates a volume-weighted average with a confidence-calibration problem, which is a separate concern."
        },
        {
          id: "P5-S6-Q11",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Beacon's extraction pipeline currently sends every document with a model-reported confidence score above 0.9 straight to downstream systems with no human check. Leadership wants ongoing assurance that this high-confidence tier isn't silently degrading over time as new document formats appear. What should Beacon implement?",
          options: [
            { key: "A", text: "Stratified random sampling of high-confidence extractions, reviewed periodically to measure error rate and detect novel error patterns." },
            { key: "B", text: "A one-time manual audit of the current high-confidence tier, with no further ongoing checks, assuming today's results predict future performance indefinitely." },
            { key: "C", text: "Raising the confidence threshold from 0.9 to 0.99 and treating that as sufficient assurance on its own, without separately validating the remaining tier." },
            { key: "D", text: "Removing confidence scoring altogether and routing every document to human review, eliminating the efficiency gains the scoring system was designed to provide." }
          ],
          correct: ["A"],
          explanation: "Stratified random sampling of high-confidence extractions provides ongoing measurement of error rates and can surface novel error patterns as new document formats appear, which a one-time snapshot cannot. A one-time audit (B) doesn't provide ongoing assurance as new formats emerge. Simply raising the threshold (C) doesn't validate whether the remaining high-confidence tier is actually accurate. Routing everything to humans (D) defeats the purpose of having a confidence-based tier at all."
        },
        {
          id: "P5-S6-Q12",
          domain: 5,
          task: "5.5",
          type: "single",
          select: 1,
          stem: "Beacon's model outputs a per-field confidence score for every extracted value, but the team has only been using an arbitrary fixed cutoff of 0.8 to decide what goes to human review, chosen without any data analysis. Reviewers report both missed errors above 0.8 and unnecessary review burden below 0.8. What should Beacon do instead?",
          options: [
            { key: "A", text: "Remove confidence scores entirely and route every document to human review, discarding a signal that could otherwise reduce unnecessary review burden substantially overall." },
            { key: "B", text: "Calibrate the review threshold using a labeled validation set, analyzing how confidence scores at different levels actually correlate with real error rates for each field." },
            { key: "C", text: "Pick a new arbitrary cutoff, such as 0.9, without further analysis, simply hoping the new number happens to align better with actual error rates than before." },
            { key: "D", text: "Ask the model to also self-report how calibrated it believes its own confidence scores are, relying on an unverified and circular self-assessment instead of actual data." }
          ],
          correct: ["B"],
          explanation: "Calibrating thresholds against a labeled validation set ties the cutoff to actual measured error rates per field, directly fixing a threshold chosen without data analysis. Removing confidence scoring (A) discards a useful routing signal entirely. Picking another arbitrary number (C) repeats the same unvalidated approach that caused the problem. Asking the model to self-assess its own calibration (D) is an unreliable, circular self-reported signal."
        },
        {
          id: "P5-S6-Q13",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "Beacon's financial-filing lookup tool returns 60 fields per call (addresses, historical filings, auditor details, footnote references, etc.), but only 6 fields (reporting period, total revenue, net income, filer name, filing date, auditor) are relevant to the extraction task at hand. Over a long multi-document session, these verbose results accumulate and crowd out space for more documents. What should be done?",
          options: [
            { key: "A", text: "Increase the context window size so all 60 fields from every call fit comfortably." },
            { key: "B", text: "Ask the model to ignore irrelevant fields without changing what's stored in context." },
            { key: "C", text: "Trim each tool result down to only the relevant fields before it is added to context, discarding the other 54 fields." },
            { key: "D", text: "Summarize the whole 60-field result into one vague sentence per document." }
          ],
          correct: ["C"],
          explanation: "Trimming verbose tool outputs down to only the fields relevant to the task before they accumulate in context directly reduces disproportionate token consumption without losing needed information. A bigger context window (A) treats the symptom rather than the inefficiency itself and still wastes space on irrelevant fields. Asking the model to mentally ignore fields (B) still consumes the context budget with the unused data. Vague one-sentence summarization (D) risks losing exact figures like total revenue or filing dates needed for the task, which is the progressive-summarization risk described in the guide."
        },
        {
          id: "P5-S6-Q14",
          domain: 5,
          task: "5.1",
          type: "single",
          select: 1,
          stem: "During a long multi-filing extraction session, Beacon's agent periodically produces a running natural-language summary of findings so far to save context space. Reviewers notice that specific dollar figures and filing dates mentioned early in the session become vague (\"a large revenue increase,\" \"sometime in the prior fiscal year\") by the end of the session. What is the most effective fix?",
          options: [
            { key: "A", text: "Stop summarizing entirely and keep the full, unmodified conversation history forever, regardless of how enormously large the context window eventually grows across many long sessions over time." },
            { key: "B", text: "Summarize even more aggressively to save additional space, assuming a much shorter running summary will somehow still retain the exact same level of numeric precision regardless of any compression applied." },
            { key: "C", text: "Switch to a model with a larger context window and keep the exact same summarization approach, assuming more room alone will prevent figures from ever becoming vague over a very long session." },
            { key: "D", text: "Extract and persist exact transactional facts (figures, dates, filing identifiers) into a separate, persistent \"case facts\" block included in every prompt, outside the summarized narrative history." }
          ],
          correct: ["D"],
          explanation: "Persisting exact facts (amounts, dates, identifiers) into a dedicated structured block that is always included avoids the information loss that comes from compressing numerical specifics into vague natural-language summaries. A (never summarizing) doesn't scale for long sessions and isn't the targeted fix. B makes the vagueness problem worse, not better. C treats the symptom with more capacity rather than fixing the information-loss mechanism itself."
        },
        {
          id: "P5-S6-Q15",
          domain: 5,
          task: "5.6",
          type: "multiple",
          select: 2,
          stem: "Beacon's extraction pipeline processes a 40-page financial filing, but one appendix section fails to parse due to a corrupted scan, and two statistics in the body of the filing (quarterly revenue reported in two different currencies from two different exchange-rate dates) appear inconsistent at first glance. Which two structured-output practices would correctly handle both issues? (Select TWO.)",
          options: [
            { key: "A", text: "Silently omit any mention of the unparsed section so the output looks clean and complete." },
            { key: "B", text: "Annotate the output with a coverage-gap note identifying the unparsed appendix section rather than silently presenting the extraction as complete." },
            { key: "C", text: "Convert both currency figures to a single currency using today's exchange rate before extraction, discarding the original reported values." },
            { key: "D", text: "Reject the entire 40-page filing because one section failed to parse." },
            { key: "E", text: "Include the reporting or exchange-rate date alongside each revenue figure so downstream systems can correctly interpret the apparent discrepancy as a timing difference rather than an error." }
          ],
          correct: ["B", "E"],
          explanation: "Annotating a coverage gap for the unparsable section preserves honesty about what was and wasn't extracted, and including the relevant date alongside each figure lets downstream consumers correctly interpret an apparent discrepancy as a temporal/exchange-rate difference rather than a data quality problem. Silently omitting the gap (A) hides a real limitation from downstream systems. Converting currencies and discarding original values (C) destroys the original reported data needed for audit and loses the very information that explains the discrepancy. Rejecting the entire document (D) discards 39 valid pages over one unparsable section."
        }
      ]
    }
  ]
});
