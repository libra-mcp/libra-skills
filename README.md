# libra-skills

Cursor plugin that gives any project:

1. **`/init-libra`** — conversational onboarding that scaffolds a `/docs` structure by reading the codebase and asking about vision and domain. Same output as the MCP `init_repo` tool; writes directly to disk (no PR).
2. **Hooks + `libra-update` skill** — keeps `/docs` current as code evolves. Context injected at session start; doc sync after (cadence-checked stop hook).

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

1. Run **`/init-libra`** once to scaffold `docs/` and optionally `AGENTS.md`.
2. Use the agent as usual; the **stop** hook may trigger the **libra-update** skill to sync docs after a session.
3. Optional: enable auto-commit for `/docs` edits via `LIBRA_AUTOCOMMIT=1` (see Hooks below).

## Hooks

- **sessionStart** — `libra-session-start.ts`: injects a short libra/docs orientation into the conversation’s initial system context so every new chat is aware of `docs/`, exec-plans, product-specs, and the libra-update flow.
- **beforeSubmitPrompt** — `libra-context.ts`: allows submission (no context injection; Cursor only supports continue/user_message).
- **stop** — `libra-stop.ts`: cadence-checked; when met, sends a follow-up message so the agent runs the **libra-update** skill. State: `.cursor/hooks/state/libra-update.json`.
- **afterFileEdit** — `libra-autocommit.ts`: opt-in; when `LIBRA_AUTOCOMMIT=1`, runs `git add` and `git commit` for edits under `docs/`.

### Optional env overrides

- `LIBRA_UPDATE_MIN_TURNS` — min completed turns before stop hook can trigger libra-update (default: 5).
- `LIBRA_UPDATE_MIN_MINUTES` — min minutes since last libra-update run (default: 10).
- `LIBRA_AUTOCOMMIT` — set to `1` or `true` to enable auto-commit for `docs/` file edits.

## Requirements

- [Bun](https://bun.sh) (for hook scripts). Install with `curl -fsSL https://bun.sh/install | bash`.

## License

MIT
