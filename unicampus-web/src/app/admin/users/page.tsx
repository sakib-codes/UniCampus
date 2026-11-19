"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Upload,
  UserPlus,
  Shield,
  GraduationCap,
  User,
  MoreVertical,
  CheckCircle2,
  KeyRound,
  Eye,
  Ban,
  FilterX,
  ChevronDown,
  X,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Badge, Button, PageHeader, Tabs, Toast } from "@/components/ui";
import { CAMPUS_METRICS, CANONICAL_DEPARTMENTS } from "@/lib/canonicalCampus";
import { INITIAL_PROFILES } from "@/lib/mockData";
import { adminService } from "@/lib/services/adminService";
import type { Profile } from "@/types/admin";

type DeptKey = "it" | "cse" | "eee" | "bba" | "pharm" | "eng";
type RoleTab = "all" | "student" | "teacher" | "admin";

interface UserRecord {
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

const DEPT_META: Record<
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

function resolveDeptKey(profile: Profile): DeptKey {
  if (profile.department_id === "dept-cse") return "cse";
  if (profile.department_id === "dept-eee") return "eee";
  if (profile.department_id === "dept-bba") return "bba";
  if (profile.department_id === "dept-pharm") return "pharm";
  if (profile.department_id === "dept-eng") return "eng";
  return "it";
}

function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(Prof\.|Dr\.|Engr\.|Mr\.|Ms\.)\s+/gi, "")
    .replace(/^(Prof\.|Dr\.)\s+/gi, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function mapProfileToUserRecord(profile: Profile, index: number): UserRecord {
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(() =>
    INITIAL_PROFILES.map((p, idx) => mapProfileToUserRecord(p, idx))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Floating Action Popover state
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Modals & Feedback
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<"student" | "teacher" | "admin">("student");
  const [editDeptKey, setEditDeptKey] = useState<DeptKey>("cse");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"student" | "teacher" | "admin">("student");
  const [inviteDept, setInviteDept] = useState<DeptKey>("cse");
  const [inviteId, setInviteId] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const profiles = adminService.getProfiles();
      setUsers(profiles.map((p, idx) => mapProfileToUserRecord(p, idx)));
    });
  }, []);

  // Dismiss popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest("[data-action-trigger]")) return;
        setOpenPopoverId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (activeTab !== "all" && u.role !== activeTab) {
        return false;
      }
      if (selectedDept !== "all" && u.deptKey !== selectedDept) {
        return false;
      }
      if (selectedStatus !== "all" && u.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesId = u.id.toLowerCase().includes(q);
        const matchesDept = u.department.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesId && !matchesDept) {
          return false;
        }
      }
      return true;
    });
  }, [users, activeTab, selectedDept, selectedStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + pageSize);

  const directoryCounts = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    return { active, pending, suspended };
  }, [users]);

  const roleTabs = useMemo(
    () => [
      {
        id: "all" as const,
        label: "All Users",
        count: CAMPUS_METRICS.totalUsers.toLocaleString(),
      },
      {
        id: "student" as const,
        label: "Students",
        count: CAMPUS_METRICS.students.toLocaleString(),
      },
      {
        id: "teacher" as const,
        label: "Faculty",
        count: CAMPUS_METRICS.faculty.toLocaleString(),
      },
      {
        id: "admin" as const,
        label: "Admins",
        count: CAMPUS_METRICS.admins.toLocaleString(),
      },
    ],
    []
  );

  // Handle Actions
  const handleTogglePopover = (userId: string) => {
    setOpenPopoverId((prev) => (prev === userId ? null : userId));
  };

  const handleEditRole = (user: UserRecord) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditDeptKey(user.deptKey);
    setOpenPopoverId(null);
  };

  const handleSaveRoleChanges = () => {
    if (!editingUser) return;
    const deptMeta = DEPT_META[editDeptKey];
    const nextRoleLabel =
      editRole === "admin"
        ? "Admin"
        : editRole === "teacher"
        ? "Teacher"
        : "Student";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              role: editRole,
              roleLabel: nextRoleLabel,
              deptKey: editDeptKey,
              department: deptMeta.fullName,
            }
          : u
      )
    );

    adminService.updateProfile(editingUser.profileId, {
      role: editRole,
      department_id: deptMeta.id,
      department_name: deptMeta.fullName,
    });
    window.dispatchEvent(new Event("unicampus:profiles-updated"));

    const targetName = editingUser.name;
    setEditingUser(null);
    triggerToast(`Updated role permissions for ${targetName}.`);
  };

  const handleResetPassword = (user: UserRecord) => {
    setOpenPopoverId(null);
    triggerToast(`Password reset link dispatched to ${user.email}.`);
  };

  const handleImpersonate = (user: UserRecord) => {
    setOpenPopoverId(null);
    triggerToast(`Previewing portal view for ${user.name} (${user.roleLabel}).`);
  };

  const handleSuspendToggle = (user: UserRecord) => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    const nextLabel = nextStatus === "suspended" ? "Suspended" : "Active";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: nextStatus, statusLabel: nextLabel }
          : u
      )
    );

    if (nextStatus === "active") {
      adminService.approveProfile(user.profileId);
      window.dispatchEvent(new Event("unicampus:profiles-updated"));
    }

    setOpenPopoverId(null);
    triggerToast(
      user.status === "suspended"
        ? `Restored active access for ${user.name}.`
        : `Access suspended for ${user.name}.`
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const deptMeta = DEPT_META[inviteDept];
    const generatedId =
      inviteId.trim() || `GEN-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = adminService.createProfile({
      full_name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      admin_role: inviteRole === "admin" ? "dept_admin" : undefined,
      department_id: deptMeta.id,
      department_name: deptMeta.fullName,
      semester_id: inviteRole === "student" ? "sem-cse-1" : null,
      semester_name: inviteRole === "student" ? "1st Semester" : null,
      teacher_code: inviteRole !== "student" ? generatedId : null,
      student_id: inviteRole === "student" ? generatedId : null,
      avatar_url: "",
      is_approved: true,
    });
    window.dispatchEvent(new Event("unicampus:profiles-updated"));

    const newUser = mapProfileToUserRecord(created, 0);
    newUser.lastLogin = "Invited";

    setUsers((prev) => [newUser, ...prev]);
    setCurrentPage(1);
    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteId("");
    triggerToast(`Successfully invited and provisioned account for ${newUser.name}.`);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
    setSelectedDept("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  return (
    <div className="w-full space-y-5 antialiased selection:bg-brand/30 pb-6">
      <Toast
        open={Boolean(toastMessage)}
        message={toastMessage ?? ""}
        tone="success"
        durationMs={3500}
        onClose={() => setToastMessage(null)}
      />

      <PageHeader
        title="User Accounts & Role Permissions"
        description={
          <>
            Manage identity provisioning, role assignments, and account access across{" "}
            <span className="font-mono text-fg font-semibold">
              {CAMPUS_METRICS.totalUsers.toLocaleString()}
            </span>{" "}
            portal users
          </>
        }
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Upload className="w-4 h-4 text-fg-muted" />}
              onClick={() => setIsCsvModalOpen(true)}
            >
              Bulk Import CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite User
            </Button>
          </>
        }
      />

      {/* 2-ROW RESPONSIVE FILTER & ROLE TABS BAR */}
      <div className="bg-surface rounded-[20px] p-4 border border-line flex flex-col gap-3">
        {/* Row 1: Search + Department + Status + Reset */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or ID..."
              className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl pl-10 pr-9 py-2 text-xs text-fg placeholder:text-fg-muted focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search"
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by department"
                className="w-full min-h-[44px] appearance-none bg-surface-2 border border-line text-fg rounded-xl pl-3.5 pr-8 py-2 text-xs focus:outline-none focus:border-brand cursor-pointer transition-colors"
              >
                <option value="all">All Departments</option>
                {CANONICAL_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.code.toLowerCase()}>
                    {DEPT_META[d.code.toLowerCase() as DeptKey].shortLabel}
                  </option>
                ))}
                <option value="it">Central Administration</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by status"
                className="w-full min-h-[44px] appearance-none bg-surface-2 border border-line text-fg rounded-xl pl-3.5 pr-8 py-2 text-xs focus:outline-none focus:border-brand cursor-pointer transition-colors"
              >
                <option value="all">Status: All Accounts</option>
                <option value="active">Active Only</option>
                <option value="pending">Pending Verification</option>
                <option value="suspended">Suspended</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-surface-2 border border-line text-fg-muted hover:text-fg transition-colors cursor-pointer shrink-0"
              title="Reset Filters to Default"
              aria-label="Reset filters"
            >
              <FilterX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Role Filter Tabs (horizontally scrollable on 390px, zero overlap at 1440px) */}
        <div className="w-full overflow-x-auto max-w-full">
          <Tabs
            tabs={roleTabs}
            value={activeTab}
            onChange={(nextTab) => {
              setActiveTab(nextTab);
              setCurrentPage(1);
            }}
            layoutId="admin-users-role-pill"
            size="sm"
            ariaLabel="Filter users by role"
          />
        </div>
      </div>

      {/* USERS DATA CONTAINER */}
      <div className="bg-surface rounded-[20px] border border-line relative overflow-visible">
        {/* DESKTOP TABLE (hidden md:block) */}
        <div className="hidden md:block w-full overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-surface-2 border-b border-line text-xs font-mono text-fg-muted">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">ID</th>
                <th className="py-3 px-3 font-semibold">Department</th>
                <th className="py-3 px-3 font-semibold hidden xl:table-cell whitespace-nowrap">
                  Last Login
                </th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right w-16">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-line text-xs font-sans">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-fg-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-fg-muted/50" />
                      <p className="text-sm font-semibold text-fg">
                        No user accounts matched your filters
                      </p>
                      <p className="text-xs text-fg-muted">
                        Try clearing the search query or adjusting role and department selections.
                      </p>
                      <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => {
                  const isPopoverOpen = openPopoverId === user.id;
                  const openUpward =
                    index >= paginatedUsers.length - 2 && paginatedUsers.length > 2;

                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors h-14 ${
                        isPopoverOpen
                          ? "bg-surface-2 relative z-30"
                          : "hover:bg-surface-2/60"
                      }`}
                    >
                      {/* 1. Name & Email */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-brand">
                            {user.initials}
                          </div>
                          <div className="min-w-0 max-w-[210px]">
                            <div className="font-semibold text-fg flex items-center gap-1.5 truncate">
                              <span className="truncate">{user.name}</span>
                              {user.verified && (
                                <span
                                  title="Verified Superadmin Privileges"
                                  className="inline-flex text-brand shrink-0"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-fg-muted font-normal truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {user.role === "admin" && (
                          <Badge variant="brand">
                            <Shield className="w-3 h-3" />
                            <span>Admin</span>
                          </Badge>
                        )}
                        {user.role === "teacher" && (
                          <Badge variant="brand">
                            <GraduationCap className="w-3 h-3" />
                            <span>Teacher</span>
                          </Badge>
                        )}
                        {user.role === "student" && (
                          <Badge variant="neutral">
                            <User className="w-3 h-3" />
                            <span>Student</span>
                          </Badge>
                        )}
                      </td>

                      {/* 3. User ID / Student ID */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-mono text-xs text-fg bg-surface-2 px-2 py-1 rounded border border-line tabular-nums">
                          {user.id}
                        </span>
                      </td>

                      {/* 4. Department */}
                      <td className="py-2.5 px-3 text-fg-muted font-medium max-w-[180px] truncate">
                        {user.department}
                      </td>

                      {/* 5. Last Login */}
                      <td className="py-2.5 px-3 whitespace-nowrap hidden xl:table-cell">
                        <span
                          className={`font-mono text-xs ${
                            user.isOnlineNow ? "text-success font-medium" : "text-fg-muted"
                          }`}
                        >
                          {user.lastLogin}
                        </span>
                      </td>

                      {/* 6. Account Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {user.status === "active" && (
                          <Badge variant="success">Active</Badge>
                        )}
                        {user.status === "pending" && (
                          <Badge variant="warning">Pending Verification</Badge>
                        )}
                        {user.status === "suspended" && (
                          <Badge variant="danger">Suspended</Badge>
                        )}
                      </td>

                      {/* 7. Actions */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap relative">
                        <button
                          type="button"
                          data-action-trigger="true"
                          onClick={() => handleTogglePopover(user.id)}
                          aria-label={`Manage ${user.name}`}
                          className={`min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                            isPopoverOpen
                              ? "bg-surface-2 text-brand border border-brand/40"
                              : "text-fg-muted hover:text-fg hover:bg-surface-2"
                          }`}
                          title="Manage User Account"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isPopoverOpen && (
                          <div
                            ref={popoverRef}
                            className={`absolute right-4 ${
                              openUpward ? "bottom-12" : "top-12"
                            } w-52 bg-surface border border-line rounded-xl shadow-lg p-1.5 z-50 text-left`}
                          >
                            <div className="px-2.5 py-1.5 text-xs font-mono text-fg-muted border-b border-line mb-1 flex items-center justify-between gap-2">
                              <span>User Actions</span>
                              <span className="font-mono text-xs text-brand truncate">
                                {user.id}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleEditRole(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 hover:text-brand text-xs transition-colors cursor-pointer"
                            >
                              <Shield className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                              <span className="font-medium">Edit Role &amp; Permissions</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleResetPassword(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                              <span className="font-medium">Reset Password</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleImpersonate(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                              <span className="font-medium">Preview Role View</span>
                            </button>

                            <div className="my-1 border-t border-line" />

                            <button
                              type="button"
                              onClick={() => handleSuspendToggle(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-danger hover:bg-danger-light text-xs transition-colors font-medium cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5 text-danger shrink-0" />
                              <span>
                                {user.status === "suspended"
                                  ? "Reactivate Account"
                                  : "Suspend Account"}
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS (md:hidden) */}
        <div className="md:hidden divide-y divide-line">
          {paginatedUsers.length === 0 ? (
            <div className="py-12 px-4 text-center text-fg-muted space-y-2">
              <AlertCircle className="w-8 h-8 text-fg-muted/50 mx-auto" />
              <p className="text-sm font-semibold text-fg">
                No user accounts matched your filters
              </p>
              <p className="text-xs text-fg-muted">
                Try clearing the search query or adjusting filters.
              </p>
              <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            paginatedUsers.map((user) => {
              const isPopoverOpen = openPopoverId === user.id;

              return (
                <div key={user.id} className="p-4 space-y-3 relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0 font-mono text-xs font-bold text-brand">
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-fg truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-fg-muted truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      data-action-trigger="true"
                      onClick={() => handleTogglePopover(user.id)}
                      aria-label={`Manage ${user.name}`}
                      className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 inline-flex items-center justify-center rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer shrink-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-fg bg-surface-2 px-2 py-0.5 rounded border border-line tabular-nums">
                      {user.id}
                    </span>
                    <Badge variant={user.role === "student" ? "neutral" : "brand"}>
                      {user.roleLabel}
                    </Badge>
                    {user.status === "active" && (
                      <Badge variant="success">Active</Badge>
                    )}
                    {user.status === "pending" && (
                      <Badge variant="warning">Pending Verification</Badge>
                    )}
                    {user.status === "suspended" && (
                      <Badge variant="danger">Suspended</Badge>
                    )}
                  </div>

                  <div className="text-xs text-fg-muted flex items-center justify-between gap-2">
                    <span className="truncate">{user.department}</span>
                    <span className="font-mono shrink-0">{user.lastLogin}</span>
                  </div>

                  {isPopoverOpen && (
                    <div
                      ref={popoverRef}
                      className="mt-2 p-1.5 rounded-xl bg-surface-2 border border-line grid grid-cols-1 gap-1"
                    >
                      <button
                        type="button"
                        onClick={() => handleEditRole(user)}
                        className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                        <span>Edit Role &amp; Permissions</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(user)}
                        className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                        <span>Reset Password</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSuspendToggle(user)}
                        className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-danger hover:bg-danger-light text-xs font-medium cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5 text-danger shrink-0" />
                        <span>
                          {user.status === "suspended"
                            ? "Reactivate Account"
                            : "Suspend Account"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* LIVE PAGINATION FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-surface-2 border-t border-line rounded-b-[20px] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-fg-muted font-mono">
            Showing{" "}
            <span className="text-fg font-semibold tabular-nums">
              {filteredUsers.length === 0 ? 0 : startIdx + 1}–
              {Math.min(startIdx + pageSize, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="text-fg font-semibold tabular-nums">
              {filteredUsers.length}
            </span>{" "}
            accounts
          </div>

          <div className="flex items-center gap-1.5 font-mono flex-wrap justify-center">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              &lt; Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-[36px] min-h-[36px] rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors ${
                  page === safePage
                    ? "bg-brand text-on-brand"
                    : "bg-surface border border-line text-fg-muted hover:text-fg"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM METADATA STATUS STRIP (Deduplicated, zero status dots, reconciled to 5,072) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-fg-muted px-2 font-mono gap-2 pt-1">
        <div>
          Directory sample: {users.length} accounts ({directoryCounts.active} Active ·{" "}
          {directoryCounts.pending} Pending · {directoryCounts.suspended} Suspended)
        </div>
        <div>
          Portal Total: {CAMPUS_METRICS.totalUsers.toLocaleString()} (4,924 Active · 118
          Pending · 30 Suspended)
        </div>
      </div>

      {/* MODAL 1: Invite / Add New User */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-[20px] w-full max-w-lg shadow-xl p-6 relative">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg">
                    Invite &amp; Provision User
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Create institutional identity credentials
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Noor or Tanvir Mahmud"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@unicampus.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                    Role Privilege
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "student" | "teacher" | "admin")
                    }
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                    Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value as DeptKey)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer"
                  >
                    {CANONICAL_DEPARTMENTS.map((d) => {
                      const key = d.code.toLowerCase() as DeptKey;
                      return (
                        <option key={d.id} value={key}>
                          {DEPT_META[key].shortLabel}
                        </option>
                      );
                    })}
                    <option value="it">Central Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                  Student ID / Faculty Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 211-15-4499 or FAC-2090"
                  value={inviteId}
                  onChange={(e) => setInviteId(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-mono text-fg focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bulk Import CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-[20px] w-full max-w-lg shadow-xl p-6 relative">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg">
                    Bulk Import User Accounts
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Upload batch roster via CSV or XLSX file
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-line hover:border-brand rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface-2/60">
                <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-fg">
                  Drag and drop roster CSV here, or{" "}
                  <span className="text-brand underline">browse</span>
                </p>
                <p className="text-xs text-fg-muted mt-1">
                  Supported formats: .CSV, .XLSX (Max file size: 25MB)
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-surface-2 border border-line text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-fg-muted shrink-0" />
                  <span className="text-fg-muted">Need the correct header format?</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Sample roster CSV template downloaded.")}
                  className="flex items-center gap-1.5 text-brand hover:underline font-semibold cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCsvModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsCsvModalOpen(false);
                    triggerToast("Imported 124 students from CSE_Spring2026_Batch.csv.");
                  }}
                >
                  Process CSV Import
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Role & Permissions */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-[20px] w-full max-w-md shadow-xl p-6 relative">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg">
                    Edit Role &amp; Permissions
                  </h3>
                  <p className="text-xs text-fg-muted font-mono">
                    {editingUser.id} • {editingUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                  Assigned Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) =>
                    setEditRole(e.target.value as "student" | "teacher" | "admin")
                  }
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fg-muted mb-1.5">
                  Academic Department
                </label>
                <select
                  value={editDeptKey}
                  onChange={(e) => setEditDeptKey(e.target.value as DeptKey)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus:outline-none cursor-pointer"
                >
                  {CANONICAL_DEPARTMENTS.map((d) => {
                    const key = d.code.toLowerCase() as DeptKey;
                    return (
                      <option key={d.id} value={key}>
                        {DEPT_META[key].fullName}
                      </option>
                    );
                  })}
                  <option value="it">Central University Administration</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveRoleChanges}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
