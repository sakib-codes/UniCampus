"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { Paperclip, Reply, Send, Smile, X } from "lucide-react";
import { Conversation, MessageItem, THEME_GRADIENTS, formatTimer } from "./types";

interface MessageComposerProps {
  activeConv: Conversation;
  replyingToMessage: MessageItem | null;
  onClearReply: () => void;
  onSendMessage: (
    textToSend?: string,
    isThumbsUp?: boolean,
    imageAttachment?: string,
    isVoiceNote?: boolean,
    voiceDuration?: string
  ) => void;
}

export const MessageComposer = memo(function MessageComposer({
  activeConv,
  replyingToMessage,
  onClearReply,
  onSendMessage,
}: MessageComposerProps) {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTheme = THEME_GRADIENTS[activeConv?.themeColor || "classic"];

  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleSendVoiceNote = () => {
    const durationStr = `0:${recordingSeconds < 10 ? "0" : ""}${
      recordingSeconds || 4
    }`;
    onSendMessage(undefined, false, undefined, true, durationStr);
    setIsRecordingVoice(false);
  };

  return (
    <div className="shrink-0 bg-surface border-t border-line">
      {/* Replying To Quote Bar (if active) */}
      {replyingToMessage && (
        <div className="px-4 py-2 bg-surface-2 border-b border-line flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <Reply className="w-3.5 h-3.5 text-brand shrink-0 rotate-180" />
            <span className="font-bold text-fg">
              Replying to{" "}
              {replyingToMessage.sender === "me"
                ? "yourself"
                : activeConv.name}
              :
            </span>
            <span className="text-fg-muted truncate italic">
              {replyingToMessage.text}
            </span>
          </div>
          <button
            type="button"
            onClick={onClearReply}
            className="p-1 rounded-full text-fg-muted hover:text-fg cursor-pointer"
            title="Cancel reply"
            aria-label="Cancel reply"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MESSENGER INPUT COMPOSER / VOICE RECORDER */}
      <div className="p-3 sm:p-4">
        {isRecordingVoice ? (
          /* Live Audio Recording State */
          <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto p-1">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-red-500">
                Recording {formatTimer(recordingSeconds)}
              </span>
              <div className="hidden sm:flex items-center gap-1 h-4">
                {[20, 60, 100, 40, 80, 50, 90, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(false)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-fg-muted hover:bg-surface-2 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendVoiceNote}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Send Voice</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Regular Messenger Input Composer */
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2.5 w-full max-w-5xl mx-auto"
          >
            {/* Attachment Action (Clean single button) */}
            <button
              type="button"
              onClick={() =>
                onSendMessage("Shared assignment PDF: 3NF_Review.pdf")
              }
              className="p-2 rounded-full hover:bg-surface-2 text-fg-muted hover:text-brand transition-colors cursor-pointer shrink-0"
              title="Attach files"
              aria-label="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Messenger Pill Input Field */}
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${
                  activeConv.nickname || activeConv.name.split(" ")[0]
                }...`}
                aria-label={`Message ${
                  activeConv.nickname || activeConv.name.split(" ")[0]
                }`}
                className="w-full h-11 pl-4.5 pr-11 text-xs sm:text-sm font-medium rounded-full bg-surface-2 text-fg placeholder:text-fg-muted outline-none border border-line hover:border-fg-muted/40 focus:border-brand focus:ring-2 focus:ring-brand/30 shadow-2xs transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-fg-muted hover:text-brand transition-colors cursor-pointer rounded-full hover:bg-surface-2"
                title="Stickers & Emoji"
                aria-label="Stickers & Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              {/* Emoji Quick Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute right-0 bottom-14 z-30 p-2 rounded-2xl bg-surface border border-line shadow-xl flex gap-1">
                  {["👍", "❤️", "🔥", "🎉", "👏", "💡", "📚", "🎯"].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setInputText((prev) => prev + em);
                        setShowEmojiPicker(false);
                      }}
                      className="p-1.5 hover:bg-surface-2 rounded-lg text-lg cursor-pointer"
                      aria-label={`Insert emoji ${em}`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Button: Quick Emoji or Send Message */}
            {inputText.trim().length === 0 ? (
              <button
                type="button"
                onClick={() => onSendMessage(undefined, true)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-115 active:scale-95 transition-transform motion-reduce:hover:scale-100 text-xl cursor-pointer"
                title={`Send ${activeConv.quickEmoji || "👍"}`}
                aria-label={`Send ${activeConv.quickEmoji || "thumbs up"}`}
              >
                <span>{activeConv.quickEmoji || "👍"}</span>
              </button>
            ) : (
              <button
                type="submit"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-2xs ${activeTheme.bubble}`}
                title="Send message"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
});

