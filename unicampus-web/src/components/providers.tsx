"use client";

import { ThemeProvider } from "next-themes";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

// Suppress known React 19 / Next.js 16 false-positive warning 
// caused by next-themes injecting an inline script to prevent dark/light theme flickering.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
