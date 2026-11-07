'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Beaker,
  BookOpen,
  BookOpenText,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  HeartPulse,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthenticatedUser } from '@/components/auth/auth-boundary';
import { useDashboardPreferences } from '@/components/dashboard/admin-dashboard-shell';
import type { HealthCheckResponse, OrganizationRecord } from '@cee/contracts';
import { ApiClientError } from '@/lib/api-client';
import { dashboardApi } from '@/lib/dashboard-api';
import { organizationsApi } from '@/lib/organizations-api';
import adminBackground from '../../../Media/admin.png';

type LoadState = 'loading' | 'ready' | 'error';
type DateRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'This Year';
type QuickAction = 'user' | 'institution' | 'exam' | 'material';
type ActivitySort = 'recent' | 'alphabetical';

const chartSets: Record<DateRange, { label: string; value: number }[]> = {
  'Last 7 Days': [
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 47 },
    { label: 'Wed', value: 41 },
    { label: 'Thu', value: 67 },
    { label: 'Fri', value: 53 },
    { label: 'Sat', value: 78 },
    { label: 'Sun', value: 86 },
  ],
  'Last 30 Days': [
    { label: 'Week 1', value: 28 },
    { label: 'Week 2', value: 48 },
    { label: 'Week 3', value: 39 },
    { label: 'Week 4', value: 76 },
    { label: 'Now', value: 89 },
  ],
  'Last 3 Months': [
    { label: 'Aug', value: 31 },
    { label: 'Sep', value: 57 },
    { label: 'Oct', value: 47 },
    { label: 'Nov', value: 82 },
    { label: 'Now', value: 91 },
  ],
  'Last 6 Months': [
    { label: 'Jun', value: 25 },
    { label: 'Jul', value: 45 },
    { label: 'Aug', value: 38 },
    { label: 'Sep', value: 66 },
    { label: 'Oct', value: 54 },
    { label: 'Nov', value: 88 },
  ],
  'This Year': [
    { label: 'Jan', value: 24 },
    { label: 'Mar', value: 44 },
    { label: 'May', value: 38 },
    { label: 'Jul', value: 66 },
    { label: 'Sep', value: 57 },
    { label: 'Nov', value: 88 },
  ],
};

const activities = [
  {
    title: 'New student registered',
    detail: 'Srijana Sharma',
    category: 'Students',
    time: '8 min ago',
    icon: UserPlus,
    tone: 'teal',
  },
  {
    title: 'New institution added',
    detail: 'Everest Medical College',
    category: 'Institutions',
    time: '42 min ago',
    icon: Building2,
    tone: 'blue',
  },
  {
    title: 'Mock test completed',
    detail: 'CEE Full Mock 2025',
    category: 'Examinations',
    time: '2 hours ago',
    icon: ClipboardCheck,
    tone: 'purple',
  },
  {
    title: 'Payment received',
    detail: 'NPR 1,500',
    category: 'Payments',
    time: '3 hours ago',
    icon: Wallet,
    tone: 'green',
  },
  {
    title: 'Study material published',
    detail: 'Human Physiology · Biology',
    category: 'Resources',
    time: 'Yesterday',
    icon: BookOpenText,
    tone: 'orange',
  },
  {
    title: 'Teacher account invited',
    detail: 'Dr. Ramesh Karki',
    category: 'Students',
    time: 'Yesterday',
    icon: GraduationCap,
    tone: 'blue',
  },
  {
    title: 'Institution profile updated',
    detail: 'Kathmandu Health Academy',
    category: 'Institutions',
    time: '2 days ago',
    icon: Building2,
    tone: 'teal',
  },
  {
    title: 'New mock exam scheduled',
    detail: 'Weekly Practice Set 08',
    category: 'Examinations',
    time: '2 days ago',
    icon: CalendarDays,
    tone: 'purple',
  },
];

const subjects = [
  { name: 'Biology', percent: 92, icon: Activity, color: '#18B7A8' },
  { name: 'Chemistry', percent: 88, icon: Beaker, color: '#449BE8' },
  { name: 'Physics', percent: 85, icon: HeartPulse, color: '#8C70DB' },
  { name: 'Mathematics', percent: 80, icon: Sparkles, color: '#F3A54B' },
];

