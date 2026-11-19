import { createIsolatedContext, makeCheckResult, navigateAndSettle } from "../browser.mjs";

function expectedScaleGrade(total) {
  if (total >= 90) {
    return "A+";
  }
  if (total >= 80) {
    return "A";
  }
  if (total >= 75) {
    return "A-";
  }
  if (total >= 70) {
    return "B+";
  }
  if (total >= 65) {
    return "B";
  }
  if (total >= 60) {
    return "C";
  }
  return "F";
}

async function testStudentMobileMoreNav(browser, baseUrl) {
  const results = [];
  const context = await createIsolatedContext(browser, {
    viewport: { name: "mobile", width: 390, height: 844 },
    theme: "light",
  });
  const page = await context.newPage();

  try {
    await navigateAndSettle(page, baseUrl, "/dashboard", { settleMs: 350 });

    const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
    const navVisible = (await mobileNav.count()) > 0 && (await mobileNav.isVisible());
    if (!navVisible) {
      results.push(
        makeCheckResult("T3 /dashboard mobile bottom nav", false, "Mobile navigation <nav> not visible"),
      );
      return results;
    }

    const moreBtn = mobileNav.getByRole("button", { name: /^more$/i });
    const moreVisible = (await moreBtn.count()) > 0 && (await moreBtn.isVisible());
    if (!moreVisible) {
      results.push(
        makeCheckResult(
          "T3 /dashboard mobile More tab",
          false,
          "5th mobile tab is not a visible 'More' button",
        ),
      );
      return results;
    }

    await moreBtn.click();
    await page.waitForTimeout(250);

    const dialog = page.getByRole("dialog", { name: /more options/i });
    const dialogVisible = (await dialog.count()) > 0 && (await dialog.isVisible());
    if (!dialogVisible) {
      results.push(
        makeCheckResult(
          "T3 /dashboard MoreSheet dialog",
          false,
          "Clicking More did not open role='dialog' More options",
        ),
      );
      return results;
    }

    const requiredHrefs = [
      "/profile",
      "/dashboard/progress",
      "/students",
      "/teachers",
      "/materials",
      "/settings",
    ];
    const missingHrefs = [];
    for (const href of requiredHrefs) {
      const link = dialog.locator(`a[href="${href}"]`).first();
      if ((await link.count()) === 0 || !(await link.isVisible())) {
        missingHrefs.push(href);
      }
    }

    results.push(
      makeCheckResult(
        "T3 /dashboard MoreSheet overflow links",
        missingHrefs.length === 0,
        missingHrefs.length === 0
          ? "All 6 overflow links visible in MoreSheet"
          : `Missing visible links in MoreSheet: ${missingHrefs.join(", ")}`,
      ),
    );

    if (!missingHrefs.includes("/dashboard/progress")) {
      await dialog.locator('a[href="/dashboard/progress"]').first().click();
      await page.waitForURL(/\/dashboard\/progress/, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(300);
      const currentPath = new URL(page.url()).pathname;
      results.push(
        makeCheckResult(
          "T3 /dashboard MoreSheet -> /dashboard/progress navigation",
          currentPath === "/dashboard/progress",
          currentPath === "/dashboard/progress"
            ? "Navigated cleanly to /dashboard/progress"
            : `Expected /dashboard/progress, got ${currentPath}`,
        ),
      );
    }
  } finally {
    await context.close();
  }

  return results;
}

async function testRegisterMobileNav(browser, baseUrl) {
  const context = await createIsolatedContext(browser, {
    viewport: { name: "mobile", width: 390, height: 844 },
    theme: "light",
  });
  const page = await context.newPage();

  try {
    await navigateAndSettle(page, baseUrl, "/register", { settleMs: 300 });
    const homeLink = page.locator('a[href="/"]:visible').first();
    const loginLink = page.locator('a[href="/login"]:visible').first();

    const issues = [];
    if ((await homeLink.count()) === 0 || !(await homeLink.isVisible())) {
      issues.push("Visible Home link (a[href='/']) missing at 390px");
    } else {
      const box = await homeLink.boundingBox();
      if (!box || box.x < 0 || box.x + box.width > 391) {
        issues.push("Visible Home link outside 390px viewport");
      }
    }

    if ((await loginLink.count()) === 0 || !(await loginLink.isVisible())) {
      issues.push("Visible Sign-in link (a[href='/login']) missing at 390px");
    } else {
      const box = await loginLink.boundingBox();
      if (!box || box.x < 0 || box.x + box.width > 391) {
        issues.push("Visible Sign-in link outside 390px viewport");
      }
    }

    return [
      makeCheckResult(
        "T3 /register mobile Home & Sign-in links",
        issues.length === 0,
        issues.length === 0 ? "Both links visible within 390px" : issues.join("; "),
      ),
    ];
  } finally {
    await context.close();
  }
}

async function testNoticesRouting(browser, baseUrl) {
  const context = await createIsolatedContext(browser, {
    viewport: { name: "desktop", width: 1440, height: 900 },
    theme: "light",
  });
  const page = await context.newPage();

  try {
    const extractReaderNotice = async (routePath) => {
      await navigateAndSettle(page, baseUrl, routePath, { settleMs: 300 });
      return page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll("div, section, article")).filter(
          (el) =>
            (el.querySelector('button[title="Print Official Circular"]') ||
              (el.textContent || "").includes("VERIFIED OFFICIAL CIRCULAR")) &&
            el.querySelector("h2") &&
            /Ref:\s*\S+/.test(el.textContent || ""),
        );
        candidates.sort((a, b) => (a.innerText || "").length - (b.innerText || "").length);
        const reader = candidates[0] || null;
        const scopedRoot = reader || document.body;
        const headingEl = scopedRoot.querySelector("h2");
        const heading = headingEl ? (headingEl.innerText || "").trim() : "";
        const refMatch = (scopedRoot.innerText || "").match(/Ref:\s*([A-Z0-9/_-]+)/i);
        return {
          foundReader: Boolean(reader),
          heading,
          refNo: refMatch ? refMatch[1].trim() : "",
        };
      });
    };

    const n1 = await extractReaderNotice("/notices/1");
    const n2 = await extractReaderNotice("/notices/2");
    const n3 = await extractReaderNotice("/notices/3");
    const nExam = await extractReaderNotice("/notices/not-exam-108");

    const headings = new Set([n1.heading, n2.heading, n3.heading].filter(Boolean));
    const refs = new Set([n1.refNo, n2.refNo, n3.refNo].filter(Boolean));

    const distinctPassed = headings.size === 3 && refs.size === 3;
    const examPassed =
      /Final Examination Schedule Spring 2026 Released/i.test(nExam.heading) &&
      nExam.refNo === "UC/COE/2026/108";

    return [
      makeCheckResult(
        "T3 /notices/1, /notices/2, /notices/3 distinct notice rendering",
        distinctPassed,
        distinctPassed
          ? `3 distinct notices (${[...refs].join(", ")})`
          : `Expected 3 distinct headings & refs; got headings=${JSON.stringify([n1.heading, n2.heading, n3.heading])}, refs=${JSON.stringify([n1.refNo, n2.refNo, n3.refNo])}`,
      ),
      makeCheckResult(
        "T3 /notices/not-exam-108 canonical notice",
        examPassed,
        examPassed
          ? `Rendered ${nExam.refNo}: ${nExam.heading}`
          : `Expected Final Examination Schedule Spring 2026 Released (UC/COE/2026/108), got heading="${nExam.heading}", ref="${nExam.refNo}"`,
      ),
    ];
  } finally {
    await context.close();
  }
}

