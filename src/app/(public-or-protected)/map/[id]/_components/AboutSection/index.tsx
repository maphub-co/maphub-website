// LIBRARIES
import { useState } from "react";
import { Loader2, Edit } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";
import { useShallow } from "zustand/react/shallow";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import License from "./License";
import Source from "./Source";
import Tags from "./Tags";
import UpdateMapDialog from "./UpdateMapDialog";

/*======= COMPONENT =======*/
export default function AboutSection() {
  /*------- ATTRIBUTS -------*/
  const [is_editable, is_loading, description] = useMapStore(
    useShallow((state) => [
      state.is_editable,
      state.is_loading,
      state.map?.description,
    ])
  );
  const [is_modal_open, set_is_modal_open] = useState(false);

  /*------- RENDER -------*/
  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="border-b py-2 mb-4 flex justify-between items-center">
        <h3 className="font-semibold">Map Information</h3>

        {is_editable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => set_is_modal_open(true)}
            disabled={is_loading}
          >
            <Edit className="size-4" />
          </Button>
        )}
      </div>

      {/* CONTENT */}
      <div>
        {is_loading ? (
          <div className="h-20 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Description */}
            <div className="mb-4">
              {description ? (
                <p className="text-sm whitespace-pre-wrap">{description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No description available
                </p>
              )}
            </div>

            {/* Source */}
            <Source />

            {/* License */}
            <License />

            {/* Tags */}
            <Tags />
          </div>
        )}
      </div>

      {/* SETTINGS MODAL */}
      <UpdateMapDialog
        open={is_modal_open}
        on_close={() => set_is_modal_open(false)}
      />
    </div>
  );
}
