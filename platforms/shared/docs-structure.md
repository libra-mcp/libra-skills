# Canonical /docs structure (Libra parity)

Output of `/init-libra` and MCP `init_repo` must match. Use this as the single reference.

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

Conventions:
- Every doc file includes YAML frontmatter.
- Cross-links use wiki-style notation: `[[adr-005]]`, `[[spec:auth-flow]]`, `[[design:core-beliefs]]`.
- Index files are always named `INDEX.md` (caps).
- If content is unknown, use `<!-- TODO: ... -->` stubs rather than guessing.