function serviceError(error: unknown): string {
  if (error instanceof ApiClientError && error.status === 401) {
    return 'Your session has expired. Sign in again to continue.';
  }
  if (error instanceof ApiClientError && error.status === 403) {
    return 'Your account is not authorized to view platform-wide data.';
  }
  return 'The service could not be reached. Retry to check again.';
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
  points,
  loading = false,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Users;
  tone: string;
  points: string;
  loading?: boolean;
}) {
  return (
    <article className="dashboard-surface group min-w-0 overflow-hidden rounded-[20px] border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(27,90,103,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(27,90,103,.12)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-[26px] font-bold leading-none tracking-tight text-[#123B49] sm:text-[30px]">
            {loading ? (
              <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-100" />
            ) : (
              value
            )}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone}`}
        >
          <Icon aria-hidden="true" size={20} strokeWidth={2} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
          <ArrowUpRight aria-hidden="true" size={13} />
          {change}
        </span>
        <svg aria-hidden="true" className="h-7 w-[72px] overflow-visible" viewBox="0 0 72 26">
          <polyline
            fill="none"
            points={points}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
            className="text-teal-500/75 transition-all group-hover:text-teal-600"
          />
        </svg>
      </div>
    </article>
  );
}

function ActivityChart({ range }: { range: DateRange }) {
  const data = chartSets[range];
  const coords = data.map((point, index) => ({
    ...point,
    x: 54 + index * (624 / Math.max(data.length - 1, 1)),
    y: 198 - point.value * 1.65,
  }));
  const line = coords.map(({ x, y }) => `${x},${y}`).join(' ');
  const area = `54,210 ${line} 678,210`;

  return (
    <svg
      aria-label={`${range} student registration activity chart, illustrative data`}
      className="mt-4 block h-[218px] w-full overflow-visible"
      preserveAspectRatio="none"
      role="img"
      viewBox="0 0 720 240"
    >
      <defs>
        <linearGradient id="activity-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#15BEB2" stopOpacity=".25" />
          <stop offset="100%" stopColor="#15BEB2" stopOpacity=".015" />
        </linearGradient>
        <linearGradient id="activity-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#11B6AC" />
          <stop offset="100%" stopColor="#1486D4" />
        </linearGradient>
      </defs>
      {[35, 75, 115, 155, 195].map((y, index) => (
        <g key={y}>
          <line stroke="#E6EFF1" strokeDasharray="3 5" x1="52" x2="690" y1={y} y2={y} />
          <text fill="#94A8AE" fontSize="10" textAnchor="end" x="42" y={y + 3}>
            {[100, 75, 50, 25, 0][index]}
          </text>
        </g>
      ))}
      <polygon fill="url(#activity-area)" points={area} />
      <polyline
        fill="none"
        points={line}
        stroke="url(#activity-line)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      {coords.map((point) => (
        <g key={point.label}>
          <circle
            cx={point.x}
            cy={point.y}
            fill="#fff"
            r="5"
            stroke="#12B8AE"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          >
            <title>{`${point.label}: ${point.value} registrations (illustrative)`}</title>
          </circle>
          <text fill="#8A9FA4" fontSize="10" textAnchor="middle" x={point.x} y="230">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ActivityDialog({
  action,
  organizations,
  busy,
  onClose,
  onSubmit,
}: {
  action: QuickAction;
  organizations: OrganizationRecord[];
  busy: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const title = {
    user: 'Invite a user',
    institution: 'Add an institution',
    exam: 'Create an exam draft',
    material: 'Add study material',
  }[action];
  const Icon = {
    user: UserPlus,
    institution: Building2,
    exam: ClipboardCheck,
    material: BookOpen,
  }[action];
  const isDraft = action === 'exam' || action === 'material';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#082B38]/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="quick-action-title"
        aria-modal="true"
        className="dashboard-surface w-full max-w-[470px] rounded-3xl border border-white/70 bg-white p-6 shadow-2xl sm:p-7"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3F8F5] text-[#069C93]">
              <Icon aria-hidden="true" size={21} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#153B48]" id="quick-action-title">
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">CEE Medical Prep administration</p>
            </div>
          </div>
          <button
            aria-label="Close dialog"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {isDraft ? (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
            The platform API does not publish exams or study materials yet. This saves an explicitly
            local draft in this browser only.
          </div>
        ) : null}
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          {action === 'institution' ? (
            <label className="block text-sm font-medium text-slate-700">
              Institution name
              <input
                autoFocus
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                maxLength={120}
                name="name"
                placeholder="e.g. Kathmandu Medical College"
                required
              />
            </label>
          ) : null}
          {action === 'user' ? (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  autoFocus
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Institution
                <select
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-teal-500"
                  name="organizationId"
                  required
                >
                  <option value="">Select an institution</option>
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Role
                <select
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-teal-500"
                  name="role"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="STAFF">Staff</option>
                </select>
              </label>
            </>
          ) : null}
          {action === 'exam' ? (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Exam title
                <input
                  autoFocus
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-teal-500"
                  maxLength={120}
                  name="title"
                  placeholder="e.g. CEE Full Mock 2026"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Subject
                <select
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-teal-500"
                  name="subject"
                >
                  <option>All Subjects</option>
                  <option>Biology</option>
                  <option>Chemistry</option>
                  <option>Physics</option>
                  <option>Mathematics</option>
                </select>
              </label>
            </>
          ) : null}
          {action === 'material' ? (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Material title
                <input
                  autoFocus
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none focus:border-teal-500"
                  maxLength={120}
                  name="title"
                  placeholder="e.g. Cell Biology Revision Notes"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Resource type
                <select
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:border-teal-500"
                  name="type"
                >
                  <option>Notes</option>
                  <option>Video</option>
                  <option>Course</option>
                </select>
              </label>
            </>
          ) : null}
          {action === 'user' && organizations.length === 0 ? (
            <p className="text-xs text-amber-700">Add an institution before inviting a user.</p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#087E81] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#076B70] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy || (action === 'user' && organizations.length === 0)}
              type="submit"
            >
              {busy ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
              ) : (
                <Check aria-hidden="true" size={16} />
              )}
              {busy
                ? 'Saving…'
                : isDraft
                  ? 'Save local draft'
                  : action === 'user'
                    ? 'Send invitation'
                    : 'Create institution'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function SuperAdminOverview() {
  const user = useAuthenticatedUser();
  const { theme } = useDashboardPreferences();
  const [retryCount, setRetryCount] = useState(0);
  const [organizationState, setOrganizationState] = useState<LoadState>('loading');
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [organizationError, setOrganizationError] = useState('');
  const [healthState, setHealthState] = useState<LoadState>('loading');
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [healthCheckedAt, setHealthCheckedAt] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('Last 7 Days');
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const [savingAction, setSavingAction] = useState(false);
  const [toast, setToast] = useState('');
  const [activityFilter, setActivityFilter] = useState('All');
  const [activitySort, setActivitySort] = useState<ActivitySort>('recent');
  const [activityPage, setActivityPage] = useState(0);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const loadData = useCallback(async () => {
    setOrganizationState('loading');
    setHealthState('loading');
    setOrganizationError('');
    const [organizationResult, healthResult] = await Promise.allSettled([
      organizationsApi.list(),
      dashboardApi.platformHealth(),
    ]);
    if (organizationResult.status === 'fulfilled') {
      setOrganizations(organizationResult.value);
      setOrganizationState('ready');
    } else {
      setOrganizationError(serviceError(organizationResult.reason));
      setOrganizationState('error');
    }
    if (healthResult.status === 'fulfilled') {
      setHealth(healthResult.value);
      setHealthCheckedAt(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setHealthState('ready');
    } else {
      setHealth(null);
      setHealthState('error');
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') void loadData();
  }, [loadData, retryCount, user?.role]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredActivities = useMemo(() => {
    const filtered = activities.filter(
      (activity) => activityFilter === 'All' || activity.category === activityFilter,
    );
    if (activitySort === 'alphabetical') {
      filtered.sort((first, second) => first.title.localeCompare(second.title));
    }
    return filtered;
  }, [activityFilter, activitySort]);
  const pageSize = 4;
  const visibleActivities = showAllActivities
    ? filteredActivities.slice(activityPage * pageSize, activityPage * pageSize + pageSize)
    : filteredActivities.slice(0, pageSize);
  const activityPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <section
        aria-labelledby="access-denied-title"
        className="mx-auto max-w-xl rounded-2xl border border-[#E0ECEA] bg-white p-8 text-center shadow-sm"
        role="alert"
      >
        <ShieldCheck aria-hidden="true" className="mx-auto text-[#4A8586]" size={32} />
        <h1 className="mt-4 text-xl font-bold text-[#17383F]" id="access-denied-title">
          Super Admin access required
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#607B7F]">
          This dashboard is available only to platform super administrators.
        </p>
      </section>
    );
  }

  const healthy = healthState === 'ready' && health?.status === 'healthy';
  const healthLabel =
    healthState === 'loading'
      ? 'Checking services'
      : healthState === 'error'
        ? 'Status unavailable'
        : healthy
          ? 'System Online'
          : 'Service degradation';

  async function submitQuickAction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedAction) return;
    const formData = new FormData(event.currentTarget);
    setSavingAction(true);
    try {
      if (selectedAction === 'institution') {
        await organizationsApi.create({ name: String(formData.get('name') ?? '').trim() });
        await loadData();
        setToast('Institution created successfully.');
      } else if (selectedAction === 'user') {
        const organizationId = String(formData.get('organizationId') ?? '');
        const role = formData.get('role');
        if (role !== 'STUDENT' && role !== 'TEACHER' && role !== 'STAFF') {
          setToast('Choose a valid user role.');
          return;
        }
        await organizationsApi.createInvitation(organizationId, {
          email: String(formData.get('email') ?? '').trim(),
          role,
        });
        setToast('Invitation created successfully.');
      } else {
        const drafts = JSON.parse(localStorage.getItem('cee-dashboard-drafts') ?? '[]') as {
          title: string;
          type: string;
          createdAt: string;
        }[];
        const title = String(formData.get('title') ?? '').trim();
        drafts.unshift({
          title,
          type:
            selectedAction === 'exam'
              ? 'Exam draft'
              : `Study material · ${String(formData.get('type') ?? 'Notes')}`,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('cee-dashboard-drafts', JSON.stringify(drafts.slice(0, 50)));
        setToast('Draft saved in this browser. It has not been published to the platform.');
      }
      setSelectedAction(null);
    } catch (error) {
      setToast(
        error instanceof ApiClientError
          ? error.message
          : 'Unable to complete this action. Please try again.',
      );
    } finally {
      setSavingAction(false);
    }
  }

  return (
    <div className="space-y-5 pb-8" data-theme={theme}>
      <section className="relative isolate flex min-h-[178px] flex-col items-start gap-4 overflow-hidden rounded-[24px] border border-white/70 bg-[#DFF7F7] p-5 shadow-[0_10px_30px_rgba(18,106,123,.1)] sm:min-h-[194px] sm:flex-row sm:items-center sm:px-8">
        <Image
          alt=""
          className="absolute inset-0 -z-20 object-cover object-[50%_10%]"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1500px"
          src={adminBackground}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F1FEFE]/95 via-[#F1FEFE]/85 to-[#E9FBFF]/35"
        />
        <div className="relative max-w-[600px]">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#168C94]">
            CEE Medical Prep · Admin Panel
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#103A48] sm:text-[32px]">
              Dashboard Overview
            </h1>
            <Activity aria-hidden="true" className="hidden text-[#13AFA5] sm:block" size={25} />
          </div>
          <p className="mt-2 text-sm text-[#496D76]">
            Welcome back, {user.fullName.trim() || 'Administrator'}!{' '}
            <span aria-hidden="true">👋</span>
          </p>
        </div>
        <div className="dashboard-surface relative flex w-full items-center gap-3 rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm sm:ml-auto sm:w-auto sm:min-w-[205px]">
          <span
            className={`relative flex h-3 w-3 shrink-0 rounded-full ${healthy ? 'bg-emerald-500' : healthState === 'loading' ? 'bg-amber-400' : 'bg-slate-400'}`}
          >
            {healthy ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />
            ) : null}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#174350]" aria-live="polite">
              {healthLabel}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-500">
              {healthCheckedAt
                ? `Health check · ${healthCheckedAt}`
                : healthState === 'error'
                  ? 'API health endpoint did not respond'
                  : 'Checking platform services'}
            </p>
          </div>
          {healthState === 'error' ? (
            <button
              aria-label="Retry system status"
              className="ml-auto rounded-lg p-2 text-[#4C777A] hover:bg-[#EDF6F4]"
              onClick={() => setRetryCount((count) => count + 1)}
              type="button"
            >
              <Activity size={15} />
            </button>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-[11px] font-medium text-[#69838A]">
          Platform snapshot{' '}
          <span className="ml-1 rounded-full border border-[#D5EAE9] bg-white/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#718A8F]">
            Sample analytics
          </span>
        </p>
        <p className="text-[10px] text-[#81979C]">
          Registration, exam and payment insights are illustrative until analytics APIs are
          connected.
        </p>
      </div>

      {organizationState === 'error' ? (
        <div
          className="flex flex-col gap-3 rounded-xl border border-[#E8C6C1] bg-[#FFF8F6] px-4 py-3 text-sm text-[#854B43] sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>{organizationError}</p>
          <button
            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#E6C6C0] px-3 py-2 text-xs font-semibold hover:bg-white sm:self-auto"
            onClick={() => setRetryCount((count) => count + 1)}
            type="button"
          >
            <Activity size={14} />
            Retry metrics
          </button>
        </div>
      ) : null}

      <section aria-label="Platform metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          change="+12.5%"
          icon={Users}
          label="Total Students"
          points="1,22 12,17 23,20 34,11 45,15 57,6 70,9"
          tone="bg-gradient-to-br from-[#DDF9F5] to-[#BFF1E9] text-[#0BA99E]"
          value="12,450"
        />
        <MetricCard
          change="+5.2%"
          icon={Building2}
          label="Institutions"
          loading={organizationState === 'loading'}
          points="1,20 12,18 23,12 34,15 45,10 57,12 70,5"
          tone="bg-gradient-to-br from-[#E5F4FF] to-[#C9E8FF] text-[#2595DD]"
          value={
            organizationState === 'ready'
              ? organizations.length.toLocaleString()
              : organizationState === 'error'
                ? '—'
                : ''
          }
        />
        <MetricCard
          change="+8.7%"
          icon={GraduationCap}
          label="Active Teachers"
          points="1,21 12,15 23,17 34,9 45,12 57,5 70,7"
          tone="bg-gradient-to-br from-[#E3FAF0] to-[#C5F3DD] text-[#17A970]"
          value="320"
        />
        <MetricCard
          change="+14.3%"
          icon={ClipboardCheck}
          label="Mock Tests"
          points="1,22 12,16 23,18 34,13 45,14 57,6 70,3"
          tone="bg-gradient-to-br from-[#F1EAFE] to-[#E0D3FF] text-[#8458D9]"
          value="1,280"
        />
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(290px,.92fr)]">
        <article className="dashboard-surface min-w-0 rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(27,90,103,.065)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-[#153B48]">
                <Activity aria-hidden="true" className="text-[#13AFA5]" size={19} />
                Platform Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">Student registrations and engagement</p>
            </div>
            <label className="relative flex h-9 items-center gap-1.5 rounded-xl border border-[#E4EFF0] bg-[#FAFDFD] pl-2.5 pr-2 text-[11px] font-semibold text-[#526E76]">
              <CalendarDays aria-hidden="true" className="text-[#4E9297]" size={14} />
              <span className="sr-only">Date range</span>
              <select
                aria-label="Chart date range"
                className="max-w-[116px] cursor-pointer appearance-none bg-transparent pr-4 outline-none"
                onChange={(event) => setDateRange(event.target.value as DateRange)}
                value={dateRange}
              >
                {Object.keys(chartSets).map((range) => (
                  <option key={range}>{range}</option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2 text-slate-400"
                size={12}
              />
            </label>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-[#84999E]">
            <span className="h-2 w-2 rounded-full bg-[#14B8AA]" />
            Registrations{' '}
            <span className="ml-auto rounded-full bg-[#F0F8F7] px-2 py-1 text-[9px] font-medium">
              Illustrative trend
            </span>
          </div>
          <ActivityChart range={dateRange} />
        </article>

        <article className="dashboard-surface rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(27,90,103,.065)] sm:p-5">
          <div className="mb-4">
            <h2 className="text-[16px] font-bold text-[#153B48]">Quick Actions</h2>
            <p className="mt-1 text-xs text-slate-500">Common platform workflows</p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 2xl:grid-cols-1">
            {[
              {
                key: 'user' as const,
                label: 'Add User',
                detail: 'Invite to an institution',
                icon: UserPlus,
                tone: 'bg-[#E3F8F5] text-[#079E93]',
              },
              {
                key: 'institution' as const,
                label: 'Add Institution',
                detail: 'Register a new institution',
                icon: Building2,
                tone: 'bg-[#E8F4FF] text-[#298ED0]',
              },
              {
                key: 'exam' as const,
                label: 'Create Exam',
                detail: 'Save a local exam draft',
                icon: ClipboardCheck,
                tone: 'bg-[#F1EAFE] text-[#835FD0]',
              },
              {
                key: 'material' as const,
                label: 'Add Study Material',
                detail: 'Save a local resource draft',
                icon: BookOpenText,
                tone: 'bg-[#E8F8EF] text-[#18A773]',
              },
            ].map(({ key, label, detail, icon: Icon, tone }) => (
              <button
                className="group flex min-h-[62px] items-center gap-3 rounded-[15px] border border-[#E5EFF0] bg-white/75 px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-[#A8DEDA] hover:bg-[#F8FDFD] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18A99F]"
                key={key}
                onClick={() => setSelectedAction(key)}
                type="button"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}
                >
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-bold text-[#244A55]">
                    {label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-500">{detail}</span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="shrink-0 text-[#9BB1B5] transition group-hover:translate-x-0.5 group-hover:text-[#138F8C]"
                  size={16}
                />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(270px,.9fr)]">
        <article
          className="dashboard-surface rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(27,90,103,.065)] sm:p-5"
          id="recent-activities"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#153B48]">
                <Clock3 aria-hidden="true" className="text-[#3B9292]" size={17} />
                Recent Activities
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Latest administrative events · sample
              </p>
            </div>
            <button
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-[#138F8C] transition hover:bg-[#EFF9F8]"
              onClick={() => {
                setShowAllActivities((shown) => !shown);
                setActivityPage(0);
              }}
              type="button"
            >
              {showAllActivities ? 'Show less' : 'View all'}
              <ArrowRight size={12} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {['All', 'Students', 'Institutions', 'Examinations', 'Payments'].map((filter) => (
              <button
                aria-pressed={activityFilter === filter}
                className={`rounded-full px-2.5 py-1 text-[9px] font-semibold transition ${activityFilter === filter ? 'bg-[#DDF5F2] text-[#087F7A]' : 'bg-[#F4F8F8] text-[#778D92] hover:bg-[#E9F4F3]'}`}
                key={filter}
                onClick={() => {
                  setActivityFilter(filter);
                  setActivityPage(0);
                }}
                type="button"
              >
                {filter}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-1 text-[9px] text-[#71888D]">
              <span className="sr-only">Sort activities</span>
              <select
                aria-label="Sort activities"
                className="max-w-[108px] rounded-lg border border-[#E5EEEE] bg-white px-1.5 py-1 text-[9px] outline-none"
                onChange={(event) =>
                  setActivitySort(event.target.value === 'alphabetical' ? 'alphabetical' : 'recent')
                }
                value={activitySort}
              >
                <option value="recent">Newest first</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </label>
          </div>
          <ul className="mt-2 divide-y divide-[#EDF2F2]">
            {visibleActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <li
                  className="flex items-center gap-2.5 py-2.5"
                  key={`${activity.title}-${activity.detail}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${activity.tone === 'teal' ? 'bg-[#E1F7F3] text-[#12A698]' : activity.tone === 'blue' ? 'bg-[#E7F3FC] text-[#3A91CE]' : activity.tone === 'purple' ? 'bg-[#F1EAFE] text-[#8965D4]' : activity.tone === 'green' ? 'bg-[#E6F7EE] text-[#1EAA71]' : 'bg-[#FFF2E5] text-[#E49536]'}`}
                  >
                    <Icon aria-hidden="true" size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10px] font-semibold text-[#385961]">
                      {activity.title}
                    </span>
                    <span className="block truncate text-[10px] text-slate-500">
                      {activity.detail}
                    </span>
                  </span>
                  <span className="hidden shrink-0 rounded-full bg-[#F1F7F7] px-2 py-1 text-[8px] font-medium text-[#71888D] sm:inline">
                    {activity.category}
                  </span>
                  <time className="shrink-0 text-[9px] text-[#91A3A7]">{activity.time}</time>
                </li>
              );
            })}
            {visibleActivities.length === 0 ? (
              <li className="py-8 text-center text-xs text-slate-500">
                No activities in this category.
              </li>
            ) : null}
          </ul>
          {showAllActivities && filteredActivities.length > pageSize ? (
            <div className="mt-2 flex items-center justify-between border-t border-[#EDF2F2] pt-2">
              <span className="text-[9px] text-slate-500">
                Page {activityPage + 1} of {activityPages}
              </span>
              <div className="flex gap-1">
                <button
                  aria-label="Previous activities page"
                  className="rounded-lg border border-[#E5EEEE] px-2 py-1 text-[10px] disabled:opacity-40"
                  disabled={activityPage === 0}
                  onClick={() => setActivityPage((page) => page - 1)}
                  type="button"
                >
                  Previous
                </button>
                <button
                  aria-label="Next activities page"
                  className="rounded-lg border border-[#E5EEEE] px-2 py-1 text-[10px] disabled:opacity-40"
                  disabled={activityPage + 1 >= activityPages}
                  onClick={() => setActivityPage((page) => page + 1)}
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </article>

        <article className="dashboard-surface rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_8px_28px_rgba(27,90,103,.065)] sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#153B48]">
                <GraduationCap aria-hidden="true" className="text-[#3B9292]" size={18} />
                Top Performing Subjects
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">Average learner scores · sample</p>
            </div>
            <span className="rounded-lg bg-[#F0F8F7] p-2 text-[#348F8C]">
              <Activity aria-hidden="true" size={15} />
            </span>
          </div>
          <div className="mt-5 space-y-[18px]">
            {subjects.map(({ name, percent, icon: Icon, color }) => (
              <div key={name}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <Icon aria-hidden="true" size={14} />
                  </span>
                  <span className="flex-1 text-[11px] font-semibold text-[#46646B]">{name}</span>
                  <span className="text-[11px] font-bold text-[#244751]">{percent}%</span>
                </div>
                <div
                  aria-label={`${name}: ${percent}% average`}
                  className="h-[7px] overflow-hidden rounded-full bg-[#EDF3F4]"
                  role="img"
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ backgroundColor: color, width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-[10px] text-[#83989C]">
            <ArrowDownRight aria-hidden="true" size={13} />
            Based on sample performance data
          </p>
        </article>

        <aside className="relative isolate flex min-h-[255px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#064958] p-5 text-white shadow-[0_14px_32px_rgba(14,86,98,.19)] sm:p-6">
          <Image
            alt=""
            className="absolute inset-0 -z-20 object-cover object-[85%_82%] transition-transform duration-700 hover:scale-[1.03]"
            fill
            sizes="(max-width: 1280px) 100vw, 360px"
            src={adminBackground}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-br from-[#046B73]/95 via-[#087281]/88 to-[#06394D]/65"
          />
          <span
            aria-hidden="true"
            className="absolute -right-7 -top-8 -z-10 h-28 w-28 rounded-full border-[14px] border-white/10"
          />
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.13em] text-[#D4FAF3]">
              <Stethoscope size={12} />
              For future healthcare leaders
            </span>
            <h2 className="mt-5 max-w-[250px] text-[24px] font-bold leading-[1.12] tracking-tight">
              Prepare Smarter
              <br />
              Achieve Higher
            </h2>
            <p className="mt-2 max-w-[220px] text-[11px] leading-5 text-[#D7F2F1]">
              Your Medical Career Starts Here...
            </p>
          </div>
          <Link
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#087A80] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#E7FFFA]"
            href="/syllabus"
          >
            Explore Resources
            <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
        </aside>
      </section>

      {selectedAction ? (
        <ActivityDialog
          action={selectedAction}
          busy={savingAction}
          onClose={() => setSelectedAction(null)}
          onSubmit={(event) => void submitQuickAction(event)}
          organizations={organizations}
        />
      ) : null}
      {toast ? (
        <div
          className={`fixed bottom-5 right-5 z-[80] flex max-w-[min(92vw,440px)] items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm shadow-xl ${toast.includes('Unable') || toast.includes('try again') || toast.includes('authorized') ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-teal-200 bg-white text-[#1D5A5D]'}`}
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-teal-600" size={17} />
          <span>{toast}</span>
          <button
            aria-label="Dismiss notification"
            className="ml-1 rounded-md p-1 text-slate-400 hover:bg-black/5"
            onClick={() => setToast('')}
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
