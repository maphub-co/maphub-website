"use client"; // Error boundaries must be Client Components

// LIBRARIES
import Link from "next/link";
import { useEffect } from "react";

// SERVICES
import { user_service } from "@/services/user.services";

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
          An error occurred while loading the page. A message has been sent to
          the developers. Please try again later.
        </p>

        <Link
          href="/"
          className="btn btn-primary btn-size-lg w-fit mt-4 text-base"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
