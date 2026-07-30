---
description: >
  Run a long-horizon Kimi Goal via ACP yolo. Large or frontend/UI goals MUST use
  Agent kimi:kimi-rescue (not main-agent implementation).
argument-hint: '[--image p] [--video p] [--background] [--resume|--fresh] <objective with success criteria>'
allowed-tools: Bash(node:*), Agent
---

## Routing

| Work type | Do this |
| --- | --- |
| Large goals, or any frontend/UI/visual/multi-file UI | **Agent `kimi:kimi-rescue`** with prompt starting with `--goal ` (or `/kimi:rescue` + goal intent) |
| Short non-UI objectives | Companion `goal` below |

Direct companion (small non-UI goals):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" goal --mode yolo $ARGUMENTS
```

Supported flags: objective after `--`, plus `--model`, `--thinking`, `--image` / `--video` / `--media`,
`--cwd`, `--resume` / `--session` / `--fresh`, `--git` / `--base`, `--background`, `--timeout`, `--json`.

## Long-running

- Prefer foreground unless the user asked for background.
- If `--background`, poll `/kimi:status` / `/kimi:result`.

Write objectives with a clear finish line and evidence (tests, build, visible UI state). Return stdout **verbatim**.
