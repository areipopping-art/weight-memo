"use client";

import Mascot from "@/components/Mascot";
import type { Sex } from "@/lib/calorie";
import { useWeightMemo } from "@/lib/useWeightMemo";

/** 使用前の性別選択（未設定のときだけ全画面で出す）。見た目のテーマとカロリー計算に使う */
export default function Onboarding() {
  const { data, setSex } = useWeightMemo();
  if (data === null || data.sex !== null) return null;

  const choices: { key: Sex; label: string; sub: string }[] = [
    { key: "female", label: "女性", sub: "ピンクのやさしいデザイン" },
    { key: "male", label: "男性", sub: "ブルーのクールなデザイン" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[var(--background)] p-4"
    >
      <div className="w-full max-w-md animate-pop-in text-center">
        <h1 id="onboarding-title" className="text-2xl font-extrabold">
          ようこそ！
        </h1>
        <p className="mt-2 text-sm text-muted">
          はじめに、あなたの性別を教えてください。
          <br />
          アプリの見た目と、1日の目安カロリーの計算に使います。
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {choices.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSex(c.key)}
              className={`card flex flex-col items-center gap-1 py-5 transition-transform hover:-translate-y-1 ${
                c.key === "female"
                  ? "hover:border-[#ff7aa3]"
                  : "hover:border-[#3b82f6]"
              }`}
            >
              {c.key === "female" ? (
                <Mascot mood="happy" size={96} />
              ) : (
                <span className="flex h-24 items-center text-6xl" aria-hidden>
                  🧑
                </span>
              )}
              <span className="text-lg font-extrabold">{c.label}</span>
              <span className="text-xs text-muted">{c.sub}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">あとから設定ページで変えられます。</p>
      </div>
    </div>
  );
}
