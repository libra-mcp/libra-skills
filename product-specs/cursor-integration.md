# Cursor + Claude Code integration (libra-skills)

Minimal spec for the libra-skills plugin across both host environments.

## Cursor: rules (orientation + when to run update-libra)

1. **Docs rule** (`rules/libra-docs.mdc`, alwaysApply): project docs orientation for Libra docs structure (`docs/decisions`, `docs/specs`, `docs/design`, `docs/plans`) and guidance on how to use them (skim relevant docs early, use them to guide behavior and language, surface gaps).
2. **Update-libra rule** (`rules/update-libra.mdc`, alwaysApply): when to run the update-libra skill in-stream (user asks, or end of session only if there are meaningful changes, determined via `git status`).

## Cursor: rule-driven update-libra (in-stream)

1. There is **no stop hook**. Doc sync is triggered by the **update-libra rule** (`rules/update-libra.mdc`) that runs every time (alwaysApply).
2. The update-libra rule tells the agent: run the **update-libra** skill **as a continuation of the same conversation** (in-stream), not as a new message. Run it when the user asks to sync docs, or at the end of a session—but **only if there are meaningful changes** (tracked changes outside `docs/` and `.cursor/`). The agent checks with `git status` before deciding to run the skill.
3. The **update-libra** skill (in `skills/update-libra/SKILL.md`) describes when to run and includes a first step: check for meaningful changes; if none, respond briefly and skip doc writes.
4. This keeps doc sync in the same message stream and avoids a separate followup message. The agent runs the skill when appropriate, guided by the rule and the skill’s “when to run” section.

## Cursor: hooks

- Cursor behavior remains rules-first for orientation and in-stream docs sync guidance.
- No required Cursor autocommit hook contract is part of this v1 cross-platform spec.

## Claude Code: plugin behavior

### Skills

- `init-libra` and `update-libra` are exposed as namespaced skills:
  - `/libra-skills:init-libra`
  - `/libra-skills:update-libra`
- v1 does not provide non-namespaced aliases.

### Hooks

Claude Code uses a hybrid reminder model defined in `hooks/hooks.json`:

1. **SessionStart**: remind the agent to orient using Libra docs indexes before planning/building.
2. **TaskCompleted**: check for meaningful non-doc changes and nudge the agent to run `/libra-skills:update-libra` when appropriate.
3. **SessionEnd**: perform the same reminder/check before session exit.

Hook behavior is intentionally lightweight in v1 (suggest/check only, no forced auto-sync writes).
