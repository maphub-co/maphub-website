"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  CopyIcon,
  CheckIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";

// SERVICES
import { map_services } from "@/services/map.services";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

/*======= COMPONENT =======*/
export default function TilerUrl() {
  const [map_id, selected_version] = useMapStore(
    useShallow((state) => [state.map?.id, state.selected_version])
  );
  const [tiler_url, set_tiler_url] = useState("");
  const [copied, set_copied] = useState(false);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [is_processing, set_is_processing] = useState(false);
  const ui_url = loading ? "Loading..." : tiler_url;

  /*------- METHODS -------*/
  const fetch_url = async () => {
    if (!map_id) return;

    try {
      set_loading(true);
      set_error(null);
      set_is_processing(false);

      // Get tiler URL with the selected version if available
      const url = await map_services.get_tiler_url_async(
        map_id,
        selected_version?.id || undefined,
        selected_version?.alias || undefined
      );

      // Remove quotation marks from the start and end if they exist
      const cleanedUrl =
        url.startsWith('"') && url.endsWith('"')
          ? url.substring(1, url.length - 1)
          : url;

      set_tiler_url(cleanedUrl);
    } catch (error) {
      console.error(error);

      set_error(
        error instanceof Error ? error.message : "Failed to fetch tiler URL"
      );
    } finally {
      set_loading(false);
    }
  };

  const handle_click = () => {
    navigator.clipboard.writeText(tiler_url);
    set_copied(true);
    setTimeout(() => set_copied(false), 1500);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!map_id) return;
    fetch_url();
  }, [map_id, selected_version?.id, selected_version?.alias]); // Refetch when selected version or alias changes

  return (
    <div className="flex flex-col gap-1.5">
      {/* LABEL */}
      <div className="flex items-center gap-1">
        <Label htmlFor="tiler-url" className="text-xs font-medium">
          Tiler URL
        </Label>
        {selected_version && (
          <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
            {selected_version?.alias
              ? `Using "${selected_version.alias}" alias`
              : "Version specific"}
          </Badge>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" className="max-w-xs">
              <p>
                Use this URL in web mapping applications like QGIS or Leaflet.
                The tiler service allows you to integrate this map with other
                GIS tools.
                {selected_version && (
                  <span className="block mt-1 text-xs text-amber-500">
                    {selected_version?.alias
                      ? `This URL uses the "${selected_version.alias}" alias, which means that if you update the map with a new version and keep the same alias, external applications will automatically use the updated version.`
                      : "This URL is for a specific version and won't change even if newer versions are uploaded. Consider using an alias instead for dynamic updates."}
                  </span>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className={`my-2 flex items-center text-xs gap-1 ${
            is_processing ? "text-amber-500" : "text-destructive"
          }`}
        >
          {is_processing ? (
            <Loader2Icon className="h-3 w-3 animate-spin" />
          ) : (
            <AlertCircleIcon className="h-3 w-3" />
          )}
          <span>{error}</span>
        </div>
      )}

      {/* CONTENT */}
      {!error && (
        <div className="relative w-full">
          <Input
            id="tiler-url"
            className="text-xs font-mono pr-10"
            type="text"
            value={ui_url}
            readOnly
            disabled={loading}
            title={tiler_url}
          />

          {!loading && tiler_url && (
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
                  <p className="text-xs font-medium">Copy URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}

      {/* RETRY BUTTON FOR PROCESSING MAPS */}
      {is_processing && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={fetch_url}
        >
          <RefreshCwIcon className="h-3 w-3 mr-1" />
          Check Again
        </Button>
      )}
    </div>
  );
}
