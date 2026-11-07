'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Lightweight SVG sparkline mini-trend chart.
 * Renders a smooth cubic Bezier curve with an ambient gradient fill.
 * Zero external charting dependencies.
 */
export function MiniTrendLine({
  points,
  color,
  gradientId,
  height = 36,
  strokeWidth = 2,
}: {
  points: number[];
  color: string;
  gradientId: string;
  height?: number;
  strokeWidth?: number;
}) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 140;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const coordinates = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Build SVG path with cubic bezier smoothing
  let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const p0 = coordinates[i];
    const p1 = coordinates[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      aria-hidden="true"
      className="w-full overflow-visible"
      height={height}
      preserveAspectRatio="none"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path d={fillD} fill={`url(#${gradientId})`} />
      {/* Stroke line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export interface FutureKpiCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  accentColor: string; // Hex color for SVG sparklines
  accentBg: string; // Tailwind background for icon container
  accentText: string; // Tailwind text color
  accentGlow: string; // Tailwind drop-shadow / border glow
  sparklineData: number[];
  sparklineId: string;
  trend?: string;
  trendPositive?: boolean;
  badge?: ReactNode;
  isEmpty?: boolean;
}

/**
 * Premium futuristic KPI Card with glass surface, glowing icon container,
 * sharp metric typography, and an integrated responsive SVG sparkline.
 */
export function FutureKpiCard({
  label,
  value,
  subtext,
  icon: Icon,
  accentColor,
  accentBg,
  accentText,
  accentGlow,
  sparklineData,
  sparklineId,
  trend,
  trendPositive = true,
  badge,
  isEmpty = false,
}: FutureKpiCardProps) {
  return (
    <article
      aria-label={`${label}: ${value}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D5F3E8] dark:border-white/[0.08] bg-white dark:bg-[#101A3C]/90 p-5 shadow-[0_4px_20px_rgba(36,74,80,0.05)] dark:shadow-[0_12px_32px_rgba(5,8,23,0.6)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#A9E6DD] dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-[0_16px_40px_rgba(5,8,23,0.8)]"
    >
      {/* Subtle radial corner illumination on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: accentColor }}
      />

      {/* Top row: Label & Icon */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#3D6870] dark:text-[#A9B8D0]">
              {label}
            </span>
            {badge ? <div className="mt-1">{badge}</div> : null}
          </div>

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 dark:border-white/10 ${accentBg} ${accentText} ${accentGlow} transition-transform duration-300 group-hover:scale-105`}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={2} />
          </span>
        </div>

        {/* Metric value display */}
        <div className="mt-4">
          <p
            className={`text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl ${
              isEmpty ? 'text-slate-400 dark:text-slate-600' : 'text-[#244A50] dark:text-[#F5FBFA]'
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#5B7E86] dark:text-[#7E8DAA]">{subtext}</p>
        </div>
      </div>

      {/* Bottom section: Trend + Sparkline */}
      <div className="mt-5 pt-3 border-t border-[#D5F3E8]/60 dark:border-white/[0.06]">
        <div className="flex items-center justify-between gap-2 mb-2">
          {trend ? (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                trendPositive
                  ? 'text-[#1D7467] dark:text-[#A9E6DD]'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              <span>{trendPositive ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-[#5B7E86] dark:text-slate-500">
              Activity
            </span>
          )}
          <span className="text-[10px] text-[#5B7E86] dark:text-slate-500 font-mono">30-day</span>
        </div>

        <div className="h-9 w-full">
          <MiniTrendLine
            color={accentColor}
            gradientId={sparklineId}
            height={36}
            points={sparklineData}
          />
        </div>
      </div>
    </article>
  );
}
