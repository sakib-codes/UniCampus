"use client";

import React from "react";
import { Smartphone, QrCode, Bell, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function MobileTeaser() {
  const highlights = [
    { icon: QrCode, text: "Scan classroom attendance QR codes directly from your phone" },
    { icon: Bell, text: "Push notifications for department and exam notices" },
    { icon: WifiOff, text: "Cached weekly class routines available offline" },
  ];

  return (
    <section className="py-20 border-t border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card padding="lg" className="bg-gradient-to-br from-surface via-surface to-brand-soft/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-semibold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Companion Mobile Apps</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
                Also available on Android & iOS
              </h2>
              <p className="text-sm sm:text-base text-fg-muted max-w-xl">
                Access your class routine, attendance scanner, and campus notices on Android and iOS with biometric sign-in, offline schedule caching, and dark mode.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div key={i} className="p-3.5 rounded-xl bg-surface border border-line flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-brand shrink-0" />
                      <span className="text-xs text-fg font-medium">{h.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 max-w-full h-80 rounded-2xl border-4 border-line bg-surface p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-sans tabular-nums text-fg-muted">9:41</span>
                  <div className="w-12 h-3 rounded-full bg-line" />
                  <span className="text-xs text-fg-muted font-medium">5G</span>
                </div>
                <div className="space-y-2 py-4">
                  <div className="h-6 w-3/4 rounded bg-brand-soft" />
                  <div className="h-16 rounded-xl bg-surface-2 border border-line p-2">
                    <div className="h-3 w-1/2 rounded bg-brand/30" />
                    <div className="h-2 w-3/4 rounded bg-line mt-2" />
                  </div>
                  <div className="h-16 rounded-xl bg-surface-2 border border-line p-2">
                    <div className="h-3 w-1/2 rounded bg-success/30" />
                    <div className="h-2 w-3/4 rounded bg-line mt-2" />
                  </div>
                </div>
                <div className="h-8 rounded-xl bg-brand flex items-center justify-center text-on-brand text-xs font-semibold">
                  UniCampus Mobile
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
