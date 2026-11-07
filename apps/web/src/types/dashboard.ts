/**
 * Type definitions for the student dashboard data layer.
 *
 * All values in DEV_PREVIEW_* constants are clearly labeled as preview-only.
 * They must NEVER be presented as real student statistics.
 * Production values will be sourced from the authenticated API once
 * the exam and progress endpoints are implemented.
 */

/** Preparation journey data for the Hero Banner. */
export interface StudentJourneyData {
  /**
   * Overall preparation percentage, 0–100.
   * Derived from (topics completed / total topics) in the backend.
   * Dev-preview: fixed placeholder until the endpoint exists.
   */
  preparationPercent: number;

  /** Number of topics the student has completed at least one session for. */
  topicsCompleted: number;

  /** Total topics in the active curriculum. */
  totalTopics: number;

  /**
   * Rolling 30-day average score across all practice sessions, 0–100.
   * null when no sessions have been completed yet.
   */
  averagePerformance: number | null;
}

/** Data for a single KPI card in the student dashboard overview. */
export interface StudentKpiCardData {
  /** Short human-readable label shown below the value. */
  label: string;

  /**
   * Formatted display value. Use '—' when data is unavailable.
   * Examples: '24h 15m', '7', '1,420', '#12'
   */
  value: string;

  /**
   * Optional secondary descriptor beneath the value.
   * E.g., 'this week', 'in 30 days', 'of 100 attempted'.
   */
  detail?: string;

  /**
   * Optional percentage change relative to the previous period.
   * Positive = improvement, negative = decline.
   * null when insufficient historical data.
   */
  trend?: number | null;

  /** Tailwind class(es) for the icon wrapper and icon color. */
  accent: string;

  /** Tailwind class for the icon wrapper background. */
  accentBg: string;
}

// ---------------------------------------------------------------------------
// Dev-preview constants — CLEARLY LABELED, never production data
// ---------------------------------------------------------------------------

/**
 * @devpreview
 * Fixed placeholder journey data shown before backend endpoints are live.
 * Rendered with an explicit "Preview" badge at the call site.
 */
export const DEV_PREVIEW_JOURNEY: StudentJourneyData = {
  preparationPercent: 34,
  topicsCompleted: 68,
  totalTopics: 200,
  averagePerformance: null,
} as const;

/**
 * @devpreview
 * Four KPI card placeholders shown before backend endpoints are live.
 * Values deliberately use '—' to avoid suggesting real statistics.
 */
export const DEV_PREVIEW_KPI: StudentKpiCardData[] = [
  {
    label: 'Study Time',
    value: '—',
    detail: 'No sessions recorded yet',
    trend: null,
    accent: 'text-violet-300',
    accentBg: 'bg-violet-400/10 border-violet-400/15',
  },
  {
    label: 'Mock Tests',
    value: '—',
    detail: 'No tests attempted yet',
    trend: null,
    accent: 'text-blue-300',
    accentBg: 'bg-blue-400/10 border-blue-400/15',
  },
  {
    label: 'Practice Questions',
    value: '—',
    detail: 'No questions answered yet',
    trend: null,
    accent: 'text-cyan-300',
    accentBg: 'bg-cyan-400/10 border-cyan-400/15',
  },
  {
    label: 'Current Rank',
    value: '—',
    detail: 'Available after first mock test',
    trend: null,
    accent: 'text-amber-300',
    accentBg: 'bg-amber-400/10 border-amber-400/15',
  },
] as const;
