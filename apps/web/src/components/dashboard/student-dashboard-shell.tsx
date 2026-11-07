'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Award,
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Moon,
  NotebookPen,
  Sparkles,
  Stethoscope,
  Sun,
  SunMedium,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthenticatedUser } from '@/components/auth/auth-boundary';
import { authApi } from '@/lib/auth-api';
import { StudentThemeProvider, useStudentTheme } from './theme-context';

type StudentNavigationItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const navigation: StudentNavigationItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Study Plan', icon: CalendarDays },
  { label: 'Courses', href: '/syllabus', icon: BookOpen },
  { label: 'Practice', icon: Activity },
  { label: 'Mock Tests', href: '/student/mock-tests', icon: ClipboardCheck },
  { label: 'Performance', icon: ChartNoAxesCombined },
  { label: 'Notes', icon: NotebookPen },
  { label: 'Bookmarks', icon: Bookmark },
  { label: 'Doubt Room', icon: MessageCircleQuestion },
  { label: 'Leaderboard', icon: Award },
  { label: 'Rewards', icon: Sparkles },
];

function initials(fullName: string, email: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.length
    ? parts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : email.slice(0, 1).toUpperCase();
}

function SidebarNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { theme } = useStudentTheme();
  return (
    <nav aria-label="Student navigation">
      <ul className="space-y-1">
        {navigation.map(({ href, icon: Icon, label }) => {
          const active = href === pathname;
          const classes = `group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium transition-all duration-200 ${
            active
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-[#7367F0]/25 to-[#B8DFF4]/10 text-[#B8DFF4] border-l-2 border-[#7367F0] ring-1 ring-[#7367F0]/25 shadow-[0_0_12px_rgba(115,103,240,0.15)] font-semibold'
                : 'bg-[#D5F3E8] text-[#244A50] border-l-2 border-[#244A50] ring-1 ring-[#A9E6DD]/40 shadow-xs font-semibold'
              : href
                ? theme === 'dark'
                  ? 'text-[#A9B8D0] hover:bg-white/[0.06] hover:text-white'
                  : 'text-[#3D6870] hover:bg-[#D5F3E8]/50 hover:text-[#244A50]'
                : theme === 'dark'
                  ? 'cursor-not-allowed text-[#7E8DAA]/60'
                  : 'cursor-not-allowed text-[#5B7E86]/50'
          }`;

          return (
            <li key={label}>
              {href ? (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={classes}
                  href={href}
                  onClick={onNavigate}
                >
                  <Icon
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active
                        ? theme === 'dark'
                          ? 'text-[#A9E6DD]'
                          : 'text-[#244A50]'
                        : theme === 'dark'
                          ? 'text-[#7E8DAA]'
                          : 'text-[#5B7E86]'
                    }`}
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  <span>{label}</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className={classes}
                  title={`${label} will be available in a later phase`}
                >
                  <Icon
                    aria-hidden="true"
                    className="shrink-0 opacity-40"
                    size={18}
                    strokeWidth={1.8}
                  />
                  <span className="flex-1 opacity-60">{label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Soon
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Medical stethoscope-inspired CEE brand logo mark */
function Brand() {
  const { theme } = useStudentTheme();
  return (
    <Link
      aria-label="CEE Medical Prep student dashboard"
      className="flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD]"
      href="/student/dashboard"
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7367F0] via-[#5B52D6] to-[#A9E6DD] p-0.5 shadow-[0_0_15px_rgba(115,103,240,0.35)]">
        <span
          className={`flex h-full w-full items-center justify-center rounded-[14px] ${
            theme === 'dark' ? 'bg-[#0A1128]' : 'bg-white'
          }`}
        >
          <Stethoscope
            aria-hidden="true"
            className={theme === 'dark' ? 'text-[#B8DFF4]' : 'text-[#244A50]'}
            size={22}
            strokeWidth={2.2}
          />
        </span>
      </span>
      <span className="min-w-0">
        <span
          className={`block text-sm font-extrabold tracking-wider ${
            theme === 'dark' ? 'text-white' : 'text-[#244A50]'
          }`}
        >
          CEE MEDICAL PREP
        </span>
        <span
          className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] ${
            theme === 'dark' ? 'text-[#A9E6DD]/90' : 'text-[#3D6870]'
          }`}
        >
          Dream • Prepare • Excel
        </span>
      </span>
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { theme } = useStudentTheme();
  return (
    <div
      className={`flex h-full flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#0A1128] text-[#F5FBFA]' : 'bg-white text-[#244A50] shadow-sm'
      }`}
    >
      <div
        className={`px-5 py-5 border-b ${
          theme === 'dark' ? 'border-white/[0.08]' : 'border-[#D5F3E8]'
        }`}
      >
        <Brand />
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-5">
        <p
          className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] ${
            theme === 'dark' ? 'text-[#7E8DAA]' : 'text-[#5B7E86]'
          }`}
        >
          Learning Mission Control
        </p>
        <SidebarNavigation onNavigate={onNavigate} pathname={pathname} />

        <div
          className={`mt-6 border-t pt-4 ${
            theme === 'dark' ? 'border-white/[0.08]' : 'border-[#D5F3E8]'
          }`}
        >
          <span
            aria-disabled="true"
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium ${
              theme === 'dark' ? 'text-[#7E8DAA]/60' : 'text-[#5B7E86]/60'
            }`}
            title="Help center will be connected in future releases"
          >
            <CircleHelp aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>Help &amp; Support</span>
            <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Soon
            </span>
          </span>
        </div>
      </div>

      {/* Sidebar lower promotional artwork card */}
      <div className="p-3.5 pt-0">
        <div
          className={`relative isolate min-h-36 overflow-hidden rounded-2xl border ${
            theme === 'dark' ? 'border-[#B8DFF4]/20 bg-[#101A3C]' : 'border-[#D5F3E8] bg-[#EAF8F4]'
          }`}
        >
          <Image
            alt=""
            className="object-cover object-center opacity-75"
            fill
            sizes="240px"
            src="/images/student-dashboard/top.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-[#0A1128]/50 to-transparent" />
          <div className="absolute inset-x-3.5 bottom-3.5">
            <p className="text-xs font-bold text-white">Your future in medicine starts here.</p>
            <p className="mt-0.5 text-[10px] leading-4 text-[#A9E6DD]/90">
              One focused session at a time.
            </p>
          </div>
        </div>
        <p
          className={`px-2 pb-1 pt-3 text-[10px] ${
            theme === 'dark' ? 'text-slate-500' : 'text-[#5B7E86]'
          }`}
        >
          CEE Medical Prep · Nepal
        </p>
      </div>
    </div>
  );
}

function greetingForHour(hour: number): { greeting: string; icon: typeof Sun } {
  if (hour < 12) return { greeting: 'Good morning', icon: Sun };
  if (hour < 17) return { greeting: 'Good afternoon', icon: SunMedium };
  return { greeting: 'Good evening', icon: Moon };
}

function StudentDashboardShellInner({ children }: { children: ReactNode }) {
  const user = useAuthenticatedUser();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useStudentTheme();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [greetingText, setGreetingText] = useState('Welcome');
  const [GreetingIcon, setGreetingIcon] = useState<typeof Sun>(SunMedium);
  const [localTime, setLocalTime] = useState('');
  const navigationTrigger = useRef<HTMLButtonElement>(null);
  const profileTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const now = new Date();
    const g = greetingForHour(now.getHours());
    setGreetingText(g.greeting);
    setGreetingIcon(() => g.icon);
    setLocalTime(
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(now),
    );
  }, []);

  useEffect(() => {
    if (!navigationOpen && !profileOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (navigationOpen) {
        setNavigationOpen(false);
        navigationTrigger.current?.focus();
      }
      if (profileOpen) {
        setProfileOpen(false);
        profileTrigger.current?.focus();
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigationOpen, profileOpen]);

  useEffect(() => {
    if (!navigationOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [navigationOpen]);

  if (user?.role !== 'STUDENT') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050817] px-5 text-[#F7F8FF]">
        <section
          aria-labelledby="student-access-title"
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101735] p-7 text-center shadow-2xl"
        >
          <Stethoscope aria-hidden="true" className="mx-auto text-cyan-400" size={36} />
          <h1 className="mt-4 text-xl font-bold text-white" id="student-access-title">
            Student Account Required
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#A9B3D0]">
            This medical learning mission control is available to verified student accounts.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg transition hover:from-purple-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            href="/dashboard"
          >
            Go to your workspace
          </Link>
        </section>
      </main>
    );
  }

  const fullName = user.fullName.trim() || user.email;
  const firstName = fullName.split(/\s+/)[0] || 'Doctor';
  const avatar = initials(user.fullName, user.email);

  async function logout() {
    setLogoutError('');
    setLoggingOut(true);
    try {
      await authApi.logout();
      router.replace('/login');
      router.refresh();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Sign out failed. Please try again.');
      setLoggingOut(false);
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-[#0A1128] text-[#F5FBFA]' : 'light bg-[#F5FBFA] text-[#244A50]'
      }`}
    >
      {/* Mobile Drawer Backdrop */}
      {navigationOpen ? (
        <button
          aria-label="Close student navigation"
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setNavigationOpen(false);
            navigationTrigger.current?.focus();
          }}
          type="button"
        />
      ) : null}

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden w-64 border-r transition-colors duration-200 lg:block ${
          theme === 'dark'
            ? 'border-white/[0.08] bg-[#0A1128]'
            : 'border-[#D5F3E8] bg-white shadow-sm'
        }`}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(19rem,88vw)] border-r shadow-2xl lg:hidden ${
          theme === 'dark' ? 'border-white/10 bg-[#0A1128]' : 'border-[#D5F3E8] bg-white'
        }`}
        hidden={!navigationOpen}
        id="student-dashboard-navigation"
      >
        <SidebarContent
          onNavigate={() => {
            setNavigationOpen(false);
            navigationTrigger.current?.focus();
          }}
          pathname={pathname}
        />
      </aside>

      {/* Main Content Area */}
      <div className="min-h-screen lg:ml-64">
        {/* ------------------------------------------------------------------ */}
        {/* Top Navigation & Greeting Header                                     */}
        {/* ------------------------------------------------------------------ */}
        <header
          className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-200 ${
            theme === 'dark'
              ? 'border-white/[0.08] bg-[#0A1128]/90'
              : 'border-[#D5F3E8] bg-white/90 shadow-xs'
          }`}
        >
          <div className="mx-auto flex min-h-[86px] max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            {/* Mobile menu trigger */}
            <button
              aria-controls="student-dashboard-navigation"
              aria-expanded={navigationOpen}
              aria-label={navigationOpen ? 'Close student navigation' : 'Open student navigation'}
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
                  : 'border-[#D5F3E8] bg-[#F5FBFA] text-[#244A50] hover:bg-[#D5F3E8]/60'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD] lg:hidden`}
              onClick={() => setNavigationOpen((open) => !open)}
              ref={navigationTrigger}
              type="button"
            >
              {navigationOpen ? (
                <X aria-hidden="true" size={20} />
              ) : (
                <Menu aria-hidden="true" size={20} />
              )}
            </button>

            {/* Left: Prominent Greeting area */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <GreetingIcon
                  aria-hidden="true"
                  className={
                    theme === 'dark' ? 'text-[#B8DFF4] shrink-0' : 'text-[#244A50] shrink-0'
                  }
                  size={18}
                />
                <p
                  className={`truncate text-base font-extrabold sm:text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-[#244A50]'
                  }`}
                >
                  {greetingText}, {firstName}!
                </p>
              </div>
              <p
                className={`mt-0.5 text-xs ${
                  theme === 'dark' ? 'text-[#A9B8D0]' : 'text-[#3D6870]'
                }`}
              >
                Let&apos;s make today count. Stay focused on your medical goal.
              </p>
            </div>

            {/* Right: Study Streak Pill */}
            <div
              className={`hidden items-center gap-2.5 rounded-2xl border px-3.5 py-2 backdrop-blur-md md:flex ${
                theme === 'dark'
                  ? 'border-[#7367F0]/35 bg-[#7367F0]/15 shadow-[0_0_12px_rgba(115,103,240,0.18)]'
                  : 'border-[#A9E6DD] bg-[#D5F3E8] shadow-xs'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7367F0] to-[#5B52D6] text-white shadow-md">
                <Flame aria-hidden="true" fill="currentColor" size={18} />
              </span>
              <div>
                <p
                  className={`text-xs font-bold leading-tight ${
                    theme === 'dark' ? 'text-[#D5F3E8]' : 'text-[#244A50]'
                  }`}
                >
                  7 Day Streak
                </p>
                <p
                  className={`text-[10px] ${
                    theme === 'dark' ? 'text-[#A9E6DD]/80' : 'text-[#3D6870]'
                  }`}
                >
                  Keep it going! ·{' '}
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">
                    Preview
                  </span>
                </p>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                theme === 'dark'
                  ? 'border-white/[0.08] bg-white/[0.035] text-[#A9E6DD] hover:border-[#A9E6DD]/40 hover:bg-white/[0.06]'
                  : 'border-[#D5F3E8] bg-[#F5FBFA] text-[#244A50] hover:border-[#A9E6DD] hover:bg-white'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD]`}
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              type="button"
            >
              {theme === 'dark' ? (
                <Sun aria-hidden="true" size={18} />
              ) : (
                <Moon aria-hidden="true" size={18} />
              )}
            </button>

            {/* Notifications Button */}
            <div className="relative">
              <button
                aria-label="Notifications"
                className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                  theme === 'dark'
                    ? 'border-white/[0.08] bg-white/[0.035] text-[#A9B8D0] hover:border-[#B8DFF4]/30 hover:bg-white/[0.06] hover:text-white'
                    : 'border-[#D5F3E8] bg-[#F5FBFA] text-[#244A50] hover:border-[#A9E6DD] hover:bg-white hover:text-[#244A50]'
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD]`}
                type="button"
              >
                <Bell aria-hidden="true" size={18} />
                {/* Unread indicator dot */}
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#A9E6DD] shadow-[0_0_8px_#A9E6DD]" />
              </button>
            </div>

            {/* Date label */}
            <p
              className={`hidden text-xs font-medium xl:block ${
                theme === 'dark' ? 'text-[#7E8DAA]' : 'text-[#5B7E86]'
              }`}
            >
              {localTime}
            </p>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                aria-controls="student-profile-menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label={`Open profile menu for ${fullName}`}
                className={`flex min-h-11 items-center gap-2.5 rounded-xl border py-1.5 pl-2 pr-2.5 text-left transition ${
                  theme === 'dark'
                    ? 'border-white/[0.08] bg-white/[0.035] hover:border-[#B8DFF4]/30 hover:bg-white/[0.06]'
                    : 'border-[#D5F3E8] bg-[#F5FBFA] hover:border-[#A9E6DD] hover:bg-white'
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD] sm:gap-3`}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNavigationOpen(false);
                }}
                ref={profileTrigger}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7367F0] via-[#5B52D6] to-[#A9E6DD] text-xs font-bold text-white shadow-[0_0_12px_rgba(115,103,240,0.35)]"
                >
                  {avatar}
                </span>
                <span className="hidden max-w-36 sm:block">
                  <span
                    className={`block truncate text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-[#244A50]'
                    }`}
                  >
                    {fullName}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] font-semibold ${
                      theme === 'dark' ? 'text-[#A9E6DD]/90' : 'text-[#3D6870]'
                    }`}
                  >
                    CEE Aspirant
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`hidden sm:block ${
                    theme === 'dark' ? 'text-slate-400' : 'text-[#5B7E86]'
                  }`}
                  size={14}
                />
              </button>

              {profileOpen ? (
                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border p-3 backdrop-blur-xl ${
                    theme === 'dark'
                      ? 'border-white/10 bg-[#101A3C] shadow-2xl shadow-black/60 text-white'
                      : 'border-[#D5F3E8] bg-white shadow-xl text-[#244A50]'
                  }`}
                  id="student-profile-menu"
                  role="menu"
                >
                  <p
                    className={`truncate px-2 pt-1 text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-[#244A50]'
                    }`}
                  >
                    {fullName}
                  </p>
                  <p
                    className={`truncate px-2 pb-3 pt-0.5 text-xs ${
                      theme === 'dark' ? 'text-[#A9B8D0]' : 'text-[#5B7E86]'
                    }`}
                  >
                    {user.email}
                  </p>
                  <div
                    className={`border-t pt-2 ${
                      theme === 'dark' ? 'border-white/[0.08]' : 'border-[#D5F3E8]'
                    }`}
                  >
                    <button
                      className={`flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A9E6DD] disabled:opacity-60 ${
                        theme === 'dark'
                          ? 'text-[#F5FBFA] hover:bg-white/[0.06] hover:text-white'
                          : 'text-[#244A50] hover:bg-[#D5F3E8]/50 hover:text-[#244A50]'
                      }`}
                      disabled={loggingOut}
                      onClick={() => void logout()}
                      role="menuitem"
                      type="button"
                    >
                      <LogOut aria-hidden="true" size={16} />
                      {loggingOut ? 'Signing out…' : 'Sign out'}
                    </button>
                    {logoutError ? (
                      <p className="px-2 pt-2 text-xs text-rose-500" role="alert">
                        {logoutError}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Mobile Streak banner */}
          <div
            className={`flex items-center gap-2 border-t px-4 py-2 md:hidden ${
              theme === 'dark'
                ? 'border-white/[0.05] bg-[#7367F0]/15'
                : 'border-[#D5F3E8] bg-[#D5F3E8]/70'
            }`}
          >
            <Flame
              aria-hidden="true"
              className={theme === 'dark' ? 'text-[#A9E6DD]' : 'text-[#244A50]'}
              fill="currentColor"
              size={15}
            />
            <span
              className={`text-xs font-bold ${
                theme === 'dark' ? 'text-[#D5F3E8]' : 'text-[#244A50]'
              }`}
            >
              7 Day Streak
            </span>
            <span className={`text-xs ${theme === 'dark' ? 'text-[#A9B8D0]' : 'text-[#3D6870]'}`}>
              · Keep it going! (Preview)
            </span>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* Main Dashboard Canvas                                               */}
        {/* ------------------------------------------------------------------ */}
        <main
          aria-label="Student dashboard"
          className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          id="main-content"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function StudentDashboardShell({ children }: { children: ReactNode }) {
  return (
    <StudentThemeProvider>
      <StudentDashboardShellInner>{children}</StudentDashboardShellInner>
    </StudentThemeProvider>
  );
}
