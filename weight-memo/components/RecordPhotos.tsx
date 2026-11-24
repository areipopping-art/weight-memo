"use client";

import { MEAL_KEYS, MEAL_LABELS } from "@/lib/meals";
import { usePhotos } from "@/lib/usePhotos";

/** F-23 記録一覧で、その日の食事の写真を小さく並べる */
export default function RecordPhotos({ date }: { date: string }) {
  const photos = usePhotos(date);
  const keys = MEAL_KEYS.filter((k) => photos[k]);
  if (keys.length === 0) return null;

  return (
    <div className="mt-2 flex gap-1.5">
      {keys.map((k) => (
        <figure key={k} className="w-14">
          {/* eslint-disable-next-line @next/next/no-img-element -- 端末内の画像（blob: URL）なので next/image は使わない */}
          <img src={photos[k]} alt={`${MEAL_LABELS[k]}の写真`} className="aspect-square w-14 rounded object-cover" />
          <figcaption className="text-center text-[10px] text-neutral-500">{MEAL_LABELS[k]}</figcaption>
        </figure>
      ))}
    </div>
  );
}
