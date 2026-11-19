"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  QrCode, 
  BookOpen, 
  Users, 
  Calendar, 
  Edit3, 
  PauseCircle, 
  PlayCircle, 
  Copy, 
  Check, 
  Search, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CloudCheck, 
  UserX, 
  Clock3, 
  ShieldCheck, 
  RefreshCw,
  ChevronDown,
  Sparkles,
  GraduationCap
} from "lucide-react";
import QRCode from "qrcode";
import {
  getActiveSession,
  rotateToken,
  subscribeToAttendance,
  getRoster,
  saveRoster,
  broadcastAttendanceEvent,
  StudentRosterRecord,
  AttendanceStatus as AttendanceState,
  ActiveAttendanceSession
} from "@/lib/attendanceService";

export default function TeacherAttendancePage() {
  const [session, setSession] = useState<ActiveAttendanceSession>(getActiveSession());
  const [roster, setRoster] = useState<StudentRosterRecord[]>(getRoster());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "checked_in" | "absent">("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Timer & QR Rotation
  const [countdown, setCountdown] = useState(15);
  const [isRotating, setIsRotating] = useState(true);
  const [copiedPin, setCopiedPin] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [recentCheckIn, setRecentCheckIn] = useState<StudentRosterRecord | null>(null);

  // Session Configurations
  const selectedCourse = "CSE-3101";
  const selectedSection = "Section A (Spring 2026)";
  const sessionDate = "Today, Oct 22, 2026 (10:00 AM)";
  const sessionTopic = "Lecture 09: Shortest Paths & Dijkstra's Algorithm";

  // Status & Save State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastAutoSaveSeconds, setLastAutoSaveSeconds] = useState(4);

  // Generate dynamic QR code data URL whenever session token changes
  useEffect(() => {
    if (!session.currentToken) return;

    QRCode.toDataURL(session.currentToken, {
      width: 360,
      margin: 1,
      color: {
        dark: "#0D1117",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR data URL:", err);
      });
  }, [session.currentToken]);

  // Dynamic QR Refresh Timer - rotates token every 15s
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const updated = rotateToken();
          setSession(updated);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRotating]);

  // Subscribe to real-time student check-in events
  useEffect(() => {
    // Sync initial state from shared storage
    queueMicrotask(() => {
      setRoster(getRoster());
      setSession(getActiveSession());
    });

    const unsubscribe = subscribeToAttendance((event) => {
      if (event.type === "STUDENT_CHECKED_IN" && event.student) {
        setRecentCheckIn(event.student);
        setRoster(getRoster());
        if (event.session) {
          setSession(event.session);
        }
        // Auto-dismiss celebration pill after 5s
        setTimeout(() => {
          setRecentCheckIn((curr) => (curr?.id === event.student?.id ? null : curr));
        }, 5000);
      } else if (event.type === "STATUS_CHANGED" && event.roster) {
        setRoster(event.roster);
      } else if (event.type === "SESSION_UPDATE" && event.session) {
        setSession(event.session);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Autosave ticker simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setLastAutoSaveSeconds((s) => (s >= 30 ? 2 : s + 2));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Roster
  const filteredRoster = roster.filter((student) => {
    if (filterTab === "checked_in" && student.status !== "present" && student.status !== "late") return false;
    if (filterTab === "absent" && student.status !== "absent") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inName = student.name.toLowerCase().includes(q);
      const inId = student.studentId.includes(q);
      return inName || inId;
    }

    return true;
  });

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filteredRoster.length / pageSize));
  const paginatedRoster = filteredRoster.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Dynamic Metrics
  const totalEnrolled = session.totalEnrolled || 45;
  const presentCount = roster.filter((s) => s.status === "present").length + 35; // base cohort + active
  const lateCount = roster.filter((s) => s.status === "late").length + 1;
  const checkedInCount = presentCount + lateCount;
  const explicitlyAbsentCount = roster.filter((s) => s.status === "absent").length;
  const absentCount = saveSuccess
    ? Math.max(0, totalEnrolled - checkedInCount)
    : explicitlyAbsentCount;
  const attendancePercentage = ((checkedInCount / totalEnrolled) * 100).toFixed(1);

  // Status Toggle
  const handleSetStatus = useCallback((id: string, newStatus: AttendanceState) => {
    const updated = roster.map((student) => {
      if (student.id !== id) return student;
      let newCheckInTime = student.checkInTime;
      let newMethod = student.checkInMethod;

      if (newStatus === "absent") {
        newCheckInTime = "--:--:--";
        newMethod = "--";
      } else if (student.checkInTime === "--:--:--") {
        const now = new Date();
        newCheckInTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        newMethod = "MANUAL";
      }

      return {
        ...student,
        status: newStatus,
        checkInTime: newCheckInTime,
        checkInMethod: newMethod,
      };
    });

    setRoster(updated);
    saveRoster(updated);
    broadcastAttendanceEvent({
      type: "STATUS_CHANGED",
      roster: updated,
      timestamp: Date.now(),
    });
  }, [roster]);

  const handleMarkAllAbsent = useCallback(() => {
    const updated = roster.map((student) => {
      if (student.status === "absent") return student;
      return {
        ...student,
        status: "absent" as AttendanceState,
        checkInTime: "--:--:--",
        checkInMethod: "--" as const,
      };
    });
    setRoster(updated);
    saveRoster(updated);
    broadcastAttendanceEvent({
      type: "STATUS_CHANGED",
      roster: updated,
      timestamp: Date.now(),
    });
  }, [roster]);

  const handleCopyPin = () => {
    navigator.clipboard.writeText(session.currentPin || "482915");
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleManualRotate = () => {
    const updated = rotateToken();
    setSession(updated);
    setCountdown(15);
  };

  const handleExportExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Student Name,Student ID,Course,Section,Check-in Time,Method,Status"]
        .concat(
          roster.map(
            (s) =>
              `"${s.name}","${s.studentId}","CSE-3101","Section A","${s.checkInTime}","${s.checkInMethod}","${s.status.toUpperCase()}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CSE-3101_Attendance_Oct_22_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveFinalize = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Circular timer calculation (circumference for r=100 is ~628.3)
  const circleRadius = 100;
  const circumference = 2 * Math.PI * circleRadius; // ~628.32
  const strokeOffset = circumference - (countdown / 15) * circumference;

  return (
    <div className="w-full space-y-6 pb-28">
      {/* ========================================================================= */}
      {/* 1. TOP SESSION CONFIGURATION BAR                                          */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-surface rounded-2xl p-4 border border-slate-200 dark:border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        {/* 4 Interactive Selector Dropdowns/Inputs */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          {/* Course Selector */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line hover:border-brand/60 transition-colors cursor-pointer group shadow-xs">
            <BookOpen className="w-4 h-4 text-brand" />
            <div className="text-left">
              <div className="text-xs font-mono font-bold text-slate-400 dark:text-fg-muted leading-none">
                Course
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-fg flex items-center gap-1.5 mt-0.5">
                <span>{selectedCourse}</span>
                <span className="text-slate-400">•</span>
                <span className="font-medium text-slate-600 dark:text-fg">
                  Design &amp; Analysis of Algorithms
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-fg" />
              </div>
            </div>
          </div>

          {/* Section Selector */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line hover:border-brand/60 transition-colors cursor-pointer group shadow-xs">
            <Users className="w-4 h-4 text-brand" />
            <div className="text-left">
              <div className="text-xs font-mono font-bold text-slate-400 dark:text-fg-muted leading-none">
                Section &amp; Term
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-fg flex items-center gap-1.5 mt-0.5">
                <span>{selectedSection}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-fg" />
              </div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line hover:border-brand/60 transition-colors cursor-pointer group shadow-xs">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <div className="text-left">
              <div className="text-xs font-mono font-bold text-slate-400 dark:text-fg-muted leading-none">
                Date &amp; Slot
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-fg flex items-center gap-1.5 mt-0.5">
                <span>{sessionDate}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-fg" />
              </div>
            </div>
          </div>

          {/* Lecture Topic */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line hover:border-brand/60 transition-colors cursor-pointer group min-w-[260px] shadow-xs">
            <Edit3 className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <div className="text-xs font-mono font-bold text-slate-400 dark:text-fg-muted leading-none">
                Lecture Topic
              </div>
              <div className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-fg truncate max-w-[220px] mt-0.5" title={sessionTopic}>
                {sessionTopic}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pause / Resume Button */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-surface-2 hover:bg-slate-200 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-slate-900 dark:text-fg font-semibold text-xs sm:text-[13px] flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer shadow-xs whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          {isRotating ? (
            <>
              <PauseCircle className="w-4 h-4 text-amber-500" />
              <span>Pause QR Rotation</span>
            </>
          ) : (
            <>
              <PlayCircle className="w-4 h-4 text-emerald-500" />
              <span>Resume QR Rotation</span>
            </>
          )}
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT WORKSPACE (40% QR HUB / 60% LIVE ROSTER TABLE)              */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SECTION (40%): LIVE QR CHECK-IN HUB ================= */}
        <div className="lg:col-span-5 bg-white dark:bg-surface rounded-3xl p-5 border border-brand shadow-[0_0_28px_-4px_rgba(37, 99, 235,0.22)] flex flex-col items-center text-center relative overflow-hidden">
          {/* Ambient Corner Spotlights */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand/10 blur-3xl pointer-events-none"></div>

          {/* Header Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-mono font-bold text-brand mb-2.5">
            <QrCode className="w-3.5 h-3.5 text-brand" />
            <span>Classroom Check-In QR</span>
          </div>

          <h2 className="font-extrabold text-base sm:text-lg text-fg tracking-tight mb-0.5">
            Live Attendance Check-In
          </h2>
          <p className="text-xs text-fg-muted mb-3.5 max-w-xs font-normal">
            Dynamic QR code rotates every 15s for secure classroom check-in.
          </p>

          {/* CENTERPIECE: DYNAMIC QR CODE WITH CIRCULAR PROGRESS RING */}
          <div className="relative w-[220px] h-[220px] flex items-center justify-center mb-4">
            {/* Circular Progress Ring (SVG) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-line"
              />
              <circle
                cx="110"
                cy="110"
                r={circleRadius}
                stroke="url(#indigoGrad)"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={isRotating ? strokeOffset : 0}
                strokeLinecap="round"
                fill="transparent"
                className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-brand, #605BFF)" />
                  <stop offset="100%" stopColor="var(--color-brand, #7C78FF)" />
                </linearGradient>
              </defs>
            </svg>

            {/* High-Contrast White-on-Dark QR Code Canvas Frame */}
            {/* High-Contrast Dynamic QR Code Frame */}
            <div className="w-[176px] h-[176px] rounded-2xl bg-white p-2.5 flex flex-col items-center justify-center shadow-2xl relative z-10 border-4 border-slate-900 dark:border-surface-2 overflow-hidden">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Dynamic Live Attendance QR"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand" />
                  <span className="text-xs font-mono">Generating QR...</span>
                </div>
              )}

              {/* Center UniCampus Academic Squircle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-lg bg-brand border-2 border-white shadow-md flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="absolute bottom-1 bg-white/95 dark:bg-surface/95 px-2 py-0.5 rounded text-xs font-mono font-bold text-brand dark:text-brand border border-slate-200 dark:border-line shadow-xs">
                {session.courseCode}-R{session.rotationCount}
              </div>
            </div>

            {/* Countdown Badge on Bottom of Ring */}
            <button
              type="button"
              onClick={handleManualRotate}
              title="Click to force rotate QR code"
              className="absolute -bottom-2 bg-slate-50 dark:bg-surface-2 border border-brand/60 px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1.5 z-20 cursor-pointer hover:border-brand transition-colors"
            >
              <RefreshCw className={`w-3 h-3 text-brand ${isRotating ? "animate-spin" : ""}`} />
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-fg">
                {isRotating ? (
                  <>
                    Refreshes in <span className="text-brand">{countdown}s</span>
                  </>
                ) : (
                  <span className="text-amber-500 font-bold">Rotation Paused</span>
                )}
              </span>
            </button>
          </div>

          {/* BACKUP SESSION PIN BOX */}
          <div className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line rounded-2xl p-3 mb-3.5 flex items-center justify-between shadow-xs">
            <div className="text-left">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-fg-muted block">
                6-DIGIT BACKUP PIN
              </span>
              <span className="text-xs text-slate-400 dark:text-fg-muted">
                For students with camera glare
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-fg tracking-[0.18em] bg-white dark:bg-surface px-3 py-1 rounded-xl border border-slate-200 dark:border-line shadow-inner select-all whitespace-nowrap">
                {session.currentPin.slice(0, 3)} - {session.currentPin.slice(3, 6)}
              </div>
              <button
                onClick={handleCopyPin}
                title="Copy Backup PIN"
                className="p-1.5 rounded-xl bg-white dark:bg-surface hover:bg-slate-100 dark:hover:bg-line/40 text-slate-500 dark:text-fg-muted hover:text-brand border border-slate-200 dark:border-line transition-colors cursor-pointer shadow-xs"
              >
                {copiedPin ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* LIVE CHECK-IN PROGRESS METER */}
          <div className="w-full bg-slate-50/70 dark:bg-surface-2/70 border border-slate-200 dark:border-line rounded-2xl p-3.5 text-left shadow-xs">
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-fg">
                {checkedInCount} <span className="text-xs sm:text-xs font-medium text-slate-500 dark:text-fg-muted">of {totalEnrolled} Students Checked In</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                {attendancePercentage}%
              </div>
            </div>

            {/* Horizontal Emerald/Indigo Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 dark:bg-surface rounded-full overflow-hidden flex p-0.5 border border-slate-300 dark:border-line/80 mb-2.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-[width] duration-300"
                style={{ width: `${(presentCount / totalEnrolled) * 100}%` }}
              ></div>
              <div
                className="h-full bg-amber-500 rounded-full ml-0.5 transition-[width] duration-300"
                style={{ width: `${(lateCount / totalEnrolled) * 100}%` }}
              ></div>
            </div>

            {/* Sub-pills: Present, Late, Remaining */}
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-xl px-2 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-xs text-slate-500 dark:text-fg-muted font-medium truncate">Present:</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-fg ml-auto">
                  {presentCount}
                </span>
              </div>
              <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-xl px-2 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-xs text-slate-500 dark:text-fg-muted font-medium truncate">Late:</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-fg ml-auto">
                  {lateCount}
                </span>
              </div>
              <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-xl px-2 py-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span className="text-xs text-slate-500 dark:text-fg-muted font-medium truncate">Remaining:</span>
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-fg ml-auto">
                  {absentCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION (60%): LIVE STUDENT ATTENDANCE ROSTER ================= */}
        <div className="lg:col-span-7 bg-white dark:bg-surface rounded-3xl p-6 border border-slate-200 dark:border-line shadow-xl flex flex-col justify-between">
          <div>
            {/* Section Heading & Real-time Live Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-line">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-fg tracking-tight">
                    Live Student Attendance Roster
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand/15 text-brand dark:text-brand border border-brand/30">
                    {totalEnrolled} Enrolled
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-fg-muted mt-0.5 font-normal">
                  Live attendance stream active • Room 402
                </p>
              </div>

              {/* Batch Action Link */}
              <button
                onClick={handleMarkAllAbsent}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-surface-2 hover:bg-rose-500/10 border border-slate-200 dark:border-line hover:border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Mark All Remaining Absent</span>
              </button>
            </div>

            {/* LIVE CHECK-IN REALTIME CELEBRATION BANNER */}
            {recentCheckIn && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-[13.5px] text-slate-900 dark:text-fg">
                      🎉 {recentCheckIn.name} checked in just now!
                    </div>
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      ID: {recentCheckIn.studentId} • Recorded at {recentCheckIn.checkInTime} via {recentCheckIn.checkInMethod === "QR" ? "Live QR Code" : "Classroom PIN"}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold font-mono shrink-0">
                  Live Synced
                </span>
              </div>
            )}

            {/* Roster Toolbar: Search input & filter counters */}
            <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-fg-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter student name or ID..."
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs sm:text-[13px] rounded-xl pl-10 pr-4 py-2 text-slate-900 dark:text-fg placeholder:text-slate-400 dark:placeholder:text-fg-muted focus:outline-none focus:border-brand transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-surface-2 p-1 rounded-xl border border-slate-200 dark:border-line text-xs self-end sm:self-auto">
                <button
                  onClick={() => { setFilterTab("all"); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    filterTab === "all"
                      ? "bg-white dark:bg-surface text-slate-900 dark:text-fg shadow-xs border border-slate-200 dark:border-line"
                      : "text-slate-500 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg"
                  }`}
                >
                  All ({totalEnrolled})
                </button>
                <button
                  onClick={() => { setFilterTab("checked_in"); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    filterTab === "checked_in"
                      ? "bg-white dark:bg-surface text-slate-900 dark:text-fg shadow-xs border border-slate-200 dark:border-line"
                      : "text-slate-500 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg"
                  }`}
                >
                  Checked In ({checkedInCount})
                </button>
                <button
                  onClick={() => { setFilterTab("absent"); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    filterTab === "absent"
                      ? "bg-white dark:bg-surface text-slate-900 dark:text-fg shadow-xs border border-slate-200 dark:border-line"
                      : "text-slate-500 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg"
                  }`}
                >
                  Absent ({absentCount})
                </button>
              </div>
            </div>

            {/* Real-Time Roster Table */}
            <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-line bg-white dark:bg-surface shadow-xs">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-surface-2 border-b border-slate-200 dark:border-line text-xs font-mono font-bold text-slate-400 dark:text-fg-muted">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3">Student ID</th>
                    <th className="py-3 px-3">Check-in Time</th>
                    <th className="py-3 px-4 text-center">Manual Status Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-line/60 text-xs sm:text-[13px]">
                  {paginatedRoster.map((student) => {
                    const isPresent = student.status === "present";
                    const isLate = student.status === "late";
                    const isAbsent = student.status === "absent";

                    return (
                      <tr
                        key={student.id}
                        className={`h-[54px] transition-colors ${
                          isLate
                            ? "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]"
                            : isAbsent
                            ? "bg-rose-500/[0.04] hover:bg-rose-500/[0.08]"
                            : "hover:bg-slate-50 dark:hover:bg-surface-2/50"
                        }`}
                      >
                        {/* Student Avatar + Name */}
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${student.avatarBg} ${student.avatarTextCol} border border-slate-200 dark:border-line font-bold text-xs flex items-center justify-center shrink-0`}
                            >
                              {student.avatarText}
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-[13.5px] text-slate-900 dark:text-fg leading-none">
                                {student.name}
                              </div>
                              <div className="text-xs text-slate-400 dark:text-fg-muted mt-1 font-normal">
                                {student.rankBadge}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Student ID */}
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-500 dark:text-fg-muted whitespace-nowrap">
                          {student.studentId}
                        </td>

                        {/* Check-in Time */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div
                            className={`font-mono font-medium flex items-center gap-1.5 ${
                              isPresent
                                ? "text-emerald-600 dark:text-success"
                                : isLate
                                ? "text-amber-600 dark:text-warning"
                                : "text-slate-400 dark:text-fg-muted"
                            }`}
                          >
                            {isPresent && <QrCode className="w-3.5 h-3.5 text-emerald-500" />}
                            {isLate && <Clock3 className="w-3.5 h-3.5 text-amber-500" />}
                            {isAbsent && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                            <span>
                              {student.checkInTime}
                              {student.checkInMethod !== "--" && ` (${student.checkInMethod})`}
                            </span>
                          </div>
                        </td>

                        {/* Manual Status Toggle */}
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <div className="flex items-center justify-center bg-slate-100 dark:bg-surface-2 p-1 rounded-xl border border-slate-200 dark:border-line gap-1 max-w-[220px] mx-auto">
                            {/* Present Button */}
                            <button
                              onClick={() => handleSetStatus(student.id, "present")}
                              className={`flex-1 py-1 px-2.5 rounded-lg font-bold text-xs tracking-wide flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isPresent
                                  ? "bg-emerald-500 text-white shadow-xs"
                                  : "text-slate-500 dark:text-fg-muted hover:text-emerald-600 dark:hover:text-emerald-400"
                              }`}
                            >
                              {isPresent && <Check className="w-3 h-3" />}
                              Present
                            </button>

                            {/* Late Button */}
                            <button
                              onClick={() => handleSetStatus(student.id, "late")}
                              className={`flex-1 py-1 px-2.5 rounded-lg font-bold text-xs tracking-wide flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isLate
                                  ? "bg-amber-500 text-slate-900 dark:text-surface shadow-xs"
                                  : "text-slate-500 dark:text-fg-muted hover:text-amber-600 dark:hover:text-amber-400"
                              }`}
                            >
                              {isLate && <Clock3 className="w-3 h-3" />}
                              Late
                            </button>

                            {/* Absent Button */}
                            <button
                              onClick={() => handleSetStatus(student.id, "absent")}
                              className={`flex-1 py-1 px-2.5 rounded-lg font-bold text-xs tracking-wide flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isAbsent
                                  ? "bg-rose-500 text-white shadow-xs"
                                  : "text-slate-500 dark:text-fg-muted hover:text-rose-600 dark:hover:text-rose-400"
                              }`}
                            >
                              {isAbsent && <XCircle className="w-3 h-3" />}
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Table Footer Pagination */}
              <div className="p-3 bg-slate-50 dark:bg-surface-2/60 border-t border-slate-200 dark:border-line flex items-center justify-between text-xs text-slate-500 dark:text-fg-muted">
                <span>
                  Showing {filteredRoster.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRoster.length)} of {filteredRoster.length} students
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-surface border border-slate-200 dark:border-line text-slate-700 dark:text-fg hover:bg-slate-50 dark:hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="font-mono text-slate-900 dark:text-fg font-medium">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-surface border border-slate-200 dark:border-line text-slate-700 dark:text-fg hover:bg-slate-50 dark:hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STICKY BOTTOM ACTION BAR                                               */}
      {/* ========================================================================= */}
      <footer className="mt-6 w-full relative lg:sticky lg:bottom-4 z-20 bg-white/95 dark:bg-surface/95 backdrop-blur-xl border border-slate-200 dark:border-line rounded-[20px] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        {/* Left Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs sm:text-[12.5px] text-slate-500 dark:text-fg-muted">
            <CloudCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Auto-saved <strong className="text-slate-900 dark:text-fg font-mono">{lastAutoSaveSeconds} seconds ago</strong>
            </span>
          </div>
          <span className="text-slate-300 dark:text-line hidden sm:inline">•</span>
          <div className="flex items-center gap-2 text-xs sm:text-[12.5px] font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{presentCount} Present</span>
            <span className="text-slate-300 dark:text-line">|</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{lateCount} Late</span>
            <span className="text-slate-300 dark:text-line">|</span>
            <span className="text-slate-500 dark:text-fg-muted font-bold">{saveSuccess ? `${absentCount} Absent` : `${absentCount} Remaining`}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Secondary Button: Export Excel Sheet */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-surface-2 hover:bg-slate-200 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-slate-900 dark:text-fg font-semibold text-xs sm:text-[13px] flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500 dark:text-fg-muted" />
            <span>Export Excel Sheet</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={handleSaveFinalize}
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs sm:text-[13px] flex items-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Session Finalized &amp; Synced!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save &amp; Finalize Attendance</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
