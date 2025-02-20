// TYPES
import { UsageType } from "@/interfaces/onboarding";

// CONFIG
import { track } from "@/lib/mixpanel";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

// CONSTANTS
import { INDUSTRIES, ROLES } from "../constants";

/*======= PROPS =======*/
interface UsageStepProps {
  usage: UsageType | undefined;
  set_usage: (usage: UsageType) => void;
  industry: string;
  set_industry: (industry: string) => void;
  role: string;
  set_role: (role: string) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function UsageStep({
  usage,
  set_usage,
  industry,
  set_industry,
  role,
  set_role,
  on_next,
  on_back,
}: UsageStepProps) {
  /*------- METHODS -------*/
  const can_proceed =
    usage !== undefined && (usage !== "work" || (industry && role));

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8 md:gap-y-16">
      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold">
        How do you plan to use MapHub?
      </h2>

      {/* OPTIONS LIST */}
      <RadioGroup
        value={usage}
        onValueChange={(value) => {
          set_usage(value as UsageType);
          // Clear industry and role when switching away from work
          if (value !== "work") {
            set_industry("");
            set_role("");
          }
        }}
        className="flex flex-col gap-y-8"
      >
        {/* WORK */}
        <div className="flex flex-col gap-y-4">
          <Label
            key={"work"}
            className="flex-1 cursor-pointer flex items-center gap-x-4"
          >
            <RadioGroupItem value={"work"} id={"work"} />
            For work
          </Label>

          {/* COMPLEMENTS */}
          {usage === "work" && (
            <div className="max-w-sm flex flex-col gap-y-8 p-4 mx-8 rounded-md bg-muted">
              {/* INDUSTRY SELECT */}
              <Label className="text-xs font-medium flex flex-col gap-y-2">
                <span>What industry do you work in ?</span>

                <Select
                  value={industry}
                  onValueChange={(value) => {
                    set_industry(value);
                    // Clear role when industry changes
                    set_role("");
                  }}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry_option) => (
                      <SelectItem key={industry_option} value={industry_option}>
                        {industry_option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>

              {/* ROLE SELECT - Only show if industry is selected */}
              {industry && (
                <Label className="text-xs font-medium flex flex-col gap-y-2">
                  <span>What type of work do you do?</span>

                  <Select value={role} onValueChange={set_role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role_option) => (
                        <SelectItem key={role_option} value={role_option}>
                          {role_option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Label>
              )}
            </div>
          )}
        </div>

        {/* EDUCATION */}
        <Label
          key={"education"}
          className="flex-1 cursor-pointer flex items-center gap-x-4"
        >
          <RadioGroupItem value={"education"} id={"education"} />
          For education
        </Label>

        {/* PERSONAL */}
        <Label
          key={"personal"}
          className="flex-1 cursor-pointer flex items-center gap-x-4"
        >
          <RadioGroupItem value={"personal"} id={"personal"} />
          For personal projects
        </Label>
      </RadioGroup>

      {/* BUTTONS */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_back_button_clicked", {
              number: 2,
              step: "rabbit_hole",
            });
            on_back();
          }}
        >
          Back
        </Button>

        <Button
          className="ml-auto border-foreground"
          variant="outline"
          onClick={() => {
            track("onboarding_step_completed", {
              number: 3,
              step: "usage",
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
