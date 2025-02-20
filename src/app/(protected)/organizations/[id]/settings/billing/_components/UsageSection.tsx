"use client";

// TYPES
import { OrganizationQuotas } from "@/interfaces/organization";

// LIBRARIES
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { get_organization_quotas_async } from "@/services/organization.services";

// UTILS
import { format_bytes } from "@/utils/format";
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";

// Storage Usage Card Component
function Storage({
  title,
  max,
  used,
}: {
  title: string;
  max: number;
  used: number;
}) {
  // Calculate percentage used for storage
  const storage_percentage = max ? Math.round((used / max) * 100) : 0;

  return (
    <div className="w-full p-2 flex flex-col gap-y-2">
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

export default function UsageSection({ className }: { className?: string }) {
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

      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to fetching organization quotas. Please try again later",
      });
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!id) return;
    fetch_organization_quotas();
  }, [id]);

  /*------- RENDER -------*/
  if (!quotas) return null;

  return (
    <section className={cn("w-full flex flex-col gap-y-8", className)}>
      {/* HEADER */}
      <div className="flex items-center border-b pb-2">
        <h2 className="text-xl md:text-2xl font-medium">Usage</h2>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-2xl flex flex-col gap-y-4">
        <Storage
          title="Total storage"
          max={quotas.storage.limit}
          used={quotas.storage.used}
        />
      </div>
    </section>
  );
}
