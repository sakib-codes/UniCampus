"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
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
        <button
          type="button"
          onClick={() => handleSelectRole("student")}
          className="w-full text-left rounded-2xl bg-surface border border-line p-5 sm:p-6 flex items-center justify-between group cursor-pointer transition-colors duration-150 hover:border-brand/50 hover:bg-brand-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-brand group-hover:translate-x-0.5 transition-transform duration-150 motion-reduce:group-hover:translate-x-0 shrink-0 ml-2" />
        </button>

        {/* Faculty Option */}
        <button
          type="button"
          onClick={() => handleSelectRole("faculty")}
          className="w-full text-left rounded-2xl bg-surface border border-line p-5 sm:p-6 flex items-center justify-between group cursor-pointer transition-colors duration-150 hover:border-success/50 hover:bg-success-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-fg text-sm group-hover:text-success transition-colors">
                Faculty Command Center
              </h4>
              <p className="text-xs text-fg-muted mt-0.5">
                Dynamic QR attendance, gradebook submission, schedule & inquiries
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-success group-hover:translate-x-0.5 transition-transform duration-150 motion-reduce:group-hover:translate-x-0 shrink-0 ml-2" />
        </button>

        {/* Admin Option */}
        <button
          type="button"
          onClick={() => handleSelectRole("admin")}
          className="w-full text-left rounded-2xl bg-surface border border-line p-5 sm:p-6 flex items-center justify-between group cursor-pointer transition-colors duration-150 hover:border-warning/50 hover:bg-warning-light/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-warning-light text-warning flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-fg text-sm group-hover:text-warning transition-colors">
                University Administration
              </h4>
              <p className="text-xs text-fg-muted mt-0.5">
                Executive dashboard, user approvals, master routine & treasury
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-warning group-hover:translate-x-0.5 transition-transform duration-150 motion-reduce:group-hover:translate-x-0 shrink-0 ml-2" />
        </button>
      </div>
    </Modal>
  );
}

