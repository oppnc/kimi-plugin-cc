# kimi-plugin-cc

**Language / 语言:** [English](README.md) | [中文](README.zh-CN.md)

[![CI](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml/badge.svg)](https://github.com/oppnc/kimi-plugin-cc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.1-green.svg)](./CHANGELOG.zh-CN.md)

本仓库只干一件事：在 **Claude Code** 或 **Grok** 等兼容的 harness 里，把本地 **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** 当作 subagent 调用。

Kimi K3 前端、多模态很强，放在熟悉的 Kimi Code 环境里会更强。专业评测印证了这点：K3 训练时保留了 thinking history，若 harness 没有正确回传推理历史，表现会不稳定——Moonshot 官方建议用 Kimi Code 这样的 verified harness 来保证质量（[来源](https://www.nxcode.io/resources/news/kimi-k3-benchmarks-coding-agent-evaluation-guide-2026)）。Hugging Face 的量化记录也显示，K3 用 Kimi Code harness 评测，换成 Claude Code harness 只得到 73.7（[来源](https://huggingface.co/unsloth/Kimi-K3-GGUF)）。
更重要的是，更换 harness 会直接改变跑分**和**运行成本——换言之，让 K3 留在 Kimi Code 里既更准也更省。如果你已经习惯了你的 harness，觉得切换工具很麻烦，本插件让你在 Claude Code / Grok 里直接把 Kimi Code 当 subagent 调用，K3 仍在它最熟悉的 Kimi Code 环境里干活。
如果你馋 Kimi code 最独特的**视频上下文**功能，本插件同样支持。

本插件会自动触发 Kimi——我们要求 Agent 在涉及 UI/交互等前端场景时必须调用 Kimi 来完成。
你也可以显式要求，例如「这个页面交给 Kimi 来处理」。
自动触发的规则住在插件里（`agents/kimi-rescue.md` / `commands/rescue.md` 的 description），装上就有默认的前端/UI 强制交接。想加强或放宽触发范围，可以在 `~/.claude/CLAUDE.md` 里叠加全局指令，也可以在项目里修改 `AGENTS.md` 对单个仓库做专门调整。

本插件只做 **薄 ACP 桥**：工具、swarm、skills、模型仍由 Kimi Code 负责，为 K3 提供最熟悉的环境。

| | |
| --- | --- |
| **版本** | **0.2.1** |
| **宿主** | Claude Code、Grok |
| **Node** | ≥ 18.18 |
| **依赖** | 已安装 Kimi Code CLI 并完成 `kimi login` |

## 主路径（日常只用这个）

| 宿主 | 怎么做 |
| --- | --- |
| **Claude Code** | `/kimi:rescue <前端或 UI 任务>` |
| **Grok** | 主 agent **必须** spawn **`kimi:kimi-rescue`**（或 `/kimi:rescue`）做前端/UI，**禁止**主线程自己写 UI |
| **适用（强制）** | 前端/UI、风格稿/参考页、CSS/布局、截图或 **视频** 视觉问题、多文件实现 |

Kimi 可用时，主 agent **不得**自己实现这些工作；结果按原文回传。

> **实测**：在 Claude Code 里让 Kimi 把 LIMS 前端重设计为 Linear 风格浅色主题，Kimi 用 2 分 55 秒独立完成全部 CSS/JS/HTML 改写。
>
> ![Claude Code 调用 Kimi 完成前端重设计](docs/assets/cc_test.png)

高级用法（`/kimi:task`、后台 job、status/result）见 [AGENTS.md](AGENTS.md)。

## 安装

需要：**Node.js ≥ 18.18**、本机 **[Kimi Code](https://github.com/MoonshotAI/kimi-code)** 并完成 `kimi login`。

### 丢给 AI 安装

把下面整段复制给 Claude Code / Grok 等，让它代你装：

```text
请从 https://github.com/oppnc/kimi-plugin-cc 安装 Kimi 插件

1. 前置：Node.js ≥ 18.18，已安装 Kimi Code CLI 并完成 kimi login。
2. Claude Code：
   /plugin marketplace add oppnc/kimi-plugin-cc
   /plugin install kimi@kimi-code-cc
   然后 /kimi:setup（看不到命令时 /reload-plugins）
3. Grok：
   grok plugin install oppnc/kimi-plugin-cc#plugins/kimi --trust
4. 用 /kimi:rescue（或 Grok 的 kimi:kimi-rescue）做一个极小前端任务冒烟。

Windows：PATH 找不到 kimi 时，设置 KIMI_CLI_PATH 指向 kimi.exe 全路径
（常见 %USERPROFILE%\.kimi-code\bin\kimi.exe）。
```

### 自己装

**Claude Code**

```text
/plugin marketplace add oppnc/kimi-plugin-cc
/plugin install kimi@kimi-code-cc
```

然后 `/kimi:setup`。当前会话看不到命令时：`/reload-plugins`。

**Grok**

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
| 本插件 | 0.2.1 |
| Node | ≥ 18.18 |
| Kimi Code | ≥ 0.30.0（支持 `kimi acp` 的 CLI）。setup 会打印 `compat` 与 kimi 版本；ACP 失败请升级 Kimi Code |

## 相关仓库

| 包 | 宿主 |
| --- | --- |
| **kimi-plugin-cc**（本仓库） | Claude Code / Grok |
| [kimi-plugin-codex](https://github.com/oppnc/kimi-plugin-codex) | OpenAI Codex |

维护者文档：[AGENTS.md](AGENTS.md) · 变更：[CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

## 许可证

MIT — 见 [LICENSE](./LICENSE)。Kimi Code 为独立项目。
