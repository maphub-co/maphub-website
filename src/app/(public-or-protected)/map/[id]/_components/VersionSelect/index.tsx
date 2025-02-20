"use client";

// TYPES
import { Version } from "@/interfaces/version";

// LIBRARIES
import { useEffect, useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Edit,
  Loader2,
  Plus,
  Tag,
  X,
} from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import VersionUploadModal from "./VersionUploadModal";

/*======= COMPONENT =======*/
export default function VersionSelect({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const [
    is_loading,
    map_id,
    is_editable,
    versions,
    selected_version,
    set_selected_version,
    load_versions,
    switch_version,
    load_layer_infos,
  ] = useMapStore(
    useShallow((state) => [
      state.is_loading,
      state.map?.id,
      state.is_editable,
      state.versions,
      state.selected_version,
      state.set_selected_version,
      state.load_versions,
      state.switch_version,
      state.load_layer_infos,
    ])
  );
  const [is_upload_open, set_upload_open] = useState(false);

  const sorted_versions = [...versions].sort(
    (a, b) =>
      new Date(b.created_time).getTime() - new Date(a.created_time).getTime()
  );

  /*------- METHODS -------*/
  const handle_change = useCallback(
    async (version: Version) => {
      if (!is_editable) return;
      if (version.state?.status !== "completed") return;
      if (selected_version?.id === version.id) return;

      try {
        if (!is_editable) {
          if (is_loading || !map_id) return;

          load_layer_infos(map_id, version.id);
          set_selected_version(version);

          toast({
            title: "Version changed",
            description: `Displaying ${version.version_description}`,
          });
          return;
        }

        await switch_version(version.id);
        toast({
          title: "Version changed",
          description: "Displaying selected version",
        });
      } catch (error) {
        console.error("Failed to switch version:", error);
        toast({
          title: "Error",
          description: "Failed to switch to selected version",
          variant: "destructive",
        });
      }
    },
    [map_id, selected_version, !is_editable]
  );

  /*------- HOOKS -------*/
  // Periodically refresh versions list to update processing status
  useEffect(() => {
    if (versions.length === 0 || !is_editable) return;

    // Check if any version is still processing
    const has_processing_versions = versions.some(
      (version) => version.state?.status === "processing"
    );

    if (has_processing_versions) {
      // Refresh every 5 seconds if there are processing versions
      const interval = setInterval(() => {
        load_versions().catch((error) => {
          console.error("Failed to refresh versions:", error);
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [versions, load_versions, !is_editable]);

  /*------- RENDERER -------*/
  if (is_loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading versions...</span>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No versions available
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <div className="flex items-center gap-x-2">
          <span>Version :</span>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-fit px-3 justify-start", className)}
              disabled={!is_editable}
            >
              {selected_version ? (
                <>
                  <span className="flex-1 flex items-center text-left text-ellipsis overflow-hidden font-semibold mr-2">
                    {selected_version.version_description}
                    {selected_version.alias && (
                      <Badge variant="outline" className="ml-2">
                        {selected_version.alias}
                      </Badge>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex-1 flex items-center text-left text-ellipsis overflow-hidden font-semibold mr-2">
                    {sorted_versions[0]?.version_description}
                    {sorted_versions[0]?.alias && (
                      <Badge variant="outline" className="ml-2">
                        {sorted_versions[0].alias}
                      </Badge>
                    )}
                  </span>
                </>
              )}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent
          className="w-full lg:min-w-80 p-2 max-h-96 overflow-y-auto"
          align="start"
        >
          {/* VERSIONS */}
          {sorted_versions.map((version) => (
            <DropdownMenuItem
              key={version.id}
              id={version.id}
              className={cn(
                version.id === selected_version?.id
                  ? "bg-muted"
                  : "border-border hover:bg-hover/30"
              )}
              onClick={() => handle_change(version)}
              disabled={version.state?.status !== "completed"}
            >
              <VersionItem
                version={version}
                active={version.id === selected_version?.id}
                readonly={!is_editable}
              />
            </DropdownMenuItem>
          ))}

          {/* NEW VERSION */}
          {is_editable && (
            <Button
              variant="ghost"
              className="w-full p-2 justify-start text-primary hover:text-primary hover:bg-secondary/20"
              onClick={() => set_upload_open(true)}
            >
              <Plus className="size-4" />
              New Version
            </Button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Upload Modal */}
      <VersionUploadModal
        isOpen={is_upload_open}
        onClose={() => set_upload_open(false)}
      />
    </>
  );
}

const VersionItem = ({
  version,
  active,
  readonly,
}: {
  version: Version;
  active: Boolean;
  readonly: Boolean;
}) => {
  /*------- ATTRIBUTES -------*/
  const apply_alias = useMapStore(useShallow((state) => state.apply_alias));
  const [editing_version_id, set_editing_version_id] = useState<string | null>(
    null
  );
  const [custom_alias, set_custom_alias] = useState<string>("");
  const is_processing = version.state?.status === "processing";
  const is_failed = version.state?.status === "failed";
  const is_selectable = version.state?.status === "completed";

  /*------- METHODS -------*/
  const handle_apply_alias = async (version_id: string, alias: string) => {
    if (readonly) return;

    try {
      await apply_alias(version_id, alias);
      toast({
        title: "Success",
        description: `Version marked as "${alias}"`,
      });
      set_editing_version_id(null);
      set_custom_alias("");
    } catch (error) {
      console.error("Failed to apply alias:", error);
      toast({
        title: "Error",
        description: "Failed to apply alias to version",
        variant: "destructive",
      });
    }
  };

  const start_editing_alias = (version_id: string, current_alias?: string) => {
    if (readonly) return;
    set_editing_version_id(version_id);
    set_custom_alias(current_alias || "");
  };

  const cancel_editing_alias = () => {
    set_editing_version_id(null);
    set_custom_alias("");
  };

  /*------- RENDERER -------*/
  return (
    <div
      className={cn(
        "w-full flex justify-between items-start",
        "transition-all cursor-pointer",
        !is_selectable && "opacity-80"
      )}
    >
      <div className="w-full flex flex-col gap-1">
        {/* TITLE */}
        <div className="flex items-center font-medium">
          {version.version_description}
          {version.alias && (
            <Badge variant={active ? "muted" : "outline"} className="ml-2">
              {version.alias}
            </Badge>
          )}

          {is_processing && (
            <Badge
              variant="outline"
              className="ml-2 bg-blue-500/10 text-blue-500 border-blue-500/30"
            >
              processing
            </Badge>
          )}

          {is_failed && (
            <Badge
              variant="outline"
              className="ml-2 bg-destructive/10 text-destructive border-destructive/30"
            >
              failed
            </Badge>
          )}
        </div>

        {/* CREATION TIME */}
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="size-3 mr-1" />
          {formatDistanceToNow(new Date(version.created_time), {
            addSuffix: true,
          })}
        </div>

        {is_processing && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{version.state.message || "Processing..."}</span>
              <span>{version.state.progress || 0}%</span>
            </div>
            <Progress value={version.state.progress || 0} className="h-1.5" />
          </div>
        )}

        {is_failed && version.state.message && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-destructive">
                  <AlertCircle className="size-3 mr-1" />
                  <span className="truncate">Error processing</span>
                </div>
              </TooltipTrigger>

              <TooltipContent>
                <p className="max-w-xs">{version.state.message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {!readonly && (
        <div className="flex space-x-1">
          {editing_version_id === version.id ? (
            <div
              className="flex items-center space-x-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                value={custom_alias}
                onChange={(e) => set_custom_alias(e.target.value)}
                placeholder="Enter alias"
                className="h-8 w-32 text-xs"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && custom_alias.trim()) {
                    handle_apply_alias(version.id, custom_alias.trim());
                  } else if (e.key === "Escape") {
                    cancel_editing_alias();
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  if (custom_alias.trim()) {
                    handle_apply_alias(version.id, custom_alias.trim());
                  }
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  cancel_editing_alias();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Set version alias"
                  onClick={(e) => e.stopPropagation()}
                  disabled={!is_selectable}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handle_apply_alias(version.id, "latest");
                  }}
                >
                  Set as "latest"
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handle_apply_alias(version.id, "stable");
                  }}
                >
                  Set as "stable"
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    start_editing_alias(version.id, version.alias);
                  }}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Custom alias...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};
