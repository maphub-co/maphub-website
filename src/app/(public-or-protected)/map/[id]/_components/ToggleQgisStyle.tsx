import { useMapStore } from "@/stores/map.store";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Info } from "lucide-react";
import type React from "react";

export default function ToggleQgisStyle() {
  /*------- ATTRIBUTES -------*/
  const [map_visuals, use_qgis_style, toggle_qgis_style] = useMapStore(
    (state) => [
      state.map?.visuals,
      state.use_qgis_style,
      state.toggle_qgis_style,
    ]
  );

  /*------- RENDERER -------*/
  return (
    !!map_visuals?.qgis && (
      <Label className="flex items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-x-1">
                <Info className="size-4" />
                QGIS style
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                A qgis style has been detected for this map.
                Activate/desactivate it using this toogle. QGIS styling support
                is still experimental.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Switch checked={use_qgis_style} onClick={toggle_qgis_style} />
      </Label>
    )
  );
}
