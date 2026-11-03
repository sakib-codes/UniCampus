"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  RotateCcw,
  Eye,
  Ban,
  FilterX,
  ChevronDown,
  X,
  Download,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { themeTokens } from "@/lib/theme";

interface UserRecord {
  id: string; // e.g., ADM-00104, FAC-1042, 211-15-4424
  name: string;
  email: string;
  initials: string;
  initialsBg: string;
  role: "admin" | "teacher" | "student";
  roleLabel: string;
  department: string;
  deptKey: "it" | "cse" | "eee" | "bba";
  lastLogin: string;
  isOnlineNow?: boolean;
  status: "active" | "pending" | "suspended";
  statusLabel: string;
  verified?: boolean;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: "ADM-00104",
    name: "Syed Tariqul Islam",
    email: "tariq.admin@unicampus.edu",
    initials: "TI",
    initialsBg: "from-[#1D5BD8]/30 to-sky-500/30 text-[#60A5FA] border-[#1D5BD8]/40",
    role: "admin",
    roleLabel: "Admin",
    department: "IT & Systems",
    deptKey: "it",
    lastLogin: "2 mins ago",
    status: "active",
    statusLabel: "Active",
    verified: true,
  },
  {
    id: "FAC-1042",
    name: "Dr. Asif Rahman",
    email: "asif.rahman@unicampus.edu",
    initials: "AR",
    initialsBg: "from-[#58A6FF]/30 to-blue-600/30 text-[#58A6FF] border-[#58A6FF]/40",
    role: "teacher",
    roleLabel: "Teacher",
    department: "Computer Science (CSE)",
    deptKey: "cse",
    lastLogin: "14 mins ago",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "FAC-1088",
    name: "Dr. Farhana Khan",
    email: "farhana.khan@unicampus.edu",
    initials: "FK",
    initialsBg: "from-[#58A6FF]/30 to-teal-500/30 text-[#58A6FF] border-[#58A6FF]/40",
    role: "teacher",
    roleLabel: "Teacher",
    department: "Computer Science (CSE)",
    deptKey: "cse",
    lastLogin: "1 hour ago",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "211-15-4424",
    name: "Sakib Ahmed",
    email: "sakib.211154424@unicampus.edu",
    initials: "SA",
    initialsBg: "from-[#1C2128] to-[#161B22] text-[#8D96A0] border-[#30363D]",
    role: "student",
    roleLabel: "Student",
    department: "Computer Science (CSE)",
    deptKey: "cse",
    lastLogin: "Online now",
    isOnlineNow: true,
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "211-15-4425",
    name: "Nusrat Jahan",
    email: "nusrat.211154425@unicampus.edu",
    initials: "NJ",
    initialsBg: "from-[#1C2128] to-[#161B22] text-[#8D96A0] border-[#30363D]",
    role: "student",
    roleLabel: "Student",
    department: "Computer Science (CSE)",
    deptKey: "cse",
    lastLogin: "38 mins ago",
    status: "active",
    statusLabel: "Active",
  },
  {
    id: "211-14-3210",
    name: "Kamrul Hasan",
    email: "kamrul.211143210@unicampus.edu",
    initials: "KH",
    initialsBg: "from-[#D29922]/20 to-[#1C2128] text-[#D29922] border-[#D29922]/40",
    role: "student",
    roleLabel: "Student",
    department: "Electrical Eng (EEE)",
    deptKey: "eee",
    lastLogin: "14 days ago",
    status: "pending",
    statusLabel: "Pending Verification",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "student" | "teacher" | "admin">("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Floating Action Popover state - Row 2 (FAC-1042 Dr. Asif Rahman) is open by default
  const [openPopoverId, setOpenPopoverId] = useState<string | null>("FAC-1042");

  // Modals & Feedback
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form State
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"student" | "teacher" | "admin">("student");
  const [inviteDept, setInviteDept] = useState<"cse" | "eee" | "bba" | "it">("cse");
  const [inviteId, setInviteId] = useState("");

  const popoverRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role Tab
      if (activeTab !== "all" && u.role !== activeTab) {
        return false;
      }
      // Department
      if (selectedDept !== "all" && u.deptKey !== selectedDept) {
        return false;
      }
      // Status
      if (selectedStatus !== "all" && u.status !== selectedStatus) {
        return false;
      }
      // Search Query
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

  // Handle Actions
  const handleTogglePopover = (userId: string) => {
    setOpenPopoverId((prev) => (prev === userId ? null : userId));
  };

  const handleEditRole = (user: UserRecord) => {
    setEditingUser(user);
    setOpenPopoverId(null);
  };

  const handleResetPassword = (user: UserRecord) => {
    setOpenPopoverId(null);
    triggerToast(`Password reset link dispatched to ${user.email}.`);
  };

  const handleImpersonate = (user: UserRecord) => {
    setOpenPopoverId(null);
    triggerToast(`Impersonating session for ${user.name} (${user.roleLabel}).`);
  };

  const handleSuspendToggle = (user: UserRecord) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === user.id) {
          const nextStatus = u.status === "suspended" ? "active" : "suspended";
          const nextLabel = nextStatus === "suspended" ? "Suspended" : "Active";
          return { ...u, status: nextStatus, statusLabel: nextLabel };
        }
        return u;
      })
    );
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

    const deptMap: Record<string, string> = {
      cse: "Computer Science (CSE)",
      eee: "Electrical Eng (EEE)",
      bba: "Business Administration (BBA)",
      it: "IT & Systems",
    };

    const initials = inviteName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newUser: UserRecord = {
      id: inviteId.trim() || `GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      initials,
      initialsBg:
        inviteRole === "admin"
          ? "from-[#1D5BD8]/30 to-sky-500/30 text-[#60A5FA] border-[#1D5BD8]/40"
          : inviteRole === "teacher"
          ? "from-[#58A6FF]/30 to-blue-600/30 text-[#58A6FF] border-[#58A6FF]/40"
          : "from-[#1C2128] to-[#161B22] text-[#8D96A0] border-[#30363D]",
      role: inviteRole,
      roleLabel: inviteRole === "admin" ? "Admin" : inviteRole === "teacher" ? "Teacher" : "Student",
      department: deptMap[inviteDept] || "Central Campus",
      deptKey: inviteDept,
      lastLogin: "Never (Invited)",
      status: "active",
      statusLabel: "Active",
    };

    setUsers((prev) => [newUser, ...prev]);
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
  };

  return (
    <div className="w-full space-y-5 antialiased selection:bg-[#2563EB]/30 pb-4">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2563EB]/40 text-xs font-semibold text-slate-900 dark:text-[#F0F6FC] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-brand/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-brand dark:text-[#2563EB] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.02em] text-slate-900 dark:text-[#F0F6FC] font-manrope">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-[#8D96A0] mt-1 font-sans">
            Manage identity provisioning, role assignments, and account security across{" "}
            <span className="font-mono text-slate-900 dark:text-[#F0F6FC] font-semibold">5,060</span> portal users
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#8D96A0]/50 text-slate-700 dark:text-[#F0F6FC] transition-all text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
            title="Bulk Import Users from CSV/Excel"
          >
            <Upload className="w-4 h-4 text-[#8D96A0]" />
            <span>Bulk Import CSV</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#5752E5] text-white transition-all text-xs font-bold shadow-[0_0_16px_rgba(37, 99, 235,0.35)] cursor-pointer active:scale-[0.98]"
            title="Invite or Provision New Portal Identity"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Invite / Add New User</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEGMENTED CONTROL BAR (#0D1117 Card, 16px padding) */}
      <div className="bg-white/70 dark:bg-[#0D1117] rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-[#30363D] backdrop-blur-xl shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Left: Search & Role Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 min-w-0">
          {/* Search Input (240px) */}
          <div className="relative w-full sm:w-[240px] shrink-0">
            <Search className="w-4 h-4 text-[#8D96A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full bg-slate-100/80 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-[#2563EB] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#8D96A0] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D96A0] hover:text-[#F0F6FC]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Role Track */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D]/80 text-xs shrink-0 relative">
            {[
              { id: "all", label: "All Users", count: "5,060" },
              { id: "student", label: "Students", count: "4,820" },
              { id: "teacher", label: "Faculty", count: "240" },
              { id: "admin", label: "Admins", count: "12" },
            ].map((role) => {
              const isActive = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id as any)}
                  className={`relative px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap z-10 ${
                    isActive
                      ? "text-slate-900 dark:text-[#F0F6FC]"
                      : "text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-users-role-pill"
                      className="absolute inset-0 bg-white dark:bg-[#161B22] rounded-lg shadow-xs border border-slate-200 dark:border-[#30363D] -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span>{role.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                      isActive
                        ? "bg-brand/10 text-brand border border-brand/30 dark:bg-[#0D1117] dark:text-[#2563EB] dark:border-[#30363D]"
                        : "text-slate-500 bg-slate-100 dark:text-[#8D96A0] dark:bg-[#161B22]"
                    }`}
                  >
                    {role.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Department & Status Dropdowns + Reset */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] rounded-xl pl-3.5 pr-8 py-2 text-xs focus:outline-none focus:border-[#2563EB] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1C2128] transition-colors"
            >
              <option value="all">All Departments</option>
              <option value="cse">Computer Science (CSE)</option>
              <option value="eee">Electrical Eng (EEE)</option>
              <option value="bba">Business Admin (BBA)</option>
              <option value="it">IT & Systems</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D96A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] rounded-xl pl-3.5 pr-8 py-2 text-xs focus:outline-none focus:border-[#2563EB] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1C2128] transition-colors"
            >
              <option value="all">Status: All Accounts</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Verification</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8D96A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear Filter Icon */}
          <button
            onClick={handleClearFilters}
            className="p-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-500 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-50 dark:hover:bg-[#1C2128] transition-colors cursor-pointer"
            title="Reset Filters to Default"
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* USERS DATA TABLE CARD (#0D1117 container, rounded-3xl, 1px #30363D border) */}
      <div className="bg-white/70 dark:bg-[#0D1117] rounded-3xl border border-white/80 dark:border-[#30363D] backdrop-blur-xl shadow-xl relative overflow-visible">
        
        <div className="w-full overflow-x-auto min-h-[440px]">
          <table className="w-full text-left border-collapse table-auto">
            
            {/* Table Header Row (#161B22) */}
            <thead>
              <tr className="bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">
                <th className="py-3 px-5 sm:px-6 font-semibold min-w-[220px]">User (Name & Email)</th>
                <th className="py-3 px-4 font-semibold min-w-[120px]">Role Badge</th>
                <th className="py-3 px-4 font-semibold min-w-[130px]">User ID / Student ID</th>
                <th className="py-3 px-4 font-semibold min-w-[160px]">Department</th>
                <th className="py-3 px-4 font-semibold min-w-[110px]">Last Login</th>
                <th className="py-3 px-4 font-semibold min-w-[140px]">Account Status</th>
                <th className="py-3 px-5 sm:px-6 font-semibold text-right min-w-[80px]">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/80 text-xs font-sans">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#8D96A0]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-[#8D96A0]/50" />
                      <p className="text-sm font-semibold text-[#F0F6FC]">No user accounts matched your filters</p>
                      <p className="text-xs text-[#8D96A0]">
                        Try clearing the search query or adjusting role and department selections.
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs font-semibold text-slate-700 dark:text-[#F0F6FC] hover:bg-slate-50 dark:hover:bg-[#1C2128] hover:text-brand dark:hover:text-[#2563EB] transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isPopoverOpen = openPopoverId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors h-14 ${
                        isPopoverOpen
                          ? "bg-blue-50/70 dark:bg-[#161B22]/90 relative z-30"
                          : "hover:bg-slate-50/80 dark:hover:bg-[#161B22]/60"
                      }`}
                    >
                      {/* 1. Name & Email */}
                      <td className="py-2.5 px-5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-tr border flex items-center justify-center shrink-0 font-mono text-xs font-bold ${user.initialsBg}`}
                          >
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] flex items-center gap-1.5 truncate">
                              <span>{user.name}</span>
                              {user.verified && (
                                <span
                                  title="Verified Superadmin Privileges"
                                  className="inline-flex text-[#2563EB]"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#2563EB]/20" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-[#8D96A0] font-normal truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role Badge */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(37, 99, 235,0.16)] text-[#2563EB] border border-[#2563EB]/30 text-[11px] font-semibold">
                            <Shield className="w-3 h-3 fill-[#2563EB]/20" />
                            <span>Admin</span>
                          </span>
                        )}

                        {user.role === "teacher" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(88,166,255,0.16)] text-[#58A6FF] border border-[#58A6FF]/30 text-[11px] font-semibold">
                            <GraduationCap className="w-3 h-3" />
                            <span>Teacher</span>
                          </span>
                        )}

                        {user.role === "student" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#1C2128] dark:text-[#8D96A0] dark:border-[#30363D] text-[11px] font-semibold">
                            <User className="w-3 h-3" />
                            <span>Student</span>
                          </span>
                        )}
                      </td>

                      {/* 3. User ID / Student ID */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs text-slate-800 dark:text-[#F0F6FC] bg-slate-100 dark:bg-[#161B22] px-2 py-1 rounded border border-slate-200 dark:border-[#30363D]/80 tabular-nums">
                          {user.id}
                        </span>
                      </td>

                      {/* 4. Department */}
                      <td className="py-2.5 px-4 text-slate-600 dark:text-[#8D96A0] font-medium whitespace-nowrap">
                        {user.department}
                      </td>

                      {/* 5. Last Login */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {user.isOnlineNow ? (
                          <span className="font-mono text-[11px] text-[#3FB950] font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse"></span>
                            <span>Online now</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-[#8D96A0]">
                            {user.lastLogin}
                          </span>
                        )}
                      </td>

                      {/* 6. Account Status */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {user.status === "active" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(63,185,80,0.16)] text-[#3FB950] border border-[#3FB950]/30 text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]"></span>
                            <span>Active</span>
                          </span>
                        )}

                        {user.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(210,153,34,0.16)] text-[#D29922] border border-[#D29922]/30 text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D29922]"></span>
                            <span>Pending Verification</span>
                          </span>
                        )}

                        {user.status === "suspended" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(248,81,73,0.16)] text-[#F85149] border border-[#F85149]/30 text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F85149]"></span>
                            <span>Suspended</span>
                          </span>
                        )}
                      </td>

                      {/* 7. Action Button & Contextual Popover */}
                      <td className="py-2.5 px-5 sm:px-6 text-right whitespace-nowrap relative">
                        <button
                          data-action-trigger="true"
                          onClick={() => handleTogglePopover(user.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isPopoverOpen
                              ? "bg-slate-100 dark:bg-[#1C2128] text-brand dark:text-[#2563EB] border border-brand/40 dark:border-[#2563EB]/50"
                              : "text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                          }`}
                          title="Manage User Account"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Floating Popover Menu */}
                        {isPopoverOpen && (
                          <div
                            ref={popoverRef}
                            className="absolute right-4 sm:right-6 top-11 w-52 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl shadow-2xl p-1.5 z-50 text-left backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
                          >
                            <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0] border-b border-slate-100 dark:border-[#30363D]/70 mb-1 flex items-center justify-between">
                              <span>User Actions</span>
                              <span className="font-mono text-[9px] text-[#2563EB]">{user.id}</span>
                            </div>

                            <button
                              onClick={() => handleEditRole(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-[#F0F6FC] hover:bg-slate-50 dark:hover:bg-[#1C2128] hover:text-brand dark:hover:text-[#2563EB] text-xs transition-colors group cursor-pointer"
                            >
                              <Shield className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB] shrink-0" />
                              <span className="font-medium">Edit Role & Permissions</span>
                            </button>

                            <button
                              onClick={() => handleResetPassword(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-[#F0F6FC] hover:bg-slate-50 dark:hover:bg-[#1C2128] text-xs transition-colors group cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#F0F6FC] shrink-0" />
                              <span className="font-medium">Reset Password</span>
                            </button>

                            <button
                              onClick={() => handleImpersonate(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-700 dark:text-[#F0F6FC] hover:bg-slate-50 dark:hover:bg-[#1C2128] text-xs transition-colors group cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#F0F6FC] shrink-0" />
                              <span className="font-medium">Impersonate User</span>
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-[#30363D]/70"></div>

                            <button
                              onClick={() => handleSuspendToggle(user)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#F85149] hover:bg-[rgba(248,81,73,0.12)] text-xs transition-colors font-medium cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5 text-[#F85149] shrink-0" />
                              <span>
                                {user.status === "suspended" ? "Reactivate Account" : "Suspend Account"}
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

        {/* TABLE PAGINATION FOOTER (#161B22 bar) */}
        <div className="h-14 px-5 sm:px-6 bg-slate-50 dark:bg-[#161B22] border-t border-slate-200 dark:border-[#30363D] rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Monospace Counter */}
          <div className="text-slate-500 dark:text-[#8D96A0] font-mono">
            Showing <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">1–25</span> of{" "}
            <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">5,060</span> users
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 font-mono">
            <button
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-slate-400 dark:text-[#8D96A0] flex items-center gap-1 text-[11px] opacity-60 cursor-not-allowed"
              disabled
            >
              <span>&lt; Prev</span>
            </button>

            {/* Page 1 (Active #2563EB) */}
            <button className="w-8 h-8 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shadow-md shadow-[#2563EB]/30 cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors text-xs flex items-center justify-center cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors text-xs flex items-center justify-center cursor-pointer">
              3
            </button>
            <span className="px-1 text-slate-400 dark:text-[#8D96A0]">...</span>
            <button className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors text-xs flex items-center justify-center cursor-pointer">
              203
            </button>

            <button className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] hover:border-slate-300 dark:hover:border-[#8D96A0]/60 transition-colors flex items-center gap-1 text-[11px] cursor-pointer">
              <span>Next &gt;</span>
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM METADATA STATUS STRIP */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8D96A0] px-2 font-mono gap-2 pt-1">
        <div>
          UniCampus Identity Engine • Auth Strategy: JWT with Refresh Tokens • RBAC Node Sync Active
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]"></span>
            <span>4,912 Active</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D29922]"></span>
            <span>118 Pending</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F85149]"></span>
            <span>30 Suspended</span>
          </span>
        </div>
      </div>

      {/* MODAL 1: Invite / Add New User */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Invite & Provision User
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">Create institutional identity credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Noor or Tanvir Ahmed"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@unicampus.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Role Privilege
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Faculty</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Department
                  </label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none cursor-pointer"
                  >
                    <option value="cse">Computer Science (CSE)</option>
                    <option value="eee">Electrical Eng (EEE)</option>
                    <option value="bba">Business Admin (BBA)</option>
                    <option value="it">IT & Systems</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Student ID / Faculty Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 211-15-4499 or FAC-2090"
                  value={inviteId}
                  onChange={(e) => setInviteId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bulk Import CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Bulk Import User Accounts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">Upload batch roster via CSV or XLSX file</p>
                </div>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-300 dark:border-[#30363D] hover:border-brand dark:hover:border-[#2563EB] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-slate-50 dark:bg-[#161B22]/50 dark:hover:bg-[#161B22]">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-[#2563EB]/10 text-brand dark:text-[#2563EB] flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-[#F0F6FC]">
                  Drag and drop roster CSV here, or <span className="text-brand dark:text-[#2563EB] underline">browse</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] mt-1">
                  Supported formats: .CSV, .XLSX (Max file size: 25MB)
                </p>
              </div>

              {/* Sample Template Download */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-slate-500 dark:text-[#8D96A0]" />
                  <span className="text-slate-600 dark:text-[#8D96A0]">Need the correct header schema?</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Sample roster CSV template downloaded.")}
                  className="flex items-center gap-1.5 text-brand dark:text-[#2563EB] hover:underline font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCsvModalOpen(false);
                    triggerToast("Imported 124 students from CSE_Spring2026_Batch.csv.");
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
                >
                  Process CSV Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Role & Permissions */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Edit Role & Permissions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-mono">{editingUser.id} • {editingUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Assigned Role
                </label>
                <select
                  defaultValue={editingUser.role}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher / Faculty</option>
                  <option value="admin">Central Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Academic Department
                </label>
                <input
                  type="text"
                  defaultValue={editingUser.department}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    triggerToast(`Updated role permissions for ${editingUser.name}.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
