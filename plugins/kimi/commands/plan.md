---
description: Kimi ACP plan mode (planning-first; mutating tools rejected by companion policy)
argument-hint: '<what to plan — architecture, UI structure, etc.>'
allowed-tools: Bash(node:*)
---

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/kimi-companion.mjs" task --mode plan $ARGUMENTS
```

Return stdout verbatim.
