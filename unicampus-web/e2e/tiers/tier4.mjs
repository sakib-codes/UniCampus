import {
  AI_CLICHES,
  CANONICAL,
  DEAD_TAILWIND_V3_CLASSES,
  PORTAL_ORDER,
  ROUTE_TARGETS,
  SETTINGS_FORBIDDEN_JARGON,
  THEMES,
} from "../config.mjs";
import { createIsolatedContext, makeCheckResult, navigateAndSettle } from "../browser.mjs";

function parseTimeToMinutes(rawTime, defaultMeridiemHint) {
  const match = rawTime.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) {
    return null;
  }
  let hours = Number.parseInt(match[1], 10);
  const mins = Number.parseInt(match[2], 10);
  const explicitMeridiem = match[3] ? match[3].toUpperCase() : null;

  if (explicitMeridiem) {
    if (explicitMeridiem === "PM" && hours < 12) {
      hours += 12;
    } else if (explicitMeridiem === "AM" && hours === 12) {
      hours = 0;
    }
  } else if (defaultMeridiemHint) {
    if (hours >= 1 && hours <= 7) {
      hours += 12;
    }
  }

  return hours * 60 + mins;
}

function parseSlotRange(text) {
  const match = text.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)\s*[-–to]+\s*(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i);
  if (!match) {
    return null;
  }
  const endMeridiemMatch = match[2].match(/(AM|PM)/i);
  const startMeridiemMatch = match[1].match(/(AM|PM)/i);
  let start = parseTimeToMinutes(match[1], !startMeridiemMatch);
  const end = parseTimeToMinutes(match[2], !endMeridiemMatch);

  if (start !== null && end !== null && end < start && !startMeridiemMatch && endMeridiemMatch) {
    if (start >= 12 * 60 && end < 12 * 60) {
      start -= 12 * 60;
    }
  }
  if (start === null || end === null) {
    return null;
  }
  return { raw: match[0], start, end };
}

async function scanAntiSlopOnCurrentPage(page, routePath, theme) {
  const prefix = `T4 anti-slop ${routePath} [${theme}]`;
  const audit = await page.evaluate(
    ({ aiCliches, deadClasses }) => {
      const bodyText = document.body.innerText || "";
      const bodyLower = bodyText.toLowerCase();

      const foundCliches = aiCliches.filter((phrase) => bodyLower.includes(phrase.toLowerCase()));
      const sparklesCount = document.querySelectorAll("svg.lucide-sparkles").length;

      const isVisible = (el) => {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
          return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };

      const pingEls = Array.from(document.querySelectorAll('[class*="animate-ping"]')).filter(
        (el) => el.classList.contains("animate-ping") && isVisible(el),
      );

      const pulsingDots = Array.from(document.querySelectorAll('[class*="animate-pulse"]')).filter(
        (el) => {
          const hasPulseClass = Array.from(el.classList).some(
            (cls) => cls === "animate-pulse" || cls.endsWith(":animate-pulse"),
          );
          if (!hasPulseClass || !isVisible(el)) {
            return false;
          }
          const isSkeleton =
            el.getAttribute("aria-hidden") === "true" && el.classList.contains("bg-surface-2");
          if (isSkeleton) {
            return false;
          }
          const r = el.getBoundingClientRect();
          return el.classList.contains("rounded-full") && r.width <= 20 && r.height <= 20;
        },
      );

      const liveBadges = Array.from(document.querySelectorAll("span, div")).filter((el) => {
        if (el.children.length > 0 || !isVisible(el)) {
          return false;
        }
        return (el.innerText || "").trim() === "LIVE";
      });

      const foundDeadClasses = [];
      const allNodes = document.querySelectorAll("*");
      for (const el of allNodes) {
        for (const cls of deadClasses) {
          if (el.classList.contains(cls) && !foundDeadClasses.includes(cls)) {
            foundDeadClasses.push(cls);
          }
        }
      }

      return {
        foundCliches,
        sparklesCount,
        pingCount: pingEls.length,
        pulsingDotCount: pulsingDots.length,
        liveBadgeCount: liveBadges.length,
        foundDeadClasses,
      };
    },
    { aiCliches: AI_CLICHES, deadClasses: DEAD_TAILWIND_V3_CLASSES },
  );

  const issues = [];
  if (audit.foundCliches.length > 0) {
    issues.push(`AI clichés found: ${audit.foundCliches.join(", ")}`);
  }
  if (audit.sparklesCount > 0) {
    issues.push(`Found ${audit.sparklesCount} svg.lucide-sparkles icon(s)`);
  }
  if (audit.pingCount > 0) {
    issues.push(`Found ${audit.pingCount} visible .animate-ping element(s)`);
  }
  if (audit.pulsingDotCount > 0) {
    issues.push(`Found ${audit.pulsingDotCount} pulsing circular status dot(s)`);
  }
  if (audit.liveBadgeCount > 0) {
    issues.push(`Found ${audit.liveBadgeCount} exact "LIVE" badge(s)`);
  }
  if (audit.foundDeadClasses.length > 0) {
    issues.push(`Dead Tailwind v3 classes: ${audit.foundDeadClasses.join(", ")}`);
  }

  return makeCheckResult(
    prefix,
    issues.length === 0,
    issues.length === 0 ? "Zero slop/dead-class violations" : issues.join("; "),
  );
}

