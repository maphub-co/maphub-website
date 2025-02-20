"use client";

// TYPES
import { OrganizationCreationStep } from "@/interfaces/organization";

// LIBRARIES
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";

// STEP COMPONENTS
import NameStep from "./steps/NameStep";
import SetupStep from "./steps/SetupStep";

/*======= COMPONENT =======*/
export default function NewOrganizationMain() {
  /*------- ATTRIBUTES -------*/
  const searchParams = useSearchParams();
  const is_personal = searchParams.get("personal") === "true";
  const router = useRouter();
  const { loading } = useAuthStore();
  const { user } = useUserStore();
  const { create_organization, set_last_registered_id } =
    useOrganizationsStore();
  const [current_step, set_current_step] =
    useState<OrganizationCreationStep>("name");
  const [organization_name, set_organization_name] = useState<string>(
    is_personal ? `${user?.display_name}'s organization` : ""
  );

  /*------- METHODS -------*/
  const handle_back = () => {
    switch (current_step) {
      case "setup":
        set_current_step("name");
        break;
    }
  };

  const handle_next = async () => {
    switch (current_step) {
      case "name":
        set_current_step("setup");
        await handle_create_organization();
        break;

      case "setup":
        break;
    }
  };

  const handle_create_organization = async () => {
    if (!organization_name) return;

    try {
      // Create the organization
      const new_organization = await create_organization(organization_name);

      // Redirect to new organization workspaces
      set_last_registered_id(new_organization.id);
      router.push(`/organizations/${new_organization.id}/workspaces`);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create organization. Please try again later.",
      });
      // Go back to name step on error
      set_current_step("name");
    }
  };

  /*------- RENDERER -------*/
  if (loading) {
    return <PageLoader />;
  }

  const render_current_step = () => {
    const common_props = {
      on_next: handle_next,
      on_back: handle_back,
    };

    switch (current_step) {
      case "name":
        return (
          <NameStep
            {...common_props}
            name={organization_name}
            set_name={set_organization_name}
          />
        );

      case "setup":
        return <SetupStep />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative pt-1.5 bg-background-primary overflow-y-auto">
      {/* CONTENT */}
      <main className="container flex-1 p-8 mx-auto flex items-center justify-center">
        <div className="max-w-2xl mx-auto flex flex-col gap-y-8 xl:gap-y-16">
          {render_current_step()}
        </div>
      </main>
    </div>
  );
}
