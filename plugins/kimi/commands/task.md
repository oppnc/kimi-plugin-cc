---
description: Run a task on local Kimi Code via ACP (multimodal/frontend-friendly; Kimi keeps its own prompts)
argument-hint: '[--mode yolo|plan|auto|default] [--image p] [--video p] [--resume] [--git] [--background] <prompt>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

Forward to Kimi. Do not rewrite into a new system prompt.

Raw arguments:
$ARGUMENTS

For substantial implementation/UI work, prefer Agent `kimi:kimi-rescue` (see `/kimi:rescue`).

Otherwise:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo $ARGUMENTS
```

If the user already passed `--mode`, do not add another.

Media: keep `--image` / `--video` paths for screenshots and screen recordings (Kimi strength).

Return stdout verbatim.
