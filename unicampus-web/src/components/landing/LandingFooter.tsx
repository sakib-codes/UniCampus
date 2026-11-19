"use client";

import React from "react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
                U
              </div>
              <span className="font-semibold text-lg text-fg tracking-tight">UniCampus</span>
            </div>
            <p className="text-xs text-fg-muted leading-relaxed">
              Campus portal for class routines, lecture attendance, gradebooks, and department administration.
            </p>
            <p className="text-xs text-fg-subtle">
              © {new Date().getFullYear()} UniCampus. All rights reserved.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold text-fg">Platform</p>
            <ul className="space-y-1 text-fg-muted">
              <li>
                <a href="#features" className="inline-block py-1 hover:text-fg transition-colors">Core Features</a>
              </li>
              <li>
                <a href="#portals" className="inline-block py-1 hover:text-fg transition-colors">Portals Overview</a>
              </li>
              <li>
                <Link href="/login" className="inline-block py-1 hover:text-fg transition-colors">Portal Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="inline-block py-1 hover:text-fg transition-colors">Request Account</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Workspaces */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold text-fg">Workspaces</p>
            <ul className="space-y-1 text-fg-muted">
              <li>
                <Link href="/dashboard" className="inline-block py-1 hover:text-fg transition-colors">Student Workspace</Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="inline-block py-1 hover:text-fg transition-colors">Faculty Command Center</Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="inline-block py-1 hover:text-fg transition-colors">Administration Suite</Link>
              </li>
              <li>
                <Link href="/routine" className="inline-block py-1 hover:text-fg transition-colors">Campus Routine</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Security */}
          <div className="space-y-3 text-xs">
            <p className="font-semibold text-fg">Support & Privacy</p>
            <ul className="space-y-2 text-fg-muted">
              <li>
                <span className="text-fg-subtle">Role-based Access Control</span>
              </li>
              <li>
                <span className="text-fg-subtle">Institutional Compliance</span>
              </li>
              <li>
                <span className="text-fg-subtle">Student Data Privacy</span>
              </li>
              <li>
                <span className="text-fg-subtle">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
