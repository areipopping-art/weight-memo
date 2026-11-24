import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import TabBar, { TabBarNav } from "@/components/TabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "体重・食事メモ",
  description: "毎日10秒で体重と食事を記録できるメモアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold">
              体重・食事メモ
            </Link>
            <Link
              href="/settings"
              aria-label="設定"
              className="rounded-md px-2 py-1 text-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span aria-hidden>⚙</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-md flex-1 px-4 pt-4 pb-28">
          {children}
          <p className="mt-10 text-center text-xs text-neutral-500">
            記録はこの端末のブラウザにだけ保存されます。共有のパソコンでは他の人にも見えるのでご注意ください。
          </p>
        </main>

        {/* usePathname は動的なページ（/history/[date]）では実行時にしか決まらないため Suspense で囲む */}
        <Suspense fallback={<TabBarNav pathname={null} />}>
          <TabBar />
        </Suspense>
      </body>
    </html>
  );
}
