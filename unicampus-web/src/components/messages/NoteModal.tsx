"use client";

import React, { memo, useState } from "react";
import { X } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";

interface NoteModalProps {
  isOpen: boolean;
  initialNote: string;
  onClose: () => void;
  onSaveNote: (note: string) => void;
}

export const NoteModal = memo(function NoteModal({
  isOpen,
  initialNote,
  onClose,
  onSaveNote,
}: NoteModalProps) {
  const [noteText, setNoteText] = useState(initialNote);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveNote(noteText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface border border-line p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-fg">Share a note</h3>
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

        <div className="flex flex-col items-center mb-4">
          <ProfileAvatar
            className="w-16 h-16 border-2 border-brand mb-2"
            iconClassName="w-8 h-8"
          />
          <p className="text-xs text-fg-muted">
            Your note will be visible to classmates for 24 hours.
          </p>
        </div>

        <input
          type="text"
          maxLength={60}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Share what's on your mind..."
          aria-label="Share what's on your mind"
          className="w-full px-4 py-2.5 rounded-2xl bg-surface-2 text-xs text-fg outline-none border border-transparent focus:border-brand focus:ring-2 focus:ring-brand/40 mb-3"
        />

        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {[
            "Studying for Midterms 📚",
            "In AI Lab 💻",
            "Free for Consultations ☕",
            "Working on Capstone 🚀",
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setNoteText(preset)}
              className="text-xs px-2 py-1 rounded-lg bg-surface-2 text-fg-muted hover:text-brand cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-2.5 bg-brand text-white hover:bg-brand-hover text-xs font-bold rounded-xl cursor-pointer transition-colors"
        >
          Share Note
        </button>
      </div>
    </div>
  );
});

