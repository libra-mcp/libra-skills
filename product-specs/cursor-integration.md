# Cursor integration (libra-skills)

Minimal spec for the libra-skills plugin: rules-driven orientation and update-libra (in-stream), and hook contracts.

## Rules (orientation + when to run update-libra)

1. **Docs rule** (`rules/libra-docs.mdc`, alwaysApply): project docs orientation (Libra-style docs under `docs/`, exec-plans, product-specs, DECISIONS) and guidance on how to use them (skim relevant docs early, use them to guide behavior and language, surface gaps).
2. **Update-libra rule** (`rules/update-libra.mdc`, alwaysApply): when to run the update-libra skill in-stream (user asks, or end of session only if there are meaningful changes, determined via `git status`).

## Rule-driven update-libra (in-stream)

1. There is **no stop hook**. Doc sync is triggered by the **update-libra rule** (`rules/update-libra.mdc`) that runs every time (alwaysApply).
2. The update-libra rule tells the agent: run the **update-libra** skill **as a continuation of the same conversation** (in-stream), not as a new message. Run it when the user asks to sync docs, or at the end of a session—but **only if there are meaningful changes** (tracked changes outside `docs/`, `exec-plans/`, `product-specs/`, `.cursor/`). The agent checks with `git status` before deciding to run the skill.
3. The **update-libra** skill (in `skills/update-libra/SKILL.md`) describes when to run and includes a first step: check for meaningful changes; if none, respond briefly and set the isLibraRun marker without editing docs.
4. This keeps doc sync in the same message stream and avoids a separate followup message. The agent runs the skill when appropriate, guided by the rule and the skill’s “when to run” section.

## afterFileEdit (opt-in autocommit)

- Only runs when `LIBRA_AUTOCOMMIT=1` (or `true`).
- Input: `{ "file_path": "<absolute path>", "edits": [...] }`. If `file_path` is under workspace `docs/`, run `git add` and `git commit -m "docs: libra sync"`.
- Fail open: any error is ignored so the edit is not blocked.

## Hooks (remaining)

- Only **afterFileEdit** is used (opt-in autocommit for `docs/`). No sessionStart or beforeSubmitPrompt; orientation comes from the **libra-docs** rule and update-libra guidance comes from the **update-libra** rule.
