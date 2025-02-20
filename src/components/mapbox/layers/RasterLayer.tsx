"use client";

// LIBRARIES
import { useMemo, useState } from "react";
import { Source, Layer } from "react-map-gl/mapbox";
import { useShallow } from "zustand/react/shallow";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";

/*======= TYPES =======*/
interface RasterLayerProps {
  map_id: string | null;
  params: LayerInfos;
}

/*======= COMPONENT =======*/
export default function RasterLayer({ params }: RasterLayerProps) {
  /*------- ATTRIBUTS -------*/
  const [selected_version] = useMapStore(
    useShallow((state) => [state.map?.visuals, state.selected_version])
  );
  const [layer_id] = useState(`raster-layer-${selected_version?.id}`);
  const [source_id] = useState(`raster-source-${selected_version?.id}`);

  const tiling_url = useMemo(() => {
    if (!params.tiling_url) return null;

    const url = `${params.tiling_url}${
      params.tiling_url.includes("?") ? "&" : "?"
    }_t=${selected_version?.id}`;

    return url;
  }, [selected_version?.id, params.tiling_url]);

  /*------- RENDERER -------*/
  if (!params.tiling_url || !tiling_url) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Raster layer is missing URL",
    });
    return null;
  }

  return (
    <Source id={source_id} type="raster" tiles={[tiling_url]} tileSize={256}>
      <Layer
        id={layer_id}
        type="raster"
        paint={{
          "raster-opacity": 1,
          "raster-fade-duration": 0,
        }}
      />
    </Source>
  );
}
