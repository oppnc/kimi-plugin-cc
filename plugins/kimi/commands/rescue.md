---
description: Hand a substantial coding/frontend/UI task to local Kimi Code via the kimi-rescue subagent (ACP)
argument-hint: '[--background|--wait] [--resume|--fresh] [--image <path>] [--video <path>] [--model <id>] <task>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

Invoke the `kimi:kimi-rescue` subagent via the **Agent** tool (`subagent_type: "kimi:kimi-rescue"`), forwarding the raw user request as the prompt.

`kimi:kimi-rescue` is a **subagent**, not a skill — do **not** call `Skill(kimi:kimi-rescue)` or re-enter this slash command from a forked agent (that can hang).

Raw user request:
$ARGUMENTS

Execution rules:

- Prefer the Agent tool so the main thread stays clean (same pattern as Codex rescue).
- If `$ARGUMENTS` includes `--background`, run the subagent in the background when the host supports it.
- If `--resume` or `--fresh` is present, forward as-is (do not re-ask).
- If neither resume nor fresh is set, optionally check whether a prior Kimi job exists:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" status --json
```

  If the latest completed job has a `sessionId` and the user is clearly continuing work, prefer forwarding `--resume`. Otherwise start fresh.

- For UI/frontend work with screenshots or recordings, preserve `--image` / `--video` paths in the forwarded request.
- Return the subagent / companion stdout **verbatim**. Do not paraphrase.
- Do not solve the task yourself in the main thread.
- If Kimi is missing or unauthenticated, tell the user to run `/kimi:setup`.
