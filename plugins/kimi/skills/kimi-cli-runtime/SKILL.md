---
name: kimi-cli-runtime
description: Internal contract for kimi-companion ACP runtime (rescue subagent)
user-invocable: false
---

# Kimi Runtime

Use only from `kimi:kimi-rescue` (or when a command explicitly says so).

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task [options] -- "<user task>"
```

## Options worth preserving

| Flag | Purpose |
| --- | --- |
| `--mode yolo\|plan\|auto\|default` | ACP mode (default yolo for rescue) |
| `--image` / `--video` / `--media` | Multimodal paths (frontend visual debug) |
| `--goal` | Frame as Kimi Goal objective |
| `--resume` / `--session id` | Continue prior ACP session |
| `--fresh` | Force new session |
| `--git` / `--base ref` | Attach raw git context |
| `--background` | Detached job |
| `--model` / `--thinking` | Catalog values from setup |

## Rules

- One `task` invocation; return stdout unchanged.
- No invented system prompts.
- Prefer media flags for screenshots/recordings over describing pixels in prose.
