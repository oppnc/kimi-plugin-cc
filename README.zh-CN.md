# kimi-plugin-cc

**Language / 语言:** [English](README.md) | [中文](README.zh-CN.md)

[![CI](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml/badge.svg)](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.1-green.svg)](./CHANGELOG.zh-CN.md)

这个插件只做一件事：把 [Kimi Code](https://github.com/MoonshotAI/kimi-code) 作为 subagent 调用。

Kimi k3 的前端、多模态能力很强；放在熟悉的环境 Kimi Code 里会更强。如果你不想直接用 kimi code，想给主 Agent 补强前端，或把有限的 kimi tokens 花在刀刃上——你来对了。

只做薄 ACP 桥接，不重写 Kimi 的 system prompt。工具、swarm、skills、模型仍由 Kimi Code 自己负责，给 Kimi k3 最熟悉的环境。

| | |
| --- | --- |
| **版本** | **0.1.1** |
| **宿主** | Claude Code、Grok，或其它兼容工具 |
| **Node** | ≥ 18.18 |
| **仓库** | [github.com/oppnc/kimi-plugin-cc](https://github.com/oppnc/kimi-plugin-cc) |

> 变更日志：[中文](CHANGELOG.zh-CN.md) · [English](CHANGELOG.md)  
> 贡献：[CONTRIBUTING.md](CONTRIBUTING.md) · 安全：[SECURITY.md](SECURITY.md)  
> 给 coding agent / 维护者：[AGENTS.md](AGENTS.md)

## 功能

| 功能 | 方式 |
| --- | --- |
| 完整 Kimi agent | `kimi acp` → `session/prompt` |
| 模式 | `--mode default\|plan\|auto\|yolo` |
| 多模态 | `--image` / `--video` / `--media` |
| Goals | `goal` / `--goal` |
| 续聊 | `--resume` / `--session <id>` + `sessions` |
| Git 上下文（可选） | `--git` / `--base` |
| 任务记录 | `status` / `result` / `cancel` |
| 宿主 UX | `/kimi:rescue` → Agent `kimi-rescue` |

## 环境要求

- Node.js ≥ 18.18
- 已安装并登录 [Kimi Code CLI](https://github.com/MoonshotAI/kimi-code)（`kimi login`）
- 兼容宿主（Claude Code、Grok 等）

## 安装

### Claude Code

```text
/plugin marketplace add oppnc/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

然后跑一次 `/kimi:setup`。若当前会话还看不到新命令，先执行 `/reload-plugins`。

已安装用户要拿到新版本：

```text
/plugin marketplace update kimi-code-cc
```

再在 Installed 里更新 **kimi**（或重装）。Claude Code 只有在插件声明的 `version` 变化时才会视为有更新。

本地开发：

```text
/plugin marketplace add /absolute/path/to/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

### Grok

```bash
grok plugin install oppnc/kimi-plugin-cc#plugins/kimi --trust
# 或本地：
# grok plugin install /path/to/kimi-plugin-cc/plugins/kimi --trust
```

## 相关仓库

| 包 | 宿主 |
| --- | --- |
| **kimi-plugin-cc**（本仓库） | Claude Code / Grok |
| [kimi-plugin-codex](https://github.com/oppnc/kimi-plugin-codex) | OpenAI Codex（如已发布） |

## 许可证

MIT — 见 [LICENSE](./LICENSE)。  
Kimi Code 为独立项目，许可证以官方仓库为准。

---

**English:** [README.md](README.md)
