---
description: First-run doctor — check local Kimi Code + ACP; print next frontend verify steps
argument-hint: '[--json]'
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" setup $ARGUMENTS
```

Return the setup output to the user (verbatim is fine).

If setup fails, show the `[kimi-plugin]` error and Fix list as-is. Do not invent install steps beyond:

1. Install Kimi Code: https://github.com/MoonshotAI/kimi-code  
2. Terminal: `kimi login`  
3. Optional: `KIMI_CLI_PATH` if the binary is not on PATH  

If setup **ok**, first verify:

- **Frontend/UI must go to Kimi**, not the main agent: `/kimi:rescue …`  
- Claude: `/kimi:rescue Implement a small responsive settings section using existing design tokens`  
- Grok: spawn `subagent_type: "kimi:kimi-rescue"` (or `/kimi:rescue`) — do not write UI in the main agent  
- CLI probe: `node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode yolo -- "Reply with exactly: kimi-bridge-ok"`  
- Long work later: `/kimi:status` / `/kimi:result`
