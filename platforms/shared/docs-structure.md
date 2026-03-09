# Canonical /docs structure (init_repo parity)

Output of `/init-libra` and MCP `init_repo` must match. Use this as the single reference.

```
docs/
├── PRODUCT_SENSE.md
├── DECISIONS.md
├── decisions/                 (directory; ADR files)
├── design-docs/
│   ├── index.md
│   └── core-beliefs.md
├── product-specs/
│   └── index.md
└── exec-plans/
    ├── active/
    └── tech-debt-tracker.md
```

Plus `AGENTS.md` at repo root when not present.

Stubs: use `<!-- TODO: fill in -->` for placeholder content; do not leave blank or hallucinate.
