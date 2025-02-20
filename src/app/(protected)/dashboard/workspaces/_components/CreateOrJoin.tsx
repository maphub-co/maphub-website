"use client";

// LIBRARIES
import { useState } from "react";
import Link from "next/link";
import { FolderPlus, FolderInput } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import JoinOrganizationDialog from "./JoinOrganizationDialog";

/*======= COMPONENT =======*/
export default function JoinOrCreatePage() {
  /*------- STATE -------*/
  const [is_join_dialog_open, set_is_join_dialog_open] = useState(false);

  /*------- METHODS -------*/
  const handle_join_click = () => {
    set_is_join_dialog_open(true);
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-y-8">
      <p className="text-center text-base text-muted-foreground">
        You're not part of any workspace yet.
      </p>

      {/* CARDS */}
      <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CREATE */}
        <Card
          className={cn(
            "p-4 md:p-8 flex flex-col items-center justify-center gap-y-4 md:gap-y-8 relative"
          )}
        >
          <Link
            href="/organizations/new"
            className="absolute inset-0 z-1 cursor-pointer"
          />

          <FolderPlus className="size-8" />

          <div className="flex flex-col items-center justify-center">
            <span className="text-base font-medium">Create your own</span>
            <span className="text-xs font-medium text-muted-foreground">
              (default)
            </span>

            <span className="font-medium text-muted-foreground mt-4 text-center">
              Create your own workspace, and add your team members later if you
              want.
            </span>
          </div>
        </Card>

        {/* JOIN */}
        <Card
          className={cn(
            "p-4 md:p-8 flex flex-col items-center justify-center gap-y-4 md:gap-y-8 relative"
          )}
        >
          <button
            className="absolute inset-0 z-1 cursor-pointer"
            onClick={handle_join_click}
          />
          <FolderInput className="size-8" />

          <div className="flex-1 flex flex-col items-center justify-between">
            <span className="text-base font-medium text-center">
              Join an existing organization
            </span>

            <span className="font-medium text-muted-foreground text-center mt-2">
              Search for an organization and send a join request.
            </span>
          </div>
        </Card>
      </div>

      {/* JOIN DIALOG */}
      <JoinOrganizationDialog
        is_open={is_join_dialog_open}
        on_close={() => set_is_join_dialog_open(false)}
      />
    </div>
  );
}
