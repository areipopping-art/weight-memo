"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatShortDate } from "@/lib/date";
import { formatKcal, totalKcal } from "@/lib/meals";
import type { WeightRecord } from "@/lib/storage";
import { formatKg } from "@/lib/weight";

const LINE = "#f25588"; // sakura-500
const BAR = "#3fcd9f"; // mint-400
const MUTED = "#a08a96"; // ライト・ダーク両方で読める中間の色

/** F-24 体重（折れ線）と1日の合計カロリー（棒）を並べて表示する */
export default function MealWeightChart({ records }: { records: WeightRecord[] }) {
  const points = records.map((r) => ({ date: formatShortDate(r.date), weight: r.weight, kcal: totalKcal(r) }));
  const weights = points.map((p) => p.weight);
  const min = Math.floor(Math.min(...weights) - 1);
  const max = Math.ceil(Math.max(...weights) + 1);
  // カロリー軸は 500kcal 刻み（多いときは 1000kcal 刻み）
  const kcalMax = Math.max(0, ...points.map((p) => p.kcal ?? 0));
  const kcalStep = kcalMax > 3000 ? 1000 : 500;
  const kcalTicks: number[] = [];
  for (let t = 0; t <= Math.max(kcalStep, Math.ceil(kcalMax / kcalStep) * kcalStep); t += kcalStep) kcalTicks.push(t);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={points} margin={{ top: 8, right: 0, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={MUTED} strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={{ stroke: MUTED }} />
          <YAxis
            yAxisId="weight"
            domain={[min, max]}
            allowDecimals={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="kcal"
            orientation="right"
            domain={[0, kcalTicks[kcalTicks.length - 1]]}
            ticks={kcalTicks}
            tick={{ fill: MUTED, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "kcal" ? [formatKcal(Number(value)), "合計カロリー"] : [formatKg(Number(value)), "体重"]
            }
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Legend
            formatter={(value) => (value === "kcal" ? "合計カロリー（右）" : "体重（左）")}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar yAxisId="kcal" dataKey="kcal" fill={BAR} fillOpacity={0.6} radius={[3, 3, 0, 0]} />
          <Line yAxisId="weight" type="monotone" dataKey="weight" stroke={LINE} strokeWidth={2} dot={{ r: 3, fill: LINE }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
