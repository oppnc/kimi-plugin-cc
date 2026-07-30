# kimi-plugin-cc

**Language / 语言:** [English](README.md) | [中文](README.zh-CN.md)

[![CI](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml/badge.svg)](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.2-green.svg)](./CHANGELOG.md)

Call local **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** as a subagent from **Claude Code** or **Grok**.

Kimi k3 is strong at frontend and multimodal work — and stronger inside Kimi Code. This plugin is a **thin ACP bridge**: tools, swarm, skills, and models stay with Kimi Code.

| | |
| --- | --- |
| **Version** | **0.1.2** |
| **Hosts** | Claude Code, Grok |
| **Node** | ≥ 18.18 |
| **Needs** | Kimi Code CLI installed + `kimi login` |

## Happy path (what you use day to day)

| Host | What to do |
| --- | --- |
| **Claude Code** | `/kimi:rescue <frontend or UI task>` |
| **Grok** | Ask the main agent to hand frontend/UI work to **kimi-rescue** / Kimi companion |
| **When** | Frontend/UI, CSS/layout, screenshot or **video** visual bugs, multi-file implement |

Do **not** re-implement that work in the main agent when Kimi is ready. Return Kimi’s output as-is.

Advanced commands (`/kimi:task`, background jobs, status/result): see [AGENTS.md](AGENTS.md).

## Install

### Prerequisites

1. Node.js ≥ 18.18  
2. [Kimi Code CLI](https://github.com/MoonshotAI/kimi-code) + `kimi login`  
3. If `kimi` is missing from PATH (common on Windows): set `KIMI_CLI_PATH` to the full path of `kimi` / `kimi.exe` (often `%USERPROFILE%\.kimi-code\bin\kimi.exe`)

### Claude Code

```text
/plugin marketplace add oppnc/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

Then `/kimi:setup`. If commands are missing in the current session: `/reload-plugins`.

### Grok

```bash
grok plugin install oppnc/kimi-plugin-cc#plugins/kimi --trust
```

## First verify (do this once)

### 1) Doctor

- Claude: `/kimi:setup`  
- Or CLI from a checkout:

```bash
node plugins/kimi/scripts/kimi-companion.mjs setup
```

You want `acp probe: ok` and a **Next (first verify)** section.

### 2) Hand a frontend task to Kimi

**Claude Code:**

```text
/kimi:rescue Implement a small responsive settings section using existing design tokens. Keep changes minimal.
```

**Grok:** ask the agent to run the Kimi rescue/handoff for the same frontend task.

**CLI probe** (no host plugin required):

```bash
node plugins/kimi/scripts/kimi-companion.mjs task --mode yolo -- "Reply with exactly: kimi-bridge-ok"
```

If that works, the bridge is healthy. Real work should use `/kimi:rescue` (or Grok equivalent) for frontend/UI.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `BINARY_NOT_FOUND` | Install Kimi Code; `kimi login`; set `KIMI_CLI_PATH` if needed |
| `ACP_FAILED` / `LOGIN_REQUIRED` | Run `kimi login` in a normal terminal; re-run setup |
| `NODE_TOO_OLD` | Upgrade Node to ≥ 18.18 |
| `MEDIA_NOT_FOUND` | Use an absolute path or a path under the workspace Kimi uses |
| Commands missing after install | `/reload-plugins`; marketplace update when `version` changes |
| Plan mode “doesn’t edit files” | By design — use default **yolo** to implement |

Errors are prefixed with `[kimi-plugin]` and include a numbered **Fix** list — show them as-is.

## Compatibility

| Component | Requirement |
| --- | --- |
| This plugin | 0.1.2 |
| Node | ≥ 18.18 |
| Kimi Code | CLI with working `kimi acp` (NDJSON). Setup prints `compat` + kimi version. Upgrade Kimi Code if ACP fails. |

## Related

| Package | Host |
| --- | --- |
| **kimi-plugin-cc** (this repo) | Claude Code / Grok |
| [kimi-plugin-codex](https://github.com/oppnc/kimi-plugin-codex) | OpenAI Codex |

Maintainer / agent details: [AGENTS.md](AGENTS.md) · Changelog: [CHANGELOG.md](CHANGELOG.md)

## License

MIT — see [LICENSE](./LICENSE). Kimi Code is a separate project.
