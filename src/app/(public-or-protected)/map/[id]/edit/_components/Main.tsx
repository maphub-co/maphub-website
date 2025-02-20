"use client";

// LIBRARIES
import { useEffect } from "react";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import SaveButton from "./SaveButton";
import MapVisualisation from "../../_components/MapVisualisation";
import ToogleQgisStyle from "../../_components/ToggleQgisStyle";

/*======= COMPONENT =======*/
export default function MapEditorMain({ id }: { id: string }) {
  /*------- ATTRIBUTES -------*/
  const [load_map_detail, map_name] = useMapStore((state) => [
    state.load_map_detail,
    state.map?.name,
    state.map?.visuals,
    state.layer_infos,
  ]);

  /*------- EFFECTS -------*/
  useEffect(() => {
    if (!id) return;

    load_map_detail(id);
  }, [id]);

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full flex flex-col">
      {/* HEADER */}
      <header className="w-full h-16 px-4 grid grid-cols-[1fr_3fr_1fr] items-center bg-background-primary">
        {/* BACK BUTTON */}
        <Link
          href={`/map/${id}`}
          className="flex items-center gap-x-2 text-sm text-muted-foreground"
        >
          <ChevronLeft className="size-4" />
          Return
        </Link>

        {/* MAP NAME */}
        <h1 className="w-full text-center text-truncate text-base font-semibold">
          {map_name}
        </h1>

        <div className="flex items-center gap-x-4 justify-self-end">
          <ToogleQgisStyle />

          {/* SAVE BUTTON */}
          <SaveButton id={"map-editor"} />
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 relative">
        <MapVisualisation
          id="map-editor"
          name="Style Editor"
          readonly={false}
        />
      </main>
    </div>
  );
}
