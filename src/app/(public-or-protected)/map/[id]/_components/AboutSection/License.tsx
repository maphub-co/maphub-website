// LIBRARIES
import Link from "next/link";
import { Scale } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// CONSTANTS
import { licenses_infos } from "@/lib/licenses";

/*======= COMPONENT =======*/
export default function License() {
  /*------- ATTRIBUTS -------*/
  const [license] = useMapStore(useShallow((state) => [state.map?.license]));

  /*------- RENDER -------*/
  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <Scale className="size-4" />

        <span className="text-xs font-medium">License :</span>
      </div>
      {!!license ? (
        <Link
          href={licenses_infos[license].url}
          target="_blank"
          className="text-xs text-primary underline"
        >
          {license}
        </Link>
      ) : (
        <span className="text-xs text-muted-foreground italic">
          No license specified
        </span>
      )}
    </div>
  );
}
