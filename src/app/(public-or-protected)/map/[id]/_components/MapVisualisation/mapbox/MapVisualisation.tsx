// COMPONENTS
import Basemap from "@/components/mapbox/Basemap";
import LayerManager from "./LayerManager";
import Legend from "./Legend";
import ColormapEditor from "./ColormapEditor";
import VectorStyleEditor from "./VectorStyleEditor";

/*======= COMPONENT =======*/
export default function MapboxVisualisation({
  id,
  readonly = true,
}: {
  id: string;
  readonly?: boolean;
}) {
  return (
    <Basemap id={id}>
      {/* OVERLAY */}
      {!readonly && (
        <div className="w-full h-full absolute top-0 left-0 z-100 flex flex-col gap-y-4 pointer-events-none">
          <ColormapEditor className="max-w-80 m-4 absolute top-0 right-0 pointer-events-auto" />
          <VectorStyleEditor className="max-w-80 m-4 absolute top-0 right-0 pointer-events-auto" />
        </div>
      )}

      <LayerManager />
      {readonly && (
        <Legend className="min-w-64 max-w-xs absolute bottom-4 right-4" />
      )}
    </Basemap>
  );
}
