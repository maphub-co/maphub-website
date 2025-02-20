// TYPES
import { Organization } from "@/interfaces/organization";

// LIBRARIES
import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Building2, Check } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";
import { toast } from "@/lib/toast";

// SERVICES
import {
  search_organizations_async,
  send_organization_join_request_async,
} from "@/services/organization.services";

// COMPONENTS
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";

/*======= PROPS =======*/
interface OrganizationJoinStepProps {
  organization_to_join: Organization | null;
  set_organization_to_join: (org: Organization | null) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function OrganizationJoinStep({
  organization_to_join,
  set_organization_to_join,
  on_next,
  on_back,
}: OrganizationJoinStepProps) {
  /*------- ATTRIBUTES -------*/
  const [organizations, set_organizations] = useState<Organization[]>([]);
  const [is_searching, set_is_searching] = useState(false);
  const [is_sending, set_is_sending] = useState(false);

  /*------- METHODS -------*/
  const can_proceed = organization_to_join !== null;

  const handle_search = async (query: string) => {
    if (!query.trim()) {
      set_organizations([]);
      return;
    }

    set_is_searching(true);
    try {
      const results = await search_organizations_async(query);
      set_organizations(results);
    } catch (error) {
      console.error("Failed to search organizations:", error);
      toast({
        title: "Error",
        description: "Failed to search organizations. Please try again.",
      });
    } finally {
      set_is_searching(false);
    }
  };

  const handle_select_organization = (org: Organization) => {
    set_organization_to_join(org);
  };

  const handle_send_request = async () => {
    if (!organization_to_join) return;

    set_is_sending(true);
    try {
      await send_organization_join_request_async(organization_to_join.id);

      track("onboarding_step_completed", {
        number: 6,
        step: "organization_join",
      });

      on_next();
    } catch (error) {
      console.error("Failed to send join request:", error);
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
      });
    } finally {
      set_is_sending(false);
    }
  };

  /*------- EFFECTS -------*/
  const debounce_timer = useRef<NodeJS.Timeout>();

  const handle_search_debounced = useCallback((query: string) => {
    if (debounce_timer.current) {
      clearTimeout(debounce_timer.current);
    }

    debounce_timer.current = setTimeout(() => {
      if (query.trim()) {
        handle_search(query);
      } else {
        set_organizations([]);
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (debounce_timer.current) {
        clearTimeout(debounce_timer.current);
      }
    };
  }, []);

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-16">
      {/* TITLE */}
      <div className="text-center md:text-left flex flex-col justify-center gap-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Join an existing organization
        </h2>

        <p className="text-base md:text-lg text-muted-foreground">
          Search for an organization and send a join request
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col gap-y-4">
        <Label className="text-xs font-medium flex flex-col gap-y-2">
          <span>Search for an organization</span>

          <Combobox
            options={organizations}
            selected={organization_to_join}
            onSelect={handle_select_organization}
            onSearch={handle_search_debounced}
            is_loading={is_searching}
            get_option_label={(org) => org.name}
            get_option_value={(org) => org.id}
            render_option={(org, is_selected) => (
              <div className="flex items-center gap-x-3 w-full">
                <Building2 className="size-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{org.name}</div>
                  {org.description && (
                    <div className="text-sm text-muted-foreground truncate">
                      {org.description}
                    </div>
                  )}
                </div>
                {is_selected && (
                  <Check className="size-4 text-primary flex-shrink-0" />
                )}
              </div>
            )}
            placeholder="Select an organization..."
            search_placeholder="Search organizations..."
            empty_message="No organizations found"
          />
        </Label>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-row-reverse items-center">
        <Button
          className="ml-auto border-foreground"
          variant="outline"
          onClick={handle_send_request}
          disabled={!can_proceed || is_sending}
        >
          {is_sending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Request"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_back_button_clicked", {
              number: 5,
              step: "organization_action",
            });
            on_back();
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
