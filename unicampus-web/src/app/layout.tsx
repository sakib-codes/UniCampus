import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UniCampus",
    template: "%s · UniCampus",
  },
  description:
    "Unified academic workspace for students, faculty, and university administrators — routine, attendance, grades, notices, and campus communication.",
  openGraph: {
    title: "UniCampus",
    description:
      "Unified academic workspace for students, faculty, and university administrators.",
    type: "website",
    siteName: "UniCampus",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var search = window.location.search;
                if (search.indexOf('theme=dark') !== -1) {
                  localStorage.setItem('theme', 'dark');
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else if (search.indexOf('theme=light') !== -1) {
                  localStorage.setItem('theme', 'light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-fg antialiased selection:bg-brand selection:text-on-brand">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
