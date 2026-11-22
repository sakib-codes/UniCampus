import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CheckSquare,
  CreditCard,
  FolderGit2,
  GraduationCap,
  Home,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export type PortalRole = "student" | "teacher" | "admin";

export type NavBadgeKey =
  | "notices"
  | "messages"
  | "pendingApprovals"
  | "liveAttendance";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: NavBadgeKey;
  badgeTone?: "brand" | "danger" | "success";
  superAdminOnly?: boolean;
  exact?: boolean;
}

export interface BottomTabItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  badgeKey?: NavBadgeKey;
  action?: "more";
  exact?: boolean;
}

export interface PortalNavConfig {
  portalLabel: string;
  homeHref: string;
  desktop: NavItem[];
  mobileTabs: BottomTabItem[];
  mobileOverflow: NavItem[];
}

export const PORTAL_NAV: Record<PortalRole, PortalNavConfig> = {
  student: {
    portalLabel: "Student",
    homeHref: "/dashboard",
    desktop: [
      { id: "home", label: "Home", href: "/dashboard", icon: Home, exact: true },
      { id: "advising", label: "Advising", href: "/advising", icon: BookOpen },
      { id: "routine", label: "Routine", href: "/routine", icon: Calendar },
      { id: "progress", label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
      { id: "payments", label: "Payments", href: "/payments", icon: CreditCard },
      {
        id: "notices",
        label: "Notices",
        href: "/notices",
        icon: Megaphone,
        badgeKey: "notices",
        badgeTone: "brand",
      },
      { id: "classmates", label: "Classmates", href: "/students", icon: GraduationCap },
      { id: "faculty", label: "Faculty", href: "/teachers", icon: Users },
      { id: "materials", label: "Materials", href: "/materials", icon: FolderGit2 },
      {
        id: "messages",
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badgeKey: "messages",
        badgeTone: "brand",
      },
    ],
    mobileTabs: [
      { id: "home", label: "Home", href: "/dashboard", icon: Home, exact: true },
      { id: "routine", label: "Routine", href: "/routine", icon: Calendar },
      { id: "notices", label: "Notices", href: "/notices", icon: Megaphone, badgeKey: "notices" },
      {
        id: "messages",
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badgeKey: "messages",
      },
      { id: "more", label: "More", icon: Menu, action: "more" },
    ],
    mobileOverflow: [
      { id: "profile", label: "Profile", href: "/profile", icon: User },
      { id: "payments", label: "Payments", href: "/payments", icon: CreditCard },
      { id: "progress", label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
      { id: "classmates", label: "Classmates", href: "/students", icon: GraduationCap },
      { id: "faculty", label: "Faculty", href: "/teachers", icon: Users },
      { id: "materials", label: "Materials", href: "/materials", icon: FolderGit2 },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
  teacher: {
    portalLabel: "Faculty",
    homeHref: "/teacher/dashboard",
    desktop: [
      {
        id: "home",
        label: "Home",
        href: "/teacher/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        id: "attendance",
        label: "Attendance",
        href: "/teacher/attendance",
        icon: CheckSquare,
        badgeKey: "liveAttendance",
        badgeTone: "success",
      },
      { id: "gradebook", label: "Gradebook", href: "/teacher/grades", icon: GraduationCap },
      { id: "routine", label: "Routine", href: "/teacher/routine", icon: Calendar },
      { id: "materials", label: "Materials", href: "/teacher/materials", icon: FolderGit2 },
      { id: "notices", label: "Notices", href: "/teacher/notices", icon: Megaphone },
      { id: "payroll", label: "Payroll", href: "/teacher/payroll", icon: CreditCard },
      {
        id: "messages",
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badgeKey: "messages",
        badgeTone: "brand",
      },
    ],
    mobileTabs: [
      { id: "home", label: "Home", href: "/teacher/dashboard", icon: LayoutDashboard, exact: true },
      {
        id: "attendance",
        label: "Attendance",
        href: "/teacher/attendance",
        icon: CheckSquare,
        badgeKey: "liveAttendance",
      },
      { id: "gradebook", label: "Gradebook", href: "/teacher/grades", icon: GraduationCap },
      {
        id: "messages",
        label: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badgeKey: "messages",
      },
      { id: "more", label: "More", icon: Menu, action: "more" },
    ],
    mobileOverflow: [
      { id: "routine", label: "Routine", href: "/teacher/routine", icon: Calendar },
      { id: "materials", label: "Materials", href: "/teacher/materials", icon: FolderGit2 },
      { id: "notices", label: "Notices", href: "/teacher/notices", icon: Megaphone },
      { id: "payroll", label: "Payroll", href: "/teacher/payroll", icon: CreditCard },
      { id: "faculty-profile", label: "Faculty Profile", href: "/teacher/profile", icon: User },
      { id: "faculty-directory", label: "Faculty Directory", href: "/teachers", icon: Users },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
    ],
  },
  admin: {
    portalLabel: "Admin",
    homeHref: "/admin/dashboard",
    desktop: [
      {
        id: "overview",
        label: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        id: "users",
        label: "Users",
        href: "/admin/users",
        icon: Users,
        badgeKey: "pendingApprovals",
        badgeTone: "danger",
      },
      { id: "departments", label: "Departments", href: "/admin/departments", icon: Building2 },
      { id: "routine", label: "Routine", href: "/admin/routine", icon: Calendar },
      { id: "notices", label: "Notices", href: "/admin/notices", icon: Megaphone },
      { id: "finance", label: "Finance", href: "/admin/finance", icon: CreditCard },
      { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      {
        id: "settings",
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        superAdminOnly: true,
      },
    ],
    mobileTabs: [
      { id: "overview", label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
      {
        id: "users",
        label: "Users",
        href: "/admin/users",
        icon: Users,
        badgeKey: "pendingApprovals",
      },
      { id: "routine", label: "Routine", href: "/admin/routine", icon: Calendar },
      { id: "notices", label: "Notices", href: "/admin/notices", icon: Megaphone },
      { id: "more", label: "More", icon: Menu, action: "more" },
    ],
    mobileOverflow: [
      { id: "departments", label: "Departments", href: "/admin/departments", icon: Building2 },
      { id: "finance", label: "Finance", href: "/admin/finance", icon: CreditCard },
      { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      {
        id: "settings",
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        superAdminOnly: true,
      },
    ],
  },
};

export function isNavItemActive(pathname: string, href: string, exact = false): boolean {
  if (pathname === href) return true;
  if (href === "/dashboard" && (pathname === "/" || pathname === "/student")) return true;
  if (href === "/teacher/dashboard" && pathname === "/teacher") return true;
  if (href === "/admin/dashboard" && pathname === "/admin") return true;
  if (exact) return false;
  return pathname.startsWith(`${href}/`);
}

export function resolveNavBadge(
  badgeKey: NavBadgeKey | undefined,
  role: PortalRole,
  pendingCount: number
): string | null {
  if (!badgeKey) return null;
  switch (badgeKey) {
    case "notices":
      return "3";
    case "messages":
      return role === "teacher" ? "4" : "2";
    case "liveAttendance":
      return "Live";
    case "pendingApprovals":
      return pendingCount > 0 ? String(pendingCount) : null;
    default:
      return null;
  }
}

export function getPortalTitle(
  role: PortalRole,
  pathname: string
): { section: string; title: string; homeHref: string } {
  if (role === "admin") {
    const homeHref = "/admin/dashboard";
    if (pathname === "/admin" || pathname === "/admin/dashboard") {
      return { section: "Admin", title: "Overview", homeHref };
    }
    if (pathname.startsWith("/admin/users")) {
      return { section: "Admin", title: "Users", homeHref };
    }
    if (pathname.startsWith("/admin/departments")) {
      return { section: "Admin", title: "Departments", homeHref };
    }
    if (pathname.startsWith("/admin/routine")) {
      return { section: "Admin", title: "Routine", homeHref };
    }
    if (pathname.startsWith("/admin/notices")) {
      return { section: "Admin", title: "Notices", homeHref };
    }
    if (pathname.startsWith("/admin/finance")) {
      return { section: "Admin", title: "Finance", homeHref };
    }
    if (pathname.startsWith("/admin/analytics")) {
      return { section: "Admin", title: "Analytics", homeHref };
    }
    if (pathname.startsWith("/admin/settings")) {
      return { section: "Admin", title: "Settings", homeHref };
    }
    const seg = pathname.split("/").filter(Boolean)[1] || "Overview";
    return {
      section: "Admin",
      title: seg.charAt(0).toUpperCase() + seg.slice(1),
      homeHref,
    };
  }

  if (role === "teacher") {
    const homeHref = "/teacher/dashboard";
    if (pathname === "/teacher" || pathname === "/teacher/dashboard") {
      return { section: "Faculty", title: "Home", homeHref };
    }
    if (pathname.startsWith("/teacher/attendance")) {
      return { section: "Faculty", title: "Attendance", homeHref };
    }
    if (pathname.startsWith("/teacher/grades")) {
      return { section: "Faculty", title: "Gradebook", homeHref };
    }
    if (pathname.startsWith("/teacher/routine")) {
      return { section: "Faculty", title: "Routine", homeHref };
    }
    if (pathname.startsWith("/teacher/materials")) {
      return { section: "Faculty", title: "Materials", homeHref };
    }
    if (pathname.startsWith("/teacher/notices")) {
      return { section: "Faculty", title: "Notices", homeHref };
    }
    if (pathname.startsWith("/teacher/payroll")) {
      return { section: "Faculty", title: "Payroll & Slips", homeHref: "/teacher/dashboard" };
    }
    if (pathname.startsWith("/teacher/profile")) {
      return { section: "Faculty", title: "Profile", homeHref };
    }
    if (pathname === "/messages") {
      return { section: "Faculty", title: "Messages", homeHref };
    }
    if (pathname === "/settings") {
      return { section: "Faculty", title: "Settings", homeHref };
    }
    if (pathname === "/teachers") {
      return { section: "Faculty", title: "Faculty Directory", homeHref };
    }
    if (pathname.startsWith("/teachers/")) {
      return { section: "Faculty", title: "Faculty Profile", homeHref };
    }
    const segments = pathname.split("/").filter(Boolean);
    const seg = segments.length > 1 ? segments[1] : segments[0] || "Home";
    return {
      section: "Faculty",
      title: seg.charAt(0).toUpperCase() + seg.slice(1),
      homeHref,
    };
  }

  const homeHref = "/dashboard";
  if (pathname === "/dashboard" || pathname === "/student") {
    return { section: "Student", title: "Home", homeHref };
  }
  if (pathname === "/dashboard/progress") {
    return { section: "Student", title: "Progress", homeHref };
  }
  if (pathname === "/payments") {
    return { section: "Student", title: "Payments & Fees", homeHref };
  }
  if (pathname === "/advising") {
    return { section: "Student", title: "Course Advising", homeHref };
  }
  if (pathname === "/routine") {
    return { section: "Student", title: "Routine", homeHref };
  }
  if (pathname === "/notices") {
    return { section: "Student", title: "Notices", homeHref };
  }
  if (pathname.startsWith("/notices/")) {
    return { section: "Notices", title: "Notice Detail", homeHref };
  }
  if (pathname === "/students") {
    return { section: "Student", title: "Classmates", homeHref };
  }
  if (pathname === "/teachers") {
    return { section: "Student", title: "Faculty", homeHref };
  }
  if (pathname.startsWith("/teachers/")) {
    return { section: "Faculty", title: "Faculty Profile", homeHref };
  }
  if (pathname === "/materials") {
    return { section: "Student", title: "Materials", homeHref };
  }
  if (pathname === "/messages") {
    return { section: "Student", title: "Messages", homeHref };
  }
  if (pathname === "/profile") {
    return { section: "Account", title: "Profile", homeHref };
  }
  if (pathname === "/settings") {
    return { section: "Account", title: "Settings", homeHref };
  }

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "Home";
  return {
    section: "Student",
    title: last.charAt(0).toUpperCase() + last.slice(1),
    homeHref,
  };
}
