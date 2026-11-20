"use client";

import React, { memo } from "react";
import { Bell, BellOff } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Conversation } from "./types";

interface ConversationRowProps {
  conv: Conversation;
  isSelected: boolean;
  isTyping: boolean;
  onSelect: (id: string) => void;
  onToggleMute: (id: string) => void;
}

export const ConversationRow = memo(function ConversationRow({
  conv,
  isSelected,
  isTyping,
  onSelect,
  onToggleMute,
}: ConversationRowProps) {
  return (
    <div
      className={`group relative w-full p-2 rounded-2xl flex items-center transition-colors text-left ${
        isSelected
          ? "bg-surface-2"
          : "hover:bg-surface-2/60"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(conv.id)}
        aria-label={`Open conversation with ${conv.nickname || conv.name}`}
        aria-current={isSelected ? "true" : undefined}
        className="w-full p-0.5 flex items-center gap-3 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none rounded-xl"
      >
        {/* Avatar with Messenger Active Dot */}
        <div className="relative shrink-0">
          <ProfileAvatar
            className="w-13 h-13 border border-line"
            iconClassName="w-6 h-6"
          />
          {conv.isOnline && (
            <span className="w-3.5 h-3.5 rounded-full bg-success border-2 border-surface absolute bottom-0 right-0 shadow-xs" />
          )}
        </div>

        {/* Metadata & Message Preview */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between mb-0.5">
            <h3
              className={`text-sm truncate ${
                conv.unreadCount > 0
                  ? "font-semibold text-fg"
                  : "font-medium text-fg"
              }`}
            >
              {conv.nickname || conv.name}
            </h3>
            <span className="text-xs text-fg-muted shrink-0 font-medium tabular-nums">
              {conv.lastTime}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {isTyping ? (
              <p className="text-xs text-brand font-medium italic flex items-center gap-1 truncate">
                <span>Typing</span>
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-brand animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:300ms]" />
                </span>
              </p>
            ) : (
              <p
                className={`text-xs truncate ${
                  conv.unreadCount > 0
                    ? "font-semibold text-fg"
                    : "text-fg-muted"
                }`}
              >
                {conv.lastMessage}
              </p>
            )}

            {conv.unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand shrink-0 shadow-xs" />
            )}
          </div>
        </div>
      </button>

      {/* Quick Action Button on Hover (Messenger Style) - Sibling, NOT nested in button */}
      <div className="hidden group-hover:flex items-center gap-1 absolute right-2.5 bg-surface-2 px-1 py-0.5 rounded-full shadow-xs z-10">
        <button
          type="button"
          onClick={() => onToggleMute(conv.id)}
          className="p-1 rounded-full text-fg-muted hover:text-fg cursor-pointer"
          title={conv.isMuted ? "Unmute" : "Mute"}
          aria-label={
            conv.isMuted ? "Unmute notifications" : "Mute notifications"
          }
        >
          {conv.isMuted ? (
            <BellOff className="w-3.5 h-3.5 text-warning" />
          ) : (
            <Bell className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
});
