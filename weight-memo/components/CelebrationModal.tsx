import { formatKg } from "@/lib/weight";

/** F-18 目標に届いたときのお祝いの小窓 */
export default function CelebrationModal({ goalWeight, onClose }: { goalWeight: number; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
        className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg dark:bg-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-5xl" aria-hidden>
          🎉
        </p>
        <h2 id="celebration-title" className="mt-3 text-xl font-bold text-emerald-700 dark:text-emerald-400">
          目標達成おめでとう！
        </h2>
        <p className="mt-2 text-sm">目標の {formatKg(goalWeight)} に届きました。よくがんばりました！</p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-5 w-full rounded-md bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
