// TYPES
import { Licenses, Source } from "@/interfaces/map";

// LIBRARIES
import { useEffect, useState } from "react";

// STORE
import { useMapStore } from "@/stores/map.store";
import { useShallow } from "zustand/react/shallow";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DescriptionEditor } from "./DescriptionEditor";
import { LicenseEditor } from "./LicenseEditor";
import { SourceEditor } from "./SourceEditor";
import { TagsEditor } from "./TagsEditor";
import ThumbnailEditor from "./ThumbnailEditor";

/*======= TYPES =======*/
interface UpdateMapDialogProps {
  open: boolean;
  on_close: () => void;
}

/*======= COMPONENT =======*/
export default function UpdateMapDialog({
  open,
  on_close,
}: UpdateMapDialogProps) {
  /*------- ATTRIBUTES -------*/
  const [loading_map, description, tags, source, license, update_map] =
    useMapStore(
      useShallow((state) => [
        state.is_loading,
        state.map?.description,
        state.map?.tags,
        state.map?.source,
        state.map?.license,
        state.update_map,
      ])
    );

  const [is_loading, set_is_loading] = useState(false);

  // Editable fields
  const [edit_description, set_edit_description] = useState<string>("");
  const [edit_source, set_edit_source] = useState<Source | null>(null);
  const [edit_license, set_edit_license] = useState<Licenses | null>(null);
  const [edit_tags, set_edit_tags] = useState<string[]>([]);

  /*------- METHODS -------*/
  const handle_cancel = () => {
    set_edit_description(description || "");
    set_edit_source(source || null);
    set_edit_license(license || null);
    set_edit_tags(tags || []);

    on_close();
  };

  const handle_save = async () => {
    if (loading_map) return;

    try {
      set_is_loading(true);

      const source_present =
        (edit_source?.name?.trim() || edit_source?.url?.trim()) !== "";

      await update_map({
        description: edit_description,
        license: edit_license || null,
        source: source_present ? edit_source : null,
        tags: edit_tags,
      });

      on_close();
    } finally {
      set_is_loading(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!open || loading_map) return;
    set_edit_description(description || "");
    set_edit_source(source || null);
    set_edit_license(license || null);
    set_edit_tags(tags || []);
  }, [open, loading_map]);

  /*------- RENDERER -------*/
  return (
    <Dialog open={open} onOpenChange={on_close}>
      <DialogContent className="max-h-4/5 p-0 flex flex-col gap-y-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Map Settings</DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-4 flex flex-col gap-y-4 overflow-y-auto">
          {/* Thumbnail */}
          <ThumbnailEditor />

          {/* Description */}
          <DescriptionEditor
            description={edit_description}
            on_change={set_edit_description}
            is_loading={is_loading}
          />

          <SourceEditor
            source={edit_source}
            on_change={set_edit_source}
            is_loading={is_loading}
          />

          <LicenseEditor
            license={edit_license}
            on_change={set_edit_license}
            is_loading={is_loading}
          />

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
          <Button onClick={handle_save} disabled={is_loading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
