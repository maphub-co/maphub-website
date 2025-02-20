"use client";

// LIBRARIES
import { useEffect } from "react";

// CONFIG
import { init } from "@/lib/mixpanel";

export default function Mixpanel() {
  useEffect(() => {
    init();
  }, []);

  return null;
}
