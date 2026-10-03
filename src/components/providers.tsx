"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

export function Providers({ children, github }: { children: ReactNode; github: string }) {
  // Easter egg #1: a note for people who open DevTools.
  useEffect(() => {
    console.log(
      "%c$ tail -f /var/log/visitor.log\n%cYou opened the console — you're my kind of person.\nMore of my work lives at " +
        github +
        "\nTry typing `sudo rm -rf /` into the terminal on the home page.",
      "color:#7fd4a6;font-family:monospace;font-size:12px",
      "color:#9a9fa8;font-family:monospace;font-size:12px",
    );
  }, [github]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
