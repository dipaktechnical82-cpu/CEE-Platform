'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  BookOpenText,
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  House,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Shield,
  Stethoscope,
  Sun,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuthenticatedUser } from '@/components/auth/auth-boundary';
import { ApiClientError } from '@/lib/api-client';
import { authApi } from '@/lib/auth-api';

type NavigationItem = {
  label: string;
  icon: typeof House;
  href?: string;
  children?: { label: string; href?: string }[];
};

const navigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: House },
  {
    label: 'User Management',
    icon: Users,
    children: [{ label: 'Admins' }, { label: 'Staff' }, { label: 'User Roles' }],
  },
  {
    label: 'Institutions',
    icon: Building2,
    children: [
      { label: 'All Institutions', href: '/dashboard/organizations' },
      { label: 'Pending Approvals' },
    ],
  },
  {
    label: 'Students & Teachers',
    icon: GraduationCap,
    children: [{ label: 'Students' }, { label: 'Teachers' }],
  },
  {
    label: 'Study Materials',
    icon: BookOpenText,
    children: [{ label: 'Notes' }, { label: 'Videos' }, { label: 'Courses' }],
  },
  { label: 'Question Bank', icon: FileQuestion },
  {
    label: 'Mock Examinations',
    icon: ClipboardCheck,
    children: [{ label: 'All Exams' }, { label: 'Create Exam' }, { label: 'Results' }],
  },
  {
    label: 'Payments',
    icon: Wallet,
    children: [{ label: 'Transactions' }, { label: 'Payment History' }],
  },
  { label: 'Analytics', icon: ChartNoAxesCombined },
  { label: 'Security & Logs', icon: Shield },
  { label: 'Settings', icon: Settings },
];

type DashboardTheme = 'light' | 'dark';
const DashboardPreferencesContext = createContext<{ theme: DashboardTheme }>({ theme: 'light' });

export function useDashboardPreferences() {
  return useContext(DashboardPreferencesContext);
}

function initials(fullName: string, email: string): string {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length > 0) {
    return nameParts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
  return email.slice(0, 1).toUpperCase();
}

