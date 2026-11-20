"use client";

import React, { memo } from "react";
import { ArrowLeft, BellOff, Info, Phone, Search, Video, X } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Conversation } from "./types";

interface ChatHeaderProps {
  activeConv: Conversation;
  isDetailsOpen: boolean;
  isSearchInChatOpen: boolean;
  inChatSearchTerm: string;
  onBackMobile: () => void;
  onToggleSearchInChat: () => void;
  onSearchTermChange: (val: string) => void;
  onStartCall: (type: "audio" | "video") => void;
  onToggleDetails: () => void;
}

export const ChatHeader = memo(function ChatHeader({
  activeConv,
  isDetailsOpen,
  isSearchInChatOpen,
  inChatSearchTerm,
  onBackMobile,
  onToggleSearchInChat,
  onSearchTermChange,
  onStartCall,
  onToggleDetails,
}: ChatHeaderProps) {
  const matchCount = inChatSearchTerm
    ? activeConv.messages.filter((m) =>
        m.text.toLowerCase().includes(inChatSearchTerm.toLowerCase())
      ).length
    : 0;

  return (
    <div className="shrink-0 z-10">
      {/* Messenger Chat Header */}
      <div className="h-16 px-4 border-b border-line bg-surface flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackMobile}
            className="p-2 rounded-full text-fg-muted hover:bg-surface-2 md:hidden cursor-pointer"
            title="Back to conversation list"
            aria-label="Back to conversation list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative shrink-0">
            <ProfileAvatar
              size="md"
              className="border border-line"
            />
            {activeConv.isOnline && (
              <span className="w-3 h-3 rounded-full bg-success border-2 border-surface absolute bottom-0 right-0 shadow-xs" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold text-fg truncate">
                {activeConv.nickname || activeConv.name}
              </h2>
              {activeConv.isMuted && (
                <BellOff className="w-3.5 h-3.5 text-warning shrink-0" />
              )}
            </div>
            <p className="text-xs text-fg-muted flex items-center gap-1.5 truncate">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeConv.isOnline ? "bg-success" : "bg-fg-muted/60"
                }`}
              />
              <span>{activeConv.lastActive}</span>
              <span>•</span>
              <span className="truncate">{activeConv.role}</span>
            </p>
          </div>
        </div>

        {/* Action Icons: In-chat Search, Audio Call, Video Call, Details Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleSearchInChat}
            className={`p-2.5 rounded-full transition-colors cursor-pointer ${
              isSearchInChatOpen
                ? "bg-brand/10 text-brand"
                : "text-fg-muted hover:bg-surface-2"
            }`}
            title="Search in conversation"
            aria-label="Search in conversation"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onStartCall("audio")}
            className="p-2.5 rounded-full text-brand hover:bg-brand/10 transition-colors cursor-pointer"
            title="Start voice call"
            aria-label="Start voice call"
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onStartCall("video")}
            className="p-2.5 rounded-full text-brand hover:bg-brand/10 transition-colors cursor-pointer"
            title="Start video call"
            aria-label="Start video call"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onToggleDetails}
            className={`p-2.5 rounded-full transition-colors cursor-pointer ${
              isDetailsOpen
                ? "bg-brand/10 text-brand"
                : "text-fg-muted hover:bg-surface-2"
            }`}
            title="Conversation information"
            aria-label="Conversation information"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* IN-CHAT SEARCH BAR */}
      {isSearchInChatOpen && (
        <div className="px-4 py-2 bg-surface-2 border-b border-line flex items-center gap-2">
          <Search className="w-4 h-4 text-fg-muted shrink-0" />
          <input
            type="text"
            value={inChatSearchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search in this conversation..."
            aria-label="Search in this conversation"
            className="flex-1 text-xs bg-transparent text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
            autoFocus
          />
          {inChatSearchTerm && (
            <span className="text-xs text-fg-muted font-sans tabular-nums">
              {matchCount} matches
            </span>
          )}
          <button
            type="button"
            onClick={onToggleSearchInChat}
            className="p-1 rounded-full text-fg-muted hover:text-fg cursor-pointer"
            title="Close search"
            aria-label="Close search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});

