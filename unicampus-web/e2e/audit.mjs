import { parseArgs } from "node:util";
import { DEFAULT_BASE_URL } from "./config.mjs";
import { launchResilientBrowser } from "./browser.mjs";
import { runTier1 } from "./tiers/tier1.mjs";
import { runTier2 } from "./tiers/tier2.mjs";
import { runTier3 } from "./tiers/tier3.mjs";
import { runTier4 } from "./tiers/tier4.mjs";

const USAGE_TEXT = `Usage: node e2e/audit.mjs [options]

Options:
  --tier=1|2|3|4|all      Tier to run (default: all)
  --base-url=<url>        Target server URL (overrides BASE_URL, default: ${DEFAULT_BASE_URL})
  --json                  Print structured JSON report to stdout
  -h, --help              Show this help message
`;

function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        tier: { type: "string", default: "all" },
        "base-url": { type: "string" },
        json: { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
      strict: true,
      allowPositionals: false,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Invalid arguments: ${msg}\n`);
    console.error(USAGE_TEXT);
    return { valid: false, exitCode: 1 };
  }

  if (parsed.values.help) {
    console.log(USAGE_TEXT);
    return { valid: false, exitCode: 0 };
  }

  const tierRaw = (parsed.values.tier || "all").toLowerCase();
  if (!["1", "2", "3", "4", "all"].includes(tierRaw)) {
    console.error(`Invalid --tier value "${parsed.values.tier}". Must be 1, 2, 3, 4, or all.\n`);
    console.error(USAGE_TEXT);
    return { valid: false, exitCode: 1 };
  }

  const baseUrlRaw = parsed.values["base-url"] || process.env.BASE_URL || DEFAULT_BASE_URL;
  let normalizedUrl;
  try {
    normalizedUrl = new URL(baseUrlRaw).toString().replace(/\/$/, "");
  } catch {
    console.error(`Invalid --base-url value "${baseUrlRaw}". Must be a valid http(s) URL.\n`);
    return { valid: false, exitCode: 1 };
  }

  return {
    valid: true,
    tier: tierRaw,
    baseUrl: normalizedUrl,
    json: Boolean(parsed.values.json),
  };
}

async function verifyServerReachable(baseUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(baseUrl, { signal: controller.signal });
    return { ok: res.status < 500, status: res.status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

function summarizeTier(tierName, checks) {
  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.length - passed;
  return {
    tier: tierName,
    total: checks.length,
    passed,
    failed,
    checks,
  };
}

function printHumanReport(report) {
  console.log(`=== UniCampus Web E2E Audit (${report.baseUrl}) ===`);
  console.log(`Browser: ${report.browser}`);
  console.log("");

  for (const tierSummary of report.tiers) {
    const statusLabel = tierSummary.failed === 0 ? "PASS" : "FAIL";
    console.log(
      `[${statusLabel}] ${tierSummary.tier}: ${tierSummary.passed}/${tierSummary.total} checks passed (${tierSummary.failed} failed)`,
    );

    const failedChecks = tierSummary.checks.filter((c) => !c.passed);
    if (failedChecks.length > 0) {
      for (const chk of failedChecks) {
        console.log(`  FAIL ${chk.id}: ${chk.detail}`);
      }
    }
    console.log("");
  }

  const overallStatus = report.totalFailed === 0 ? "PASS" : "FAIL";
  console.log(
    `OVERALL ${overallStatus}: ${report.totalPassed}/${report.totalChecks} checks passed (${report.totalFailed} failed)`,
  );
}

async function main() {
  const cli = parseCliArgs(process.argv.slice(2));
  if (!cli.valid) {
    process.exit(cli.exitCode);
  }

  const reachability = await verifyServerReachable(cli.baseUrl);
  if (!reachability.ok) {
    const reason = reachability.error
      ? reachability.error
      : `HTTP ${reachability.status}`;
    console.error(`Target server ${cli.baseUrl} is unreachable (${reason}).`);
    process.exit(1);
  }

  const { browser, launchedWith } = await launchResilientBrowser();
  const tierSummaries = [];

  try {
    const selectedTiers = cli.tier === "all" ? ["1", "2", "3", "4"] : [cli.tier];

    for (const tierId of selectedTiers) {
      if (tierId === "1") {
        const checks = await runTier1(browser, cli.baseUrl);
        tierSummaries.push(summarizeTier("Tier 1 (Route Health & Shell)", checks));
      } else if (tierId === "2") {
        const checks = await runTier2(browser, cli.baseUrl);
        tierSummaries.push(summarizeTier("Tier 2 (Layout, Overflow & Boundary)", checks));
      } else if (tierId === "3") {
        const checks = await runTier3(browser, cli.baseUrl);
        tierSummaries.push(summarizeTier("Tier 3 (Interactive Flows & Navigation)", checks));
      } else if (tierId === "4") {
        const checks = await runTier4(browser, cli.baseUrl);
        tierSummaries.push(summarizeTier("Tier 4 (Canonical Data, Math & Anti-Slop)", checks));
      }
    }
  } finally {
    await browser.close();
  }

  const totalChecks = tierSummaries.reduce((acc, t) => acc + t.total, 0);
  const totalPassed = tierSummaries.reduce((acc, t) => acc + t.passed, 0);
  const totalFailed = tierSummaries.reduce((acc, t) => acc + t.failed, 0);

  const report = {
    baseUrl: cli.baseUrl,
    browser: launchedWith,
    totalChecks,
    totalPassed,
    totalFailed,
    tiers: tierSummaries,
  };

  if (cli.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }

  process.exit(totalFailed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("E2E audit runner crashed:", err);
  process.exit(1);
});
