"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

export default function OptimizeSection() {
  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 gap-8 md:gap-16 my-8 md:my-20 grid grid-cols-1 lg:grid-cols-2 lg:items-center">
      {/* TEXT */}
      <div className="h-full flex flex-col gap-8 items-center lg:justify-center lg:items-start">
        {/* TITLE */}
        <div className="flex flex-col gap-y-2">
          <h3 className="font-medium text-muted-foreground uppercase tracking-wider">
            Optimize
          </h3>

          <h2 className="text-2xl md:text-3xl font-bold">
            Forget about long file transferts
          </h2>
        </div>

        <p>
          Maphub automatically uses cloud optimized geospatial format like
          PMTiles and COG by default. Forget about conversions and long file
          transfers, we handle everything for you.
        </p>

        <Link
          href="/onboarding"
          className="btn btn-primary btn-size-lg w-full md:w-auto"
          onClick={() =>
            track("call_to_action_clicked", {
              section: "optimize",
              name: "get_started",
            })
          }
        >
          Get started <ArrowRight className="ml-2 size-4" />
        </Link>
      </div>

      {/* ILLUSTRATION */}
      <div className="row-start-1 md:row-start-auto flex justify-center lg:justify-end">
        <video
          autoPlay
          loop
          muted
          preload="auto"
          playsInline
          className="object-fit w-auto h-full mx-auto aspect-video rounded-sm shadow-lg"
        >
          <source
            src="/videos/home/cloud-optimized.webm"
            type="video/webm; codecs=vp8"
          />
          <source
            src="/videos/home/cloud-optimized.webm"
            type="video/webm; codecs=vp9"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
