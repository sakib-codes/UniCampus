"use client";

import { Users, Radio, GraduationCap, Building2 } from "lucide-react";

interface StudentsStatsStripProps {
  stats: {
    total: number;
    active: number;
    sixthSem: number;
    depts: number;
  };
}

export function StudentsStatsStrip({ stats }: StudentsStatsStripProps) {
  return (
    <div className="w-full">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card A: Enrolled Peers */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-brand/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              Enrolled Peers
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-fg leading-none tabular-nums">
                {stats.total}
              </span>
              <span className="text-xs font-sans tabular-nums text-success font-medium">
                +2 this term
              </span>
            </div>
            <span className="text-xs text-fg-muted">Active directory</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <Users className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Card B: Active Now */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-success/40">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-fg-muted font-sans">
                Active Now
              </span>
              <span
                className="w-2 h-2 rounded-full bg-success shrink-0"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-success leading-none tabular-nums">
                {stats.active}
              </span>
              <span className="text-xs font-sans tabular-nums text-fg-muted">
                of {stats.total} online
              </span>
            </div>
            <span className="text-xs text-success font-medium">
              Currently Online
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-success shrink-0">
            <Radio className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Card C: 6th Semester */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-brand/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              6th Semester
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-brand leading-none tabular-nums">
                {stats.sixthSem}
              </span>
              <span className="text-xs font-sans text-fg-muted">
                Sec A &amp; B
              </span>
            </div>
            <span className="text-xs text-fg-muted">Your batch peers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <GraduationCap className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Card D: Departments */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-brand/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              Departments
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold text-fg leading-none tabular-nums">
                {stats.depts}
              </span>
              <span className="text-xs font-sans text-fg-muted">Programs</span>
            </div>
            <span className="text-xs text-fg-muted font-medium">
              CSE, EEE, BBA
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg shrink-0">
            <Building2 className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
      </section>
    </div>
  );
}
