---
name: libra-update
description: Syncs project docs (docs/, exec-plans, product-specs, DECISIONS) after code changes. Use when invoked by the stop hook follow-up to run doc sync, or when the user asks to update Libra docs from the last session.
---

# libra-update

Keep `/docs` current after a coding session. Triggered by the **stop** hook (via `followup_message`) or when the user asks to sync docs. Determine what changed, read the relevant docs, update them surgically, then set the **isLibraRun** flag so the stop hook does not re-trigger indefinitely.

## Inputs

- Session context: what files were created or edited in this conversation
- Existing docs: `docs/` (PRODUCT_SENSE.md, DECISIONS.md, design-docs, product-specs, exec-plans)
- Optional: transcript or tool history to infer completed work

## Workflow

1. **Determine what changed**  
   From the conversation/session, identify files that were added or modified (especially under `src/`, app code, or config that affects product or architecture).

2. **Load relevant docs**  
   Read the parts of `docs/` that may need updates: exec-plans (active tasks, tech-debt-tracker), product-specs (status), design-docs, and DECISIONS.md (or decisions/) if architectural decisions were made or surfaced.

3. **Update only what is affected**  
   - **Exec plans:** Check off completed tasks; add or update tech-debt items if new debt was introduced.  
   - **Product specs:** Update status (e.g. Planned → In progress → Shipped) if the session advanced a spec.  
   - **DECISIONS / decisions/:** Add or link an ADR if the session revealed or made a significant architectural decision.  
   - **Design docs / PRODUCT_SENSE:** Adjust only if the session changed scope, beliefs, or target users.  
   Do not rewrite unchanged sections; make surgical edits.

4. **Set isLibraRun**  
   When you are done with doc updates, write a marker so the stop hook (or next run) knows this session was already processed. Options:  
   - Write or append to a small file under `.cursor/hooks/state/` (e.g. last libra run generation id or timestamp).  
   - Or document in the skill that the agent should reply with a short confirmation (e.g. "Libra docs synced") so the user/hook can treat that as “run completed.”  
   The stop hook script can use this to avoid emitting another `followup_message` for the same run.

## Output contract

- Only modify files under `docs/` (and optionally `.cursor/hooks/state/` for the isLibraRun marker).
- Preserve existing structure and formatting; prefer minimal diffs.
- If nothing meaningful changed in the session, you may respond that no doc updates were needed and still set the isLibraRun marker so the hook does not loop.

## Inclusion bar

Update a doc only when:

- The session actually changed code or behavior that the doc describes, or
- The session completed a task or decision that the doc tracks (exec plan, spec status, ADR).

Do not update docs for trivial or unrelated edits.
