"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  RefreshCw,
  Zap,
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
import { CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

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
  
  const studentName = currentUser?.full_name || CANONICAL_STUDENT.name;
  const studentId =
    (currentUser as unknown as { student_id?: string })?.student_id ||
    CANONICAL_STUDENT.studentId;

  const [activeTab, setActiveTab] = useState<"camera" | "pin" | "sync">("camera");
  const [session, setSession] = useState<ActiveAttendanceSession>(getActiveSession());

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

  useEffect(() => {
    if (!isOpen) return;

    setSession(getActiveSession());

    const unsubscribe = subscribeToAttendance((event) => {
      if (event.session) {
        setSession(event.session);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

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
    [onSuccess, stopCamera]
  );

  const executeVerification = useCallback(
    (payload: { token?: string; pin?: string; method: "QR" | "PIN" }) => {
      setIsVerifying(true);
      setErrorMessage(null);

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
      }, 300);
    },
    [studentId, studentName, session, handleSuccess]
  );

  // Self-contained camera frame scanning loop
  useEffect(() => {
    let animId: number | null = null;

    const runScan = () => {
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
          executeVerification({ token: code.data, method: "QR" });
          return;
        }
      }

      animId = requestAnimationFrame(runScan);
    };

    if (cameraActive) {
      animId = requestAnimationFrame(runScan);
    }

    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [cameraActive, executeVerification]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("WebRTC not supported on this browser");
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
    } catch (err: unknown) {
      console.warn("Camera start fallback:", err);
      setCameraActive(false);
      setCameraError(
        (err as { name?: string }).name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access or use the 1-Click Sync tab."
          : "No camera device detected. Use 1-Click Classroom Sync or PIN below."
      );
    }
  }, []);

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


  const handlePinChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...pinDigits];
    newDigits[index] = value;
    setPinDigits(newDigits);
    setErrorMessage(null);

    if (value && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }

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

  return (
    <Modal
      open={isOpen}
      onClose={handleResetModal}
      title="Classroom Attendance"
      description={`${session.courseCode} · ${session.room} · Live Session`}
      size="md"
    >
      {/* Hidden processing canvas for QR decode */}
      <canvas ref={canvasRef} className="hidden" />

      {isSuccess && verifiedStudent ? (
        <div className="py-4 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-fg">
              Attendance Verified
            </h3>
            <p className="text-xs text-fg-muted max-w-xs">
              Your presence has been recorded for today&apos;s session.
            </p>
          </div>

          {/* Pass Card */}
          <div className="w-full rounded-2xl bg-canvas border border-line p-4 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
              <span className="text-fg-muted font-medium shrink-0">Student</span>
              <span className="font-semibold text-fg text-right">
                {verifiedStudent.name} ({verifiedStudent.studentId})
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
              <span className="text-fg-muted font-medium shrink-0">Course</span>
              <span className="font-semibold text-fg text-right">
                {session.courseCode} · {session.section}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
              <span className="text-fg-muted font-medium shrink-0">Recorded At</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right">
                {verifiedStudent.checkInTime}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-fg-muted font-medium shrink-0">Method</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand/10 text-brand font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                {verifiedStudent.checkInMethod === "QR" ? "QR Scan" : "Classroom PIN"}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleResetModal}
          >
            Done &amp; Return to Dashboard
          </Button>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-canvas border border-line">
            <button
              type="button"
              onClick={() => {
                setActiveTab("camera");
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "camera"
                  ? "bg-surface text-fg font-semibold shadow-xs"
                  : "text-fg-muted hover:text-fg"
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
              className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "sync"
                  ? "bg-surface text-fg font-semibold shadow-xs"
                  : "text-fg-muted hover:text-fg"
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
              className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "pin"
                  ? "bg-surface text-fg font-semibold shadow-xs"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-brand" />
              <span>6-Digit PIN</span>
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "camera" && (
            <div className="space-y-3">
              <div className="relative w-full aspect-4/3 rounded-2xl bg-black overflow-hidden flex flex-col items-center justify-center border border-line">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative w-48 h-48 border-2 border-brand/70 rounded-2xl">
                        <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-brand rounded-tl" />
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-brand rounded-tr" />
                        <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-brand rounded-bl" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-brand rounded-br" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-fg text-xs font-medium flex items-center gap-1.5 border border-line">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Scanning for classroom QR...</span>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 text-fg-muted mx-auto flex items-center justify-center">
                      <CameraOff className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-fg-muted max-w-xs">
                      {cameraError || "Point camera at classroom screen or use 1-Click Sync."}
                    </p>
                    <Button variant="secondary" size="sm" onClick={startCamera}>
                      Retry Camera
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-fg-muted px-1">
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
                  Simulate QR Scan →
                </button>
              </div>
            </div>
          )}

          {activeTab === "sync" && (
            <div className="p-4 rounded-2xl bg-canvas border border-line space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-fg">
                    Active Classroom Broadcast
                  </h4>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Connected to campus network near {session.room}.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-surface p-3 border border-line space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-fg-muted shrink-0">Course:</span>
                  <span className="font-semibold text-fg text-right">
                    {session.courseCode} · {session.courseName}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-fg-muted shrink-0">Instructor:</span>
                  <span className="text-fg text-right">{session.instructor}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                disabled={isVerifying}
                onClick={() => {
                  executeVerification({
                    token: session.currentToken,
                    method: "QR",
                  });
                }}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Confirm Attendance for {session.courseCode}</span>
                  </>
                )}
              </Button>
            </div>
          )}

          {activeTab === "pin" && (
            <div className="p-4 rounded-2xl bg-canvas border border-line space-y-4 text-center">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-fg">
                  Enter 6-Digit Classroom PIN
                </h4>
                <p className="text-xs text-fg-muted">
                  Enter the code displayed beneath the QR on the teacher&apos;s screen.
                </p>
              </div>

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
                    className="w-10 h-12 text-center text-lg font-mono font-bold rounded-xl bg-surface border border-line focus:border-brand text-fg outline-hidden transition-colors shadow-2xs"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-fg-muted px-2 pt-1">
                <span>Teacher PIN preview:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPinDigits(session.currentPin.split(""));
                    executeVerification({ pin: session.currentPin, method: "PIN" });
                  }}
                  className="text-brand font-mono font-semibold hover:underline cursor-pointer"
                >
                  Auto-fill ({session.currentPin})
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
