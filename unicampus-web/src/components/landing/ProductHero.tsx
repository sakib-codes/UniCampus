"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import {
  ACTIVE_TERM,
  CAMPUS_METRICS,
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
} from "@/lib/canonicalCampus";

export interface ProductHeroProps {
  onOpenDemoModal: () => void;
}

export default function ProductHero({ onOpenDemoModal }: ProductHeroProps) {
  const [activeTab, setActiveTab] = useState<string>("student");

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline & Positioning */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-fg leading-[1.12]">
            Where university operations feel calm, clear, and fast
          </h1>

          <p className="text-base sm:text-lg text-fg-muted leading-relaxed max-w-2xl mx-auto font-normal">
            A unified workspace connecting students, instructors, and university administration. Conflict-free timetables, dynamic QR attendance, grade management, and student services in one place.
          </p>

          {/* Action Cluster - Clean non-duplicate hierarchy */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Sign in to portal
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenDemoModal}
            >
              View live demo
            </Button>
          </div>
        </div>

        {/* Live Product Preview Frame */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          {/* Role Preview Controller */}
          <div className="flex justify-center mb-6">
            <Tabs
              tabs={[
                { id: "student", label: "Student" },
                { id: "faculty", label: "Faculty" },
                { id: "admin", label: "Admin" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              layoutId="hero-role-tabs"
              ariaLabel="Portal workspace preview"
              variant="segmented"
              size="sm"
            />
          </div>

          {/* Clean Browser Frame */}
          <div className="rounded-2xl bg-surface border border-line overflow-hidden">
            {/* Window Bar */}
            <div className="px-4 sm:px-5 py-3 border-b border-line bg-surface-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-line" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line" />
                  <span className="w-2.5 h-2.5 rounded-full bg-line" />
                </div>
                <span className="text-xs font-sans text-fg-muted ml-1 sm:ml-2 truncate">
                  unicampus.edu/{activeTab === "student" ? "dashboard" : activeTab === "faculty" ? "teacher/dashboard" : "admin/dashboard"}
                </span>
              </div>
              <span className="text-xs text-fg-muted font-medium shrink-0 hidden sm:inline">
                Live Preview
              </span>
            </div>

            {/* Preview Body */}
            <div className="p-4 sm:p-6 md:p-8 bg-canvas">
              {activeTab === "student" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface border border-line">
                    <div>
                      <span className="text-xs font-medium text-brand">Up next · Starts in 18 min</span>
                      <h3 className="text-lg font-semibold text-fg mt-0.5">
                        {CANONICAL_COURSES["CSE-3101"].title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1">
                        10:15 AM – 11:45 AM · Room 402 · {CANONICAL_FACULTY.name}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={onOpenDemoModal}>
                      Scan attendance
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-fg">Today&apos;s classes</span>
                        <span className="text-xs text-brand font-medium">Full routine</span>
                      </div>
                      <div className="divide-y divide-line text-xs">
                        <div className="py-2.5 flex justify-between items-center gap-2">
                          <div>
                            <p className="font-medium text-fg">
                              Algorithms · {CANONICAL_COURSES["CSE-3101"].code}
                            </p>
                            <p className="text-fg-muted">Room 402 · 10:15 AM</p>
                          </div>
                          <span className="text-brand font-medium shrink-0">Up next</span>
                        </div>
                        <div className="py-2.5 flex justify-between items-center gap-2">
                          <div>
                            <p className="font-medium text-fg">
                              {CANONICAL_COURSES["CSE-3103"].title} · {CANONICAL_COURSES["CSE-3103"].code}
                            </p>
                            <p className="text-fg-muted">Room 301 · 01:00 PM</p>
                          </div>
                          <span className="text-fg-muted shrink-0">Upcoming</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-fg">Recent notices</span>
                        <span className="text-xs text-brand font-medium">View all</span>
                      </div>
                      <div className="divide-y divide-line text-xs">
                        <div className="py-2.5">
                          <span className="text-warning font-medium">Urgent</span>
                          <p className="font-medium text-fg mt-0.5">
                            Final Examination Schedule ({ACTIVE_TERM}) released
                          </p>
                        </div>
                        <div className="py-2.5">
                          <span className="text-fg-muted">Academics</span>
                          <p className="font-medium text-fg mt-0.5">Course pre-registration window opens next Monday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "faculty" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-surface border border-line">
                    <div>
                      <span className="text-xs font-medium text-success">Class starts in 25 min</span>
                      <h3 className="text-lg font-semibold text-fg mt-0.5">
                        {CANONICAL_COURSES["CSE-3101"].code} · {CANONICAL_COURSES["CSE-3101"].title}
                      </h3>
                      <p className="text-xs text-fg-muted mt-1">
                        Room 402 · Section A · 45 enrolled students · Office: {CANONICAL_FACULTY.office}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={onOpenDemoModal}>
                      Launch attendance QR
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Assigned students</p>
                      <p className="text-2xl font-semibold text-fg mt-1 tabular-nums">129</p>
                      <p className="text-xs text-success mt-0.5">
                        {CANONICAL_FACULTY.courses.join(", ")}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Average attendance</p>
                      <p className="text-2xl font-semibold text-fg mt-1 tabular-nums">89.0%</p>
                      <p className="text-xs text-success mt-0.5">+3.2% vs dept avg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Pending grading</p>
                      <p className="text-2xl font-semibold text-fg mt-1">2 tasks</p>
                      <p className="text-xs text-warning mt-0.5">Quiz 2 &amp; Lab 4</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "admin" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Total students</p>
                      <p className="text-xl font-semibold text-fg mt-1 tabular-nums">
                        {CAMPUS_METRICS.students.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-success mt-0.5">+6.4% enrollment</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Active faculty</p>
                      <p className="text-xl font-semibold text-fg mt-1 tabular-nums">
                        {CAMPUS_METRICS.faculty.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {CAMPUS_METRICS.departmentsCount} departments
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Portal users</p>
                      <p className="text-xl font-semibold text-fg mt-1 tabular-nums">
                        {CAMPUS_METRICS.totalUsers.toLocaleString("en-US")}
                      </p>
                      <p className="text-xs text-success mt-0.5">
                        {CAMPUS_METRICS.admins} admins • {ACTIVE_TERM}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface border border-line">
                      <p className="text-xs text-fg-muted">Tuition collected</p>
                      <p className="text-xl font-semibold text-fg mt-1 tabular-nums">৳143,500</p>
                      <p className="text-xs text-success mt-0.5">
                        {ACTIVE_TERM} ledger
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-fg">User approvals &amp; governance</h4>
                      <p className="text-xs text-fg-muted mt-0.5">5 student &amp; faculty accounts awaiting credential verification</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={onOpenDemoModal}>
                      Review queue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
