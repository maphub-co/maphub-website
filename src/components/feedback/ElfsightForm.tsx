// LIBRARIES
import Script from "next/script";
import { Loader2 } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Suspense } from "react";

export default function ElfsightForm({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Script
        src="https://static.elfsight.com/platform/platform.js"
        strategy="lazyOnload"
      />

      <div
        className="elfsight-app-186e934c-0ae8-4afe-baca-8e1755a44230"
        data-elfsight-app-lazy
        style={{
          width: "100%",
        }}
      />
    </div>
  );
}
