# libra-skills

Cursor plugin that gives any project:

1. **`/init-libra`** — conversational onboarding that scaffolds a `/docs` structure by reading the codebase and asking about vision and domain. Same output as the MCP `init_repo` tool; writes directly to disk (no PR).
2. **Rules + `update-libra` skill** — keeps `/docs` current as code evolves. A **docs rule** (always on) gives project docs orientation, and an **update-libra rule** (always on) tells the agent when to run the update-libra skill **in-stream** (same conversation): when the user asks, or at end of session **only if** there are meaningful changes (tracked changes outside `docs/`, `.cursor/`). The skill follows Libra's docs conventions (`decisions/`, `specs/`, `design/`, `plans/`, frontmatter, and `INDEX.md`). No sessionStart/beforeSubmitPrompt/stop hooks; rules are the only context source.

No MCP server, no API keys, no config.

## Installation

**From marketplace (when published):**

```
/plugin install libra-skills@ctoouli
```

**Local development (no marketplace):** Cursor doesn’t have a “load from folder” option. To test before publishing, run from the repo root:

```bash
./scripts/install-local.sh
```

Then **restart Cursor** (quit and reopen). The script copies the plugin to `~/.cursor/plugins/libra-skills` and registers it in `~/.claude/plugins/installed_plugins.json` and `~/.claude/settings.json`. If your Cursor build has **Settings → Features → “Include third-party Plugins, Skills, and other configs”**, turn it on. ([Details](https://medium.com/@v.tajzich/how-to-write-and-test-cursor-plugins-locally-the-part-the-docs-dont-tell-you-4eee705d7f76))

## Usage

1. Run **`/init-libra`** once to scaffold `docs/` plus root `AGENTS.md` and `ARCHITECTURE.md`.
2. Use the agent as usual; the **update-libra rule** will prompt the agent to run the **update-libra** skill in-stream when there are meaningful changes to record (or when you ask to sync docs).
3. Optional: enable auto-commit for `/docs` edits via `LIBRA_AUTOCOMMIT=1` (see Hooks below).

## Rules

- **`rules/libra-docs.mdc`** (always on): project docs orientation and how to use Libra docs during a conversation (what lives under `docs/decisions`, `docs/specs`, `docs/design`, `docs/plans`; skim relevant pieces early; use docs to guide behavior and language).
- **`rules/update-libra.mdc`** (always on): when to run the update-libra skill **in-stream** (when the user asks or at end of session, only if there are meaningful changes; checks `git status` to decide).

## Hooks

- **afterFileEdit** — `libra-autocommit.ts`: opt-in; when `LIBRA_AUTOCOMMIT=1`, runs `git add` and `git commit` for edits under `docs/`.

### Optional env overrides

- `LIBRA_AUTOCOMMIT` — set to `1` or `true` to enable auto-commit for `docs/` file edits.

## Requirements

- [Bun](https://bun.sh) (for hook scripts). Install with `curl -fsSL https://bun.sh/install | bash`.

## License

MIT
