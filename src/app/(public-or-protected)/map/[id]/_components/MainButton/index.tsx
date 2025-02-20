"use client";

// LIBRARIES
import { useState, useRef, useEffect } from "react";
import { Map, ChevronDown } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TilerUrl from "./TilerUrl";
import DownloadButton from "./DownloadButton";
import IframeCode from "./IframeCode";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= COMPONENT =======*/
export default function MapButton({ className }: { className?: string }) {
  /*------- ATTRIBUTES -------*/
  const [is_open, set_open] = useState(false);
  const button_ref = useRef<HTMLDivElement>(null);

  /*------- METHODS -------*/
  const handle_click_outside = (event: MouseEvent) => {
    if (
      button_ref.current &&
      !button_ref.current.contains(event.target as Node)
    ) {
      set_open(false);
    }
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (is_open) {
      document.addEventListener("mousedown", handle_click_outside);
    } else {
      document.removeEventListener("mousedown", handle_click_outside);
    }

    return () => {
      document.removeEventListener("mousedown", handle_click_outside);
    };
  }, [is_open]);

  /*------- RENDERER -------*/
  return (
    <div ref={button_ref} className={cn(className, "relative")}>
      {/* BUTTON */}
      <Button
        variant="primary"
        className={cn(
          "px-3 flex items-center gap-x-2 transition-all",
          is_open && "bg-primary text-primary-foreground"
        )}
        onClick={() => set_open((prev) => !prev)}
      >
        <Map className="size-5" />
        <span>Map</span>
        <ChevronDown
          className={cn("size-4 transition-transform", is_open && "rotate-180")}
        />
      </Button>

      {/* EXPANDED CONTENT */}
      {is_open && (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg">
          {/* HEADER */}
          {/* <CardHeader className="p-4">
            <h3 className="text-sm font-semibold">Exports</h3>
          </CardHeader> */}

          {/* CONTENT */}
          <CardContent className="flex flex-col gap-y-4 p-4">
            <TilerUrl />
            <IframeCode />
            <DownloadButton />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