async function checkAdminNoticesActionMenuDeadClasses(page, theme) {
  const actionBtn = page.locator('button[aria-label="Notice Actions"]:visible').first();
  if ((await actionBtn.count()) === 0) {
    return makeCheckResult(
      `T4 /admin/notices action menu dead classes [${theme}]`,
      true,
      "No Notice Actions menu button present",
    );
  }
  await actionBtn.click();
  await page.waitForTimeout(150);
  const foundDead = await page.evaluate((deadClasses) => {
    const found = [];
    for (const el of document.querySelectorAll("*")) {
      for (const cls of deadClasses) {
        if (el.classList.contains(cls) && !found.includes(cls)) {
          found.push(cls);
        }
      }
    }
    return found;
  }, DEAD_TAILWIND_V3_CLASSES);
  await page.keyboard.press("Escape").catch(() => {});

  return makeCheckResult(
    `T4 /admin/notices action menu dead classes [${theme}]`,
    foundDead.length === 0,
    foundDead.length === 0
      ? "Action menu free of dead Tailwind v3 classes"
      : `Action menu contains dead classes: ${foundDead.join(", ")}`,
  );
}

async function checkAdminSettingsJargon(page, theme) {
  const prefix = `T4 /admin/settings institutional copy [${theme}]`;
  const blockedByGate = await page.evaluate(() =>
    (document.body.innerText || "").includes("Institutional Authority Required"),
  );
  if (blockedByGate) {
    return makeCheckResult(
      prefix,
      false,
      "SuperAdminGate unexpectedly blocked /admin/settings",
    );
  }

  const violations = new Set();

  const scanCurrentTab = async (tabLabel) => {
    const found = await page.evaluate((forbidden) => {
      const text = document.body.innerText || "";
      const lower = text.toLowerCase();
      return forbidden.filter((term) => lower.includes(term.toLowerCase()));
    }, SETTINGS_FORBIDDEN_JARGON);
    for (const item of found) {
      violations.add(`${item} (tab: ${tabLabel})`);
    }
  };

  await scanCurrentTab("initial");

  const tabCount = await page.evaluate(() => {
    const navHeader = Array.from(document.querySelectorAll("div")).find(
      (el) => (el.innerText || "").trim() === "Navigation Sections",
    );
    if (!navHeader || !navHeader.parentElement) {
      return 0;
    }
    return navHeader.parentElement.querySelectorAll("button").length;
  });

  for (let i = 0; i < tabCount; i += 1) {
    const tabLabel = await page.evaluate((idx) => {
      const navHeader = Array.from(document.querySelectorAll("div")).find(
        (el) => (el.innerText || "").trim() === "Navigation Sections",
      );
      if (!navHeader || !navHeader.parentElement) {
        return null;
      }
      const btn = navHeader.parentElement.querySelectorAll("button")[idx];
      if (!btn) {
        return null;
      }
      btn.click();
      return (btn.innerText || "").trim().replace(/\s+/g, " ");
    }, i);
    await page.waitForTimeout(150);
    if (tabLabel) {
      await scanCurrentTab(tabLabel);
    }
  }

  const list = [...violations];
  return makeCheckResult(
    prefix,
    list.length === 0,
    list.length === 0
      ? `Clean across ${Math.max(1, tabCount)} settings tabs`
      : `Forbidden CSS/token/engine jargon found: ${list.join("; ")}`,
  );
}

