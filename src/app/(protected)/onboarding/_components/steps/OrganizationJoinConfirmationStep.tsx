// LIBRARIES
import { CircleCheckBig } from "lucide-react";
import { motion } from "framer-motion";

// CONFIG
import { track } from "@/lib/mixpanel";

// COMPONENTS
import { Button } from "@/components/ui/Button";

/*======= PROPS =======*/
interface OrganizationJoinConfirmationStepProps {
  on_finish: () => void;
}

/*======= COMPONENT =======*/
export default function OrganizationJoinConfirmationStep({
  on_finish,
}: OrganizationJoinConfirmationStepProps) {
  /*------- METHODS -------*/
  const handle_finish = () => {
    track("onboarding_step_completed", {
      number: 7,
      step: "organization_join_confirmation",
    });

    on_finish();
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col justify-center items-center gap-y-6 text-center"
      >
        <CircleCheckBig className="size-12 mx-auto text-emerald-500" />
        <div className="flex flex-col gap-y-2">
          <h2 className="text-xl md:text-2xl font-bold">
            Join request sent!
          </h2>
          <p className="text-muted-foreground">
            Your request has been sent to the organization administrators.
            You'll be notified once your request is approved.
          </p>
        </div>

        <Button className="mt-4" variant="outline" onClick={handle_finish}>
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}

