import { Skeleton } from "@/components/ui/Skeleton";

export default function MessagesLoading() {
  return (
    <div className="h-full w-full flex min-h-0 bg-surface rounded-2xl border border-line overflow-hidden">
      {/* Left panel skeleton */}
      <div className="w-full md:w-[min(20rem,100%)] lg:w-[min(24rem,100%)] max-w-full border-r border-line p-3.5 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-24 h-7" />
          <Skeleton variant="circle" className="w-9 h-9" />
        </div>
        <Skeleton variant="rect" className="w-full h-9 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton variant="rect" className="w-14 h-6 rounded-lg" />
          <Skeleton variant="rect" className="w-16 h-6 rounded-lg" />
          <Skeleton variant="rect" className="w-14 h-6 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circle" className="w-11 h-11 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton variant="text" className="w-28 h-4" />
                <Skeleton variant="text" className="w-44 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat pane skeleton */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-4 bg-canvas">
        <div className="flex items-center gap-3 pb-3 border-b border-line">
          <Skeleton variant="circle" className="w-10 h-10" />
          <div className="space-y-1">
            <Skeleton variant="text" className="w-32 h-4" />
            <Skeleton variant="text" className="w-20 h-3" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          <div className="flex gap-2">
            <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
            <Skeleton variant="rect" className="w-64 h-14 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton variant="rect" className="w-72 h-16 rounded-2xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
            <Skeleton variant="rect" className="w-56 h-12 rounded-2xl" />
          </div>
        </div>
        <Skeleton variant="rect" className="w-full h-12 rounded-2xl" />
      </div>
    </div>
  );
}

