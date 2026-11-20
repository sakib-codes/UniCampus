"use client";

import React, { memo } from "react";
import Image from "next/image";
import { CheckCheck, Maximize2, Pause, Pin, Play, Reply } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import {
  EMOJI_REACTIONS_LIST,
  MessageItem,
  THEME_GRADIENTS,
  MessengerTheme,
} from "./types";

interface MessageBubbleProps {
  msg: MessageItem;
  isMe: boolean;
  isLastSent: boolean;
  themeColor: MessengerTheme;
  quickEmoji: string;
  isHighlighted?: boolean;
  activeReactionMessageId: string | null;
  playingVoiceId: string | null;
  onHoverReaction: (id: string | null) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onReplyTo: (msg: MessageItem) => void;
  onTogglePin: (messageId: string) => void;
  onPlayVoice: (id: string | null) => void;
  onOpenLightbox: (imageUrl: string) => void;
}

export const MessageBubble = memo(function MessageBubble({
  msg,
  isMe,
  isLastSent,
  themeColor,
  quickEmoji,
  isHighlighted = false,
  activeReactionMessageId,
  playingVoiceId,
  onHoverReaction,
  onToggleReaction,
  onReplyTo,
  onTogglePin,
  onPlayVoice,
  onOpenLightbox,
}: MessageBubbleProps) {
  const activeTheme = THEME_GRADIENTS[themeColor || "classic"];
  const isReactionToolbarVisible = activeReactionMessageId === msg.id;

  return (
    <div
      onMouseEnter={() => onHoverReaction(msg.id)}
      onMouseLeave={() => onHoverReaction(null)}
      className={`relative group flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      } ${isHighlighted ? "bg-warning-light p-1 rounded-xl" : ""}`}
    >
      {/* Contact Avatar for Incoming Messages */}
      {!isMe && (
        <ProfileAvatar
          className="w-7 h-7 border border-line mb-1 shrink-0"
          iconClassName="w-3.5 h-3.5"
        />
      )}

      {/* Floating Reaction Bar + Reply + Pin Actions (Messenger Style) */}
      {isReactionToolbarVisible && (
        <div
          className={`absolute -top-9 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-surface border border-line shadow-lg ${
            isMe ? "right-0" : "left-9"
          }`}
        >
          {EMOJI_REACTIONS_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onToggleReaction(msg.id, emoji)}
              className="hover:scale-125 transition-transform p-0.5 text-sm cursor-pointer"
              title={`React ${emoji}`}
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}

          <span className="w-px h-3.5 bg-line mx-0.5" />

          <button
            type="button"
            onClick={() => onReplyTo(msg)}
            className="p-1 hover:bg-surface-2 rounded-full text-fg-muted hover:text-brand cursor-pointer"
            title="Reply"
            aria-label="Reply to message"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onTogglePin(msg.id)}
            className="p-1 hover:bg-surface-2 rounded-full text-fg-muted hover:text-warning cursor-pointer"
            title="Pin message"
            aria-label="Pin message"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`relative max-w-[82%] sm:max-w-md ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {/* Quoted Message Preview if replying */}
        {msg.replyTo && (
          <div
            className={`text-xs mb-1 px-3 py-1.5 rounded-xl border flex items-center gap-2 opacity-85 truncate ${
              isMe
                ? "bg-brand/10 border-brand/20 text-fg"
                : "bg-surface-2 border-line text-fg-muted"
            }`}
          >
            <Reply className="w-3 h-3 shrink-0 rotate-180" />
            <span className="font-bold shrink-0">{msg.replyTo.sender}:</span>
            <span className="truncate italic">{msg.replyTo.text}</span>
          </div>
        )}

        {/* Bubble Content: Image Attachment */}
        {msg.imageAttachment && (
          <button
            type="button"
            onClick={() => onOpenLightbox(msg.imageAttachment!)}
            className="relative w-64 max-w-full h-48 rounded-2xl overflow-hidden mb-1.5 cursor-pointer border border-line group/img shadow-2xs block text-left"
            aria-label="View attached image full screen"
          >
            <Image
              src={msg.imageAttachment}
              alt="Attached media"
              fill
              sizes="256px"
              className="object-cover group-hover/img:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-on-brand opacity-0 group-hover/img:opacity-100 transition-opacity drop-shadow-md" />
            </div>
          </button>
        )}

        {/* Bubble Content: Voice Note */}
        {msg.isVoiceNote ? (
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xs flex items-center gap-3 ${
              isMe
                ? `${activeTheme.bubble} rounded-br-[4px]`
                : "bg-surface-2 text-fg rounded-bl-[4px] border border-line"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                onPlayVoice(playingVoiceId === msg.id ? null : msg.id)
              }
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                isMe ? "bg-surface text-brand" : "bg-brand text-on-brand"
              }`}
              title={playingVoiceId === msg.id ? "Pause voice note" : "Play voice note"}
              aria-label={
                playingVoiceId === msg.id ? "Pause voice note" : "Play voice note"
              }
            >
              {playingVoiceId === msg.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Animated Sound Waveform Bars */}
            <div className="flex items-center gap-0.5 h-6">
              {[40, 75, 100, 60, 85, 30, 90, 50, 70, 45, 95, 65, 35, 80, 50].map(
                (h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-opacity duration-150 ${
                      playingVoiceId === msg.id ? "animate-pulse" : ""
                    } ${isMe ? "bg-on-brand/80" : "bg-fg-muted"}`}
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>

            <span className="text-xs font-sans font-semibold tabular-nums shrink-0 opacity-90">
              {msg.voiceDuration || "0:14"}
            </span>
          </div>
        ) : msg.isThumbsUp ? (
          /* Bubble Content: Big Messenger Thumbs Up / Sticker */
          <div className="p-2 cursor-pointer hover:scale-110 active:scale-95 transition-transform">
            <span className="text-5xl leading-none">
              {msg.thumbsUpEmoji || quickEmoji || "👍"}
            </span>
          </div>
        ) : (
          /* Bubble Content: Regular Message Text */
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed shadow-2xs font-normal ${
              isMe
                ? "bg-brand text-on-brand rounded-2xl rounded-br-[4px]"
                : "bg-surface-2 text-fg rounded-2xl rounded-bl-[4px] border border-line"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Attached Emoji Reactions Badge */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className={`absolute -bottom-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-surface border border-line shadow-2xs text-xs ${
              isMe ? "right-1" : "left-1"
            }`}
          >
            {msg.reactions.map((r, i) => (
              <span key={i} className="flex items-center gap-0.5 font-bold">
                <span>{r.emoji}</span>
                {r.count > 1 && (
                  <span className="text-xs text-fg-muted">{r.count}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Message Time & Messenger 'Seen' Mini Avatar status */}
        <div
          className={`flex items-center gap-1.5 mt-1 px-1 text-xs text-fg-muted ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <span>{msg.time}</span>
          {isMe &&
            (isLastSent ? (
              <ProfileAvatar
                className="w-3.5 h-3.5 border border-surface shrink-0"
                iconClassName="w-2 h-2"
              />
            ) : (
              <CheckCheck className="w-3.5 h-3.5 text-brand" />
            ))}
        </div>
      </div>
    </div>
  );
});

