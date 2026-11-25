import Mascot from "@/components/Mascot";
import type { Sex } from "@/lib/calorie";
import { themeCopy } from "@/lib/theme";
import { formatKg } from "@/lib/weight";

const CONFETTI_COLORS = ["var(--color-sakura-400)", "var(--color-lemon-300)", "var(--color-mint-300)", "var(--color-lavender-400)", "var(--color-sakura-300)"];

/** 紙吹雪（位置や速さは番号から決める。毎回同じ見た目になる） */
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 10) / 10,
  duration: 2.2 + ((i * 7) % 10) / 8,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  round: i % 3 === 0,
}));

/** F-18 目標に届いたときのお祝いの小窓 */
export default function CelebrationModal({
  goalWeight,
  sex,
  onClose,
}: {
  goalWeight: number;
  sex: Sex | null;
  onClose: () => void;
}) {
  const copy = themeCopy(sex);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-sakura-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 紙吹雪 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={`absolute -top-4 block h-3 w-2 animate-confetti ${c.round ? "rounded-full" : "rounded-sm"}`}
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
        className="card relative w-full max-w-sm animate-pop-in p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Mascot mood="celebrate" size={140} className="mx-auto -mt-2 animate-bounce-soft" />
        <h2 id="celebration-title" className="mt-2 text-2xl font-extrabold text-sakura-600 dark:text-sakura-300">
          {copy.celebrateTitle}
        </h2>
        <p className="mt-2 text-sm">
          目標の <span className="font-extrabold">{formatKg(goalWeight)}</span> に{sex === "male" ? "到達！" : "届いたよ。"}
          <br />
          {copy.celebrateBody}
        </p>
        <button type="button" autoFocus onClick={onClose} className="btn-primary mt-5 w-full py-3">
          {copy.celebrateButton}
        </button>
      </div>
    </div>
  );
}
