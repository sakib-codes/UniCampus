import { Skeleton } from "@/components/ui/Skeleton";

export default function TeacherLoading() {
  return (
    <div className="w-full space-y-6 pb-6">
      {/* Teacher page header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-line">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-36 h-5" />
          <Skeleton variant="text" className="w-64 h-7" />
          <Skeleton variant="text" className="w-48 h-4" />
        </div>
        <Skeleton variant="rect" className="w-36 h-10 rounded-xl" />
      </div>

      {/* Roster / Matrix table skeleton */}
      <div className="rounded-2xl bg-surface border border-line p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <Skeleton variant="text" className="w-48 h-5" />
          <Skeleton variant="rect" className="w-24 h-8 rounded-lg" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rect" className="w-full h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

