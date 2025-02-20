"use client";

// INTERFACES
import { FormatOption } from "@/services/file.services";

// LIBRARIES
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DownloadIcon, Loader2Icon, ChevronDownIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { AlertCircle } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { file_services } from "@/services/file.services";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Alert, AlertDescription } from "@/components/ui/Alert";

/*======= COMPONENTS =======*/
export default function DownloadButton() {
  /*------- ATTRIBUTES -------*/
  const { is_authenticated } = useAuthStore();
  const [map_id, selected_version, download_version] = useMapStore(
    useShallow((state) => [
      state.map?.id,
      state.selected_version,
      state.download_version,
    ])
  );

  const [versions] = useMapStore(useShallow((state) => [state.versions]));

  const [downloading, set_downloading] = useState(false);
  const [formats, set_formats] = useState<FormatOption[]>([]);
  const [selected_format, set_selected_format] = useState<string | null>(null);
  const [loading_formats, set_loading_formats] = useState(false);
  const [error_message, set_error_message] = useState<string | null>(null);
  const [show_error_dialog, set_show_error_dialog] = useState(false);
  const [show_auth_dialog, set_show_auth_dialog] = useState(false);

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!map_id) return;

    const load_formats = async () => {
      try {
        set_loading_formats(true);
        const list = await file_services.get_download_formats_async(map_id);
        const default_format = list.find((f) => f.available)?.id || null;

        set_formats(list);
        set_selected_format(default_format);
      } catch (err: unknown) {
        console.error("Failed to load download formats:", err);
      } finally {
        set_loading_formats(false);
      }
    };

    load_formats();
  }, [map_id]);

  /*------- METHODS -------*/
  const get_download_button_text = () => {
    if (loading_formats) {
      return "Loading...";
    }

    if (downloading) {
      return "Downloading...";
    }

    // Get just the format name without any description
    const formatName =
      formats.find((format) => format.id === selected_format)?.name || "File";

    // Make the format name more concise by removing common words
    const shortFormatName = formatName
      .replace("FlatGeobuf", "FGB")
      .replace("GeoJSON", "JSON");

    if (selected_version) {
      const versionText = selected_version?.alias
        ? `(${selected_version.alias})`
        : "(Selected)";
      return `${shortFormatName} ${versionText}`;
    }

    return `${shortFormatName}`;
  };

  const handle_download = async (format?: string) => {
    if (!map_id) return;

    if (!is_authenticated) {
      set_show_auth_dialog(true);
      return;
    }

    // Ensure format is a non-empty string if selected
    const selected_format = format && format.trim() !== "" ? format : undefined;

    try {
      set_downloading(true);

      // Determine which version to use - selected version or latest available
      const version_to_use =
        selected_version || (versions.length > 0 ? versions[0] : null);

      // For version downloads, try the new native format approach first
      if (version_to_use) {
        const success = await try_native_download(
          version_to_use.id,
          selected_format
        );
        if (success) {
          return; // Native download succeeded
        }
        // If native download failed, fall back to blob method
      }

      // Fallback: Use blob method for all other cases
      let blob: Blob;
      let file_name: string;

      if (version_to_use) {
        try {
          const result = await download_version(
            version_to_use.id,
            selected_format
          );
          blob = result.blob;
          file_name = result.filename;
        } catch (error) {
          console.error("Error downloading version:", error);
          throw error;
        }
      } else {
        // Fall back to the original download method if no version is available
        try {
          const result = await file_services.download_file_async(
            map_id,
            selected_format
          );

          file_name = result.name;
          blob = result.content;
        } catch (error) {
          console.error("Error downloading file:", error);
          throw error;
        }
      }

      // Create a temporary link and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file_name;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "Download started",
        description: "Your file is being downloaded",
      });
    } catch (error: any) {
      console.error("Download error details:", error);

      if (!!error.message && error.message.includes("too large")) {
        // Show the large file error dialog
        set_error_message(error.message);
        set_show_error_dialog(true);
        return;
      }

      const message = error?.message || "Failed to download map";
      toast({
        title: "Download failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      set_downloading(false);
    }
  };

  const try_native_download = async (
    version_id: string,
    format?: string
  ): Promise<boolean> => {
    try {
      // Get download URL for native formats - use Firebase auth
      const { user } = useAuthStore.getState();
      if (!user) {
        return false;
      }

      const auth_token = await user.getIdToken();
      if (!auth_token) {
        return false;
      }

      const fetch_url = `${
        process.env.NEXT_PUBLIC_MAPHUB_API_URL
      }/versions/${version_id}/download-url${
        format ? `?file_format=${format}` : ""
      }`;

      const response = await fetch(fetch_url, {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      if (!data.is_native || !data.download_url) {
        return false;
      }

      // Use browser-native download with the GCP signed URL
      // The signed URL is already complete, no need to prepend API URL
      window.location.href = data.download_url;

      toast({
        title: "Download started",
        description: "Check your browser's download manager for progress",
      });

      return true;
    } catch (error) {
      console.error("Native download failed:", error);
      return false;
    }
  };

  /*------- RENDER -------*/
  return (
    <div className="space-y-1">
      <DropdownMenu>
        <div className="flex w-full">
          <Button
            variant="primary"
            className={`flex-1 flex items-center justify-center px-2 min-h-[36px] h-auto py-1.5 ${
              formats.length > 1 ? "rounded-r-none" : ""
            }`}
            onClick={() => handle_download(selected_format || undefined)}
            disabled={downloading}
          >
            {loading_formats ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : downloading ? (
              <>
                <span>Downloading...</span>
                <Loader2Icon className="h-4 w-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                <span className="text-xs text-center line-clamp-2">
                  {get_download_button_text()}
                </span>
                <DownloadIcon className="h-4 w-4 flex-shrink-0 ml-2" />
              </>
            )}
          </Button>

          {/* DROPDOWN TRIGGER */}
          {formats.length > 1 && (
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                className="rounded-l-none border-l border-primary-foreground/20 px-2 min-h-[36px] h-auto"
                disabled={downloading}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          )}
        </div>

        {/* DROPDOWN MENU */}
        <DropdownMenuContent align="end" className="w-80">
          {formats
            .filter((format) => format.available)
            .map((format) => (
              <DropdownMenuItem
                key={format.id}
                onClick={() => {
                  set_selected_format(format.id);
                }}
                className="flex flex-col items-start py-2"
              >
                <div className="font-medium">{format.name}</div>
                <div className="text-xs text-muted-foreground">
                  {format.description}
                </div>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Error Dialog */}
      <ErrorDialog
        open={show_error_dialog}
        onClose={() => set_show_error_dialog(false)}
        message={error_message}
      />

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={show_auth_dialog}
        onClose={() => set_show_auth_dialog(false)}
      />
    </div>
  );
}

function ErrorDialog({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Too Large File</DialogTitle>
          <DialogDescription>
            This file exceeds our size limit for direct downloads.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {message ||
              "File is too large for download (>1GB). Please contact us on Discord for alternative download options."}
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>

          <Link
            className="btn btn-primary"
            href="https://discord.gg/ufqVjqpVGw"
            target="_blank"
          >
            Join Our Discord
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AuthRequiredDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  /*------- STATE -------*/
  const router = useRouter();

  /*------- HANDLERS -------*/
  const handle_login = () => {
    localStorage.setItem("login_return_url", window.location.pathname);
    router.push("/login");
  };

  /*------- RENDER -------*/
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-y-0">
        {/* HEADER */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base flex flex-row items-center gap-x-2">
            <AlertCircle className="h-5 w-5 m-0" />
            Authentication Required
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="p-4">
          <p>You need to be logged in to download maps.</p>
        </div>

        {/* FOOTER */}
        <DialogFooter className="px-4 py-2 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handle_login}>Log In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
