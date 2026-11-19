import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="w-full space-y-6 pb-6">
      {/* Admin header */}
      <div className="p-5 rounded-[20px] bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="text" className="w-64 h-7" />
          <Skeleton variant="text" className="w-80 h-4" />
        </div>
        <Skeleton variant="rect" className="w-32 h-10 rounded-xl" />
      </div>

      {/* Admin KPI stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rect" className="h-28 rounded-[20px]" />
        ))}
      </div>

      {/* Main admin table / ledger */}
      <div className="rounded-[20px] bg-surface border border-line p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <Skeleton variant="text" className="w-40 h-5" />
          <Skeleton variant="rect" className="w-48 h-9 rounded-xl" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 6].map((i) => (
            <Skeleton key={i} variant="rect" className="w-full h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

