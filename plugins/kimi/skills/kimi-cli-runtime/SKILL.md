---
name: kimi-cli-runtime
description: >
  Internal contract for kimi-companion ACP runtime. REQUIRED launcher for
  kimi:kimi-rescue on frontend/UI/mock/style/screenshot/video/multi-file handoff
  to local Kimi Code. Main agents must not reimplement that UI work themselves.
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

## Acceptance / empty handoff (read stdout + exit code)

Companion turn policy (Mode A/B) runs **inside** `task` — you do not reimplement it. After the process exits, **classify the handoff**:

| Signal | Meaning | What to do |
| --- | --- | --- |
| Exit **0** and useful agent text (or JSON `"ok": true`) | Success | Return stdout **verbatim** |
| Exit **≠ 0** | Failed handoff (includes empty ACP completion) | Return stdout/stderr **verbatim**; parent should **re-dispatch once** (prefer `--fresh`) — **do not** implement UI yourself |
| Text/JSON: `(no agent text)`, `"emptyAgentText": true`, `"ok": false` | Mode A empty completion after retries | Same as exit ≠ 0 — **not** a clarifying question |
| `"emptyRetried": true` / `"emptyRecoveryNudged": true` | Companion already retried / nudged | Still fail if empty; parent may one more `--fresh` re-dispatch |
| `"incompleteContinued": true` and objective still unfinished | Mode B nudged but work may remain | Prefer `--resume` with same `session` and a short “finish remaining disk work” delta |

Optional JSON for machines: add `--json` so flags are explicit (`ok`, `emptyAgentText`, `emptyRetried`, `emptyRecoveryNudged`, `incompleteContinued`, `sessionId`).

**Do not** treat empty completion as success, invent a second companion path, or rewrite UI in this subagent.
