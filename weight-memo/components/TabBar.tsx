"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/history", label: "記録一覧", icon: "📋" },
  { href: "/stats", label: "グラフ", icon: "📈" },
  { href: "/goal", label: "目標", icon: "🎯" },
];

/** 現在のページに合わせてタブを強調する */
export default function TabBar() {
  return <TabBarNav pathname={usePathname()} />;
}

/** pathname が null のときはどのタブも強調しない（読み込み中の表示用） */
export function TabBarNav({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-neutral-900/95"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((tab) => {
          const active =
            pathname !== null && (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href));
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs ${
                  active ? "font-bold text-emerald-700 dark:text-emerald-400" : "text-neutral-500"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {tab.icon}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
