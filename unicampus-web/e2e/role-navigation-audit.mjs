import { launchResilientBrowser, createIsolatedContext, navigateAndSettle } from "./browser.mjs";

const BASE_URL = "http://localhost:3000";

const studentProfile = {
  id: "user-stud-1",
  full_name: "Sakib Ahmed",
  email: "sakib.ahmed@unicampus.edu",
  role: "student",
  student_id: "011221089",
  department_id: "dept-cse",
  department_name: "Computer Science & Engineering",
  semester_id: "sem-cse-6",
  semester_name: "6th Semester",
  avatar_url: "",
  is_approved: true,
};

const teacherProfile = {
  id: "user-teach-1",
  full_name: "Dr. Asif Rahman",
  email: "asif.rahman@unicampus.edu",
  role: "teacher",
  teacher_code: "T-CSE-101",
  department_id: "dept-cse",
  department_name: "Computer Science & Engineering",
  avatar_url: "",
  is_approved: true,
};

const superAdminProfile = {
  id: "user-admin-1",
  full_name: "Syed Tariqul Islam",
  email: "admin@unicampus.edu",
  role: "admin",
  admin_role: "super_admin",
  department_id: null,
  department_name: "Central Administration",
  avatar_url: "",
  is_approved: true,
};

async function setAuth(page, profile, activeScope = "all") {
  await page.evaluate(({ user, scope }) => {
    localStorage.setItem("unicampus_auth_current_user", JSON.stringify(user));
    localStorage.setItem("unicampus_admin_scope_dept", scope);
    localStorage.setItem("unicampus_auth_schema_version", "v2");
  }, { user: profile, scope: activeScope });
}

