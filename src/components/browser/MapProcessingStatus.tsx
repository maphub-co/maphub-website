"use client";

// TYPES
import { VersionState } from "@/interfaces/version";

// LIBRARIES
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

/*======= INTERFACES =======*/
interface MapProcessingStatusProps {
  version_id: string;
  on_complete?: () => void;
  className?: string;
}

/*======= COMPONENT =======*/
export default function MapProcessingStatus({
  version_id,
  on_complete,
  className,
}: MapProcessingStatusProps) {
  /*------- ATTRIBUTES -------*/
  const { load_version } = useMapStore();
  const [version_state, set_version_state] = useState<VersionState | null>(
    null
  );

  /*------- METHODS -------*/
  const fetch_version = async () => {
    const last_update = await load_version(version_id);
    set_version_state(last_update.state);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!version_id.trim()) {
      return;
    }

    if (!version_state) {
      fetch_version();
      return;
    }

    if (version_state?.status === "completed" && on_complete) {
      on_complete();
      return;
    }

    let interval: NodeJS.Timeout;

    if (
      version_state?.status !== "completed" &&
      version_state?.status !== "failed"
    ) {
      interval = setInterval(() => {
        fetch_version();
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [version_state, version_id]);

  /*------- RENDERER -------*/
  if (!version_state) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading map process...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Retrieving map process information...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render different UI based on task status
  const renderStatusContent = () => {
    switch (version_state?.status) {
      case "uploading":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Preparing for processing
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Progress value={version_state.progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Preparing file for processing...
              </p>
            </CardContent>
          </>
        );

      case "processing":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Map
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Progress value={version_state.progress} className="mb-2" />
              <div className="flex justify-between text-sm mb-1">
                <span>{version_state.message}</span>
                <span>{Math.round(version_state.progress)}%</span>
              </div>
            </CardContent>
          </>
        );

      case "completed":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                Processing Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={100} className="mb-2 bg-green-100" />
              <p className="text-sm text-muted-foreground">
                Your map has been successfully processed and is ready to use.
              </p>
            </CardContent>
          </>
        );

      case "failed":
        return (
          <>
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertCircle className="size-5 mr-2" />
                Processing Failed
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <Progress
                value={version_state.progress}
                className="mb-2 bg-red-100"
              />

              <p className="text-sm text-destructive">
                {version_state.message ||
                  "An error occurred during processing."}
              </p>

              <p className="mt-4 text-sm text-muted-foreground">
                A report of your issue as already been sent to our team. If you
                need anything, feel free to contact us directly via our discord
                server :{" "}
                <Link
                  href="https://discord.gg/ufqVjqpVGw"
                  target="_blank"
                  className="btn btn-link btn-sm"
                >
                  Contact us on Discord
                </Link>
              </p>
            </CardContent>
          </>
        );

      default:
        return (
          <>
            <CardHeader>
              <CardTitle>Unknown Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The task is in an unknown state.
              </p>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className={cn("w-full", className)}>{renderStatusContent()}</Card>
  );
}
