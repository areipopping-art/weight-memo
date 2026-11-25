"use client";

import { useEffect, useMemo, useState } from "react";
import { MEAL_EMOJI, MEAL_KEYS, MEAL_LABELS, type MealKey } from "@/lib/meals";
import { resizeImage, type PhotoChanges } from "@/lib/photos";
import { usePhotos } from "@/lib/usePhotos";

/**
 * F-23 朝・昼・夜・間食の写真を1枚ずつ選ぶ欄。
 * 選んだ写真は changes に入れておき、保存ボタンを押したときに反映する。
 */
export default function PhotoFields({
  idPrefix,
  date,
  changes,
  onChange,
}: {
  idPrefix: string;
  date: string;
  changes: PhotoChanges;
  onChange: (changes: PhotoChanges) => void;
}) {
  const saved = usePhotos(date);
  const [busy, setBusy] = useState<MealKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  // まだ保存していない写真のプレビュー用 URL
  const pendingUrls = useMemo(() => {
    const urls: Partial<Record<MealKey, string>> = {};
    for (const key of MEAL_KEYS) {
      const blob = changes[key];
      if (blob) urls[key] = URL.createObjectURL(blob);
    }
    return urls;
  }, [changes]);
  useEffect(() => () => Object.values(pendingUrls).forEach((u) => URL.revokeObjectURL(u!)), [pendingUrls]);

  async function handleFile(key: MealKey, file: File | undefined) {
    if (!file) return;
    setBusy(key);
    setError(null);
    try {
      onChange({ ...changes, [key]: await resizeImage(file) });
    } catch {
      setError("この画像は読み込めませんでした。別の写真を選んでください。");
    } finally {
      setBusy(null);
    }
  }

  return (
    <fieldset className="space-y-1">
      <legend className="mb-1 text-sm font-medium">
        食事の写真 <span className="font-normal text-muted">（任意）</span>
      </legend>
      <div className="grid grid-cols-4 gap-2">
        {MEAL_KEYS.map((key) => {
          // changes に null があれば「削除予定」、Blob があれば「差し替え予定」
          const url = changes[key] === null ? undefined : (pendingUrls[key] ?? saved[key]);
          const inputId = `${idPrefix}-${key}`;
          return (
            <div key={key} className="space-y-1 text-center">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-sakura-200 bg-sakura-50/50 dark:border-[var(--input-border)] dark:bg-transparent">
                {url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- 端末内の画像（blob: URL）なので next/image は使わない */}
                    <img src={url} alt={`${MEAL_LABELS[key]}の写真`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onChange({ ...changes, [key]: null })}
                      aria-label={`${MEAL_LABELS[key]}の写真を外す`}
                      className="absolute top-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor={inputId}
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-sakura-400 hover:bg-sakura-100/60 dark:hover:bg-[var(--hover)]"
                  >
                    <span className="text-xl" aria-hidden>
                      {busy === key ? "⏳" : "📷"}
                    </span>
                    <span className="sr-only">{MEAL_LABELS[key]}の写真を選ぶ</span>
                  </label>
                )}
                <input
                  id={inputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    void handleFile(key, e.target.files?.[0]);
                    e.target.value = ""; // 同じ写真を選び直せるように
                  }}
                />
              </div>
              <span className="text-xs font-bold">
                <span aria-hidden>{MEAL_EMOJI[key]} </span>
                {MEAL_LABELS[key]}
              </span>
            </div>
          );
        })}
      </div>
      {error && <p className="text-sm font-bold text-sakura-700 dark:text-sakura-300">{error}</p>}
    </fieldset>
  );
}
