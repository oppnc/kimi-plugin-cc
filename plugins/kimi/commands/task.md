---
description: >
  Light one-shot on local Kimi Code. For ANY frontend/UI/mock/style/screenshot/video
  or multi-file work, do NOT use this alone — MUST use Agent kimi:kimi-rescue (/kimi:rescue).
argument-hint: '[--mode yolo|plan|auto|default] [--image p] [--video p] [--resume|--fresh] [--background] <prompt>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

## Routing

| Work type | Do this |
| --- | --- |
| Frontend / UI / mock / style / screenshot / video / multi-file | **Agent `kimi:kimi-rescue`** (or `/kimi:rescue`) — do **not** implement in the main thread |
| Small non-UI one-shot | Companion `task` below |

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo $ARGUMENTS
```

If the user already passed `--mode`, do not add another.

Supported flags (pass through when present): `--mode`, `--model`, `--thinking`, `--image` / `--video` / `--media`,
`--cwd`, `--resume` / `--session` / `--fresh`, `--git` / `--base`, `--goal`, `--background`, `--timeout`,
`--empty-retries`, `--json`.

## Timeouts and retries

- `--timeout <ms>` sets an ACP request deadline. On timeout the companion keeps the
  **session alive** (`session/cancel`, not a kill): resume the same thread with
  `--resume` / `--session <id>` afterwards.
- `--empty-retries <n>` sets the Mode A empty-turn fresh-session retry budget
  (default 5, `KIMI_EMPTY_RETRIES` env, `0` disables).
- `status --wait` / `result --wait` exit non-zero when the wait budget runs out and
  the job is still running — a wait timeout is **not** a completed handoff.

## Long-running

- Prefer foreground unless the user asked for background.
- If `--background`, poll with `/kimi:status` / `/kimi:result` (or `--wait`).

Keep media paths as flags. Return stdout **verbatim**.
