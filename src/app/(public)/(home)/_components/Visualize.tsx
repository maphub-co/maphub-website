"use client";

// LIBRARIES
import Image from "next/image";
import Link from "next/link";

// CONFIG
import { track } from "@/lib/mixpanel";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

export default function DataLakeSection() {
  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 gap-8 md:gap-16 my-8 md:my-20 grid grid-cols-1 lg:grid-cols-2">
      {/* ILLUSTRATION */}
      <div className="flex justify-center lg:justify-end">
        <Image
          src="/images/home/kepler-gl.png"
          alt="Team collaboration illustration"
          width={1400}
          height={1000}
          className="object-fit w-auto h-full mx-auto rounded-md border shadow-lg"
        />
      </div>

      {/* TEXT */}
      <div className="h-full flex flex-col gap-y-8 items-center justify-center lg:items-start">
        {/* TITLE */}
        <div className="flex flex-col gap-y-2">
          <h3 className="font-medium text-muted-foreground uppercase tracking-wider">
            Visualize
          </h3>

          <h2 className="text-2xl md:text-3xl font-bold">
            Access and preview spatial data directly in the browser
          </h2>
        </div>

        <p>
          Get a quick visualization, or go deeper in the analysis directly in
          the browser. Easily style you dataset, get a beautiful visualization
          and share the result with your team or clients.
        </p>

        <Link
          href="/onboarding"
          className="btn btn-primary btn-size-lg w-full md:w-auto"
          onClick={() =>
            track("call_to_action_clicked", {
              section: "visualization",
              name: "try_now",
            })
          }
        >
          Try now <ArrowRight className="ml-2 size-4" />
        </Link>
      </div>
    </section>
  );
}
