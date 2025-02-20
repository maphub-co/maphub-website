"use client";

// LIBRARIES
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { CheckIcon, CopyIcon } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { TooltipProvider } from "@/components/ui/Tooltip";

/*======= COMPONENT =======*/
export default function IframeCode() {
  /*------- ATTRIBUTS -------*/
  const [map_id, map_name] = useMapStore(
    useShallow((state) => [state.map?.id, state.map?.name])
  );
  const [copied, set_copied] = useState(false);

  // Generate the embed URL using the normal map URL with viewer and embed parameters
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/map/${map_id}?viewer=true&embed=true`
      : `/map/${map_id}?viewer=true&embed=true`;

  const iframe_code = `<iframe src="${url}" width="800" height="600" title="${map_name}"></iframe>`;

  /*------- METHODS -------*/
  const handle_click = async () => {
    navigator.clipboard.writeText(iframe_code);
    set_copied(true);
    setTimeout(() => set_copied(false), 1500);
  };

  /*------- RENDERER -------*/
  return (
    <div className="flex flex-col gap-1.5">
      {/* LABEL */}
      <Label htmlFor="iframe-code" className="text-xs font-medium">
        Embed this map
      </Label>

      {/* INPUT */}
      <div className="relative w-full">
        <Input
          id="iframe-code"
          className="text-xs font-mono pr-10"
          type="text"
          value={iframe_code}
          readOnly
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-fit h-fit max-h-full p-2.5 absolute right-0 top-0"
                onClick={handle_click}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs font-medium">Copy code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
