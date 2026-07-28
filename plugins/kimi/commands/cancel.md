---
description: Cancel a running Kimi companion background job
argument-hint: '[job-id]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" cancel $ARGUMENTS
```

Return stdout verbatim.
