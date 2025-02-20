"use client";

// LIBRARIES
import { HardDrive, Map } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Progress } from "@/components/ui/Progress";

export default function UserUsage({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const { quotas } = useUserStore();
  const storage_used = quotas?.storage?.used || 0;
  const storage_limit = quotas?.storage?.limit || 1;
  const storage_percentage = Math.min(
    (storage_used / storage_limit) * 100,
    100
  );

  const private_maps_used = quotas?.private_maps?.used || 0;
  const private_maps_limit = quotas?.private_maps?.limit || 1;
  const private_maps_percentage = Math.min(
    (private_maps_used / private_maps_limit) * 100,
    100
  );

  /*------- RENDERER -------*/
  return (
    <div className={cn("p-2 flex flex-col gap-y-4", className)}>
      {/* PRIVATE MAPS */}
      <div className="w-full flex flex-col gap-y-2">
        {/* Progress Bar */}
        <Progress
          value={private_maps_percentage}
          className={cn(
            "h-2",
            private_maps_percentage >= 90 && "bg-warning/20 [&>div]:bg-warning"
          )}
        />

        {/* Text */}
        <div className="flex items-center gap-x-2">
          <Map className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {private_maps_used} of {private_maps_limit} private maps used.
          </span>
        </div>
      </div>

      {/* STORAGE */}
      <div className="w-full flex flex-col gap-y-2">
        {/* Progress Bar */}
        <Progress
          value={storage_percentage}
          className={cn(
            "h-2",
            storage_percentage >= 90 && "bg-warning/20 [&>div]:bg-warning"
          )}
        />

        {/* Text */}
        <div className="flex items-center gap-x-2">
          <HardDrive className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Math.round((storage_used / 1024 / 1024 / 1024) * 100) / 100} GB of{" "}
            {Math.round((storage_limit / 1024 / 1024 / 1024) * 100) / 100} GB
            used.
          </span>
        </div>
      </div>
    </div>
  );
}
