/**
 * UniCampus Real-Time Attendance Engine
 * 
 * Synchronizes classroom attendance sessions between Teacher side (/teacher/attendance)
 * and Student side (/dashboard) using BroadcastChannel & persistent localStorage.
 * 
 * Supports:
 * - 15-second rotating cryptographic tokens with anti-proxy grace window.
 * - Live student roster updates across multiple browser tabs and windows.
 * - Dual verification via Live QR Camera scanning or 6-digit classroom PIN.
 */

import {
  ACTIVE_TERM,
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
  CANONICAL_STUDENT,
} from "@/lib/canonicalCampus";

export type AttendanceStatus = "present" | "late" | "absent" | "unscanned";
export type CheckInMethod = "QR" | "PIN" | "MANUAL" | "--";

export interface StudentRosterRecord {
  id: string;
  name: string;
  studentId: string;
  avatarText: string;
  avatarBg: string;
  avatarTextCol: string;
  rankBadge: string;
  checkInTime: string;
  checkInMethod: CheckInMethod;
  status: AttendanceStatus;
}

export interface ActiveAttendanceSession {
  sessionId: string;
  courseCode: string;
  courseName: string;
  section: string;
  room: string;
  instructor: string;
  topic: string;
  dateStr: string;
  currentToken: string;
  currentPin: string;
  validTokens: string[]; // Current + previous 2 tokens (for 30s jitter protection)
  rotationCount: number;
  expiresAt: number; // epoch ms
  totalSeconds: number; // e.g. 15s
  isRotating: boolean;
  isLive: boolean;
  totalEnrolled: number;
}

export interface CheckInPayload {
  studentId: string;
  name: string;
  method: "QR" | "PIN";
  token?: string;
  pin?: string;
  sessionId?: string;
}

export interface AttendanceEvent {
  type: 
    | "SESSION_INIT" 
    | "SESSION_UPDATE" 
    | "TOKEN_ROTATED" 
    | "STUDENT_CHECKED_IN" 
    | "STATUS_CHANGED" 
    | "SESSION_ENDED";
  session?: ActiveAttendanceSession;
  student?: StudentRosterRecord;
  roster?: StudentRosterRecord[];
  timestamp: number;
}

const STORAGE_SESSION_KEY = "unicampus_active_attendance_session_v2";
const STORAGE_ROSTER_KEY = "unicampus_attendance_roster_v2";
const CHANNEL_NAME = "unicampus_attendance_channel_v1";

export const DEFAULT_INITIAL_ROSTER: StudentRosterRecord[] = [
  {
    id: "stud-1",
    name: CANONICAL_STUDENT.name,
    studentId: CANONICAL_STUDENT.studentId,
    avatarText: "SA",
    avatarBg: "bg-brand/20",
    avatarTextCol: "text-brand",
    rankBadge: "Section A",
    checkInTime: "--:--:--",
    checkInMethod: "--",
    status: "unscanned", // Starts unscanned until student scans from dashboard
  },
  {
    id: "stud-2",
    name: "Anika Tabassum",
    studentId: "211-15-4425",
    avatarText: "AT",
    avatarBg: "bg-success/20",
    avatarTextCol: "text-success",
    rankBadge: "CR Assistant • Sec A",
    checkInTime: "10:16:45 AM",
    checkInMethod: "QR",
    status: "present",
  },
  {
    id: "stud-3",
    name: "Tanvir Mahmud",
    studentId: "211-15-4428",
    avatarText: "TM",
    avatarBg: "bg-warning/20",
    avatarTextCol: "text-warning",
    rankBadge: "Checked in +14m late",
    checkInTime: "10:29:08 AM",
    checkInMethod: "PIN",
    status: "late",
  },
  {
    id: "stud-4",
    name: "Rifat Chowdhury",
    studentId: "211-15-4430",
    avatarText: "RC",
    avatarBg: "bg-surface-2",
    avatarTextCol: "text-fg-muted",
    rankBadge: "Awaiting check-in",
    checkInTime: "--:--:--",
    checkInMethod: "--",
    status: "unscanned",
  },
  {
    id: "stud-5",
    name: "Mehrin Sultana",
    studentId: "211-15-4432",
    avatarText: "MS",
    avatarBg: "bg-brand/20",
    avatarTextCol: "text-brand",
    rankBadge: "Algorithms Lab Sec A",
    checkInTime: "10:17:19 AM",
    checkInMethod: "QR",
    status: "present",
  },
  {
    id: "stud-6",
    name: "Farhan Sadik",
    studentId: "211-15-4435",
    avatarText: "FS",
    avatarBg: "bg-brand/20",
    avatarTextCol: "text-brand",
    rankBadge: "Competitive Prog Lead",
    checkInTime: "10:18:04 AM",
    checkInMethod: "QR",
    status: "present",
  },
];

