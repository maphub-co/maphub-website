"use client";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import KeplerglVisualisation from "./keplergl/MapVisualisation";
import MapboxVisualisation from "./mapbox/MapVisualisation";

/*======= PROPS =======*/
interface MapVisualisationProps {
  id: string;
  name?: string;
  readonly?: boolean;
}

/*======= COMPONENT =======*/
export default function MapVisualisation({
  id,
  name = "Map viewer",
  readonly = true,
}: MapVisualisationProps) {
  /*------- ATTRIBUTES -------*/
  const [visuals, layer_infos, use_qgis_style] = useMapStore((state) => [
    state.map?.visuals,
    state.layer_infos,
    state.use_qgis_style,
  ]);

  const is_legacy =
    !!visuals?.styles || use_qgis_style || layer_infos?.type === "raster";

  /*------- RENDERER -------*/
  if (!id) return <></>;

  if (is_legacy) return <MapboxVisualisation id={id} readonly={readonly} />;

  return <KeplerglVisualisation id={id} name={name} readonly={readonly} />;
}
