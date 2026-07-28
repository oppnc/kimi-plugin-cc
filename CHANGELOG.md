# Changelog

**Language / 语言:** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

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
