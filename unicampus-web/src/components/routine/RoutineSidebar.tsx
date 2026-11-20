"use client";

import { memo } from "react";
import { GraduationCap, Users } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { CANONICAL_FACULTY } from "@/lib/canonicalCampus";

const STUDY_CIRCLES = [
  {
    id: "circle-1",
    title: "Algorithms Sprint Practice",
    time: "03:00 PM",
    location: "Central Library 3rd Floor • Collaborative Booth 4",
    members: "3 members joined",
  },
  {
    id: "circle-2",
    title: "Database Query Optimization",
    time: "04:30 PM",
    location: "Room 301-A • CSE Seminar Lounge",
    members: "4 members joined",
  },
  {
    id: "circle-3",
    title: "System Architecture & Microservices",
    time: "05:15 PM",
    location: "Software Lab 2 • Workstation Row B",
    members: "2 members joined",
  },
];

export const RoutineSidebar = memo(function RoutineSidebar() {
  return (
    <div className="lg:col-span-4 space-y-4">
      {/* Widget 1: Faculty Drop-In Hours Today */}
      <div className="bg-surface border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-success-light text-success flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-semibold text-sm text-fg">
              Faculty Drop-In Hours
            </h3>
          </div>
          <span className="text-xs font-sans text-fg-muted">Today</span>
        </div>

        <div className="mt-3.5 space-y-2.5">
          <div className="p-2.5 rounded-xl bg-surface-2 border border-line flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ProfileAvatar
                alt="Dr. Farhana Khan"
                size="xs"
                className="w-6 h-6 border border-line shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate">
                  Dr. Farhana Khan
                </p>
                <p className="text-xs font-sans tabular-nums text-fg-muted truncate">
                  12:00 PM - 01:30 PM • Room 612
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-success-light text-success text-xs font-semibold border border-success/25 shrink-0">
              Open
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-2 border border-line flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ProfileAvatar
                alt={CANONICAL_FACULTY.name}
                size="xs"
                className="w-6 h-6 border border-line shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-fg truncate">
                  {CANONICAL_FACULTY.name}
                </p>
                <p className="text-xs font-sans tabular-nums text-fg-muted truncate">
                  {CANONICAL_FACULTY.officeHours.replace("Mon ", "")} • {CANONICAL_FACULTY.office}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface border border-line text-fg-muted text-xs font-semibold shrink-0">
              By Appt
            </span>
          </div>
        </div>
      </div>

      {/* Widget 2: Class Study Groups & Peers */}
      <div className="bg-surface border border-line rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
            <h3 className="font-sans font-semibold text-sm text-fg">
              Peer Study Circles
            </h3>
          </div>
          {/* Badge count strictly aligned with rendered circle cards */}
          <span className="text-xs font-sans tabular-nums text-success font-semibold px-2 py-0.5 rounded-full bg-success-light border border-success/25">
            {STUDY_CIRCLES.length} Active
          </span>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {STUDY_CIRCLES.map((circle) => (
            <div key={circle.id} className="p-3 rounded-xl bg-surface-2 border border-line space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-fg">
                  {circle.title}
                </span>
                <span className="font-sans tabular-nums text-xs font-semibold text-brand shrink-0">
                  {circle.time}
                </span>
              </div>
              <p className="text-xs text-fg-muted">
                {circle.location}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-fg-muted font-medium font-sans tabular-nums">
                  {circle.members}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    alert(`Joined "${circle.title}"! Room notification sent.`)
                  }
                  className="text-xs font-semibold text-brand hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                >
                  Join Circle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