async function testTeacherGrades(browser, baseUrl) {
  const results = [];
  const context = await createIsolatedContext(browser, {
    viewport: { name: "desktop", width: 1440, height: 900 },
    theme: "light",
  });
  const page = await context.newPage();

  try {
    await navigateAndSettle(page, baseUrl, "/teacher/grades", { settleMs: 400 });

    const weightsAudit = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll("h2, h3, div, span")).find((el) =>
        /Grading Policy & Weights/i.test(el.textContent || ""),
      );
      if (!heading) {
        return { found: false, reason: "Grading Policy & Weights section not found" };
      }
      let container = heading.parentElement;
      while (container && container.parentElement) {
        const text = container.innerText || "";
        if (
          /Attendance/i.test(text) &&
          /Quiz/i.test(text) &&
          /Midterm/i.test(text) &&
          /Lab/i.test(text) &&
          /Final/i.test(text)
        ) {
          break;
        }
        container = container.parentElement;
      }
      if (!container) {
        return { found: false, reason: "Policy cards container not found" };
      }

      const cards = Array.from(container.querySelectorAll("div")).filter((el) => {
        const txt = (el.innerText || "").trim();
        const pctMatches = txt.match(/(\d+(?:\.\d+)?)\s*%/g);
        return (
          pctMatches &&
          pctMatches.length === 1 &&
          /^(Attendance|Quiz|Midterm|Lab|Final)/i.test(txt) &&
          txt.length < 80
        );
      });

      const parsed = cards.map((el) => {
        const txt = (el.innerText || "").trim().replace(/\s+/g, " ");
        const pct = Number.parseFloat((txt.match(/(\d+(?:\.\d+)?)\s*%/) || ["0", "0"])[1]);
        return { text: txt, pct };
      });
      const sum = parsed.reduce((acc, item) => acc + item.pct, 0);
      return { found: true, parsed, sum };
    });

    if (!weightsAudit.found) {
      results.push(makeCheckResult("T3 /teacher/grades policy weights = 100%", false, weightsAudit.reason));
    } else {
      const passed = weightsAudit.parsed.length === 5 && Math.abs(weightsAudit.sum - 100) < 0.01;
      results.push(
        makeCheckResult(
          "T3 /teacher/grades policy weights = 100%",
          passed,
          passed
            ? `5 weights sum to 100% (${weightsAudit.parsed.map((p) => `${p.pct}%`).join(" + ")})`
            : `Expected 5 weights summing to 100%, got ${weightsAudit.parsed.length} items summing to ${weightsAudit.sum}% (${weightsAudit.parsed.map((p) => p.text).join(" | ")})`,
        ),
      );
    }

    const scaleAndRows = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      const hasFullLegend =
        /A\+\s*\(?90\s*[-–]\s*100%/i.test(bodyText) &&
        /\bA\s*\(?80\s*[-–]\s*89%/i.test(bodyText) &&
        /A-\s*\(?75\s*[-–]\s*79%/i.test(bodyText) &&
        /B\+\s*\(?70\s*[-–]\s*74%/i.test(bodyText) &&
        /\bB\s*\(?65\s*[-–]\s*69%/i.test(bodyText) &&
        /\bC\s*\(?60\s*[-–]\s*64%/i.test(bodyText);

      const table = document.querySelector("table");
      if (!table) {
        return { hasFullLegend, hasTable: false, rows: [] };
      }
      const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
        (th.innerText || "").trim(),
      );
      const idx = {
        id: headers.findIndex((h) => /student id/i.test(h)),
        att: headers.findIndex((h) => /attendance/i.test(h)),
        quiz: headers.findIndex((h) => /quiz/i.test(h)),
        mid: headers.findIndex((h) => /midterm/i.test(h)),
        lab: headers.findIndex((h) => /lab/i.test(h)),
        fin: headers.findIndex((h) => /final/i.test(h)),
        total: headers.findIndex((h) => /total/i.test(h)),
        grade: headers.findIndex((h) => /letter grade/i.test(h)),
      };

      const readNum = (cell) => {
        if (!cell) {
          return Number.NaN;
        }
        const input = cell.querySelector("input");
        const raw = input ? input.value : cell.innerText;
        const m = (raw || "").match(/-?\d+(?:\.\d+)?/);
        return m ? Number.parseFloat(m[0]) : Number.NaN;
      };

      const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
        const tds = Array.from(tr.querySelectorAll("td"));
        const studentId = idx.id >= 0 && tds[idx.id] ? (tds[idx.id].innerText || "").trim() : "";
        const att = readNum(tds[idx.att]);
        const quiz = readNum(tds[idx.quiz]);
        const mid = readNum(tds[idx.mid]);
        const lab = readNum(tds[idx.lab]);
        const fin = readNum(tds[idx.fin]);
        const total = readNum(tds[idx.total]);
        const letter = idx.grade >= 0 && tds[idx.grade] ? (tds[idx.grade].innerText || "").trim() : "";
        return {
          studentId,
          componentsSum: att + quiz + mid + lab + fin,
          total,
          letter,
        };
      });

      return { hasFullLegend, hasTable: true, rows };
    });

    const rowIssues = [];
    if (!scaleAndRows.hasFullLegend) {
      rowIssues.push(
        "Grade scale legend does not display full canonical buckets (A+ 90-100%, A 80-89%, A- 75-79%, B+ 70-74%, B 65-69%, C 60-64%)",
      );
    }
    if (!scaleAndRows.hasTable || scaleAndRows.rows.length === 0) {
      rowIssues.push("Grades table or rows missing");
    } else {
      for (const row of scaleAndRows.rows) {
        if (Number.isNaN(row.componentsSum) || Number.isNaN(row.total)) {
          rowIssues.push(`Row ${row.studentId} has non-numeric score/total`);
          break;
        }
        if (Math.abs(row.componentsSum - row.total) > 0.25) {
          rowIssues.push(
            `Row ${row.studentId}: component sum (${row.componentsSum}) != Total (${row.total})`,
          );
          break;
        }
        const expectedLetter = expectedScaleGrade(row.total);
        if (row.letter !== expectedLetter) {
          rowIssues.push(
            `Row ${row.studentId}: total ${row.total} rendered "${row.letter}", expected "${expectedLetter}"`,
          );
          break;
        }
      }
    }

    results.push(
      makeCheckResult(
        "T3 /teacher/grades row math & scale consistency",
        rowIssues.length === 0,
        rowIssues.length === 0
          ? `Verified ${scaleAndRows.rows.length} rows against 100% sum & canonical scale`
          : rowIssues.join("; "),
      ),
    );

    const rangeLocator = page.getByText(/Showing\s+\d+.*of\s+\d+/i).first();
    const firstRowBefore = await page.locator("table tbody tr").first().innerText();
    const rangeBefore = (await rangeLocator.count()) > 0 ? (await rangeLocator.innerText()).trim() : "";

    const nextBtn = page.getByRole("button", { name: /next page/i }).first();
    const page2Btn = page.getByRole("button", { name: /^2$/ }).first();
    const clickTarget = (await nextBtn.count()) > 0 ? nextBtn : page2Btn;

    if ((await clickTarget.count()) === 0 || !(await clickTarget.isEnabled())) {
      results.push(
        makeCheckResult(
          "T3 /teacher/grades pagination",
          false,
          "Next Page / page 2 control missing or disabled",
        ),
      );
    } else {
      await clickTarget.click();
      await page.waitForTimeout(200);
      const firstRowAfter = await page.locator("table tbody tr").first().innerText();
      const rangeAfter = (await rangeLocator.count()) > 0 ? (await rangeLocator.innerText()).trim() : "";

      const changedBoth = firstRowAfter !== firstRowBefore && rangeAfter !== rangeBefore;
      const pagIssues = [];
      if (firstRowAfter === firstRowBefore) {
        pagIssues.push("Displayed rows did not change after clicking Next");
      }
      if (rangeAfter === rangeBefore) {
        pagIssues.push(`Range text remained static ("${rangeBefore}")`);
      }

      if (changedBoth) {
        const prevBtn = page.getByRole("button", { name: /previous page/i }).first();
        if ((await prevBtn.count()) > 0 && (await prevBtn.isEnabled())) {
          await prevBtn.click();
          await page.waitForTimeout(200);
          const restoredRow = await page.locator("table tbody tr").first().innerText();
          if (restoredRow !== firstRowBefore) {
            pagIssues.push("Previous Page did not restore initial rows");
          }
        }
      }

      results.push(
        makeCheckResult(
          "T3 /teacher/grades pagination",
          pagIssues.length === 0,
          pagIssues.length === 0
            ? `Pagination updated rows & range ("${rangeBefore}" -> "${rangeAfter}")`
            : pagIssues.join("; "),
        ),
      );
    }
  } finally {
    await context.close();
  }

  return results;
}

