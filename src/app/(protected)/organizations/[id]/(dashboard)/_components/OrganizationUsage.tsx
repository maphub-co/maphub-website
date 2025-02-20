"use client";

// TYPES
import { OrganizationQuotas } from "@/interfaces/organization";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HardDrive } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// SERVICES
import { get_organization_quotas_async } from "@/services/organization.services";

// COMPONENTS
import { Progress } from "@/components/ui/Progress";

/*======= COMPONENT =======*/
export default function OrganizationUsage({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const [quotas, set_quotas] = useState<OrganizationQuotas | null>(null);

  /*------- METHODS -------*/
  const fetch_organization_quotas = async () => {
    try {
      const response = await get_organization_quotas_async(id as string);
      set_quotas(response);
    } catch (error: any) {
      console.error("Error fetching organization quotas:", error);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!id) return;
    fetch_organization_quotas();
  }, [id]);

  /*------- RENDER -------*/
  if (!quotas) return null;

  /*------- RENDERER -------*/
  return (
    <div className={cn("p-2 flex flex-col gap-y-4", className)}>
      {/* STORAGE */}
      <div className="w-full flex flex-col gap-y-2">
        {/* Progress Bar */}
        <Progress
          value={quotas.storage.used / quotas.storage.limit}
          className={cn(
            "h-2",
            quotas.storage.used / quotas.storage.limit >= 90 &&
              "bg-warning/20 [&>div]:bg-warning"
          )}
        />

        {/* Text */}
        <div className="flex items-center gap-x-2">
          <HardDrive className="size-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Math.round((quotas.storage.used / 1024 / 1024 / 1024) * 100) / 100}{" "}
            GB of{" "}
            {Math.round((quotas.storage.limit / 1024 / 1024 / 1024) * 100) /
              100}{" "}
            GB used.
          </span>
        </div>
      </div>
    </div>
  );
}
