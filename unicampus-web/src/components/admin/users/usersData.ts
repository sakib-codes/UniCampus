import type { Profile } from "@/types/admin";

export type DeptKey = "it" | "cse" | "eee" | "bba" | "pharm" | "eng";
export type RoleTab = "all" | "student" | "teacher" | "admin";

export interface UserRecord {
  id: string;
  profileId: string;
  name: string;
  email: string;
  initials: string;
  role: "admin" | "teacher" | "student";
  roleLabel: string;
  department: string;
  deptKey: DeptKey;
  lastLogin: string;
  isOnlineNow?: boolean;
  status: "active" | "pending" | "suspended";
  statusLabel: string;
  verified?: boolean;
}

export const DEPT_META: Record<
  DeptKey,
  { id: string; shortLabel: string; fullName: string }
> = {
  cse: {
    id: "dept-cse",
    shortLabel: "Computer Science (CSE)",
    fullName: "Computer Science & Engineering",
  },
  eee: {
    id: "dept-eee",
    shortLabel: "Electrical Eng (EEE)",
    fullName: "Electrical & Electronic Engineering",
  },
  bba: {
    id: "dept-bba",
    shortLabel: "Business Admin (BBA)",
    fullName: "Business Administration",
  },
  pharm: {
    id: "dept-pharm",
    shortLabel: "Pharmacy (PHARM)",
    fullName: "Department of Pharmacy",
  },
  eng: {
    id: "dept-eng",
    shortLabel: "English (ENG)",
    fullName: "Department of English",
  },
  it: {
    id: "all",
    shortLabel: "Central Administration",
    fullName: "Central University Administration",
  },
};

export function resolveDeptKey(profile: Profile): DeptKey {
  if (profile.department_id === "dept-cse") return "cse";
  if (profile.department_id === "dept-eee") return "eee";
  if (profile.department_id === "dept-bba") return "bba";
  if (profile.department_id === "dept-pharm") return "pharm";
  if (profile.department_id === "dept-eng") return "eng";
  return "it";
}

export function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(Prof\.|Dr\.|Engr\.|Mr\.|Ms\.)\s+/gi, "")
    .replace(/^(Prof\.|Dr\.)\s+/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function mapProfileToUserRecord(profile: Profile, index: number): UserRecord {
  const deptKey = resolveDeptKey(profile);
  const displayId =
    profile.student_id ||
    profile.teacher_code ||
    profile.id.toUpperCase();
  const loginWindows = [
    "2 mins ago",
    "14 mins ago",
    "38 mins ago",
    "1 hour ago",
    "3 hours ago",
    "Yesterday",
  ];
  const isOnline = profile.id === "user-stud-1";

  return {
    id: displayId,
    profileId: profile.id,
    name: profile.full_name,
    email: profile.email,
    initials: getInitials(profile.full_name),
    role: profile.role,
    roleLabel:
      profile.role === "admin"
        ? "Admin"
        : profile.role === "teacher"
        ? "Teacher"
        : "Student",
    department:
      profile.department_name || DEPT_META[deptKey].fullName,
    deptKey,
    lastLogin: !profile.is_approved
      ? "Pending verification"
      : isOnline
      ? "Online now"
      : loginWindows[index % loginWindows.length],
    isOnlineNow: isOnline && profile.is_approved,
    status: profile.is_approved ? "active" : "pending",
    statusLabel: profile.is_approved ? "Active" : "Pending Verification",
    verified: profile.admin_role === "super_admin",
  };
}
