window.EXAM_PAPERS = window.EXAM_PAPERS || [];
window.EXAM_PAPERS.push({
  "id": 8,
  "title": "Mock Exam 8",
  "scenarios": [
    {
      "id": 1,
      "title": "Customer Support Resolution Agent",
      "description": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.",
      "questions": [
        {
          "id": "P8-S1-Q1",
          "domain": 1,
          "task": "1.5",
          "type": "single",
          "select": 1,
          "stem": "Meridian Bank's support agent is instructed via its system prompt that \"refunds over $750 require manager approval,\" but in 3% of cases the agent still calls process_refund with amounts like $900 after misreading ambiguous customer phrasing. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a PostToolUse-style hook that intercepts process_refund calls, blocks any amount exceeding $750, and redirects the case to escalate_to_human."
            },
            {
              "key": "B",
              "text": "Strengthen the system prompt wording by repeating the $750 ceiling in bold at both the top and bottom of the instructions."
            },
            {
              "key": "C",
              "text": "Add a generic note instructing the agent to \"flag large refunds for review\" before submitting them."
            },
            {
              "key": "D",
              "text": "Increase the number of few-shot examples showing refusals above $750 so the model learns the pattern more deeply."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Financial threshold enforcement needs a deterministic guarantee, which only a tool-call interception hook provides; prompt wording and few-shot examples remain probabilistic and retain a non-zero failure rate. A vague \"flag for review\" note does not actually block the disallowed action or redirect to a concrete workflow, so the over-threshold refund could still be submitted."
        },
        {
          "id": "P8-S1-Q2",
          "domain": 1,
          "task": "1.4",
          "type": "single",
          "select": 1,
          "stem": "When Meridian's agent escalates a billing dispute, the downstream human agent handling the case has no access to the original chat transcript, only a ticket number. They must call the customer back and ask for details already established in the conversation, causing frustration. What should the escalation workflow produce?",
          "options": [
            {
              "key": "A",
              "text": "A link the human agent can use to request transcript access from IT after their shift starts, routed through the standard access-provisioning ticket queue so permissions stay auditable."
            },
            {
              "key": "B",
              "text": "A structured handoff summary with the customer ID, root cause, disputed amount, and recommended action."
            },
            {
              "key": "C",
              "text": "A self-reported confidence score indicating how certain the agent was about the root cause."
            },
            {
              "key": "D",
              "text": "A sentiment classification label describing how upset the customer sounded, computed via a lightweight sentiment-analysis model appended to the handoff pipeline."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "A structured handoff summary gives the human agent the concrete facts they need without requiring transcript access. Requesting access later, even through a formal provisioning queue, only delays resolution further. A self-reported confidence score and a sentiment label are both unreliable, and neither substitutes for the actual case facts the human needs to act."
        },
        {
          "id": "P8-S1-Q3",
          "domain": 1,
          "task": "1.1",
          "type": "single",
          "select": 1,
          "stem": "Meridian's agentic loop currently decides whether to keep calling tools by scanning the assistant's latest text for phrases like \"I have resolved this,\" rather than checking the API response's stop_reason field. During a complex dispute the loop terminated early because the model said \"Let me also check order history\" before actually calling the tool, and the phrase match misclassified this as completion. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add more phrases to the keyword list so future partial completions are not misclassified."
            },
            {
              "key": "B",
              "text": "Set a fixed cap of 3 tool calls per conversation and stop once the cap is reached regardless of content."
            },
            {
              "key": "C",
              "text": "Continue the loop whenever stop_reason equals \"tool_use\" and terminate only when it equals \"end_turn\"."
            },
            {
              "key": "D",
              "text": "Ask the agent to end every message with a structured tag like [DONE] when it believes the task is finished."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Using stop_reason is the deterministic signal the API already provides for whether another tool call is coming; it cannot be fooled by incidental phrasing the way keyword scanning can. Expanding the keyword list only patches one failure mode, an arbitrary iteration cap stops the loop for the wrong reason, and asking the model to emit a marker still relies on parsing generated text rather than the structured field."
        },
        {
          "id": "P8-S1-Q4",
          "domain": 1,
          "task": "1.6",
          "type": "single",
          "select": 1,
          "stem": "A Meridian customer messages: \"My debit card was charged twice for the same purchase, and separately I never got the refund you promised me last week for a different closed account.\" The agent currently investigates only the double-charge issue and ends the conversation, missing the second request in 18% of similar multi-issue messages. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Ask the customer to resubmit each issue as a separate message so the agent processes one concern per conversation, keeping each investigation in a fully independent session."
            },
            {
              "key": "B",
              "text": "Set tool_choice to \"any\" so the agent is forced to call a tool for every message, on the assumption that a mandatory tool call will reliably surface any additional concern buried in the text."
            },
            {
              "key": "C",
              "text": "Add a hook that silently discards the second sentence of any message containing more than one topic."
            },
            {
              "key": "D",
              "text": "Decompose the message into its distinct concerns, investigate each using shared context, then synthesize a single unified resolution covering both."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Explicitly decomposing a multi-concern request ensures each distinct issue is investigated rather than only the first one noticed. Pushing the burden back onto the customer degrades the experience, forcing some tool call per message is an unreliable proxy that does not guarantee both concerns are addressed, and discarding part of the message silently loses information instead of resolving it."
        },
        {
          "id": "P8-S1-Q5",
          "domain": 1,
          "task": "1.4",
          "type": "single",
          "select": 1,
          "stem": "Logs show that in 9% of account-closure requests, Meridian's agent calls close_account using only the name and partial card number the customer typed in chat, without first confirming identity via get_customer, occasionally closing the wrong customer's account. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a programmatic prerequisite that blocks close_account until get_customer has returned a verified customer ID for the session."
            },
            {
              "key": "B",
              "text": "Update the system prompt to state identity verification is required before closing any account."
            },
            {
              "key": "C",
              "text": "Add five few-shot examples demonstrating the agent always verifying identity first, trusting that the model will reliably generalize this safety-critical ordering from the illustrations."
            },
            {
              "key": "D",
              "text": "Build a classifier that pre-screens each message and only enables close_account when identity keywords are present, trained on historical identity-verification transcripts."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "When a tool sequence is required for a consequential, irreversible action, programmatic enforcement provides the deterministic guarantee that prompt instructions and few-shot examples cannot, no matter how many illustrative examples are supplied. A keyword classifier addresses a different problem (detecting intent) and doesn't actually enforce that verification happened before closure."
        },
        {
          "id": "P8-S1-Q6",
          "domain": 1,
          "task": "1.5",
          "type": "single",
          "select": 1,
          "stem": "Meridian's agent pulls data from three MCP tools: lookup_order returns dates as Unix timestamps, get_customer returns dates as ISO 8601 strings, and process_refund returns a numeric status code (0, 1, 2) instead of a label. The agent occasionally misinterprets a timestamp as a dollar amount, producing incorrect summaries to customers. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a system prompt note explaining each tool's raw output format so the agent can convert values itself."
            },
            {
              "key": "B",
              "text": "Add a hook that normalizes all three tools' outputs into a consistent date format and human-readable status labels before the model processes them."
            },
            {
              "key": "C",
              "text": "Instruct the agent to always double-check numeric values against the customer's own statements before reporting them."
            },
            {
              "key": "D",
              "text": "Increase the max_tokens limit so the agent has more room to reason about ambiguous formats."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Normalizing heterogeneous formats at the tool-result layer removes the ambiguity before the model ever has to interpret it, which is more reliable than asking the model to mentally convert three different formats correctly every time. More reasoning room or cross-checking against customer statements does not fix the underlying data inconsistency."
        },
        {
          "id": "P8-S1-Q7",
          "domain": 1,
          "task": "1.1",
          "type": "multiple",
          "select": 2,
          "stem": "A code reviewer flags two problems in Meridian's agentic loop implementation: it stops the loop whenever the assistant's response contains any plain text, even if a tool_use block is also present, and separately it hard-stops after exactly 4 tool calls no matter what stop_reason reports. Which TWO changes should be made? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Terminate only when stop_reason equals \"end_turn\", regardless of whether text accompanies tool_use blocks."
            },
            {
              "key": "B",
              "text": "Replace the fixed iteration cap with continued execution driven by stop_reason, reserving any cap only as a safety fallback rather than the primary stopping mechanism."
            },
            {
              "key": "C",
              "text": "Increase the iteration cap to 10 calls to reduce how often it is hit."
            },
            {
              "key": "D",
              "text": "Summarize the assistant's text into a sentiment score to decide whether to continue, on the assumption that overall sentiment correlates with whether the agent still intends to invoke further tools."
            },
            {
              "key": "E",
              "text": "Require the agent to emit a [DONE] marker in its text before stopping."
            }
          ],
          "correct": [
            "A",
            "B"
          ],
          "explanation": "The correct fixes rely on stop_reason as the authoritative termination signal and treat any iteration cap as only a backstop, not the primary control. Raising the cap doesn't address why it's being relied on as the main mechanism, and scoring sentiment or parsing a text marker both reintroduce the anti-pattern of basing control flow on generated text instead of the structured field."
        },
        {
          "id": "P8-S1-Q8",
          "domain": 2,
          "task": "2.3",
          "type": "single",
          "select": 1,
          "stem": "Meridian's support agent was launched with 18 MCP tools available at once, covering refunds, shipping holds, loyalty points, fraud flags, and five legacy billing utilities that are each invoked less than once a month. Tool-selection errors (wrong tool chosen for a clear request) have climbed since the rollout, even though each tool's description is well-written. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Reduce the agent's active tool set to the 4-5 tools needed for its common cases, exposing the rarely used legacy billing utilities only through a narrower escalation-adjacent path rather than the primary toolbox."
            },
            {
              "key": "B",
              "text": "Keep all 18 tools registered but instruct the agent in the system prompt to \"carefully consider which tool is most appropriate\" before every call, trusting that an explicit reminder about deliberate selection will counteract the volume of simultaneously available options."
            },
            {
              "key": "C",
              "text": "Set tool_choice to \"any\" so the model is forced to call some tool on every turn instead of returning text."
            },
            {
              "key": "D",
              "text": "Rewrite every one of the 18 descriptions to be longer and more detailed, on the theory that more verbose documentation per tool will offset the selection difficulty introduced by having that many simultaneous options."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Giving an agent access to too many tools at once degrades selection reliability by increasing decision complexity, regardless of how good each individual description is; scoping down to the tools actually needed for the role is the direct fix. A prompt reminder to \"consider carefully\" is prompt-based guidance layered on top of the same oversized toolbox and doesn't reduce the decision space. Forcing tool_choice: \"any\" only guarantees a tool call happens, not that the correct one is chosen among 18 candidates. Lengthening all 18 descriptions adds more context to weigh per decision without addressing the root cause of having too many options active simultaneously."
        },
        {
          "id": "P8-S1-Q9",
          "domain": 2,
          "task": "2.2",
          "type": "multiple",
          "select": 2,
          "stem": "Meridian wants process_refund's error responses to give the agent enough information to make good recovery decisions, instead of returning a single generic \"Operation failed\" string for every failure. Which TWO elements should the structured error response include? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "A single overall success/failure boolean with no further detail, to keep the response small."
            },
            {
              "key": "B",
              "text": "An errorCategory field distinguishing transient, validation, and business/policy errors."
            },
            {
              "key": "C",
              "text": "An isRetryable boolean so the agent knows whether attempting the call again could succeed."
            },
            {
              "key": "D",
              "text": "A hard-coded retry count that the agent must always use regardless of error type."
            },
            {
              "key": "E",
              "text": "A sentiment label describing how the customer might react to the failure."
            }
          ],
          "correct": [
            "B",
            "C"
          ],
          "explanation": "errorCategory and isRetryable are exactly the structured fields needed so the agent can distinguish transient problems worth retrying from validation or policy failures that will never succeed on retry. A flat success/failure boolean hides this distinction, a fixed retry count ignores the error type entirely, and sentiment has nothing to do with error handling."
        },
        {
          "id": "P8-S1-Q10",
          "domain": 2,
          "task": "2.3",
          "type": "single",
          "select": 1,
          "stem": "Meridian wants to guarantee that every refund request first calls get_customer to establish identity before the model is permitted to call any other tool, even when the model might otherwise jump straight to process_refund. Which mechanism most directly enforces this at the API level?",
          "options": [
            {
              "key": "A",
              "text": "Set tool_choice to \"any\" so the model must call some tool rather than returning text."
            },
            {
              "key": "B",
              "text": "Set tool_choice to \"auto\" and rely on the system prompt to request get_customer first, trusting that clear natural-language instructions will consistently produce the same ordering as an API-level constraint."
            },
            {
              "key": "C",
              "text": "Remove process_refund from the tool list until the conversation reaches turn 3, assuming sufficient identity context will have accumulated naturally by that fixed point."
            },
            {
              "key": "D",
              "text": "Set tool_choice to {\"type\": \"tool\", \"name\": \"get_customer\"} to force that specific tool call on the first turn, then allow subsequent turns to proceed normally."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Forced tool selection names the exact tool that must run, directly guaranteeing the required first step. \"any\" only guarantees some tool call, not the specific one needed, \"auto\" is the default and leaves ordering to the model's discretion, and arbitrarily hiding a tool until an arbitrary turn number doesn't actually depend on whether identity has been established."
        },
        {
          "id": "P8-S1-Q11",
          "domain": 5,
          "task": "5.2",
          "type": "single",
          "select": 1,
          "stem": "Meridian's agent currently resolves only 58% of cases on first contact, well short of the 80% target. Review of transcripts shows it escalates routine, well-documented fee-waiver requests while attempting to independently resolve ambiguous fraud-dispute cases that require judgment calls outside its scope. What is the most effective way to improve escalation calibration?",
          "options": [
            {
              "key": "A",
              "text": "Add explicit escalation criteria to the system prompt, with few-shot examples demonstrating when to escalate versus resolve autonomously."
            },
            {
              "key": "B",
              "text": "Have the agent self-report a confidence score before each response and escalate whenever confidence falls below 7/10."
            },
            {
              "key": "C",
              "text": "Train a separate classifier on historical tickets to predict escalation need before the agent begins processing."
            },
            {
              "key": "D",
              "text": "Add a sentiment analysis step that escalates whenever the customer's message contains negative language."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Explicit criteria paired with few-shot examples directly address unclear decision boundaries, which is the root cause of miscalibrated escalation. Self-reported confidence is poorly calibrated precisely on the hard cases where it matters most, a separate classifier is over-engineered before prompt-level fixes have been tried, and sentiment doesn't correlate with case complexity."
        },
        {
          "id": "P8-S1-Q12",
          "domain": 5,
          "task": "5.2",
          "type": "single",
          "select": 1,
          "stem": "A customer typing to Meridian's agent says: \"Please just transfer me to a human agent, I don't want to go through the bot.\" The agent currently responds by first asking three clarifying questions and attempting a resolution before offering escalation, frustrating the customer further. What is the correct behavior?",
          "options": [
            {
              "key": "A",
              "text": "Continue investigating for up to two more turns to see if the issue can be resolved faster than a human could."
            },
            {
              "key": "B",
              "text": "Escalate to a human agent immediately upon the explicit request, without first attempting investigation."
            },
            {
              "key": "C",
              "text": "Ask the customer to confirm their request a second time before escalating, to avoid unnecessary handoffs."
            },
            {
              "key": "D",
              "text": "Offer a short explanation of what the bot can do, then proceed with the original request only if the customer disagrees with escalating."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "An explicit customer request for a human should be honored immediately rather than delayed by further investigation or persuasion. Continuing to investigate, demanding confirmation, or trying to talk the customer out of escalating all disregard the customer's stated preference instead of respecting it."
        },
        {
          "id": "P8-S1-Q13",
          "domain": 5,
          "task": "5.2",
          "type": "single",
          "select": 1,
          "stem": "A customer messages Meridian's agent: \"This overdraft fee is ridiculous, I'm extremely frustrated.\" The issue, a single accidental overdraft fee reversal, is well within the agent's documented authority to resolve. What is the most appropriate response strategy?",
          "options": [
            {
              "key": "A",
              "text": "Escalate immediately because negative sentiment indicates the case is too complex for autonomous resolution, treating the emotional tone of the message as a reliable proxy for underlying case difficulty."
            },
            {
              "key": "B",
              "text": "Resolve the issue silently without acknowledging the frustration, since only the facts matter."
            },
            {
              "key": "C",
              "text": "Acknowledge the customer's frustration, then offer to resolve the overdraft fee reversal directly, escalating only if the customer reiterates a preference for a human."
            },
            {
              "key": "D",
              "text": "Ask the customer to first confirm they are not upset before proceeding with the resolution, treating a calm emotional check-in as a required gate before the fee reversal."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Acknowledging frustration while still offering a capability-appropriate resolution respects the customer's emotional state without over-escalating a straightforward case; escalation should follow only if the customer reiterates that preference. Escalating purely on detected negative sentiment conflates emotion with complexity, and ignoring the frustration entirely or demanding the customer confirm their emotional state both create a worse interaction."
        },
        {
          "id": "P8-S1-Q14",
          "domain": 5,
          "task": "5.2",
          "type": "multiple",
          "select": 2,
          "stem": "A review of Meridian's escalation logic finds two unreliable signals currently driving decisions: the agent escalates based on a sentiment classifier's detected negativity score, and separately, when lookup_order returns multiple matching accounts for a common name, the agent picks the most recently active one by heuristic rather than asking the customer. Which TWO changes should be made? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Keep the sentiment classifier but raise its negativity threshold to reduce false escalations."
            },
            {
              "key": "B",
              "text": "Keep the heuristic match but log it for later audit so engineers can review selections after the fact, assuming that logging alone will surface and correct wrong selections before they cause downstream confusion."
            },
            {
              "key": "C",
              "text": "Replace sentiment-based escalation with explicit escalation criteria, since negative sentiment does not reliably correlate with case complexity."
            },
            {
              "key": "D",
              "text": "Instruct the agent to ask for additional identifiers (such as the last four digits or zip code) when multiple customer matches are returned, rather than guessing."
            },
            {
              "key": "E",
              "text": "Replace sentiment analysis with a self-reported confidence score from the model instead."
            }
          ],
          "correct": [
            "C",
            "D"
          ],
          "explanation": "Both fixes replace an unreliable proxy with an approach that addresses the actual problem: explicit escalation criteria instead of sentiment, and clarifying questions instead of a heuristic guess among ambiguous matches. Tuning the sentiment threshold keeps using a flawed signal, logging the heuristic for later audit doesn't prevent a wrong account being selected now, and self-reported confidence is just as poorly calibrated as sentiment."
        },
        {
          "id": "P8-S1-Q15",
          "domain": 5,
          "task": "5.1",
          "type": "single",
          "select": 1,
          "stem": "During a lengthy multi-turn Meridian session involving three related disputes, the agent's running summary of the conversation condenses details into vague language like \"customer had some fee issues,\" losing the exact dollar amounts, dates, and order numbers established earlier. When the human agent later reviews the case, several figures are missing or wrong. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Increase the context window size so more of the original conversation can be retained without summarization."
            },
            {
              "key": "B",
              "text": "Instruct the agent to be more careful when summarizing so it doesn't lose details."
            },
            {
              "key": "C",
              "text": "Summarize the conversation twice and keep whichever summary is shorter, on the assumption that a more compact restatement is inherently less likely to contain stray inaccuracies."
            },
            {
              "key": "D",
              "text": "Extract transactional facts (amounts, dates, order numbers, statuses) into a persistent \"case facts\" block included in every subsequent prompt, separate from the summarized history."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Persisting exact transactional facts in a dedicated block outside the summarized history prevents the lossy compression that vague progressive summarization causes. A bigger context window doesn't stop the model from summarizing imprecisely, a general instruction to \"be careful\" is not a reliable guarantee, and summarizing twice and keeping the shorter version is more likely to lose detail, not less."
        }
      ]
    },
    {
      "id": 4,
      "title": "Developer Productivity with Claude",
      "description": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol (MCP) servers.",
      "questions": [
        {
          "id": "P8-S4-Q1",
          "domain": 1,
          "task": "1.6",
          "type": "multiple",
          "select": 2,
          "stem": "Cascade Freight's engineering lead asks the agent to \"add comprehensive tests to the RouteCore legacy pricing module,\" a 40,000-line codebase with no existing test suite. Which TWO actions reflect the most effective way to decompose this open-ended task? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Write tests for every file in strict alphabetical order to guarantee eventual full coverage."
            },
            {
              "key": "B",
              "text": "Generate a single test file covering the entire module's public API in one pass, without further investigation."
            },
            {
              "key": "C",
              "text": "Wait for the engineering lead to specify exact line numbers requiring coverage before starting any work."
            },
            {
              "key": "D",
              "text": "First map the module's structure and identify high-impact, high-risk areas such as the core pricing calculation logic."
            },
            {
              "key": "E",
              "text": "Build a prioritized test plan that adapts as new dependencies and edge cases are discovered during exploration."
            }
          ],
          "correct": [
            "D",
            "E"
          ],
          "explanation": "Mapping structure to find high-impact areas and then building an adaptive, prioritized plan is the recommended pattern for open-ended legacy exploration tasks. Alphabetical ordering ignores risk entirely, a single one-pass test file under-decomposes a genuinely complex task, and requiring exact line numbers upfront shifts necessary analysis work onto the requester instead of the agent doing it."
        },
        {
          "id": "P8-S4-Q2",
          "domain": 1,
          "task": "1.7",
          "type": "single",
          "select": 1,
          "stem": "After analyzing RouteCore's rate-calculation module, an engineer wants to compare two different refactoring strategies, one introducing a strategy pattern and one using a lookup table, without repeating the initial codebase analysis for each. What is the most effective approach?",
          "options": [
            {
              "key": "A",
              "text": "Use fork_session to branch from the shared analysis baseline into two independent sessions, one exploring each refactoring approach."
            },
            {
              "key": "B",
              "text": "Start two entirely new sessions and re-run the full codebase exploration in each to keep them independent."
            },
            {
              "key": "C",
              "text": "Use --resume with the same session name twice in parallel terminal windows, assuming the CLI will automatically partition state so each window tracks an independent branch."
            },
            {
              "key": "D",
              "text": "Summarize the analysis into a document and paste it manually into two new conversations, since manual summaries are assumed to preserve all the context needed for each strategy."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "fork_session is designed exactly for exploring divergent approaches from a shared baseline without redoing the initial analysis. Starting fresh sessions duplicates expensive exploration work, resuming the same named session twice in parallel risks conflicting state rather than independent branches, and manual copy-paste summaries are more error-prone and labor-intensive than a built-in fork."
        },
        {
          "id": "P8-S4-Q3",
          "domain": 1,
          "task": "1.3",
          "type": "single",
          "select": 1,
          "stem": "Cascade's developer-productivity agent is supposed to spawn an Explore subagent to investigate a legacy billing module, but the coordinator's attempts to invoke it silently fail with no subagent ever starting. The coordinator's configuration omits a required entry. What is most likely missing?",
          "options": [
            {
              "key": "A",
              "text": "The subagent was never given a system prompt describing its role, which is assumed to be the reason the Task invocation produces no visible subagent activity at all."
            },
            {
              "key": "B",
              "text": "\"Task\" is not included in the coordinator's allowedTools list, so it cannot invoke the Task tool needed to spawn subagents."
            },
            {
              "key": "C",
              "text": "The subagent's context: fork frontmatter option was not set."
            },
            {
              "key": "D",
              "text": "The coordinator is missing a --resume flag in its invocation, since resuming a prior session is assumed to automatically re-register any previously spawned subagent handlers."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Invoking subagents requires the coordinator's allowedTools to include \"Task\"; without it, the coordinator has no mechanism to spawn anything, which matches a silent, total failure to start. A missing system prompt or frontmatter option would affect subagent behavior rather than prevent any invocation at all, and --resume relates to session continuation, not subagent spawning."
        },
        {
          "id": "P8-S4-Q4",
          "domain": 1,
          "task": "1.4",
          "type": "single",
          "select": 1,
          "stem": "Cascade's agent is instructed via its system prompt to \"always run the test suite before suggesting a Bash command that modifies the deployment configuration,\" but in 6% of sessions it edits the deployment config first and runs tests afterward, sometimes leaving broken configs in place briefly. What is the most reliable fix?",
          "options": [
            {
              "key": "A",
              "text": "Repeat the ordering instruction twice in the system prompt for emphasis."
            },
            {
              "key": "B",
              "text": "Add few-shot examples showing the correct order of operations."
            },
            {
              "key": "C",
              "text": "Add a programmatic prerequisite (a hook or gate) that blocks deployment-config-modifying Bash commands until the test suite has completed successfully."
            },
            {
              "key": "D",
              "text": "Ask the agent to double-check its own work after editing the config."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "When a specific operation ordering is required for safety, a programmatic gate guarantees it deterministically, unlike repeated instructions, few-shot examples, or self-checking, all of which remain probabilistic prompt-based approaches with a non-zero failure rate."
        },
        {
          "id": "P8-S4-Q5",
          "domain": 1,
          "task": "1.2",
          "type": "single",
          "select": 1,
          "stem": "Cascade's dev-productivity agent spawns separate subagents to investigate the pricing module, the routing module, and the notifications module in parallel. Currently, subagents occasionally message each other directly to share partial findings, making it hard to track what happened and causing duplicate investigation of the same files. What architectural change would best address this?",
          "options": [
            {
              "key": "A",
              "text": "Give each subagent a shared memory file that all subagents can read and write directly, assuming conflicting writes are rare enough to resolve naturally without coordination."
            },
            {
              "key": "B",
              "text": "Allow subagents to message each other but require them to log a copy of each message for auditing."
            },
            {
              "key": "C",
              "text": "Merge the three subagents into a single subagent responsible for all three modules, trading away parallelism on the assumption that one sequential investigator avoids coordination overhead."
            },
            {
              "key": "D",
              "text": "Route all inter-subagent communication through the coordinator, which aggregates results and decides on any follow-up delegation."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "A hub-and-spoke pattern where all communication flows through the coordinator preserves observability and consistent error handling, which is exactly what's missing when subagents talk directly to each other. A shared memory file still allows uncoordinated direct interaction, logging after the fact doesn't prevent the duplication, and merging subagents sacrifices the benefits of parallel, specialized investigation."
        },
        {
          "id": "P8-S4-Q6",
          "domain": 2,
          "task": "2.5",
          "type": "single",
          "select": 1,
          "stem": "An engineer asks Cascade's agent to explain how the calculate_shipping_rate function is used throughout the RouteCore codebase. The agent currently opens and reads every file in the repository sequentially before answering, taking several minutes and consuming excessive context. What is the most effective exploration approach?",
          "options": [
            {
              "key": "A",
              "text": "Use Grep to locate all call sites and definitions of calculate_shipping_rate first, then use Read to follow the specific imports and trace flow only through relevant files."
            },
            {
              "key": "B",
              "text": "Use Glob to list every file in the repository, then read each one in alphabetical order, on the assumption that alphabetical order happens to correlate with relevance to the function."
            },
            {
              "key": "C",
              "text": "Use Write to create a temporary index file of all function names before searching."
            },
            {
              "key": "D",
              "text": "Use Bash to run a full-text search of the entire disk outside the repository in case the function is defined elsewhere, on the assumption that a filesystem-wide scan will surface hidden vendored copies."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Starting with Grep to find entry points and then using Read to follow only the relevant imports builds understanding incrementally without reading the whole codebase upfront. Globbing and reading every file alphabetically, indexing every function name manually, and searching outside the repository entirely are all far less targeted and far more wasteful of time and context."
        },
        {
          "id": "P8-S4-Q7",
          "domain": 2,
          "task": "2.5",
          "type": "single",
          "select": 1,
          "stem": "The agent needs to determine every place RateCalculator is actually invoked, but it is re-exported under different aliases (calcRate, PricingEngine) by three wrapper modules, so a single Grep for \"RateCalculator\" misses most real usages. What is the most effective approach?",
          "options": [
            {
              "key": "A",
              "text": "Read every file in the repository to manually find alias usages."
            },
            {
              "key": "B",
              "text": "First identify all exported names and aliases for RateCalculator across the wrapper modules, then run a separate Grep search for each exported name across the codebase."
            },
            {
              "key": "C",
              "text": "Rename all aliases back to RateCalculator before searching, to simplify the Grep pattern, treating a codebase-wide rename as an acceptable one-time cost to avoid handling multiple exported names."
            },
            {
              "key": "D",
              "text": "Use a single Grep with a broad wildcard pattern matching any identifier containing \"Rate\", assuming the wildcard's recall will compensate for not knowing the real alias names."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Identifying all exported aliases first and then searching for each one by name directly addresses the reason the original search missed usages. Reading every file is far slower, renaming aliases is an invasive change just to search, and a broad wildcard would surface many unrelated identifiers containing \"Rate\" while still not reliably catching every alias."
        },
        {
          "id": "P8-S4-Q8",
          "domain": 2,
          "task": "2.1",
          "type": "single",
          "select": 1,
          "stem": "Cascade's logistics MCP server exposes two tools, search_shipments and search_records, both described simply as \"Searches logistics data.\" The dev-productivity agent frequently calls the wrong one when asked to find a specific shipment by tracking number. What is the most effective first step?",
          "options": [
            {
              "key": "A",
              "text": "Rename search_records to search_shipments_v2 without changing either description, on the assumption that a version-style suffix alone will disambiguate intent for the model."
            },
            {
              "key": "B",
              "text": "Add a routing layer that inspects user text for the word \"shipment\" before tool selection, assuming that single keyword match reliably predicts intent across every phrasing variation."
            },
            {
              "key": "C",
              "text": "Rewrite each tool's description to clearly state its specific input format, example queries, and boundaries distinguishing it from the other tool."
            },
            {
              "key": "D",
              "text": "Remove search_records entirely since search_shipments seems to cover most needs."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Clear, differentiated descriptions are the primary mechanism for correct tool selection and the lowest-effort first step. Renaming without updating the description leaves the underlying ambiguity unresolved, a keyword router bypasses the model's own reasoning, and removing a tool outright discards functionality instead of fixing the description problem."
        },
        {
          "id": "P8-S4-Q9",
          "domain": 2,
          "task": "2.4",
          "type": "multiple",
          "select": 2,
          "stem": "Cascade wants every developer to automatically have access to the shared \"shipment-tracking\" MCP server when they clone the repository, using a credential stored as an environment variable rather than hardcoded in the config. Separately, one engineer wants to privately experiment with a new personal MCP server without affecting teammates. Which TWO configuration choices are correct? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Define the engineer's personal experimental server in their user-scoped ~/.claude.json file."
            },
            {
              "key": "B",
              "text": "Define the shared server in ~/.claude.json so it loads automatically for every user on their own machine."
            },
            {
              "key": "C",
              "text": "Hardcode the credential value directly into .mcp.json so it works without any environment setup."
            },
            {
              "key": "D",
              "text": "Define the personal experimental server in the project's .mcp.json so it's available to everyone for testing."
            },
            {
              "key": "E",
              "text": "Define the shared shipment-tracking server in the project-scoped .mcp.json file, using ${TRACKING_API_TOKEN} for credential expansion."
            }
          ],
          "correct": [
            "A",
            "E"
          ],
          "explanation": "Project-scoped .mcp.json with environment variable expansion is correct for shared, version-controlled team tooling, while user-scoped ~/.claude.json is correct for a personal, experimental server. Putting the shared server in a user-level file means it isn't shared via version control at all, hardcoding the credential commits a secret into the repository, and putting the personal server in the project file would expose it to the whole team."
        },
        {
          "id": "P8-S4-Q10",
          "domain": 3,
          "task": "3.1",
          "type": "single",
          "select": 1,
          "stem": "A new engineer joins Cascade's team and reports that Claude Code never follows the team's \"always use the repository's logging wrapper instead of print statements\" rule, even though the rule works correctly for everyone else. Investigation reveals the rule was added only to the previous engineer's ~/.claude/CLAUDE.md file. What is the most likely cause and fix?",
          "options": [
            {
              "key": "A",
              "text": "The new engineer's machine has a corrupted Claude Code installation that needs reinstalling, since intermittent rule-following failures are commonly attributed to local binary corruption."
            },
            {
              "key": "B",
              "text": "The rule needs to be repeated in every directory-level CLAUDE.md file to take effect for new users, since each directory is assumed to maintain its own isolated rule set."
            },
            {
              "key": "C",
              "text": "The rule must be converted into a custom skill before it can apply to new team members."
            },
            {
              "key": "D",
              "text": "The rule is in user-level configuration, which isn't shared via version control; move it to the project-level CLAUDE.md so all teammates receive it."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "User-level CLAUDE.md files apply only to that individual user and are never shared through version control, so moving the rule to the project level is the direct fix. A corrupted installation wouldn't selectively affect only one rule, repeating it per directory doesn't address the scoping problem, and converting it into a skill changes invocation behavior without fixing why it isn't reaching new teammates."
        },
        {
          "id": "P8-S4-Q11",
          "domain": 3,
          "task": "3.2",
          "type": "single",
          "select": 1,
          "stem": "Cascade created a \"deep-dive-module\" skill that produces extremely verbose output (hundreds of lines analyzing module dependencies) when invoked, and this output is cluttering the main conversation, making it hard for the agent to keep track of the actual task at hand. What frontmatter configuration best addresses this?",
          "options": [
            {
              "key": "A",
              "text": "Set context: fork in the skill's SKILL.md so the skill runs in an isolated sub-agent context and only a summary returns to the main conversation."
            },
            {
              "key": "B",
              "text": "Add an argument-hint so developers know what input the skill expects."
            },
            {
              "key": "C",
              "text": "Restrict allowed-tools to only Read, to make the skill run faster, on the assumption that fewer available tools proportionally reduces the verbosity of the output it generates."
            },
            {
              "key": "D",
              "text": "Move the skill from .claude/skills/ to .claude/commands/ so it behaves like a slash command instead, on the assumption that slash commands inherently run in an isolated context."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "context: fork is specifically designed to isolate verbose or exploratory output into a separate context, preventing it from polluting the main conversation. An argument-hint helps with invocation syntax but doesn't address output volume, restricting tools changes capability rather than isolating output, and converting it to a slash command doesn't provide context isolation."
        },
        {
          "id": "P8-S4-Q12",
          "domain": 3,
          "task": "3.4",
          "type": "single",
          "select": 1,
          "stem": "An engineer asks Cascade's agent to fix a single off-by-one error in one function, with the exact stack trace already provided, versus a separate request to migrate the entire notification system from a polling-based design to an event-driven one across 30+ files. How should the agent decide between plan mode and direct execution for each?",
          "options": [
            {
              "key": "A",
              "text": "Use plan mode for both tasks, since plan mode always produces safer results regardless of scope, treating the review overhead as negligible even for trivially scoped fixes."
            },
            {
              "key": "B",
              "text": "Use direct execution for the single-file stack-trace fix; use plan mode for the 30+ file event-driven migration given its architectural implications."
            },
            {
              "key": "C",
              "text": "Use direct execution for both tasks, and only switch to plan mode if direct execution fails."
            },
            {
              "key": "D",
              "text": "Use plan mode for the stack-trace fix since stack traces are often misleading, and direct execution for the migration since it's well understood by the team."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Plan mode is suited to large-scale, architecturally significant changes, while a well-scoped single-file fix with a clear stack trace is exactly the kind of task direct execution handles efficiently. Always using plan mode adds unnecessary overhead to simple fixes, waiting for direct execution to fail on a 30+ file migration risks costly rework, and reversing the pairing misapplies both modes to the wrong task."
        },
        {
          "id": "P8-S4-Q13",
          "domain": 5,
          "task": "5.4",
          "type": "single",
          "select": 1,
          "stem": "Cascade's multi-phase codebase exploration agent crashed midway through analyzing RouteCore's 12 subsystems due to an infrastructure outage. On restart, the coordinator has no record of which subsystems were already analyzed, and the agent re-explores all 12 from scratch, wasting significant time. What is the most effective design to prevent this in future runs?",
          "options": [
            {
              "key": "A",
              "text": "Increase the context window so the full history of all 12 subsystems fits in a single session regardless of crashes."
            },
            {
              "key": "B",
              "text": "Re-run all 12 subsystem explorations from scratch on every restart to guarantee consistency."
            },
            {
              "key": "C",
              "text": "Have each exploration agent export its state and findings to a known location as it completes, and have the coordinator load a manifest of completed work on resume, injecting it into the next agent's prompt."
            },
            {
              "key": "D",
              "text": "Rely on --resume alone to restore the exact prior state without any additional state tracking."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Structured state exports and a manifest the coordinator loads on resume are what enable crash recovery without redoing completed work. A larger context window doesn't protect against a crash losing in-memory state, always re-running everything from scratch defeats the purpose of recovery, and --resume alone doesn't track which specific subsystems were already completed."
        },
        {
          "id": "P8-S4-Q14",
          "domain": 5,
          "task": "5.4",
          "type": "multiple",
          "select": 2,
          "stem": "During an extended multi-hour session exploring RouteCore's pricing engine, the agent begins giving inconsistent answers, referring to \"a typical rate-calculation class\" instead of the specific RateCalculatorV2 class it identified two hours earlier, and loses track of which subsystems were already analyzed. Which TWO changes would most effectively counteract this context degradation? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Maintain a scratchpad file recording key findings, such as the specific class and function names already discovered, and reference it for subsequent questions."
            },
            {
              "key": "B",
              "text": "Summarize key findings from each exploration phase and inject that summary into context before spawning subagents for the next phase."
            },
            {
              "key": "C",
              "text": "Re-read the entire codebase from the beginning before answering each new question, assuming that repeating the full exploration from scratch each time keeps findings consistent without any persisted state."
            },
            {
              "key": "D",
              "text": "Lower the temperature setting so the agent is less likely to generate inconsistent text."
            },
            {
              "key": "E",
              "text": "Instruct the agent to preface uncertain answers with \"typically\" to signal reduced confidence."
            }
          ],
          "correct": [
            "A",
            "B"
          ],
          "explanation": "Scratchpad persistence and injecting phase summaries are the recommended techniques for counteracting degradation in long exploration sessions by keeping specific prior findings available. Re-reading everything from scratch each time is wasteful and doesn't scale, lowering temperature addresses randomness rather than memory loss, and hedging language masks the symptom instead of fixing the loss of specific findings."
        },
        {
          "id": "P8-S4-Q15",
          "domain": 5,
          "task": "5.1",
          "type": "single",
          "select": 1,
          "stem": "Every time Cascade's agent calls a custom MCP tool that fetches shipment-record schemas, it returns 45 metadata fields (creation timestamps, internal IDs, audit flags) when only 5 fields are actually relevant to the test-writing task at hand, and this is consuming a large share of the context budget across a long session. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Reduce the number of calls to the tool, even if that means skipping schema checks for some records, assuming fewer round trips proportionally reduce consumed context."
            },
            {
              "key": "B",
              "text": "Ask the agent to summarize the tool output itself every time it's returned, in its own words."
            },
            {
              "key": "C",
              "text": "Switch to a model with a larger context window so all 45 fields can be retained without issue, treating extra capacity as a substitute for trimming irrelevant data."
            },
            {
              "key": "D",
              "text": "Trim the tool's output, or add a hook, to keep only the fields relevant to the current task before they accumulate in context."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Trimming verbose tool output to only relevant fields directly addresses tokens being consumed disproportionately to their relevance. Reducing call frequency sacrifices needed checks, asking the model to self-summarize still requires it to first process the full verbose payload, and a larger context window treats the symptom rather than the inefficiency itself."
        }
      ]
    },
    {
      "id": 5,
      "title": "Claude Code for Continuous Integration",
      "description": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.",
      "questions": [
        {
          "id": "P8-S5-Q1",
          "domain": 3,
          "task": "3.2",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's reviewers run `/triage-severity` inside Claude Code during local development, and the CI container invokes the same command string via `claude -p \"/triage-severity\"` when reviewing each pull request. Locally the command works for every engineer, but every CI run fails with \"unknown command\". The command file lives only in one senior reviewer's `~/.claude/commands/triage-severity.md`. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Move triage-severity.md into the repository's .claude/commands/ directory so it is version-controlled and available to the CI container, which only has access to the checked-out repository, not any individual developer's home directory."
            },
            {
              "key": "B",
              "text": "Have the senior reviewer manually copy ~/.claude/commands/triage-severity.md onto the CI runner's image before each pipeline run."
            },
            {
              "key": "C",
              "text": "Rename the command to start with a dot so Claude Code treats it as a hidden global command visible to every environment automatically."
            },
            {
              "key": "D",
              "text": "Reference the command body directly inside the root CLAUDE.md file instead of keeping it as a slash command, since CLAUDE.md is always loaded regardless of scope."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "User-scoped commands under ~/.claude/commands/ are personal and are not shared via version control, so a CI container checking out only the repository will never see them; moving the file into the project-scoped .claude/commands/ directory makes it version-controlled and available to every environment that clones the repo, including CI. Manually copying the file onto the runner image is a fragile one-off workaround that must be repeated and kept in sync by hand. There is no hidden-global-command renaming convention that changes a command's scope. Pasting the command's instructions into CLAUDE.md conflates an always-loaded configuration file with an on-demand slash command and loses the reusable, parameterized command structure."
        },
        {
          "id": "P8-S5-Q2",
          "domain": 3,
          "task": "3.6",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart wants its CI pipeline to automatically post each code-review finding as an individual inline PR comment, which requires reliably machine-parseable output with consistent fields (file, line, severity, message). Free-form text output from Claude Code currently varies in structure from run to run, breaking the comment-posting script. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Ask the review prompt to \"always format output as JSON\" without specifying a schema, trusting that general training on JSON formatting will converge on a stable field layout."
            },
            {
              "key": "B",
              "text": "Run Claude Code with --output-format json and a --json-schema defining the required fields, producing consistent structured output for the posting script to parse."
            },
            {
              "key": "C",
              "text": "Post the raw text output as a single large PR comment instead of individual inline comments."
            },
            {
              "key": "D",
              "text": "Write a regex-based parser that extracts fields from the free-form text output, assuming a handful of patterns will reliably capture every phrasing variation the model produces."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "The --output-format json and --json-schema CLI flags are built specifically for enforcing structured, machine-parseable CI output. Asking for JSON in prose without a schema still leaves structure inconsistent, abandoning inline comments sidesteps the actual requirement, and a regex parser is brittle against free-form text that varies run to run."
        },
        {
          "id": "P8-S5-Q3",
          "domain": 3,
          "task": "3.6",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's CI review runs again automatically after every new commit to a pull request. Currently, each re-run re-reports every previously flagged issue again, even ones the developer already fixed, cluttering the PR with duplicate comments. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Disable automatic re-runs and require developers to manually trigger review once per PR."
            },
            {
              "key": "B",
              "text": "Have the pipeline delete all prior comments before posting new ones, regardless of whether issues were fixed."
            },
            {
              "key": "C",
              "text": "Include prior review findings in context on each re-run, and instruct Claude to report only new or still-unaddressed issues."
            },
            {
              "key": "D",
              "text": "Increase the review's temperature so it varies its phrasing and avoids looking like a duplicate."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Providing prior findings as context lets the model distinguish genuinely new or unresolved issues from ones already fixed, directly eliminating duplicates. Disabling automatic re-runs removes a valuable safety net, deleting all prior comments loses the review history and is unrelated to whether an issue is resolved, and varying phrasing doesn't change whether the same issue is being reported again."
        },
        {
          "id": "P8-S5-Q4",
          "domain": 3,
          "task": "3.6",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart tried having the same Claude Code session that generated a bug fix also review that fix before posting it to the PR. The self-review consistently approves its own changes even when a human reviewer later finds subtle issues. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Ask the same session to \"review your work critically\" with extended thinking enabled, trusting that additional reasoning budget alone will overcome the session's attachment to its own prior decisions."
            },
            {
              "key": "B",
              "text": "Lower the temperature of the review step to make it more careful."
            },
            {
              "key": "C",
              "text": "Have the same session review its own work twice and only flag issues found in both passes, on the assumption that agreement across two self-reviews filters out the model's own blind spots."
            },
            {
              "key": "D",
              "text": "Use a second, independent Claude Code instance with no prior reasoning context from the generation step to perform the review."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "An independent instance without the generator's retained reasoning context is far more effective at catching issues than any form of self-review, because the original session is predisposed not to question decisions it already made. Asking the same session to be more critical, lowering its temperature, or running it twice all still operate within the same biased reasoning context."
        },
        {
          "id": "P8-S5-Q5",
          "domain": 3,
          "task": "3.3",
          "type": "multiple",
          "select": 2,
          "stem": "SwiftCart's CI review should apply stricter null-check requirements to all test files, regardless of which directory they live in, since test files are scattered throughout many unrelated modules. The team is choosing between .claude/rules/ with glob-pattern path scoping and directory-level CLAUDE.md files. Which TWO statements correctly favor the glob-pattern rules approach for this situation? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Directory-level CLAUDE.md files automatically apply to files added to new directories created after they're written, assuming the file-type scoping teams need will naturally emerge from directory structure alone."
            },
            {
              "key": "B",
              "text": "Glob patterns such as paths: [\"**/*.test.*\"] apply conventions based on file type regardless of which directory the file lives in."
            },
            {
              "key": "C",
              "text": "Rules load only when editing matching files, reducing irrelevant context compared to always-loaded directory-level files."
            },
            {
              "key": "D",
              "text": "Glob-pattern rules require manual invocation by the developer before each edit to take effect."
            },
            {
              "key": "E",
              "text": "Directory-level CLAUDE.md files are the only mechanism capable of scoping conventions by file type."
            }
          ],
          "correct": [
            "B",
            "C"
          ],
          "explanation": "Glob-pattern rules apply by file type anywhere in the tree and load conditionally, which is precisely why they outperform directory-bound files for conventions scattered across the codebase. Directory-level files only cover their own subtree regardless of when it was created, glob rules load automatically rather than requiring manual invocation, and directory files cannot scope by file type across arbitrary locations the way glob rules can."
        },
        {
          "id": "P8-S5-Q6",
          "domain": 4,
          "task": "4.2",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's CI test-generation prompt tells Claude to \"format generated test names descriptively,\" but across runs the resulting test names are inconsistently styled, some verbose sentences, some terse fragments, some including unrelated implementation detail. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Provide 2-3 concrete input/output examples showing exactly the desired test name format for different scenarios."
            },
            {
              "key": "B",
              "text": "Rewrite the instruction as \"format test names descriptively and consistently\" for emphasis, assuming the added adjective alone will resolve the ambiguity the model is already struggling with."
            },
            {
              "key": "C",
              "text": "Add a post-processing script that truncates all test names to a fixed character length, on the assumption that a uniform length limit produces consistent, readable naming."
            },
            {
              "key": "D",
              "text": "Remove the instruction entirely and let the model choose its own convention per run."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Concrete examples communicate the expected transformation far more reliably than prose when natural-language descriptions produce inconsistent results. Repeating the instruction with extra adjectives doesn't resolve the underlying ambiguity, truncating names mechanically can break readability without fixing format consistency, and removing the instruction entirely abandons any attempt at consistency."
        },
        {
          "id": "P8-S5-Q7",
          "domain": 4,
          "task": "4.4",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's reviewers dismiss roughly 40% of \"unused variable\" findings from the CI review step as false positives, but nobody can say which specific code constructs (destructured imports, loop counters, catch-block error bindings) are driving the dismissals, so the prompt can't be targeted at the actual problem. What should the finding's structured output add to make this analyzable over time?",
          "options": [
            {
              "key": "A",
              "text": "A detected_pattern field on each finding that records the specific code construct that triggered it, so dismissal rates can be aggregated by pattern to identify which constructs need prompt refinement."
            },
            {
              "key": "B",
              "text": "A self-reported confidence score from 1-10 attached to each finding, on the theory that findings the model is less confident about will correlate with the ones developers go on to dismiss."
            },
            {
              "key": "C",
              "text": "A severity label of low/medium/high with no further detail about why that severity was assigned."
            },
            {
              "key": "D",
              "text": "A boolean \"reviewed\" flag that a human sets after reading the finding, without recording anything about the underlying code pattern that produced it."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Recording which concrete construct triggered each finding lets the team aggregate dismissals by pattern and refine the prompt for the specific constructs causing false positives, rather than guessing at the category level. A self-reported confidence score is a poorly calibrated proxy that doesn't identify which construct is at fault even when it happens to correlate loosely with dismissals. A bare severity label and an unannotated reviewed flag both record an outcome without capturing the underlying cause, so neither supports systematic analysis of dismissal patterns."
        },
        {
          "id": "P8-S5-Q8",
          "domain": 3,
          "task": "3.1",
          "type": "single",
          "select": 1,
          "stem": "A SwiftCart engineer suspects that Claude Code's CI review is loading an outdated CLAUDE.md file from a stale cache rather than the current one in the repository, since recently added review criteria don't seem to be taking effect. What is the most direct way to diagnose this?",
          "options": [
            {
              "key": "A",
              "text": "Delete the entire .claude directory and recreate it from scratch."
            },
            {
              "key": "B",
              "text": "Add the new criteria a second time in a different CLAUDE.md file to override the stale one."
            },
            {
              "key": "C",
              "text": "Use the /memory command to verify exactly which memory files are currently loaded for the session."
            },
            {
              "key": "D",
              "text": "Restart the CI runner's container, since CLAUDE.md issues are always caused by environment caching."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "The /memory command directly shows which memory files are loaded, making it the fastest way to confirm or rule out a stale-loading issue before taking any destructive action. Deleting the .claude directory is a drastic step without first diagnosing the actual cause, duplicating criteria in another file doesn't fix a loading problem, and assuming the cause is always container caching skips diagnosis entirely."
        },
        {
          "id": "P8-S5-Q9",
          "domain": 4,
          "task": "4.1",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's CI review prompt instructs Claude to \"be conservative and only report high-confidence findings\" to reduce false positives, but the false-positive rate on security findings remains at 35% after this change, with no measurable improvement. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Reduce the \"high-confidence\" threshold further by adding the word \"extremely\" before \"conservative.\""
            },
            {
              "key": "B",
              "text": "Add a self-reported confidence score and only show findings above 9/10."
            },
            {
              "key": "C",
              "text": "Have a second Claude instance filter out findings it personally disagrees with after the first pass."
            },
            {
              "key": "D",
              "text": "Replace the vague instruction with explicit categorical criteria defining exactly which conditions qualify as a security finding versus which patterns should be skipped."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Explicit categorical criteria give the model a concrete, checkable standard, whereas vague instructions like \"be conservative\" fail to improve precision regardless of how emphatically they're worded. Adding intensifiers doesn't change the underlying ambiguity, self-reported confidence scores are not reliably calibrated to actual accuracy, and an uncoordinated second opinion doesn't address the root cause of imprecise criteria."
        },
        {
          "id": "P8-S5-Q10",
          "domain": 4,
          "task": "4.1",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart developers have started ignoring all CI review comments after discovering that the \"potential null pointer\" finding category is wrong 60% of the time, even though the \"security vulnerability\" category remains highly accurate. Developers now dismiss accurate security findings along with the noisy ones. What is the most effective immediate step?",
          "options": [
            {
              "key": "A",
              "text": "Temporarily disable the \"potential null pointer\" finding category while improving its prompt, keeping the accurate \"security vulnerability\" category active."
            },
            {
              "key": "B",
              "text": "Disable all CI review categories until every category reaches 100% accuracy."
            },
            {
              "key": "C",
              "text": "Add a disclaimer to every comment reminding developers that findings may be imperfect."
            },
            {
              "key": "D",
              "text": "Keep all categories active but mark the null pointer category as \"low priority\" in the comment text, assuming a priority label alone will change behavior even though its 60% error rate is unchanged."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Disabling only the noisy category while keeping the accurate one active stops the specific source of eroded trust without sacrificing the value developers still get from accurate findings. Disabling everything throws away useful signal unnecessarily, a disclaimer doesn't change the actual accuracy rate developers are reacting to, and merely relabeling the noisy category as low priority still exposes developers to the same unreliable findings."
        },
        {
          "id": "P8-S5-Q11",
          "domain": 4,
          "task": "4.1",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's CI review labels findings as \"critical,\" \"major,\" or \"minor,\" but two reviewers examining the same findings disagree on severity roughly 40% of the time, and the prompt only says \"use your judgment to assign severity.\" What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Remove severity labels entirely and report all findings as equally important, under the assumption that developers will apply their own ad hoc judgment to compensate for the missing signal."
            },
            {
              "key": "B",
              "text": "Define explicit severity criteria with concrete code examples illustrating what qualifies for each severity level."
            },
            {
              "key": "C",
              "text": "Add a numeric severity score from 1-100 instead of three categorical labels, for more granularity."
            },
            {
              "key": "D",
              "text": "Ask two separate Claude instances to vote on severity and average their numeric opinions."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Explicit criteria backed by concrete examples give the model a consistent, checkable standard for each severity level, directly addressing the disagreement caused by vague \"use your judgment\" guidance. Removing labels discards useful information, adding finer-grained numbers without clearer criteria doesn't resolve the underlying ambiguity, and averaging independent judgments still rests on the same unclear standard each instance is applying."
        },
        {
          "id": "P8-S5-Q12",
          "domain": 4,
          "task": "4.2",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's CI review frequently flags a specific error-handling pattern as a bug, even though it's an intentional, well-established convention used throughout the codebase for a particular retry mechanism. Detailed written instructions describing the convention haven't reduced the false positives. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a single additional sentence to the prompt restating that the pattern is acceptable."
            },
            {
              "key": "B",
              "text": "Exclude the files containing this pattern from CI review entirely."
            },
            {
              "key": "C",
              "text": "Add few-shot examples distinguishing this acceptable pattern from genuine issues, showing both when the pattern is fine and when a superficially similar pattern is actually a bug."
            },
            {
              "key": "D",
              "text": "Lower the review's overall sensitivity setting so fewer findings are reported across the board."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Few-shot examples that contrast the acceptable pattern with a genuinely buggy near-identical pattern let the model generalize the distinction, which detailed prose alone has already failed to achieve. Restating the same instruction again doesn't add new information, excluding entire files from review creates a blind spot for real bugs, and globally lowering sensitivity suppresses unrelated legitimate findings too."
        },
        {
          "id": "P8-S5-Q13",
          "domain": 4,
          "task": "4.3",
          "type": "multiple",
          "select": 2,
          "stem": "SwiftCart's CI review step defines multiple possible finding-extraction schemas (one for security findings, one for style findings) but isn't sure in advance which schema a given file's findings will match, while a separate step must always run a required metadata-extraction tool before any other tool runs. Which TWO configurations are correct? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Use tool_choice: \"auto\" during the metadata-extraction step so the model may skip it if it seems unnecessary."
            },
            {
              "key": "B",
              "text": "Use tool_choice: \"any\" for the metadata-extraction step so any extraction tool, not specifically metadata, might run first."
            },
            {
              "key": "C",
              "text": "Use tool_choice: \"any\" during the finding-extraction step so the model must call a tool but can choose which schema fits best."
            },
            {
              "key": "D",
              "text": "Use tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"} to force the metadata-extraction tool to run first."
            },
            {
              "key": "E",
              "text": "Avoid tool_choice entirely and rely on prompt wording to guarantee the correct tool order."
            }
          ],
          "correct": [
            "C",
            "D"
          ],
          "explanation": "\"any\" is appropriate when a tool call is required but the specific choice should remain flexible, while forced selection guarantees the specific required first step runs. \"auto\" risks the required metadata step being skipped entirely, a plain \"any\" for that step doesn't guarantee the metadata tool specifically runs, and relying on prompt wording alone reverts to the unreliable, probabilistic enforcement that tool_choice is meant to replace."
        },
        {
          "id": "P8-S5-Q14",
          "domain": 4,
          "task": "4.6",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart's single-pass CI review of a 16-file pull request flags a retry pattern as risky in one file while approving the identical pattern in another file within the same PR, and misses an obvious bug in a file reviewed late in the pass. What is the most effective restructuring?",
          "options": [
            {
              "key": "A",
              "text": "Require the PR to be split into smaller PRs of 2-3 files before review runs, assuming smaller diffs alone prevent attention dilution even though each file is still reviewed in isolated passes."
            },
            {
              "key": "B",
              "text": "Run the single-pass review three times and keep only the findings common to all three runs."
            },
            {
              "key": "C",
              "text": "Switch to a model with a larger context window so all 16 files receive equal attention in one pass."
            },
            {
              "key": "D",
              "text": "Split the review into per-file passes for local issues, followed by a separate integration pass examining cross-file consistency and data flow."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Splitting into focused per-file passes plus a separate integration pass directly addresses attention dilution, which is the root cause of inconsistent depth and contradictory findings across files in a single large pass. Forcing smaller PRs shifts the burden onto developers rather than fixing the review process, requiring consensus across repeated runs risks suppressing real but intermittently-caught bugs, and a larger context window doesn't by itself fix attention quality across many files."
        },
        {
          "id": "P8-S5-Q15",
          "domain": 4,
          "task": "4.4",
          "type": "single",
          "select": 1,
          "stem": "SwiftCart wants to systematically analyze which code constructs trigger the most frequently dismissed (\"not a bug\") findings from its CI review, so the team can prioritize prompt improvements for the noisiest categories. What should the structured finding output include to enable this analysis?",
          "options": [
            {
              "key": "A",
              "text": "A detected_pattern field identifying which specific code construct triggered each finding, so dismissal patterns can be tracked and analyzed systematically."
            },
            {
              "key": "B",
              "text": "A free-text \"notes\" field where reviewers can write whatever they think is relevant."
            },
            {
              "key": "C",
              "text": "Only the file name and line number, since the pattern can always be inferred later from the diff."
            },
            {
              "key": "D",
              "text": "A binary \"valid\" or \"invalid\" flag set automatically based on how long ago the finding was generated, on the assumption that older findings are inherently more likely to have been correctly triaged."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "A dedicated detected_pattern field makes it possible to systematically group and analyze which specific constructs drive dismissals. An unstructured notes field doesn't support systematic analysis, inferring the pattern later from the diff adds unnecessary manual effort, and a flag based on finding age has no relationship to whether the finding was actually a false positive."
        }
      ]
    },
    {
      "id": 6,
      "title": "Structured Data Extraction",
      "description": "You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.",
      "questions": [
        {
          "id": "P8-S6-Q1",
          "domain": 1,
          "task": "1.5",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's extraction pipeline calls a document-parsing tool that returns dates in three different raw formats depending on the source payroll system (MM/DD/YYYY, DD-MM-YYYY, and Unix timestamps), and the downstream validation step frequently misinterprets which format applies, corrupting pay-period dates. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a prompt instruction asking the model to \"carefully determine the date format\" before extracting."
            },
            {
              "key": "B",
              "text": "Add a hook that normalizes all three date formats into a single consistent format immediately after parsing, before the extraction schema validation runs."
            },
            {
              "key": "C",
              "text": "Reject any document where the date format cannot be immediately identified."
            },
            {
              "key": "D",
              "text": "Increase max_tokens so the model has more room to reason about ambiguous dates."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Normalizing the heterogeneous date formats deterministically at the data layer removes the ambiguity before validation ever sees it, which is more reliable than asking the model to interpret three different formats correctly every time. Rejecting ambiguous documents discards legitimate data unnecessarily, and more reasoning room doesn't resolve a structural format inconsistency."
        },
        {
          "id": "P8-S6-Q2",
          "domain": 1,
          "task": "1.1",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's extraction agent uses a tool-calling loop: it calls an extract_fields tool, inspects the result, and may call a validate_schema tool before finishing. The current implementation decides whether to keep looping based on whether the assistant's text mentions the word \"complete,\" which occasionally causes it to stop before validation has actually run. What is the correct fix?",
          "options": [
            {
              "key": "A",
              "text": "Add more keyword variants like \"finished,\" \"validated,\" and \"submitted\" to the detection list."
            },
            {
              "key": "B",
              "text": "Set a fixed cap of exactly 2 tool calls per document to guarantee validation always runs."
            },
            {
              "key": "C",
              "text": "Continue the loop based on stop_reason equaling \"tool_use\" and only finish when stop_reason equals \"end_turn\", rather than scanning text for keywords."
            },
            {
              "key": "D",
              "text": "Require the model to output a special emoji when it believes extraction is complete, on the assumption that a distinctive emoji marker is less likely to appear accidentally than a plain keyword."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "stop_reason is the structured, reliable signal for whether another tool call is coming, unlike scanning generated text for particular words. Adding more keywords only patches specific failure cases, a fixed call cap of exactly 2 assumes every document needs the same number of steps, and requiring an emoji marker still depends on parsing generated text rather than the API's own field."
        },
        {
          "id": "P8-S6-Q3",
          "domain": 2,
          "task": "2.1",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's extraction pipeline exposes two tools, extract_paystub_fields and extract_expense_fields, both described only as \"Extracts fields from a document.\" The model frequently calls the wrong one when processing expense reimbursement receipts. What is the most effective first step?",
          "options": [
            {
              "key": "A",
              "text": "Merge both tools into a single generic extract_fields tool with a shared schema."
            },
            {
              "key": "B",
              "text": "Add a preprocessing classifier that guesses document type by filename extension alone."
            },
            {
              "key": "C",
              "text": "Remove extract_expense_fields since most documents are paystubs."
            },
            {
              "key": "D",
              "text": "Rewrite each tool's description with specific input document types, example field sets, and explicit boundaries distinguishing the two."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Improving minimal, overlapping tool descriptions is the lowest-effort, highest-leverage fix for selection confusion between similarly-named tools. Merging the tools into one generic tool with a shared schema loses the field-specific structure each document type needs, guessing by filename extension alone is unreliable, and removing a tool entirely discards functionality instead of fixing the description problem."
        },
        {
          "id": "P8-S6-Q4",
          "domain": 2,
          "task": "2.2",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's record-lookup tool returns the same empty array whenever a timesheet query finds zero matching records and whenever the underlying service is temporarily unreachable, giving the extraction agent no way to tell a legitimate \"no records this period\" result from a failed lookup that should be retried. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Return structured responses that distinguish access failures, which need a retry decision, from valid empty results, which represent a successful query that legitimately found nothing."
            },
            {
              "key": "B",
              "text": "Always retry the lookup exactly twice before accepting any empty array as final."
            },
            {
              "key": "C",
              "text": "Treat every empty array as a successful \"no records\" result to simplify downstream logic."
            },
            {
              "key": "D",
              "text": "Log the raw HTTP response code internally but keep returning an identical empty array to the agent."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Distinguishing access failures from valid empty results gives the agent the information it needs to decide whether to retry, which is exactly the missing context today. Blindly retrying twice wastes effort when the result is legitimately empty, treating every empty array as success silently masks real failures, and logging internally without exposing the distinction to the agent doesn't change what the agent can act on."
        },
        {
          "id": "P8-S6-Q5",
          "domain": 2,
          "task": "2.4",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's extraction agent repeatedly makes exploratory tool calls just to discover which payroll document types and field schemas are available before it can decide how to process a batch, adding unnecessary latency to every run. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Add a new tool that must be called first on every run to list available document types."
            },
            {
              "key": "B",
              "text": "Expose the available document types and field schemas as an MCP resource, giving the agent visibility into the catalog without requiring exploratory tool calls."
            },
            {
              "key": "C",
              "text": "Hardcode the list of document types directly into the system prompt and update it manually whenever it changes."
            },
            {
              "key": "D",
              "text": "Instruct the agent to guess the document type from the file extension alone, on the assumption that file extensions reliably correspond to a single document type across every payroll system."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "MCP resources are designed precisely to expose a content catalog so agents have visibility into available data without exploratory calls. A dedicated listing tool still requires an extra call every run, hardcoding a list into the prompt creates a maintenance burden and drift risk, and guessing by file extension alone is unreliable."
        },
        {
          "id": "P8-S6-Q6",
          "domain": 3,
          "task": "3.6",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's engineering team uses Claude Code to generate tests for the extraction pipeline's codebase, but the generated tests frequently miss important edge cases, such as documents with missing fields, because the testing standards and available fixture documents aren't documented anywhere Claude Code can see them. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Ask the engineer to manually review and rewrite every generated test after the fact."
            },
            {
              "key": "B",
              "text": "Increase the number of test files generated per run to improve the odds of coverage."
            },
            {
              "key": "C",
              "text": "Document testing standards, valuable test criteria, and available fixture documents in CLAUDE.md so Claude Code can reference them when generating tests."
            },
            {
              "key": "D",
              "text": "Switch to a different model specifically because it has a larger context window, under the assumption that more context capacity alone compensates for undocumented testing standards."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "Documenting testing standards and available fixtures in CLAUDE.md gives Claude Code the project context it needs to generate higher-quality, more complete tests. Manual rewriting after the fact doesn't scale and doesn't improve generation itself, generating more volume without better guidance doesn't ensure edge cases are covered, and a larger context window doesn't substitute for missing project-specific context."
        },
        {
          "id": "P8-S6-Q7",
          "domain": 4,
          "task": "4.3",
          "type": "single",
          "select": 1,
          "stem": "Paycentric switched its extraction step from free-form JSON generation to tool_use with a strict JSON schema, eliminating malformed JSON output entirely. However, a new class of errors still appears: extracted line-item amounts occasionally don't sum to the stated total, and some values land in the wrong field despite valid JSON structure. What does this indicate?",
          "options": [
            {
              "key": "A",
              "text": "The schema itself is malformed and needs to be rewritten from scratch."
            },
            {
              "key": "B",
              "text": "tool_choice must be switched from \"auto\" to \"any\" to fix the remaining errors."
            },
            {
              "key": "C",
              "text": "The model needs a larger context window to correctly sum line items, assuming arithmetic consistency across extracted fields is primarily a function of surrounding text retained."
            },
            {
              "key": "D",
              "text": "Tool use with JSON schemas eliminates syntax errors but does not prevent semantic errors, which require a separate validation step."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Strict schemas guarantee syntactic validity but cannot guarantee semantic correctness, such as totals that don't reconcile, which is exactly the pattern observed here and requires an additional validation layer. The schema isn't necessarily malformed just because semantic errors occur, changing tool_choice doesn't address semantic validation, and a bigger context window has no bearing on arithmetic consistency checks."
        },
        {
          "id": "P8-S6-Q8",
          "domain": 4,
          "task": "4.3",
          "type": "single",
          "select": 1,
          "stem": "Some Paycentric pay-stub documents don't include an \"employer tax ID\" field at all, but the extraction schema currently marks that field as required, and the model frequently fabricates a plausible-looking ID rather than leaving it blank. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Make the employer tax ID field optional/nullable in the schema, so the model can return null when the information is genuinely absent from the source document."
            },
            {
              "key": "B",
              "text": "Add an instruction telling the model \"never make up values,\" while keeping the field required."
            },
            {
              "key": "C",
              "text": "Remove the field from the schema entirely so it's never extracted."
            },
            {
              "key": "D",
              "text": "Add a retry loop that asks the model to try again whenever the field is missing, assuming repeated attempts will surface a plausible tax ID even when the document never contained one."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Making a field genuinely optional/nullable removes the pressure that a required field creates for the model to fabricate a plausible value just to satisfy the schema. An instruction not to fabricate values conflicts directly with a still-required field, removing the field entirely loses it for documents where it is present, and retrying won't produce information that was never in the source document to begin with."
        },
        {
          "id": "P8-S6-Q9",
          "domain": 4,
          "task": "4.4",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's validation step flags an extraction where the stated total ($1,245.00) doesn't match the sum of line items ($1,180.00), and separately flags a different extraction missing a \"department code\" field that simply isn't present anywhere in that particular document. The team wants to apply retries efficiently. What is the most effective approach?",
          "options": [
            {
              "key": "A",
              "text": "Retry both cases identically with the same generic \"please fix the extraction\" instruction."
            },
            {
              "key": "B",
              "text": "Retry the total-mismatch case with the specific validation error included in the follow-up prompt, since it's a format/calculation discrepancy; accept null for the missing department code, since retries cannot recover information absent from the source."
            },
            {
              "key": "C",
              "text": "Retry neither case, since any validation failure indicates the document should be rejected entirely."
            },
            {
              "key": "D",
              "text": "Retry only the missing field case, since totals can always be recalculated automatically without model involvement, assuming a simple arithmetic pass can always reconstruct the correct total even when the original line-item extractions were themselves wrong."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Retries are effective for discrepancies the model can actually correct, like a sum mismatch, but ineffective when the needed information is simply absent from the source document. Treating both failures identically ignores this distinction, rejecting every validation failure discards recoverable documents unnecessarily, and assuming totals can always be recalculated automatically ignores that the original line items themselves may be what's wrong."
        },
        {
          "id": "P8-S6-Q10",
          "domain": 4,
          "task": "4.3",
          "type": "multiple",
          "select": 2,
          "stem": "Paycentric's extraction schema currently forces every \"payment method\" field into one of three enum values (check, direct_deposit, wire), but some source documents describe payment methods that don't fit cleanly, such as \"partial direct deposit with remainder by check,\" causing the model to force an inaccurate single value. The team also wants ambiguous documents overall to be handled more consistently. Which TWO schema or prompt changes would most directly address this? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "Instruct the model to \"pick whichever enum value seems closest\" when the exact method isn't listed, on the assumption that approximate matching preserves enough accuracy for downstream payroll reconciliation."
            },
            {
              "key": "B",
              "text": "Remove the payment method field from the schema entirely to avoid the issue."
            },
            {
              "key": "C",
              "text": "Add a generic instruction to \"be conservative\" when selecting an enum value."
            },
            {
              "key": "D",
              "text": "Add an \"other\" enum value paired with a free-text detail field to capture payment methods that don't fit the predefined categories."
            },
            {
              "key": "E",
              "text": "Add an \"unclear\" enum value for cases where the payment method genuinely cannot be determined from the document."
            }
          ],
          "correct": [
            "D",
            "E"
          ],
          "explanation": "An \"other\" plus detail field and an explicit \"unclear\" value are the extensible enum patterns that let the schema represent cases that don't fit predefined categories without forcing an inaccurate choice. Picking the closest value still produces an inaccurate record, removing the field entirely loses useful information for the majority of documents that do fit cleanly, and a vague \"be conservative\" instruction doesn't give the model a concrete way to represent ambiguity."
        },
        {
          "id": "P8-S6-Q11",
          "domain": 4,
          "task": "4.5",
          "type": "multiple",
          "select": 2,
          "stem": "Paycentric runs two Claude-powered workflows: (1) a nightly audit reconciling the past day's extracted timesheet data against payroll records, and (2) a same-session check that must complete before a single urgent manual payroll correction can be submitted by an HR specialist who is waiting. Which TWO statements correctly guide how to apply the Message Batches API here? (Select TWO.)",
          "options": [
            {
              "key": "A",
              "text": "The blocking manual-correction check should keep using synchronous calls, since the Batches API offers no guaranteed latency SLA within its up-to-24-hour window."
            },
            {
              "key": "B",
              "text": "Both workflows should move to the Batches API, correlating requests and responses using custom_id."
            },
            {
              "key": "C",
              "text": "The blocking check can safely use the Batches API as long as a short polling interval is used."
            },
            {
              "key": "D",
              "text": "The Batches API supports multi-turn tool calling, so the blocking check can execute tools mid-request and return results immediately, treating asynchronous batch processing as equivalent to a synchronous request-response cycle."
            },
            {
              "key": "E",
              "text": "The nightly reconciliation audit is a good fit for the Batches API since it is latency-tolerant and benefits from the 50% cost savings."
            }
          ],
          "correct": [
            "A",
            "E"
          ],
          "explanation": "Matching each workflow to its latency tolerance is the correct approach: the overnight audit benefits from batch savings, while the blocking check needs a guaranteed-latency synchronous call. Moving both to batch ignores that the blocking workflow cannot tolerate batch delays, a short polling interval doesn't change the lack of an SLA guarantee, and the Batches API does not support multi-turn tool calling within a single request at all."
        },
        {
          "id": "P8-S6-Q12",
          "domain": 5,
          "task": "5.5",
          "type": "single",
          "select": 1,
          "stem": "Paycentric reports 97% overall extraction accuracy across all document types and decides this is sufficient to eliminate human review entirely. Three months later, a client discovers that a specific document type, handwritten expense receipts, has only 61% field-level accuracy, hidden within the aggregate number by the much larger volume of standard digital pay stubs. What should have been done before removing human review?",
          "options": [
            {
              "key": "A",
              "text": "Trust the 97% aggregate figure, since it already reflects performance across the full document mix."
            },
            {
              "key": "B",
              "text": "Increase the overall sample size used to calculate the aggregate accuracy figure."
            },
            {
              "key": "C",
              "text": "Analyze accuracy broken down by document type and field segment to verify consistent performance across all segments before reducing review."
            },
            {
              "key": "D",
              "text": "Switch to a larger context window model, assuming accuracy issues stem from truncated documents rather than checking whether errors cluster around a specific document type."
            }
          ],
          "correct": [
            "C"
          ],
          "explanation": "A single aggregate accuracy number can mask weak performance on a specific document type or field, which is exactly what happened here, so segment-level analysis is required before relying on an overall figure. Trusting the aggregate figure is the mistake that caused the problem, a larger overall sample size doesn't reveal segment-specific weaknesses on its own, and assuming the cause is context truncation is unsupported speculation rather than a diagnosed fix."
        },
        {
          "id": "P8-S6-Q13",
          "domain": 5,
          "task": "5.5",
          "type": "single",
          "select": 1,
          "stem": "Paycentric's extraction model outputs a raw self-reported confidence number (0-100) alongside each field, but the team has never checked whether a \"confidence: 90\" field is actually correct 90% of the time, and reviewers currently just eyeball which fields \"look risky.\" What is the most effective way to use these confidence scores for review routing?",
          "options": [
            {
              "key": "A",
              "text": "Route every field with confidence below 100 to human review, to be maximally safe."
            },
            {
              "key": "B",
              "text": "Ignore the confidence scores entirely and have reviewers check a fixed random 1% of all fields."
            },
            {
              "key": "C",
              "text": "Ask the model to simply state \"I am confident\" or \"I am not confident\" instead of a numeric score, to simplify triage."
            },
            {
              "key": "D",
              "text": "Calibrate the confidence scores against a labeled validation set to determine the actual accuracy associated with each confidence range, then set review thresholds based on that calibration."
            }
          ],
          "correct": [
            "D"
          ],
          "explanation": "Confidence scores are only useful for routing once they're calibrated against labeled, known-accurate data, since an uncalibrated score may not reflect actual correctness rates at all. Routing everything below 100 to review defeats the purpose of having confidence scores, a fixed 1% random sample ignores the confidence information entirely, and collapsing to a binary label loses the granularity needed for threshold-based routing."
        },
        {
          "id": "P8-S6-Q14",
          "domain": 5,
          "task": "5.5",
          "type": "single",
          "select": 1,
          "stem": "Paycentric only routes low-confidence extractions to human review, assuming high-confidence extractions are reliably correct. Several months later, a new payroll-system vendor introduces a document format that the model consistently extracts with high confidence but is subtly wrong on a specific field, and this error pattern goes undetected for weeks because no high-confidence extractions are ever reviewed. What should be added to catch this earlier?",
          "options": [
            {
              "key": "A",
              "text": "Implement stratified random sampling of high-confidence extractions for ongoing error-rate measurement, to detect novel error patterns that confidence scores alone would miss."
            },
            {
              "key": "B",
              "text": "Lower the confidence threshold required to skip review, so fewer extractions qualify as \"high-confidence.\""
            },
            {
              "key": "C",
              "text": "Retrain the confidence-scoring logic every time a new vendor format is introduced, under the assumption that reacting after each new format arrives will catch errors before weeks pass undetected."
            },
            {
              "key": "D",
              "text": "Require two independent extractions of every document and compare them for a perfect match."
            }
          ],
          "correct": [
            "A"
          ],
          "explanation": "Stratified sampling of even high-confidence extractions is what surfaces novel error patterns that the confidence score itself fails to flag, which is exactly the blind spot described here. Lowering the threshold only shifts which extractions are labeled low-confidence without detecting errors within the high-confidence group, retraining reactively per vendor doesn't catch problems before they're known, and requiring two extractions to match doesn't catch a systematic error both runs would share."
        },
        {
          "id": "P8-S6-Q15",
          "domain": 5,
          "task": "5.5",
          "type": "single",
          "select": 1,
          "stem": "A specific Paycentric pay-stub document contains two different gross-pay figures in different sections that contradict each other, likely due to a mid-period correction by the source payroll system. The extraction model picks one of the two values and reports high confidence, with no indication to downstream systems that the source document itself was contradictory. What is the most effective fix?",
          "options": [
            {
              "key": "A",
              "text": "Always average the two conflicting values to produce a single reconciled figure automatically, assuming the midpoint between two contradictory source figures is itself a meaningful gross-pay value."
            },
            {
              "key": "B",
              "text": "Detect contradictory values within a source document and route it to human review rather than having the model silently pick one value and report high confidence."
            },
            {
              "key": "C",
              "text": "Keep the current behavior, since the model's confidence score already reflects the uncertainty."
            },
            {
              "key": "D",
              "text": "Reject the document type entirely, since gross-pay contradictions indicate an unsupported format."
            }
          ],
          "correct": [
            "B"
          ],
          "explanation": "Routing genuinely ambiguous or contradictory source documents to human review is the correct response, rather than silently auto-accepting one of two conflicting values. Averaging the values can produce a number that matches neither original figure and may be meaningless, the model's confidence score in this case was shown to be unreliable since it reported high confidence despite the contradiction, and rejecting the entire document type is an overreaction to what may be an isolated data quality issue."
        }
      ]
    }
  ]
});
