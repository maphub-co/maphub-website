import { AddDataToMapPayload } from "@kepler.gl/types";

export function create_raster_tile(
  map_id: string,
  layer_infos: any
): AddDataToMapPayload {
  return {
    datasets: {
      info: {
        id: `raster-layer-${map_id}`,
        type: "raster-tile",
      },
      data: {
        rows: [],
        fields: [],
      },
      metadata: {
        type: "remote",
        remoteTileFormat: "mvt",
        tilesetDataUrl: layer_infos.tiling_url,
        tilesetMetadataUrl: layer_infos.metadata_url || layer_infos.tiling_url,
        pmtilesType: "mvt",
      },
    },
    options: {
      autoCreateLayers: true,
    },
  };
}
