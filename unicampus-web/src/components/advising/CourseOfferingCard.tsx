"use client";

import React from "react";
import { 
  Plus, 
  X, 
  AlertCircle, 
  Clock, 
  MapPin, 
  CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AdvisingCourse } from "./advisingData";

interface CourseOfferingCardProps {
  course: AdvisingCourse;
  isSelected: boolean;
  selectedSectionId?: string;
  onSelectSection: (courseCode: string, sectionId: string) => void;
  onToggleAdd: (courseCode: string, defaultSectionId: string) => void;
  disabled?: boolean;
}

export function CourseOfferingCard({
  course,
  isSelected,
  selectedSectionId,
  onSelectSection,
  onToggleAdd,
  disabled = false,
}: CourseOfferingCardProps) {
  const activeSectionId =
    selectedSectionId || (course.sections[0] ? course.sections[0].id : "");

  return (
    <div
      className={`rounded-2xl bg-surface border transition-colors duration-150 p-5 space-y-4 ${
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-xs"
          : "border-line hover:border-brand/40"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-2.5 py-0.5 rounded-md">
              {course.code}
            </span>
            <Badge variant={course.type === "Lab" ? "neutral" : "brand"}>
              {course.credits.toFixed(1)} Credits • {course.type}
            </Badge>
            <span className="text-xs text-fg-muted font-medium">
              {course.category}
            </span>
          </div>

          <h3 className="text-base font-semibold text-fg tracking-tight">
            {course.title}
          </h3>
          <p className="text-xs text-fg-muted line-clamp-2 font-sans">
            {course.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-0.5">
          {isSelected ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onToggleAdd(course.code, activeSectionId)}
              disabled={disabled}
              className="text-danger hover:bg-danger-light hover:border-danger/30 text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onToggleAdd(course.code, activeSectionId)}
              disabled={disabled || !course.prereqMet}
              className="text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Plan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Prerequisite & Validation Strip */}
      <div className="flex items-center gap-2 text-xs">
        {course.prerequisites.length === 0 ? (
          <span className="inline-flex items-center gap-1.5 text-fg-muted font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>No prerequisites required</span>
          </span>
        ) : course.prereqMet ? (
          <span className="inline-flex items-center gap-1.5 text-success font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              Prerequisite cleared: {course.prerequisites.join(", ")}
              {course.prereqGrade && ` (Grade: ${course.prereqGrade})`}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-danger font-medium bg-danger-light px-2.5 py-1 rounded-lg border border-danger/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              Prerequisite missing: {course.prerequisites.join(", ")} required
            </span>
          </span>
        )}
      </div>

      {/* Sections Available */}
      <div className="space-y-2 pt-1 border-t border-line">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Available Sections &amp; Timetable
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {course.sections.map((section) => {
            const isSectionActive = isSelected && selectedSectionId === section.id;
            const isSeatsFull = section.enrolledSeats >= section.totalSeats;

            return (
              <button
                key={section.id}
                type="button"
                disabled={disabled || isSeatsFull}
                onClick={() => onSelectSection(course.code, section.id)}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer relative ${
                  isSectionActive
                    ? "bg-brand-soft border-brand text-brand ring-1 ring-brand/30"
                    : isSeatsFull
                    ? "bg-canvas border-line text-fg-subtle opacity-60 cursor-not-allowed"
                    : "bg-surface-2 border-line text-fg hover:border-brand/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{section.sectionName}</span>
                  <span
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                      isSeatsFull
                        ? "bg-danger-light text-danger"
                        : "bg-canvas text-fg-muted border border-line"
                    }`}
                  >
                    {section.enrolledSeats}/{section.totalSeats} seats
                  </span>
                </div>

                <div className="space-y-1 text-xs font-sans text-fg-muted">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {section.days.join(", ")} • {section.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {section.room} • {section.instructor}
                    </span>
                  </div>
                </div>

                {isSectionActive && (
                  <span className="absolute top-2.5 right-2 w-2 h-2 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
