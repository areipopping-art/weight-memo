import type { WeightRecord } from "@/lib/storage";
import { diffFromPrevious } from "@/lib/stats";
import { formatKg } from "@/lib/weight";

/** F-10 前回の記録からの増減を表示する（前回がなければ何も出さない） */
export default function PreviousDiff({ records }: { records: WeightRecord[] }) {
  const diff = diffFromPrevious(records);
  if (diff === null) return null;

  const down = diff < 0;
  const up = diff > 0;
  const text = up ? `+${formatKg(diff)}` : down ? `−${formatKg(-diff)}` : "±0.0kg";

  return (
    <div
      className={`card text-sm ${
        down
          ? "bg-mint-50 dark:bg-[#1f3330]"
          : up
            ? "bg-sakura-50 dark:bg-[#3a2733]"
            : ""
      }`}
    >
      <p className="text-xs font-bold text-muted">
        <span aria-hidden>{down ? "📉 " : up ? "📈 " : "➖ "}</span>前回から
      </p>
      <p
        className={`mt-1 text-2xl font-extrabold ${
          down ? "text-mint-700 dark:text-mint-300" : up ? "text-sakura-700 dark:text-sakura-300" : ""
        }`}
      >
        {text}
      </p>
    </div>
  );
}
