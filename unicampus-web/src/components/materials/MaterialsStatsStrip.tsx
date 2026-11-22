"use client";

import { Folder, CloudDownload, BookOpen } from "lucide-react";

export function MaterialsStatsStrip() {
  return (
    <div className="w-full">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Repository Files */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-brand/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              Total Repository Files
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-fg leading-none tabular-nums">
                48
              </span>
              <span className="text-xs font-sans text-brand font-medium">
                Verified assets
              </span>
            </div>
            <span className="text-xs text-fg-muted font-sans tabular-nums">
              Across 5 enrolled 6th Semester courses
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0">
            <Folder className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Card 2: Offline Sync & Downloads */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-info/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              Downloads this week
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-info leading-none tabular-nums">
                12
              </span>
              <span className="text-xs font-sans text-fg-muted">
                files cached
              </span>
            </div>
            <span className="text-xs text-fg-muted font-sans tabular-nums">
              142.8 MB offline bundle synced
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-info-light border border-info/20 flex items-center justify-center text-info shrink-0">
            <CloudDownload className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Card 3: Recent Dispatches */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-center justify-between transition-colors duration-150 hover:border-success/40">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium text-fg-muted font-sans">
              Recent Uploads
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-bold text-success leading-none tabular-nums">
                3 new
              </span>
              <span className="text-xs font-sans text-success font-medium">
                today
              </span>
            </div>
            <span className="text-xs text-fg-muted font-sans tabular-nums">
              Latest by Dr. Asif Rahman • 2h ago
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success-light border border-success/20 flex items-center justify-center text-success shrink-0">
            <BookOpen className="w-6 h-6" aria-hidden="true" />
          </div>
        </div>
      </section>
    </div>
  );
}
