"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { useAdminAuth } from "@/context/AdminAuthContext";

export interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  const router = useRouter();
  const { loginAsStudent, loginAsFaculty, loginAsAdmin } = useAdminAuth();

  const handleSelectRole = (role: "student" | "faculty" | "admin") => {
    onClose();
    if (role === "student") {
      loginAsStudent();
      router.push("/dashboard");
    } else if (role === "faculty") {
      loginAsFaculty();
      router.push("/teacher/dashboard");
    } else {
      loginAsAdmin();
      router.push("/admin/dashboard");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Experience UniCampus"
      description="Choose a role to test the live workspace. No credentials required."
      size="md"
    >
      <div className="space-y-3 py-1">
        {/* Student Option */}
        <Card
          interactive
          padding="md"
          onClick={() => handleSelectRole("student")}
          className="flex items-center justify-between group cursor-pointer transition-all hover:border-brand/50 hover:bg-brand-soft/20"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-fg text-sm group-hover:text-brand transition-colors">
                Student Workspace
              </h4>
              <p className="text-xs text-fg-muted mt-0.5">
                Class routine, attendance scanner, degree progress & peer messaging
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </Card>

        {/* Faculty Option */}
        <Card
          interactive
          padding="md"
          onClick={() => handleSelectRole("faculty")}
          className="flex items-center justify-between group cursor-pointer transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-fg text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Faculty Command Center
              </h4>
              <p className="text-xs text-fg-muted mt-0.5">
                Dynamic QR attendance, gradebook submission, schedule & inquiries
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </Card>

        {/* Admin Option */}
        <Card
          interactive
          padding="md"
          onClick={() => handleSelectRole("admin")}
          className="flex items-center justify-between group cursor-pointer transition-all hover:border-amber-500/50 hover:bg-amber-500/5"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-fg text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                University Administration
              </h4>
              <p className="text-xs text-fg-muted mt-0.5">
                Executive dashboard, user approvals, master routine & treasury
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </Card>
      </div>
    </Modal>
  );
}

