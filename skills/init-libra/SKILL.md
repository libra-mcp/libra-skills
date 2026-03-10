---
name: init-libra
description: Scaffolds a /docs structure for a project by reading the codebase and asking the developer about vision and domain, then writing Libra doc structure and AGENTS.md directly to disk. Use when the user runs /init-libra or asks to scaffold Libra docs, init project docs, or set up docs structure.
---

# init-libra

Scaffold a `/docs` structure and `AGENTS.md` for a project. Read the codebase
first, reason about what you still don't know, ask only those questions, then
write everything directly to disk. No PR.

---

## Phase 1 — Read and reason

Read the following files if they exist:

- `package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` — name, stack, deps
- `README.md` — description, setup, stated goals
- Entry point files (`main.*`, `index.*`, `app.*`, `server.*`) — what does the
  product actually do at runtime?
- Any existing `docs/`, `AGENTS.md`, `.cursor/rules` — avoid overwriting; note
  what exists

After reading, fill in this checklist internally before moving to Phase 2:

| Question | Can I answer from code? | Answer or "unknown" |
|---|---|---|
| Project name | | |
| Language / stack | | |
| What does the product do? | | |
| Who is it for? | | |
| What phase of dev (exploration / active build / post-launch)? | | |
| Key architectural decisions already visible in code? | | |
| What's the single most important thing a coding agent must know? | | |

Only ask in Phase 2 about rows that say "unknown". If you can answer 6/7 from
the code, ask 1 question, not 5.

---

## Phase 2 — Ask only what code cannot tell you

Ask at most 4 questions. Skip any whose answer you already know.

**Question bank — use only as needed:**

- "What problem does this solve, and who is it for?" — skip if README or
  code makes this clear
- "What phase of development are you in — early exploration, active v1 build,
  or post-launch iteration?" — skip if commit history or README signals this
- "Any key architectural decisions already made that aren't obvious from the
  code?" — e.g. infra choices, explicit non-goals, constraints
- "What's the most important thing a coding agent should know before touching
  this codebase?" — almost always worth asking; agents need orientation, not
  just facts

Do not ask questions you could answer with one more minute of reading the code.
Do not ask for information you will not use in a specific file.

---

## Phase 3 — Write docs

Write the following structure directly to disk. Do not open a PR.
```
docs/
├── PRODUCT_SENSE.md
├── DECISIONS.md
├── decisions/                 ← directory only; no files required yet
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── product-specs/
│   └── index.md
└── exec-plans/
    ├── active/                ← directory only; no files required yet
    └── tech-debt-tracker.md
AGENTS.md                      ← repo root
```

### Content rules

**Rule 1: Never hallucinate.** If you don't know something, use a stub. A stub
is better than plausible-sounding fiction. Mark every stub with `<!-- TODO -->`.

**Rule 2: Populated > stub > blank.** Prefer a real sentence from the codebase
or the user's answers over a stub. Prefer a stub over an empty section.

**Rule 3: Short and accurate beats long and vague.** A 3-sentence PRODUCT_SENSE
that is true is better than 3 paragraphs of marketing language. Coding agents
read these files — they need signal, not padding.

### File specs

#### `PRODUCT_SENSE.md`
The most important file. A coding agent reads this to understand what it is
building and why.

Required sections:
- **What this is** — one paragraph, plain language. What does it do? Who uses it?
- **The problem it solves** — what breaks without this product?
- **What it is NOT** — explicit non-goals; helps agents avoid building the wrong thing
- **Current phase** — exploration / active build / post-launch, and what that means

Good example of a "What this is" section:
> Libra is a context layer for product development. It captures decisions from
> AI chat conversations and writes them as structured markdown docs into a GitHub
> repo. AI coding agents (Cursor, Claude Code) then read those docs as native
> project context. Libra doesn't write code — it makes sure coding agents have
> the right context to write the right code.

Bad example (stub masquerading as content — do not produce this):
> This project is a modern solution for developers who want to improve their
> workflow using cutting-edge AI technology.

If you cannot write a good "What this is" in one paragraph, mark it TODO and
move on. Do not fill space with generic language.

#### `DECISIONS.md`
ADR index. If no ADRs exist yet, write:
```markdown
# Architecture Decision Log

No decisions recorded yet. When an architectural decision is made, add an ADR
file under `docs/decisions/` and link it here.

Format: context → options considered → decision → rationale → consequences.

| ADR | Title | Status |
|-----|-------|--------|
| (none yet) | | |
```

#### `design-docs/core-beliefs.md`
Guiding principles — the decision filters that break ties when two approaches
conflict. These are not aspirational values.

If the user's answers or the codebase give you signal on principles, write them.
Otherwise stub the whole file with:
```
<!-- TODO: fill in with 3–5 guiding principles that govern how this project
is built. These should be specific enough to break a tie, not generic values. -->
```

#### `exec-plans/tech-debt-tracker.md`
Known debt that isn't urgent. If you can infer items from the codebase (e.g.
hardcoded config, missing tests, TODO comments), list them. Otherwise stub.

#### `AGENTS.md` (repo root)
This is the orientation file for coding agents. It must answer four questions:

1. **What am I working on?** — one sentence
2. **What should I read before making any change?** — table of file → purpose
3. **What must I never do?** — 3–5 hard constraints visible from the codebase
   or stated by the developer
4. **Where is the current work?** — point to exec-plans/active/ or equivalent

Structure:
```markdown
# AGENTS.md

You are working on **[project name]** — [one-liner].

## Read first

| You're about to... | Read this first |
|--------------------|-----------------|
| Understand the product | docs/PRODUCT_SENSE.md |
| Make an architectural decision | docs/DECISIONS.md |
| Pick up a task | docs/exec-plans/active/ |
| [add more based on project shape] | |

## Stack

[Language, framework, key dependencies — 3–5 lines max]

## What NOT to do

- [Hard constraint 1 — infer from code or stated by user]
- [Hard constraint 2]
- [Hard constraint 3]
<!-- TODO: add constraints specific to this project -->

## Conventions

<!-- TODO: fill in coding conventions, file structure rules, naming patterns -->
```

---

## Phase 4 — Self-check before summarizing

Before reporting to the user, re-read every file you wrote and check:

- [ ] Does PRODUCT_SENSE.md describe a real, specific product — or generic filler?
- [ ] Does AGENTS.md answer all four orientation questions?
- [ ] Is every unknown section marked `<!-- TODO -->` rather than left blank or
      filled with plausible fiction?
- [ ] Are there any contradictions between files?

Fix anything that fails before proceeding.

---

## Phase 5 — Confirm and summarize

Tell the developer:

1. **Populated files** — what was written from code or their answers
2. **Stub files** — what has `<!-- TODO -->` markers and needs human input
3. **Skipped / preserved** — any existing files you left untouched

---

## If docs/ already exists

List what exists. Then offer two options:

- **Fill gaps** — scaffold only missing files and directories; do not touch
  existing content
- **Refresh** — re-read the codebase and update existing files where they look
  stale or incomplete (ask before overwriting anything)

Default to fill gaps unless the user asks for a refresh.
