"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { ChevronLeft } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// SERVICES
import { folder_services } from "@/services/folder.services";
import { workspace_services } from "@/services/workspace.services";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Skeleton } from "@/components/ui/Skeleton";

/*======= INTERFACES =======*/
interface BackButtonProps {
  className?: string;
}

/*======= COMPONENT =======*/
export default function BackButton({ className }: BackButtonProps) {
  /*------- STATE -------*/
  const [is_editable] = useMapStore(useShallow((state) => [state.is_editable]));
  const [is_loading, set_loading] = useState(false);
  const [path, set_path] = useState<string>("");

  /*------- ATTRIBUTES -------*/
  const map_folder_id = useMapStore((state) => state.map?.folder_id);

  /*------- METHODS -------*/
  const load_path = async () => {
    if (!map_folder_id) return;

    set_loading(true);

    try {
      // Get the folder path to find the parent folder and workspace
      const { folder: parent_folder } = await folder_services.get_folder_async(
        map_folder_id
      );

      if (!parent_folder) throw new Error("Parent folder not found");

      // Get workspace details
      const workspace = await workspace_services.get_workspace_async(
        parent_folder.workspace_id
      );

      if (!workspace) throw new Error("Workspace not found");

      if (!!workspace.organization_id) {
        set_path(
          `/organizations/${workspace.organization_id}/workspaces/${workspace.id}/${parent_folder.id}`
        );
      } else {
        set_path(`/dashboard/workspaces/${workspace.id}/${parent_folder.id}`);
      }
    } catch (error) {
      console.error("Failed to load navigation data:", error);
    } finally {
      set_loading(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!map_folder_id || !is_editable) return;

    load_path();
  }, [map_folder_id, is_editable]);

  /*------- RENDER -------*/
  if (!is_editable) return <></>;

  if (is_loading) {
    return <Skeleton className="size-8 rounded-sm mr-2" />;
  }

  if (!map_folder_id || !path) {
    return null;
  }

  return (
    <Link href={path} className={cn(className, "btn btn-ghost btn-size-sm")}>
      <ChevronLeft className="size-4" />
    </Link>
  );
}
