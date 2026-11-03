"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { NoticeboardContent } from "../page";

export default function NoticeDetailPage() {
  const params = useParams();
  const noticeId = (params?.id as string) || "not-exam-108";

  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-slate-400 dark:text-[#8D96A0] font-mono text-sm">
          Loading UniCampus Noticeboard...
        </div>
      }
    >
      <NoticeboardContent initialNoticeId={noticeId} />
    </Suspense>
  );
}
