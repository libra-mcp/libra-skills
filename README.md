# libra-skills

The context layer for your agents.

Turns AI chat decisions into structured repo docs so Cursor and Claude Code always start with the right context. `init-libra` scaffolds the full structure; `update-libra` keeps it in sync.
```
AGENTS.md
ARCHITECTURE.md

docs/
├── decisions/
│   ├── INDEX.md
│   └── adr-NNN-slug.md
├── specs/
│   ├── INDEX.md
│   └── <feature-slug>.md
├── design/
│   ├── INDEX.md
│   └── core-beliefs.md
└── plans/
    ├── INDEX.md
    ├── active/
    │   └── <plan-slug>.md
    └── completed/
        └── <plan-slug>.md
```

Every doc includes YAML frontmatter. Cross-links use wiki-style notation: `[[adr-005]]`, `[[spec:auth-flow]]`. Index files are always `INDEX.md`.

## Installation

### Claude Code

Add the marketplace to Claude Code (run inside an active `claude` CLI session):

```text
/plugin marketplace add libra-mcp/libra-skills
```

Install the plugin:

```text
/plugin install libra-skills@libra-mcp
```

Restart Claude Code, then run:

```text
/libra-skills:init-libra
```

### Cursor

Local development install from repo root (temporary until `libra-skills` is available in the Cursor plugin marketplace):

```bash
./scripts/install-local.sh
```

Restart Cursor (full quit/reopen), then run:

```text
/init-libra
```

## Usage

### Claude Code commands (v1)

- `/libra-skills:init-libra`
- `/libra-skills:update-libra`

### Cursor commands

- `/init-libra`
- `update-libra` is run in-stream when prompted by rules or when explicitly requested

## Rules and hooks behavior

### Claude Code (hybrid hooks + skills)

- `SessionStart` hook reminder: orient on Libra docs before planning/building
- `TaskCompleted` hook reminder/check: nudge docs sync when meaningful non-doc changes exist
- `SessionEnd` hook reminder/check: nudge docs sync before finishing

In Claude Code v1, hooks are lightweight nudges/checks and do not force doc writes.

### Cursor (rules-first)

- `rules/libra-docs.mdc`: docs orientation (always-on)
- `rules/update-libra.mdc`: when to run docs sync (ask-triggered or session-end with meaningful changes)

## License

MIT
