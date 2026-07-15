"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

/* ---- 轻量 SVG 图标 ---- */
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "url(#grad)" : "none"}
    stroke={active ? "url(#grad-stroke)" : "#9ca3af"} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <linearGradient id="grad-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const TagIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#f97316" : "#9ca3af"} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#f97316" : "#9ca3af"} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#f97316" : "#9ca3af"} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const tabs: Tab[] = [
  { href: "/",          label: "首页",     icon: (a) => <HomeIcon   active={a} /> },
  { href: "/market",    label: "二手交易", icon: (a) => <TagIcon    active={a} /> },
  { href: "/lost-found",label: "失物招领", icon: (a) => <SearchIcon active={a} /> },
  { href: "/messages",  label: "我的",     icon: (a) => <UserIcon   active={a} /> },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass z-50 border-t border-white/60"
      style={{ boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.04)" }}>
      <div className="flex justify-around items-center h-[60px]">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full no-underline relative"
            >
              {/* 激活指示点 */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-primary rounded-full" />
              )}
              {tab.icon(isActive)}
              <span
                className={`text-[10px] mt-0.5 transition-all duration-200 ${
                  isActive ? "text-orange-500 font-semibold" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
