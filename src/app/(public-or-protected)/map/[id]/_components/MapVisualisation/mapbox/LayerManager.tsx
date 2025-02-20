"use client";

// STYLE
import "mapbox-gl/dist/mapbox-gl.css";

// LIBRARIES
import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";
import { Loader2, AlertCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import Layer from "@/components/mapbox/layers/LayerFactory";

/*======= COMPONENT =======*/
export default function MapboxLayerManager() {
  /*------- ATTRIBUTS -------*/
  const { current: mapbox_map } = useMap();
  const [is_loading, map_id, map_visuals, layer_infos] = useMapStore(
    useShallow((state) => [
      state.is_loading,
      state.map?.id,
      state.map?.visuals,
      state.layer_infos,
    ])
  );
  const colormap_error =
    (!map_visuals?.type_colormap && map_visuals?.colormap === "") ||
    (!!map_visuals?.type_colormap && map_visuals?.colormap.length === 0);

  /*------- METHODS -------*/
  const set_focus = (
    bounds: [number, number, number, number],
    padding: number = 100
  ) => {
    if (!mapbox_map) return;

    mapbox_map?.getMap().fitBounds(bounds, { padding, duration: 0 });
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!layer_infos) return;
    set_focus(layer_infos.bounds);
  }, [layer_infos]);

  /*------- RENDERER -------*/
  return (
    <>
      {is_loading || !map_id ? (
        <div className="w-full h-full absolute bg-background/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4 bg-background-primary p-6 rounded-lg shadow-lg">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        <Layer map_id={map_id} params={layer_infos} />
      )}

      {colormap_error && (
        <div className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-md">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium">
              Colormap is not set. Please set a colormap to be able to see the
              layer.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
