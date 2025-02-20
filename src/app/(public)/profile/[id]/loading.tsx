import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header Skeleton */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />

        <div className="flex-1">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-4 w-full max-w-md mb-4" />
          <Skeleton className="h-4 w-full max-w-md mb-2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* Maps Skeleton */}
      <Skeleton className="h-10 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card">
            <Skeleton className="w-full aspect-video" />
            <div className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex gap-3 mb-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
