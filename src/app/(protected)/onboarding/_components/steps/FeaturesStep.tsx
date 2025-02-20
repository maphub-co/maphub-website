// LIBRARIES
import { useState } from "react";
import { Check } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// CONSTANTS
import { FEATURES } from "../constants";

/*======= PROPS =======*/
interface FeaturesStepProps {
  features: string[];
  set_features: (features: string[]) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function FeaturesStep({
  features,
  set_features,
  on_next,
  on_back,
}: FeaturesStepProps) {
  /*------- ATTRIBUTES -------*/
  const [selected, set_selected] = useState<string[]>(features);

  /*------- METHODS -------*/
  const can_proceed = selected.length > 0;

  const handle_feature_toggle = (feature_id: string) => {
    const new_features = selected.includes(feature_id)
      ? selected.filter((id) => id !== feature_id)
      : [...selected, feature_id];

    set_selected(new_features);
    set_features(new_features);
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8 md:gap-y-16">
      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold">
        What are you the most interested in Maphub ?
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <Card
            key={feature.id}
            className={`p-4 flex flex-col gap-y-4 justify-between cursor-pointer hover:shadow-md transition-all relative ${
              selected.includes(feature.id) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handle_feature_toggle(feature.id)}
          >
            <feature.icon className="size-5 shrink-0" />

            <span className="text-xs font-semibold">{feature.label}</span>

            {selected.includes(feature.id) && (
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
              number: 3,
              step: "usage",
            });
            on_back();
          }}
          className="border-foreground"
        >
          Back
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_step_skipped", {
              number: 4,
              step: "features",
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
              number: 4,
              step: "features",
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
