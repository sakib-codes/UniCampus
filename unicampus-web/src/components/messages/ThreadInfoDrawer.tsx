"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import {
  Bell,
  BellOff,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Edit3,
  FileText,
  Mail,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import {
  Conversation,
  MessengerTheme,
  THEME_GRADIENTS,
} from "./types";

interface ThreadInfoDrawerProps {
  activeConv: Conversation;
  isDetailsOpen: boolean;
  rightPanelWidth: number;
  isDraggingRight: boolean;
  onClose: () => void;
  onRightResizeStart: (e: React.MouseEvent) => void;
  onResetRightWidth: () => void;
  onStepRightWidth: (delta: number) => void;
  onToggleMute: () => void;
  onOpenSearch: () => void;
  onChangeTheme: (theme: MessengerTheme) => void;
  onChangeQuickEmoji: (emoji: string) => void;
  onSaveNickname: (name: string) => void;
  onOpenLightbox: (url: string) => void;
}

export const ThreadInfoDrawer = memo(function ThreadInfoDrawer({
  activeConv,
  isDetailsOpen,
  rightPanelWidth,
  isDraggingRight,
  onClose,
  onRightResizeStart,
  onResetRightWidth,
  onStepRightWidth,
  onToggleMute,
  onOpenSearch,
  onChangeTheme,
  onChangeQuickEmoji,
  onSaveNickname,
  onOpenLightbox,
}: ThreadInfoDrawerProps) {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [expandedSection, setExpandedSection] = useState<
    "info" | "customize" | "files" | "photos" | "privacy" | null
  >("info");

  if (!isDetailsOpen) return null;

  const handleSaveNicknameClick = () => {
    if (!nicknameInput.trim()) return;
    onSaveNickname(nicknameInput.trim());
    setIsEditingNickname(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-30 xl:hidden backdrop-blur-2xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Resizer Handle: Column 2 <-> Column 3 (Desktop XL) */}
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-valuenow={rightPanelWidth}
        aria-valuemin={260}
        aria-valuemax={480}
        aria-label="Resize conversation details panel"
        onMouseDown={onRightResizeStart}
        onDoubleClick={onResetRightWidth}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            onStepRightWidth(10);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            onStepRightWidth(-10);
          }
        }}
        title="Drag to resize panel (Double-click to reset)"
        className={`hidden xl:flex w-2 -mx-1 shrink-0 cursor-col-resize group relative items-center justify-center transition-colors select-none z-20 outline-none focus-visible:bg-brand/20 ${
          isDraggingRight ? "bg-brand/30" : "hover:bg-brand/20"
        }`}
      >
        <div
          className={`w-0.5 h-8 rounded-full transition-colors ${
            isDraggingRight ? "bg-brand" : "bg-line group-hover:bg-brand"
          }`}
        />
      </div>

      <aside className="fixed inset-y-0 right-0 z-40 w-80 sm:w-[340px] xl:static xl:w-[var(--right-panel-width)] xl:z-auto shadow-2xl xl:shadow-none border-l border-line bg-surface flex flex-col shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="h-16 px-4 border-b border-line flex items-center justify-between shrink-0">
          <h3 className="text-sm font-extrabold text-fg">Chat Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-2 text-fg-muted cursor-pointer"
            title="Close details"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Contact Large Avatar & Identity */}
          <div className="flex flex-col items-center text-center pt-2">
            <ProfileAvatar
              className="w-20 h-20 border-2 border-line mb-3"
              iconClassName="w-10 h-10"
            />

            {isEditingNickname ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Nickname..."
                  aria-label="Edit nickname"
                  className="px-2 py-1 text-xs rounded-lg border border-brand bg-surface text-fg outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveNicknameClick}
                  title="Save nickname"
                  aria-label="Save nickname"
                  className="p-1 bg-brand text-white rounded-lg text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-black text-fg">
                  {activeConv.nickname || activeConv.name}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setNicknameInput(activeConv.nickname || activeConv.name);
                    setIsEditingNickname(true);
                  }}
                  className="p-1 text-fg-muted hover:text-brand cursor-pointer"
                  title="Edit nickname"
                  aria-label="Edit nickname"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}

            <p className="text-xs text-fg-muted mt-0.5 max-w-[240px]">
              {activeConv.role}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {activeConv.isOnline ? "Active Now" : "Offline"}
            </span>
          </div>

          {/* Action Buttons: Profile, Mute, Search */}
          <div className="grid grid-cols-3 gap-2 px-2">
            <button
              type="button"
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-surface-2 transition-colors cursor-pointer group"
              title="View academic profile"
              aria-label="View academic profile"
            >
              <div className="w-10 h-10 rounded-full bg-surface-2 group-hover:bg-brand/10 flex items-center justify-center text-fg group-hover:text-brand transition-colors">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-fg-muted">
                Profile
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-surface-2 transition-colors cursor-pointer group"
              title={activeConv.isMuted ? "Unmute notifications" : "Mute notifications"}
              aria-label={
                activeConv.isMuted ? "Unmute notifications" : "Mute notifications"
              }
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  activeConv.isMuted
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-surface-2 group-hover:bg-brand/10 text-fg group-hover:text-brand"
                }`}
              >
                {activeConv.isMuted ? (
                  <BellOff className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs font-semibold text-fg-muted">
                {activeConv.isMuted ? "Muted" : "Mute"}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-surface-2 transition-colors cursor-pointer group"
              title="Search conversation"
              aria-label="Search conversation"
            >
              <div className="w-10 h-10 rounded-full bg-surface-2 group-hover:bg-brand/10 flex items-center justify-center text-fg group-hover:text-brand transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-fg-muted">
                Search
              </span>
            </button>
          </div>

          {/* Accordion 1: Campus Chat Info */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === "info" ? null : "info"
                )
              }
              className="w-full px-4 py-3 bg-surface-2 flex items-center justify-between font-bold text-xs text-fg cursor-pointer"
            >
              <span>Academic & Campus Info</span>
              {expandedSection === "info" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedSection === "info" && (
              <div className="p-3.5 space-y-3 bg-surface text-xs">
                {activeConv.consultationHours && (
                  <div>
                    <div className="text-xs uppercase font-bold text-fg-muted">
                      Consultation Schedule
                    </div>
                    <div className="text-fg font-medium mt-0.5">
                      {activeConv.consultationHours}
                    </div>
                  </div>
                )}

                {activeConv.cabin && (
                  <div>
                    <div className="text-xs uppercase font-bold text-fg-muted">
                      Faculty Cabin / Office
                    </div>
                    <div className="text-fg font-medium mt-0.5">
                      {activeConv.cabin}
                    </div>
                  </div>
                )}

                {activeConv.email && (
                  <div>
                    <div className="text-xs uppercase font-bold text-fg-muted">
                      University Email
                    </div>
                    <a
                      href={`mailto:${activeConv.email}`}
                      className="text-brand hover:underline font-medium mt-0.5 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{activeConv.email}</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion 2: Messenger Customization */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === "customize" ? null : "customize"
                )
              }
              className="w-full px-4 py-3 bg-surface-2 flex items-center justify-between font-bold text-xs text-fg cursor-pointer"
            >
              <span>Customize Chat</span>
              {expandedSection === "customize" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedSection === "customize" && (
              <div className="p-3.5 space-y-4 bg-surface">
                {/* Theme Selector */}
                <div>
                  <label className="text-xs font-bold text-fg-muted mb-2 block">
                    Chat Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(THEME_GRADIENTS) as MessengerTheme[]).map(
                      (themeKey) => {
                        const t = THEME_GRADIENTS[themeKey];
                        const isCurrent = activeConv.themeColor === themeKey;
                        return (
                          <button
                            key={themeKey}
                            type="button"
                            onClick={() => onChangeTheme(themeKey)}
                            className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                              isCurrent
                                ? "border-brand bg-brand/10 ring-1 ring-brand"
                                : "border-line hover:bg-surface-2"
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full bg-gradient-to-tr ${t.ring} shadow-xs shrink-0`}
                            />
                            <span className="text-xs font-bold truncate text-fg">
                              {t.label}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Change Quick Emoji */}
                <div>
                  <label className="text-xs font-bold text-fg-muted mb-2 block">
                    Quick Reaction Emoji
                  </label>
                  <div className="flex items-center gap-2">
                    {["👍", "❤️", "🔥", "💡", "👏", "🎓"].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => onChangeQuickEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                          activeConv.quickEmoji === emoji
                            ? "bg-brand/15 ring-2 ring-brand scale-110"
                            : "bg-surface-2 hover:bg-surface-2/80"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Shared Files & Documents */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === "files" ? null : "files"
                )
              }
              className="w-full px-4 py-3 bg-surface-2 flex items-center justify-between font-bold text-xs text-fg cursor-pointer"
            >
              <span>Shared Files & Documents</span>
              {expandedSection === "files" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedSection === "files" && (
              <div className="p-3 bg-surface space-y-2">
                {!activeConv.sharedFiles ||
                activeConv.sharedFiles.length === 0 ? (
                  <p className="text-xs text-fg-muted p-2 text-center">
                    No files shared yet.
                  </p>
                ) : (
                  activeConv.sharedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-2 rounded-xl bg-surface-2 border border-line flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-fg truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-fg-muted font-mono">
                            {file.size} • {file.date}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${file.name}...`)}
                        className="p-1.5 rounded-lg text-fg-muted hover:text-brand hover:bg-surface transition-colors cursor-pointer shrink-0"
                        title="Download document"
                        aria-label={`Download document ${file.name}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Accordion 4: Shared Photos Gallery */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === "photos" ? null : "photos"
                )
              }
              className="w-full px-4 py-3 bg-surface-2 flex items-center justify-between font-bold text-xs text-fg cursor-pointer"
            >
              <span>Shared Media & Photos</span>
              {expandedSection === "photos" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedSection === "photos" && (
              <div className="p-3 bg-surface">
                {!activeConv.sharedPhotos ||
                activeConv.sharedPhotos.length === 0 ? (
                  <p className="text-xs text-fg-muted p-2 text-center">
                    No photos shared.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {activeConv.sharedPhotos.map((photo, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => onOpenLightbox(photo)}
                        className="relative h-24 rounded-xl overflow-hidden border border-line cursor-pointer hover:opacity-90 transition-opacity w-full block text-left"
                        aria-label={`View photo ${i + 1}`}
                      >
                        <Image
                          src={photo}
                          alt="Shared"
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Accordion 5: Privacy & Verification */}
          <div className="border border-line rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpandedSection(
                  expandedSection === "privacy" ? null : "privacy"
                )
              }
              className="w-full px-4 py-3 bg-surface-2 flex items-center justify-between font-bold text-xs text-fg cursor-pointer"
            >
              <span>Privacy & Verification</span>
              {expandedSection === "privacy" ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedSection === "privacy" && (
              <div className="p-3.5 space-y-3 bg-surface text-xs">
                <div className="flex items-start gap-2.5 text-fg-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    Messages and calls are end-to-end encrypted with UniCampus 256-bit
                    Security.
                  </span>
                </div>

                <div className="pt-2 border-t border-line flex items-center justify-between">
                  <span className="text-xs font-semibold text-fg">
                    Report Academic Issue
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Report submitted to Campus Integrity Desk.")
                    }
                    className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
                  >
                    Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
});

