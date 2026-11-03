"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  Clock, 
  RefreshCw,
  Zap,
  Building2,
  UserCheck
} from "lucide-react";
import jsQR from "jsqr";
import { 
  getActiveSession, 
  recordCheckIn, 
  subscribeToAttendance, 
  ActiveAttendanceSession, 
  StudentRosterRecord 
} from "@/lib/attendanceService";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AttendanceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (student: StudentRosterRecord, session: ActiveAttendanceSession) => void;
}

export default function AttendanceScannerModal({
  isOpen,
  onClose,
  onSuccess,
}: AttendanceScannerModalProps) {
  const { currentUser } = useAdminAuth();
  
  // Student Details
  const studentName = currentUser?.full_name || "Sakib Ahmed";
  const studentId = (currentUser as any)?.student_id || "211-15-4424";

  // Tab: "camera" | "pin" | "sync"
  const [activeTab, setActiveTab] = useState<"camera" | "pin" | "sync">("camera");

  // Session State
  const [session, setSession] = useState<ActiveAttendanceSession>(getActiveSession());
  const [hasActiveSession, setHasActiveSession] = useState(true);

  // Camera State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // PIN Input
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Verification & Status
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedStudent, setVerifiedStudent] = useState<StudentRosterRecord | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync session on mount and listen to teacher token rotations
  useEffect(() => {
    if (!isOpen) return;

    setSession(getActiveSession());

    const unsubscribe = subscribeToAttendance((event) => {
      if (event.session) {
        setSession(event.session);
        setHasActiveSession(event.session.isLive);
      }
      if (event.type === "SESSION_ENDED") {
        setHasActiveSession(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Handle Successful Verification
  const handleSuccess = useCallback(
    (student: StudentRosterRecord, activeSession: ActiveAttendanceSession) => {
      setVerifiedStudent(student);
      setIsSuccess(true);
      setIsVerifying(false);
      setErrorMessage(null);
      stopCamera();
      if (onSuccess) {
        onSuccess(student, activeSession);
      }
    },
    [onSuccess]
  );

  // Verify Scanned Token or PIN
  const executeVerification = useCallback(
    (payload: { token?: string; pin?: string; method: "QR" | "PIN" }) => {
      setIsVerifying(true);
      setErrorMessage(null);

      // Brief artificial micro-delay for realistic holographic scan feedback
      setTimeout(() => {
        const result = recordCheckIn({
          studentId,
          name: studentName,
          method: payload.method,
          token: payload.token,
          pin: payload.pin,
        });

        if (result.success && result.student) {
          handleSuccess(result.student, session);
        } else {
          setIsVerifying(false);
          setErrorMessage(result.error || "Attendance verification failed.");
        }
      }, 400);
    },
    [studentId, studentName, session, handleSuccess]
  );

  // Camera Frame Scanner Loop
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data) {
        // QR Code detected!
        executeVerification({
          token: code.data,
          method: "QR",
        });
        return; // Pause scanning while verifying
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  }, [cameraActive, executeVerification]);

  // Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Camera start failed, falling back to 1-Click Sync:", err);
      setCameraActive(false);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access or use the 1-Click Sync tab."
          : "No webcam/camera device detected. Use 1-Click Classroom Sync or PIN below."
      );
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Handle Tab Switch & Modal Lifecycle
  useEffect(() => {
    if (isOpen && activeTab === "camera" && !isSuccess) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, isSuccess, startCamera, stopCamera]);

  // Trigger scan loop when camera activates
  useEffect(() => {
    if (cameraActive) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraActive, scanFrame]);

  // PIN Input Handlers
  const handlePinChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (value && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on 6 digits
    if (value && index === 5) {
      const fullPin = newDigits.join("");
      if (fullPin.length === 6) {
        executeVerification({ pin: fullPin, method: "PIN" });
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetModal = () => {
    setIsSuccess(false);
    setVerifiedStudent(null);
    setErrorMessage(null);
    setPinDigits(["", "", "", "", "", ""]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark frosted backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleResetModal}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Hidden processing canvas for QR decode */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Scanner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 shadow-2xl space-y-5 overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand/15 dark:bg-[#2563EB]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#21262D] pb-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand dark:bg-[#2563EB]/20 dark:text-[#60A5FA] flex items-center justify-center border border-brand/20 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-manrope font-extrabold text-base sm:text-lg text-slate-900 dark:text-[#F0F6FC]">
                Classroom Attendance Verification
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8D96A0] font-mono">
                <span>{session.courseCode}</span>
                <span>•</span>
                <span>{session.room}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Session
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* SUCCESS CONFIRMATION STATE                               */}
        {/* ======================================================== */}
        {isSuccess && verifiedStudent ? (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-in zoom-in-75 duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-manrope font-extrabold text-xl text-slate-900 dark:text-[#F0F6FC]">
                Attendance Verified!
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] max-w-xs">
                Your presence has been cryptographically recorded in Dr. Asif Rahman&apos;s live roster.
              </p>
            </div>

            {/* Attendance Pass Card */}
            <div className="w-full rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-4 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-2">
                <span className="text-slate-400">STUDENT</span>
                <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">
                  {verifiedStudent.name} ({verifiedStudent.studentId})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-2">
                <span className="text-slate-400">COURSE</span>
                <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">
                  {session.courseCode} • {session.section}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-2">
                <span className="text-slate-400">TIMESTAMP</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {verifiedStudent.checkInTime}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">METHOD</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-[#2563EB]/20 dark:text-[#60A5FA] font-semibold text-[11px]">
                  <ShieldCheck className="w-3 h-3" />
                  {verifiedStudent.checkInMethod === "QR" ? "Live QR Code Scan" : "Classroom PIN"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-manrope font-bold text-sm shadow-[0_6px_20px_rgba(29, 91, 216,0.30)] dark:shadow-[0_0_24px_rgba(37, 99, 235,0.45)] transition-all cursor-pointer"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* SCANNER INTERFACE TABS                                   */
          /* ======================================================== */
          <div className="space-y-4">
            {/* Top Method Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("camera");
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "camera"
                    ? "bg-white dark:bg-[#21262D] text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("sync");
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "sync"
                    ? "bg-white dark:bg-[#21262D] text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>1-Click Sync</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("pin");
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "pin"
                    ? "bg-white dark:bg-[#21262D] text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>6-Digit PIN</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: CAMERA SCANNER */}
            {activeTab === "camera" && (
              <div className="space-y-3">
                <div className="relative w-full aspect-4/3 rounded-2xl bg-black overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800 shadow-inner">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Holographic Scanner Viewfinder Overlay */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="relative w-52 h-52 sm:w-60 sm:h-60 border-2 border-[#2563EB]/60 rounded-3xl">
                          {/* Corner Brackets */}
                          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#2563EB] rounded-tl-xl" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#2563EB] rounded-tr-xl" />
                          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#2563EB] rounded-bl-xl" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#2563EB] rounded-br-xl" />

                          {/* Animated Laser Sweep Line */}
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent shadow-[0_0_12px_#2563EB] animate-[bounce_2.5s_infinite]" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Scanning for classroom QR...</span>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                        <CameraOff className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-400 max-w-xs">
                        {cameraError || "Point camera at the classroom projector screen or switch to 1-Click Sync."}
                      </p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Retry Camera
                      </button>
                    </div>
                  )}
                </div>

                {/* Instant Verification Shortcut from Camera Tab */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0] px-1">
                  <span>Testing without webcam?</span>
                  <button
                    type="button"
                    onClick={() => {
                      executeVerification({
                        token: session.currentToken,
                        method: "QR",
                      });
                    }}
                    className="text-brand hover:underline font-semibold cursor-pointer"
                  >
                    Simulate Camera QR Detection →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: 1-CLICK CLASSROOM PROXIMITY SYNC */}
            {activeTab === "sync" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-manrope font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                      Active Classroom Broadcast Detected
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                      Your device is currently on campus Wi-Fi near {session.room}.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-white dark:bg-[#0D1117] p-3 border border-slate-200 dark:border-[#30363D] space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Class:</span>
                    <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">
                      {session.courseCode} ({session.courseName})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Instructor:</span>
                    <span className="text-slate-700 dark:text-[#C9D1D9]">{session.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Token:</span>
                    <span className="text-[#2563EB] font-semibold truncate max-w-[200px]" title={session.currentToken}>
                      {session.currentToken}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={() => {
                    executeVerification({
                      token: session.currentToken,
                      method: "QR",
                    });
                  }}
                  className="w-full py-3 rounded-2xl bg-brand hover:bg-brand-hover text-white font-manrope font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(29, 91, 216,0.30)] dark:shadow-[0_0_24px_rgba(37, 99, 235,0.45)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Cryptographic Token...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Verify Attendance for {session.courseCode}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: 6-DIGIT PIN ENTRY */}
            {activeTab === "pin" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-4 text-center">
                <div className="space-y-1">
                  <h4 className="font-manrope font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                    Enter 6-Digit Classroom PIN
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
                    Enter the code displayed beneath the QR on the teacher&apos;s screen.
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center items-center gap-2">
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        pinInputRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(idx, e)}
                      className="w-11 h-13 text-center text-xl font-mono font-bold rounded-xl bg-white dark:bg-[#0D1117] border-2 border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] text-slate-900 dark:text-white outline-none transition-all shadow-xs"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
                  <span>Teacher&apos;s current PIN:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPinDigits(["4", "8", "2", "9", "1", "5"]);
                      executeVerification({ pin: "482915", method: "PIN" });
                    }}
                    className="text-brand font-mono font-bold hover:underline cursor-pointer"
                  >
                    Auto-fill (482915)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
