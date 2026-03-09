/**
 * Stop hook: cadence-checked trigger for libra-update skill.
 * Reads stdin (stop hook JSON), persists state in .cursor/hooks/state/libra-update.json (CWD = workspace root).
 * When cadence is met, outputs { followup_message } so Cursor submits the next user message to run libra-update.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { stdin } from "bun";

const STATE_PATH = resolve(".cursor/hooks/state/libra-update.json");
const DEFAULT_MIN_TURNS = 5;
const DEFAULT_MIN_MINUTES = 10;

interface StopHookInput {
  conversation_id?: string;
  generation_id?: string;
  status?: "completed" | "aborted" | "error" | string;
  loop_count?: number;
}

interface LibraUpdateState {
  version: 1;
  lastRunAtMs: number;
  turnsSinceLastRun: number;
  lastProcessedGenerationId: string | null;
}

function loadState(): LibraUpdateState {
  const fallback: LibraUpdateState = {
    version: 1,
    lastRunAtMs: 0,
    turnsSinceLastRun: 0,
    lastProcessedGenerationId: null,
  };
  if (!existsSync(STATE_PATH)) return fallback;
  try {
    const raw = readFileSync(STATE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LibraUpdateState>;
    if (parsed.version !== 1) return fallback;
    return {
      version: 1,
      lastRunAtMs:
        typeof parsed.lastRunAtMs === "number" && Number.isFinite(parsed.lastRunAtMs)
          ? parsed.lastRunAtMs
          : 0,
      turnsSinceLastRun:
        typeof parsed.turnsSinceLastRun === "number" && parsed.turnsSinceLastRun >= 0
          ? parsed.turnsSinceLastRun
          : 0,
      lastProcessedGenerationId:
        typeof parsed.lastProcessedGenerationId === "string"
          ? parsed.lastProcessedGenerationId
          : null,
    };
  } catch {
    return fallback;
  }
}

function saveState(state: LibraUpdateState): void {
  const dir = dirname(STATE_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

const FOLLOWUP_MESSAGE = `Run the \`libra-update\` skill now. Determine what changed in this session, read the relevant docs (docs/, exec-plans, product-specs, DECISIONS.md), and update them surgically (check off completed tasks, update spec statuses, surface implicit decisions). When done, write the isLibraRun flag so the stop hook does not loop (e.g. set or append to a small marker file or env that the hook script can read next time).`;

async function main(): Promise<number> {
  try {
    const text = await stdin.text();
    const input = JSON.parse(text) as StopHookInput;

    const state = loadState();

    if (
      input.generation_id &&
      input.generation_id === state.lastProcessedGenerationId
    ) {
      console.log(JSON.stringify({}));
      return 0;
    }
    state.lastProcessedGenerationId = input.generation_id ?? null;

    const countedTurn =
      input.status === "completed" && (input.loop_count ?? 0) === 0;
    const turnIncrement = countedTurn ? 1 : 0;
    const turnsSinceLastRun = state.turnsSinceLastRun + turnIncrement;
    const now = Date.now();

    const minTurns = parsePositiveInt(
      process.env.LIBRA_UPDATE_MIN_TURNS,
      DEFAULT_MIN_TURNS
    );
    const minMinutes = parsePositiveInt(
      process.env.LIBRA_UPDATE_MIN_MINUTES,
      DEFAULT_MIN_MINUTES
    );
    const minutesSinceLastRun =
      state.lastRunAtMs > 0
        ? Math.floor((now - state.lastRunAtMs) / 60_000)
        : Number.POSITIVE_INFINITY;

    const shouldTrigger =
      countedTurn &&
      turnsSinceLastRun >= minTurns &&
      minutesSinceLastRun >= minMinutes;

    if (shouldTrigger) {
      state.lastRunAtMs = now;
      state.turnsSinceLastRun = 0;
      saveState(state);
      console.log(JSON.stringify({ followup_message: FOLLOWUP_MESSAGE }));
      return 0;
    }

    state.turnsSinceLastRun = turnsSinceLastRun;
    saveState(state);
    console.log(JSON.stringify({}));
    return 0;
  } catch (error) {
    console.error("[libra-stop] failed", error);
    console.log(JSON.stringify({}));
    return 0;
  }
}

const code = await main();
process.exit(code);
