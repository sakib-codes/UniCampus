import { Suspense } from "react";
import { NoticeboardContent } from "@/components/notices/NoticeboardContent";

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-slate-400 dark:text-fg-muted font-mono text-sm">
          Loading UniCampus Noticeboard...
        </div>
      }
    >
      <NoticeboardContent />
    </Suspense>
  );
}