async function run() {
  console.log("=== UniCampus Comprehensive Role Navigation & Route Audit ===");
  const { browser } = await launchResilientBrowser();

  let passCount = 0;
  let failCount = 0;
  const failures = [];

  function assert(name, condition, detail = "") {
    if (condition) {
      passCount++;
      console.log(`  [PASS] ${name}`);
    } else {
      failCount++;
      console.error(`  [FAIL] ${name} — ${detail}`);
      failures.push({ name, detail });
    }
  }

  // -------------------------------------------------------------
  // Test 1: Public Routes & Auth Flows
  // -------------------------------------------------------------
  console.log("\n1. Testing Public Routes & Auth Redirection...");
  {
    const context = await createIsolatedContext(browser, {
      viewport: { name: "desktop", width: 1280, height: 800 },
      theme: "light",
    });
    const page = await context.newPage();

    // Landing page
    const rLanding = await navigateAndSettle(page, BASE_URL, "/");
    assert("Landing page status 200", rLanding.navStatus === 200);
    assert("Landing page title contains UniCampus", (await page.title()).toLowerCase().includes("unicampus"));

    // Role aliases redirects
    const rStudentAlias = await navigateAndSettle(page, BASE_URL, "/student");
    assert("/student redirects to /dashboard", page.url().endsWith("/dashboard"));

    const rTeacherAlias = await navigateAndSettle(page, BASE_URL, "/teacher");
    assert("/teacher redirects to /teacher/dashboard", page.url().endsWith("/teacher/dashboard"));

    const rAdminAlias = await navigateAndSettle(page, BASE_URL, "/admin");
    assert("/admin redirects to /admin/dashboard", page.url().endsWith("/admin/dashboard"));

    // Login page
    const rLogin = await navigateAndSettle(page, BASE_URL, "/login");
    assert("Login page status 200", rLogin.navStatus === 200);

    // Test Login Form submission for Student
    await page.getByRole("button", { name: /^student$/i }).click();
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/dashboard", { timeout: 4000 });
    assert("Student login redirects to /dashboard", page.url().endsWith("/dashboard"));

    // Test Login Form submission for Faculty
    await navigateAndSettle(page, BASE_URL, "/login");
    await page.getByRole("button", { name: /^faculty$/i }).click();
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/teacher/dashboard", { timeout: 4000 });
    assert("Faculty login redirects to /teacher/dashboard", page.url().endsWith("/teacher/dashboard"));

    // Test Login Form submission for Admin
    await navigateAndSettle(page, BASE_URL, "/login");
    await page.getByRole("button", { name: /^admin$/i }).click();
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL("**/admin/dashboard", { timeout: 4000 });
    assert("Admin login redirects to /admin/dashboard", page.url().endsWith("/admin/dashboard"));

    // Register page
    const rRegister = await navigateAndSettle(page, BASE_URL, "/register");
    assert("Register page status 200", rRegister.navStatus === 200);

    // Splash page
    const rSplash = await navigateAndSettle(page, BASE_URL, "/splash");
    assert("Splash page status 200", rSplash.navStatus === 200);
    await page.getByRole("button", { name: /continue to portal/i }).click();
    await page.waitForURL("**/dashboard", { timeout: 3000 });
    assert("Splash page button routes to portal dashboard", page.url().endsWith("/dashboard"));

    await context.close();
  }

  // -------------------------------------------------------------
  // Test 2: Student Screens & In-Portal Navigation
  // -------------------------------------------------------------
  console.log("\n2. Testing Student Screens & In-Portal Navigation...");
  {
    const context = await createIsolatedContext(browser, {
      viewport: { name: "desktop", width: 1280, height: 800 },
      theme: "light",
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/dashboard`);
    await setAuth(page, studentProfile);
    await page.reload();

    // Check all student routes
    const studentRoutes = [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/routine", label: "Routine" },
      { path: "/dashboard/progress", label: "Progress" },
      { path: "/notices", label: "Notices" },
      { path: "/notices/not-exam-108", label: "Notice Detail" },
      { path: "/students", label: "Classmates" },
      { path: "/teachers", label: "Faculty Directory" },
      { path: "/teachers/1", label: "Faculty Detail" },
      { path: "/materials", label: "Materials" },
      { path: "/messages", label: "Messages" },
      { path: "/profile", label: "Profile" },
      { path: "/settings", label: "Settings" },
    ];

    for (const r of studentRoutes) {
      const res = await navigateAndSettle(page, BASE_URL, r.path);
      assert(`Student route ${r.path} (${r.label}) status 200`, res.navStatus === 200);
      assert(`Student route ${r.path} zero console errors`, res.consoleErrors.length === 0, res.consoleErrors.join("; "));
    }

    // Interactive navigation check: Dashboard -> Notice click
    await navigateAndSettle(page, BASE_URL, "/dashboard");
    const noticeSnippet = page.locator("a[href*='/notices/']").first();
    const noticeSnippetHref = await noticeSnippet.getAttribute("href");
    assert("Notice snippet links to canonical notice", noticeSnippetHref.includes("not-exam-108") || noticeSnippetHref.includes("not-"), `Found: ${noticeSnippetHref}`);
    await noticeSnippet.click();
    await page.waitForURL("**/notices/**", { timeout: 3000 });
    assert("Notice snippet click routed cleanly to notice page", page.url().includes("/notices"));

    // Interactive navigation check: Faculty Directory -> Teacher Detail -> Back
    await navigateAndSettle(page, BASE_URL, "/teachers");
    const firstTeacherLink = page.locator("a[href*='/teachers/']").first();
    await firstTeacherLink.click();
    await page.waitForURL("**/teachers/**", { timeout: 3000 });
    assert("Navigated to teacher detail", page.url().includes("/teachers/"));
    const backBtn = page.getByRole("link", { name: /Back to Faculty/i });
    assert("Back button to faculty directory exists", (await backBtn.count()) > 0);
    await backBtn.click();
    await page.waitForURL("**/teachers", { timeout: 3000 });
    assert("Back button returned cleanly to /teachers", page.url().endsWith("/teachers"));

    await context.close();
  }

  // -------------------------------------------------------------
  // Test 3: Faculty Role Screens & Shared Routes Retention
  // -------------------------------------------------------------
  console.log("\n3. Testing Faculty Screens & Navigation (Ensuring Role Retention)...");
  {
    const context = await createIsolatedContext(browser, {
      viewport: { name: "desktop", width: 1280, height: 800 },
      theme: "light",
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/teacher/dashboard`);
    await setAuth(page, teacherProfile);
    await page.reload();

    const teacherRoutes = [
      { path: "/teacher/dashboard", label: "Faculty Dashboard" },
      { path: "/teacher/attendance", label: "Attendance" },
      { path: "/teacher/grades", label: "Gradebook" },
      { path: "/teacher/routine", label: "Routine" },
      { path: "/teacher/materials", label: "Materials" },
      { path: "/teacher/notices", label: "Notices" },
    ];

    for (const r of teacherRoutes) {
      const res = await navigateAndSettle(page, BASE_URL, r.path);
      assert(`Faculty route ${r.path} status 200`, res.navStatus === 200);
      assert(`Faculty route ${r.path} zero console errors`, res.consoleErrors.length === 0, res.consoleErrors.join("; "));
    }

    // Critical check: Faculty visits /messages
    await navigateAndSettle(page, BASE_URL, "/messages");
    const sideNav = page.locator("aside[aria-label='Faculty navigation']");
    assert("SideNav preserves Faculty navigation on /messages", (await sideNav.count()) > 0);
    const topBarHeader = page.locator("header");
    const topBarText = await topBarHeader.innerText();
    assert("TopBar shows Faculty portal on /messages", topBarText.includes("Faculty") && topBarText.includes("Messages"));
    
    // Check navigating back to Faculty Home from SideNav
    const homeLink = sideNav.getByRole("link", { name: "Home" });
    assert("Faculty SideNav on /messages contains link to /teacher/dashboard", (await homeLink.count()) > 0);
    await homeLink.click();
    await page.waitForURL("**/teacher/dashboard", { timeout: 3000 });
    assert("Home click from /messages returns cleanly to /teacher/dashboard", page.url().endsWith("/teacher/dashboard"));

    // Critical check: Faculty visits /settings
    await navigateAndSettle(page, BASE_URL, "/settings");
    const sideNavSettings = page.locator("aside[aria-label='Faculty navigation']");
    assert("SideNav preserves Faculty navigation on /settings", (await sideNavSettings.count()) > 0);

    // Critical check: Faculty visits /teachers/1 (Own profile)
    await navigateAndSettle(page, BASE_URL, "/teachers/1");
    const sideNavProfile = page.locator("aside[aria-label='Faculty navigation']");
    assert("SideNav preserves Faculty navigation on /teachers/1", (await sideNavProfile.count()) > 0);

    await context.close();
  }

  // -------------------------------------------------------------
  // Test 4: Admin Role Screens & Scope Enforcement
  // -------------------------------------------------------------
  console.log("\n4. Testing Admin Screens & Navigation...");
  {
    const context = await createIsolatedContext(browser, {
      viewport: { name: "desktop", width: 1280, height: 800 },
      theme: "light",
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await setAuth(page, superAdminProfile);
    await page.reload();

    const adminRoutes = [
      { path: "/admin/dashboard", label: "Admin Dashboard" },
      { path: "/admin/users", label: "Users" },
      { path: "/admin/departments", label: "Departments" },
      { path: "/admin/routine", label: "Master Routine" },
      { path: "/admin/notices", label: "Campus Notices" },
      { path: "/admin/finance", label: "Finance" },
      { path: "/admin/analytics", label: "Analytics" },
      { path: "/admin/settings", label: "Settings" },
    ];

    for (const r of adminRoutes) {
      const res = await navigateAndSettle(page, BASE_URL, r.path);
      assert(`Admin route ${r.path} status 200`, res.navStatus === 200);
      assert(`Admin route ${r.path} zero console errors`, res.consoleErrors.length === 0, res.consoleErrors.join("; "));
    }

    // Verify SideNav has admin portal navigation
    const adminSideNav = page.locator("aside[aria-label='Admin navigation']");
    assert("Admin navigation present in SideNav", (await adminSideNav.count()) > 0);

    await context.close();
  }

  // -------------------------------------------------------------
  // Test 5: Mobile Navigation & More Drawer on 390px Viewport
  // -------------------------------------------------------------
  console.log("\n5. Testing Mobile Navigation & More Drawers (390x844)...");
  {
    const context = await createIsolatedContext(browser, {
      viewport: { name: "mobile", width: 390, height: 844 },
      theme: "light",
    });
    const page = await context.newPage();

    // 5A: Student Mobile Tabs & More Drawer
    await page.goto(`${BASE_URL}/dashboard`);
    await setAuth(page, studentProfile);
    await page.reload();
    await page.waitForTimeout(300);

    const mobileNav = page.locator("nav[aria-label='Mobile navigation']");
    assert("Student mobile nav bar visible", (await mobileNav.count()) > 0 && (await mobileNav.isVisible()));
    const moreBtn = mobileNav.getByRole("button", { name: /^more$/i });
    assert("Student mobile More button exists", (await moreBtn.count()) > 0);
    await moreBtn.click();
    await page.waitForTimeout(300);

    const profileLink = page.locator("div[role='dialog'] a[href='/profile']");
    assert("Student More drawer contains Profile link", (await profileLink.count()) > 0);
    await profileLink.click();
    await page.waitForURL("**/profile", { timeout: 3000 });
    assert("Tapping Profile in More drawer navigated to /profile", page.url().endsWith("/profile"));

    // 5B: Faculty Mobile Tabs & More Drawer
    await page.goto(`${BASE_URL}/teacher/dashboard`);
    await setAuth(page, teacherProfile);
    await page.reload();
    await page.waitForTimeout(300);

    const teacherMobileNav = page.locator("nav[aria-label='Mobile navigation']");
    assert("Faculty mobile nav bar visible", (await teacherMobileNav.count()) > 0 && (await teacherMobileNav.isVisible()));
    const teacherMoreBtn = teacherMobileNav.getByRole("button", { name: /^more$/i });
    await teacherMoreBtn.click();
    await page.waitForTimeout(300);

    const facultyProfileLink = page.locator("div[role='dialog'] a[href='/teachers/1']");
    assert("Faculty More drawer contains Faculty Profile link", (await facultyProfileLink.count()) > 0);
    await facultyProfileLink.click();
    await page.waitForURL("**/teachers/1", { timeout: 3000 });
    assert("Tapping Faculty Profile navigated to /teachers/1", page.url().endsWith("/teachers/1"));

    // 5C: Admin Mobile Tabs & More Drawer
    await page.goto(`${BASE_URL}/admin/dashboard`);
    await setAuth(page, superAdminProfile);
    await page.reload();
    await page.waitForTimeout(300);

    const adminMobileNav = page.locator("nav[aria-label='Mobile navigation']");
    assert("Admin mobile nav bar visible", (await adminMobileNav.count()) > 0 && (await adminMobileNav.isVisible()));
    const adminMoreBtn = adminMobileNav.getByRole("button", { name: /^more$/i });
    await adminMoreBtn.click();
    await page.waitForTimeout(300);

    const financeLink = page.locator("div[role='dialog'] a[href='/admin/finance']");
    assert("Admin More drawer contains Finance link", (await financeLink.count()) > 0);
    await financeLink.click();
    await page.waitForURL("**/admin/finance", { timeout: 3000 });
    assert("Tapping Finance navigated to /admin/finance", page.url().endsWith("/admin/finance"));

    await context.close();
  }

  await browser.close();

  console.log(`\n======================================================`);
  console.log(`Summary: ${passCount} PASSED, ${failCount} FAILED`);
  console.log(`======================================================`);

  if (failCount > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Audit runner threw unexpected error:", err);
  process.exit(1);
});
