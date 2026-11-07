'use client';

import { useEffect, useRef, useState } from 'react';

interface CircularPreparationProgressProps {
  /** Progress percentage, 0–100. */
  percent: number;
  /** Diameter of the SVG circle, in pixels. Default 120. */
  size?: number;
  /** Stroke width for the progress arc. Default 7. */
  strokeWidth?: number;
  /** Label shown beneath the percentage. Default 'Prepared'. */
  label?: string;
  /** Additional className applied to the outer container. */
  className?: string;
  /** Whether the circle should animate on mount. Default true. */
  animated?: boolean;
}

/**
 * SVG-based circular progress indicator for the student preparation percentage.
 *
 * Renders an accessible meter element (role="meter") with a smooth CSS
 * stroke-dashoffset animation. Uses violet/purple palette to match the
 * student dashboard design system.
 *
 * Dev-preview: rendered with a fixed percent value until real API data is
 * wired. The component accepts any 0–100 value and labels must reflect
 * the preview state at the call site.
 */
export function CircularPreparationProgress({
  percent,
  size = 120,
  strokeWidth = 7,
  label = 'Prepared',
  className = '',
  animated = true,
}: CircularPreparationProgressProps) {
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percent)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercent / 100) * circumference;

  // Animate from 0 to target on mount.
  const [displayedOffset, setDisplayedOffset] = useState(circumference);
  const initialized = useRef(false);

  useEffect(() => {
    if (!animated) {
      setDisplayedOffset(offset);
      return;
    }
    // Allow paint before triggering animation so CSS transition fires.
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        initialized.current = true;
        setDisplayedOffset(offset);
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [animated, offset]);

  const cx = size / 2;
  const cy = size / 2;
  const uniqueId = 'cpp-gradient';

  return (
    <div
      aria-label={`Preparation progress: ${clampedPercent}% ${label}`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedPercent}
      className={`relative inline-flex flex-col items-center ${className}`}
      role="meter"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={uniqueId}
            x1="0"
            x2={size}
            y1="0"
            y2={size}
          >
            <stop offset="0%" stopColor="#7367F0" />
            <stop offset="55%" stopColor="#B8DFF4" />
            <stop offset="100%" stopColor="#A9E6DD" />
          </linearGradient>
        </defs>

        {/* Track ring */}
        <circle
          cx={cx}
          cy={cy}
          fill="none"
          r={radius}
          stroke="rgba(184,223,244,0.14)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          fill="none"
          r={radius}
          stroke={`url(#${uniqueId})`}
          strokeDasharray={circumference}
          strokeDashoffset={displayedOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            transition: animated ? 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)' : 'none',
            filter: 'drop-shadow(0 0 6px rgba(169,230,221,0.35))',
          }}
        />
      </svg>

      {/* Centered label overlay — not rotated */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-2xl font-bold leading-none text-white tabular-nums">
          {clampedPercent}
          <span className="text-sm font-semibold text-[#A9E6DD]">%</span>
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#B8DFF4]/90">
          {label}
        </span>
      </div>
    </div>
  );
}