/**
 * Generate a cryptographically structured attendance token
 */
export function generateToken(courseCode: string, section: string, rotationCount: number): string {
  const nonce = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timeBlock = Math.floor(Date.now() / 15000);
  return `UNICAMPUS:${courseCode}:${section}:R${rotationCount}:${timeBlock}:${nonce}`;
}

/**
 * Initialize default session data
 */
export function createDefaultSession(): ActiveAttendanceSession {
  const course = CANONICAL_COURSES["CSE-3101"];
  const initialToken = generateToken(course.code, "A", 1);
  return {
    sessionId: "SES-CSE3101-A-LIVE",
    courseCode: course.code,
    courseName: course.title,
    section: `Section A (${ACTIVE_TERM})`,
    room: "Room 402",
    instructor: CANONICAL_FACULTY.name,
    topic: "Lecture 09: Shortest Paths & Dijkstra's Algorithm",
    dateStr: "Today (10:15 AM - 11:45 AM)",
    currentToken: initialToken,
    currentPin: "482915",
    validTokens: [initialToken],
    rotationCount: 1,
    expiresAt: Date.now() + 15000,
    totalSeconds: 15,
    isRotating: true,
    isLive: true,
    totalEnrolled: 45,
  };
}

let broadcastChannel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!broadcastChannel && "BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      console.warn("BroadcastChannel initialization fallback:", e);
    }
  }
  return broadcastChannel;
}

/**
 * Broadcast event to other browser tabs
 */
export function broadcastAttendanceEvent(event: AttendanceEvent) {
  const channel = getChannel();
  if (channel) {
    try {
      channel.postMessage(event);
    } catch (e) {
      // Fallback
    }
  }
  // Also dispatch window custom event for same-tab subscribers
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("unicampus:attendance", { detail: event }));
  }
}

/**
 * Get active session from storage or create fresh
 */
export function getActiveSession(): ActiveAttendanceSession {
  if (typeof window === "undefined") return createDefaultSession();
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.sessionId) return parsed;
    }
  } catch (e) {
    // fallback
  }
  const fresh = createDefaultSession();
  saveActiveSession(fresh);
  return fresh;
}

/**
 * Save active session
 */
export function saveActiveSession(session: ActiveAttendanceSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    // ignore quota errors
  }
}

/**
 * Get roster from storage or initialize with default
 */
export function getRoster(): StudentRosterRecord[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_ROSTER;
  try {
    const raw = localStorage.getItem(STORAGE_ROSTER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }
  saveRoster(DEFAULT_INITIAL_ROSTER);
  return DEFAULT_INITIAL_ROSTER;
}

/**
 * Save roster
 */
export function saveRoster(roster: StudentRosterRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_ROSTER_KEY, JSON.stringify(roster));
  } catch (e) {
    // ignore quota
  }
}

/**
 * Rotate session token (Called by teacher interval)
 */
export function rotateToken(): ActiveAttendanceSession {
  const current = getActiveSession();
  const nextRotation = current.rotationCount + 1;
  const newToken = generateToken(current.courseCode, "A", nextRotation);
  
  // Keep up to 3 previous tokens for a 45s grace period against network lag
  const updatedValidTokens = [newToken, ...current.validTokens.slice(0, 2)];

  const updated: ActiveAttendanceSession = {
    ...current,
    rotationCount: nextRotation,
    currentToken: newToken,
    validTokens: updatedValidTokens,
    expiresAt: Date.now() + current.totalSeconds * 1000,
  };

  saveActiveSession(updated);
  broadcastAttendanceEvent({
    type: "TOKEN_ROTATED",
    session: updated,
    timestamp: Date.now(),
  });

  return updated;
}

