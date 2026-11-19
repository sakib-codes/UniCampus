"use client";

import React, { memo, useState } from "react";
import { Search, X } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Conversation } from "./types";

interface NewChatModalProps {
  isOpen: boolean;
  conversations: Conversation[];
  onClose: () => void;
  onSelect: (id: string) => void;
}

export const NewChatModal = memo(function NewChatModal({
  isOpen,
  conversations,
  onClose,
  onSelect,
}: NewChatModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const matches = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl bg-surface border border-line p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-fg">New Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg cursor-pointer"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="To: Type a student, teacher, or department..."
            aria-label="To: Type a student, teacher, or department"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-surface-2 text-fg outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1">
          <p className="text-xs uppercase font-bold text-fg-muted px-1 mb-1">
            Suggested Contacts
          </p>
          {matches.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => {
                onSelect(c.id);
                onClose();
              }}
              aria-label={`Start conversation with ${c.name}`}
              className="w-full text-left p-2 rounded-xl hover:bg-surface-2 flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <ProfileAvatar
                className="w-8 h-8 border border-line"
                iconClassName="w-4 h-4"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-fg truncate">{c.name}</p>
                <p className="text-xs text-fg-muted truncate">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

