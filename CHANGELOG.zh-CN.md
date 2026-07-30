# 变更日志

**Language / 语言:** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

## 0.2.0

公开包版本自 GitHub **0.1.x** 起记为 **0.2.0**（与 **kimi-plugin-codex** 0.2.0 锁步）。

### 新增
- 后台 job 的 **phase** + **lastProgressMessage**（queued → launching → starting_acp → running → 终态）
- 更丰富的 status 渲染：phase、progress、resume 提示；列表 preview 50 + phase padEnd 18
- `lib/prompt.mjs` + `tests/prompt.test.mjs`；可选 `KIMI_BRIDGE_HANDOFF=1`（默认关闭）

### 变更
- companion 核心与 **kimi-plugin-codex** 0.2.0 对齐（共享 progress / prompt 栈）
- 加强宿主触发语气：agent/命令/skill 文案对前端/UI（含风格稿、参考页）使用 **REQUIRED / MUST / MUST NOT**；Kimi 可用时主 agent 不得自己写 UI
- 宿主 command 薄壳与 Codex skills **功能类似**（路由表、flag、long-run 轮询、Fix 文案）
- 版本 **0.2.0**（与 Codex 兄弟包对齐）

## 0.1.2

### 新增
- README + setup 的 **首次验证**（把一个小前端任务交给 Kimi）
- Setup doctor：Node 版本、workspace 来源、Kimi Code **compat** 软检查、可行动 `errorCode`
- 标准化 `[kimi-plugin]` 错误与 **Fix** 列表（`lib/errors.mjs`）
- 从宿主环境解析工作区根目录
- 媒体路径相对 workspace 解析 + 更清晰的缺失错误

### 变更
- 用户文档只保留主路径：`/kimi:rescue`；高级细节见 AGENTS.md
- 加强前端 / 截图 / 视频 触发描述

## 0.1.1

### 修复
- 后台任务：runner PID 已死时，在 `status` / `result` / `--wait` 将假 `running` 回收为 `failed`（`orphaned`）
- 后台 `_bg-run` 写日志到 `~/.kimi-plugin-cc/logs/`，心跳更新 `updatedAt` / 工具计数，信号与未捕获异常时 finalize
- Rescue 指导：默认前台；仅当用户要求时再 `--background`

## 0.1.0

首次公开发布：在 Claude Code / Grok 中通过 ACP 将本机 **Kimi Code** 作为 subagent 调用。

### 新增

- 薄 ACP companion：`setup`、`task`、`goal`、`sessions`、`status` / `result` / `cancel`
- 模式：`default` | `plan` | `auto` | `yolo`（经 `session/set_config_option`）
- 多模态：`--image` / `--video` / `--media`（小图 ACP image block；大图/SVG/视频走路径供 `ReadMediaFile`）
- Goals：`goal` 命令与 `--goal`
- 会话续聊：`--resume` / `--session <id>`；`sessions` 列出 ACP 会话
- 可选 git 上下文：`--git` / `--base`（原始事实，不是审查 rubric）
- 后台任务 + status/result 的 `--wait`；宿主会话 id 绑定（`CLAUDE_SESSION_ID` / `GROK_SESSION_ID`）
- setup 打印 ACP `configOptions` 模型目录；setup `--json` 含 `ok` / `pluginVersion`
- 宿主 UX：slash 命令 + `/kimi:rescue` → Agent `kimi-rescue`（只转发）
- 单元测试（`npm test`）与真机门槛（`npm run smoke`）
- 默认无 ACP 任务截止时间；需要硬超时再传 `--timeout` / `--wait-timeout`（优先用 `status` / `result` 轮询）

### 修复 / 加固

- Plan 模式：拒绝 `ExitPlanMode`（`plan_reject_and_exit`）；plan 策略下拒绝写/改类工具
- 可选 ACP 超时在触发时附带 kimi stderr 尾部
- Windows：优先原生 `kimi.exe`；跳过 `.ps1` shim；`.cmd` 经 shell 启动
- POSIX 独立进程组便于 cancel；Windows 杀进程树
- job 原子写入；拒绝路径穿越式 job id；jobs 目录裁剪为最近 100 条
- 前台失败记为 failed job
- `sessions --all` 不再多余启动第二个 ACP 进程
- task 参数：`--` 分隔；仅当单 token 以 `--` 开头时做 blob 拆分
- 后台任务入队时将 media 路径固定为绝对路径

### 说明

- 默认无 review-gate hook（审查不是产品重心）
- MCP 转发仍为可选/高级能力
- Agent / 维护者文档：[AGENTS.md](AGENTS.md)
- 开源配套：GitHub CI、SECURITY.md、CONTRIBUTING.md、Issue/PR 模板

---

**English:** [CHANGELOG.md](CHANGELOG.md)
