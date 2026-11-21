import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { NoticeboardContent } from "@/components/notices/NoticeboardContent";

export { NoticeboardContent };

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex flex-col bg-canvas">
          <div className="h-14 px-6 bg-surface border-b border-line flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-9 w-72" />
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[380px] h-full bg-surface border-r border-line p-4 space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex-1 p-8 space-y-6">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      }
    >
      <NoticeboardContent />
    </Suspense>
  );
}
