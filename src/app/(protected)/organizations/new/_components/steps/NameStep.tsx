// LIBRARIES
import { useState } from "react";
import { Loader2 } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";
import { toast } from "@/lib/toast";

// SERVICES
import { get_organization_name_exists_async } from "@/services/organization.services";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

/*======= PROPS =======*/
interface OrganizationStepProps {
  name: string;
  set_name: (name: string) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function OrganizationStep({
  name,
  set_name,
  on_next,
  on_back,
}: OrganizationStepProps) {
  /*------- ATTRIBUTES -------*/
  const [local_name, set_local_name] = useState<string>(name);
  const [is_checking, set_checking] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  /*------- METHODS -------*/
  const can_proceed = local_name.trim() !== "";

  const update_local_name = (new_name: string) => {
    set_local_name(new_name);
    set_name(new_name);
    // Clear error when user types
    if (error) set_error(null);
  };

  const handle_next = async () => {
    if (!local_name.trim()) return;

    set_checking(true);
    try {
      const exists = await get_organization_name_exists_async(
        local_name.trim()
      );

      if (exists) {
        set_error("Name already exists.");
        return;
      }

      track("new_organization_step_completed", {
        number: 1,
        step: "organization_name",
      });

      on_next();
    } catch (error) {
      console.error("Failed to check organization name:", error);
      toast({
        title: "Error",
        description: "Failed to check organization name. Please try again.",
      });
    } finally {
      set_checking(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-16">
      {/* TITLE */}
      <div className="text-center md:text-left flex flex-col justify-center gap-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Let's create a new organization!
        </h2>

        <p className="text-base md:text-lg text-muted-foreground">
          Your organization will be created with a free plan by default. You can
          change this later in your organization settings.
        </p>
      </div>

      <Label className="text-xs font-medium flex flex-col gap-y-2">
        <span>What's your organization name?</span>

        <Input
          id="organization_name"
          placeholder="Your organization name"
          value={local_name}
          onChange={(e) => update_local_name(e.target.value)}
          required
        />

        {error && (
          <span className="text-xs text-destructive italic">{error}</span>
        )}
      </Label>

      {/* BUTTONS */}
      <div className="flex flex-row-reverse items-center">
        <Button
          className="ml-auto border-foreground"
          variant="outline"
          onClick={handle_next}
          disabled={!can_proceed}
        >
          {is_checking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}
