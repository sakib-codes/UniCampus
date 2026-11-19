import React from "react";
import { GraduationCap, Building2, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface PersonaShowcaseProps {
  onOpenDemoModal?: () => void;
}

export default function PersonaShowcase({ onOpenDemoModal }: PersonaShowcaseProps) {
  const personas = [
    {
      id: "student",
      title: "Student Experience",
      tagline: "Academic clarity from day one to graduation",
      description:
        "Stay informed about your schedule, verify lecture attendance, and track degree progress in one clear interface.",
      icon: GraduationCap,
      benefits: [
        "Personalized daily timetable and schedule updates",
        "Fast attendance verification via rolling QR codes",
        "Progress tracking with semester CGPA projections",
      ],
      action: "Explore student workspace",
    },
    {
      id: "faculty",
      title: "Faculty Workspace",
      tagline: "Streamlined teaching operations and academic records",
      description:
        "Focus on teaching with automated attendance rosters, fast grade submission, and direct course resource distribution.",
      icon: Building2,
      benefits: [
        "Live attendance session manager with proxy protection",
        "Spreadsheet-style marks entry with grade calculations",
        "Integrated course material repository and student messaging",
      ],
      action: "Explore faculty console",
    },
    {
      id: "admin",
      title: "Campus Administration",
      tagline: "Institutional governance and department oversight",
      description:
        "Comprehensive visibility across enrollment numbers, department accounts, fee clearances, and master room schedules.",
      icon: ShieldCheck,
      benefits: [
        "Conflict-free timetable scheduling across rooms and slots",
        "Centralized student fee clearance and transaction ledger",
        "Role-based account approvals and academic department directory",
      ],
      action: "Explore admin console",
    },
  ];

  return (
    <section id="portals" className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span className="text-xs font-semibold text-brand">One Platform, Three Portals</span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
          Tailored workspaces for every campus stakeholder
        </h2>
        <p className="text-sm sm:text-base text-fg-muted">
          Eliminating administrative silos with dedicated workflows designed specifically for learners, instructors, and executive staff.
        </p>
      </div>

      {/* 3-Column Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const Icon = persona.icon;
          return (
            <Card
              key={persona.id}
              padding="lg"
              className="flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-fg">{persona.title}</h3>
                    <p className="text-xs text-fg-muted">{persona.tagline}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                  {persona.description}
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-fg pt-1">
                  {persona.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={onOpenDemoModal}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  {persona.action}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
