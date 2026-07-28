#!/usr/bin/env node
/**
 * Validate marketplace + plugin manifests (JSON) and optional CLI validators.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketplacePath = path.join(root, ".claude-plugin", "marketplace.json");
const pluginPath = path.join(root, "plugins", "kimi", ".claude-plugin", "plugin.json");
const packagePath = path.join(root, "package.json");

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    fail(`cannot parse ${file}: ${e.message}`);
  }
}

const pkg = readJson(packagePath);
const market = readJson(marketplacePath);
const plugin = readJson(pluginPath);

if (!pkg.version) fail("package.json missing version");
if (plugin.version !== pkg.version) {
  fail(`plugin.json version ${plugin.version} != package.json ${pkg.version}`);
}
if (market.metadata?.version && market.metadata.version !== pkg.version) {
  fail(`marketplace metadata.version ${market.metadata.version} != ${pkg.version}`);
}
for (const p of market.plugins || []) {
  if (p.version && p.version !== pkg.version) {
    fail(`marketplace plugin ${p.name} version ${p.version} != ${pkg.version}`);
  }
  if (p.source && typeof p.source === "string" && p.source.startsWith("./")) {
    const src = path.join(root, p.source);
    if (!fs.existsSync(src)) fail(`marketplace source missing: ${p.source}`);
  }
}

if (plugin.name !== "kimi") fail(`expected plugin name kimi, got ${plugin.name}`);
if (market.name !== "kimi-code-cc") fail(`expected marketplace name kimi-code-cc`);

const companionSrc = fs.readFileSync(
  path.join(root, "plugins/kimi/scripts/kimi-companion.mjs"),
  "utf8",
);
const acpSrc = fs.readFileSync(
  path.join(root, "plugins/kimi/scripts/lib/acp-client.mjs"),
  "utf8",
);
const companionVer = companionSrc.match(/const VERSION = "([^"]+)"/)?.[1];
const acpVer = acpSrc.match(/const PLUGIN_VERSION = "([^"]+)"/)?.[1];
if (companionVer !== pkg.version) {
  fail(`kimi-companion VERSION ${companionVer} != package.json ${pkg.version}`);
}
if (acpVer !== pkg.version) {
  fail(`acp-client PLUGIN_VERSION ${acpVer} != package.json ${pkg.version}`);
}

const requiredDirs = [
  "plugins/kimi/commands",
  "plugins/kimi/agents",
  "plugins/kimi/skills",
  "plugins/kimi/scripts",
];
for (const d of requiredDirs) {
  if (!fs.existsSync(path.join(root, d))) fail(`missing directory ${d}`);
}

console.log(`OK: versions aligned at ${pkg.version}`);
console.log(`OK: marketplace ${market.name}, plugin ${plugin.name}`);

function tryCli(cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.error && r.error.code === "ENOENT") {
    console.log(`skip: ${cmd} not found`);
    return;
  }
  if (r.status !== 0) {
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
    fail(`${cmd} ${args.join(" ")} exited ${r.status}`);
  }
  console.log(`OK: ${cmd} ${args.join(" ")}`);
}

tryCli("claude", ["plugin", "validate", "."]);
tryCli("claude", ["plugin", "validate", "./plugins/kimi", "--strict"]);
tryCli("grok", ["plugin", "validate", "./plugins/kimi"]);
