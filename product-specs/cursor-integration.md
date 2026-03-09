# Cursor integration (libra-skills)

Minimal spec for the libra-skills plugin: session context injection, stop hook → libra-update flow, and hook contracts.

## sessionStart (context injection)

1. When a **new composer conversation** is created, the hook script `libra-session-start.ts` runs.
2. It outputs `{ "additional_context": "..." }` with a short orientation to project docs (`docs/`, exec-plans, product-specs, DECISIONS) and the libra-update flow.
3. Cursor adds this to the conversation’s **initial system context**, so the agent sees it from the first turn. No per-prompt injection (beforeSubmitPrompt cannot inject; only block or allow).

## Stop hook → libra-update

1. On **stop** (agent loop ends), the hook script `libra-stop.ts` runs with CWD = workspace root.
2. It reads state from `.cursor/hooks/state/libra-update.json` (last run time, turns since last run).
3. Cadence: when `status === "completed"`, and `turnsSinceLastRun >= LIBRA_UPDATE_MIN_TURNS`, and `minutesSinceLastRun >= LIBRA_UPDATE_MIN_MINUTES`, the script outputs `{ "followup_message": "..." }`.
4. The follow-up message instructs the agent to run the **libra-update** skill: diff what changed, read relevant docs, update them surgically, and set **isLibraRun** when done.
5. The libra-update skill writes a marker (e.g. in state or via reply) so the hook does not loop indefinitely. The stop script does not currently read isLibraRun; cadence (turns + time) prevents rapid re-trigger. Future: script could skip follow-up if the last agent reply indicated "Libra docs synced" or a state file was updated.

## afterFileEdit (opt-in autocommit)

- Only runs when `LIBRA_AUTOCOMMIT=1` (or `true`).
- Input: `{ "file_path": "<absolute path>", "edits": [...] }`. If `file_path` is under workspace `docs/`, run `git add` and `git commit -m "docs: libra sync"`.
- Fail open: any error is ignored so the edit is not blocked.

## beforeSubmitPrompt

- Cannot inject context (Cursor API only allows `continue` and `user_message`). The script always returns `{ "continue": true }`. Orientation to `/docs` is provided by **sessionStart** (initial context) and when the libra-update skill runs or via project rules.
