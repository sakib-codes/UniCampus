"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { Mic, MicOff, Monitor, PhoneOff, Video, VideoOff, X } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Conversation, formatTimer } from "./types";

interface ActiveCallModalProps {
  activeCallType: "audio" | "video" | null;
  activeConv: Conversation;
  onClose: () => void;
}

export const ActiveCallModal = memo(function ActiveCallModal({
  activeCallType,
  activeConv,
  onClose,
}: ActiveCallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeCallType) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCallType]);

  if (!activeCallType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-surface border border-line overflow-hidden text-center relative shadow-2xl flex flex-col">
        {/* Top Bar */}
        <div className="p-4 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light text-success text-xs font-sans font-semibold tabular-nums">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>
              Messenger {activeCallType === "video" ? "Video Call" : "Audio Call"} •{" "}
              {formatTimer(callDuration)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg p-1 rounded-full cursor-pointer"
            title="End call dialog"
            aria-label="End call dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video or Audio Viewport */}
        {activeCallType === "video" ? (
          <div className="relative w-full h-80 bg-surface-2 flex items-center justify-center overflow-hidden">
            {!isCameraOff ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40">
                <ProfileAvatar
                  className="w-28 h-28 border-4 border-brand/50 shadow-lg"
                  iconClassName="w-14 h-14"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-xs text-on-brand">
                  {activeConv.name}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ProfileAvatar
                  className="w-20 h-20 border-2 border-brand mb-2"
                  iconClassName="w-10 h-10"
                />
                <p className="text-xs text-fg-muted">Camera is paused</p>
              </div>
            )}

            {/* Picture in Picture Self-View */}
            <div className="absolute top-3 right-3 w-28 h-20 rounded-2xl overflow-hidden border-2 border-line shadow-lg bg-surface flex items-center justify-center">
              <ProfileAvatar className="w-12 h-12" iconClassName="w-6 h-6" />
              <span className="absolute bottom-1 right-1 text-xs bg-black/70 px-1 rounded text-on-brand font-sans">
                You
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <ProfileAvatar
                className="w-full h-full border-4 border-brand relative z-10"
                iconClassName="w-14 h-14"
              />
            </div>

            <h3 className="text-xl font-semibold mb-1 text-fg">
              {activeConv.name}
            </h3>
            <p className="text-xs text-fg-muted font-sans">
              Connected • VoIP 256-bit Encrypted
            </p>
          </div>
        )}

        {/* Bottom Call Control Action Bar */}
        <div className="p-4 bg-surface-2 border-t border-line flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsCallMuted(!isCallMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
              isCallMuted
                ? "bg-danger-light text-danger"
                : "bg-surface hover:bg-surface-2 text-fg border border-line"
            }`}
            title={isCallMuted ? "Unmute mic" : "Mute mic"}
            aria-label={isCallMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isCallMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {activeCallType === "video" && (
            <>
              <button
                type="button"
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isCameraOff
                    ? "bg-danger-light text-danger"
                    : "bg-surface hover:bg-surface-2 text-fg border border-line"
                }`}
                title={isCameraOff ? "Turn camera on" : "Turn camera off"}
                aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
              >
                {isCameraOff ? (
                  <VideoOff className="w-5 h-5" />
                ) : (
                  <Video className="w-5 h-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isScreenSharing
                    ? "bg-brand text-on-brand"
                    : "bg-surface hover:bg-surface-2 text-fg border border-line"
                }`}
                title="Share screen"
                aria-label="Share screen"
              >
                <Monitor className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-14 h-14 rounded-full bg-danger hover:bg-danger/90 text-on-brand flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform motion-reduce:hover:scale-100 cursor-pointer"
            title="End call"
            aria-label="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
});

