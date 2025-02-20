// LIBRARIES
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/mixpanel";

/*======= PROPS =======*/
interface WelcomeStepProps {
  name: string;
  set_name: (name: string) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function WelcomeStep({
  name,
  set_name,
  on_next,
  on_back,
}: WelcomeStepProps) {
  /*------- ATTRIBUTES -------*/
  const { update_user } = useUserStore();
  const [is_updating, set_is_updating] = useState(false);

  /*------- METHODS -------*/
  const can_proceed = name.trim() !== "";

  const handle_next = async () => {
    if (!name.trim()) return;

    set_is_updating(true);
    try {
      await update_user({ display_name: name.trim() });
      on_next();
    } catch (error) {
      console.error("Failed to update user name:", error);
      toast({
        title: "Error",
        description: "Failed to update your name. Please try again.",
      });
    } finally {
      set_is_updating(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-16">
      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold">
        Help us personalise your experience
      </h2>

      {/* INPUT */}
      <label className="text-sm font-medium text-foreground flex flex-col gap-y-2">
        <span>What is your name ?</span>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => set_name(e.target.value)}
          disabled={is_updating}
        />
      </label>

      {/* BUTTONS */}
      <div className="flex">
        <Button
          className="ml-auto border-foreground"
          onClick={() => {
            track("onboarding_step_completed", {
              number: 1,
              step: "welcome",
            });
            handle_next();
          }}
          variant="outline"
          disabled={!can_proceed || is_updating}
        >
          {is_updating ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}
