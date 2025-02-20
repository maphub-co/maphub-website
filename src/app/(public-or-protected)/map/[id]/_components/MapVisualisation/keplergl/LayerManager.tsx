"use client";

// LIBRARIES
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { wrapTo, toggleSidePanel, addDataToMap } from "@kepler.gl/actions";
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// LIB
import { create_kepler_layer } from "@/lib/keplergl/LayerFactory";

/*======= COMPONENT =======*/
export default function KeplerglLayerManager({
  id,
  readonly,
}: {
  id: string;
  readonly: boolean;
}) {
  /*------- ATTRIBUTES -------*/
  const dispatch = useDispatch();
  const wrapper = wrapTo(id);
  const [map_id, map_visuals, layer_infos] = useMapStore(
    useShallow((state) => [
      state.map?.id,
      state.map?.visuals,
      state.layer_infos,
    ])
  );

  /*------- EFFECTS -------*/
  useEffect(() => {
    if (!map_id || !map_visuals || !layer_infos) return;

    const load_layer_data = async () => {
      try {
        const payload = await create_kepler_layer({
          map_id,
          layer_infos,
        });

        if (!payload) return;

        payload.options = {
          ...payload.options,
          readOnly: readonly,
        };

        if (map_visuals?.keplergl) {
          payload.config = map_visuals?.keplergl;
        }

        dispatch(wrapper(addDataToMap(payload)));
      } catch (error) {
        console.error("Failed to load layer data:", error);
      }
    };

    load_layer_data();
  }, [map_id, map_visuals, layer_infos, dispatch]);

  /*------- RENDERER -------*/
  return null; // This component only manages data loading
}
