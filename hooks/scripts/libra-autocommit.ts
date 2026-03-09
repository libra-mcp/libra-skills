/**
 * afterFileEdit hook: optional auto-commit for edits under docs/.
 * Opt-in via LIBRA_AUTOCOMMIT=1. Only adds the edited path and optionally commits; no force push, no git add .
 */

import { existsSync } from "node:fs";
import { resolve, relative } from "node:path";
import { spawn } from "node:child_process";

async function readStdin(): Promise<string> {
  const { stdin } = await import("bun");
  return stdin.text();
}

function runGit(args: string[], cwd: string): Promise<{ code: number | null }> {
  return new Promise((resolvePromise) => {
    const child = spawn("git", args, { cwd, stdio: "ignore" });
    child.on("close", (code) => resolvePromise({ code }));
  });
}

async function main(): Promise<void> {
  try {
    const text = await readStdin();
    const payload = JSON.parse(text) as { file_path?: string };
    const filePath = payload.file_path;
    if (!filePath || typeof filePath !== "string") return;

    if (process.env.LIBRA_AUTOCOMMIT !== "1" && process.env.LIBRA_AUTOCOMMIT !== "true") {
      return;
    }

    const cwd = process.cwd();
    const docsDir = resolve(cwd, "docs");
    if (!existsSync(docsDir)) return;

    const abs = resolve(filePath);
    const normalizedDocs = resolve(docsDir);
    if (!abs.startsWith(normalizedDocs)) return;

    const rel = relative(cwd, abs);
    await runGit(["add", "--", rel], cwd);
    await runGit(["commit", "-m", "docs: libra sync"], cwd);
  } catch {
    // Fail open: do not block the edit
  }
}

await main();
