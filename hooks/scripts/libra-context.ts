/**
 * beforeSubmitPrompt hook: cannot inject context (Cursor only supports continue + user_message).
 * Always allow submission; orientation to /docs is provided by rules or the libra-update skill when relevant.
 */

import { stdin } from "bun";

async function main(): Promise<void> {
  try {
    await stdin.text(); // consume input
    // beforeSubmitPrompt output: { continue?: boolean, user_message?: string }
    // We never block; no user_message.
    console.log(JSON.stringify({ continue: true }));
  } catch {
    console.log(JSON.stringify({ continue: true }));
  }
}

await main();
