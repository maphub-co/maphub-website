// TYPES
import { LayerInfos } from "@/interfaces/map";
import { AddDataToMapPayload } from "@kepler.gl/types";

// CONFIG
import { toast } from "@/lib/toast";
import { create_vector_tile } from "@/lib/keplergl/configs/vector-tile.config";
import { create_raster_tile } from "@/lib/keplergl/configs/raster-tile.config";

export const create_kepler_layer = async ({
  map_id,
  layer_infos,
}: {
  map_id: string;
  layer_infos: LayerInfos;
}): Promise<AddDataToMapPayload | null> => {
  if (!layer_infos || !layer_infos.type) {
    toast({
      title: "Invalid layer information",
      description: "Invalid layer information",
      variant: "destructive",
    });
    return null;
  }

  try {
    const layer_type = layer_infos.type.toLowerCase();

    switch (layer_type) {
      case "vector":
      case "geojson":
        return await create_vector_tile(map_id, layer_infos);

      case "raster":
      case "tiff":
      case "tif":
      case "png":
      case "jpg":
      case "jpeg":
        return await create_raster_tile(map_id, layer_infos);

      default:
        toast({
          title: "Unsupported layer type",
          description: `Unsupported layer type: ${layer_type}`,
          variant: "destructive",
        });
        return null;
    }
  } catch (error) {
    toast({
      title: "Failed to create layer configuration",
      description: "Failed to create layer configuration",
      variant: "destructive",
    });
    console.error("Layer factory error:", error);
    return null;
  }
};
