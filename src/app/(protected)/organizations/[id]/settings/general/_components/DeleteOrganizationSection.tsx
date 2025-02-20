"use client";

// LIBRARIES
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Button } from "@/components/ui/Button";

export default function DeleteOrganizationSection({
  className,
}: {
  className?: string;
}) {
  /*------- ATTRIBUTES -------*/
  const { id } = useParams();
  const router = useRouter();
  const [is_deleting, set_is_deleting] = useState(false);

  const { delete_organization } = useOrganizationsStore();

  /*------- METHODS -------*/
  const handle_delete = async () => {
    if (!window.confirm("Are you sure you want to delete this organization?"))
      return;

    set_is_deleting(true);
    try {
      await delete_organization(id as string);
      toast({
        title: "Organization deleted",
        description: "The organization has been deleted successfully.",
      });
      router.push("/dashboard/workspaces");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete organization.",
      });
    } finally {
      set_is_deleting(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <section
      id="delete-organization-section"
      className={cn("w-full flex flex-col gap-y-8", className)}
    >
      {/* TITLE */}
      <div className="flex items-center gap-x-2 border-b pb-2">
        <h2 className="text-destructive text-xl md:text-2xl font-medium">
          Delete organization
        </h2>
      </div>

      <p>
        Deleting your organization is <strong>irreversible</strong>. All data,
        members, and resources will be permanently removed. Please proceed with
        caution.
      </p>

      <Button
        type="button"
        variant="destructive"
        className="w-fit"
        onClick={handle_delete}
        disabled={is_deleting}
      >
        {is_deleting ? "Deleting..." : "Delete Organization"}
      </Button>
    </section>
  );
}
