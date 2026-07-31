---
description: >
  REQUIRED for frontend/UI, style mockups, reference pages, CSS/layout, components,
  screenshot/video visual bugs, multimodal debugging, or multi-file coding — hand off
  to local Kimi Code via kimi:kimi-rescue. Main agent MUST NOT implement these itself.
argument-hint: '[--image <path>] [--video <path>] [--resume|--fresh] <task>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

**MUST** invoke the `kimi:kimi-rescue` subagent via the **Agent** tool (`subagent_type: "kimi:kimi-rescue"`), forwarding the raw user request as the prompt.

`kimi:kimi-rescue` is a **subagent**, not a skill — do **not** call `Skill(kimi:kimi-rescue)` or re-enter this slash command from a forked agent (that can hang).

Raw user request:
$ARGUMENTS

## Hard rules

- **MUST** use the Agent tool (`kimi:kimi-rescue`). Main thread stays clean.
- **MUST NOT** write/edit HTML/CSS/JS UI, components, or layout in the main agent for this request.
- Default mode is **yolo** (implement). Use `plan` only if the user asked for a plan.
- For UI/frontend with screenshots or recordings, keep `--image` / `--video` paths.
- Return the subagent / companion stdout **verbatim**. Do not paraphrase or re-implement.
- If Kimi is missing or unauthenticated, tell the user to run `/kimi:setup` - still do **not** silently implement the UI yourself unless the user explicitly asks the main agent to do it after setup fails.

## Host timeout / background routing (aligns with Codex `$kimi:rescue`)

Companion is a long-running ACP stream. The host shell has a default timeout that can kill it mid-start, leaving **empty stdout** that looks like a Mode A empty turn but is not.

| Host | Default shell behavior | What to rely on |
| --- | --- | --- |
| Claude Code | Bash tool has a generous default (`BASH_DEFAULT_TIMEOUT_MS` / `BASH_MAX_TIMEOUT_MS` if set); subagent Bash is **not** killed at ~14s like Codex Desktop | Foreground pipe is normally safe |
| Grok | Inherits Claude-compatible Bash semantics | Same as Claude |

**Default routing by work shape:**

| Request shape | Route |
| --- | --- |
| Open-ended UI / multi-file redesign / "整体换风格" / "modernize the demo" | **Foreground pipe** via the subagent (companion `task` without `--background`). The subagent blocks until Kimi finishes and returns real agent text. |
| Small / bounded UI fix the user wants inline | Foreground pipe via the subagent |
| User **explicitly** asks to detach | `--background` + **parent** polls `/kimi:status` / `/kimi:result` |

- **Foreground is the default for ALL UI work** (aligns with `openai/codex-plugin-cc` PR #214: inner task call must always run in foreground). The subagent returns Kimi's real output; no polling needed.
- `--background` is **not** the default. Use it **only** when the user explicitly asks to detach. Then the **parent** (not the subagent) owns polling `/kimi:status` / `/kimi:result` until `status: completed` - the subagent returns immediately and cannot see the background job finish.
- `--background` / `--wait` are **parent-only** flags; the subagent adds `--background` to the companion command, never passes it through into a nested re-handoff.
- If a foreground pipe returns **empty stdout after only a few seconds** with no companion `[kimi-plugin]` error block, treat it as a **host shell kill, not Mode A**: re-spawn the subagent once. Do **not** switch to `--background` as a workaround - it makes the subagent return empty.

## Timeout keeps the session

`--timeout <ms>` is a soft ACP deadline: on timeout the companion sends `session/cancel`
and keeps the session alive. Resume the same thread with `--resume` / `--session <id>` —
do not treat a timeout as a lost handoff.

## Empty / failed handoff (re-dispatch, do not self-implement)

Companion signals a failed empty ACP turn with **non-zero exit**, stdout `(no agent text)`, and/or JSON `ok:false` / `emptyAgentText:true` (after its own retries). That is **not** a clarifying question.

1. Show the companion output as-is.
2. **Re-dispatch once** via Agent `kimi:kimi-rescue` with `--fresh` (and a short mandate: must use Write/Edit on disk). Prefer `--json` if you need flags.
3. Still **MUST NOT** implement the UI in the main agent after a failed or empty handoff.
4. If the second attempt also fails empty, report failure and point at `/kimi:setup` / model availability - do not silently take over UI coding.

| Signal | Meaning | Action |
| --- | --- | --- |
| Exit **0** + real agent text | Success | Surface stdout **verbatim** |
| Exit **≠ 0**, `(no agent text)` / `ok:false` / `emptyAgentText:true` | Failed empty handoff | Re-dispatch once with `--fresh` (above); do not self-implement |
| Empty stdout within a few seconds, no `[kimi-plugin]` error block | **Host shell kill** (not Mode A) | Re-spawn the subagent once. Do **not** switch to `--background` - it makes the subagent return empty. |
