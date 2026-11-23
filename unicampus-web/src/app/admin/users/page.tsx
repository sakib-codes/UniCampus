"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Upload, UserPlus, Trash2, CreditCard, Users } from "lucide-react";
import { Button, Modal, PageHeader, Tabs, Toast } from "@/components/ui";
import { IdCardPrintQueue } from "@/components/admin/users/IdCardPrintQueue";
import { ID_CARD_REQUESTS_EVENT, idCardService } from "@/lib/services/idCardService";
import { TableRowsSkeleton } from "@/components/ui/Skeleton";
import { adminService } from "@/lib/services/adminService";
import type { Department } from "@/types/admin";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  DEPT_META,
  mapProfileToUserRecord,
  resolveDeptKey,
  type DeptKey,
  type RoleTab,
  type UserRecord,
} from "@/components/admin/users/usersData";
import { UsersFilterBar } from "@/components/admin/users/UsersFilterBar";
import { UsersDirectoryTable } from "@/components/admin/users/UsersDirectoryTable";
import { UsersModals } from "@/components/admin/users/UsersModals";
import { RegistrationReviewModal } from "@/components/admin/users/RegistrationReviewModal";

export default function AdminUsersPage() {
  const { currentUser, isDeptAdmin } = useAdminAuth();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [liveDepartments, setLiveDepartments] = useState<Department[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [adminView, setAdminView] = useState<"directory" | "id_cards">("directory");
  const [idCardQueueCount, setIdCardQueueCount] = useState(0);
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [reviewingUser, setReviewingUser] = useState<UserRecord | null>(null);
  const [reviewRejectMode, setReviewRejectMode] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editRole, setEditRole] = useState<"student" | "teacher" | "admin">("student");
  const [editDeptKey, setEditDeptKey] = useState<DeptKey>("cse");
  const [editSemester, setEditSemester] = useState<string>("1st Semester");
  const [editTeacherCode, setEditTeacherCode] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"student" | "teacher" | "admin">("student");
  const [inviteDept, setInviteDept] = useState<DeptKey>("cse");
  const [inviteId, setInviteId] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync users with adminService, live Supabase, and event bus
  useEffect(() => {
    const syncProfiles = () => {
      const profiles = adminService.getProfiles();
      setUsers(profiles.map((p, idx) => mapProfileToUserRecord(p, idx)));
      setLiveDepartments(adminService.getDepartments());
    };
    syncProfiles();
    void adminService
      .hydrateFromSupabase()
      .then((hydrated) => {
        if (hydrated) syncProfiles();
      })
      .finally(() => {
        setIsHydrating(false);
      });
    window.addEventListener("unicampus:profiles-updated", syncProfiles);
    window.addEventListener("storage", syncProfiles);
    return () => {
      window.removeEventListener("unicampus:profiles-updated", syncProfiles);
      window.removeEventListener("storage", syncProfiles);
    };
  }, []);

  // Lock department filters if dept admin
  useEffect(() => {
    if (isDeptAdmin && currentUser) {
      queueMicrotask(() => {
        const key = resolveDeptKey(currentUser);
        setSelectedDept(key);
        setInviteDept(key);
        setEditDeptKey(key);
      });
    }
  }, [isDeptAdmin, currentUser]);

  // Keep ID card print queue badge count synced (department-scoped)
  useEffect(() => {
    const syncQueueCount = () => {
      const deptScope = isDeptAdmin ? selectedDept : selectedDept;
      const openReqs = idCardService
        .getAllRequests(deptScope)
        .filter((r) => r.status !== "collected");
      setIdCardQueueCount(openReqs.length);
    };
    syncQueueCount();
    window.addEventListener(ID_CARD_REQUESTS_EVENT, syncQueueCount);
    window.addEventListener("storage", syncQueueCount);
    return () => {
      window.removeEventListener(ID_CARD_REQUESTS_EVENT, syncQueueCount);
      window.removeEventListener("storage", syncQueueCount);
    };
  }, [isDeptAdmin, selectedDept]);

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
      if (isDeptAdmin && currentUser?.department_id) {
        if (u.departmentId !== currentUser.department_id && u.deptKey !== resolveDeptKey(currentUser)) {
          return false;
        }
      }
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
  }, [users, isDeptAdmin, currentUser, activeTab, selectedDept, selectedStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + pageSize);

  const directoryCounts = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const rejected = users.filter((u) => u.status === "rejected").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    return { active, pending, rejected, suspended };
  }, [users]);

  const roleTabs = useMemo(
    () => [
      { id: "all" as const, label: "All Users", count: users.length.toLocaleString() },
      {
        id: "student" as const,
        label: "Students",
        count: users.filter((u) => u.role === "student").length.toLocaleString(),
      },
      {
        id: "teacher" as const,
        label: "Faculty",
        count: users.filter((u) => u.role === "teacher").length.toLocaleString(),
      },
      {
        id: "admin" as const,
        label: "Admins",
        count: users.filter((u) => u.role === "admin").length.toLocaleString(),
      },
    ],
    [users]
  );

  const handleTogglePopover = useCallback((userId: string) => {
    setOpenPopoverId((prev) => (prev === userId ? null : userId));
  }, []);

  const handleEditRole = useCallback((user: UserRecord) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditDeptKey(user.deptKey);
    setEditSemester(user.semesterName || "1st Semester");
    setEditTeacherCode(user.teacherCode || "");
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
          ? {
              ...u,
              role: editRole,
              roleLabel: nextRoleLabel,
              deptKey: editDeptKey,
              department: deptMeta.fullName,
              semesterName: editRole === "student" ? editSemester : u.semesterName,
              teacherCode: editRole === "teacher" ? editTeacherCode : u.teacherCode,
            }
          : u
      )
    );

    adminService.updateProfile(editingUser.profileId, {
      role: editRole,
      department_id: deptMeta.id,
      department_name: deptMeta.fullName,
      ...(editRole === "student" ? { semester_name: editSemester } : {}),
      ...(editRole === "teacher" ? { teacher_code: editTeacherCode } : {}),
    });

    const targetName = editingUser.name;
    setEditingUser(null);
    triggerToast(`Updated role permissions for ${targetName}.`);
  }, [editDeptKey, editRole, editSemester, editTeacherCode, editingUser, triggerToast]);

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
      if (user.status === "suspended") {
        adminService.reactivateProfile(user.profileId);
        triggerToast(`Restored active access for ${user.name}.`);
      } else {
        adminService.suspendProfile(user.profileId);
        triggerToast(`Access suspended for ${user.name}.`);
      }
      setOpenPopoverId(null);
    },
    [triggerToast]
  );

  const handleApproveUser = useCallback(
    (user: UserRecord) => {
      adminService.approveProfile(user.profileId, currentUser?.full_name || "Academic Administration");
      triggerToast(`Approved and activated account for ${user.name}.`);
      setOpenPopoverId(null);
    },
    [currentUser, triggerToast]
  );

  const handleOpenReview = useCallback((user: UserRecord) => {
    setReviewRejectMode(false);
    setReviewingUser(user);
    setOpenPopoverId(null);
  }, []);

  const handleOpenRejectWithReason = useCallback((user: UserRecord) => {
    setReviewRejectMode(true);
    setReviewingUser(user);
    setOpenPopoverId(null);
  }, []);

  const handleConfirmRejectWithReason = useCallback(
    (user: UserRecord, reason: string) => {
      adminService.rejectProfile(
        user.profileId,
        reason,
        currentUser?.full_name || "Academic Administration"
      );
      triggerToast(`Rejected ${user.name}'s application with correction note.`);
      setOpenPopoverId(null);
    },
    [currentUser, triggerToast]
  );

  const handleToggleHold = useCallback(
    (user: UserRecord, holdType: "academic" | "financial") => {
      const isCurrentlyHeld =
        holdType === "academic" ? user.academic_hold : user.financial_hold;
      const actionLabel = isCurrentlyHeld ? "Cleared" : "Placed";
      const reason = isCurrentlyHeld
        ? `Administrative resolution by ${currentUser?.full_name || "Academic Registry"}`
        : `Administrative review: ${
            holdType === "academic"
              ? "Course prerequisite compliance check"
              : "Tuition dues review"
          }`;

      adminService.toggleStudentHold(user.profileId, holdType, !isCurrentlyHeld, reason);
      triggerToast(
        `${holdType === "academic" ? "Academic" : "Financial"} hold ${actionLabel.toLowerCase()} for ${user.name}.`
      );
      setOpenPopoverId(null);
    },
    [currentUser, triggerToast]
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    // Dept admin can only invite for their dept and cannot create admin
    const finalRole = isDeptAdmin && inviteRole === "admin" ? "student" : inviteRole;
    const finalDeptKey = isDeptAdmin && currentUser ? resolveDeptKey(currentUser) : inviteDept;
    const deptMeta = DEPT_META[finalDeptKey];
    const generatedId = inviteId.trim() || `GEN-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = adminService.createProfile({
      full_name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: finalRole,
      admin_role: finalRole === "admin" ? "dept_admin" : undefined,
      department_id: deptMeta.id,
      department_name: deptMeta.fullName,
      semester_id: finalRole === "student" ? "sem-cse-1" : null,
      semester_name: finalRole === "student" ? "1st Semester" : null,
      teacher_code: finalRole !== "student" ? generatedId : null,
      student_id: finalRole === "student" ? generatedId : null,
      avatar_url: "",
      is_approved: true,
    });

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

  const handleRequestDeleteUser = useCallback((user: UserRecord) => {
    setDeletingUser(user);
    setOpenPopoverId(null);
  }, []);

  const handleConfirmDeleteUser = useCallback(() => {
    if (!deletingUser) return;
    adminService.deleteProfile(deletingUser.profileId, currentUser?.full_name || "Admin");
    setUsers((prev) => prev.filter((u) => u.profileId !== deletingUser.profileId));
    triggerToast(`Permanently removed ${deletingUser.name} (${deletingUser.email}).`);
    setDeletingUser(null);
  }, [deletingUser, currentUser?.full_name, triggerToast]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setActiveTab("all");
    if (!isDeptAdmin) {
      setSelectedDept("all");
    }
    setSelectedStatus("all");
    setCurrentPage(1);
  }, [isDeptAdmin]);

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
              {users.length.toLocaleString()}
            </span>{" "}
            portal {users.length === 1 ? "user" : "users"}
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

      {/* Top Workspace View Switcher: User Directory vs ID Card Print Queue */}
      <Tabs
        value={adminView}
        onChange={(v) => setAdminView(v as "directory" | "id_cards")}
        ariaLabel="Admin user workspace views"
        tabs={[
          {
            id: "directory",
            label: "User Directory",
            icon: <Users className="w-3.5 h-3.5" />,
            count: users.length,
          },
          {
            id: "id_cards",
            label: "ID Card Print Queue",
            icon: <CreditCard className="w-3.5 h-3.5" />,
            count: idCardQueueCount,
          },
        ]}
      />

      {adminView === "id_cards" ? (
        <IdCardPrintQueue
          deptFilter={selectedDept}
          adminName={currentUser?.full_name || "Academic Administration"}
          onNotify={triggerToast}
        />
      ) : (
        <>
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
        departments={liveDepartments}
        onClearFilters={handleClearFilters}
        isDeptAdmin={isDeptAdmin}
      />

      {isHydrating && users.length === 0 ? (
        <TableRowsSkeleton rows={5} />
      ) : (
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
          onToggleHold={handleToggleHold}
          onApprove={handleApproveUser}
          onReject={handleOpenRejectWithReason}
          onReview={handleOpenReview}
          onDelete={handleRequestDeleteUser}
          currentUserEmail={currentUser?.email}
          statusSummary={`${directoryCounts.active} Active · ${directoryCounts.pending} Pending · ${directoryCounts.rejected} Rejected · ${directoryCounts.suspended} Suspended`}
        />
      )}
        </>
      )}

      <RegistrationReviewModal
        key={reviewingUser ? `${reviewingUser.profileId}-${reviewRejectMode}` : "closed"}
        user={reviewingUser}
        initialRejectMode={reviewRejectMode}
        onClose={() => setReviewingUser(null)}
        onApprove={handleApproveUser}
        onReject={handleConfirmRejectWithReason}
      />

      {/* Delete User Confirmation Modal */}
      <Modal
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        size="sm"
        title="Delete User Account"
        description="This action permanently removes the user from the portal directory and database."
      >
        {deletingUser && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-danger-light/60 border border-danger/25 space-y-1 text-xs">
              <div className="font-semibold text-fg">{deletingUser.name}</div>
              <div className="text-fg-muted">{deletingUser.email}</div>
              <div className="font-mono text-danger text-[11px]">
                {deletingUser.roleLabel} • ID: {deletingUser.id}
              </div>
            </div>
            <p className="text-xs text-fg-muted leading-relaxed">
              Are you sure you want to permanently remove this account? You can also{" "}
              <span className="font-semibold text-fg">Suspend</span> the user instead if you only want to pause access temporarily.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={handleConfirmDeleteUser}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
          triggerToast("Imported 124 students from CSE_2026_Batch.csv.");
        }}
        editingUser={editingUser}
        onCloseEditModal={() => setEditingUser(null)}
        editRole={editRole}
        onEditRoleChange={setEditRole}
        editDeptKey={editDeptKey}
        onEditDeptKeyChange={setEditDeptKey}
        editSemester={editSemester}
        onEditSemesterChange={setEditSemester}
        editTeacherCode={editTeacherCode}
        onEditTeacherCodeChange={setEditTeacherCode}
        onSaveRoleChanges={handleSaveRoleChanges}
        isDeptAdmin={isDeptAdmin}
      />
    </div>
  );
}
