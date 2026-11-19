import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";

function findCachedHeadlessShell() {
  const cacheDir = path.join(os.homedir(), ".cache", "ms-playwright");
  if (!fs.existsSync(cacheDir)) {
    return null;
  }

  let entries = [];
  try {
    entries = fs.readdirSync(cacheDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const dirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("chromium_headless_shell-"))
    .map((entry) => {
      const rev = Number.parseInt(entry.name.replace("chromium_headless_shell-", ""), 10);
      return { name: entry.name, rev: Number.isNaN(rev) ? 0 : rev };
    })
    .sort((a, b) => b.rev - a.rev);

  for (const dir of dirs) {
    const candidate = path.join(
      cacheDir,
      dir.name,
      "chrome-headless-shell-linux64",
      "chrome-headless-shell",
    );
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

export async function launchResilientBrowser() {
  const attempts = [];

  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    attempts.push({
      label: `env(${process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH})`,
      options: {
        headless: true,
        executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      },
    });
  }

  attempts.push({
    label: "default playwright chromium",
    options: { headless: true },
  });

  attempts.push({
    label: "channel: chrome",
    options: { channel: "chrome", headless: true },
  });

  if (fs.existsSync("/usr/bin/google-chrome")) {
    attempts.push({
      label: "/usr/bin/google-chrome",
      options: { executablePath: "/usr/bin/google-chrome", headless: true },
    });
  }

  const cachedShell = findCachedHeadlessShell();
  if (cachedShell) {
    attempts.push({
      label: `cached headless-shell (${cachedShell})`,
      options: { executablePath: cachedShell, headless: true },
    });
  }

  const errors = [];
  for (const attempt of attempts) {
    try {
      const browser = await chromium.launch(attempt.options);
      return { browser, launchedWith: attempt.label };
    } catch (err) {
      const msg = err instanceof Error ? err.message.split("\n")[0] : String(err);
      errors.push(`${attempt.label}: ${msg}`);
    }
  }

  throw new Error(`Failed to launch Chromium via all fallback paths:\n${errors.join("\n")}`);
}

export async function createIsolatedContext(browser, { viewport, theme }) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: theme,
    reducedMotion: "reduce",
  });

  await context.addInitScript((mode) => {
    try {
      window.localStorage.setItem("theme", mode);
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
  }, theme);

  return context;
}

export async function clearPortalStorage(page, theme) {
  await page.evaluate((mode) => {
    try {
      const keysToClear = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("unicampus_")) {
          keysToClear.push(key);
        }
      }
      for (const key of keysToClear) {
        window.localStorage.removeItem(key);
      }
      window.localStorage.setItem("theme", mode);
    } catch {
      // Ignore storage access errors.
    }
  }, theme);
}

export async function navigateAndSettle(page, baseUrl, routePath, options = {}) {
  const settleMs = typeof options.settleMs === "number" ? options.settleMs : 350;
  const consoleErrors = [];
  const pageErrors = [];
  const failedResponses = [];

  const onConsole = (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  };
  const onPageError = (err) => {
    pageErrors.push(err instanceof Error ? err.message : String(err));
  };
  const onResponse = (res) => {
    if (res.status() >= 400) {
      failedResponses.push(`${res.status()} ${res.url()}`);
    }
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("response", onResponse);

  const targetUrl = new URL(routePath, baseUrl).toString();
  let navStatus = 0;
  let navError = null;

  try {
    const response = await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    navStatus = response ? response.status() : 0;

    await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready.catch(() => {});
      }
    });
    if (settleMs > 0) {
      await page.waitForTimeout(settleMs);
    }
  } catch (err) {
    navError = err instanceof Error ? err.message : String(err);
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("response", onResponse);
  }

  return {
    navStatus,
    navError,
    finalUrl: page.url(),
    consoleErrors,
    pageErrors,
    failedResponses,
  };
}

export function rectsOverlap(a, b, tolerance = 0.5) {
  if (!a || !b) {
    return false;
  }
  const aLeft = a.x + tolerance;
  const aRight = a.x + a.width - tolerance;
  const aTop = a.y + tolerance;
  const aBottom = a.y + a.height - tolerance;

  const bLeft = b.x + tolerance;
  const bRight = b.x + b.width - tolerance;
  const bTop = b.y + tolerance;
  const bBottom = b.y + b.height - tolerance;

  if (aRight <= bLeft || bRight <= aLeft) {
    return false;
  }
  if (aBottom <= bTop || bBottom <= aTop) {
    return false;
  }
  return true;
}

export function isBoxInsideViewport(box, viewport, tolerance = 1) {
  if (!box) {
    return false;
  }
  return (
    box.x >= -tolerance &&
    box.x + box.width <= viewport.width + tolerance
  );
}

export function isBoxContainedIn(inner, outer, tolerance = 1) {
  if (!inner || !outer) {
    return false;
  }
  return (
    inner.x >= outer.x - tolerance &&
    inner.x + inner.width <= outer.x + outer.width + tolerance &&
    inner.y >= outer.y - tolerance &&
    inner.y + inner.height <= outer.y + outer.height + tolerance
  );
}

export function minGapBetweenBoxes(a, b) {
  if (!a || !b) {
    return 0;
  }
  const dx = Math.max(0, Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width)));
  const dy = Math.max(0, Math.max(b.y - (a.y + a.height), a.y - (b.y + b.height)));
  if (dx > 0 && dy > 0) {
    return Math.hypot(dx, dy);
  }
  return Math.max(dx, dy);
}

export function makeCheckResult(id, passed, detail = "") {
  return { id, passed, detail };
}
