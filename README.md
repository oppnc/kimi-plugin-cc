# kimi-plugin-cc

**Language / 语言:** [English](README.md) | [中文](README.zh-CN.md)

[![CI](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml/badge.svg)](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](./CHANGELOG.md)

This plugin does one thing: call **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** as a subagent.

Kimi k3 is strong at frontend and multimodal work. In its familiar environment (Kimi Code), it is even stronger. If you prefer not to live in the Kimi CLI, want to boost your main agent’s frontend ability, or want to spend limited Kimi tokens where they count — this is for you.

Thin ACP bridge only. No reimplemented system prompts. Tools, swarm, skills, and models stay with Kimi Code.

| | |
| --- | --- |
| **Version** | **0.1.0** |
| **Hosts** | Claude Code, Grok, or other compatible hosts |
| **Node** | ≥ 18.18 |
| **Repository** | [github.com/oppnc/kimi-plugin-cc](https://github.com/oppnc/kimi-plugin-cc) |

> Changelog: [English](CHANGELOG.md) · [中文](CHANGELOG.zh-CN.md)  
> Contributing: [CONTRIBUTING.md](CONTRIBUTING.md) · Security: [SECURITY.md](SECURITY.md)  
> For coding agents / maintainers: **[AGENTS.md](AGENTS.md)**

## Features

| Feature | How |
| --- | --- |
| Full Kimi agent | `kimi acp` → `session/prompt` |
| Modes | `--mode default\|plan\|auto\|yolo` |
| Multimodal | `--image` / `--video` / `--media` |
| Goals | `goal` / `--goal` |
| Resume | `--resume` / `--session <id>` + `sessions` |
| Git context (optional) | `--git` / `--base` |
| Jobs | `status` / `result` / `cancel` |
| Host UX | `/kimi:rescue` → Agent `kimi-rescue` |

## Requirements

- Node.js ≥ 18.18
- [Kimi Code CLI](https://github.com/MoonshotAI/kimi-code) installed and logged in (`kimi login`)
- A compatible host (Claude Code, Grok, …)

## Install

### Claude Code

```text
/plugin marketplace add oppnc/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

Then run `/kimi:setup`. If the new commands are not visible in the current session, run `/reload-plugins` first.

Local path (development):

```text
/plugin marketplace add /absolute/path/to/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

### Grok

```bash
grok plugin install oppnc/kimi-plugin-cc#plugins/kimi --trust
# or from a local checkout:
# grok plugin install /path/to/kimi-plugin-cc/plugins/kimi --trust
```

## Related

| Package | Host |
| --- | --- |
| **kimi-plugin-cc** (this repo) | Claude Code / Grok |
| [kimi-plugin-codex](https://github.com/oppnc/kimi-plugin-codex) | OpenAI Codex (if published) |

## License

MIT — see [LICENSE](./LICENSE).  
Kimi Code is a separate project with its own license.

---

**中文文档:** [README.zh-CN.md](README.zh-CN.md)
