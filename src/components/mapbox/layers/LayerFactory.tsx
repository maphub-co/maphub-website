"use client";

// COMPONENTS
import VectorLayer from "./VectorLayer";
import RasterLayer from "./RasterLayer";

/*======= TYPES =======*/
interface LayerProps {
  map_id: string | null;
  params: LayerInfos | null;
}

/*======= COMPONENT =======*/
export default function LayerFactory({ map_id, params }: LayerProps) {
  /*------- RENDERER -------*/
  if (!params) return null;

  switch (params.type.toLowerCase()) {
    case "vector":
    case "geojson":
      return <VectorLayer map_id={map_id} params={params} />;

    case "raster":
    case "tiff":
    case "tif":
    case "png":
    case "jpg":
    case "jpeg":
      return <RasterLayer map_id={map_id} params={params} />;

    default:
      console.error(`Unsupported layer type: ${params.type}`, params);
      return null;
  }
}
