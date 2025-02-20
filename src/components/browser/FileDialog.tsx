"use client";

// TYPES
import { Version } from "@/interfaces/version";

// LIBRARIES
import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import JSZip from "jszip";
import { UploadIcon, Loader2, TriangleAlert } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { file_services } from "@/services/file.services";
import { get_organization_quotas_async } from "@/services/organization.services";

// STORES
import { useUserStore } from "@/stores/user.store";

// UTILS
import {
  validate_shapefile_components,
  validate_geospatial_file_format,
  is_shapefile_component,
} from "@/utils/upload.utils";

// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import MapProcessingStatus from "@/components/browser/MapProcessingStatus";
import FunFacts from "@/components/browser/FunFacts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Progress } from "../ui/Progress";
import Link from "next/link";

/*======= INTERFACES =======*/
interface FileDialogProps {
  is_open: boolean;
  folder_id: string;
  on_cancel: () => void;
  on_close: () => void;
  on_upload_success: () => void;
}

interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

interface UpgradePlanModalProps {
  is_open: boolean;
  on_close: () => void;
  error_message: string;
}

/*======= COMPONENT =======*/
export default function FileDialog({
  is_open,
  folder_id,
  on_cancel,
  on_close,
  on_upload_success,
}: FileDialogProps) {
  /*------- ATTRIBUTS -------*/
  const { id } = useParams();
  const pathname = usePathname();
  const is_organization = pathname.includes("/organizations/");
  const { user, quotas } = useUserStore();
  const [is_dragging, set_is_dragging] = useState(false);
  const [map_name, set_map_name] = useState("");
  const [selected_files, set_selected_files] = useState<File[]>([]);
  const [file_validation_message, set_file_validation_message] =
    useState<string>("");
  const [is_uploading, set_uploading] = useState(false);
  const [progress, set_progress] = useState(0);
  const [first_map_version, set_first_map_version] = useState<Version | null>(
    null
  );
  const [error, set_error] = useState<string | null>(null);
  const [subscription_error, set_subscription_error] = useState<string | null>(
    null
  );
  const file_input_ref = useRef<HTMLInputElement>(null);
  const [max_size_limit, set_max_size_limit] = useState(1 * 1024 * 1024 * 1024); // 1GB

  const format_file_size = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${bytes / (1024 * 1024 * 1024)}GB`;
    }
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  };

  const max_file_size_display = format_file_size(max_size_limit);

  /*------- METHODS -------*/
  const reset_form = () => {
    set_error(null);
    set_uploading(false);
    set_first_map_version(null);
    set_progress(0);
    set_selected_files([]);
    set_file_validation_message("");
    set_map_name("");
  };

  const create_zip_from_shapefiles = async (files: File[]): Promise<File> => {
    const zip = new JSZip();

    // Add all files to zip
    files.forEach((file) => {
      zip.file(file.name, file);
    });

    // Generate zip content
    const content = await zip.generateAsync({ type: "blob" });

    // Create a File object from the zip content
    // Use the base name from the .shp file
    const shp_file = files.find((file) =>
      file.name.toLowerCase().endsWith(".shp")
    );
    const base_name = shp_file
      ? shp_file.name.replace(/\.shp$/i, "")
      : "shapefile";

    return new File([content], `${base_name}.zip`, { type: "application/zip" });
  };

  const process_files = useCallback(
    (files: File[], reset_input?: () => void) => {
      if (files.length === 0) return;

      // Check if we have a shapefile set
      if (files.length > 1) {
        const is_shapefile_set = validate_shapefile_components(files);

        if (is_shapefile_set) {
          // Handle as shapefile group
          set_selected_files(files);

          // Extract the base name from the .shp file
          const shp_file = files.find((file) =>
            file.name.toLowerCase().endsWith(".shp")
          );
          if (shp_file) {
            const base_name = shp_file.name.replace(/\.shp$/i, "");
            set_map_name(base_name);
          }

          set_file_validation_message("Valid shapefile components detected");
        } else {
          // Multiple files selected but not a valid shapefile set
          toast({
            variant: "destructive",
            title: "Invalid file selection",
            description:
              "Shapefiles require all components (.shp, .shx, .dbf, AND .prj) with matching names. Please select a complete shapefile set.",
          });

          // Reset the file input if reset function is provided
          if (reset_input) {
            reset_input();
          }
          set_selected_files([]);
          set_file_validation_message("");
        }
      } else {
        // Single file handling
        const file = files[0];

        // Check if it's a shapefile component
        if (is_shapefile_component(file)) {
          toast({
            variant: "destructive",
            title: "Incomplete shapefile",
            description:
              "Shapefiles require all components (.shp, .shx, .dbf, AND .prj) with matching names. Please select a complete shapefile set.",
          });

          // Reset the file input if reset function is provided
          if (reset_input) {
            reset_input();
          }
          set_selected_files([]);
          set_file_validation_message("");
          return;
        }

        if (!validate_geospatial_file_format(file)) {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description:
              "Please upload a compatible format (.tif, .tiff, .geojson, .fgb, .kml, .gpkg, .xlsx, .csv)",
          });

          // Reset the file input if reset function is provided
          if (reset_input) {
            reset_input();
          }
          set_selected_files([]);
          set_file_validation_message("");
          return;
        }

        if (file.size > max_size_limit) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: `Maximum file size is ${max_file_size_display}`,
          });

          // Reset the file input if reset function is provided
          if (reset_input) {
            reset_input();
          }
          set_selected_files([]);
          set_file_validation_message("");
          return;
        }

        const file_name_without_extension = file.name.replace(/\.[^/.]+$/, "");
        set_map_name(file_name_without_extension);
        set_selected_files([file]);
        set_file_validation_message("");
      }
    },
    [max_size_limit, max_file_size_display, toast]
  );

  const handle_file_selection = (event: FileUploadEvent) => {
    const files = Array.from(event.target.files);
    const reset_input = () => {
      event.target.value = "";
    };
    process_files(files, reset_input);
  };

  const handle_drag_over = (e: React.DragEvent) => {
    e.preventDefault();
    set_is_dragging(true);
  };

  const handle_drag_leave = () => {
    set_is_dragging(false);
  };

  const handle_drop = (e: React.DragEvent) => {
    e.preventDefault();
    set_is_dragging(false);

    const files = Array.from(e.dataTransfer.files);
    process_files(files);
  };

  const handle_upload = async () => {
    // Reset error state when trying to upload again
    set_error(null);

    if (selected_files.length === 0 || !map_name || !folder_id) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }

    set_uploading(true);

    try {
      // Process files before upload
      let file_to_upload: File;

      if (selected_files.length > 1) {
        // Create zip from shapefile components
        file_to_upload = await create_zip_from_shapefiles(selected_files);
      } else {
        // Single file upload
        file_to_upload = selected_files[0];
      }

      const first_version = await file_services.upload_file_async({
        folder_id,
        map_name,
        is_public: false,
        file: file_to_upload,
        on_progress: (progress: number) => set_progress(progress),
      });

      set_first_map_version(first_version);

      toast({
        title: "Upload successful",
        description: "Your file is being processed on the server",
      });
    } catch (error: any) {
      // Handle 402 error specifically - check for the custom error format
      if (!!error.message && error.message.includes("402")) {
        const payment_error_message =
          error.data?.detail ||
          "This feature requires a higher subscription plan.";
        set_subscription_error(payment_error_message);
        return;
      }

      set_error("Failed to upload. Please try again later.");
    } finally {
      set_uploading(false);
      // Only reset form fields that don't affect the processing display
      set_progress(0);
      set_selected_files([]);
      set_file_validation_message("");
      set_map_name("");
      // Don't reset first_map_version here to allow processing status to display
    }
  };

  const handle_complete = () => {
    // Call the success callback
    on_upload_success();
    on_close();
  };

  const handle_cancel = () => {
    reset_form();
    on_cancel();
  };

  const handle_close = () => {
    reset_form();
    on_close();
  };

  useEffect(() => {
    if (!is_organization) return;

    const load_organization_quotas = async () => {
      const response = await get_organization_quotas_async(id as string);
      set_max_size_limit(response.file_size_limit);
    };

    load_organization_quotas();
  }, [is_organization]);

  /*------- RENDERER -------*/
  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && handle_close()}>
      {/* CONTENT */}
      <DialogContent
        closeButton={null}
        className="w-fit min-w-4xl p-0 gap-y-0"
        childDialog={
          <UpgradePlanModal
            is_open={!!subscription_error}
            on_close={() => set_subscription_error(null)}
            error_message={subscription_error || ""}
          />
        }
      >
        <div className="w-full flex flex-col gap-y-8 p-4">
          {/* FORM */}
          {!is_uploading && !first_map_version && (
            <>
              {/* FILE UPLOAD */}
              <div
                className={`w-full text-center border-2 border-dashed flex flex-col gap-y-4 rounded-lg p-4 md:p-8 transition-colors ${
                  is_dragging ? "border-primary bg-primary/10" : ""
                }`}
                onDragOver={handle_drag_over}
                onDragLeave={handle_drag_leave}
                onDrop={handle_drop}
              >
                {selected_files.length === 0 ? (
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-y-2 mb-2">
                    <UploadIcon className="h-8 w-8 mx-auto" />

                    <DialogTitle className="text-lg xl:text-xl">
                      Upload your files
                    </DialogTitle>

                    <span className="text-sm">
                      Drag and drop your files here, or click to browse.
                    </span>

                    <span className="text-sm">
                      (Maximum file size: {max_file_size_display})
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-y-2 mb-2">
                    <span className="text-lg xl:text-xl">Selected files :</span>
                    <ul className="w-full p-2 flex flex-col gap-y-1 bg-muted text-xs text-left rounded max-h-24 overflow-y-scroll">
                      {selected_files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </li>
                      ))}
                    </ul>
                    {file_validation_message && (
                      <p className="text-xs text-green-500 mt-1">
                        {file_validation_message}
                      </p>
                    )}
                  </div>
                )}

                {/* FILE INPUT */}
                <Input
                  id="file-input"
                  type="file"
                  accept=".tif,.tiff,.geojson,.fgb,.kml,.gpkg,.xlsx,.csv,.shp,.shx,.dbf,.prj"
                  className="flex-1 max-w-96 mx-auto text-xs text-muted-foreground cursor-pointer"
                  onChange={handle_file_selection}
                  disabled={is_uploading}
                  multiple={true} // Allow multiple file selection
                  ref={file_input_ref}
                />

                {/* UPLOAD INSTRUCTIONS */}
                <p className="text-xs text-muted-foreground">
                  Supported formats : .tif .tiff .geojson .fgb .kml .gpkg .xlsx
                  .csv.
                  <br />
                  For shapefiles, select{" "}
                  <span className="font-semibold">
                    all required components
                  </span>{" "}
                  (.shp, .shx, .dbf, .prj)
                </p>
              </div>

              <div className="flex flex-col gap-y-2">
                <Label htmlFor="map-name">Title</Label>
                <Input
                  id="map-name"
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={map_name}
                  onChange={(e) => set_map_name(e.target.value)}
                  disabled={is_uploading}
                />
              </div>
            </>
          )}

          {/* UPLOADING */}
          {(is_uploading || !!first_map_version) && (
            <>
              <FunFacts is_active={true} layout="horizontal" />

              {/* Upload progress */}
              {is_uploading && (
                <Card className="border-none shadow-none">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Uploading file
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <Progress value={progress} className="mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Uploading file to the server...
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Processing status */}
              {!!first_map_version && (
                <MapProcessingStatus
                  className="border-none shadow-none"
                  version_id={first_map_version?.id}
                  on_complete={handle_complete}
                />
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="w-full border-t p-4">
          <Button
            variant="outline"
            onClick={handle_cancel}
            disabled={is_uploading}
          >
            {!!first_map_version &&
            (first_map_version.state.status === "uploading" ||
              first_map_version.state.status === "processing")
              ? "Continue in background"
              : "Close"}
          </Button>

          <Button
            onClick={handle_upload}
            disabled={is_uploading || !map_name || selected_files.length === 0}
          >
            {is_uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {is_uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const UpgradePlanModal = ({
  is_open,
  on_close,
  error_message,
}: UpgradePlanModalProps) => {
  /*------- ATTRIBUTS -------*/
  const { id } = useParams();
  const pathname = usePathname();

  const is_organization = pathname.includes("/organizations/");

  /*------- RENDERER -------*/
  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && on_close()}>
      <DialogContent className="sm:max-w-md p-0 gap-y-0">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center font-semibold">
            <TriangleAlert className="size-5 mr-2" />
            Subscription limit reached !
          </DialogTitle>
        </DialogHeader>

        {/* TEXT */}
        <div className="p-6">
          {is_organization ? (
            <p className="text-sm">
              You have reached the storage limit for your organization's plan.
            </p>
          ) : (
            <p className="text-sm">
              You have reached your personal storage limit. Please create an
              organization to increase your storage limit.
            </p>
          )}
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button variant="outline" onClick={on_close}>
            Close
          </Button>

          <Link
            href={
              is_organization
                ? `/organizations/${id}/settings/billing`
                : "/settings/organizations"
            }
            className="btn btn-primary btn-size-default w-fit"
          >
            {is_organization ? "Manage subscription" : "Create an organization"}
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
