"use client";

// TYPES
import { SavedConfigV1 } from "@kepler.gl/types";
import { KeplerGlSchema } from "@kepler.gl/schemas";

// LIBRARIES
import { useSelector } from "react-redux";
import { Save } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";

export default function SaveButton({ id }: { id: string }) {
  /*------- ATTRIBUTES -------*/
  const [vis_state, map_state, map_style] = useSelector((state: any) => [
    state.keplerGl?.[id]?.visState,
    state.keplerGl?.[id]?.mapState,
    state.keplerGl?.[id]?.mapStyle,
  ]);
  const [layer_infos, map_visuals, update_visuals, use_qgis_style] =
    useMapStore((state) => [
      state.layer_infos,
      state.map?.visuals,
      state.update_visuals,
      state.use_qgis_style,
    ]);
  const is_legacy =
    !!map_visuals?.styles || use_qgis_style || layer_infos?.type === "raster";

  /*------- METHODS -------*/
  const get_map_config = (): SavedConfigV1 | null => {
    try {
      if (!vis_state || !map_state || !map_style) {
        throw new Error("No Kepler state found");
      }

      const config: SavedConfigV1 = KeplerGlSchema.getConfigToSave({
        visState: vis_state,
        mapState: map_state,
        mapStyle: map_style,
      });

      return config;
    } catch (error) {
      console.error("Failed to get map config:", error);
      toast({
        title: "Error",
        description: "Failed to get map config.",
        variant: "destructive",
      });

      return null;
    }
  };

  const save_map_style = async (config: SavedConfigV1) => {
    try {
      await update_visuals({
        ...map_visuals,
        keplergl: config,
      });

      toast({
        title: "Success",
        description: "Map style saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save map style:", error);
      toast({
        title: "Error",
        description: "Failed to save map style. Please try again later.",
      });
    }
  };

  const handle_click = () => {
    const config = get_map_config();

    if (!config) return;

    save_map_style(config);
  };

  /*------- RENDERER -------*/
  if (is_legacy) return null;

  return (
    <Button
      onClick={handle_click}
      size="sm"
      variant="outline"
      className="shrink-0 flex items-center gap-x-2"
    >
      <Save className="size-4" />
      Save
    </Button>
  );
}