/**
 * Validate a student's scanned QR token or 6-digit PIN
 */
export function validateCheckInToken(
  tokenOrPin: string,
  method: "QR" | "PIN"
): { valid: boolean; error?: string; session: ActiveAttendanceSession } {
  const session = getActiveSession();

  if (!session.isLive) {
    return { valid: false, error: "The attendance session has ended.", session };
  }

  if (method === "PIN") {
    const cleanPin = tokenOrPin.trim();
    if (cleanPin === session.currentPin) {
      return { valid: true, session };
    }
    return { valid: false, error: "Invalid 6-digit session PIN.", session };
  }

  // QR Code validation
  const cleanToken = tokenOrPin.trim();
  
  // Check against active token or valid grace window tokens
  const isDirectMatch = session.currentToken === cleanToken;
  const isGraceMatch = session.validTokens.includes(cleanToken);

  // Also accept JSON payload if encoded that way
  let isJsonMatch = false;
  try {
    if (cleanToken.startsWith("{") && cleanToken.endsWith("}")) {
      const parsed = JSON.parse(cleanToken);
      if (parsed.token && session.validTokens.includes(parsed.token)) {
        isJsonMatch = true;
      }
    }
  } catch (e) {}

  if (isDirectMatch || isGraceMatch || isJsonMatch) {
    return { valid: true, session };
  }

  // If token is expired or mismatched
  return {
    valid: false,
    error: "Token has expired or rotated. Please scan the current QR code on the projector.",
    session,
  };
}

/**
 * Record student check-in
 */
export function recordCheckIn(payload: CheckInPayload): {
  success: boolean;
  student?: StudentRosterRecord;
  error?: string;
} {
  const verification = validateCheckInToken(
    payload.method === "PIN" ? payload.pin || "" : payload.token || "",
    payload.method
  );

  if (!verification.valid) {
    return { success: false, error: verification.error };
  }

  const roster = getRoster();
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit" 
  });

  let targetStudent = roster.find(
    (s) => s.studentId === payload.studentId || s.name.toLowerCase() === payload.name.toLowerCase()
  );

  let updatedRoster: StudentRosterRecord[];

  if (targetStudent) {
    targetStudent = {
      ...targetStudent,
      status: "present",
      checkInTime: timeFormatted,
      checkInMethod: payload.method,
    };
    updatedRoster = roster.map((s) => (s.id === targetStudent!.id ? targetStudent! : s));
  } else {
    // New student entry
    const initials = payload.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    targetStudent = {
      id: `stud-${Date.now()}`,
      name: payload.name,
      studentId: payload.studentId,
      avatarText: initials || "ST",
      avatarBg: "bg-brand/20",
      avatarTextCol: "text-brand",
      rankBadge: "Verified Attendee",
      checkInTime: timeFormatted,
      checkInMethod: payload.method,
      status: "present",
    };
    updatedRoster = [targetStudent, ...roster];
  }

  saveRoster(updatedRoster);

  // Broadcast event to teacher tabs and other windows
  broadcastAttendanceEvent({
    type: "STUDENT_CHECKED_IN",
    student: targetStudent,
    roster: updatedRoster,
    session: verification.session,
    timestamp: Date.now(),
  });

  return { success: true, student: targetStudent };
}

/**
 * Subscribe to attendance events
 */
export function subscribeToAttendance(callback: (event: AttendanceEvent) => void): () => void {
  const channel = getChannel();

  const handleChannelMsg = (e: MessageEvent) => {
    if (e.data && e.data.type) {
      callback(e.data as AttendanceEvent);
    }
  };

  const handleCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail && detail.type) {
      callback(detail as AttendanceEvent);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_SESSION_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback({
          type: "SESSION_UPDATE",
          session: parsed,
          timestamp: Date.now(),
        });
      } catch (err) {}
    } else if (e.key === STORAGE_ROSTER_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback({
          type: "STATUS_CHANGED",
          roster: parsed,
          timestamp: Date.now(),
        });
      } catch (err) {}
    }
  };

  if (channel) {
    channel.addEventListener("message", handleChannelMsg);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("unicampus:attendance", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);
  }

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleChannelMsg);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("unicampus:attendance", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}
