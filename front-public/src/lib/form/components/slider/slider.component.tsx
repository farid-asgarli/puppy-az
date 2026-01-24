"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/external/utils";
import { useTranslations } from "next-intl";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue: number;
  maxValue: number;
  onChange: (values: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  showLabels?: boolean;
  disabled?: boolean;
  trackColor?: string;
  rangeColor?: string;
  thumbColor?: string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onChange,
  formatValue = (value) => value.toString(),
  className,
  showLabels = true,
  disabled = false,
  trackColor = "bg-gray-200",
  rangeColor = "bg-red-500",
  thumbColor = "bg-white",
}: RangeSliderProps) {
  const t = useTranslations("accessibility");
  const [isSliding, setIsSliding] = useState<"min" | "max" | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const minThumbRef = useRef<HTMLDivElement>(null);
  const maxThumbRef = useRef<HTMLDivElement>(null);

  // Keep values within bounds
  const boundedMinValue = Math.max(min, Math.min(minValue, maxValue - step));
  const boundedMaxValue = Math.min(max, Math.max(maxValue, minValue + step));

  // Calculate percentages for positioning
  const minPercentage = ((boundedMinValue - min) / (max - min)) * 100;
  const maxPercentage = ((boundedMaxValue - min) / (max - min)) * 100;

  // Handle keyboard interaction for accessibility
  const handleKeyDown =
    (thumbType: "min" | "max") => (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = thumbType === "min" ? boundedMinValue : boundedMaxValue;
      const bigStep = step * 10; // For page up/down

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newValue += step;
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newValue -= step;
          break;
        case "PageUp":
          e.preventDefault();
          newValue += bigStep;
          break;
        case "PageDown":
          e.preventDefault();
          newValue -= bigStep;
          break;
        case "Home":
          e.preventDefault();
          newValue = thumbType === "min" ? min : boundedMinValue + step;
          break;
        case "End":
          e.preventDefault();
          newValue = thumbType === "min" ? boundedMaxValue - step : max;
          break;
        default:
          return;
      }

      // Ensure the new value is within bounds
      newValue = Math.max(min, Math.min(max, newValue));

      if (thumbType === "min") {
        if (newValue <= boundedMaxValue - step) {
          onChange([newValue, boundedMaxValue]);
        }
      } else {
        if (newValue >= boundedMinValue + step) {
          onChange([boundedMinValue, newValue]);
        }
      }
    };

  // Handle mouse/touch interaction
  const handleMouseDown = (thumbType: "min" | "max") => () => {
    if (disabled) return;
    setIsSliding(thumbType);
  };

  const handleInteractionMove = (clientX: number) => {
    if (!isSliding || !trackRef.current || disabled) return;

    const { left, width } = trackRef.current.getBoundingClientRect();
    const position = clientX - left;
    const percentage = Math.max(0, Math.min(1, position / width));

    // Calculate the new value based on percentage
    const newValue = Math.round((percentage * (max - min) + min) / step) * step;

    if (isSliding === "min") {
      if (newValue <= boundedMaxValue - step) {
        onChange([newValue, boundedMaxValue]);
      }
    } else {
      if (newValue >= boundedMinValue + step) {
        onChange([boundedMinValue, newValue]);
      }
    }
  };

  // Handle mouse/touch movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleInteractionMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteractionMove(e.touches[0].clientX);
      }
    };

    const handleInteractionEnd = () => {
      setIsSliding(null);
    };

    if (isSliding) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mouseup", handleInteractionEnd);
      document.addEventListener("touchend", handleInteractionEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleInteractionEnd);
      document.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isSliding, boundedMinValue, boundedMaxValue, onChange, min, max, step]);

  // Focus management for keyboard users
  useEffect(() => {
    if (isSliding === "min" && minThumbRef.current) {
      minThumbRef.current.focus();
    } else if (isSliding === "max" && maxThumbRef.current) {
      maxThumbRef.current.focus();
    }
  }, [isSliding]);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="relative py-2">
        {/* Track */}
        <div
          ref={trackRef}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-full h-1.5 rounded-full",
            trackColor,
            disabled && "opacity-50",
          )}
        >
          {/* Range highlight */}
          <div
            className={cn("absolute top-0 h-full rounded-full", rangeColor)}
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />
        </div>

        {/* Minimum thumb */}
        <motion.div
          ref={minThumbRef}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={boundedMinValue}
          aria-valuetext={formatValue(boundedMinValue)}
          aria-label={t("minValue")}
          onKeyDown={handleKeyDown("min")}
          className={cn(
            "rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 focus:outline-none",
            disabled
              ? "cursor-not-allowed"
              : "cursor-grab active:cursor-grabbing",
          )}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleMouseDown("min")}
          animate={{
            scale: isSliding === "min" ? 1.2 : 1,
            boxShadow:
              isSliding === "min"
                ? "0 0 0 4px rgba(220, 220, 220, 0.5)"
                : "0 0 0 2px rgba(220, 220, 220, 0.3)",
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        >
          <div
            className={cn(
              "w-5 h-5 rounded-full border border-gray-200 shadow",
              thumbColor,
            )}
          />
        </motion.div>

        {/* Maximum thumb */}
        <motion.div
          ref={maxThumbRef}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={boundedMaxValue}
          aria-valuetext={formatValue(boundedMaxValue)}
          aria-label={t("maxValue")}
          onKeyDown={handleKeyDown("max")}
          className={cn(
            "rounded-full absolute top-1/2 -translate-y-1/2 -translate-x-1/2 focus:outline-none",
            disabled
              ? "cursor-not-allowed"
              : "cursor-grab active:cursor-grabbing",
          )}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleMouseDown("max")}
          animate={{
            scale: isSliding === "max" ? 1.2 : 1,
            boxShadow:
              isSliding === "max"
                ? "0 0 0 4px rgba(220, 220, 220, 0.5)"
                : "0 0 0 2px rgba(220, 220, 220, 0.3)",
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        >
          <div
            className={cn(
              "w-5 h-5 rounded-full border border-gray-200 shadow",
              thumbColor,
            )}
          />
        </motion.div>
      </div>

      {/* Value labels */}
      {showLabels && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500 font-medium text-sm">
            {formatValue(boundedMinValue)}
          </div>
          <div className="text-gray-500 font-medium text-sm">
            {formatValue(boundedMaxValue)}
          </div>
        </div>
      )}
    </div>
  );
}
