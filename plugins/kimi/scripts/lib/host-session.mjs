/**
 * Best-effort host session id for job scoping (Claude / Grok / generic).
 */
import process from "node:process";

export function getHostSessionId() {
  return (
    process.env.CLAUDE_SESSION_ID ||
    process.env.CLAUDE_CODE_SESSION_ID ||
    process.env.GROK_SESSION_ID ||
    process.env.GROK_CODE_SESSION_ID ||
    process.env.KIMI_PLUGIN_CC_HOST_SESSION ||
    null
  );
}
