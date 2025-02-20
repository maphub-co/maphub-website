"use client";

// LIBRARIES
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/*======= COMPONENT =======*/
export default function SetupStep() {
  /*------- RENDERER -------*/
  return (
    <div className="w-full md:min-w-2xl flex flex-col gap-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-y-4"
        >
          <Loader2 className="size-8 mx-auto animate-spin" />

          <div className="flex flex-col items-center gap-y-2">
            <span className="text-base font-semibold">Please wait</span>
            <span className="text-muted-foreground">
              We're setting up your account...
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
