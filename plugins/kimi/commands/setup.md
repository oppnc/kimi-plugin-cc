---
description: Check local Kimi Code + ACP readiness; list models/modes
argument-hint: '[--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" setup $ARGUMENTS
```

If setup fails (missing binary or login), tell the user how to install/login Kimi Code and set `KIMI_CLI_PATH` if needed. Do not invent install steps beyond official Kimi docs.

Return the setup output to the user (verbatim is fine).
