"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function OrganizationError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Organization page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8">
        {error.message ||
          "We couldn't load this organization. Please try again later."}
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/hub">Explore Maps</Link>
        </Button>
      </div>
    </div>
  );
}

