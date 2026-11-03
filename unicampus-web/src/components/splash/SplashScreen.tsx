"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { themeTokens } from "@/lib/theme";

interface SplashScreenProps {
  autoRedirect?: boolean;
}

export function SplashScreen({ autoRedirect = false }: SplashScreenProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Connecting to campus cloud...");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText("Authenticating digital token...");
    }, 150);

    const timer2 = setTimeout(() => {
      setProgress(88);
      setStatusText("Syncing campus database...");
    }, 350);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("System ready. Launching portal...");
    }, 600);

    let redirectTimer: NodeJS.Timeout;
    if (autoRedirect) {
      redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 850);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [autoRedirect, router]);

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between items-center py-8 px-4 ${themeTokens.canvas}`}>
      {/* Top spacer for optical centering */}
      <div className="h-6"></div>

      {/* Floating Center Splash Card */}
      <div className={`w-full max-w-[460px] ${themeTokens.surface} rounded-[44px] md:rounded-[52px] p-10 md:p-14 shadow-2xl shadow-indigo-200/50 dark:shadow-black/70 border ${themeTokens.border} flex flex-col items-center text-center my-auto transition-all`}>
        {/* Brand Icon Squircle */}
        <div className="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-[#1D5BD8] to-[#7E7AFF] flex items-center justify-center shadow-lg shadow-indigo-300/40 mb-8 transform hover:scale-105 transition-transform">
          <span className="text-5xl font-black text-white leading-none">
            U
          </span>
        </div>

        {/* Brand Name */}
        <h1 className={`text-3xl md:text-4xl font-black ${themeTokens.heading} mb-2`}>
          UniCampus
        </h1>

        {/* Subtitle */}
        <p className={`text-xs uppercase font-extrabold tracking-[0.25em] ${themeTokens.textMuted} mb-10`}>
          Premium Portal
        </p>

        {/* Progress Bar Container */}
        <div className="w-full space-y-3">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Portal loading progress"
            className={`w-full ${themeTokens.subtle} h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-[#30363D]/50`}
          >
            <div
              className="bg-brand h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold px-0.5">
            <span aria-live="polite" className="text-brand font-bold transition-all">
              {statusText}
            </span>
            <span className={`font-black ${themeTokens.textPrimary}`}>
              {progress}%
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-bold text-slate-500 hover:text-brand dark:text-[#8D96A0] transition-colors rounded-xl focus-visible:ring-2 focus-visible:ring-brand focus:outline-none cursor-pointer"
            >
              Skip to Portal &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`text-xs font-medium ${themeTokens.textMuted} text-center pb-2`}>
        &copy; 2026 UniCampus Systems Inc. All rights reserved.
      </footer>
    </div>
  );
}
