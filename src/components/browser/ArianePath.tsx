// INTERFACES
import { Workspace } from "@/interfaces/workspace";
import { FolderPathItem } from "@/interfaces/folder";

// LIBRARIES
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { workspace_services } from "@/services/workspace.services";
import { folder_services } from "@/services/folder.services";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "@/utils/tailwindcss.utils";

/*======= INTERFACES =======*/
interface ArianePathProps {
  workspace_id: string;
  current_folder_id: string;
}

interface RootItemProps {
  workspace: Workspace;
  root: FolderPathItem;
}

interface PathItemProps {
  item: FolderPathItem;
  workspace_id: string;
}

/*======= COMPONENTS =======*/
export default function ArianePath({
  workspace_id,
  current_folder_id,
}: ArianePathProps) {
  /*------- STATE -------*/
  const [is_loading, set_is_loading] = useState(true);
  const [workspace, set_workspace] = useState<Workspace | null>(null);
  const [root, set_root] = useState<FolderPathItem | null>(null);
  const [path_items, set_path_items] = useState<FolderPathItem[]>([]);

  /*------- METHODS -------*/
  const load_workspace = async () => {
    set_is_loading(true);

    try {
      const workspace_item = await workspace_services.get_workspace_async(
        workspace_id
      );

      set_workspace(workspace_item);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load workspace",
      });
    } finally {
      set_is_loading(false);
    }
  };

  const load_path = async () => {
    try {
      set_is_loading(true);
      const path = await folder_services.get_ariane_path_async(
        current_folder_id
      );

      set_root(
        path.find((folder) => folder.name.toLowerCase() === "root") || null
      );

      set_path_items(
        path.filter((folder) => folder.name.toLowerCase() !== "root")
      );
    } catch (error) {
      console.error("Failed to load folder path:", error);
    } finally {
      set_is_loading(false);
    }
  };

  /*------- HOOKS -------*/
  useMemo(() => {
    if (!workspace_id) return;

    load_workspace();
  }, [workspace_id]);

  useEffect(() => {
    if (!current_folder_id) return;
    load_path();
  }, [current_folder_id]);

  /*------- RENDER -------*/
  // Calculate total items (root + path_items)
  const total_items = (root ? 1 : 0) + path_items.length;
  let visible_path_items = path_items;
  let show_ellipsis = false;
  if (total_items > 4) {
    show_ellipsis = true;
    visible_path_items = path_items.slice(-2);
  }

  return (
    <nav className="text-lg flex flex-col md:flex-row md:items-center gap-y-2 gap-x-1">
      {workspace && root && <RootItem workspace={workspace} root={root} />}

      <div className="flex items-center gap-x-1">
        {/* ELLIPSIS */}
        {show_ellipsis && (
          <div className="mr-2 flex items-center gap-x-1">
            <ChevronRight className="w-4 h-4" />
            <Ellipsis className="size-4" />
          </div>
        )}

        {/* LOADING */}
        {is_loading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex items-center gap-x-1"
            >
              <ChevronRight className="w-4 h-4" />
              <Skeleton className="w-20 h-6" />
            </div>
          ))}

        {/* PATH */}
        {!is_loading &&
          visible_path_items.map((item, index) => (
            <PathItem
              key={`segment-${index}`}
              item={item}
              workspace_id={workspace_id}
            />
          ))}
      </div>
    </nav>
  );
}

function RootItem({ workspace, root }: RootItemProps) {
  /*------- ATTRIBUTES -------*/
  const path = usePathname();
  const path_base = path.split("/workspaces/")[0];
  const router = useRouter();
  const { setNodeRef: folder_ref, isOver } = useDroppable({
    id: root.id,
    data: {
      type: "folder",
      folder: {
        id: root.id,
        name: root.name,
      },
    },
  });

  /*------- RENDER -------*/
  return (
    <Button
      ref={folder_ref}
      variant="ghost"
      className={cn(
        "w-fit px-3 leading-none transition-none",
        isOver && "bg-hover/50 outline outline-2 outline-accent"
      )}
      onClick={() => {
        router.push(`${path_base}/workspaces/${workspace.id}`);
      }}
    >
      <h2 className="text-lg font-bold">{workspace.name}</h2>
    </Button>
  );
}

function PathItem({ item, workspace_id }: PathItemProps) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const path = usePathname();
  const path_base = path.split("/workspaces/")[0];
  const { setNodeRef: folder_ref, isOver } = useDroppable({
    id: item.id,
    data: {
      type: "folder",
      folder: {
        id: item.id,
        name: item.name,
      },
    },
  });

  /*------- RENDER -------*/
  return (
    <div className="flex items-center gap-x-1">
      <ChevronRight className="w-4 h-4" />
      <Button
        ref={folder_ref}
        variant="ghost"
        className={cn(
          "px-3 leading-none transition-none",
          isOver && "bg-hover/50 outline outline-2 outline-accent"
        )}
        onClick={() => {
          router.push(`${path_base}/workspaces/${workspace_id}/${item.id}`);
        }}
      >
        {item.name}
      </Button>
    </div>
  );
}
