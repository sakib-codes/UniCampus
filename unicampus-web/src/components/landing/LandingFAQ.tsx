"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the dynamic QR attendance prevent proxy attendance?",
      a: "The attendance QR code rotates cryptographically every 15 seconds. Students must scan the live active code from their personal verified session, ensuring physical classroom presence.",
    },
    {
      q: "Can department administrators manage curriculums independently?",
      a: "Yes. Department heads and admins have dedicated scoped access to manage their semester course allocations, instructor assignments, and departmental circulars.",
    },
    {
      q: "How are timetable conflicts detected and resolved?",
      a: "The routine builder automatically checks for room double-bookings and instructor schedule collisions in real time, alerting coordinators before routine publication.",
    },
    {
      q: "Is there offline support for mobile users?",
      a: "Yes. The companion UniCampus Flutter mobile application caches weekly routine timetables and recent notices locally so students can check their classrooms even without connectivity.",
    },
    {
      q: "How do demo logins work?",
      a: "You can click 'Try the demo' anytime to instantly jump into the Student, Faculty, or Admin workspace with pre-populated academic datasets. No signup or password required.",
    },
  ];

  return (
    <section className="py-20 border-t border-line bg-surface/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-brand">Frequently Asked Questions</span>
          <h2 className="text-3xl font-semibold text-fg tracking-tight">
            Everything you need to know
          </h2>
          <p className="text-sm text-fg-muted">
            Common questions about the UniCampus academic management platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Card key={i} padding="none" className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[52px] p-5 flex items-center justify-between text-left font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-fg-muted transition-transform shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-brand" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-fg-muted leading-relaxed border-t border-line/60">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

