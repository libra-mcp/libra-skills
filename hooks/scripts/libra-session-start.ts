/**
 * sessionStart hook: injects libra/docs orientation into the conversation's initial system context.
 * Ensures every new chat is aware of project docs (docs/, exec-plans, product-specs, DECISIONS) and the libra-update flow.
 */

import { stdin } from "bun";

const ADDITIONAL_CONTEXT = `This project uses Libra-style docs. When answering, consider checking \`docs/\`, \`exec-plans\`, \`product-specs\`, and \`DECISIONS.md\` as needed; it is up to you whether to read them in depth. When making significant changes, keep these in sync. The \`libra-update\` skill (triggered by the stop hook or on request) diffs changes and updates docs surgically.`;

async function main(): Promise<void> {
  try {
    await stdin.text(); // consume input (session_id, is_background_agent, composer_mode)
    // sessionStart output: { env?: Record<string, string>, additional_context?: string }
    console.log(JSON.stringify({ additional_context: ADDITIONAL_CONTEXT }));
  } catch {
    console.log(JSON.stringify({}));
  }
}

await main();
