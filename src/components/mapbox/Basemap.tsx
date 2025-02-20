// LIBRARIES
import { useState } from "react";
import Map, { NavigationControl, ScaleControl } from "react-map-gl/mapbox";
import { Loader2 } from "lucide-react";

// COMPONENTS
import StyleControl from "./controls/StyleControl";
import ProjectionControl from "./controls/ProjectionControl";

// CONSTANTS
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 2,
};

/*======= COMPONENT =======*/
export default function MapboxBasemap({
  id = "default",
  children,
}: {
  id: string | null | undefined;
  children?: React.ReactNode;
}) {
  /*------- ATTRIBUTS -------*/
  const [is_loading, set_loading] = useState(false);
  const [projection, set_projection] = useState<"globe" | "mercator">("globe");

  /*------- METHODS -------*/
  const handle_projection_change = (projection: "globe" | "mercator") => {
    set_projection(projection);
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full relative">
      {/* LOADER */}
      {is_loading && (
        <div className="w-full h-full absolute bg-background/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-4 bg-background-primary p-6 rounded-lg shadow-lg">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* MAP */}
      <Map
        id={id as string}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        minZoom={1.5}
        onLoad={() => set_loading(false)}
        preserveDrawingBuffer={true} // Important for enabling canvas capture
        reuseMaps={false} // Disable map reuse to ensure fresh map creation
        attributionControl={false} // Disable Mapbox logo and attribution
        projection={projection}
      >
        <StyleControl position="top-left" />
        <ProjectionControl
          position="top-left"
          projection={projection}
          on_change={handle_projection_change}
        />
        <NavigationControl position="top-left" />
        <ScaleControl position="bottom-left" />

        {!is_loading && children}
      </Map>
    </div>
  );
}
