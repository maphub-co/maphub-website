// LIBRARIES
import { useEffect, useCallback, useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// CONFIG
import { track } from "@/lib/mixpanel";

/*======= PROPS =======*/
interface StripeStepProps {
  organization_name: string;
  on_next: () => void;
  on_back: () => void;
}

/*======= COMPONENT =======*/
export default function ConfirmationStep({
  organization_name,
  on_next,
  on_back,
}: StripeStepProps) {
  /*------- STATE -------*/
  const [show_title, set_show_title] = useState(true);

  /*------- METHODS -------*/
  const init = useCallback(() => {
    track("onboarding_step_completed", {
      number: 6,
      step: "confirmation",
    });

    setTimeout(() => {
      set_show_title(false);
      on_next();
    }, 1500);
  }, [on_next]);

  /*------- HOOKS -------*/
  useEffect(() => {
    init();
  }, []);

  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8">
      <AnimatePresence mode="wait">
        {show_title && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-center items-center gap-y-2"
          >
            <CircleCheckBig className="size-12 mx-auto text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-bold">You're all set !</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
