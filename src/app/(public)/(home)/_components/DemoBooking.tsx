"use client";

// LIBRARIES
import Link from "next/link";

// CONFIG
import { track } from "@/lib/mixpanel";

export default function DemoBooking() {
  return (
    <section className="container max-w-7xl mx-auto p-4 my-8 md:my-20 flex flex-col gap-y-8 items-center justify-center">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Interested but still not sure?
        <br /> Contact us for a demo !
      </h2>

      {/* CALL-TO-ACTION */}
      <div className="w-full md:w-auto text-center flex flex-col md:flex-row gap-y-4 gap-x-8">
        <Link
          href="https://calendar.app.google/mGk9oVRTXYcqrRtn9"
          target="_blank"
          className="btn btn-primary btn-size-lg w-full md:w-auto"
          onClick={() =>
            track("call_to_action_clicked", {
              section: "demo_booking",
              name: "book_a_demo",
            })
          }
        >
          Book a Demo !
        </Link>

        <Link
          href="mailto:alexandre.larroumets@meteory.eu"
          className="btn btn-outline btn-size-lg text-primary border-primary hover:bg-primary/10 hover:text-primary w-full md:w-auto"
          onClick={() =>
            track("call_to_action_clicked", {
              section: "demo_booking",
              name: "contact_us",
            })
          }
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
