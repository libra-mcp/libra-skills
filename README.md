# libra-skills

Libra workflows for coding agents across Cursor and Claude Code.

Core capabilities:

1. **Init docs context** via `init-libra`:
   - reads the codebase,
   - asks only missing context questions,
   - scaffolds `docs/` plus root `AGENTS.md` and `ARCHITECTURE.md`.
2. **Keep docs synced** via `update-libra`:
   - captures decisions, scope changes, constraints, progress, and open questions,
   - updates only what changed in `docs/`,
   - preserves Libra conventions (`decisions/`, `specs/`, `design/`, `plans/`, frontmatter, `INDEX.md`).

## Installation

### Claude Code

Marketplace install:

```text
/plugin marketplace add libra-mcp/libra-skills
/plugin install libra-skills@libra-mcp
```

Local plugin testing:

```bash
claude --plugin-dir ./libra-skills
```

### Cursor

Local development install from repo root:

```bash
./scripts/install-local.sh
```

Then restart Cursor (full quit/reopen).

## Usage

### Claude Code commands (v1)

- `/libra-skills:init-libra`
- `/libra-skills:update-libra`

### Cursor commands

- `/init-libra`
- `update-libra` is run in-stream when prompted by rules or when explicitly requested

## Rules and hooks behavior

### Cursor (rules-first)

- `rules/libra-docs.mdc`: docs orientation (always-on)
- `rules/update-libra.mdc`: when to run docs sync (ask-triggered or session-end with meaningful changes)

### Claude Code (hybrid hooks + skills)

- `SessionStart` hook reminder: orient on Libra docs before planning/building
- `TaskCompleted` hook reminder/check: nudge docs sync when meaningful non-doc changes exist
- `SessionEnd` hook reminder/check: nudge docs sync before finishing

In Claude Code v1, hooks are lightweight nudges/checks and do not force doc writes.

## License

MIT