async function testTeacherAttendance(browser, baseUrl) {
  const results = [];
  const context = await createIsolatedContext(browser, {
    viewport: { name: "desktop", width: 1440, height: 900 },
    theme: "light",
  });
  const page = await context.newPage();

  try {
    await navigateAndSettle(page, baseUrl, "/teacher/attendance", { settleMs: 400 });

    const unscannedAudit = await page.evaluate(() => {
      const table = document.querySelector("table");
      if (!table) {
        return { hasTable: false, reason: "Attendance roster table not found" };
      }

      const rows = Array.from(table.querySelectorAll("tbody tr"));
      const unscannedViolations = [];
      let unscannedCount = 0;

      for (const tr of rows) {
        const rowText = tr.innerText || "";
        const isUnscanned = tr.dataset.unscanned === "true" || rowText.includes("—") || rowText.includes("--:--:--");
        if (!isUnscanned) {
          continue;
        }
        unscannedCount += 1;

        const buttons = Array.from(tr.querySelectorAll("button"));
        const absentBtn = buttons.find((b) => /^absent$/i.test((b.innerText || "").trim()));
        if (absentBtn) {
          const pressed = absentBtn.getAttribute("aria-pressed") === "true";
          const bg = window.getComputedStyle(absentBtn).backgroundColor;
          const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          let isRoseActive = false;
          if (match) {
            const r = Number.parseInt(match[1], 10);
            const g = Number.parseInt(match[2], 10);
            const b = Number.parseInt(match[3], 10);
            const a = match[4] === undefined ? 1 : Number.parseFloat(match[4]);
            if (a > 0.5 && r > 180 && g < 100 && b < 120) {
              isRoseActive = true;
            }
          }
          if (pressed || isRoseActive) {
            unscannedViolations.push(
              `Unscanned row has active Absent toggle (pressed=${pressed}, bg=${bg})`,
            );
          }
        }

        const nonButtonTexts = Array.from(tr.querySelectorAll("span, div"))
          .filter((el) => !el.closest("button") && el.children.length === 0)
          .map((el) => (el.innerText || "").trim());
        if (nonButtonTexts.some((t) => /^absent$/i.test(t))) {
          unscannedViolations.push("Unscanned row has 'Absent' status badge");
        }
      }

      const absentTabBtn = Array.from(document.querySelectorAll("button")).find((b) =>
        /^Absent\s*\(\d+\)/i.test((b.innerText || "").trim()),
      );
      const absentTabMatch = absentTabBtn
        ? (absentTabBtn.innerText || "").match(/\((\d+)\)/)
        : null;
      const absentTabCount = absentTabMatch ? Number.parseInt(absentTabMatch[1], 10) : null;

      const footer = document.querySelector("footer");
      const footerMatch = footer ? (footer.innerText || "").match(/(\d+)\s+Absent/i) : null;
      const footerAbsentCount = footerMatch ? Number.parseInt(footerMatch[1], 10) : null;

      return {
        hasTable: true,
        unscannedCount,
        unscannedViolations,
        absentTabCount,
        footerAbsentCount,
      };
    });

    if (!unscannedAudit.hasTable) {
      results.push(
        makeCheckResult("T3 /teacher/attendance unscanned pre-finalization", false, unscannedAudit.reason),
      );
    } else {
      const issues = [...unscannedAudit.unscannedViolations];
      if (unscannedAudit.unscannedCount > 0) {
        if (unscannedAudit.absentTabCount !== null && unscannedAudit.absentTabCount > 0) {
          issues.push(
            `Absent tab shows (${unscannedAudit.absentTabCount}) before finalization despite unscanned students`,
          );
        }
        if (unscannedAudit.footerAbsentCount !== null && unscannedAudit.footerAbsentCount > 0) {
          issues.push(
            `Footer shows "${unscannedAudit.footerAbsentCount} Absent" before finalization`,
          );
        }
      }

      results.push(
        makeCheckResult(
          "T3 /teacher/attendance unscanned not Absent before finalization",
          issues.length === 0,
          issues.length === 0
            ? `Verified ${unscannedAudit.unscannedCount} unscanned rows not labeled Absent`
            : issues.join("; "),
        ),
      );
    }

    const showingLocator = page.getByText(/Showing\s+[\d–-]+\s+of\s+\d+/i).first();
    const pageInfoLocator = page.getByText(/Page\s+\d+\s+of\s+\d+/i).first();
    const firstRowBefore = await page.locator("table tbody tr").first().innerText();
    const showingBefore =
      (await showingLocator.count()) > 0 ? (await showingLocator.innerText()).trim() : "";
    const pageInfoBefore =
      (await pageInfoLocator.count()) > 0 ? (await pageInfoLocator.innerText()).trim() : "";

    const nextBtn = page.getByRole("button", { name: /^next$/i }).first();
    if ((await nextBtn.count()) === 0 || !(await nextBtn.isEnabled())) {
      results.push(
        makeCheckResult(
          "T3 /teacher/attendance pagination",
          false,
          `Next button missing or disabled (showing="${showingBefore}", ${pageInfoBefore})`,
        ),
      );
    } else {
      await nextBtn.click();
      await page.waitForTimeout(200);
      const firstRowAfter = await page.locator("table tbody tr").first().innerText();
      const showingAfter =
        (await showingLocator.count()) > 0 ? (await showingLocator.innerText()).trim() : "";
      const pageInfoAfter =
        (await pageInfoLocator.count()) > 0 ? (await pageInfoLocator.innerText()).trim() : "";

      const pagIssues = [];
      if (firstRowAfter === firstRowBefore) {
        pagIssues.push("Displayed roster rows did not change after clicking Next");
      }
      if (showingAfter === showingBefore && pageInfoAfter === pageInfoBefore) {
        pagIssues.push("Pagination count/page indicator remained static after clicking Next");
      }

      if (pagIssues.length === 0) {
        const prevBtn = page.getByRole("button", { name: /^previous$/i }).first();
        if ((await prevBtn.count()) > 0 && (await prevBtn.isEnabled())) {
          await prevBtn.click();
          await page.waitForTimeout(200);
          const restoredRow = await page.locator("table tbody tr").first().innerText();
          if (restoredRow !== firstRowBefore) {
            pagIssues.push("Previous button did not restore page 1 rows");
          }
        }
      }

      results.push(
        makeCheckResult(
          "T3 /teacher/attendance pagination",
          pagIssues.length === 0,
          pagIssues.length === 0
            ? `Pagination updated rows & counts ("${pageInfoBefore}" -> "${pageInfoAfter}")`
            : pagIssues.join("; "),
        ),
      );
    }
  } finally {
    await context.close();
  }

  return results;
}

export async function runTier3(browser, baseUrl) {
  const results = [];
  results.push(...(await testStudentMobileMoreNav(browser, baseUrl)));
  results.push(...(await testRegisterMobileNav(browser, baseUrl)));
  results.push(...(await testNoticesRouting(browser, baseUrl)));
  results.push(...(await testTeacherGrades(browser, baseUrl)));
  results.push(...(await testTeacherAttendance(browser, baseUrl)));
  return results;
}
