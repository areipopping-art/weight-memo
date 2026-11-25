"use client";

import { SEX_LABELS, type Sex } from "@/lib/calorie";

/** 設定ページの性別（見た目のテーマとカロリー計算に使う） */
export default function SexSection({ value, onChange }: { value: Sex | null; onChange: (s: Sex) => void }) {
  return (
    <fieldset className="card space-y-2">
      <legend className="sr-only">性別</legend>
      <h2 className="font-extrabold">👤 性別</h2>
      <p className="text-xs text-muted">アプリの見た目と、1日の目安カロリーの計算に使います。</p>
      <div className="flex gap-2">
        {(Object.keys(SEX_LABELS) as Sex[]).map((key) => {
          const active = value === key;
          return (
            <label
              key={key}
              className={`flex-1 cursor-pointer rounded-full border-2 px-3 py-2 text-center text-sm transition-colors ${
                active
                  ? "border-sakura-400 bg-sakura-50 font-bold text-sakura-800 dark:bg-[var(--tint-sakura)] dark:text-sakura-200"
                  : "border-[var(--input-border)]"
              }`}
            >
              <input
                type="radio"
                name="sex"
                value={key}
                checked={active}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              {SEX_LABELS[key]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
