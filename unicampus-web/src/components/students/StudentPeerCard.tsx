"use client";

import { memo } from "react";
import { CheckCircle2, MessageSquare, MoreVertical } from "lucide-react";
import { Student, AVATAR_TONE_CLASSES } from "./studentsData";

interface StudentPeerCardProps {
  student: Student;
  onMessagePeer: (name: string) => void;
  onShowDetails: (student: Student) => void;
}

export const StudentPeerCard = memo(function StudentPeerCard({
  student,
  onMessagePeer,
  onShowDetails,
}: StudentPeerCardProps) {
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarClass = AVATAR_TONE_CLASSES[student.avatarTone];

  return (
    <article className="p-5 rounded-2xl bg-surface border border-line flex flex-col justify-between gap-4 relative group transition-colors duration-150 hover:border-brand/40 h-full">
      <div className="flex flex-col gap-3.5">
        {/* Top Row: Avatar + Name + Monospace ID */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-12 shrink-0">
              <div
                className={`w-12 h-12 rounded-full border flex items-center justify-center font-semibold text-sm ${avatarClass}`}
              >
                {initials}
              </div>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-surface absolute bottom-0 right-0 z-10 ${
                  student.isActive ? "bg-success" : "bg-fg-subtle"
                }`}
                title={student.isActive ? "Online now" : "Offline"}
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-fg leading-snug truncate">
                  {student.name}
                </h3>
                <span title="Verified Student" className="shrink-0 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
                </span>
              </div>
              <span className="text-xs font-sans text-fg-muted mt-0.5">
                ID: <span className="font-mono">{student.studentId}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onMessagePeer(student.name)}
              className="min-w-[36px] min-h-[36px] rounded-lg text-brand hover:bg-brand-soft flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title={`Message ${student.name}`}
              aria-label={`Message ${student.name}`}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onShowDetails(student)}
              className="min-w-[36px] min-h-[36px] rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title="Student Details"
              aria-label={`Details for ${student.name}`}
            >
              <MoreVertical className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Department, Semester, Section Tag Row */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-2 border border-line text-fg">
            {student.department}
          </span>
          <span className="text-fg-subtle" aria-hidden="true">•</span>
          <span className="font-medium text-fg-muted font-sans tabular-nums">
            {student.semester}
          </span>
          <span className="text-fg-subtle" aria-hidden="true">•</span>
          <span className="font-sans text-fg-muted">
            {student.section}
          </span>
          <span className="text-fg-subtle" aria-hidden="true">•</span>
          <span
            className={`text-xs font-medium ${
              student.isActive ? "text-success" : "text-fg-muted"
            }`}
          >
            {student.activeStatusText}
          </span>
        </div>

        {/* Skills & Interests Chip Row */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {student.skills
            .filter((skill) => !skill.toLowerCase().includes("section"))
            .map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-xs font-medium text-fg hover:border-brand/40 transition-colors"
              >
                {skill}
              </span>
            ))}
        </div>
      </div>

      {/* Dedicated Message CTA */}
      <div className="pt-3 border-t border-line">
        <button
          type="button"
          onClick={() => onMessagePeer(student.name)}
          className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-surface-2 hover:bg-brand-soft border border-line hover:border-brand/30 text-xs font-semibold text-fg hover:text-brand flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Message {student.name.split(" ")[0]}</span>
        </button>
      </div>
    </article>
  );
});
