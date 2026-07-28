# AGENTS.md

Instructions for coding agents and maintainers of **kimi-plugin-cc**.  
Humans: start with [README.md](README.md) / [README.zh-CN.md](README.zh-CN.md).

## What this repo is

Thin host shell around local **Kimi Code** over **ACP** (`kimi acp` NDJSON JSON-RPC).

- **Does:** setup probe, task/goal forward, permissions over the bridge, jobs, multimodal path/image blocks, session resume, optional git facts, slash + `kimi-rescue` subagent wiring.
- **Does not:** reimplement Kimi system prompts, own tools/swarm/skills, ship a Codex-style review-gate product, advertise client FS reverse-RPC (Kimi edits the workspace disk itself).

Primary host UX is **Claude Code** (`.claude-plugin/`, `commands/`, `agents/`). Grok and other compatible hosts may load the same package — verify e2e in each environment.

Public repo: `https://github.com/oppnc/kimi-plugin-cc`  
Marketplace id: `kimi-code-cc` · plugin id: `kimi` → install as `kimi@kimi-code-cc`.

Sibling package for Codex: `kimi-plugin-codex` (different plugin format).

## Version (keep in sync — all **0.1.1**)

| Location | Field |
| --- | --- |
| `package.json` | `version` |
| `.claude-plugin/marketplace.json` | `metadata.version`, `plugins[].version` |
| `plugins/kimi/.claude-plugin/plugin.json` | `version` |
| `plugins/kimi/scripts/kimi-companion.mjs` | `VERSION` + file header |
| `plugins/kimi/scripts/lib/acp-client.mjs` | `PLUGIN_VERSION` (ACP `clientInfo`) |
| `scripts/smoke.mjs` | banner / success string |
| README badges / CHANGELOG | human-facing version label |

After bumping, run `npm run validate:plugin` and `npm test`.

## Layout

```text
kimi-plugin-cc/
  .claude-plugin/marketplace.json
  plugins/kimi/
    .claude-plugin/plugin.json
    agents/kimi-rescue.md          # subagent: one Bash → companion
    commands/*.md                  # slash wrappers
    skills/kimi-cli-runtime/       # rescue skill contract
    scripts/kimi-companion.mjs     # CLI entry
    scripts/lib/                   # acp, args, media, permissions, state, …
  tests/                           # unit (no Kimi binary)
  scripts/smoke.mjs                # unit + live ACP gate
```

## Design principles (do not violate)

| Principle | Behavior |
| --- | --- |
| Thin host shell | Slash commands and `kimi-rescue` only forward |
| No prompt reimplementation | User text → `session/prompt`; Kimi owns system/tools/swarm |
| Real ACP | NDJSON JSON-RPC per Kimi `acp-adapter` |
| Local workspace | Do **not** advertise client FS reverse-RPC |
| Product focus | Frontend, multimodal, goals — not review pipelines |

## Companion CLI (direct use, no host plugin)

```bash
node plugins/kimi/scripts/kimi-companion.mjs setup

# Implement
node plugins/kimi/scripts/kimi-companion.mjs task --mode yolo -- \
  "Make the settings page responsive using existing tokens"

# Screenshot / recording
node plugins/kimi/scripts/kimi-companion.mjs task --image shot.png --video rec.mp4 -- \
  "Find the layout bug shown in the media"

# Long goal
node plugins/kimi/scripts/kimi-companion.mjs goal -- \
  "Ship a working dark-mode toggle with tests green"

# Resume last session for this workspace
node plugins/kimi/scripts/kimi-companion.mjs task --resume -- \
  "Continue from where you left off"
```

Optional env: `KIMI_CLI_PATH`, `KIMI_PLUGIN_CC_DATA_DIR`, `CLAUDE_SESSION_ID` / `GROK_SESSION_ID`.

### Companion commands

| Command | Purpose |
| --- | --- |
| `setup` | Probe binary + ACP; list models/modes |
| `task` | Forward a task (default mode `yolo`) |
| `goal` | Goal framing (same stack as `task --goal`) |
| `sessions` | List on-disk ACP sessions |
| `status` / `result` / `cancel` | Jobs (`--wait` supported) |

