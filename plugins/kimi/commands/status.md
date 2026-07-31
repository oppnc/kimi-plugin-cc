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

`--wait` with an optional `--wait-timeout <ms>` blocks until a terminal state. If the
budget runs out while the job is still running, the exit code is **non-zero** — a wait
timeout is not a completed handoff.

Return stdout **verbatim**. Do not invent job ids. Not for starting work (use `/kimi:rescue` or `/kimi:task`).
