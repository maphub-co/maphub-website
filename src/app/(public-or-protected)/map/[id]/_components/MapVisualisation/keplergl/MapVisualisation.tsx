// LIBRARIES
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { wrapTo, toggleSidePanel } from "@kepler.gl/actions";

// COMPONENTS
import BaseMap from "@/components/keplergl/Basemap";
import LayerManager from "./LayerManager";

/*======= COMPONENT =======*/
export default function KeplerglVisualisation({
  id,
  name,
  readonly,
}: {
  id: string;
  name: string;
  readonly: boolean;
}) {
  /*------- ATTRIBUTES -------*/
  const dispatch = useDispatch();
  const wrap_to_preview_map = wrapTo(id);

  /*------- EFFECTS -------*/
  useEffect(() => {
    if (readonly) dispatch(wrap_to_preview_map(toggleSidePanel(null)));
  }, [dispatch, wrap_to_preview_map]);

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full relative">
      <BaseMap id={id} appName={name} />
      <LayerManager id={id} readonly={readonly} />
    </div>
  );
}
