import { Suspense } from "react";
import { NoticeboardContent } from "@/components/notices";

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-fg-muted font-sans text-sm">
          Loading UniCampus Noticeboard...
        </div>
      }
    >
      <NoticeboardContent />
    </Suspense>
  );
}
