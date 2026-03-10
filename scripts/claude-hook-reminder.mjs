#!/usr/bin/env node

import { execSync } from "node:child_process";

function parseEventArg() {
  const idx = process.argv.indexOf("--event");
  if (idx === -1 || idx + 1 >= process.argv.length) {
    return "";
  }
  return process.argv[idx + 1];
}

function hasMeaningfulChanges() {
  try {
    const output = execSync("git status --porcelain", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
    const lines = output.split("\n").filter((line) => line.trim().length > 0);

    return lines.some((line) => {
      const pathChunk = line.slice(3).trim();
      const normalizedPath = pathChunk.includes("->")
        ? pathChunk.split("->").pop().trim()
        : pathChunk;
      return (
        normalizedPath.length > 0 &&
        !normalizedPath.startsWith("docs/") &&
        !normalizedPath.startsWith(".cursor/") &&
        !normalizedPath.startsWith(".claude/")
      );
    });
  } catch {
    return false;
  }
}

const eventName = parseEventArg();

if (eventName === "SessionStart") {
  console.log(
    "[libra-skills] Before planning/building, orient to Libra docs: docs/decisions/INDEX.md, docs/specs/INDEX.md, docs/design/INDEX.md, docs/plans/INDEX.md."
  );
  process.exit(0);
}

if (eventName === "TaskCompleted" || eventName === "SessionEnd") {
  if (hasMeaningfulChanges()) {
    console.log(
      "[libra-skills] Meaningful non-doc changes detected. Consider running /libra-skills:update-libra to sync docs."
    );
  }
  process.exit(0);
}

process.exit(0);
