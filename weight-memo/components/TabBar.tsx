"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { showsDetail, type Persona } from "@/lib/persona";
import { useWeightMemo } from "@/lib/useWeightMemo";

const tabs = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/history", label: "記録一覧", icon: "📋" },
  { href: "/stats", label: "グラフ", icon: "📈", detailOnly: true }, // B しっかりモードだけ
  { href: "/goal", label: "目標", icon: "🎯" },
];

/** A モードで出すタブ（グラフは B だけ） */
function visibleTabs(persona?: Persona) {
  return tabs.filter((t) => !t.detailOnly || showsDetail(persona));
}

/** pathname が null のときはどのタブも強調しない（読み込み中の表示用） */
function isActive(href: string, pathname: string | null): boolean {
  return pathname !== null && (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

/** 現在のページに合わせてタブを強調する（スマホ・タブレットの下のバー） */
export default function TabBar() {
  const { data } = useWeightMemo();
  return <TabBarNav pathname={usePathname()} persona={data?.persona} />;
}

export function TabBarNav({ pathname, persona }: { pathname: string | null; persona?: Persona }) {
  const visible = visibleTabs(persona);
  return (
    <nav aria-label="メインメニュー" className="fixed inset-x-0 bottom-0 px-3 pb-3 lg:hidden">
      {/* ふわっと浮いた丸いバー */}
      <ul className={`mx-auto grid max-w-md ${visible.length === 4 ? "grid-cols-4" : "grid-cols-3"} rounded-full border border-[var(--card-border)] bg-[var(--card)]/95 p-1.5 shadow-[var(--card-shadow)] backdrop-blur`}>
        {visible.map((tab) => {
          const active = isActive(tab.href, pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-full py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-sakura-100 font-extrabold text-sakura-700 dark:bg-[var(--tint-sakura-strong)] dark:text-sakura-200"
                    : "text-muted hover:bg-sakura-50 dark:hover:bg-[var(--hover)]"
                }`}
              >
                <span className={`text-xl transition-transform ${active ? "scale-125 animate-bounce-soft" : ""}`} aria-hidden>
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

/** PC ではヘッダーに横並びのメニューを出す */
export function HeaderNav() {
  const { data } = useWeightMemo();
  return <HeaderNavLinks pathname={usePathname()} persona={data?.persona} />;
}

export function HeaderNavLinks({ pathname, persona }: { pathname: string | null; persona?: Persona }) {
  return (
    <nav aria-label="メインメニュー" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {visibleTabs(persona).map((tab) => {
          const active = isActive(tab.href, pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sakura-100 font-extrabold text-sakura-700 dark:bg-[var(--tint-sakura-strong)] dark:text-sakura-200"
                    : "font-bold text-muted hover:bg-sakura-50 dark:hover:bg-[var(--hover)]"
                }`}
              >
                <span aria-hidden>{tab.icon}</span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
