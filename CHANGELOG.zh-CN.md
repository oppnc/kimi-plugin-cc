# 变更日志

**Language / 语言:** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

## 0.2.1（开发中）

### 修复
- **取消竞态（POSIX）：** runner 收到 SIGTERM 时不再覆盖宿主已置为 `cancelled` 的 job——`failOrphan` 跳过已取消的 job。
- **日志无限增长：** job 裁剪现在会连同 `logs/<job>.log` 一起删除。
- **未知 flag 泄漏进 Kimi 的 prompt：** `task`/`goal` 现在拒绝未知的 `--` 选项，而不是悄悄并进任务文本（任务文本请放在 `--` 之后）。
- **media TOCTOU：** 文件在 `existsSync` 与 `statSync` 之间被删时返回干净错误，不再裸抛异常。
- **plan 模式零计划文本：** `task --mode plan` 只用了只读工具、结束时没有 agent 文本，现在算**失败**交接（`ok:false`、exit 1、`planEmptyText:true`），不再误报成功——plan 模式下计划文本本身就是交付物。
- **goal 框架不再绕过 Q&A / 纯回复排除：** `--goal` 且 `Objective:` 为 `Reply with exactly: …` 或 how-to 问答时，不再触发 Mode B continue nudge（此前 `asGoal` 会无条件判为 action）。

### 变更
- **Mode A 空 turn 重试：** 默认 **2 → 5**；可用 `--empty-retries <n>` 配置（显式值 → `KIMI_EMPTY_RETRIES` 环境变量 → 默认；`0` 禁用）。
- **`--timeout` 不再丢会话：** ACP 请求超时时客户端发送 `session/cancel` 并保留会话；失败的 job 会记录 `sessionId`，可用 `--resume` 继续同一线程。
- **`status --wait` / `result --wait`：** 等待预算耗尽而 job 仍在 `running` 时退出码为**非零**（等待超时 ≠ 交接完成）。
- **裁剪节流：** prune 扫描每 30s 至多一次，心跳写入保持廉价。
- **`splitRawArgumentString`** 现在支持引号段内的转义引号/反斜杠。
- **文档：** `default` 模式明确为全自动批准（与 `auto`/`yolo` 相同；仅 `plan` 拒绝写入）。移除 task 解析中未使用的 `waitTimeoutMs` 字段。

### 新增
- `tests/acp-client.test.mjs` + `tests/fixtures/fake-kimi-acp.mjs`（请求超时会话保留、可配置空 turn 重试预算）；`tests/companion-cli.test.mjs`（无需 Kimi 的 CLI 级契约：`--wait` 退出码、孤儿回收、取消竞态、resume 提示、未知 flag 拒绝）——并同步到 Codex 包。

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
