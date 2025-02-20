import { AddDataToMapPayload } from "@kepler.gl/types";

export async function create_vector_tile(
  map_id: string,
  layer_infos: any
): Promise<AddDataToMapPayload> {
  const fetch_metadata = async () => {
    const response = await fetch(layer_infos.metadata_url);
    const metadata = await response.json();

    return metadata;
  };

  const metadata = await fetch_metadata();

  return {
    datasets: {
      info: {
        id: `vector-layer-${map_id}`,
        label: metadata.name,
        type: "vector-tile",
        format: "rows",
      },
      data: {
        rows: [],
        fields: [],
      },
      metadata: {
        ...metadata,
        type: "remote",
        pmtilesType: "mvt",
        remoteTileFormat: "mvt",
        tilesetDataUrl: layer_infos.tiling_url,
        tilesetMetadataUrl: layer_infos.metadata_url || layer_infos.tiling_url,
      },
    },
    options: {
      autoCreateLayers: true,
      centerMap: true,
    },
  };
}
