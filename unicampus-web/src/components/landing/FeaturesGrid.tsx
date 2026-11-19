"use client";

import React from "react";
import { Calendar, QrCode, Megaphone, GraduationCap, MessageSquare, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function FeaturesGrid() {
  const features = [
    {
      icon: Calendar,
      title: "Timetable & Routine Matrix",
      description: "Daily and weekly schedules with room allocations, lab hours, and schedule updates.",
    },
    {
      icon: QrCode,
      title: "Verified Lecture Attendance",
      description: "Live QR code check-ins and numeric backup codes synchronized with classroom rosters.",
    },
    {
      icon: Megaphone,
      title: "Official Noticeboard",
      description: "Institutional circulars, exam schedules, and department notices with PDF downloads.",
    },
    {
      icon: GraduationCap,
      title: "Academic Gradebook",
      description: "Credit auditing, semester grade entries, cohort standing, and transcript generation.",
    },
    {
      icon: MessageSquare,
      title: "Direct Campus Communication",
      description: "Dedicated channels between students, course advisors, and department peers.",
    },
    {
      icon: CreditCard,
      title: "Finance & Fee Clearance",
      description: "Tuition collection records, online payment receipts, and department payment tracking.",
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-line bg-surface/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-semibold text-brand">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            Core tools for daily campus operations
          </h2>
          <p className="text-sm sm:text-base text-fg-muted">
            Conflict-free scheduling, verified attendance, and transparent academic administration across departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} padding="lg" className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-fg">{feature.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

