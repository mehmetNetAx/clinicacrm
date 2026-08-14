"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AtlasLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AtlasLogo({ className, iconOnly = false, size = "md" }: AtlasLogoProps) {
  const iconSizes = {
    sm: "h-7 w-7 rounded-lg text-xs",
    md: "h-9 w-9 rounded-xl text-sm",
    lg: "h-11 w-11 rounded-2xl text-base",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2.5 group select-none", className)}>
      {/* Icon Badge */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 transition-transform duration-200 group-hover:scale-105",
          "bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600 ring-1 ring-white/20",
          iconSizes[size]
        )}
      >
        {/* Custom Medical + Chat Pulse SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white drop-shadow-sm"
        >
          {/* Chat bubble outline */}
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          {/* Medical heartbeat / pulse inside */}
          <path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" strokeWidth="2.5" className="stroke-teal-100" />
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-inherit bg-cyan-400/20 blur-sm -z-10 group-hover:bg-cyan-400/40 transition-colors" />
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={cn("font-black tracking-tight text-foreground", textSizes[size])}>
              Atlas
            </span>
            <span className={cn("font-extrabold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent", textSizes[size])}>
              Clinica
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
            WhatsApp CRM
          </span>
        </div>
      )}
    </div>
  );
}
