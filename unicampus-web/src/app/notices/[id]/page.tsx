"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { NoticeboardContent } from "@/components/notices";

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = (params?.id as string) || "not-exam-108";

  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-fg-muted font-sans text-sm">
          Loading UniCampus Noticeboard...
        </div>
      }
    >
      <NoticeboardContent initialNoticeId={noticeId} />
    </Suspense>
  );
}
