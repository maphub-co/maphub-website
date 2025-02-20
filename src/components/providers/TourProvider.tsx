"use client";

// LIBRARIES
import { StepType, TourProvider } from "@reactour/tour";
import { MoveLeft, MoveRight } from "lucide-react";

// COMPONENTS
import { Button } from "@/components/ui/Button";

// CONSTANTS
const STEPS: StepType[] = [
  {
    selector: "#entity-manager",
    content: (
      <div className="flex flex-col gap-y-4">
        <h3 className="text-lg font-medium">Welcome to MapHub !</h3>
        <p>
          Click here to navigate through your different organizations, and
          personal workspaces.
        </p>
      </div>
    ),
  },
  {
    selector: "#add-members-button",
    content: (
      <div className="flex flex-col gap-y-4">
        <h3 className="text-lg font-medium">Start collaborating</h3>
        <p>
          Invite team members to your organization, and start collaborating !
        </p>
      </div>
    ),
  },
  {
    selector: "#create-folder-button",
    content: (
      <div className="flex flex-col gap-y-4">
        <h3 className="text-lg font-medium">Organize your files</h3>
        <p>
          Create folders, organize your files, and navigate your spatial data as
          you would in a regular file explorer.
        </p>
      </div>
    ),
  },
  {
    selector: "#upload-map-button",
    content: (
      <div className="flex flex-col gap-y-4">
        <h3 className="text-lg font-medium">Upload your first map</h3>
        <p>Click here to upload your first spatial file !</p>
      </div>
    ),
  },
];

/*======= COMPONENT =======*/
export default function DashboardTour({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TourProvider
      steps={STEPS}
      position={"bottom"}
      styles={{
        popover: (base) => {
          return {
            ...base,
            backgroundColor: "var(--color-background-primary)",
            color: "var(--color-foreground)",
            borderRadius: "0.4rem",
          };
        },
        badge: (base) => {
          return {
            ...base,
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
          };
        },
        close: (base) => {
          return {
            ...base,
            top: "0.8rem",
            right: "0.8rem",
          };
        },
      }}
      scrollSmooth={true}
      disableInteraction={true}
      prevButton={({ currentStep, setCurrentStep, steps }) => {
        const first = currentStep === 0;
        return (
          <Button
            variant="ghost"
            size={"sm"}
            disabled={first}
            onClick={() => {
              if (first) {
                setCurrentStep((s) => (steps?.length ?? 0) - 1);
              } else {
                setCurrentStep((s) => s - 1);
              }
            }}
          >
            <MoveLeft className="size-5" />
          </Button>
        );
      }}
      nextButton={({
        currentStep,
        stepsLength,
        setIsOpen,
        setCurrentStep,
        steps,
      }) => {
        const last = currentStep === stepsLength - 1;
        return (
          <Button
            variant={last ? "outline" : "ghost"}
            size={"sm"}
            onClick={() => {
              if (last) {
                setIsOpen(false);
              } else {
                setCurrentStep((s) =>
                  s === (steps?.length ?? 0) - 1 ? 0 : s + 1
                );
              }
            }}
          >
            {last ? "Finish" : <MoveRight className="size-5" />}
          </Button>
        );
      }}
      onClickMask={({ setIsOpen, currentStep, steps }) => {
        if (currentStep === (steps?.length ?? 0) - 1) {
          setIsOpen(false);
        }
      }}
    >
      {children}
    </TourProvider>
  );
}
