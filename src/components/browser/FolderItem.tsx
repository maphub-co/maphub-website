"use client";

// INTERFACES
import { FolderInfos } from "@/interfaces/folder";

// LIBRARIES
import { useState, KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FolderIcon, MoreVertical, Trash2, Pencil } from "lucide-react";
import { useDroppable, useDraggable } from "@dnd-kit/core";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// SERVICES
import { folder_services } from "@/services/folder.services";

// COMPONENTS
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

/*======= PROPS =======*/
interface FolderItemProps {
  folder: FolderInfos;
  view: "list" | "grid";
  on_delete?: () => void;
}

interface NameInputProps {
  initial_name: string;
  folder_id: string;
  on_save: (new_name: string) => void;
  on_cancel: () => void;
}

/*======= COMPONENTS =======*/
export default function FolderItem({
  folder,
  view,
  on_delete,
}: FolderItemProps) {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const path = usePathname();
  const path_base = path.split("/workspaces/")[0];
  const [is_deleting, set_is_deleting] = useState(false);
  const [is_editing, set_editing] = useState(false);
  const [folder_name, set_folder_name] = useState(folder.name);

  const { setNodeRef: drop_ref, isOver } = useDroppable({
    id: folder.id,
    data: {
      type: "folder",
      folder: {
        id: folder.id,
        name: folder.name,
      },
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: drag_ref,
    transform,
    isDragging,
  } = useDraggable({
    id: folder.id,
    data: {
      type: "folder",
      folder: {
        id: folder.id,
        name: folder.name,
      },
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  /*------- METHODS -------*/
  const handle_click = () => {
    router.push(`${path_base}/workspaces/${folder.workspace_id}/${folder.id}`);
  };

  const handle_rename = () => {
    set_editing(true);
  };

  const handle_rename_save = (new_name: string) => {
    set_folder_name(new_name);
    set_editing(false);
  };

  const handle_rename_cancel = () => {
    set_editing(false);
  };

  const handle_delete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this folder? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      set_is_deleting(true);
      await folder_services.delete_async(folder.id);
      on_delete?.();
    } catch (error) {
      console.error("Failed to delete folder:", error);
    } finally {
      set_is_deleting(false);
    }
  };

  /*------- RENDER -------*/
  if (view === "list") {
    return (
      <div
        ref={(node) => {
          drop_ref(node);
          drag_ref(node);
        }}
        style={style}
        className={cn(
          "flex items-center gap-x-2 p-4 border-b",
          "hover:bg-hover hover:text-hover-foreground relative cursor-pointer",
          isOver && "bg-hover outline outline-2 outline-accent",
          isDragging && "opacity-50 z-10"
        )}
        onClick={handle_click}
      >
        <div {...listeners} {...attributes} className="absolute inset-0 z-1" />

        {is_editing ? (
          <NameInput
            initial_name={folder_name}
            folder_id={folder.id}
            on_save={handle_rename_save}
            on_cancel={handle_rename_cancel}
          />
        ) : (
          <>
            <FolderIcon className="size-5 shrink-0 fill-current hover:fill-current" />
            <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
              {folder_name}
            </span>
          </>
        )}

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
              onClick={(e) => {
                e.stopPropagation();
                handle_rename();
              }}
            >
              <Pencil className="size-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handle_delete();
              }}
              disabled={is_deleting}
            >
              <Trash2 className="size-4 mr-2" />
              {is_deleting ? "Deleting..." : "Delete Folder"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Card
      ref={(node) => {
        drop_ref(node);
        drag_ref(node);
      }}
      style={style}
      className={cn(
        "w-full h-14 flex items-center gap-x-2 px-4 py-2 hover:bg-hover hover:text-hover-foreground relative cursor-pointer",
        isOver && "bg-hover outline outline-2 outline-accent",
        isDragging && "opacity-50 z-10"
      )}
      onClick={handle_click}
    >
      <div {...listeners} {...attributes} className="absolute inset-0 z-1" />

      {is_editing ? (
        <NameInput
          initial_name={folder_name}
          folder_id={folder.id}
          on_save={handle_rename_save}
          on_cancel={handle_rename_cancel}
        />
      ) : (
        <>
          <FolderIcon className="size-6 shrink-0 fill-current hover:fill-current" />
          <span className="w-full font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {folder_name}
          </span>
        </>
      )}

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
            onClick={(e) => {
              e.stopPropagation();
              handle_rename();
            }}
          >
            <Pencil className="size-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handle_delete();
            }}
            disabled={is_deleting}
          >
            <Trash2 className="size-4 mr-2" />
            {is_deleting ? "Deleting..." : "Delete Folder"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}

function NameInput({
  initial_name,
  folder_id,
  on_cancel,
  on_save,
}: NameInputProps) {
  const [name, set_name] = useState(initial_name);
  const [is_focused, set_is_focused] = useState(false);

  const handle_save = async () => {
    if (!is_focused) return;

    if (name.trim() === initial_name) {
      on_cancel();
      return;
    }

    try {
      const updated_folder = await folder_services.rename_async(
        folder_id,
        name.trim()
      );
      on_save(updated_folder.name);
    } catch (error) {
      console.error("Failed to rename folder:", error);
      toast({
        title: "Failed to rename folder",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      on_cancel();
    }
  };

  const handle_key_down = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handle_save();
    } else if (e.key === "Escape") {
      on_cancel();
    }
  };

  return (
    <Input
      type="text"
      value={name}
      onChange={(e) => set_name(e.target.value)}
      onKeyDown={handle_key_down}
      onFocus={() => set_is_focused(true)}
      onBlur={on_cancel}
      className="py-1.5 relative z-5"
      onClick={(e) => e.stopPropagation()}
    />
  );
}
