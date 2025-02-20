"use client";

// LIBRARIES
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setExportImageSetting,
  cleanupExportImage,
  wrapTo,
} from "@kepler.gl/actions";
import { EXPORT_IMG_RATIOS, RESOLUTIONS } from "@kepler.gl/constants";
import { useShallow } from "zustand/react/shallow";
import { AlertCircle, Camera, Inbox, Loader2, UploadIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThumbnailViewer } from "../../ThumbnailViewer";

/*======= COMPONENTS =======*/
export default function ThumbnailEditor() {
  /*------- ATTRIBUTS -------*/
  const dispatch = useDispatch();
  const wrap_to_preview_map = wrapTo("map-preview");
  const image_export = useSelector(
    (state: any) => state.keplerGl?.["map-preview"]?.uiState.exportImage
  );
  const [map_id, layer_infos, map_visuals, thumbnail, update_thumbnail] =
    useMapStore(
      useShallow((state) => [
        state.map?.id,
        state.layer_infos,
        state.map?.visuals,
        state.thumbnail,
        state.update_thumbnail,
      ])
    );
  const [is_uploading, set_is_uploading] = useState(false);
  const [is_taking_screenshot, set_is_taking_screenshot] = useState(false);
  const [has_image_error, set_has_image_error] = useState(false);
  const file_input_ref = useRef<HTMLInputElement>(null);

  const is_legacy =
    !!map_visuals?.styles ||
    !!map_visuals?.qgis ||
    layer_infos?.type === "raster";

  /*------- METHODS -------*/
  const get_mapbox_screenshot = async () => {
    try {
      console.log("Starting screenshot capture process");

      // Wait for the map to be fully rendered
      console.log("Waiting for map to be fully rendered...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Try to access the map instance from our global registry
      const map_instance =
        typeof window !== "undefined"
          ? // @ts-ignore - Access the global map registry
            window.maphubMapInstances?.[`previewer-${map_id}`]
          : null;

      if (map_instance) {
        console.log("Found map instance in global registry");
        // Force the map to redraw
        map_instance.resize();
        // Give it a moment to complete the redraw
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Directly access the mapboxgl-canvas element which has the actual map content
      const map_canvas = document.querySelector(
        ".mapboxgl-canvas"
      ) as HTMLCanvasElement;

      if (!map_canvas) {
        throw new Error(
          "Map canvas not found. The map may not be properly loaded."
        );
      }

      // Get the image data directly from the WebGL canvas
      let image_data;
      try {
        image_data = map_canvas.toDataURL("image/png");
      } catch (e) {
        console.warn("Standard canvas capture failed:", e);
        throw new Error("Failed to capture map view. Please try again.");
      }

      if (!image_data || image_data.length < 1000) {
        throw new Error("Generated image appears to be empty or too small");
      }

      return image_data;
    } catch (error) {
      console.error("Failed to get mapbox screenshot:", error);
      throw error;
    }
  };

  const get_keplergl_screenshot = async () => {
    try {
      set_is_taking_screenshot(true);

      if (!image_export) {
        throw new Error("No Kepler state found");
      }

      if (image_export.processing) return;

      const { imageDataUri } = image_export;

      if (!imageDataUri) {
        throw new Error("Couldn't load image data URI");
      }

      return imageDataUri;
    } catch (error) {
      console.error("Failed to get keplergl screenshot:", error);
      throw error;
    }
  };

  /*------- HANDLERS -------*/
  const handle_file_change = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image",
      });
      return;
    }

    try {
      set_is_uploading(true);
      await update_thumbnail(file);

      // Reset the input and error state
      if (file_input_ref.current) {
        file_input_ref.current.value = "";
      }
      set_has_image_error(false);
    } catch (error) {
      let error_message = "Failed to upload thumbnail. Please try again.";
      if (error instanceof Error) {
        error_message = error.message;
      }

      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error_message,
      });
    } finally {
      set_is_uploading(false);
    }
  };

  const handle_capture_view = async () => {
    try {
      set_is_taking_screenshot(true);

      let image_data;

      if (is_legacy) {
        image_data = await get_mapbox_screenshot();
      } else {
        image_data = await get_keplergl_screenshot();
      }

      if (!image_data) {
        throw new Error("Failed to capture view");
      }

      // Upload the image
      await update_thumbnail(image_data);

      // Reset error state
      set_has_image_error(false);
    } catch (error) {
      let error_message = "Failed to capture view. Please try again.";
      if (error instanceof Error) {
        error_message = error.message;
        console.error("Error capturing view:", error);
      }

      toast({
        variant: "destructive",
        title: "Failed to capture map view. Please try again later.",
        description: error_message,
      });
    } finally {
      set_is_taking_screenshot(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    dispatch(
      wrap_to_preview_map(
        setExportImageSetting({
          exporting: true,
          processing: true, // pass true to trigger the image export
          ratio: EXPORT_IMG_RATIOS.SCREEN,
          resolution: RESOLUTIONS.ONE_X,
          legend: false,
          mapW: 800,
          mapH: 600,
        })
      )
    );

    return () => {
      dispatch(wrap_to_preview_map(cleanupExportImage()));
    };
  }, [dispatch]);

  /*------- RENDER -------*/
  const is_loading = is_uploading || is_taking_screenshot;

  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium">Thumbnail</label>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="min-h-40 shrink-0 aspect-video rounded-sm overflow-hidden group relative">
          {!thumbnail && <NoThumbnail />}

          {has_image_error && <ThumbnailError />}

          {thumbnail && !has_image_error && (
            <ThumbnailViewer
              fill
              sizes="100%"
              className="object-cover"
              alt="Map thumbnail"
              onError={() => set_has_image_error(true)}
            />
          )}

          {is_loading && (
            <div
              className={`
              absolute z-1
              flex flex-col gap-y-2 items-center justify-center
              inset-0 bg-black/50
              text-white text-sm
              backdrop-blur-sm 
            `}
            >
              <Loader2 className="h-6 w-6 animate-spin" />
              {is_uploading && <span>Uploading...</span>}
              {is_taking_screenshot && <span>Capturing...</span>}
            </div>
          )}
        </div>

        <div className="w-full h-full flex flex-col gap-y-4 ">
          <Label className="btn btn-outline btn-size-default border-foreground">
            <Input
              ref={file_input_ref}
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handle_file_change}
              disabled={is_loading}
            />
            <UploadIcon className="size-4" />
            Upload a picture
          </Label>

          <Button
            variant="outline"
            className="border-foreground"
            onClick={handle_capture_view}
            disabled={is_loading}
          >
            <Camera className="size-4" />
            Use current map style
          </Button>
        </div>
      </div>
    </div>
  );
}

const NoThumbnail = () => {
  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-muted text-muted-foreground border-2 border-dashed border-border rounded-sm">
      <Inbox className="h-6 w-6 mb-1" />
      <p className="text-sm font-medium">No thumbnail set</p>
      <p className="text-xs text-center">
        Upload an image or capture the current view.
      </p>
    </div>
  );
};

const ThumbnailError = () => (
  <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-muted text-muted-foreground rounded-sm">
    <AlertCircle className="h-6 w-6" />
    <p className="text-sm font-medium">Failed to load thumbnail</p>
    <p className="text-xs text-center">
      Upload an image or capture the current view.
    </p>
  </div>
);
