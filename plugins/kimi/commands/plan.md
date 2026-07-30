---
description: Kimi ACP plan mode (planning-first; mutating tools rejected by companion policy)
argument-hint: '[--image p] [--cwd p] [--resume|--fresh] <what to plan>'
allowed-tools: Bash(node:*)
---

Plan-only pass (no implementation). For **implementing** frontend/UI after a plan, use `/kimi:rescue`.

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode plan $ARGUMENTS
```

Do not override to yolo unless the user clearly asked to implement.

Supported flags: plan text after `--`, plus `--model`, `--thinking`, `--image` / `--video` / `--media`,
`--cwd`, `--resume` / `--session` / `--fresh`, `--git` / `--base`, `--timeout`, `--json`.

Long plan runs with `--background` only if the user asked — then poll `/kimi:status` / `/kimi:result`.

Return stdout **verbatim**. Do not reimplement the plan in the main agent when Kimi returned one.
