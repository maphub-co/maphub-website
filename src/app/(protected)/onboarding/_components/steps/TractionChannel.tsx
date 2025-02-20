// LIBRARIES
import { useState } from "react";
import { Check } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// CONSTANTS
import { TRACTION_CHANNEL_OPTIONS } from "../constants";

/*======= PROPS =======*/
interface TractionChannelStepProps {
  traction_channel: string;
  set_traction_channel: (traction_channel: string) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function TractionChannelStep({
  traction_channel,
  set_traction_channel,
  on_next,
  on_back,
}: TractionChannelStepProps) {
  /*------- ATTRIBUTES -------*/
  const [selected, set_selected] = useState(traction_channel);

  /*------- METHODS -------*/
  const can_proceed = selected !== "";

  const handle_selection = (option: string) => {
    set_selected(option);
    set_traction_channel(option);
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8 md:gap-y-16">
      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold">
        Where did you hear about MapHub ?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TRACTION_CHANNEL_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-4 flex flex-col gap-y-4 justify-between cursor-pointer hover:shadow-md transition-all relative ${
              selected === option.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handle_selection(option.id)}
          >
            {/* ICON */}
            <option.icon className="size-5 shrink-0" />

            {/* NAME */}
            <span className="text-xs font-medium">{option.name}</span>

            {/* TICK */}
            {selected === option.id && (
              <Check className="size-4 m-4 text-primary absolute top-0 right-0" />
            )}
          </Card>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex items-center gap-x-4">
        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_back_button_clicked", {
              number: 1,
              step: "welcome",
            });
            on_back();
          }}
        >
          Back
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_step_skipped", {
              number: 2,
              step: "traction_channel",
            });
            on_next();
          }}
        >
          Skip
        </Button>

        <Button
          variant="outline"
          className="ml-auto border-foreground"
          onClick={() => {
            track("onboarding_step_completed", {
              number: 2,
              step: "traction_channel",
            });
            on_next();
          }}
          disabled={!can_proceed}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
