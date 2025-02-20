"use client";

// LIBRARIES
import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { folder_services } from "@/services/folder.services";

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

/*======= INTERFACES =======*/
interface FolderDialogProps {
  is_open: boolean;
  on_close: () => void;
  parent_folder_id: string;
  on_create_success: () => void;
}

/*======= COMPONENT =======*/
export default function FolderDialog({
  is_open,
  on_close,
  parent_folder_id,
  on_create_success,
}: FolderDialogProps) {
  /*------- ATTRIBUTES -------*/
  const [folder_name, set_folder_name] = useState("");
  const [is_creating, set_is_creating] = useState(false);

  /*------- METHODS -------*/
  const reset_form = () => {
    set_folder_name("");
    set_is_creating(false);
  };

  const handle_submit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    if (!folder_name || !parent_folder_id) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a folder name",
      });
      return;
    }

    set_is_creating(true);

    try {
      await folder_services.create_async(parent_folder_id, folder_name);

      on_create_success();
      handle_close();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create folder",
      });
    } finally {
      set_is_creating(false);
    }
  };

  const handle_close = () => {
    reset_form();
    on_close();
  };

  /*------- RENDERER -------*/
  return (
    <Dialog open={is_open} onOpenChange={(open) => !open && handle_close()}>
      <DialogContent className="p-0">
        {/* FOLDER ICON */}
        <DialogHeader className="p-4 border-b flex flex-row items-center gap-x-2">
          <FolderPlus className="h-5 w-5 mb-0" />
          <DialogTitle className="text-base mb-0">
            Create New Folder
          </DialogTitle>
        </DialogHeader>

        {/* FOLDER NAME INPUT */}
        <form onSubmit={handle_submit}>
          <div className="px-6 py-4 flex flex-col gap-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              type="text"
              placeholder="Enter folder name"
              value={folder_name}
              onChange={(e) => set_folder_name(e.target.value)}
              disabled={is_creating}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handle_submit(event);
                }
              }}
            />
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-4 py-2 border-t">
            <Button
              variant="outline"
              onClick={handle_close}
              disabled={is_creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={is_creating || !folder_name}>
              {is_creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {is_creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
