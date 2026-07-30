---
description: Light one-shot task on local Kimi Code (prefer /kimi:rescue for frontend/UI)
argument-hint: '[--mode yolo|plan] [--image p] [--video p] [--resume] <prompt>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

For **frontend/UI, screenshots/video, or multi-file** work, prefer Agent `kimi:kimi-rescue` (see `/kimi:rescue`).

Otherwise forward a light one-shot:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo $ARGUMENTS
```

If the user already passed `--mode`, do not add another.

Keep `--image` / `--video` paths when present. Return stdout verbatim.
