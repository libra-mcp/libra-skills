# Changelog

All notable changes to `libra-skills` are documented in this file.

## 1.0.0 - 2026-03-10

- Added Claude Code plugin manifest at `.claude-plugin/plugin.json`.
- Added public marketplace definition at `.claude-plugin/marketplace.json` for `libra-mcp`.
- Added hybrid Claude hook reminders via `hooks/hooks.json`:
  - `SessionStart` docs orientation reminder
  - `TaskCompleted` docs-sync reminder/check
  - `SessionEnd` docs-sync reminder/check
- Added hook helper script at `scripts/claude-hook-reminder.mjs`.
- Updated docs and specs for dual Cursor + Claude Code support:
  - `README.md`
  - `product-specs/cursor-integration.md`
- Updated docs/rules text to remove Cursor-only assumptions in shared content:
  - `rules/libra-docs.mdc`
  - `rules/update-libra.mdc`
  - `skills/update-libra/SKILL.md`
- Expanded validation coverage in `scripts/validate-plugin.mjs`:
  - validates both Cursor and Claude plugin manifests
  - validates marketplace JSON structure and expected plugin entry
  - validates required hook script and skill/rule frontmatter
- Updated local install script to include Claude plugin artifacts (`.claude-plugin`) and scripts.

## Follow-ups (v1.1+)

- Optional non-namespaced aliases for Claude Code command ergonomics.
- Evaluate stronger automated docs-sync behavior (beyond reminder/check model).
- Add dedicated Claude Code integration spec file if behavior diverges further from Cursor.
