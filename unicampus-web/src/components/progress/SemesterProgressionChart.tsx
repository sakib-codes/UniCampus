"use client";

import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { semesterMilestones, type SemesterMilestone } from "./progressData";

interface SemesterProgressionChartProps {
  onSelectSemester: (semesterId: string) => void;
}

const CHART_BARS = [
  { milestone: semesterMilestones[0], hitX: 48, hitW: 154, barX: 76, barY: 103, barH: 112, cx: 100, labelY: 96, cy: 103 },
  { milestone: semesterMilestones[1], hitX: 202, hitW: 204, barX: 280, barY: 89, barH: 126, cx: 304, labelY: 82, cy: 96 },
  { milestone: semesterMilestones[2], hitX: 406, hitW: 204, barX: 484, barY: 93, barH: 122, cx: 508, labelY: 86, cy: 94 },
  { milestone: semesterMilestones[3], hitX: 610, hitW: 204, barX: 688, barY: 69, barH: 146, cx: 712, labelY: 62, cy: 87 },
  { milestone: semesterMilestones[4], hitX: 814, hitW: 204, barX: 892, barY: 64, barH: 151, cx: 916, labelY: 57, cy: 75 },
  { milestone: semesterMilestones[5], hitX: 1018, hitW: 157, barX: 1096, barY: 62, barH: 153, cx: 1120, labelY: 55, cy: 71 },
];

