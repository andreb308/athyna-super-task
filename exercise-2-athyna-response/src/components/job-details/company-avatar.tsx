import * as React from "react";
import type { AthynaJob } from "@/domain/jobs";

export interface CompanyAvatarProps {
  company: AthynaJob["company"];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CompanyAvatar({
  company,
  size = "lg",
  className = "",
}: CompanyAvatarProps) {
  const initials = (company.name || "Company").slice(0, 2).toUpperCase();

  const sizeClasses = {
    sm: "w-10 h-10 rounded-xl text-xs",
    md: "w-12 h-12 rounded-xl text-sm",
    lg: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-base sm:text-lg",
  }[size];

  if (company.logoUrl) {
    return (
      <div
        className={`${sizeClasses} bg-surface-container flex items-center justify-center shadow-xs border border-border-subtle overflow-hidden p-1.5 ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-surface-container-high text-on-surface font-mono font-bold flex items-center justify-center shadow-xs border border-border-subtle ${className}`}
    >
      {initials}
    </div>
  );
}
