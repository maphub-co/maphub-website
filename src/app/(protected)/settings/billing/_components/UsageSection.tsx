"use client";

// UTILS
import { format_bytes } from "@/utils/format";
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";

// Storage Usage Card Component
function Storage({
  title,
  max,
  used = 0,
}: {
  title: string;
  max: number;
  used: number;
}) {
  // Calculate percentage used for storage
  const storage_percentage = max ? Math.round((used / max) * 100) : 0;

  return (
    <div className="p-1 space-y-2">
      <div className="text-sm font-medium flex items-center justify-between">
        <h3>{title}</h3>
        <span className="font-medium">
          {format_bytes(used)} / {format_bytes(max)}
        </span>
      </div>
      <Progress
        value={storage_percentage}
        className={cn(
          "h-2",
          storage_percentage >= 90 && "bg-warning/20 [&>div]:bg-warning"
        )}
      />
      <p className="text-xs text-muted-foreground">
        You've used {format_bytes(used)} of your {format_bytes(max)} total
        storage.
      </p>
    </div>
  );
}

// Maps Usage Card Component
function Maps({
  title,
  max,
  used,
}: {
  title: string;
  max: number;
  used: number;
}) {
  // Calculate percentage used for maps
  const maps_percentage = max ? Math.round((used / max) * 100) : 100;

  return (
    <div className="p-1 space-y-2">
      <div className="text-sm font-medium flex items-center justify-between">
        <h3>{title}</h3>
        <span className="font-medium">
          {max ? `${used} / ${max}` : "Unlimited"}
        </span>
      </div>
      <Progress
        value={maps_percentage}
        className={cn(
          "h-2",
          max && maps_percentage >= 90 && "bg-warning/20 [&>div]:bg-warning"
        )}
      />
      <p className="text-xs text-muted-foreground">
        {max
          ? `You've used ${used} out of your ${max} maps.`
          : "You can create as many as you want."}
      </p>
    </div>
  );
}

export default function UsageSection({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const { loading, quotas } = useUserStore();

  /*------- RENDER -------*/
  return (
    <section className={cn("w-full flex flex-col gap-y-8", className)}>
      {/* TITLE */}
      <div className="flex items-center justify-between gap-x-2 border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">Overview</h2>
      </div>

      {/* CONTENT */}
      {loading ? (
        <>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>
      ) : (
        quotas && (
          <>
            {/* STORAGE */}
            <div className="w-full max-w-2xl grid grid-cols-1 gap-y-2">
              <h4 className="md:col-span-2 text-lg font-medium">Storage</h4>

              <Storage
                title="Total storage"
                max={quotas.storage.limit}
                used={quotas.storage.used}
              />
            </div>

            {/* MAPS */}
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <h4 className="md:col-span-2 text-lg font-medium">Maps</h4>

              {/* PRIVATE */}
              <Maps
                title="Private"
                max={quotas.private_maps.limit}
                used={quotas.private_maps.used}
              />

              {/* PUBLIC */}
              <Maps
                title="Public"
                max={quotas.public_maps.limit}
                used={quotas.public_maps.used}
              />
            </div>
          </>
        )
      )}
    </section>
  );
}
