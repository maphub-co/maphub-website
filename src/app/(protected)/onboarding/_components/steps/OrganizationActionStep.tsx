// TYPES
import { OrganizationAction } from "@/interfaces/onboarding";

// LIBRARIES
import { FolderPlus, FolderInput } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

/*======= PROPS =======*/
interface OrganizationActionStepProps {
  set_organization_action: (action: OrganizationAction) => void;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function OrganizationActionStep({
  set_organization_action,
  on_next,
  on_back,
}: OrganizationActionStepProps) {
  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-16">
      {/* TITLE */}
      <div className="text-center md:text-left flex flex-col justify-center gap-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          What do you want to do?
        </h2>

        <p className="text-base md:text-lg text-muted-foreground">
          By default, you need a workspace to start using MapHub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CREATE */}
        <Card
          className={cn(
            "p-4 md:p-8 flex flex-col items-center justify-center gap-y-4 md:gap-y-8 relative"
          )}
        >
          <button
            className="absolute inset-0 z-1 cursor-pointer"
            onClick={() => set_organization_action("create")}
          />

          <FolderPlus className="size-8" />

          <div className="flex flex-col items-center justify-center">
            <span className="text-base xl:text-lg font-medium">Create</span>
            <span className="text-xs font-medium text-muted-foreground mt-0.5">
              (default)
            </span>

            <span className="font-medium text-muted-foreground mt-2">
              Create your own workspace, and add your team members later if you
              want
            </span>
          </div>
        </Card>

        {/* JOIN */}
        <Card
          className={cn(
            "p-4 md:p-8 flex flex-col items-center justify-center gap-y-4 md:gap-y-8 relative"
          )}
        >
          <button
            className="absolute inset-0 z-1 cursor-pointer"
            onClick={() => set_organization_action("join")}
          />
          <FolderInput className="size-8" />

          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-base xl:text-lg font-medium text-center">
              Join
            </span>

            <span className="font-medium text-muted-foreground text-center mt-1">
              Join an already existing organization.
            </span>
          </div>
        </Card>
      </div>

      {/* BUTTONS */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => {
            track("onboarding_back_button_clicked", {
              number: 4,
              step: "features",
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
