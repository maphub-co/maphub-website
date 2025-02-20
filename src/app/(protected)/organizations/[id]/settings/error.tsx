"use client"; // Error boundaries must be Client Components

// LIBRARIES
import Link from "next/link";
import { useEffect } from "react";

// SERVICES
import { user_service } from "@/services/user.services";

// COMPONENTS
import { Button } from "@/components/ui/Button";

/*======= INTERFACES =======*/
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  /*------- HOOKS -------*/
  useEffect(() => {
    if (!error) return;

    user_service.send_bug_report(error.message).catch((error) => {
      console.error("Failed to send bug report:", error);
    });
  }, [error]);

  /*------- RENDER -------*/
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center flex flex-col items-center gap-y-4">
        <span className="text-2xl font-semibold">(⚆ _ ⚆)</span>
        <h2 className="text-2xl font-semibold">Something went wrong...</h2>
        <p className="text-muted-foreground max-w-md">
          An error occurred while processing your request. Please try again
          later.
        </p>

        <div className="flex items-center gap-x-4">
          <Link
            href="/"
            className="btn btn-primary btn-size-lg w-fit mt-4 text-base"
          >
            Explore public maps
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-fit mt-4 text-base"
            onClick={reset}
          >
            Try to reload
          </Button>
        </div>
      </div>
    </div>
  );
}
