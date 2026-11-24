import type { WeightRecord } from "@/lib/storage";
import { diffFromPrevious } from "@/lib/stats";
import { formatKg } from "@/lib/weight";

/** F-10 前回の記録からの増減を表示する（前回がなければ何も出さない） */
export default function PreviousDiff({ records }: { records: WeightRecord[] }) {
  const diff = diffFromPrevious(records);
  if (diff === null) return null;

  let text: string;
  let color: string;
  if (diff > 0) {
    text = `+${formatKg(diff)}`;
    color = "text-red-600 dark:text-red-400";
  } else if (diff < 0) {
    text = `−${formatKg(-diff)}`;
    color = "text-emerald-700 dark:text-emerald-400";
  } else {
    text = "±0.0kg";
    color = "text-neutral-600 dark:text-neutral-300";
  }

  return (
    <p className="rounded-lg bg-white p-4 text-sm shadow-sm dark:bg-neutral-800">
      前回から <span className={`text-xl font-bold ${color}`}>{text}</span>
    </p>
  );
}
