"use client";

import React, { memo } from "react";
import { MessageSquare, MoreHorizontal, Plus, Search, SquarePen } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { ConversationRow } from "./ConversationRow";
import { Conversation } from "./types";

interface ConversationListProps {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  activeConvId: string;
  activeCategory: "all" | "faculty" | "peers" | "office";
  searchQuery: string;
  isTyping: boolean;
  userStatusNote: string;
  isMobileConversationOpen: boolean;
  onSearchChange: (val: string) => void;
  onCategoryChange: (cat: "all" | "faculty" | "peers" | "office") => void;
  onSelectConversation: (id: string) => void;
  onToggleMute: (id: string) => void;
  onOpenNewChatModal: () => void;
  onOpenNoteModal: () => void;
}

export const ConversationList = memo(function ConversationList({
  conversations,
  filteredConversations,
  activeConvId,
  activeCategory,
  searchQuery,
  isTyping,
  userStatusNote,
  isMobileConversationOpen,
  onSearchChange,
  onCategoryChange,
  onSelectConversation,
  onToggleMute,
  onOpenNewChatModal,
  onOpenNoteModal,
}: ConversationListProps) {
  const onlineCount = conversations.filter((c) => c.isOnline).length;

  return (
    <aside
      className={`w-full md:w-[var(--left-panel-width)] border-r border-line bg-surface flex flex-col shrink-0 ${
        isMobileConversationOpen ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Messenger Header: Bold 'Chats' + Action icons */}
      <div className="p-3.5 pb-2 border-b border-line">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-fg">
              Chats
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenNewChatModal}
              title="New Conversation"
              aria-label="New Conversation"
              className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-2 text-fg flex items-center justify-center transition-colors cursor-pointer"
            >
              <SquarePen className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Chat Options"
              aria-label="Chat Options"
              className="w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-2 text-fg flex items-center justify-center transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Messenger Input */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Messenger"
            aria-label="Search Messenger"
            className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm rounded-full bg-surface-2 border border-transparent focus:border-brand focus:ring-2 focus:ring-brand/40 text-fg placeholder:text-fg-muted outline-none transition-colors"
          />
        </div>

        {/* Messenger Category Tabs */}
        <div
          role="tablist"
          aria-label="Chat categories"
          className="flex items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { id: "all", label: "Inbox" },
            { id: "faculty", label: "Faculty" },
            { id: "peers", label: "Study Groups" },
            { id: "office", label: "Offices" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={activeCategory === tab.id}
              onClick={() =>
                onCategoryChange(tab.id as typeof activeCategory)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand ${
                activeCategory === tab.id
                  ? "bg-brand text-white shadow-2xs"
                  : "bg-surface-2 text-fg-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE NOW CONTACT STORIES TRAY */}
      <div className="px-3 pt-2 pb-2.5 border-b border-line bg-surface/50">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-xs font-bold text-fg-muted uppercase tracking-wider">
            Active Now
          </span>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {onlineCount} Online
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-2 px-1 -mx-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* User's Note / Status */}
          <button
            type="button"
            onClick={onOpenNoteModal}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand rounded-full"
            title="Leave a campus note"
            aria-label="Leave a campus note"
          >
            <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-brand/50 flex items-center justify-center group-hover:border-brand transition-colors bg-surface-2">
              <Plus className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-1 -right-0.5 w-4 h-4 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow-xs">
                +
              </span>
            </div>
            <span className="text-xs font-semibold text-fg-muted max-w-[56px] truncate text-center">
              {userStatusNote ? userStatusNote.slice(0, 8) + ".." : "Your note"}
            </span>
          </button>

          {/* Active Online Contacts */}
          {conversations
            .filter((c) => c.isOnline)
            .map((c) => {
              const cleanName = c.name.replace(
                /^(Dr\.|Prof\.|Engr\.|Ms\.|Mr\.)\s+/i,
                ""
              );
              const shortLabel = cleanName.split(" ")[0] || c.name;
              const isSelected = c.id === activeConvId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectConversation(c.id)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand rounded-full focus:outline-none"
                  title={`${c.name} • ${c.userNote || "Active now"}`}
                  aria-label={`${c.name} • ${c.userNote || "Active now"}`}
                >
                  <div
                    className={`relative w-12 h-12 rounded-full p-0.5 transition-transform duration-150 group-hover:scale-105 ${
                      isSelected
                        ? "ring-2 ring-brand"
                        : "ring-1 ring-line"
                    }`}
                  >
                    <ProfileAvatar
                      className="w-full h-full"
                      iconClassName="w-6 h-6"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-surface absolute bottom-0 right-0 shadow-xs" />
                  </div>
                  <span
                    className={`text-xs font-bold max-w-[58px] truncate text-center ${
                      isSelected ? "text-brand" : "text-fg"
                    }`}
                  >
                    {shortLabel}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Conversation Rows List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-10 h-10 text-line mx-auto mb-2" />
            <p className="text-xs font-semibold text-fg-muted">
              No chats match your search.
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConvId;
            const isCurrentTyping = isSelected && isTyping;

            return (
              <ConversationRow
                key={conv.id}
                conv={conv}
                isSelected={isSelected}
                isTyping={isCurrentTyping}
                onSelect={onSelectConversation}
                onToggleMute={onToggleMute}
              />
            );
          })
        )}
      </div>
    </aside>
  );
});

