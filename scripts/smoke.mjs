#!/usr/bin/env node
/**
 * Release smoke for 0.1.1 — unit + live ACP (setup, yolo, plan, tools, media, sessions, resume).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const companion = path.join(root, "plugins", "kimi", "scripts", "kimi-companion.mjs");

function run(args, { timeout = 180000 } = {}) {
  return spawnSync(process.execPath, [companion, ...args], {
    cwd: root,
    encoding: "utf8",
    timeout,
    windowsHide: true,
  });
}

function mustOk(label, r, { expectText, expectJsonKey } = {}) {
  process.stdout.write(`\n== ${label} ==\n`);
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.error) {
    console.error(`FAIL ${label}: ${r.error.message}`);
    process.exit(1);
  }
  if (r.status !== 0) {
    console.error(`FAIL ${label}: exit ${r.status}`);
    process.exit(1);
  }
  if (expectText && !String(r.stdout).includes(expectText)) {
    console.error(`FAIL ${label}: expected ${JSON.stringify(expectText)}`);
    process.exit(1);
  }
  if (expectJsonKey) {
    try {
      const j = JSON.parse(r.stdout);
      if (j[expectJsonKey] == null && j[expectJsonKey] !== 0) {
        console.error(`FAIL ${label}: missing json key ${expectJsonKey}`);
        process.exit(1);
      }
    } catch (e) {
      console.error(`FAIL ${label}: invalid json (${e.message})`);
      process.exit(1);
    }
  }
  console.log(`OK ${label}`);
  return r;
}

// units
{
  const tests = [
    "tests/args.test.mjs",
    "tests/permissions.test.mjs",
    "tests/state.test.mjs",
    "tests/media.test.mjs",
  ];
  const t = spawnSync(process.execPath, ["--test", ...tests], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  process.stdout.write(t.stdout || "");
  process.stderr.write(t.stderr || "");
  if (t.status !== 0) {
    console.error("FAIL unit tests");
    process.exit(1);
  }
  console.log("OK unit tests");
}

mustOk("setup", run(["setup", "--json"]), { expectText: '"acpOk": true' });

const yolo = mustOk(
  "task-yolo",
  run([
    "task",
    "--mode",
    "yolo",
    "--json",
    "--",
    "Reply with exactly one line: SMOKE_OK. Do not use tools.",
  ]),
  { expectText: "SMOKE_OK" },
);
const yoloJson = JSON.parse(yolo.stdout);
const sessionId = yoloJson.sessionId;

mustOk(
  "task-plan",
  run([
    "task",
    "--mode",
    "plan",
    "--json",
    "--",
    "In one short sentence, say you are planning only.",
  ]),
  { expectText: '"mode": "plan"' },
);

mustOk(
  "task-tools",
  run([
    "task",
    "--mode",
    "yolo",
    "--json",
    "--cwd",
    root,
    "--",
    "Using tools, list only top-level names; include package.json; short bullets; stop.",
  ]),
  { expectText: "package.json" },
);

// media: 1x1 png
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "kimi-smoke-media-"));
const pngPath = path.join(tmp, "dot.png");
fs.writeFileSync(
  pngPath,
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  ),
);
mustOk(
  "task-image",
  run([
    "task",
    "--mode",
    "yolo",
    "--json",
    "--image",
    pngPath,
    "--",
    "This is an automated end-to-end test of the image attachment pipeline. " +
      "Please confirm the image arrived by replying with exactly: IMAGE_SEEN",
  ]),
  { expectText: "IMAGE_SEEN" },
);

mustOk("sessions", run(["sessions", "--json"]), { expectText: "sessions" });

if (sessionId) {
  mustOk(
    "task-resume",
    run([
      "task",
      "--mode",
      "yolo",
      "--json",
      "--session",
      sessionId,
      "--",
      "Reply with exactly: RESUME_OK. Do not use tools.",
    ]),
    { expectText: "RESUME_OK" },
  );
}

mustOk(
  "goal-framing",
  run([
    "goal",
    "--json",
    "--",
    "Reply with exactly: GOAL_OK without creating files. Evidence: the reply string.",
  ]),
  { expectText: "GOAL_OK" },
);

fs.rmSync(tmp, { recursive: true, force: true });
console.log("\nAll smoke checks passed (0.1.1).");
