"use client";

// LIBRARIES
import { useState, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

// CONFIG
import { track } from "@/lib/mixpanel";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

export default function Hero() {
  const [mouse_position, set_mouse_position] = useState({ x: 0, y: 0 });

  const handle_mouse_move = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const center_x = rect.width / 2;
    const center_y = rect.height / 2;
    const mouse_x = e.clientX - rect.left;
    const mouse_y = e.clientY - rect.top;

    // Calculate offset from center, normalized to -1 to 1 range
    const offset_x = (mouse_x - center_x) / center_x;
    const offset_y = (mouse_y - center_y) / center_y;

    set_mouse_position({ x: offset_x, y: offset_y });
  };

  const handle_mouse_leave = () => {
    set_mouse_position({ x: 0, y: 0 });
  };
  return (
    <div
      className="w-full h-[calc(100vh_-_var(--header-height))] relative overflow-hidden"
      onMouseMove={handle_mouse_move}
      onMouseLeave={handle_mouse_leave}
    >
      <section
        className={cn(
          "container max-w-7xl h-full mx-auto px-4 md:px-8 py-8 lg:py-16",
          "flex justify-center items-center"
        )}
      >
        {/* TEXT */}
        <div className="flex flex-col justify-center items-center">
          {/* AUTHORITY */}
          <Link
            href="https://www.tinylaunch.com/launch/3147"
            target="_blank"
            className="px-3 py-1.5 mb-6 text-xs font-medium flex items-center gap-x-1.5 rounded-sm border border-foreground"
          >
            <Rocket className="size-4" />
            1st place on TinyLaunch
          </Link>

          {/* TITLE */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl md:leading-10 lg:leading-16  font-extrabold text-center">
            Geospatial cloud made
            <br /> fast & accessible
          </h1>

          {/* SUBTITLE */}
          <p className="max-w-xl mx-auto mt-4 md:mt-8 lg:mx-0 md:text-base lg:text-xl text-center">
            Forget about architecture maintenance, and boost your team’s
            productivity with Maphub.co
          </p>

          {/* CALL-TO-ACTION */}
          <div className="w-full flex flex-col-reverse md:flex-row md:justify-center gap-4 mt-8">
            {/* PRIMARY */}
            <div className="flex flex-col justify-center items-center gap-y-4">
              <Link
                href="/signup"
                className="btn btn-primary btn-size-lg w-full md:w-fit"
                onClick={() =>
                  track("call_to_action_clicked", {
                    section: "hero",
                    name: "try_maphub_cloud",
                  })
                }
              >
                Try Maphub for free <ArrowRight className="ml-2 size-4" />
              </Link>

              <span className="text-xs text-muted-foreground">
                7 days free trial - no credit card required
              </span>
            </div>

            {/* SECONDARY */}
            <Link
              href="https://calendar.app.google/mGk9oVRTXYcqrRtn9"
              target="_blank"
              className="btn btn-outline btn-size-lg text-primary border-primary hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                track("call_to_action_clicked", {
                  section: "hero",
                  name: "book_a_demo",
                })
              }
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* BACKGROUND */}
      <Background mouse_position={mouse_position} />
    </div>
  );
}

const Background = ({
  mouse_position,
}: {
  mouse_position: { x: number; y: number };
}) => {
  const max_movement = 20; // 20px max movement for front layer

  const get_transform = (depth: number) => {
    const move_x = mouse_position.x * max_movement * depth;
    const move_y = mouse_position.y * max_movement * depth;
    return `translate(${move_x}px, ${move_y}px)`;
  };

  const transition_style = "transform 0.1s ease-out";

  return (
    <>
      {/* BACKGROUND - hero-2.webp (back layer - 0.3x depth) */}
      <Image
        src="/images/home/hero-2.webp"
        alt="QGIS"
        width={1000}
        height={715}
        className={cn(
          "absolute -z-1",
          "hidden md:block",
          "md:w-[800px] md:-top-[280px] md:right-[calc(50%_-_80px)]",
          "2xl:w-[800px] 2xl:-top-[320px] 2xl:right-[calc(50%_-_120px)]"
        )}
        style={{
          transform: get_transform(0.3),
          transition: transition_style,
        }}
      />

      {/* hero-1.webp (mid-back layer - 0.5x depth) */}
      <Image
        src="/images/home/hero-1.webp"
        alt="Maphub.co QGIS browser"
        width={1000}
        height={715}
        className={cn(
          "absolute -z-1",
          "w-[320px] -top-[80px] left-[calc(50%_-_20px)]",
          "md:w-[720px] md:-top-[40px] md:left-[calc(50%_+_240px)]",
          "2xl:w-[880px] 2xl:-top-[80px] 2xl:left-[calc(50%_+_360px)]"
        )}
        style={{
          transform: get_transform(0.5),
          transition: transition_style,
        }}
      />

      {/* hero-3.webp (mid-front layer - 0.7x depth) */}
      <Image
        src="/images/home/hero-3.webp"
        alt="Maphub.co QGIS plugin"
        width={1000}
        height={715}
        className={cn(
          "absolute -z-1",
          "hidden md:block",
          "md:w-[720px] md:-bottom-[160px] md:left-[calc(50%_+_240px)]",
          "2xl:w-[800px] 2xl:-bottom-[240px] 2xl:left-[calc(50%_+_280px)]"
        )}
        style={{
          transform: get_transform(0.7),
          transition: transition_style,
        }}
      />

      {/* hero-0.webp (front layer - 1.0x depth) */}
      <Image
        src="/images/home/hero-0.webp"
        alt="Maphub.co QGIS browser"
        width={1000}
        height={715}
        className={cn(
          "absolute -z-1",
          "w-[320px] right-[calc(50%_-_80px)] -bottom-[120px]",
          "md:w-[640px] md:right-[calc(50%_+_20px)] md:-bottom-[140px]",
          "2xl:w-[800px] 2xl:right-[calc(50%_+_40px)] 2xl:-bottom-[280px]"
        )}
        style={{
          transform: get_transform(1.0),
          transition: transition_style,
        }}
      />
    </>
  );
};