## How host agents should call Kimi

1. **Substantial** implementation / UI / multimodal / multi-file → Agent `kimi:kimi-rescue` (see `/kimi:rescue`). Do **not** call `Skill(kimi:kimi-rescue)` or re-enter the slash from a forked agent.
2. **Light** one-shot → `kimi-companion.mjs task` (or `/kimi:task`).
3. One companion invocation; return **stdout verbatim**. No invented system prompts or review rubrics.
4. Prefer `--image` / `--video` / `--media` for screenshots and recordings over describing pixels in prose.
5. Default `--mode yolo` unless the user asked for plan/auto/default.
6. Preserve `--resume` / `--fresh` / `--session` / `--goal` / `--git` / `--model` / `--thinking` / `--background`.

Skill contract: `plugins/kimi/skills/kimi-cli-runtime/SKILL.md`.

## Bridge semantics (non-interactive)

There is no human answering Kimi permission prompts; the companion answers them.

| Mode | Policy |
| --- | --- |
| `yolo` / `auto` | Upstream Kimi semantics |
| `default` | Auto-approve tool requests (prefer session-level allow) |
| `plan` | Approve read-oriented tools; reject mutating tools; **decline** `ExitPlanMode` (`plan_reject_and_exit`) so plan mode delivers a plan and does **not** start execution |

### Timeouts (agent-controlled)

- **Default: no ACP request deadline** for `task` / `goal` / background jobs. Kimi may run until it finishes, fails, or is cancelled.
- Optional: `--timeout <ms>` on task/goal when the agent wants a hard stop.
- Prefer **poll** over guessing: `status` / `result` (and `--wait`) show whether a job is still running. Optional `--wait-timeout <ms>` on those commands; without it, `--wait` also has no deadline.
- Handshake (`initialize` / config) still uses a short internal timeout so a dead binary fails fast.
- If a deadline is set and fires, errors should include kimi stderr tail when available.

## Multimodal

- Small images → ACP image content blocks (base64).
- Large images, SVG, video → absolute path hints for Kimi `ReadMediaFile` (ACP has no video content block).
- Background jobs: pin media paths to absolute paths at enqueue time.

## Jobs & host scoping

- Job store: `KIMI_PLUGIN_CC_DATA_DIR` or `~/.kimi-plugin-cc`; pruned to newest ~100.
- Background logs: `~/.kimi-plugin-cc/logs/<jobId>.log` (stdio of `_bg-run`, not `ignore`).
- Host session binding via `CLAUDE_SESSION_ID` / `GROK_SESSION_ID` is **best-effort**; missing id → most recent job in current workspace.
- Foreground failures are recorded as failed jobs (visible via `status` / `result`).
- **Orphan recovery:** `status` / `result` / `--wait` call `reconcileStaleJobs()` — `running` jobs whose runner PID is dead are rewritten to `failed` with `orphaned: true` (no more infinite fake "running").
- Background runners heartbeat `updatedAt` / `toolEventCount` every ~10s; prefer **foreground** rescue unless the user asks to detach.

## Platform notes

- **Windows:** prefer native `~/.kimi-code/bin/kimi.exe`; skip PATH `.ps1` shims; run `.cmd` via shell (direct spawn → ENOENT).
- **POSIX:** `kimi acp` in its own process group so `cancel` kills the tree.

## Development

```bash
npm test           # unit: args, permissions, state, media
npm run smoke      # unit + live ACP (requires kimi login) — required before release
npm run setup      # companion setup
npm run validate:plugin   # if grok CLI available
```

## Change guidelines

- Prefer small diffs in `plugins/kimi/scripts/lib/*`; keep companion entry thin.
- Add unit tests for pure logic (args, permissions, state, media); use smoke for live ACP.
- Do not add review-gate hooks or prompt rewrites as default product surface.
- Bilingual docs: update **both** `README.md` / `README.zh-CN.md` and `CHANGELOG.md` / `CHANGELOG.zh-CN.md` when user-facing behavior changes. Keep README human-short; put agent/maintainer detail here.
