import React from "react";
import { ACTIVE_TERM, CAMPUS_METRICS } from "@/lib/canonicalCampus";

export default function CampusMetrics() {
  return (
    <section className="py-12 border-y border-line bg-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
          {/* Stat 1 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-fg tracking-tight tabular-nums">
              {CAMPUS_METRICS.students.toLocaleString("en-US")}
            </div>
            <p className="text-sm font-medium text-fg">Active enrolled students</p>
            <p className="text-xs text-fg-muted">
              Across {CAMPUS_METRICS.departmentsCount} academic departments ({ACTIVE_TERM})
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-fg tracking-tight tabular-nums">
              {CAMPUS_METRICS.departmentsCount}
            </div>
            <p className="text-sm font-medium text-fg">Academic departments</p>
            <p className="text-xs text-fg-muted">
              CSE, EEE, BBA, PHARM, and ENG programs
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1.5">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-fg tracking-tight tabular-nums">
              {CAMPUS_METRICS.faculty.toLocaleString("en-US")}
            </div>
            <p className="text-sm font-medium text-fg">Faculty members & instructors</p>
            <p className="text-xs text-fg-muted">
              Teaching across all {CAMPUS_METRICS.departmentsCount} active departments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
