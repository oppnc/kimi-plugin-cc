---
description: Show Kimi companion job result (optional --wait)
argument-hint: '[job-id] [--wait] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" result $ARGUMENTS
```

Return stdout verbatim.
