"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Upload, UserPlus } from "lucide-react";
import { Button, PageHeader, Toast } from "@/components/ui";
import { CAMPUS_METRICS } from "@/lib/canonicalCampus";
import { INITIAL_PROFILES } from "@/lib/mockData";
import { adminService } from "@/lib/services/adminService";
import {
  DEPT_META,
  mapProfileToUserRecord,
  type DeptKey,
  type RoleTab,
  type UserRecord,
} from "@/components/admin/users/usersData";
import { UsersFilterBar } from "@/components/admin/users/UsersFilterBar";
import { UsersDirectoryTable } from "@/components/admin/users/UsersDirectoryTable";
import { UsersModals } from "@/components/admin/users/UsersModals";

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

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<"student" | "teacher" | "admin">("student");
  const [editDeptKey, setEditDeptKey] = useState<DeptKey>("cse");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (activeTab !== "all" && u.role !== activeTab) return false;
      if (selectedDept !== "all" && u.deptKey !== selectedDept) return false;
      if (selectedStatus !== "all" && u.status !== selectedStatus) return false;
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
      { id: "all" as const, label: "All Users", count: CAMPUS_METRICS.totalUsers.toLocaleString() },
      { id: "student" as const, label: "Students", count: CAMPUS_METRICS.students.toLocaleString() },
      { id: "teacher" as const, label: "Faculty", count: CAMPUS_METRICS.faculty.toLocaleString() },
      { id: "admin" as const, label: "Admins", count: CAMPUS_METRICS.admins.toLocaleString() },
    ],
    []
  );

  const handleTogglePopover = useCallback((userId: string) => {
    setOpenPopoverId((prev) => (prev === userId ? null : userId));
  }, []);

  const handleEditRole = useCallback((user: UserRecord) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditDeptKey(user.deptKey);
    setOpenPopoverId(null);
  }, []);

  const handleSaveRoleChanges = useCallback(() => {
    if (!editingUser) return;
    const deptMeta = DEPT_META[editDeptKey];
    const nextRoleLabel =
      editRole === "admin" ? "Admin" : editRole === "teacher" ? "Teacher" : "Student";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, role: editRole, roleLabel: nextRoleLabel, deptKey: editDeptKey, department: deptMeta.fullName }
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
  }, [editDeptKey, editRole, editingUser, triggerToast]);

  const handleResetPassword = useCallback(
    (user: UserRecord) => {
      setOpenPopoverId(null);
      triggerToast(`Password reset link dispatched to ${user.email}.`);
    },
    [triggerToast]
  );

  const handleImpersonate = useCallback(
    (user: UserRecord) => {
      setOpenPopoverId(null);
      triggerToast(`Previewing portal view for ${user.name} (${user.roleLabel}).`);
    },
    [triggerToast]
  );

  const handleSuspendToggle = useCallback(
    (user: UserRecord) => {
      const nextStatus = user.status === "suspended" ? "active" : "suspended";
      const nextLabel = nextStatus === "suspended" ? "Suspended" : "Active";

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus, statusLabel: nextLabel } : u))
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
    },
    [triggerToast]
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const deptMeta = DEPT_META[inviteDept];
    const generatedId = inviteId.trim() || `GEN-${Math.floor(1000 + Math.random() * 9000)}`;

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

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveTab("all");
    setSelectedDept("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  }, []);

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
            <span className="font-sans tabular-nums text-fg font-semibold">
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

      <UsersFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        selectedDept={selectedDept}
        onDeptChange={(dept) => {
          setSelectedDept(dept);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        activeTab={activeTab}
        onTabChange={(nextTab) => {
          setActiveTab(nextTab);
          setCurrentPage(1);
        }}
        roleTabs={roleTabs}
        onClearFilters={handleClearFilters}
      />

      <UsersDirectoryTable
        paginatedUsers={paginatedUsers}
        totalFilteredCount={filteredUsers.length}
        startIdx={startIdx}
        pageSize={pageSize}
        safePage={safePage}
        totalPages={totalPages}
        openPopoverId={openPopoverId}
        popoverRef={popoverRef}
        onPageChange={setCurrentPage}
        onClearFilters={handleClearFilters}
        onTogglePopover={handleTogglePopover}
        onEditRole={handleEditRole}
        onResetPassword={handleResetPassword}
        onImpersonate={handleImpersonate}
        onSuspendToggle={handleSuspendToggle}
      />

      {/* BOTTOM METADATA STATUS STRIP */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-fg-muted px-2 font-sans tabular-nums gap-2 pt-1">
        <div>
          Directory sample: {users.length} accounts ({directoryCounts.active} Active ·{" "}
          {directoryCounts.pending} Pending · {directoryCounts.suspended} Suspended)
        </div>
        <div>
          Portal Total: {CAMPUS_METRICS.totalUsers.toLocaleString()} (4,924 Active · 118
          Pending · 30 Suspended)
        </div>
      </div>

      <UsersModals
        isInviteModalOpen={isInviteModalOpen}
        onCloseInviteModal={() => setIsInviteModalOpen(false)}
        inviteName={inviteName}
        onInviteNameChange={setInviteName}
        inviteEmail={inviteEmail}
        onInviteEmailChange={setInviteEmail}
        inviteRole={inviteRole}
        onInviteRoleChange={setInviteRole}
        inviteDept={inviteDept}
        onInviteDeptChange={setInviteDept}
        inviteId={inviteId}
        onInviteIdChange={setInviteId}
        onCreateUser={handleCreateUser}
        isCsvModalOpen={isCsvModalOpen}
        onCloseCsvModal={() => setIsCsvModalOpen(false)}
        onDownloadTemplate={() => triggerToast("Sample roster CSV template downloaded.")}
        onProcessCsvImport={() => {
          setIsCsvModalOpen(false);
          triggerToast("Imported 124 students from CSE_Spring2026_Batch.csv.");
        }}
        editingUser={editingUser}
        onCloseEditModal={() => setEditingUser(null)}
        editRole={editRole}
        onEditRoleChange={setEditRole}
        editDeptKey={editDeptKey}
        onEditDeptKeyChange={setEditDeptKey}
        onSaveRoleChanges={handleSaveRoleChanges}
      />
    </div>
  );
}
