import { PORTAL_ORDER, ROUTE_TARGETS, THEMES, VIEWPORTS } from "../config.mjs";
import {
  createIsolatedContext,
  makeCheckResult,
  navigateAndSettle,
} from "../browser.mjs";

export async function runTier1(browser, baseUrl) {
  const results = [];

  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      for (const portal of PORTAL_ORDER) {
        const portalRoutes = ROUTE_TARGETS.filter((route) => route.portal === portal);
        const context = await createIsolatedContext(browser, { viewport, theme });
        const page = await context.newPage();

        try {
          for (const route of portalRoutes) {
            const label = `T1 ${route.path} [${viewport.name}/${theme}]`;
            const nav = await navigateAndSettle(page, baseUrl, route.path, { settleMs: 250 });

            const failures = [];

            if (nav.navError) {
              failures.push(`Navigation error: ${nav.navError}`);
            } else if (nav.navStatus < 200 || nav.navStatus >= 400) {
              failures.push(`HTTP status ${nav.navStatus}`);
            }

            if (route.expectedFinalPath) {
              const actualPath = new URL(nav.finalUrl).pathname;
              if (actualPath !== route.expectedFinalPath) {
                failures.push(
                  `Expected redirect to ${route.expectedFinalPath}, got ${actualPath}`,
                );
              }
            }

            if (nav.consoleErrors.length > 0) {
              failures.push(`console.error (${nav.consoleErrors.length}): ${nav.consoleErrors[0]}`);
            }

            if (nav.pageErrors.length > 0) {
              failures.push(`pageerror (${nav.pageErrors.length}): ${nav.pageErrors[0]}`);
            }

            if (nav.failedResponses.length > 0) {
              failures.push(
                `HTTP >=400 responses (${nav.failedResponses.length}): ${nav.failedResponses[0]}`,
              );
            }

            const domState = await page.evaluate(() => {
              const hasDarkClass = document.documentElement.classList.contains("dark");
              const bodyText = (document.body.innerText || "").trim();
              return {
                hasDarkClass,
                bodyLen: bodyText.length,
              };
            });

            const expectedDark = theme === "dark";
            if (domState.hasDarkClass !== expectedDark) {
              failures.push(
                `Theme class mismatch: expected dark=${expectedDark}, got dark=${domState.hasDarkClass}`,
              );
            }

            if (domState.bodyLen <= 20) {
              failures.push(`Empty or near-empty body text (length=${domState.bodyLen})`);
            }

            results.push(
              makeCheckResult(
                label,
                failures.length === 0,
                failures.length === 0 ? `status=${nav.navStatus}` : failures.join("; "),
              ),
            );
          }
        } finally {
          await context.close();
        }
      }
    }
  }

  return results;
}
