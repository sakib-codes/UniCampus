import { PORTAL_ORDER, ROUTE_TARGETS, THEMES, VIEWPORTS } from "../config.mjs";
import {
  createIsolatedContext,
  isBoxContainedIn,
  isBoxInsideViewport,
  makeCheckResult,
  minGapBetweenBoxes,
  navigateAndSettle,
  rectsOverlap,
} from "../browser.mjs";

async function checkLandingMobileLayout(page, viewport, theme) {
  const checks = [];
  const prefix = `T2 / [${viewport.name}/${theme}]`;

  if (viewport.name === "mobile") {
    const headerAudit = await page.evaluate((vw) => {
      const header = document.querySelector("header");
      if (!header) {
        return { error: "Missing <header>" };
      }

      const rawItems = Array.from(header.querySelectorAll("a, button"));
      const visibleItems = rawItems.filter((el) => {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
          return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });

      const leafItems = visibleItems.filter(
        (el) => !visibleItems.some((other) => other !== el && el.contains(other)),
      );

      const items = leafItems.map((el) => {
        const r = el.getBoundingClientRect();
        const label =
          el.getAttribute("aria-label") ||
          (el.textContent || "").trim().replace(/\s+/g, " ") ||
          el.tagName;
        return {
          label,
          box: { x: r.x, y: r.y, width: r.width, height: r.height },
        };
      });

      const outOfBounds = items.filter(
        (item) => item.box.x < -0.5 || item.box.x + item.box.width > vw + 1,
      );
      const overlaps = [];
      for (let i = 0; i < items.length; i += 1) {
        for (let j = i + 1; j < items.length; j += 1) {
          const a = items[i].box;
          const b = items[j].box;
          const xOverlap = a.x + a.width - 0.5 > b.x && b.x + b.width - 0.5 > a.x;
          const yOverlap = a.y + a.height - 0.5 > b.y && b.y + b.height - 0.5 > a.y;
          if (xOverlap && yOverlap) {
            overlaps.push(`"${items[i].label}" overlaps "${items[j].label}"`);
          }
        }
      }

      return { outOfBounds, overlaps, count: items.length };
    }, viewport.width);

    if (headerAudit.error) {
      checks.push(makeCheckResult(`${prefix} header containment`, false, headerAudit.error));
    } else {
      const issues = [];
      for (const item of headerAudit.outOfBounds) {
        issues.push(
          `Header item "${item.label}" overflows ${viewport.width}px (right=${Math.round(item.box.x + item.box.width)})`,
        );
      }
      for (const ov of headerAudit.overlaps) {
        issues.push(ov);
      }
      checks.push(
        makeCheckResult(
          `${prefix} header containment & non-overlap`,
          issues.length === 0,
          issues.length === 0 ? `${headerAudit.count} header items fit cleanly` : issues.join("; "),
        ),
      );
    }

    const urlLocator = page.getByText(/unicampus\.edu\//i).locator("visible=true").first();
    const previewLocator = page.getByText(/^Live Preview$/i).locator("visible=true").first();
    const urlVisible = (await urlLocator.count()) > 0 && (await urlLocator.isVisible());
    if (!urlVisible) {
      checks.push(
        makeCheckResult(`${prefix} hero window bar`, false, "Visible unicampus.edu/... URL not found"),
      );
    } else {
      const urlBox = await urlLocator.boundingBox();
      const previewVisible =
        (await previewLocator.count()) > 0 && (await previewLocator.isVisible());
      const previewBox = previewVisible ? await previewLocator.boundingBox() : null;
      const barIssues = [];
      if (!isBoxInsideViewport(urlBox, viewport)) {
        barIssues.push(`URL box exceeds viewport (${JSON.stringify(urlBox)})`);
      }
      if (previewBox) {
        if (!isBoxInsideViewport(previewBox, viewport)) {
          barIssues.push(`Live Preview exceeds viewport (${JSON.stringify(previewBox)})`);
        }
        if (rectsOverlap(urlBox, previewBox, 0.5)) {
          barIssues.push("Hero URL text overlaps Live Preview label");
        }
      }
      checks.push(
        makeCheckResult(
          `${prefix} hero window bar non-overlap`,
          barIssues.length === 0,
          barIssues.length === 0 ? "Hero bar clean" : barIssues.join("; "),
        ),
      );
    }
  }

  // Role switcher tabs at BOTH desktop and mobile
  const tablist = page.getByRole("tablist").first();
  if ((await tablist.count()) === 0) {
    checks.push(makeCheckResult(`${prefix} role switcher tablist`, false, "Missing [role=tablist]"));
  } else {
    const tabScroll = await tablist.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    const tablistBox = await tablist.boundingBox();
    const adminTab = tablist.getByRole("tab", { name: /admin/i }).first();
    const adminTabCount = await adminTab.count();
    const tabIssues = [];

    if (tabScroll.scrollWidth > tabScroll.clientWidth + 1) {
      tabIssues.push(
        `Tablist overflows horizontally (scrollWidth=${tabScroll.scrollWidth} > clientWidth=${tabScroll.clientWidth})`,
      );
    }
    if (!isBoxInsideViewport(tablistBox, viewport)) {
      tabIssues.push("Tablist overflows viewport");
    }
    if (adminTabCount === 0) {
      tabIssues.push("Admin role tab not found");
    } else {
      const adminBox = await adminTab.boundingBox();
      if (!isBoxContainedIn(adminBox, tablistBox, 1)) {
        tabIssues.push(
          `Admin tab clipped outside tablist (tabRight=${Math.round((adminBox?.x || 0) + (adminBox?.width || 0))} > tablistRight=${Math.round((tablistBox?.x || 0) + (tablistBox?.width || 0))})`,
        );
      }
      if (!isBoxInsideViewport(adminBox, viewport, 1)) {
        tabIssues.push("Admin tab overflows viewport");
      }
    }

    checks.push(
      makeCheckResult(
        `${prefix} role switcher tabs unclipped`,
        tabIssues.length === 0,
        tabIssues.length === 0 ? "All role tabs fit within tablist" : tabIssues.join("; "),
      ),
    );
  }

  return checks;
}

async function checkAdminDashboardHeading(page, viewport, theme) {
  const prefix = `T2 /admin/dashboard [${viewport.name}/${theme}]`;
  const h1 = page.locator("h1:visible").filter({ hasText: /Campus Overview/i });
  const count = await h1.count();
  return [
    makeCheckResult(
      `${prefix} h1 "Campus Overview"`,
      count > 0,
      count > 0 ? "Visible <h1>Campus Overview</h1> present" : "Missing visible <h1>Campus Overview</h1>",
    ),
  ];
}

async function checkAdminUsersLayout(page, viewport, theme) {
  if (viewport.name !== "desktop") {
    return [];
  }
  const prefix = `T2 /admin/users [${viewport.name}/${theme}]`;
  const checks = [];

  const adminsBtn = page.locator("button:visible").filter({ hasText: /Admins/i }).first();
  const deptSelect = page.locator("select:visible").filter({ hasText: /All Departments/i }).first();

  if ((await adminsBtn.count()) === 0 || (await deptSelect.count()) === 0) {
    checks.push(
      makeCheckResult(
        `${prefix} filter bar non-overlap`,
        false,
        "Missing Admins button or All Departments select",
      ),
    );
  } else {
    const adminsBox = await adminsBtn.boundingBox();
    const selectBox = await deptSelect.boundingBox();
    const overlapped = rectsOverlap(adminsBox, selectBox, 0.5);
    checks.push(
      makeCheckResult(
        `${prefix} Admins tab vs All Departments select non-overlap`,
        !overlapped,
        overlapped
          ? `Admins button (right=${Math.round(adminsBox.x + adminsBox.width)}) overlaps All Departments select (left=${Math.round(selectBox.x)})`
          : "No filter bar overlap",
      ),
    );
  }

  const actionsAudit = await page.evaluate(() => {
    const ths = Array.from(document.querySelectorAll("th"));
    const actionsTh = ths.find((th) => /actions/i.test(th.textContent || ""));
    if (!actionsTh) {
      return { found: false, reason: "<th>Actions</th> not found" };
    }
    const wrapper = actionsTh.closest(".overflow-x-auto") || actionsTh.closest("table")?.parentElement;
    if (!wrapper) {
      return { found: false, reason: "Table wrapper not found" };
    }
    const thRect = actionsTh.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    return {
      found: true,
      thRight: thRect.right,
      wrapRight: wrapRect.right,
      scrollWidth: wrapper.scrollWidth,
      clientWidth: wrapper.clientWidth,
    };
  });

  if (!actionsAudit.found) {
    checks.push(makeCheckResult(`${prefix} Actions column unclipped`, false, actionsAudit.reason));
  } else {
    const clipped =
      actionsAudit.thRight > actionsAudit.wrapRight + 1 ||
      actionsAudit.scrollWidth > actionsAudit.clientWidth + 1;
    checks.push(
      makeCheckResult(
        `${prefix} Actions column unclipped`,
        !clipped,
        clipped
          ? `Actions column clipped (thRight=${Math.round(actionsAudit.thRight)} > wrapperRight=${Math.round(actionsAudit.wrapRight)}, scrollWidth=${actionsAudit.scrollWidth} > clientWidth=${actionsAudit.clientWidth})`
          : "Actions column fits cleanly at 1440px",
      ),
    );
  }

  return checks;
}

async function checkAdminRoutineLayout(page, viewport, theme) {
  if (viewport.name !== "desktop") {
    return [];
  }
  const prefix = `T2 /admin/routine [${viewport.name}/${theme}]`;

  const slotAudit = await page.evaluate(() => {
    const allElements = Array.from(document.querySelectorAll("span, div, th"));
    const slot6 = allElements.find((el) => {
      const text = (el.textContent || "").trim();
      return /^Slot 6(\s|$|•)/.test(text) && el.children.length === 0;
    });
    if (!slot6) {
      return { found: false, reason: "Slot 6 header element not found" };
    }
    const wrapper = slot6.closest(".overflow-x-auto");
    if (!wrapper) {
      return { found: false, reason: "Matrix scroll wrapper (.overflow-x-auto) not found" };
    }
    const slotRect = slot6.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    return {
      found: true,
      slotRight: slotRect.right,
      wrapRight: wrapRect.right,
      scrollWidth: wrapper.scrollWidth,
      clientWidth: wrapper.clientWidth,
    };
  });

  if (!slotAudit.found) {
    return [makeCheckResult(`${prefix} Slot 6 unclipped`, false, slotAudit.reason)];
  }

  const clipped =
    slotAudit.slotRight > slotAudit.wrapRight + 1 ||
    slotAudit.scrollWidth > slotAudit.clientWidth + 1;

  return [
    makeCheckResult(
      `${prefix} Slot 6 unclipped`,
      !clipped,
      clipped
        ? `Slot 6 clipped (slotRight=${Math.round(slotAudit.slotRight)} > wrapperRight=${Math.round(slotAudit.wrapRight)}, scrollWidth=${slotAudit.scrollWidth} > clientWidth=${slotAudit.clientWidth})`
        : "Slot 6 fits cleanly inside matrix container at 1440px",
    ),
  ];
}

async function checkAdminAnalyticsLayout(page, viewport, theme) {
  const prefix = `T2 /admin/analytics [${viewport.name}/${theme}]`;
  const leftLabel = page.getByText("Weekly scheduled slots", { exact: false }).locator("visible=true").first();
  const rightLabel = page
    .getByText("Active curriculum subjects", { exact: false })
    .locator("visible=true")
    .first();

  if ((await leftLabel.count()) === 0 || (await rightLabel.count()) === 0) {
    return [
      makeCheckResult(
        `${prefix} dual-metric sub-labels separation`,
        false,
        "Missing Weekly scheduled slots or Active curriculum subjects label",
      ),
    ];
  }

  const boxA = await leftLabel.boundingBox();
  const boxB = await rightLabel.boundingBox();
  const overlapped = rectsOverlap(boxA, boxB, 0.5);
  const gap = minGapBetweenBoxes(boxA, boxB);
  const passed = !overlapped && gap >= 8;

  return [
    makeCheckResult(
      `${prefix} dual-metric sub-labels separation`,
      passed,
      passed
        ? `Non-overlapping with ${gap.toFixed(1)}px separation`
        : `Insufficient separation (overlapped=${overlapped}, gap=${gap.toFixed(1)}px < 8px)`,
    ),
  ];
}

async function checkTeacherAttendanceQrOcclusion(page, viewport, theme) {
  const prefix = `T2 /teacher/attendance [${viewport.name}/${theme}]`;

  const qrImg = page.locator('img[alt*="QR" i]:visible').first();
  const qrSvg = page.locator('svg[viewBox="0 0 220 220"]:visible').first();
  const qrLocator = (await qrImg.count()) > 0 ? qrImg : qrSvg;

  if ((await qrLocator.count()) === 0) {
    return [makeCheckResult(`${prefix} QR not occluded by footer`, false, "QR element not found")];
  }

  const inspectAtCurrentScroll = async (phaseLabel) => {
    return page.evaluate((lbl) => {
      const qrEl =
        document.querySelector('img[alt*="QR" i]') ||
        document.querySelector('svg[viewBox="0 0 220 220"]');
      const footerEl = document.querySelector("footer");
      const bottomNav = document.querySelector('nav[aria-label="Mobile navigation"]');

      if (!qrEl) {
        return { ok: false, reason: `${lbl}: QR element missing` };
      }

      const qrRect = qrEl.getBoundingClientRect();
      if (qrRect.width === 0 || qrRect.height === 0) {
        return { ok: false, reason: `${lbl}: QR element has zero size` };
      }

      const overlaps = (a, b) =>
        a.right - 0.5 > b.left &&
        b.right - 0.5 > a.left &&
        a.bottom - 0.5 > b.top &&
        b.bottom - 0.5 > a.top;

      if (footerEl) {
        const fStyle = window.getComputedStyle(footerEl);
        const fRect = footerEl.getBoundingClientRect();
        if (fStyle.display !== "none" && fRect.width > 0 && fRect.height > 0 && overlaps(qrRect, fRect)) {
          return {
            ok: false,
            reason: `${lbl}: Sticky/positioned <footer> (${Math.round(fRect.top)}..${Math.round(fRect.bottom)}) overlaps QR (${Math.round(qrRect.top)}..${Math.round(qrRect.bottom)})`,
          };
        }
      }

      const probeX = qrRect.left + qrRect.width / 2;
      const probeY = qrRect.top + qrRect.height - 6;
      if (probeY >= 0 && probeY < window.innerHeight && probeX >= 0 && probeX < window.innerWidth) {
        const hit = document.elementFromPoint(probeX, probeY);
        if (hit && footerEl && (hit === footerEl || footerEl.contains(hit))) {
          return { ok: false, reason: `${lbl}: elementFromPoint at QR bottom hit <footer>` };
        }
        if (hit && bottomNav && (hit === bottomNav || bottomNav.contains(hit))) {
          return {
            ok: false,
            reason: `${lbl}: elementFromPoint at QR bottom hit mobile bottom navigation`,
          };
        }
      }

      return { ok: true };
    }, phaseLabel);
  };

  // Phase 1: initial scroll (y = 0)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  const initialCheck = await inspectAtCurrentScroll("initial");

  // Phase 2: scroll so QR bottom sits ~130px above bottom of viewport (prime sticky-footer collision zone)
  await page.evaluate(() => {
    const qrEl =
      document.querySelector('img[alt*="QR" i]') ||
      document.querySelector('svg[viewBox="0 0 220 220"]');
    if (qrEl) {
      const rect = qrEl.getBoundingClientRect();
      const docTop = rect.top + window.scrollY;
      const targetScrollY = Math.max(0, docTop - Math.max(80, window.innerHeight - rect.height - 140));
      window.scrollTo(0, targetScrollY);
    }
  });
  await page.waitForTimeout(150);
  const scrolledCheck = await inspectAtCurrentScroll("scrolled");

  const failures = [];
  if (!initialCheck.ok) {
    failures.push(initialCheck.reason);
  }
  if (!scrolledCheck.ok) {
    failures.push(scrolledCheck.reason);
  }

  return [
    makeCheckResult(
      `${prefix} QR not covered by sticky footer`,
      failures.length === 0,
      failures.length === 0 ? "QR unobstructed at initial & scrolled positions" : failures.join("; "),
    ),
  ];
}

export async function runTier2(browser, baseUrl) {
  const results = [];

  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      for (const portal of PORTAL_ORDER) {
        const portalRoutes = ROUTE_TARGETS.filter((route) => route.portal === portal);
        const context = await createIsolatedContext(browser, { viewport, theme });
        const page = await context.newPage();

        try {
          for (const route of portalRoutes) {
            await navigateAndSettle(page, baseUrl, route.path, { settleMs: 300 });

            const overflow = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
            }));

            const overflowPassed = overflow.scrollWidth <= overflow.innerWidth + 1;
            results.push(
              makeCheckResult(
                `T2 ${route.path} [${viewport.name}/${theme}] horizontal overflow`,
                overflowPassed,
                overflowPassed
                  ? `${overflow.scrollWidth} <= ${overflow.innerWidth}`
                  : `scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`,
              ),
            );

            if (route.path === "/") {
              const extra = await checkLandingMobileLayout(page, viewport, theme);
              results.push(...extra);
            } else if (route.path === "/admin/dashboard") {
              const extra = await checkAdminDashboardHeading(page, viewport, theme);
              results.push(...extra);
            } else if (route.path === "/admin/users") {
              const extra = await checkAdminUsersLayout(page, viewport, theme);
              results.push(...extra);
            } else if (route.path === "/admin/routine") {
              const extra = await checkAdminRoutineLayout(page, viewport, theme);
              results.push(...extra);
            } else if (route.path === "/admin/analytics") {
              const extra = await checkAdminAnalyticsLayout(page, viewport, theme);
              results.push(...extra);
            } else if (route.path === "/teacher/attendance") {
              const extra = await checkTeacherAttendanceQrOcclusion(page, viewport, theme);
              results.push(...extra);
            }
          }
        } finally {
          await context.close();
        }
      }
    }
  }

  return results;
}
