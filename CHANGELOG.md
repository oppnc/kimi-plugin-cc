# Changelog

**Language / 语言:** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

## 0.2.1 (in development)

### Fixed
- **Cancel race (POSIX):** a runner SIGTERM no longer overwrites a job the host already
  cancelled — `failOrphan` skips jobs in `cancelled` state.
- **Unbounded log growth:** job pruning now removes the matching `logs/<job>.log` with the job file.
- **Unknown flags leaked into Kimi's prompt:** `task`/`goal` reject unknown `--` options instead
  of silently merging them into the task text (put task text after `--`).
- **Media TOCTOU:** a file deleted between `existsSync` and `statSync` is now a clean error,
  not a raw throw.
- **Plan mode with no plan text:** `task --mode plan` that ran only read-only tools and ended
  with zero agent text is now a **failed** handoff (`ok:false`, exit 1, `planEmptyText:true`)
  instead of a false success — the plan itself is the deliverable in plan mode.
- **Goal framing no longer bypasses Q&A / reply-only exclusion:** `--goal` with a
  `Reply with exactly: …` or how-to `Objective:` no longer triggers Mode B continue nudges
  (previously `asGoal` returned action unconditionally).

### Changed
- **Mode A empty-turn retries:** default raised **2 → 5**; configurable via `--empty-retries <n>`
  (explicit → `KIMI_EMPTY_RETRIES` env → default; `0` disables).
- **`--timeout` no longer loses the session:** on ACP request timeout the client sends
  `session/cancel` and keeps the session alive; failed jobs record `sessionId` and
  `--resume` can continue the same thread.
- **`status --wait` / `result --wait`** exit **non-zero** when the wait budget runs out while
  the job is still running (a wait timeout is not a completed handoff).
- **Prune throttling:** prune scans run at most once per 30s so heartbeat writes stay cheap.
- **`splitRawArgumentString`** now handles escaped quotes/backslashes inside quoted segments.
- **Docs:** `default` mode is documented as full-auto approval (same as `auto`/`yolo`;
  only `plan` rejects writes). Removed unused `waitTimeoutMs` field from task parsing.

### Added
- `tests/acp-client.test.mjs` + `tests/fixtures/fake-kimi-acp.mjs` (request-timeout session
  preservation, configurable empty-retry budget) — also copied to the Codex package.
- `tests/companion-cli.test.mjs` — Kimi-free CLI-level contracts (`--wait` exit codes, orphan
  reconciliation, cancel-race guard, resume hint, unknown-flag rejection).

## 0.2.0

Public package version continues from GitHub **0.1.x** as **0.2.0** (aligned with **kimi-plugin-codex** 0.2.0).

### Added
- Job **phase** + **lastProgressMessage** on background jobs (queued → launching → starting_acp → running → terminal)
- Richer status render: phase, progress, resume hint; status list preview 50 + phase padEnd 18
- `lib/prompt.mjs` + `tests/prompt.test.mjs`; optional `KIMI_BRIDGE_HANDOFF=1` bridge notes (default off)

### Changed
- Core companion alignment with **kimi-plugin-codex** 0.2.0 (shared progress / prompt stack)
- Harder host triggers: agent/command/skill copy uses **REQUIRED / MUST / MUST NOT** for frontend/UI (including style mocks and reference pages); main agent must not implement UI when Kimi is ready
- Host command shells **functionally similar** to Codex skills: routing tables (UI → rescue), flag lists, long-run status/result notes, setup nextSteps (Claude/Grok/CLI), Fix: `/kimi:sessions`
- Version **0.2.0** (aligned with sibling Codex package)

## 0.1.2

### Added
- **First verify** path in README + setup `nextSteps` (hand a small frontend task to Kimi)
- Setup doctor: Node version, workspace source, soft Kimi Code **compat** notes, actionable `errorCode`
- Standardized `[kimi-plugin]` errors with numbered **Fix** lists (`lib/errors.mjs`)
- Workspace root resolution from host env (`CLAUDE_PROJECT_DIR`, `GROK_WORKSPACE`, `KIMI_WORKSPACE`, …)
- Media path resolve against workspace cwd + clearer not-found errors (agent-facing)

### Changed
- Happy path only in user docs: `/kimi:rescue` for frontend/UI/screenshot/video; advanced details stay in AGENTS.md
- Stronger host triggers for frontend / visual / video handoff (`kimi-rescue`, setup, rescue command)

## 0.1.1

### Fixed
- Background jobs: dead runner PIDs are reconciled to `failed` (`orphaned`) on `status` / `result` / `--wait` instead of staying fake-`running` forever
- Background `_bg-run` writes logs under `~/.kimi-plugin-cc/logs/`, heartbeats `updatedAt` / tool counts, and finalizes on signals / uncaught errors
- Rescue guidance: prefer **foreground** unless the user asks to detach

## 0.1.0

First public release: Claude Code / Grok plugin that runs local **Kimi Code** as a subagent over ACP.

### Added

- Thin ACP companion: `setup`, `task`, `goal`, `sessions`, `status` / `result` / `cancel`
- Modes: `default` | `plan` | `auto` | `yolo` via `session/set_config_option`
- Multimodal: `--image` / `--video` / `--media` (images as ACP blocks when small; path hints for large/SVG/video → `ReadMediaFile`)
- Goals: `goal` command and `--goal` framing
- Session resume: `--resume` / `--session <id>`; `sessions` lists ACP sessions
- Optional git context: `--git` / `--base` (raw facts, not a review rubric)
- Background jobs + `--wait` on status/result; host session id scoping (`CLAUDE_SESSION_ID` / `GROK_SESSION_ID`)
- Setup prints model catalog from ACP `configOptions`; setup `--json` includes `ok` / `pluginVersion`
- Host UX: slash commands + `/kimi:rescue` → Agent `kimi-rescue` (forward-only)
- Unit tests (`npm test`) and live gate (`npm run smoke`)
- No default ACP task deadline; optional `--timeout` / `--wait-timeout` when the agent wants a hard stop (prefer `status` / `result` polling)

### Fixed / hardened

- Plan mode: decline `ExitPlanMode` (`plan_reject_and_exit`); reject mutating tools under plan policy
- Optional ACP timeouts include kimi stderr tail on timeout errors
- Windows: prefer native `kimi.exe`; skip `.ps1` shims; `.cmd` via shell
- POSIX process group for cancel; Windows process-tree kill
- Atomic job writes; path-traversal-safe job ids; jobs dir pruned to newest 100
- Foreground failures recorded as failed jobs
- `sessions --all` does not spawn a redundant ACP process
- Task arg parsing: `--` separator; blob-splitting only when a single token starts with `--`
- Background job media paths pinned absolute at enqueue

### Notes

- No review-gate hook by default (review is not the product focus)
- MCP server forwarding remains optional/advanced
- Agent / maintainer docs: [AGENTS.md](AGENTS.md)
- Open-source packaging: GitHub CI, SECURITY.md, CONTRIBUTING.md, issue/PR templates

---

**中文版:** [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)
