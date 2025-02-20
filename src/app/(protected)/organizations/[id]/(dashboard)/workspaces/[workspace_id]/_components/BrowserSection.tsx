"use client";

// TYPES
import { FolderInfos } from "@/interfaces/folder";
import { MapInfos } from "@/interfaces/map";

// LIBRARIES
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTour } from "@reactour/tour";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  pointerWithin,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { FolderPlus, MapPlus } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { folder_services } from "@/services/folder.services";
import { map_services } from "@/services/map.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useAuthStore } from "@/stores/auth.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import ArianePath from "@/components/browser/ArianePath";
import FoldersList from "@/components/browser/FoldersList";
import FilesList from "@/components/browser/FilesList";
import FolderDialog from "@/components/browser/FolderDialog";
import FileDialog from "@/components/browser/FileDialog";
import ViewToggle from "@/components/browser/ViewToggle";

/*======= INTERFACES =======*/
interface BrowserSectionProps {
  id: string;
  path: string;
}

/*======= COMPONENT =======*/
export default function BrowserSection({ id, path }: BrowserSectionProps) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const { setIsOpen: set_guided_tour } = useTour();
  const { loading, is_authenticated } = useAuthStore();
  const [is_loading, set_is_loading] = useState(true);
  const [folders, set_folders] = useState<FolderInfos[]>([]);
  const [current_folder, set_current_folder] = useState<FolderInfos | null>(
    null
  );
  const [maps, set_maps] = useState<MapInfos[]>([]);
  const [view, set_view] = useState<"list" | "grid">("list");
  const [is_file_dialog_open, set_file_dialog_open] = useState(false);
  const [is_folder_dialog_open, set_folder_dialog_open] = useState(false);

  /*------- METHODS -------*/
  const fetch_folder_content = async () => {
    try {
      const folder =
        path === ""
          ? await folder_services.get_root_async(id)
          : await folder_services.get_folder_async(path);

      set_current_folder(folder.folder);
      set_folders(folder.child_folders);
      set_maps(folder.map_infos);
    } catch (error) {
      throw error;
    }
  };

  const initialization = async () => {
    set_is_loading(true);
    try {
      await fetch_folder_content();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load folder content",
      });
    } finally {
      set_is_loading(false);
    }
  };

  const refresh = async () => {
    try {
      await fetch_folder_content();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update folder content",
      });
    }
  };

  const handle_drag_end = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle file to folder drop
    if (
      active.data.current?.type === "file" &&
      over.data.current?.type === "folder"
    ) {
      const file_id = active.data.current.map.id;
      const folder_id = over.data.current.folder.id;

      map_services
        .update_folder_async(folder_id, file_id)
        .then(() => {
          refresh();
        })
        .catch((error) => {
          console.error("Failed to move file:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to move file to folder",
          });
        });
    }
    // Handle folder to folder drop
    else if (
      active.data.current?.type === "folder" &&
      over.data.current?.type === "folder"
    ) {
      const folder_id = active.data.current.folder.id;
      const new_parent_id = over.data.current.folder.id;

      // Prevent dropping a folder into itself or its descendants
      if (folder_id === new_parent_id) {
        return;
      }

      folder_services
        .update_parent_async(new_parent_id, folder_id)
        .then(() => {
          refresh();
        })
        .catch((error) => {
          console.error("Failed to move folder:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to move folder",
          });
        });
    }
  };

  /*------- HOOKS -------*/
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 32,
      },
    })
  );

  useEffect(() => {
    if (loading) return;

    if (!loading && !is_authenticated) {
      localStorage.setItem("login_return_url", window.location.pathname);
      router.push("/login");
      return;
    }

    initialization();
  }, [loading, is_authenticated]);

  useEffect(() => {
    if (
      localStorage.getItem("guided_tour") === "true" &&
      !loading &&
      !is_loading
    ) {
      set_guided_tour(true);
      localStorage.setItem("guided_tour", "false");
    }
  }, [set_guided_tour, loading, is_loading]);

  /*------- RENDER -------*/
  if (loading || is_loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex-1 min-h-full flex flex-col gap-y-4 md:gap-y-8 p-4 md:p-8">
      <DndContext
        onDragEnd={handle_drag_end}
        collisionDetection={pointerWithin}
        sensors={sensors}
      >
        {/* HEADER */}
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-4">
            {/* ARIANE PATH */}
            <ArianePath
              workspace_id={id}
              current_folder_id={current_folder?.id || ""}
            />

            {/* VIEW TOGGLE */}
            <ViewToggle view={view} set_view={set_view} />
          </div>

          <div className="w-full md:justify-end flex items-center gap-x-4">
            {/* NEW FOLDER BUTTON */}
            <Button
              id="create-folder-button"
              variant="outline"
              className="w-full md:w-fit flex items-center gap-x-2"
              onClick={() => set_folder_dialog_open(true)}
            >
              <FolderPlus className="size-5" />
              New Folder
            </Button>

            {/* UPLOAD BUTTON */}
            <Button
              id="upload-map-button"
              className="w-full md:w-fit flex items-center gap-x-2"
              onClick={() => set_file_dialog_open(true)}
            >
              <MapPlus className="size-5" />
              Upload new map
            </Button>
          </div>
        </div>

        {/* FOLDER CONTENT */}
        {is_loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : folders.length === 0 && maps.length === 0 ? (
          <div className="flex-1 h-full flex flex-col items-center justify-center border border-dashed rounded-sm gap-y-2">
            <MapPlus className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click "Upload new map" to upload a file.
            </p>
          </div>
        ) : (
          <div
            className={cn("flex-1 flex flex-col", view === "grid" && "gap-y-8")}
          >
            {view === "list" && (
              <div className="p-4 border-b">
                <span className="font-medium">Name</span>
              </div>
            )}
            <FoldersList folders={folders} view={view} refresh={refresh} />
            <FilesList files={maps} view={view} refresh={refresh} />
          </div>
        )}

        {/* DIALOGS */}
        <FileDialog
          is_open={is_file_dialog_open}
          folder_id={current_folder?.id || "root"}
          on_upload_success={() => {
            set_file_dialog_open(false);
            refresh();
          }}
          on_cancel={() => set_file_dialog_open(false)}
          on_close={() => {
            set_file_dialog_open(false);
            refresh();
          }}
        />

        <FolderDialog
          is_open={is_folder_dialog_open}
          parent_folder_id={current_folder?.id || "root"}
          on_create_success={() => {
            set_folder_dialog_open(false);
            refresh();
          }}
          on_close={() => set_folder_dialog_open(false)}
        />
      </DndContext>
    </div>
  );
}
