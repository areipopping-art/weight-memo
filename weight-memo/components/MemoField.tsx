"use client";

import { useState } from "react";
import { frequentMemos } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";

const SUGGESTION_LIMIT = 5;

/** A モードの食事のひとことメモ（F-04）。入力中はよく書くメモを候補に出す（F-22） */
export default function MemoField({
  id,
  value,
  onChange,
  records,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  records: WeightRecord[];
}) {
  const [focused, setFocused] = useState(false);
  const suggestions = focused
    ? frequentMemos(records, SUGGESTION_LIMIT + 1)
        .filter((t) => t !== value.trim())
        .slice(0, SUGGESTION_LIMIT)
    : [];

  return (
    <div
      className="space-y-1"
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <label htmlFor={id} className="block text-sm font-medium">
        🍽️ 食事メモ <span className="font-normal text-muted">（ひとことでOK・任意）</span>
      </label>
      <textarea
        id={id}
        rows={2}
        maxLength={200}
        placeholder="例：朝 パン、昼 そば、夜 鍋"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-soft w-full"
      />
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="よく書くメモ">
          {suggestions.map((text) => (
            <button
              key={text}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange(text)}
              className="animate-pop-in rounded-full border border-sakura-200 bg-sakura-50 px-3 py-1 text-xs font-bold text-sakura-800 hover:bg-sakura-100 dark:border-sakura-800 dark:bg-[#3a2733] dark:text-sakura-200"
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
