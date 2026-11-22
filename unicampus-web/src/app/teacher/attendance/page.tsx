"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  ActiveAttendanceSession,
} from "@/lib/attendanceService";
import {
  SessionConfigBar,
  AttendanceQrHub,
  AttendanceRosterPanel,
  AttendanceStickyFooter,
} from "@/components/teacher/attendance";

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
  const courseName = "Design & Analysis of Algorithms";
  const selectedSection = "Section A (3rd Year • 6th Semester)";
  const sessionDate = "Today, Oct 22, 2026 (10:00 AM)";
  const sessionTopic = "Lecture 09: Shortest Paths & Dijkstra's Algorithm";

  // Status & Save State
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastAutoSaveSeconds, setLastAutoSaveSeconds] = useState(4);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  // Track theme changes for dynamic QR color contrast
  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setThemeMode(darkNow ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Generate dynamic QR code data URL whenever session token or theme changes
  useEffect(() => {
    if (!session.currentToken) return;

    let darkColor = "#14141B";
    let lightColor = "#FFFFFF";
    if (typeof window !== "undefined") {
      const computed = window.getComputedStyle(document.documentElement);
      const fg = computed.getPropertyValue("--fg").trim();
      const surface = computed.getPropertyValue("--surface").trim();
      if (fg) darkColor = fg;
      if (surface) lightColor = surface;
    }

    QRCode.toDataURL(session.currentToken, {
      width: 360,
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR data URL:", err);
      });
  }, [session.currentToken, themeMode]);

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

  // Manual QR rotate action
  const handleManualRotate = useCallback(() => {
    const updated = rotateToken();
    setSession(updated);
    setCountdown(15);
  }, []);

  // Copy PIN action
  const handleCopyPin = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(session.currentPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  }, [session.currentPin]);

  // Toggle rotation
  const handleToggleRotate = useCallback(() => {
    setIsRotating((prev) => !prev);
  }, []);

  // Update student status manually
  const handleSetStatus = useCallback(
    (studentId: string, status: AttendanceState) => {
      const nowStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const updated = roster.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            status,
            checkInTime: status === "absent" ? "--:--:--" : s.checkInTime === "--:--:--" ? nowStr : s.checkInTime,
            checkInMethod: status === "absent" ? ("--" as const) : s.checkInMethod === "--" ? ("MANUAL" as const) : s.checkInMethod,
          };
        }
        return s;
      });

      setRoster(updated);
      saveRoster(updated);
      const student = updated.find((s) => s.id === studentId);
      if (student) {
        broadcastAttendanceEvent({
          type: "STATUS_CHANGED",
          student,
          roster: updated,
          timestamp: Date.now(),
        });
      }
    },
    [roster]
  );

  // Mark all remaining unscanned students absent
  const handleMarkAllAbsent = useCallback(() => {
    const updated = roster.map((s) => {
      if (s.status !== "present" && s.status !== "late") {
        return {
          ...s,
          status: "absent" as const,
          checkInTime: "--:--:--",
          checkInMethod: "--" as const,
        };
      }
      return s;
    });
    setRoster(updated);
    saveRoster(updated);
    broadcastAttendanceEvent({
      type: "STATUS_CHANGED",
      roster: updated,
      timestamp: Date.now(),
    });
  }, [roster]);

  // Export CSV
  const handleExportExcel = useCallback(() => {
    const headers = ["Student ID", "Name", "Status", "Check-in Time", "Method", "Course", "Date"];
    const rows = roster.map((s) => [
      s.studentId,
      s.name,
      s.status.toUpperCase(),
      s.checkInTime,
      s.checkInMethod,
      selectedCourse,
      sessionDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedCourse}_Attendance_Oct_22_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [roster, selectedCourse, sessionDate]);

  // Finalize attendance session
  const handleSaveFinalize = useCallback(() => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, []);

  // Filtered Roster
  const filteredRoster = useMemo(() => {
    return roster.filter((student) => {
      if (filterTab === "checked_in" && student.status !== "present" && student.status !== "late") {
        return false;
      }
      if (filterTab === "absent" && student.status !== "absent") {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = student.name.toLowerCase().includes(q);
        const inId = student.studentId.toLowerCase().includes(q);
        return inName || inId;
      }

      return true;
    });
  }, [roster, filterTab, searchQuery]);

  // Stats
  const totalEnrolled = session.totalEnrolled || 45;
  const presentCount = useMemo(
    () => roster.filter((s) => s.status === "present").length + 35,
    [roster]
  );
  const lateCount = useMemo(
    () => roster.filter((s) => s.status === "late").length + 1,
    [roster]
  );
  const checkedInCount = useMemo(
    () => presentCount + lateCount,
    [presentCount, lateCount]
  );
  const explicitlyAbsentCount = useMemo(
    () => roster.filter((s) => s.status === "absent").length,
    [roster]
  );
  const remainingCount = Math.max(0, totalEnrolled - checkedInCount);
  const absentCount = saveSuccess ? remainingCount : explicitlyAbsentCount;

  // Pagination
  const pageSize = 4;
  const totalPages = Math.ceil(filteredRoster.length / pageSize) || 1;
  const paginatedRoster = useMemo(
    () => filteredRoster.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredRoster, currentPage, pageSize]
  );

  return (
    <div className="w-full space-y-6 pb-24 sm:pb-20">
      {/* 1. TOP SESSION CONFIGURATION BAR */}
      <SessionConfigBar
        selectedCourse={selectedCourse}
        courseName={courseName}
        selectedSection={selectedSection}
        sessionDate={sessionDate}
        sessionTopic={sessionTopic}
        isRotating={isRotating}
        onToggleRotate={handleToggleRotate}
      />

      {/* 2. MAIN SPLIT WORKSPACE (QR HUB / LIVE ROSTER TABLE) - BALANCED HEIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:items-stretch">
        {/* LEFT SECTION: LIVE QR CHECK-IN HUB */}
        <div className="lg:col-span-5 flex flex-col">
          <AttendanceQrHub
            session={session}
            countdown={countdown}
            isRotating={isRotating}
            qrDataUrl={qrDataUrl}
            copiedPin={copiedPin}
            onCopyPin={handleCopyPin}
            onManualRotate={handleManualRotate}
            checkedInCount={checkedInCount}
            totalEnrolled={totalEnrolled}
            presentCount={presentCount}
            lateCount={lateCount}
            remainingCount={remainingCount}
          />
        </div>

        {/* RIGHT SECTION: LIVE STUDENT ATTENDANCE ROSTER */}
        <div className="lg:col-span-7 flex flex-col">
          <AttendanceRosterPanel
            totalEnrolled={totalEnrolled}
            checkedInCount={checkedInCount}
            absentCount={explicitlyAbsentCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterTab={filterTab}
            onFilterTabChange={setFilterTab}
            onMarkAllAbsent={handleMarkAllAbsent}
            recentCheckIn={recentCheckIn}
            paginatedRoster={paginatedRoster}
            onSetStatus={handleSetStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            filteredRosterLength={filteredRoster.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* 3. STICKY BOTTOM ACTION BAR */}
      <AttendanceStickyFooter
        lastAutoSaveSeconds={lastAutoSaveSeconds}
        presentCount={presentCount}
        lateCount={lateCount}
        remainingCount={remainingCount}
        absentCount={absentCount}
        saveSuccess={saveSuccess}
        onExportExcel={handleExportExcel}
        onSaveFinalize={handleSaveFinalize}
      />
    </div>
  );
}
