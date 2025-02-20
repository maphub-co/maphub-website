"use client";

// TYPES
import {
  Step,
  OnboardingData,
  OrganizationAction,
} from "@/interfaces/onboarding";
import { Organization } from "@/interfaces/organization";

// LIBRARIES
import { useState } from "react";
import { useRouter } from "next/navigation";

// CONFIG
import { toast } from "@/lib/toast";

// SERVICES
import { user_service } from "@/services/user.services";

// STORES
import { useOrganizationsStore } from "@/stores/organizations.store";

// COMPONENTS
import WelcomeStep from "./steps/WelcomeStep";
import UsageStep from "./steps/UsageStep";
import FeaturesStep from "./steps/FeaturesStep";
import TractionChannelStep from "./steps/TractionChannel";
import OrganizationActionStep from "./steps/OrganizationActionStep";
import OrganizationNameStep from "./steps/OrganizationNameStep";
import OrganizationJoinStep from "./steps/OrganizationJoinStep";
import OrganizationJoinConfirmationStep from "./steps/OrganizationJoinConfirmationStep";
import ConfirmationStep from "./steps/ConfirmationStep";
import SetupStep from "./steps/SetupStep";

// CONSTANTS
import { STEPS_CONFIG } from "./constants";

/*======= COMPONENT =======*/
export default function OnboardingMain() {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const { create_organization, set_last_registered_id } =
    useOrganizationsStore();
  const [current_step, set_current_step] = useState<Step>("welcome");
  const [organization_action, set_organization_action] = useState<
    OrganizationAction | undefined
  >(undefined);
  const [organization_name, set_organization_name] = useState<string>("");
  const [organization_to_join, set_organization_to_join] =
    useState<Organization | null>(null);
  const [onboarding_data, set_onboarding_data] = useState<OnboardingData>({
    name: "",
    usage: undefined,
    features: [],
    traction_channel: "",
    role: "",
    industry: "",
  });

  const current_step_index = STEPS_CONFIG.findIndex(
    (s) => s.step === current_step
  );
  const progress_percentage =
    ((current_step_index + 1) / STEPS_CONFIG.length) * 100;

  /*------- METHODS -------*/
  const send_user_infos = async () => {
    try {
      await user_service.send_user_infos({
        role: onboarding_data.role,
        industry: onboarding_data.industry,
        traction_channel: onboarding_data.traction_channel,
        usage: onboarding_data.usage,
        features: onboarding_data.features,
      });
    } catch (error) {
      console.error("Fail to send user infos:", error);
    }
  };

  const update_onboarding_data = (updates: Partial<OnboardingData>) => {
    set_onboarding_data((prev) => ({ ...prev, ...updates }));
  };

  const handle_back = () => {
    switch (current_step) {
      case "traction_channel":
        set_current_step("welcome");
        break;
      case "usage":
        set_current_step("traction_channel");
        break;
      case "features":
        set_current_step("usage");
        break;
      case "organization_action":
        set_current_step("features");
        break;
      case "organization_name":
        set_current_step("organization_action");
        break;
      case "organization_join":
        set_current_step("organization_action");
        break;
    }
  };

  const handle_next = async () => {
    switch (current_step) {
      case "welcome":
        set_current_step("traction_channel");
        break;

      case "traction_channel":
        set_current_step("usage");
        break;

      case "usage":
        if (onboarding_data.usage) {
          // If work is selected, require industry and role
          if (onboarding_data.usage === "work") {
            if (onboarding_data.industry && onboarding_data.role) {
              set_current_step("features");
            }
          } else {
            set_current_step("features");
          }
        }
        break;

      case "features":
        await send_user_infos();

        if (organization_name.trim() === "") {
          set_organization_name(`${onboarding_data.name}'s Organization`);
        }

        set_current_step("organization_action");
        break;

      case "organization_action":
        // Handled in handle_organisation_action_change
        break;

      case "organization_name":
        set_current_step("confirmation");
        break;

      case "confirmation":
        set_current_step("setup");

        await send_user_infos();

        handle_create_organization();
        break;

      case "organization_join":
        set_current_step("organization_join_confirmation");
        break;

      case "organization_join_confirmation":
        handle_join_redirect();
        break;

      case "setup":
        break;
    }
  };

  const handle_organisation_action_change = (action: OrganizationAction) => {
    set_organization_action(action);

    if (action === "create") {
      set_current_step("organization_name");
    } else if (action === "join") {
      set_current_step("organization_join");
    }
  };

  const handle_create_organization = async () => {
    if (!organization_name) return;

    // Save that the user exited the onboarding for app Tour
    localStorage.setItem("guided_tour", "true");

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
      router.push("/dashboard/workspaces");
    }
  };

  const handle_join_redirect = () => {
    // Clear the saved return URL
    const return_url = localStorage.getItem("login_return_url") || undefined;
    localStorage.removeItem("login_return_url");

    // Save that the user exited the onboarding for app Tour
    localStorage.setItem("guided_tour", "true");

    // Set the last registered id
    set_last_registered_id(null);

    // Redirect to the return URL if available, otherwise to the dashboard
    router.push(return_url || "/dashboard/workspaces");
  };

  /*------- RENDERER -------*/
  const render_current_step = () => {
    const common_props = {
      on_next: handle_next,
      on_back: handle_back,
    };

    switch (current_step) {
      case "welcome":
        return (
          <WelcomeStep
            {...common_props}
            name={onboarding_data.name}
            set_name={(name) => update_onboarding_data({ name })}
          />
        );

      case "usage":
        return (
          <UsageStep
            {...common_props}
            usage={onboarding_data.usage}
            set_usage={(usage) => update_onboarding_data({ usage })}
            industry={onboarding_data.industry}
            set_industry={(industry) => update_onboarding_data({ industry })}
            role={onboarding_data.role}
            set_role={(role) => update_onboarding_data({ role })}
          />
        );

      case "features":
        return (
          <FeaturesStep
            {...common_props}
            features={onboarding_data.features}
            set_features={(features) => update_onboarding_data({ features })}
          />
        );

      case "traction_channel":
        return (
          <TractionChannelStep
            {...common_props}
            traction_channel={onboarding_data.traction_channel}
            set_traction_channel={(traction_channel) =>
              update_onboarding_data({ traction_channel })
            }
          />
        );

      case "organization_action":
        return (
          <OrganizationActionStep
            {...common_props}
            set_organization_action={handle_organisation_action_change}
          />
        );

      case "organization_name":
        return (
          <OrganizationNameStep
            {...common_props}
            organization_name={organization_name}
            set_organization_name={(organization_name) =>
              set_organization_name(organization_name)
            }
          />
        );

      case "organization_join":
        return (
          <OrganizationJoinStep
            {...common_props}
            organization_to_join={organization_to_join}
            set_organization_to_join={(organization_to_join) =>
              set_organization_to_join(organization_to_join)
            }
          />
        );

      case "organization_join_confirmation":
        return <OrganizationJoinConfirmationStep on_finish={handle_next} />;

      case "confirmation":
        return (
          <ConfirmationStep
            {...common_props}
            organization_name={organization_name}
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
      {/* PROGRESS BAR */}
      <div className="w-full h-1.5 bg-muted absolute top-0 left-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress_percentage}%` }}
        />
      </div>

      {/* CONTENT */}
      <main className="container flex-1 p-4 md:p-8 mx-auto flex items-center justify-center">
        <div className="max-w-full md:max-w-2xl md:mx-auto flex flex-col gap-y-8 xl:gap-y-16">
          {render_current_step()}
        </div>
      </main>
    </div>
  );
}
