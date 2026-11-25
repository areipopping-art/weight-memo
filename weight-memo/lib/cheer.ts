// ホームでキャラクターが話すセリフ（状況によって変わる）

import type { Mood } from "@/components/Mascot";
import type { Data } from "./storage";
import { diffFromPrevious, recordStreak, sortNewestFirst } from "./stats";

export type Cheer = { mood: Mood; text: string };

export function cheerMessage(data: Data, today: string): Cheer {
  const latest = sortNewestFirst(data.records)[0];
  if (!latest) return { mood: "happy", text: "はじめまして！毎日の体重を、いっしょに記録していこうね🌸" };

  const streak = recordStreak(data.records, today);
  const recordedToday = latest.date === today || data.records.some((r) => r.date === today);

  if (!recordedToday) {
    return streak > 0
      ? { mood: "cheer", text: `いま${streak}日連続だよ！今日も記録してつなげよう🔥` }
      : { mood: "cheer", text: "今日の体重を教えてね！10秒で終わるよ✏️" };
  }

  const diff = diffFromPrevious(data.records);
  if (data.goalWeight !== null && latest.weight <= data.goalWeight) {
    return { mood: "celebrate", text: "目標達成中！ほんとにすごいよ〜🎉" };
  }
  if (diff !== null && diff < 0) {
    return { mood: "celebrate", text: `前回から −${(-diff).toFixed(1)}kg！その調子だよ✨` };
  }
  if (streak >= 3) return { mood: "happy", text: `${streak}日連続で記録できてる！えらいね💮` };
  if (diff !== null && diff > 0) {
    return { mood: "happy", text: "ちょっと増えても大丈夫。続けることがいちばん大事だよ🍀" };
  }
  return { mood: "happy", text: "今日もえらい！記録できたね💮" };
}
