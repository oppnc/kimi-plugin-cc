---
description: >
  Happy path — hand frontend/UI, screenshot/video visual bugs, or multi-file work
  to local Kimi Code via the kimi-rescue subagent (ACP)
argument-hint: '[--image <path>] [--video <path>] [--resume|--fresh] <task>'
allowed-tools: Bash(node:*), AskUserQuestion, Agent
---

Invoke the `kimi:kimi-rescue` subagent via the **Agent** tool (`subagent_type: "kimi:kimi-rescue"`), forwarding the raw user request as the prompt.

`kimi:kimi-rescue` is a **subagent**, not a skill — do **not** call `Skill(kimi:kimi-rescue)` or re-enter this slash command from a forked agent (that can hang).

Raw user request:
$ARGUMENTS

## Happy path rules

- Prefer the Agent tool so the main thread stays clean.
- Default mode is **yolo** (implement). Use `plan` only if the user asked for a plan.
- For UI/frontend with screenshots or recordings, keep `--image` / `--video` paths.
- Return the subagent / companion stdout **verbatim**. Do not paraphrase or re-implement.
- Do not solve the task yourself in the main thread.
- If Kimi is missing or unauthenticated, tell the user to run `/kimi:setup`.

Advanced flags (`--background`, job polling) only when the user explicitly asks.