async function runCanonicalChecksForTheme(browser, baseUrl, theme) {
  const results = [];
  const desktop = { name: "desktop", width: 1440, height: 900 };

  // --- STUDENT PORTAL ---
  const studentCtx = await createIsolatedContext(browser, { viewport: desktop, theme });
  const studentPage = await studentCtx.newPage();
  try {
    await navigateAndSettle(studentPage, baseUrl, "/dashboard", { settleMs: 400 });
    const dashText = await studentPage.evaluate(() => document.body.innerText || "");
    const dashMissing = [CANONICAL.term, CANONICAL.student.name, CANONICAL.student.semester].filter(
      (s) => !dashText.includes(s),
    );
    results.push(
      makeCheckResult(
        `T4 /dashboard canonical term & student [${theme}]`,
        dashMissing.length === 0,
        dashMissing.length === 0 ? "Academic Year 2026, Sakib Ahmed, 6th Semester present" : `Missing: ${dashMissing.join(", ")}`,
      ),
    );

    await navigateAndSettle(studentPage, baseUrl, "/profile", { settleMs: 350 });
    const profText = await studentPage.evaluate(() => document.body.innerText || "");
    const profMissing = [
      CANONICAL.student.name,
      CANONICAL.student.id,
      CANONICAL.student.batch,
      CANONICAL.student.semester,
    ].filter((s) => !profText.includes(s));
    results.push(
      makeCheckResult(
        `T4 /profile canonical student identity [${theme}]`,
        profMissing.length === 0,
        profMissing.length === 0
          ? "Sakib Ahmed, 211-15-4424, 54th Batch, 6th Semester present"
          : `Missing: ${profMissing.join(", ")}`,
      ),
    );

    await navigateAndSettle(studentPage, baseUrl, "/dashboard/progress", { settleMs: 450 });
    const progressAudit = await studentPage.evaluate(() => {
      const text = document.body.innerText || "";
      const has144 = /96\s+of\s+144\s+credits/i.test(text);
      const hasActive15 = /Active\s*\(15\)/i.test(text);
      const hasLeft33 = /Left\s*\(33\)/i.test(text);
      const has33LeftPhrase = /33\s+credits\s+left/i.test(text);
      const hasStale48 = /48\s+credits\s+left/i.test(text);
      return { has144, hasActive15, hasLeft33, has33LeftPhrase, hasStale48 };
    });
    const progIssues = [];
    if (!progressAudit.has144) {
      progIssues.push("Missing '96 of 144 credits'");
    }
    if (!progressAudit.hasActive15) {
      progIssues.push("Missing 'Active (15)'");
    }
    if (!progressAudit.hasLeft33) {
      progIssues.push("Missing 'Left (33)'");
    }
    if (!progressAudit.has33LeftPhrase) {
      progIssues.push("Missing '33 credits left'");
    }
    if (progressAudit.hasStale48) {
      progIssues.push("Stale '48 credits left' still present");
    }
    results.push(
      makeCheckResult(
        `T4 /dashboard/progress credit math (96+15+33=144) [${theme}]`,
        progIssues.length === 0,
        progIssues.length === 0 ? "96 + 15 + 33 = 144 & '33 credits left' verified" : progIssues.join("; "),
      ),
    );

    await navigateAndSettle(studentPage, baseUrl, "/routine", { settleMs: 350 });
    const routineTermPresent = await studentPage.evaluate(
      (term) => (document.body.innerText || "").includes(term),
      CANONICAL.term,
    );
    results.push(
      makeCheckResult(
        `T4 /routine canonical term [${theme}]`,
        routineTermPresent,
        routineTermPresent ? "Academic Year 2026 present" : "Missing Academic Year 2026",
      ),
    );

    const matrixBtn = studentPage.getByRole("button", { name: /weekly matrix/i }).first();
    if ((await matrixBtn.count()) === 0) {
      results.push(
        makeCheckResult(`T4 /routine weekly matrix [${theme}]`, false, "Weekly Matrix button not found"),
      );
    } else {
      await matrixBtn.click();
      await studentPage.waitForTimeout(250);
      const matrixData = await studentPage.evaluate(() => {
        const table = document.querySelector("table");
        if (!table) {
          return { hasTable: false, rows: [], recessTotalCount: 0 };
        }
        const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
          const cells = Array.from(tr.querySelectorAll("td, th")).map((td) =>
            (td.innerText || "").trim(),
          );
          return {
            firstCell: cells[0] || "",
            recessMatches: ((tr.innerText || "").match(/Midday Recess/gi) || []).length,
          };
        });
        const recessTotalCount = rows.reduce((acc, r) => acc + r.recessMatches, 0);
        return { hasTable: true, rows, recessTotalCount };
      });

      const routineIssues = [];
      if (!matrixData.hasTable || matrixData.rows.length === 0) {
        routineIssues.push("Weekly Matrix table not rendered");
      } else {
        const parsedSlots = matrixData.rows
          .map((r) => parseSlotRange(r.firstCell))
          .filter(Boolean);
        if (parsedSlots.length < 4) {
          routineIssues.push(`Too few parsed time slots (${parsedSlots.length})`);
        }
        for (let i = 1; i < parsedSlots.length; i += 1) {
          if (parsedSlots[i].start < parsedSlots[i - 1].end) {
            routineIssues.push(
              `Overlapping matrix slots: "${parsedSlots[i - 1].raw}" overlaps "${parsedSlots[i].raw}"`,
            );
            break;
          }
        }
        if (matrixData.recessTotalCount !== 1) {
          routineIssues.push(
            `Expected "Midday Recess" once in single divider row, found ${matrixData.recessTotalCount} occurrences`,
          );
        }
      }

      results.push(
        makeCheckResult(
          `T4 /routine non-overlapping slots & single Midday Recess [${theme}]`,
          routineIssues.length === 0,
          routineIssues.length === 0
            ? "Matrix slots strictly non-overlapping with single Midday Recess row"
            : routineIssues.join("; "),
        ),
      );
    }

    await navigateAndSettle(studentPage, baseUrl, "/teachers", { settleMs: 350 });
    const teachersText = await studentPage.evaluate(() => document.body.innerText || "");
    const teachersMissing = [
      CANONICAL.faculty.name,
      CANONICAL.faculty.room,
      CANONICAL.cseHod,
    ].filter((s) => !teachersText.includes(s));
    results.push(
      makeCheckResult(
        `T4 /teachers Dr. Asif Rahman, Room 508 & CSE HOD [${theme}]`,
        teachersMissing.length === 0,
        teachersMissing.length === 0
          ? "Faculty & HOD canonical strings present"
          : `Missing: ${teachersMissing.join(", ")}`,
      ),
    );

    await navigateAndSettle(studentPage, baseUrl, "/teachers/1", { settleMs: 350 });
    const teacherDetailText = await studentPage.evaluate(() => document.body.innerText || "");
    const tdMissing = [CANONICAL.faculty.name, CANONICAL.faculty.room].filter(
      (s) => !teacherDetailText.includes(s),
    );
    results.push(
      makeCheckResult(
        `T4 /teachers/1 Dr. Asif Rahman & Room 508 [${theme}]`,
        tdMissing.length === 0,
        tdMissing.length === 0 ? "Dr. Asif Rahman & Room 508 present" : `Missing: ${tdMissing.join(", ")}`,
      ),
    );
  } finally {
    await studentCtx.close();
  }

  // --- TEACHER PORTAL ---
  const teacherCtx = await createIsolatedContext(browser, { viewport: desktop, theme });
  const teacherPage = await teacherCtx.newPage();
  try {
    await navigateAndSettle(teacherPage, baseUrl, "/teacher/dashboard", { settleMs: 400 });
    const tDashText = await teacherPage.evaluate(() => document.body.innerText || "");
    const tDashMissing = [
      CANONICAL.term,
      CANONICAL.faculty.name,
      CANONICAL.faculty.room,
    ].filter((s) => !tDashText.includes(s));
    results.push(
      makeCheckResult(
        `T4 /teacher/dashboard canonical term, Dr. Asif & Room 508 [${theme}]`,
        tDashMissing.length === 0,
        tDashMissing.length === 0
          ? "Academic Year 2026, Dr. Asif Rahman, Room 508 present"
          : `Missing: ${tDashMissing.join(", ")}`,
      ),
    );
  } finally {
    await teacherCtx.close();
  }

  // --- ADMIN PORTAL ---
  const adminCtx = await createIsolatedContext(browser, { viewport: desktop, theme });
  const adminPage = await adminCtx.newPage();
  try {
    await navigateAndSettle(adminPage, baseUrl, "/admin/dashboard", { settleMs: 450 });
    const aDashText = await adminPage.evaluate(() => document.body.innerText || "");
    const aDashIssues = [];
    for (const reqStr of [
      CANONICAL.term,
      CANONICAL.totalStudents,
      ...CANONICAL.departments.map((d) => d.code),
    ]) {
      if (!aDashText.includes(reqStr)) {
        aDashIssues.push(`Missing "${reqStr}"`);
      }
    }
    if (/8 academic departments|8 faculties/i.test(aDashText)) {
      aDashIssues.push("Stale '8 departments/faculties' text still present");
    }
    results.push(
      makeCheckResult(
        `T4 /admin/dashboard canonical term & 5 depts = 4,820 [${theme}]`,
        aDashIssues.length === 0,
        aDashIssues.length === 0 ? "Academic Year 2026 & 5 depts (4,820) present" : aDashIssues.join("; "),
      ),
    );

    await navigateAndSettle(adminPage, baseUrl, "/admin/departments", { settleMs: 400 });
    const deptText = await adminPage.evaluate(() => document.body.innerText || "");
    const deptMissing = [
      CANONICAL.cseHod,
      CANONICAL.totalStudents,
      ...CANONICAL.departments.map((d) => d.code),
      ...CANONICAL.departments.map((d) => d.students),
    ].filter((s) => !deptText.includes(s));
    results.push(
      makeCheckResult(
        `T4 /admin/departments 5 depts summing to 4,820 & CSE HOD [${theme}]`,
        deptMissing.length === 0,
        deptMissing.length === 0
          ? "5 depts (1,420+1,080+960+740+620=4,820) & Prof. Dr. M. Lutfar Rahman present"
          : `Missing: ${deptMissing.join(", ")}`,
      ),
    );

    await navigateAndSettle(adminPage, baseUrl, "/admin/users", { settleMs: 400 });
    const usersAudit = await adminPage.evaluate(
      ({ expectedTotal, forbiddenTotal }) => {
        const text = document.body.innerText || "";
        const has5072 = text.includes(expectedTotal);
        const has5060 = text.includes(forbiddenTotal);
        const doublePlusButtons = Array.from(document.querySelectorAll("button"))
          .filter((btn) => Boolean(btn.querySelector("svg")) && /^\+\s/.test((btn.innerText || "").trim()))
          .map((btn) => (btn.innerText || "").trim());
        return { has5072, has5060, doublePlusButtons };
      },
      { expectedTotal: CANONICAL.totalUsers, forbiddenTotal: CANONICAL.forbiddenUsersCount },
    );
    const userIssues = [];
    if (!usersAudit.has5072) {
      userIssues.push("Missing '5,072' total users");
    }
    if (usersAudit.has5060) {
      userIssues.push("Stale '5,060' still present");
    }
    if (usersAudit.doublePlusButtons.length > 0) {
      userIssues.push(`Double '+' prefix buttons: ${usersAudit.doublePlusButtons.join(", ")}`);
    }
    results.push(
      makeCheckResult(
        `T4 /admin/users 5,072 users & clean CTA [${theme}]`,
        userIssues.length === 0,
        userIssues.length === 0 ? "5,072 users & clean button labels" : userIssues.join("; "),
      ),
    );

    await navigateAndSettle(adminPage, baseUrl, "/admin/finance", { settleMs: 1100 });
    const financeAudit = await adminPage.evaluate(
      ({ expectedTotals, forbiddenTotals }) => {
        const bodyClone = document.body.cloneNode(true);
        for (const sr of bodyClone.querySelectorAll(".sr-only")) {
          sr.remove();
        }
        const visibleBody = (bodyClone.textContent || "").replace(/\s+/g, " ");

        const missingFormatted = expectedTotals.filter((t) => !visibleBody.includes(t));
        const foundUnformatted = forbiddenTotals.filter((t) => visibleBody.includes(t));
        const anyRawCurrency = visibleBody.match(/৳\s*\d{4,}/g) || [];
        return { missingFormatted, foundUnformatted, anyRawCurrency };
      },
      {
        expectedTotals: CANONICAL.financeTotals,
        forbiddenTotals: CANONICAL.forbiddenFinanceTotals,
      },
    );
    const finIssues = [];
    if (financeAudit.missingFormatted.length > 0) {
      finIssues.push(`Missing formatted totals: ${financeAudit.missingFormatted.join(", ")}`);
    }
    if (financeAudit.foundUnformatted.length > 0) {
      finIssues.push(`Unformatted ৳ totals found: ${financeAudit.foundUnformatted.join(", ")}`);
    }
    if (financeAudit.anyRawCurrency.length > 0) {
      finIssues.push(`Raw unformatted currency values found: ${financeAudit.anyRawCurrency.join(", ")}`);
    }
    results.push(
      makeCheckResult(
        `T4 /admin/finance formatted ৳ totals [${theme}]`,
        finIssues.length === 0,
        finIssues.length === 0
          ? "৳143,500, ৳327,000, ৳115,000 properly formatted"
          : finIssues.join("; "),
      ),
    );

    await navigateAndSettle(adminPage, baseUrl, "/admin/analytics", { settleMs: 650 });
    const analyticsTicks = await adminPage.evaluate(() => {
      const h2 = Array.from(document.querySelectorAll("h2")).find((el) =>
        /Department Attendance Rates/i.test(el.innerText || ""),
      );
      if (!h2) {
        return { found: false, ticks: [] };
      }
      let card = h2.parentElement;
      while (card && card.parentElement && !card.querySelector(".recharts-wrapper")) {
        card = card.parentElement;
      }
      if (!card || !card.querySelector(".recharts-wrapper")) {
        return { found: false, ticks: [] };
      }
      const ticks = Array.from(
        card.querySelectorAll(".recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value"),
      ).map((t) => (t.textContent || "").trim());
      return { found: true, ticks };
    });

    const expectedTicks = CANONICAL.analyticsDeptTicks;
    const ticksMatch =
      analyticsTicks.found &&
      analyticsTicks.ticks.length === expectedTicks.length &&
      expectedTicks.every((label, idx) => analyticsTicks.ticks[idx] === label);
    results.push(
      makeCheckResult(
        `T4 /admin/analytics Department Attendance Rates X-axis [${theme}]`,
        ticksMatch,
        ticksMatch
          ? `X-axis labels match [${expectedTicks.join(", ")}]`
          : `Expected [${expectedTicks.join(", ")}], got [${analyticsTicks.ticks.join(", ")}]`,
      ),
    );
  } finally {
    await adminCtx.close();
  }

  return results;
}

async function runAntiSlopSweepForTheme(browser, baseUrl, theme) {
  const results = [];
  const desktop = { name: "desktop", width: 1440, height: 900 };

  for (const portal of PORTAL_ORDER) {
    const portalRoutes = ROUTE_TARGETS.filter((r) => r.portal === portal);
    const context = await createIsolatedContext(browser, { viewport: desktop, theme });
    const page = await context.newPage();

    try {
      for (const route of portalRoutes) {
        await navigateAndSettle(page, baseUrl, route.path, { settleMs: 300 });
        results.push(await scanAntiSlopOnCurrentPage(page, route.path, theme));

        if (route.path === "/admin/notices") {
          results.push(await checkAdminNoticesActionMenuDeadClasses(page, theme));
        } else if (route.path === "/admin/settings") {
          results.push(await checkAdminSettingsJargon(page, theme));
        }
      }
    } finally {
      await context.close();
    }
  }

  return results;
}

export async function runTier4(browser, baseUrl) {
  const results = [];
  for (const theme of THEMES) {
    results.push(...(await runCanonicalChecksForTheme(browser, baseUrl, theme)));
    results.push(...(await runAntiSlopSweepForTheme(browser, baseUrl, theme)));
  }
  return results;
}
