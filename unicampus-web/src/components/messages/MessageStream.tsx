"use client";

import React, { memo, RefObject } from "react";
import { MessageSquare, Pin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { Conversation, MessageItem } from "./types";

interface MessageStreamProps {
  activeConv: Conversation;
  inChatSearchTerm: string;
  isTyping: boolean;
  activeReactionMessageId: string | null;
  playingVoiceId: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onHoverReaction: (id: string | null) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onReplyTo: (msg: MessageItem) => void;
  onTogglePin: (messageId: string) => void;
  onPlayVoice: (id: string | null) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const MessageStream = memo(function MessageStream({
  activeConv,
  inChatSearchTerm,
  isTyping,
  activeReactionMessageId,
  playingVoiceId,
  messagesEndRef,
  onHoverReaction,
  onToggleReaction,
  onReplyTo,
  onTogglePin,
  onPlayVoice,
  onOpenLightbox,
}: MessageStreamProps) {
  const pinnedMessage = activeConv.messages.find(
    (m) => m.id === activeConv.pinnedMessageId
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* PINNED MESSAGE BANNER */}
      {pinnedMessage && (
        <div className="px-4 py-2 bg-brand/5 dark:bg-brand/10 border-b border-brand/20 flex items-center justify-between gap-3 text-xs text-fg shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-brand shrink-0" />
            <span className="font-bold text-xs text-brand shrink-0 uppercase tracking-wider">
              Pinned:
            </span>
            <span className="truncate font-medium">{pinnedMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => onTogglePin(pinnedMessage.id)}
            className="text-xs text-brand hover:underline font-bold shrink-0 cursor-pointer"
          >
            Unpin
          </button>
        </div>
      )}

      {/* Message History Canvas */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 [scrollbar-gutter:stable]">
        <div className="max-w-4xl mx-auto space-y-4">
        {activeConv.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-fg">Start the conversation</h4>
            <p className="text-xs text-fg-muted max-w-xs mt-1">
              Send a message, voice note, or shared file to begin collaborating with{" "}
              {activeConv.name}.
            </p>
          </div>
        ) : (
          <>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-2">
              <span className="px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-medium text-fg-muted">
                Today
              </span>
            </div>

            {/* Message Bubbles Stream */}
            {activeConv.messages.map((msg, index) => {
              const isMe = msg.sender === "me";
              const isLastSent =
                isMe && index === activeConv.messages.length - 1;
              const isHighlighted =
                Boolean(inChatSearchTerm) &&
                msg.text
                  .toLowerCase()
                  .includes(inChatSearchTerm.toLowerCase());

              return (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  senderName={activeConv.nickname || activeConv.name}
                  isMe={isMe}
                  isLastSent={isLastSent}
                  themeColor={activeConv.themeColor}
                  quickEmoji={activeConv.quickEmoji}
                  isHighlighted={isHighlighted}
                  activeReactionMessageId={activeReactionMessageId}
                  playingVoiceId={playingVoiceId}
                  onHoverReaction={onHoverReaction}
                  onToggleReaction={onToggleReaction}
                  onReplyTo={onReplyTo}
                  onTogglePin={onTogglePin}
                  onPlayVoice={onPlayVoice}
                  onOpenLightbox={onOpenLightbox}
                />
              );
            })}
          </>
        )}

        {/* LIVE TYPING INDICATOR */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <Avatar
              name={activeConv.nickname || activeConv.name}
              size="sm"
              className="mb-1 shrink-0"
            />

            <div className="px-4 py-3 rounded-2xl rounded-bl-[4px] bg-surface-2 flex items-center gap-1.5 shadow-2xs border border-line">
              <span className="w-2 h-2 rounded-full bg-fg-muted animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-fg-muted animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-fg-muted animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
});

