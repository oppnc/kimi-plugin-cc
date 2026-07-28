---
description: Run a long-horizon Kimi Goal (verifiable objective) via ACP yolo mode
argument-hint: '[--image <path>] [--video <path>] [--background] <objective with success criteria>'
allowed-tools: Bash(node:*), Agent
---

Forward a **Goal** to Kimi. Prefer the `kimi:kimi-rescue` Agent for large goals; for short goals you may call the companion directly.

Raw arguments:
$ARGUMENTS

Direct companion (small goals):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" goal --mode yolo $ARGUMENTS
```

Or Agent path for large work: `Agent` with `subagent_type: "kimi:kimi-rescue"` and prompt starting with `--goal `.

Write objectives with a clear finish line and evidence (tests, build, visible UI state). Return stdout verbatim.
