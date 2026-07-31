---
description: Show stored result for a finished Kimi job
argument-hint: '[job-id] [--wait] [--cwd p] [--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" result $ARGUMENTS
```

Supported: `[job-id]`, `--wait`, `--cwd <path>`, `--json`.

`--wait` with an optional `--wait-timeout <ms>` blocks until a terminal state. If the
budget runs out while the job is still running, the exit code is **non-zero** — a wait
timeout is not a completed handoff.

Present the **full** companion stdout exactly as returned. Do not summarize Kimi’s answer.
