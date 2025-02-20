"use client";

// INTERFACES
import { MapInfos } from "@/interfaces/map";

// LIBRARIES
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { File, MoreVertical, Trash2 } from "lucide-react";

// SERVICES
import { map_services } from "@/services/map.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { MapThumbnail } from "./MapThumbnail";

/*======= INTERFACES =======*/
interface FileItemProps {
  className?: string;
  view: "list" | "grid";
  params: MapInfos;
  on_delete?: () => void;
}

/*======= COMPONENT =======*/
export default function FileItem({
  className,
  view,
  params,
  on_delete,
}: FileItemProps) {
  /*------- ATTRIBUTS -------*/
  const router = useRouter();
  const { id, name, type, updated_time } = params;
  const [is_deleting, set_is_deleting] = useState(false);

  const { attributes, listeners, setNodeRef, transform, active, isDragging } =
    useDraggable({
      id,
      data: {
        type: "file",
        map: {
          id,
          name,
        },
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  /*------- HANDLERS -------*/
  const handle_delete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this map? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      set_is_deleting(true);
      await map_services.delete_map_async(id);
      on_delete?.();
    } catch (error) {
      console.error("Failed to delete map:", error);
    } finally {
      set_is_deleting(false);
    }
  };

  /*------- RENDERER -------*/
  if (view === "list") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          className,
          "p-4 flex items-center justify-between border-b",
          "hover:bg-hover hover:text-hover-foreground transition-colors group relative cursor-pointer",
          isDragging && "opacity-50 z-10"
        )}
        onClick={() => router.push(`/map/${id}`)}
      >
        <div {...listeners} {...attributes} className="absolute inset-0 z-1" />

        {/* TITLE */}
        <div className="flex items-center gap-x-2">
          <File className="size-5 shrink-0" />
          <h4 className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
            {name}
          </h4>
        </div>

        {/* MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="aspect-square h-fit p-1 relative z-5"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handle_delete();
              }}
              disabled={is_deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {is_deleting ? "Deleting..." : "Delete File"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        className,
        "p-0 hover:bg-hover hover:text-hover-foreground transition-colors group relative cursor-pointer",
        isDragging && "opacity-50 z-10"
      )}
      onClick={() => router.push(`/map/${id}`)}
    >
      <div {...listeners} {...attributes} className="absolute inset-0 z-1" />

      {/* HEADER */}
      <CardHeader className="p-4 flex flex-row items-center justify-between gap-2">
        {/* TITLE */}
        <CardTitle className="w-full text-sm mb-0 whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </CardTitle>

        {/* MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="aspect-square h-fit p-1 relative z-5"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="right">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handle_delete();
              }}
              disabled={is_deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {is_deleting ? "Deleting..." : "Delete File"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* IMAGE */}
      <CardContent className="min-h-40 p-0 relative w-full aspect-video overflow-hidden">
        <MapThumbnail
          fill
          sizes="100%"
          map_id={id}
          alt={name}
          className="object-cover"
        />
      </CardContent>
    </Card>
  );
}
