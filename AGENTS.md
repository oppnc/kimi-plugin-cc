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

## Version (keep in sync — all **0.2.1**)

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

Optional env: `KIMI_CLI_PATH`, `KIMI_PLUGIN_CC_DATA_DIR`, `CLAUDE_SESSION_ID` / `GROK_SESSION_ID`, `KIMI_BRIDGE_HANDOFF=1` (legacy host handoff bullets; default off), `KIMI_FORCE_CONTINUE=0` (disable Mode B incomplete-work continue nudges; default on).

### Companion commands

| Command | Purpose |
| --- | --- |
| `setup` | Probe binary + ACP; list models/modes |
| `task` | Forward a task (default mode `yolo`) |
| `goal` | Goal framing (same stack as `task --goal`) |
| `sessions` | List on-disk ACP sessions |
| `status` / `result` / `cancel` | Jobs (`--wait` supported) |

## How host agents should call Kimi

1. **REQUIRED** for any frontend/UI (including style mocks, reference pages, prototypes, “try a look”), CSS/layout/components, screenshot/video visual bugs, multimodal debugging, multi-file coding → Agent `kimi:kimi-rescue` (see `/kimi:rescue`). Main agent **MUST NOT** write/edit those UI files itself. Do **not** call `Skill(kimi:kimi-rescue)` or re-enter the slash from a forked agent.
2. **Light** non-UI one-shot only → `kimi-companion.mjs task` (or `/kimi:task`).
3. One companion invocation; return **stdout verbatim**. No invented system prompts or review rubrics.
4. Prefer `--image` / `--video` / `--media` for screenshots and recordings over describing pixels in prose.
5. Default `--mode yolo` unless the user asked for plan/auto/default.
6. Preserve `--resume` / `--fresh` / `--session` / `--goal` / `--git` / `--model` / `--thinking` / `--background` / `--json`.
7. Soft “prefer” is not enough: treat handoff as **mandatory** whenever the task touches UI surfaces and Kimi is available (after `/kimi:setup` / companion setup ok).
8. **Empty / failed handoff:** exit ≠ 0, `(no agent text)`, or JSON `ok:false` / `emptyAgentText:true` → re-dispatch **once** (`--fresh`), still **no** main-thread UI coding. See rescue / `kimi-cli-runtime` acceptance tables.

Skill contract: `plugins/kimi/skills/kimi-cli-runtime/SKILL.md`.

## Bridge semantics (non-interactive)

There is no human answering Kimi permission prompts; the companion answers them.

| Mode | Policy |
| --- | --- |
| `yolo` / `auto` | Upstream Kimi semantics |
| `default` | Auto-approve tool requests (prefer session-level allow) |
| `plan` | Approve read-oriented tools; reject mutating tools; **decline** `ExitPlanMode` (`plan_reject_and_exit`) so plan mode delivers a plan and does **not** start execution |

### Turn acceptance (Mode A / Mode B — keep isomorphic with kimi-plugin-codex)

Shared policy lives in `scripts/lib/turn-policy.mjs` and is applied inside `runKimiAcpTurn`:

| Mode | Symptom | Companion action |
| --- | --- | --- |
| **A — empty** | `end_turn` with no agent text and no tools | Up to **2** fresh-session retries, then **1** same-session empty-recovery nudge (`emptyAgentText` / `emptyRetried` / `emptyRecoveryNudged`). Still empty → job **`failed`**, **exit code 1** |
| **B — incomplete** | Disk/action task ends after plan text or only read/search tools (no Write/Edit/Bash) | Up to **2** **same-session** continue nudges (`incompleteContinued` / `continueCount` / `incompleteReason`); stagnates if no progress |

- **B is off** in `plan` mode (plan text is the deliverable).
- **B is off** for Q&A / how-to (`What is…`, `How do I implement…`), pure **reply-exactly** probes, and completion-claim text without tools.
- **B is on** for EN/CJK disk-action verbs, goals, file-path cues; not bare `ui`/`css` tokens alone.
- Disable B globally: `KIMI_FORCE_CONTINUE=0`.
- Pure empty turns are **not** reclassified as B; Mode A owns them.
- Claude-style `message.result` reassembly does **not** apply — Kimi empty turns have no recoverable result body (peer empty detection + retry + fail-loud only).

### Timeouts (agent-controlled)

- **Default: no ACP request deadline** for `task` / `goal` / background jobs. Kimi may run until it finishes, fails, or is cancelled.
- Optional: `--timeout <ms>` on task/goal when the agent wants a **soft** stop. On timeout the companion sends `session/cancel` and keeps the session alive — the job records `sessionId` and `--resume` can continue the same thread (it is **not** a lost handoff).
- `--empty-retries <n>` sets the Mode A empty-turn fresh-session retry budget (default **5**, `KIMI_EMPTY_RETRIES` env, `0` disables).
- Prefer **poll** over guessing: `status` / `result` (and `--wait`) show whether a job is still running. Optional `--wait-timeout <ms>` on those commands; without it, `--wait` also has no deadline. When the wait budget runs out while the job is still `running`, the command exits **non-zero** — a wait timeout is not a completed handoff.
- Handshake (`initialize` / config) still uses a short internal timeout so a dead binary fails fast.
- If a deadline is set and fires, errors should include kimi stderr tail when available.

## Multimodal

- Small images → ACP image content blocks (base64).
- Large images, SVG, video → absolute path hints for Kimi `ReadMediaFile` (ACP has no video content block).
- Background jobs: pin media paths to absolute paths at enqueue time.

## Jobs & host scoping

- Job store: `KIMI_PLUGIN_CC_DATA_DIR` or `~/.kimi-plugin-cc`; pruned to newest ~100 (log files pruned with their job).
- Background logs: `~/.kimi-plugin-cc/logs/<jobId>.log` (stdio of `_bg-run`, not `ignore`).
- Host session binding via `CLAUDE_SESSION_ID` / `GROK_SESSION_ID` is **best-effort**; missing id → most recent job in current workspace.
- Foreground failures are recorded as failed jobs (visible via `status` / `result`).
- **Orphan recovery:** `status` / `result` / `--wait` call `reconcileStaleJobs()` — `running` jobs whose runner PID is dead are rewritten to `failed` with `orphaned: true` (no more infinite fake "running").
- **Job phases:** `queued` → `launching` → `starting_acp` → `running` → terminal; `lastProgressMessage` surfaces tool/agent progress on status.
- Background runners heartbeat `updatedAt` / `toolEventCount` / phase every ~10s; prefer **foreground** rescue unless the user asks to detach.

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
