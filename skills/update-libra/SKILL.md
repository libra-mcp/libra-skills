---
name: update-libra
description: Syncs project docs (docs/, exec-plans, product-specs, DECISIONS) after meaningful conversations. Use when the user asks to sync docs, or at end of session when the conversation produced decisions, constraints, scope changes, or progress worth recording.
---

# update-libra

Single-purpose workflow: keep `/docs` current. Run **in-stream** as part of the current conversation.

## Step 1 — Determine what changed

Review the conversation. Identify anything in these categories:
- Architectural or technical decisions (new or changed)
- Feature scope additions, removals, or pivots
- Constraints a coding agent must respect
- Open questions that are unresolved but relevant to upcoming work
- Exec plan progress (tasks completed, new tasks, phase changes)

If nothing in the conversation falls into these categories, respond briefly ("Nothing to sync") and stop.

## Step 2 — Read before writing

For each doc you plan to update, call `Libra:read_doc` first. Never write a doc without reading it — you will lose existing content.

Always read:
- `DECISIONS.md` if you're adding or updating any decision
- The specific ADR file if you're superseding an existing one
- The active exec plan if any tasks changed status

## Step 3 — Write only what changed

Make surgical edits — do not rewrite unchanged sections. Build the full updated file content in memory, then present it to the user for review.

**For new ADRs:**
- New file at `docs/decisions/adr-NNN-[slug].md` — format: context → options considered → decision → rationale → consequences
- Update `docs/DECISIONS.md` index table with the new entry
- ADR numbers are sequential — check the index for the next number

**For exec plan updates:**
- Mark completed tasks `[x]`
- Add new tasks if scope changed
- Update phase status if it changed

**For new or updated product specs:**
- Create or update `docs/product-specs/[feature-name].md`
- Update `docs/product-specs/index.md`

**Doc format:**
```
# [Title]

**Last updated:** [date]
**Status:** [Draft | Active | Superseded]

## Summary
One paragraph. What is this? Why does it exist?

## [Relevant sections]

## Open questions
- [ ] Unresolved questions
```

Keep docs under 300 lines. High-signal, short, cross-linked.

## Rules

- Read every doc before writing it
- Only modify files under `docs/`
- Do not create new doc paths without updating the relevant index file
- When done, summarize what was updated and why
