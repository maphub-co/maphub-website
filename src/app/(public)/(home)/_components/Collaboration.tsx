"use client";

// LIBRARIES
import Image from "next/image";
import Link from "next/link";

// CONFIG
import { track } from "@/lib/mixpanel";

export default function CollaborationSection() {
  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 gap-8 md:gap-16 my-8 md:my-20 grid grid-cols-1 lg:grid-cols-2">
      {/* ILLUSTRATION */}
      <div className="row-start-1 md:row-start-auto md:h-96 flex justify-center lg:justify-end">
        <Image
          src="/images/home/collaboration.png"
          alt="Team collaboration illustration"
          width={1400}
          height={1000}
          className="object-fit w-full md:w-auto h-full mx-auto rounded-md"
        />
      </div>

      {/* TEXT */}
      <div className="h-full flex flex-col gap-y-8 items-center justify-center lg:items-start">
        {/* TITLE */}
        <div className="flex flex-col gap-y-2">
          <h3 className="font-medium text-muted-foreground uppercase tracking-wider">
            Collaborate
          </h3>

          <h2 className="text-2xl md:text-3xl font-bold">
            Boost your team workflow
          </h2>
        </div>

        <p>
          MapHub offers a shared and secure workspace where you and your team
          can easily access, upload, and visualize geospatial datasets. Make the
          data fly from one stakeholder to the other.
        </p>

        <Link
          href="/onboarding"
          className="btn btn-primary btn-size-lg w-full md:w-auto"
          onClick={() =>
            track("call_to_action_clicked", {
              section: "collaboration",
              name: "start_collaborating",
            })
          }
        >
          Start collaborating now !
        </Link>
      </div>
    </section>
  );
}
