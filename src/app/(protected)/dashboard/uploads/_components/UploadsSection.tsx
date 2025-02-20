"use client";

// TYPES
import { Version } from "@/interfaces/version";

// LIBRARIES
import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";

// SERVICES
import { version_services } from "@/services/version.services";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";
import { Progress } from "@/components/ui/Progress";
import { Card, CardContent } from "@/components/ui/Card";

export default function UploadsSection() {
  /*------- ATTRIBUT -------*/
  const [uploads, set_uploads] = useState<Version[]>([]);
  const [is_loading, set_loading] = useState<boolean>(false);
  const [error, set_error] = useState<string | null>(null);

  /*------- METHODS -------*/
  const fetch_uploads = async () => {
    try {
      set_loading(true);
      set_error(null);
      const versions =
        await version_services.get_recent_versions_from_user_async();

      set_uploads(versions);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      set_error(
        error instanceof Error ? error.message : "Failed to fetch uploads"
      );
    } finally {
      set_loading(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    fetch_uploads();
  }, []);

  /*-------- RENDERER -------*/
  if (is_loading) {
    return <PageLoader />;
  }

  return (
    <div className="container min-h-full mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <h2 className="text-2xl font-bold">Last uploads</h2>

        <div className="flex flex-col space-y-4">
          {/* LOADER */}
          {is_loading && uploads.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Retrieving your recent tasks...
            </p>
          )}

          {/* ERROR */}
          {!is_loading && error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* EMPTY STATE */}
          {!is_loading && uploads.length === 0 && !error && (
            <p className="text-sm text-muted-foreground">
              You haven't uploaded any maps recently.
            </p>
          )}

          {/* UPLOADS */}
          {!is_loading &&
            uploads.map((upload) => (
              <UploadItem key={upload.id} upload={upload} />
            ))}
        </div>
      </div>
    </div>
  );
}

interface UploadItemProps {
  upload: Version;
}

function UploadItem({ upload }: UploadItemProps) {
  // Format the date
  const formatted_date = new Date(upload.created_time).toLocaleString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );

  // Get status color and icon
  const get_status_info = () => {
    const status = upload.state.status;

    switch (status) {
      case "uploading":
      case "processing":
        return {
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          text:
            upload.state.status === "processing" ? "Processing" : "Uploading",
        };
      case "completed":
        return {
          color: "text-green-500",
          bgColor: "bg-green-100",
          icon: null,
          text: "Completed",
        };
      case "failed":
        return {
          color: "text-red-500",
          bgColor: "bg-red-100",
          icon: null,
          text: "Failed",
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          icon: null,
          text: "Unknown",
        };
    }
  };

  const status_info = get_status_info();

  return (
    <Card className="hover:bg-hover/50 transition-colors relative">
      <Link href={`/map/${upload.map_id}`} className="absolute inset-0 z-1" />

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status_info.bgColor} ${status_info.color} mr-2`}
            >
              {status_info.icon && (
                <span className="mr-1">{status_info.icon}</span>
              )}
              {status_info.text}
            </span>
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatted_date}
            </span>
          </div>
        </div>

        {(upload.state.status === "processing" ||
          upload.state.status === "uploading") && (
          <div className="mt-2">
            <Progress value={upload.state.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{upload.state.message}</span>
              <span>{Math.round(upload.state.progress)}%</span>
            </div>
          </div>
        )}

        {upload.state.status === "failed" && upload.state.message && (
          <p className="text-sm text-red-500 mt-2">{upload.state.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
