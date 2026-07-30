---
description: List Kimi ACP sessions on disk (for --resume / --session)
argument-hint: '[--all] [--cwd p] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" sessions $ARGUMENTS
```

Supported: `--all`, `--cwd <path>`, `--json`.

Return stdout **verbatim**. Use session ids with `/kimi:task --session …` or rescue `--session` / `--resume`.