export const SemesterProgressionChart = memo(function SemesterProgressionChart({
  onSelectSemester,
}: SemesterProgressionChartProps) {
  const [hoveredChartNode, setHoveredChartNode] = useState<SemesterMilestone | null>(null);

  return (
    <div className="w-full">
      <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl p-5 md:p-6 relative transition-colors duration-150">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-fg">
                SGPA vs. Cumulative CGPA Trajectory
              </h2>
              <p className="text-xs text-fg-muted mt-0.5">
                Hover or click on any semester bar to inspect specific term SGPA and cumulative CGPA curve.
              </p>
            </div>

            <div className="flex items-center gap-3.5 font-sans text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-surface-2 border-t-2 border-brand" />
                <span className="text-fg-muted">SGPA Bars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-brand inline-block rounded-full" />
                <span className="text-fg font-medium">Cumulative CGPA Spline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t border-dashed border-success inline-block" />
                <span className="text-success font-medium">Projected</span>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar">
            <div
              className="w-full min-w-[720px] aspect-[1200/270] relative"
              onMouseLeave={() => setHoveredChartNode(null)}
            >
              <svg
                className="w-full h-full block select-none"
                viewBox="0 0 1200 270"
                preserveAspectRatio="xMidYMid meet"
                onMouseLeave={() => setHoveredChartNode(null)}
              >
                <defs>
                  <linearGradient id="chartIndigoGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[
                  { y: 35, label: "4.00", dashed: true },
                  { y: 80, label: "3.75", dashed: true },
                  { y: 125, label: "3.50", dashed: true },
                  { y: 170, label: "3.25", dashed: true },
                  { y: 215, label: "3.00", dashed: false },
                ].map((grid) => (
                  <g key={grid.label}>
                    <line
                      x1="48"
                      y1={grid.y}
                      x2="1175"
                      y2={grid.y}
                      stroke="currentColor"
                      strokeDasharray={grid.dashed ? "3 3" : undefined}
                      strokeWidth="1"
                      className="text-line"
                    />
                    <text
                      x="38"
                      y={grid.y + 4}
                      textAnchor="end"
                      fill="currentColor"
                      fontSize="11"
                      className="text-fg-muted font-sans tabular-nums"
                    >
                      {grid.label}
                    </text>
                  </g>
                ))}

                {CHART_BARS.map(({ milestone, hitX, hitW, barX, barY, barH, cx, labelY }) => {
                  const isHovered = hoveredChartNode?.id === milestone.id;
                  const isProjected = Boolean(milestone.isProjected);

                  return (
                    <g
                      key={milestone.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${milestone.termName}: SGPA ${milestone.sgpa.toFixed(2)}`}
                      className="cursor-pointer group focus-visible:outline-none"
                      onMouseEnter={() => setHoveredChartNode(milestone)}
                      onFocus={() => setHoveredChartNode(milestone)}
                      onBlur={() => setHoveredChartNode(null)}
                      onClick={() => {
                        setHoveredChartNode(milestone);
                        onSelectSemester(milestone.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setHoveredChartNode(milestone);
                          onSelectSemester(milestone.id);
                        }
                      }}
                    >
                      <rect x={hitX} y="20" width={hitW} height="235" fill="transparent" />
                      {isProjected ? (
                        <>
                          <rect
                            x={barX}
                            y={barY}
                            width="48"
                            height={barH}
                            rx="4"
                            stroke="var(--success)"
                            strokeDasharray={isHovered ? undefined : "4 3"}
                            strokeWidth={isHovered ? "2" : "1.5"}
                            className={`transition-opacity duration-150 ${
                              isHovered ? "fill-success-light" : "fill-surface-2"
                            }`}
                          />
                          <rect x={barX} y={barY} width="48" height="4" rx="2" fill="var(--success)" />
                          <text
                            x={cx}
                            y={labelY}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="var(--success)"
                            className="font-sans tabular-nums"
                          >
                            {milestone.sgpa.toFixed(2)}*
                          </text>
                        </>
                      ) : (
                        <>
                          <rect
                            x={barX}
                            y={barY}
                            width="48"
                            height={barH}
                            rx="4"
                            className={`transition-opacity duration-150 ${
                              isHovered
                                ? "fill-brand-soft stroke-brand stroke-[2]"
                                : "fill-surface-2 stroke-line group-hover:stroke-brand"
                            }`}
                          />
                          <rect x={barX} y={barY} width="48" height="4" rx="2" fill="var(--brand)" />
                          <text
                            x={cx}
                            y={labelY}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight={isHovered ? "700" : "600"}
                            className="fill-brand font-sans tabular-nums"
                          >
                            {milestone.sgpa.toFixed(2)}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                <path
                  d="M 100 103 
                     C 202 103, 202 96, 304 96 
                     C 406 96, 406 94, 508 94 
                     C 610 94, 610 87, 712 87 
                     C 814 87, 814 75, 916 75 
                     L 916 215 L 100 215 Z"
                  fill="url(#chartIndigoGlow)"
                />

                <path
                  d="M 100 103 
                     C 202 103, 202 96, 304 96 
                     C 406 96, 406 94, 508 94 
                     C 610 94, 610 87, 712 87 
                     C 814 87, 814 75, 916 75"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M 916 75 C 1018 75, 1018 71, 1120 71"
                  fill="none"
                  stroke="var(--brand)"
                  strokeDasharray="5 4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {CHART_BARS.map(({ milestone, cx, cy }) => {
                  const isHovered = hoveredChartNode?.id === milestone.id;
                  const isProjected = Boolean(milestone.isProjected);
                  const accent = isProjected ? "var(--success)" : "var(--brand)";

                  return (
                    <circle
                      key={`pt-${milestone.id}`}
                      cx={cx}
                      cy={cy}
                      r={isHovered ? "6.5" : "4.5"}
                      fill={isHovered ? accent : "var(--surface)"}
                      stroke={isHovered ? "var(--surface)" : accent}
                      strokeWidth={isHovered ? "2.5" : "2"}
                      className="transition-opacity duration-150"
                    />
                  );
                })}

                {CHART_BARS.map(({ milestone, cx }) => {
                  const isHovered = hoveredChartNode?.id === milestone.id;
                  const isProjected = Boolean(milestone.isProjected);
                  return (
                    <text
                      key={`x-${milestone.id}`}
                      x={cx}
                      y="246"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight={isHovered ? "700" : "500"}
                      className={
                        isHovered
                          ? isProjected
                            ? "fill-success font-sans"
                            : "fill-brand font-sans"
                          : "fill-fg-muted font-sans"
                      }
                    >
                      {milestone.termShort}
                    </text>
                  );
                })}
              </svg>

              <AnimatePresence>
                {hoveredChartNode && (
                  <motion.div
                    key={hoveredChartNode.id}
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-2 bg-surface/95 border border-brand/40 rounded-xl p-3 shadow-lg text-left z-20 pointer-events-none"
                    style={{
                      left:
                        hoveredChartNode.id === "sem-1"
                          ? "8.33%"
                          : hoveredChartNode.id === "sem-2"
                          ? "25.33%"
                          : hoveredChartNode.id === "sem-3"
                          ? "42.33%"
                          : hoveredChartNode.id === "sem-4"
                          ? "59.33%"
                          : hoveredChartNode.id === "sem-5"
                          ? "76.33%"
                          : "93.33%",
                      transform:
                        hoveredChartNode.id === "sem-1"
                          ? "translateX(-20%)"
                          : hoveredChartNode.id === "sem-6"
                          ? "translateX(-85%)"
                          : "translateX(-50%)",
                    }}
                  >
                    <div className="flex items-center gap-2 pb-1.5 border-b border-line">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs font-semibold text-fg whitespace-nowrap">
                        {hoveredChartNode.termName}
                      </span>
                      {hoveredChartNode.honorBadge && (
                        <span className="font-sans text-xs bg-success-light text-success px-1.5 py-0.5 rounded border border-success/20 font-semibold ml-auto whitespace-nowrap">
                          {hoveredChartNode.honorBadge}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 font-sans text-xs tabular-nums">
                      <div>
                        <span className="text-fg-muted">Term SGPA:</span>
                        <span className="text-brand font-semibold ml-1.5">
                          {hoveredChartNode.sgpa.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-muted">Cumulative:</span>
                        <span className="text-fg font-semibold ml-1.5">
                          {hoveredChartNode.cgpa.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-muted">Credits:</span>
                        <span className="text-fg ml-1.5 font-semibold">
                          {hoveredChartNode.credits.toFixed(1)} Cr
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-muted">Standing:</span>
                        <span className="text-success ml-1.5 font-semibold">
                          {hoveredChartNode.ranking}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-2.5 h-2.5 bg-surface border-r border-b border-brand/40 rotate-45 absolute -bottom-1.5"
                      style={{
                        left:
                          hoveredChartNode.id === "sem-1"
                            ? "25%"
                            : hoveredChartNode.id === "sem-6"
                            ? "85%"
                            : "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
