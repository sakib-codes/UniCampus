import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-48 h-7" />
          <Skeleton variant="text" className="w-72 h-4" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-9 h-9" />
          <Skeleton variant="circle" className="w-9 h-9" />
        </div>
      </div>

      {/* Hero / banner skeleton */}
      <Skeleton variant="rect" className="w-full h-36 rounded-2xl" />

      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rect" className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <Skeleton variant="rect" className="lg:col-span-2 h-80 rounded-2xl" />
        <Skeleton variant="rect" className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

