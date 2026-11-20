"use client";

import { memo } from "react";
import { BookOpen, Layers, ShieldCheck, TrendingUp } from "lucide-react";

export const ProgressKpiBento = memo(function ProgressKpiBento() {
  const totalCredits = 144;
  const completedCredits = 96;
  const degreeCompletionPct = Math.round((completedCredits / totalCredits) * 100);
  const degreeCompletionWidth = `${(Math.round((completedCredits / totalCredits) * 1000) / 10).toFixed(1)}%`;

  return (
    <div className="w-full">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: OVERALL CGPA (Radial Arc Gauge) */}
        <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl p-5 transition-colors duration-150 flex flex-col justify-between">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg tracking-tight">
                Overall CGPA
              </span>
            </div>

            <div className="py-2.5 flex flex-col items-center justify-center relative">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="9"
                    className="text-surface-2"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="transparent"
                    stroke="var(--brand)"
                    strokeWidth="9"
                    strokeDasharray="301.59"
                    strokeDashoffset="16.59"
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-sans text-2xl font-bold text-fg tracking-tight tabular-nums">
                    3.78
                  </span>
                  <span className="font-sans text-xs text-fg-muted tabular-nums">
                    / 4.00
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-light border border-success/25 text-success font-sans text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dean&apos;s List</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-line flex items-center justify-between text-xs font-sans">
              <span className="text-fg-muted">Cohort Standing</span>
              <span className="text-brand font-semibold tabular-nums">
                Rank #6 (Top 4.2%)
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: DEGREE COMPLETION */}
        <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl p-5 transition-colors duration-150 flex flex-col justify-between">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg tracking-tight">
                Degree Completion
              </span>
              <Layers className="w-4 h-4 text-fg-muted" />
            </div>

            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-fg leading-none tabular-nums">
                  {degreeCompletionPct}%
                </span>
                <span className="font-sans text-xs text-success font-semibold bg-success-light px-2 py-0.5 rounded border border-success/20">
                  On Track
                </span>
              </div>
              <div className="font-sans text-xs text-fg-muted mt-2 tabular-nums">
                <span className="text-fg font-semibold">
                  {completedCredits} of {totalCredits} credits
                </span>{" "}
                fulfilled
              </div>

              <div className="w-full bg-surface-2 h-2.5 rounded-full mt-3 flex overflow-hidden p-0.5 border border-line">
                <div
                  className="bg-brand h-full rounded-l-full"
                  style={{ width: degreeCompletionWidth }}
                  title="Completed 96 Credits"
                />
                <div
                  className="bg-success h-full"
                  style={{ width: "10.4%" }}
                  title="Active 15 Credits"
                />
                <div
                  className="bg-line h-full rounded-r-full"
                  style={{ width: "22.9%" }}
                  title="Remaining 33 Credits"
                />
              </div>

              <div className="flex items-center gap-3 mt-2.5 text-xs font-sans text-fg-muted tabular-nums">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand" /> Done (96)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success" /> Active (15)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-fg-subtle" /> Left (33)
                </span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-line flex items-center justify-between text-xs font-sans">
              <span className="text-fg-muted">Target Graduation</span>
              <span className="text-fg font-semibold tabular-nums">
                33 credits left · Fall 2027
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: CREDIT DISTRIBUTION */}
        <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl p-5 transition-colors duration-150 flex flex-col justify-between">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg tracking-tight">
                Credit Distribution
              </span>
              <BookOpen className="w-4 h-4 text-fg-muted" />
            </div>

            <div className="space-y-2.5 py-1">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-fg font-medium">Major Core</span>
                  <span className="font-sans text-xs text-brand font-semibold tabular-nums">
                    60 / 90{" "}
                    <span className="text-fg-muted font-normal">
                      ({Math.round((60 / 90) * 100)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden border border-line">
                  <div className="bg-brand h-full rounded-full" style={{ width: "66.7%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-fg font-medium">General Electives</span>
                  <span className="font-sans text-xs text-info font-semibold tabular-nums">
                    20 / 30{" "}
                    <span className="text-fg-muted font-normal">
                      ({Math.round((20 / 30) * 100)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden border border-line">
                  <div className="bg-info h-full rounded-full" style={{ width: "66.7%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-fg font-medium">Math &amp; Science</span>
                  <span className="font-sans text-xs text-success font-semibold tabular-nums">
                    16 / 24{" "}
                    <span className="text-fg-muted font-normal">
                      ({Math.round((16 / 24) * 100)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden border border-line">
                  <div className="bg-success h-full rounded-full" style={{ width: "66.7%" }} />
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-line flex items-center justify-between text-xs font-sans">
              <span className="text-fg-muted">Audit Requirement</span>
              <span className="text-success font-semibold tabular-nums">
                100% Core Prereqs Met
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: CURRENT SEMESTER SGPA FORECAST */}
        <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl p-5 transition-colors duration-150 flex flex-col justify-between">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-fg tracking-tight">
                SGPA Forecast
              </span>
              <span className="font-sans text-xs bg-brand-soft text-brand border border-brand/20 px-2 py-0.5 rounded font-semibold tabular-nums">
                Est. Term 6
              </span>
            </div>

            <div className="py-2">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-3xl font-bold text-fg leading-none tabular-nums">
                  3.85
                </span>
                <span className="font-sans text-xs text-fg-muted">
                  est.
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-light border border-success/25 text-success font-sans text-xs font-semibold tabular-nums">
                  <TrendingUp className="w-3 h-3" />
                  +0.07 vs Fall 2025
                </span>
              </div>

              <p className="text-xs text-fg-muted mt-2 font-sans tabular-nums">
                5 active courses · 15.0 credits
              </p>
            </div>

            <div className="pt-2.5 border-t border-line flex items-center justify-between text-xs font-sans">
              <span className="text-fg-muted">Midterm Benchmark</span>
              <span className="text-brand font-semibold">
                All A/A+ range
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});
