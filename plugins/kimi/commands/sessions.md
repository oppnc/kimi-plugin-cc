---
description: List Kimi ACP sessions on disk (for --resume / --session)
argument-hint: '[--all] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" sessions $ARGUMENTS
```

Return stdout verbatim.