function displayRole(role: string): string {
  return role
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const user = useAuthenticatedUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedNavigation, setExpandedNavigation] = useState<string[]>(['Institutions']);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<DashboardTheme>('light');
  const searchInput = useRef<HTMLInputElement>(null);
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const visibleNavigation = isSuperAdmin
    ? navigation
    : navigation.filter((item) => item.label === 'Institutions');
  const fullName = user?.fullName.trim() || user?.email || 'Administrator';
  const avatarText = initials(user?.fullName ?? '', user?.email ?? '');

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('cee-dashboard-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    } catch {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    }
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      window.localStorage.setItem('cee-dashboard-theme', nextTheme);
    } catch {
      setLogoutError('Theme preference could not be saved in this browser.');
    }
  }

  function toggleNavigation(label: string) {
    setExpandedNavigation((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  async function logout() {
    setLogoutError('');
    setLoggingOut(true);
    try {
      await authApi.logout();
      router.replace('/login');
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      setLogoutError(
        error instanceof ApiClientError
          ? error.message
          : 'Unable to sign out right now. Please try again.',
      );
    }
  }

  const searchItems = [
    { label: 'Dashboard Overview', href: '/dashboard', terms: 'dashboard overview home' },
    {
      label: 'Institutions',
      href: '/dashboard/organizations',
      terms: 'institutions organizations college',
    },
    {
      label: 'Recent Activities',
      href: '/dashboard#recent-activities',
      terms: 'activities registrations events',
    },
    { label: 'Study Resources', href: '/syllabus', terms: 'study materials notes resources' },
  ];
  const matchingSearchItems = searchItems.filter(
    (item) => !search || `${item.label} ${item.terms}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardPreferencesContext.Provider value={{ theme }}>
      <div
        className={`dashboard-app min-h-screen bg-[#F3FAF9] text-[#17383F] lg:flex ${theme === 'dark' ? 'dashboard-theme-dark' : ''}`}
      >
        {mobileNavigationOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-[#082A31]/55 lg:hidden"
            onClick={() => setMobileNavigationOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          aria-label="Main navigation"
          className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-[#0D343B] text-white shadow-xl transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
            collapsed ? 'lg:w-[82px]' : 'lg:w-[260px]'
          } ${mobileNavigationOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div
            className={`flex min-h-[82px] items-center gap-3 border-b border-white/10 ${collapsed ? 'lg:justify-center lg:px-3' : 'px-5'}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#75D8CF]/40 bg-[#1C5960] text-[#A9E6DD] shadow-inner">
              <Stethoscope aria-hidden="true" size={25} strokeWidth={1.8} />
            </span>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-sm font-bold tracking-wide">CEE MEDICAL PREP</p>
              <p className="mt-0.5 text-xs text-[#B8D5D6]">
                {isSuperAdmin ? 'Admin Panel' : 'Workspace'}
              </p>
            </div>
            <button
              aria-label="Close navigation"
              className="ml-auto rounded-lg p-2 text-[#C3DADB] hover:bg-white/10 lg:hidden"
              onClick={() => setMobileNavigationOpen(false)}
              type="button"
            >
              <X aria-hidden="true" size={19} />
            </button>
            <button
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="ml-auto hidden rounded-lg p-2 text-[#C3DADB] transition hover:bg-white/10 lg:block"
              onClick={() => setCollapsed((value) => !value)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
            >
              {collapsed ? (
                <PanelLeftOpen aria-hidden="true" size={17} />
              ) : (
                <PanelLeftClose aria-hidden="true" size={17} />
              )}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <ul className="space-y-1">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === pathname || item.children?.some((child) => child.href === pathname);
                const expanded = expandedNavigation.includes(item.label);
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <Link
                        aria-current={active ? 'page' : undefined}
                        className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors ${
                          collapsed ? 'lg:justify-center lg:px-0' : ''
                        } ${
                          active
                            ? 'bg-[#1B5B61] text-white shadow-[inset_3px_0_0_#70DED1]'
                            : 'text-[#D2E4E5] hover:bg-white/8 hover:text-white'
                        }`}
                        href={item.href}
                        onClick={() => setMobileNavigationOpen(false)}
                      >
                        <Icon aria-hidden="true" className="shrink-0" size={18} />
                        <span className={`truncate ${collapsed ? 'lg:hidden' : ''}`}>
                          {item.label}
                        </span>
                      </Link>
                    ) : item.children ? (
                      <div>
                        <button
                          aria-expanded={expanded}
                          aria-label={collapsed ? item.label : undefined}
                          className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] transition ${
                            collapsed ? 'lg:justify-center lg:px-0' : ''
                          } ${active ? 'bg-white/10 text-white' : 'text-[#D2E4E5] hover:bg-white/8 hover:text-white'}`}
                          onClick={() => toggleNavigation(item.label)}
                          title={item.label}
                          type="button"
                        >
                          <Icon aria-hidden="true" className="shrink-0 opacity-90" size={18} />
                          <span
                            className={`min-w-0 flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}
                          >
                            {item.label}
                          </span>
                          <ChevronDown
                            aria-hidden="true"
                            className={`shrink-0 transition ${expanded ? 'rotate-180' : ''} ${collapsed ? 'lg:hidden' : ''}`}
                            size={14}
                          />
                        </button>
                        {expanded ? (
                          <ul
                            className={`mt-1 space-y-0.5 border-l border-white/10 pb-1 pl-3 ${collapsed ? 'lg:hidden' : 'ml-5'}`}
                          >
                            {item.children.map((child) =>
                              child.href ? (
                                <li key={child.label}>
                                  <Link
                                    aria-current={pathname === child.href ? 'page' : undefined}
                                    className={`block rounded-lg px-3 py-2 text-[11px] transition ${pathname === child.href ? 'bg-[#1B5B61] font-semibold text-white' : 'text-[#C4DADC] hover:bg-white/8 hover:text-white'}`}
                                    href={child.href}
                                    onClick={() => setMobileNavigationOpen(false)}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ) : (
                                <li
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[11px] text-[#8EAEB0]"
                                  key={child.label}
                                >
                                  <span>{child.label}</span>
                                  <span className="text-[8px] uppercase tracking-wide">Soon</span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : null}
                      </div>
                    ) : (
                      <div
                        aria-disabled="true"
                        className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-[#A8C2C5] ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                        title={`${item.label} is unavailable until its platform workflow is implemented.`}
                      >
                        <Icon aria-hidden="true" className="shrink-0 opacity-80" size={18} />
                        <span className={`min-w-0 flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}>
                          {item.label}
                        </span>
                        <span
                          className={`ml-auto text-[9px] uppercase tracking-wide text-[#86AAA9] ${collapsed ? 'lg:hidden' : ''}`}
                        >
                          Soon
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={`mx-3 mb-4 rounded-2xl border border-[#75D8CF]/20 bg-gradient-to-br from-[#174D54] to-[#123B43] p-4 ${collapsed ? 'lg:hidden' : ''}`}
          >
            <p className="text-sm font-semibold text-[#F2FFFC]">Better preparation.</p>
            <p className="mt-1 text-sm font-semibold text-[#A9E6DD]">Brighter future.</p>
            <p className="mt-2 text-[11px] text-[#B9D7D8]">CEE Medical Prep</p>
          </div>

          <div className={`border-t border-white/10 p-4 ${collapsed ? 'lg:px-2' : ''}`}>
            {logoutError ? (
              <p className="mb-3 text-xs text-[#FFC8C8]" role="alert">
                {logoutError}
              </p>
            ) : null}
            <div
              className={`flex min-w-0 items-center gap-3 ${collapsed ? 'lg:flex-col lg:gap-2' : ''}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B8DFF4] text-sm font-bold text-[#12424A]">
                {avatarText}
              </span>
              <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
                <p className="truncate text-sm font-semibold">{fullName}</p>
                <p className="truncate text-xs text-[#B8D5D6]">
                  {user ? displayRole(user.role) : 'Administrator'}
                </p>
              </div>
              <button
                aria-label="Sign out"
                className="rounded-lg p-2 text-[#C3DADB] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                disabled={loggingOut}
                onClick={() => void logout()}
                title="Sign out"
                type="button"
              >
                <LogOut aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#DCEBE9] bg-[#F7FBFA]/95 backdrop-blur">
            <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                aria-expanded={mobileNavigationOpen}
                aria-label={mobileNavigationOpen ? 'Close navigation' : 'Open navigation'}
                className="rounded-xl border border-[#D7E8E6] bg-white p-2.5 text-[#244A50] shadow-sm lg:hidden"
                onClick={() => setMobileNavigationOpen((open) => !open)}
                type="button"
              >
                {mobileNavigationOpen ? (
                  <X aria-hidden="true" size={19} />
                ) : (
                  <Menu aria-hidden="true" size={19} />
                )}
              </button>

              <button
                aria-label="Open dashboard search"
                className="rounded-xl border border-[#D7E8E6] bg-white p-2.5 text-[#557177] shadow-sm md:hidden"
                onClick={() => {
                  setSearchOpen(true);
                  window.setTimeout(() => searchInput.current?.focus(), 0);
                }}
                type="button"
              >
                <Search aria-hidden="true" size={18} />
              </button>
              <div
                className={`relative h-10 max-w-[440px] flex-1 items-center gap-3 rounded-full border border-[#D8E9E8] bg-white/85 px-4 text-[#71898D] shadow-sm ${searchOpen ? 'flex' : 'hidden md:flex'}`}
                role="search"
              >
                <Search aria-hidden="true" size={17} />
                <input
                  aria-label="Search dashboard pages"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#244A50] outline-none placeholder:text-[#82989C]"
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchOpen(true);
                  }}
                  onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search anything... (Ctrl + K)"
                  ref={searchInput}
                  value={search}
                />
                {searchOpen ? (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#DCEBE9] bg-white p-2 shadow-xl">
                    <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#89A0A3]">
                      {search ? 'Search results' : 'Quick navigation'}
                    </p>
                    {matchingSearchItems.map((item) => (
                      <button
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-xs font-medium text-[#31575D] transition hover:bg-[#F0F8F7]"
                        key={item.href}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setSearch(item.label);
                          setSearchOpen(false);
                          router.push(item.href);
                        }}
                        type="button"
                      >
                        <Search aria-hidden="true" className="text-[#4A9994]" size={14} />
                        {item.label}
                      </button>
                    ))}
                    {matchingSearchItems.length === 0 ? (
                      <p className="px-2.5 py-3 text-xs text-[#80969A]">
                        No matching dashboard pages.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <button
                    aria-expanded={notificationsOpen}
                    aria-label="Notifications"
                    aria-haspopup="menu"
                    className="relative rounded-full border border-[#D8E9E8] bg-white p-2.5 text-[#557177] shadow-sm transition hover:border-[#9BCBC5] hover:text-[#117F7B]"
                    onClick={() => {
                      setNotificationsOpen((open) => !open);
                      setProfileOpen(false);
                    }}
                    type="button"
                  >
                    <Bell aria-hidden="true" size={17} />
                    {!notificationsRead ? (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#F28168]" />
                    ) : null}
                  </button>
                  {notificationsOpen ? (
                    <div
                      className="absolute right-0 top-full z-50 mt-2 w-[min(90vw,340px)] rounded-2xl border border-[#DCEBE9] bg-white p-3 shadow-xl"
                      role="menu"
                    >
                      <div className="flex items-center justify-between px-1 pb-2">
                        <div>
                          <p className="text-sm font-bold text-[#234B54]">Notifications</p>
                          <p className="mt-0.5 text-[9px] text-[#83989C]">
                            Sample activity notifications
                          </p>
                        </div>
                        <button
                          className="text-[10px] font-semibold text-[#158B86] hover:underline"
                          onClick={() => setNotificationsRead(true)}
                          type="button"
                        >
                          {notificationsRead ? 'All caught up' : 'Mark all read'}
                        </button>
                      </div>
                      {[
                        ['Institution approval pending', 'Everest Medical College · 12 min ago'],
                        ['Weekly report is ready', 'Platform analytics · 1 hour ago'],
                        ['New user invitation accepted', 'Kathmandu Health Academy · 3 hours ago'],
                      ].map(([title, detail], index) => (
                        <div
                          className={`flex gap-2.5 rounded-xl px-2 py-2.5 ${!notificationsRead && index === 0 ? 'bg-[#F1FAF8]' : ''}`}
                          key={title}
                        >
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#1AB39F]" />
                          <div>
                            <p className="text-xs font-semibold text-[#31545C]">{title}</p>
                            <p className="mt-0.5 text-[10px] text-[#83989C]">{detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  className="rounded-full border border-[#D8E9E8] bg-white p-2.5 text-[#557177] shadow-sm transition hover:border-[#9BCBC5] hover:text-[#117F7B]"
                  onClick={toggleTheme}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  type="button"
                >
                  {theme === 'light' ? (
                    <Moon aria-hidden="true" size={17} />
                  ) : (
                    <Sun aria-hidden="true" size={17} />
                  )}
                </button>
                <div className="relative">
                  <button
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-full border border-[#D8E9E8] bg-white py-1.5 pl-3 pr-1.5 text-left shadow-sm transition hover:border-[#9BCBC5]"
                    onClick={() => {
                      setProfileOpen((open) => !open);
                      setNotificationsOpen(false);
                    }}
                    type="button"
                  >
                    <span className="hidden max-w-36 truncate text-xs font-semibold sm:block">
                      {displayRole(user?.role ?? 'ADMIN')}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9F0EA] text-xs font-bold text-[#17545B]">
                      {avatarText}
                    </span>
                  </button>
                  {profileOpen ? (
                    <div
                      className="absolute right-0 top-full z-30 mt-2 w-60 rounded-2xl border border-[#DCEBE9] bg-white p-3 shadow-xl"
                      role="menu"
                    >
                      <p className="truncate px-2 pt-1 text-sm font-semibold">{fullName}</p>
                      <p className="truncate px-2 pb-3 pt-1 text-xs text-[#6A8589]">
                        {user?.email}
                      </p>
                      <div className="mx-2 mb-2 flex items-center gap-2 rounded-xl bg-[#F2F8F7] px-2.5 py-2 text-[10px] text-[#57777C]">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Administrator account
                      </div>
                      <button
                        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-[#31575D] hover:bg-[#F1F8F7] disabled:opacity-60"
                        disabled={loggingOut}
                        onClick={() => void logout()}
                        role="menuitem"
                        type="button"
                      >
                        <LogOut aria-hidden="true" size={16} />
                        Sign out
                      </button>
                      {logoutError ? (
                        <p className="px-2 pt-2 text-xs text-red-700" role="alert">
                          {logoutError}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardPreferencesContext.Provider>
  );
}
