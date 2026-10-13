"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";

/**
 * Records landing parameters once per visit, as early as possible after load.
 * Rendered near the end of the document so it never blocks first paint.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}