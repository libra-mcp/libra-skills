---
name: init-libra
description: Scaffolds a /docs structure for a project by reading the codebase and asking the developer about vision and domain, then writing Libra doc structure and AGENTS.md directly to disk. Use when the user runs /init-libra or asks to scaffold Libra docs, init project docs, or set up docs structure.
---

# init-libra

Scaffold a `/docs` structure and optional `AGENTS.md` for a project that has none. Read the codebase first, ask only what code cannot tell you, then write all docs directly to disk (no PR). Same output shape as MCP `init_repo`.

## Phase 1 — Read the codebase first

Before asking any questions, read the repo and extract what you can:

- **Manifests:** `package.json`, `pyproject.toml`, or `Cargo.toml` — project name, dependencies, tech stack
- **README.md** — existing description, setup instructions
- **Entry points** — main/app files to infer what the product does
- **Existing docs:** `docs/`, `AGENTS.md` if present — avoid overwriting; note what exists

From this pass determine: project name, language/stack, rough architecture, and what is already documented.

## Phase 2 — Ask only what code cannot tell you

Ask at most 4–5 questions. Only ask what cannot be inferred from the codebase. Examples:

- "What problem does this solve, and who is it for?" (vision / target user)
- "What phase of development are you in — early exploration, active v1 build, or post-launch iteration?"
- "Are there any key architectural decisions already made that are not obvious from the code?" (e.g. chosen infra, explicit non-goals)
- "What is the most important thing a coding agent should know before touching this codebase?"

Skip any question whose answer is already clear from the codebase.

## Phase 3 — Write docs

Produce the standard Libra `/docs` structure **directly on disk**. Do not open a PR.

### Required structure

```
docs/
├── PRODUCT_SENSE.md
├── DECISIONS.md
├── decisions/                 (directory; ADR files go here)
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── product-specs/
│   └── index.md
└── exec-plans/
    ├── active/                (directory for current build plan)
    └── tech-debt-tracker.md
```

Also write **`AGENTS.md`** at the repo root if not already present.

### Content rules

- Use stubs with `<!-- TODO: fill in -->` where content is placeholder. Do not leave sections blank or hallucinate content.
- Populate what you can from the codebase (Phase 1) and the user's answers (Phase 2). Mark clearly what is inferred vs stub.
- Quality bar: same as MCP `init_repo` — stubs are explicitly marked, no fake content.

### File purposes

- **PRODUCT_SENSE.md** — Vision, target users, core problems (from Phase 2 and README/code).
- **DECISIONS.md** — ADR index; start empty or with a short "No ADRs yet" note and link to `decisions/`.
- **decisions/** — Directory for individual ADR files (e.g. `001-choose-stack.md`). No file required initially.
- **design-docs/index.md** — Index of design docs.
- **design-docs/core-beliefs.md** — Guiding principles (stub or filled from answers).
- **product-specs/index.md** — Index of product specs.
- **exec-plans/active/** — Directory for current build plan; add a placeholder or index as needed.
- **exec-plans/tech-debt-tracker.md** — Tracker for tech debt items (stub or minimal).
- **AGENTS.md** — Brief orientation for coding agents (project context, key docs to read).

## Phase 4 — Confirm and summarize

After writing, tell the developer:

1. **Which files are stubs** that need filling in (marked with `<!-- TODO: fill in -->`).
2. **Which files were populated** from the codebase or their answers.
3. **How to commit:**  
   `git add docs/ AGENTS.md && git commit -m "docs: init libra"`

## If docs/ already exists

If the project already has a `docs/` directory, offer to **refresh**: scaffold only missing pieces and avoid overwriting existing content unless the user asks. List what exists and what you will add or leave unchanged.
