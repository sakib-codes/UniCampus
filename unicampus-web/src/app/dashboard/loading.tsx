import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 pb-6">
      {/* Welcome banner skeleton */}
      <Skeleton variant="rect" className="w-full h-36 rounded-[20px]" />

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rect" className="h-28 rounded-[20px]" />
        ))}
      </div>

      {/* Main dual-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton variant="rect" className="w-full h-64 rounded-[20px]" />
          <Skeleton variant="rect" className="w-full h-48 rounded-[20px]" />
        </div>
        <div className="space-y-4">
          <Skeleton variant="rect" className="w-full h-56 rounded-[20px]" />
          <Skeleton variant="rect" className="w-full h-56 rounded-[20px]" />
        </div>
      </div>
    </div>
  );
}

