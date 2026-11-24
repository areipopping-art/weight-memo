"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatShortDate } from "@/lib/date";
import type { WeightRecord } from "@/lib/storage";
import { formatKg } from "@/lib/weight";

const LINE = "#059669"; // emerald-600
const GOAL = "#ea580c"; // orange-600
const MUTED = "#737373"; // neutral-500（ライト・ダーク両方で読める）

/** F-17 体重の折れ線グラフ。目標体重があれば横線を引く */
export default function WeightChart({ records, goalWeight }: { records: WeightRecord[]; goalWeight: number | null }) {
  const points = records.map((r) => ({ date: formatShortDate(r.date), weight: r.weight }));

  // 目標ラインも画面に入るように縦軸の範囲を決める（上下に 1kg 余白）
  const values = points.map((p) => p.weight).concat(goalWeight !== null ? [goalWeight] : []);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  // 目盛りは整数で等間隔に（幅が広いときは 2kg 刻み以上）
  const step = Math.max(1, Math.ceil((max - min) / 6));
  const ticks: number[] = [];
  for (let t = min; ; t += step) {
    ticks.push(t);
    if (t >= max) break; // 最後の目盛りがデータの最大値以上になるまで
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={MUTED} strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={{ stroke: MUTED }} />
          <YAxis domain={[min, ticks[ticks.length - 1]]} ticks={ticks} tick={{ fill: MUTED, fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => [formatKg(Number(value)), "体重"]}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          {goalWeight !== null && (
            <ReferenceLine
              y={goalWeight}
              stroke={GOAL}
              strokeDasharray="4 4"
              label={{ value: `目標 ${formatKg(goalWeight)}`, position: "insideTopRight", fill: GOAL, fontSize: 12 }}
            />
          )}
          <Line type="monotone" dataKey="weight" stroke={LINE} strokeWidth={2} dot={{ r: 3, fill: LINE }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
