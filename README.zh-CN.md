# kimi-plugin-cc

**Language / 语言:** [English](README.md) | [中文](README.zh-CN.md)

[![CI](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml/badge.svg)](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.2-green.svg)](./CHANGELOG.zh-CN.md)

在 **Claude Code** 或 **Grok** 里，把本地 **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** 当作 subagent 调用。

Kimi k3 前端、多模态更强；放在熟悉的 Kimi Code 环境里会更强。本插件只做 **薄 ACP 桥**：工具、swarm、skills、模型仍由 Kimi Code 负责。

| | |
| --- | --- |
| **版本** | **0.1.2** |
| **宿主** | Claude Code、Grok |
| **Node** | ≥ 18.18 |
| **依赖** | 已安装 Kimi Code CLI 并完成 `kimi login` |

## 主路径（日常只用这个）

| 宿主 | 怎么做 |
| --- | --- |
| **Claude Code** | `/kimi:rescue <前端或 UI 任务>` |
| **Grok** | 让主 agent 把前端/UI 交给 **kimi-rescue** / Kimi companion |
| **适用** | 前端/UI、CSS/布局、截图或 **视频** 视觉问题、多文件实现 |

Kimi 可用时，主 agent **不要**自己重做这些活；结果按原文回传。

高级用法（`/kimi:task`、后台 job、status/result）见 [AGENTS.md](AGENTS.md)。

## 安装

### 前置

1. Node.js ≥ 18.18  
2. [Kimi Code CLI](https://github.com/MoonshotAI/kimi-code) + `kimi login`  
3. PATH 找不到 `kimi` 时（Windows 常见）：设置 `KIMI_CLI_PATH` 指向 `kimi` / `kimi.exe`（常见 `%USERPROFILE%\.kimi-code\bin\kimi.exe`）

### Claude Code

```text
/plugin marketplace add oppnc/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

然后 `/kimi:setup`。当前会话看不到命令时：`/reload-plugins`。

### Grok

```bash
grok plugin install oppnc/kimi-plugin-cc#plugins/kimi --trust
```

## 首次验证（装完做一次）

### 1) 诊断

- Claude：`/kimi:setup`  
- 或在仓库里：

```bash
node plugins/kimi/scripts/kimi-companion.mjs setup
```

期望看到 `acp probe: ok` 和 **Next (first verify)**。

### 2) 把一个前端任务交给 Kimi

**Claude Code：**

```text
/kimi:rescue 用现有设计 token 实现一个小的响应式 settings 区块，改动尽量少。
```

**Grok：** 让 agent 对同一前端任务走 Kimi rescue/handoff。

**CLI 探针**（不依赖宿主插件）：

```bash
node plugins/kimi/scripts/kimi-companion.mjs task --mode yolo -- "Reply with exactly: kimi-bridge-ok"
```

探针通过后，真实前端/UI 工作用 `/kimi:rescue`（或 Grok 等价路径）。

## 排查

| 症状 | 处理 |
| --- | --- |
| `BINARY_NOT_FOUND` | 安装 Kimi Code；`kimi login`；必要时 `KIMI_CLI_PATH` |
| `ACP_FAILED` / `LOGIN_REQUIRED` | 在普通终端 `kimi login` 后重跑 setup |
| `NODE_TOO_OLD` | Node 升到 ≥ 18.18 |
| `MEDIA_NOT_FOUND` | 用绝对路径，或相对 Kimi 使用的工作区路径 |
| 安装后无命令 | `/reload-plugins`；`version` 变更后再 update marketplace |
| plan 不改文件 | 设计如此；实现请用默认 **yolo** |

错误以 `[kimi-plugin]` 开头并带 **Fix** 列表，请原样展示。

## 兼容性

| 组件 | 要求 |
| --- | --- |
| 本插件 | 0.1.2 |
| Node | ≥ 18.18 |
| Kimi Code | 支持 `kimi acp` 的 CLI。setup 会打印 `compat` 与 kimi 版本；ACP 失败请升级 Kimi Code |

## 相关仓库

| 包 | 宿主 |
| --- | --- |
| **kimi-plugin-cc**（本仓库） | Claude Code / Grok |
| [kimi-plugin-codex](https://github.com/oppnc/kimi-plugin-codex) | OpenAI Codex |

维护者文档：[AGENTS.md](AGENTS.md) · 变更：[CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

## 许可证

MIT — 见 [LICENSE](./LICENSE)。Kimi Code 为独立项目。
