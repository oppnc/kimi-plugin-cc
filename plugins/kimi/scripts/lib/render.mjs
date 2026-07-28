export function renderSetupReport(report) {
  const lines = [
    "Kimi Plugin CC — setup",
    "─────────────────────",
    `kimi binary : ${report.kimiBin || "(not found)"}`,
    `version     : ${report.version || "(unknown)"}`,
    `acp probe   : ${report.acpOk ? "ok" : "FAILED"}`,
    `agent       : ${[report.agentName, report.agentVersion].filter(Boolean).join(" ") || "-"}`,
  ];
  if (report.defaultModel) {
    lines.push(`default model: ${report.defaultModel}`);
  }
  if (report.modes) {
    lines.push(`modes       : ${report.modes}`);
  }
  if (report.error) {
    lines.push(`error       : ${report.error}`);
  }
  if (report.hints?.length) {
    lines.push("", "Hints:");
    for (const h of report.hints) {
      lines.push(`- ${h}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

export function renderTaskResult(result) {
  const lines = [];
  lines.push(`Kimi task finished (stop=${result.stopReason || "unknown"})`);
  if (result.mode) {
    lines.push(`mode: ${result.mode}`);
  }
  if (result.sessionId) {
    lines.push(`session: ${result.sessionId}`);
  }
  if (result.jobId) {
    lines.push(`job: ${result.jobId}`);
  }
  lines.push("");
  lines.push(result.text?.trim() || "(no agent text)");
  if (result.toolCalls?.length) {
    lines.push("");
    lines.push(`tool events: ${result.toolCalls.length}`);
  }
  return `${lines.join("\n")}\n`;
}

export function renderJobStatus(job) {
  if (!job) {
    return "No job found.\n";
  }
  const lines = [
    `job       : ${job.id}`,
    `status    : ${job.status}`,
    `cwd       : ${job.cwd}`,
    `mode      : ${job.mode || "-"}`,
    `created   : ${job.createdAt}`,
    `updated   : ${job.updatedAt}`,
  ];
  if (job.sessionId) {
    lines.push(`session   : ${job.sessionId}`);
  }
  if (job.stopReason) {
    lines.push(`stop      : ${job.stopReason}`);
  }
  if (job.error) {
    lines.push(`error     : ${job.error}`);
  }
  if (job.resultText) {
    lines.push("", "--- result ---", job.resultText.trim());
  }
  return `${lines.join("\n")}\n`;
}

export function renderStatusList(jobs) {
  if (!jobs.length) {
    return "No jobs recorded for this workspace.\n";
  }
  const lines = ["Recent Kimi jobs:", ""];
  for (const j of jobs) {
    const preview = (j.promptPreview || "").replace(/\s+/g, " ").slice(0, 60);
    lines.push(
      `- ${j.id}  ${String(j.status).padEnd(10)}  ${j.updatedAt || j.createdAt}  ${preview}`,
    );
  }
  lines.push("", "Use: kimi-companion.mjs result <job-id>");
  return `${lines.join("\n")}\n`;
}
