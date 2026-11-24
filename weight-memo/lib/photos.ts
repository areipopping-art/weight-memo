// F-23 食事の写真
// 写真は容量が大きく localStorage（約5MB）に入りきらないため、IndexedDB に保存する。
// キーは "2026-11-24:breakfast" のように「日付:区分」。

import type { MealKey } from "./meals";

const DB_NAME = "weight-memo-photos";
const STORE = "photos";
/** 保存する画像の長辺（px） */
const MAX_SIZE = 800;
const JPEG_QUALITY = 0.8;

export type PhotoChanges = Partial<Record<MealKey, Blob | null>>; // Blob = 追加・差し替え、null = 削除

const photoKey = (date: string, meal: MealKey) => `${date}:${meal}`;
const dateRange = (date: string) => IDBKeyRange.bound(`${date}:`, `${date}:￿`);

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

/** 1つのトランザクションで処理して、完了を待つ */
async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// 変更を画面に知らせる（保存・削除のたびに version が増える）
let version = 0;
const listeners = new Set<() => void>();
function notify() {
  version++;
  listeners.forEach((l) => l());
}
export function subscribePhotos(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export const getPhotosVersion = () => version;

/** 指定した日の写真（区分 → 画像） */
export async function getPhotosForDate(date: string): Promise<Partial<Record<MealKey, Blob>>> {
  const result: Partial<Record<MealKey, Blob>> = {};
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).openCursor(dateRange(date));
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) return;
      const meal = String(cursor.key).split(":")[1] as MealKey;
      result[meal] = cursor.value as Blob;
      cursor.continue();
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return result;
}

/** 追加・差し替え・削除をまとめて反映する */
export async function applyPhotoChanges(date: string, changes: PhotoChanges): Promise<void> {
  const entries = Object.entries(changes) as [MealKey, Blob | null][];
  if (entries.length === 0) return;
  await run("readwrite", (store) => {
    for (const [meal, blob] of entries) {
      if (blob) store.put(blob, photoKey(date, meal));
      else store.delete(photoKey(date, meal));
    }
  });
  notify();
}

/** その日の写真をすべて削除（記録の削除と一緒に使う） */
export async function deletePhotosForDate(date: string): Promise<void> {
  await run("readwrite", (store) => store.delete(dateRange(date)));
  notify();
}

/** すべての写真を削除（全データ削除と一緒に使う） */
export async function clearPhotos(): Promise<void> {
  await run("readwrite", (store) => store.clear());
  notify();
}

/** 長辺 800px の JPEG に縮小する */
export async function resizeImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("画像を変換できませんでした"))), "image/jpeg", JPEG_QUALITY),
  );
}
