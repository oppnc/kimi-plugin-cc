---
description: Cancel a queued or running Kimi job
argument-hint: '[job-id] [--cwd p] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" cancel $ARGUMENTS
```

Supported: `[job-id]`, `--cwd <path>`, `--json`.

Return stdout **verbatim**. Use only when the user asks to stop a job.
