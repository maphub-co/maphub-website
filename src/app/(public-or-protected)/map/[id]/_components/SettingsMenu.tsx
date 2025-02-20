// LIBRARIES
import { useEffect, useState } from "react";
import { EllipsisVertical, LockKeyhole, Eye } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";
import { useShallow } from "zustand/react/shallow";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { DescriptionEditor } from "./AboutSection/UpdateMapDialog/DescriptionEditor";
import { TagsEditor } from "./AboutSection/UpdateMapDialog/TagsEditor";
import ThumbnailEditor from "./AboutSection/UpdateMapDialog/ThumbnailEditor";

/*======= COMPONENTS =======*/
export default function MapSettings() {
  /*------- ATTRIBUTES -------*/
  const [is_public_dialog_open, set_is_public_dialog_open] = useState(false);
  const [is_editable, map_is_public, update_map] = useMapStore(
    useShallow((state) => [
      state.is_editable,
      state.map?.public,
      state.update_map,
    ])
  );

  /*------- METHODS -------*/
  const handle_make_private = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to make this map private? Only you will be able to view it."
    );

    if (confirmed) {
      try {
        await update_map({ public: false });

        toast({
          title: "Success",
          description: "Map is now private.",
        });
      } catch (error) {
        console.error("Failed to make map private:", error);
        toast({
          title: "Error",
          description: "Failed to make map private. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handle_make_public = () => {
    set_is_public_dialog_open(true);
  };

  const handle_publish = async (data: {
    name: string;
    description: string;
    tags: string[];
  }) => {
    try {
      await update_map({
        name: data.name,
        description: data.description,
        tags: data.tags,
        public: true,
      });

      toast({
        title: "Success",
        description: "Map published successfully.",
      });
    } catch (error) {
      console.error("Failed to publish map:", error);
      toast({
        title: "Error",
        description: "Failed to publish map. Please try again later.",
        variant: "destructive",
      });
    }
  };

  /*------- RENDERER -------*/
  if (!is_editable) return <></>;

  return (
    <>
      <DropdownMenu>
        {/* TRIGGER */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit h-8 hover:bg-transparent hover:text-foreground px-0"
          >
            <EllipsisVertical className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        {/* SETINGS */}
        <DropdownMenuContent align="end">
          {map_is_public ? (
            <DropdownMenuItem onClick={handle_make_private}>
              Make the map private
              <LockKeyhole className="size-4 ml-2" />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handle_make_public}>
              Make the map public
              <Eye className="size-4 ml-2" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PublishMapDialog
        open={is_public_dialog_open}
        on_close={() => set_is_public_dialog_open(false)}
        on_publish={handle_publish}
      />
    </>
  );
}

interface PublishMapDialogProps {
  open: boolean;
  on_close: () => void;
  on_publish: (data: {
    name: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
}

function PublishMapDialog({
  open,
  on_close,
  on_publish,
}: PublishMapDialogProps) {
  const [map_name, map_description, map_tags] = useMapStore(
    useShallow((state) => [
      state.map?.name,
      state.map?.description,
      state.map?.tags,
    ])
  );
  const [is_loading, set_is_loading] = useState(false);
  const [edit_name, set_edit_name] = useState("");
  const [edit_description, set_edit_description] = useState("");
  const [edit_tags, set_edit_tags] = useState<string[]>([]);

  /*------- METHODS -------*/
  const handle_publish = async () => {
    try {
      set_is_loading(true);
      await on_publish({
        name: edit_name,
        description: edit_description,
        tags: edit_tags,
      });
      on_close();
    } finally {
      set_is_loading(false);
    }
  };

  const handle_cancel = () => {
    // Reset to current values
    set_edit_name(map_name || "");
    set_edit_description(map_description || "");
    set_edit_tags(map_tags || []);
    on_close();
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!open) return;
    set_edit_name(map_name || "");
    set_edit_description(map_description || "");
    set_edit_tags(map_tags || []);
  }, [open]);

  /*------- RENDERER -------*/
  return (
    <Dialog open={open} onOpenChange={on_close}>
      <DialogContent className="p-0 gap-y-0 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Make Map Public</DialogTitle>
        </DialogHeader>

        <div className="p-4 flex flex-col gap-y-4 overflow-y-auto">
          <div className="bg-accent border border-accent-foreground rounded-md p-4">
            <p className="text-accent-foreground">
              Maps with good title, thumbnail, description and tags encounter
              more success. Please make sure you're happy with your current map
              information before publishing it.
            </p>
          </div>

          {/* Thumbnail */}
          <ThumbnailEditor />

          {/* Title */}
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={edit_name}
              onChange={(e) => set_edit_name(e.target.value)}
              placeholder="Map title..."
              disabled={is_loading}
            />
          </div>

          {/* Description */}
          <DescriptionEditor
            description={edit_description}
            on_change={set_edit_description}
            is_loading={is_loading}
          />

          {/* Tags */}
          <TagsEditor
            tags={edit_tags}
            on_change={set_edit_tags}
            is_loading={is_loading}
          />
        </div>

        <DialogFooter className="px-4 py-2 border-t">
          <Button
            variant="outline"
            onClick={handle_cancel}
            disabled={is_loading}
          >
            Cancel
          </Button>
          <Button onClick={handle_publish} disabled={is_loading}>
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
