import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import Mascot from "@/components/Mascot";
import Onboarding from "@/components/Onboarding";
import ThemeSync from "@/components/ThemeSync";
import PersonaToggle from "@/components/PersonaToggle";
import TabBar, { TabBarNav } from "@/components/TabBar";
import "./globals.css";

// 丸ゴシック（日本語は文字数が多いため、先読みはせず表示しながら読み込む）
const rounded = M_PLUS_Rounded_1c({
  weight: ["400", "700", "800"],
  preload: false,
  display: "swap",
  variable: "--font-m-plus-rounded",
});

/** 保存データの性別が男性なら <html data-theme="male"> にする（データは端末の外に出ない） */
const THEME_SCRIPT = `try{var d=JSON.parse(localStorage.getItem("weight-memo")||"{}");document.documentElement.dataset.theme=d.sex==="male"?"male":"female"}catch(e){}`;

export const metadata: Metadata = {
  title: "体重・食事メモ",
  description: "毎日10秒で体重と食事を記録できるメモアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${rounded.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* 読み込み直後にピンクが一瞬見えないよう、描画前にテーマを決める */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--card-border)] bg-[var(--card)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold text-sakura-700 dark:text-sakura-300">
              <Mascot mood="happy" size={34} />
              体重・食事メモ
            </Link>
            <div className="flex items-center gap-2">
              <PersonaToggle />
              <Link
                href="/settings"
                aria-label="設定"
                className="btn-soft flex h-9 w-9 items-center justify-center text-lg"
              >
                <span aria-hidden>⚙️</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-28">
          {children}
          <p className="mt-10 text-center text-xs text-muted">
            記録はこの端末のブラウザにだけ保存されます。共有のパソコンでは他の人にも見えるのでご注意ください。
          </p>
        </main>

        {/* usePathname は動的なページ（/history/[date]）では実行時にしか決まらないため Suspense で囲む */}
        <Suspense fallback={<TabBarNav pathname={null} />}>
          <TabBar />
        </Suspense>

        {/* 性別が未設定なら、使う前に選んでもらう */}
        <Onboarding />
        <ThemeSync />
      </body>
    </html>
  );
}
