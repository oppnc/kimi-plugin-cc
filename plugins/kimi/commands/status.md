---
description: Show Kimi companion job status (optional --wait)
argument-hint: '[job-id] [--wait] [--all] [--cwd p] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" status $ARGUMENTS
```

Supported: `[job-id]`, `--wait`, `--all`, `--cwd <path>`, `--json`.

Return stdout **verbatim**. Do not invent job ids. Not for starting work (use `/kimi:rescue` or `/kimi:task`).
