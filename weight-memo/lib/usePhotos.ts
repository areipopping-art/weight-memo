"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { MealKey } from "./meals";
import { getPhotosForDate, getPhotosVersion, subscribePhotos } from "./photos";

export type PhotoUrls = Partial<Record<MealKey, string>>;

/** F-23 指定した日の写真を、表示用の URL にして返す */
export function usePhotos(date: string): PhotoUrls {
  const version = useSyncExternalStore(subscribePhotos, getPhotosVersion, () => 0);
  const [urls, setUrls] = useState<{ key: string; urls: PhotoUrls }>({ key: "", urls: {} });
  const key = `${date}#${version}`;

  useEffect(() => {
    let cancelled = false;
    const created: string[] = [];
    getPhotosForDate(date)
      .then((blobs) => {
        if (cancelled) return;
        const next: PhotoUrls = {};
        for (const [meal, blob] of Object.entries(blobs) as [MealKey, Blob][]) {
          next[meal] = URL.createObjectURL(blob);
          created.push(next[meal]!);
        }
        setUrls({ key, urls: next });
      })
      .catch(() => console.error("[weight-memo] 写真を読み込めませんでした"));
    return () => {
      cancelled = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [date, key]);

  // 日付が変わった直後は前の日の写真を見せない
  return urls.key === key ? urls.urls : {};
}
