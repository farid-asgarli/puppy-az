"use client";

import React, { useState } from "react";
import { cn } from "@/lib/external/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  rounded?: "full" | "2xl";
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-8 h-8 text-sm",
  sm: "w-10 h-10 text-base",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-2xl",
  xl: "w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl",
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  // Only return first letter of the name
  return name.trim()[0]?.toUpperCase() || "?";
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  rounded = "full",
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const hasValidSrc = src && src.trim() !== "" && !imageError;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-800",
        rounded === "full" ? "rounded-full" : "rounded-2xl",
        sizeClasses[size],
        className,
      )}
    >
      {hasValidSrc ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-white font-medium">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
