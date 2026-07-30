---
name: kimi-cli-runtime
description: >
  Internal contract for kimi-companion ACP runtime. Used by kimi-rescue for
  frontend/UI, screenshot/video visual bugs, and multi-file handoff to local Kimi Code.
user-invocable: false
---

# Kimi Runtime (subagent)

Use only from `kimi:kimi-rescue` (or when a command explicitly says so).
This is the host-side launcher for the **Kimi Code subagent** over ACP.

## Happy path

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo -- "<user task>"
```

With screenshot / recording:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo --image "<abs-or-workspace-path>" -- "<user task>"
```

## Options (routing only)

| Flag | Purpose |
| --- | --- |
| `--mode yolo\|plan\|auto\|default` | Default **yolo** for implement/rescue; `plan` = plan-only |
| `--image` / `--video` / `--media` | Multimodal paths (resolve against workspace cwd) |
| `--goal` | Frame as Kimi Goal objective |
| `--resume` / `--session id` | Same subagent thread |
| `--fresh` | Force new session |
| `--cwd` | Explicit workspace root for Kimi edits |
| `--git` / `--base ref` | Attach raw git context |
| `--model` / `--thinking` | From setup catalog if user asked |

Advanced (`--background`, job poll): only when the user asks to detach. Prefer foreground.

## Rules

- One `task` invocation; return stdout **verbatim**.
- No invented system prompts; Kimi keeps tools/models/skills.
- Prefer media flags for screenshots/recordings over describing pixels in prose.
- If setup fails, tell the user to run `/kimi:setup` and show the companion error as-is.
