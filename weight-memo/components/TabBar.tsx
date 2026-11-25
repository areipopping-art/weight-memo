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

/** 現在のページに合わせてタブを強調する */
export default function TabBar() {
  const { data } = useWeightMemo();
  return <TabBarNav pathname={usePathname()} persona={data?.persona} />;
}

/** pathname が null のときはどのタブも強調しない（読み込み中の表示用） */
export function TabBarNav({ pathname, persona }: { pathname: string | null; persona?: Persona }) {
  const visible = tabs.filter((t) => !t.detailOnly || showsDetail(persona));
  return (
    <nav aria-label="メインメニュー" className="fixed inset-x-0 bottom-0 px-3 pb-3">
      {/* ふわっと浮いた丸いバー */}
      <ul className={`mx-auto grid max-w-md ${visible.length === 4 ? "grid-cols-4" : "grid-cols-3"} rounded-full border border-[var(--card-border)] bg-[var(--card)]/95 p-1.5 shadow-[var(--card-shadow)] backdrop-blur`}>
        {visible.map((tab) => {
          const active =
            pathname !== null && (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href));
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-full py-1.5 text-xs transition-colors ${
                  active
                    ? "bg-sakura-100 font-extrabold text-sakura-700 dark:bg-[#4a3542] dark:text-sakura-200"
                    : "text-muted hover:bg-sakura-50 dark:hover:bg-[#3a2f40]"
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
