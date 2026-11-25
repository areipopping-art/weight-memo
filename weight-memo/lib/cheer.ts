// ホームでキャラクターが話すセリフ（状況と性別によって変わる）

import type { Mood } from "@/components/Mascot";
import type { Data } from "./storage";
import { diffFromPrevious, recordStreak, sortNewestFirst } from "./stats";

export type Cheer = { mood: Mood; text: string };

export function cheerMessage(data: Data, today: string): Cheer {
  const male = data.sex === "male";
  const latest = sortNewestFirst(data.records)[0];
  if (!latest) {
    return {
      mood: "happy",
      text: male
        ? "よろしく！毎日の体重、一緒に記録していこうぜ👊"
        : "はじめまして！毎日の体重を、いっしょに記録していこうね🌸",
    };
  }

  const streak = recordStreak(data.records, today);
  const recordedToday = data.records.some((r) => r.date === today);

  if (!recordedToday) {
    if (streak > 0) {
      return {
        mood: "cheer",
        text: male
          ? `いま${streak}日連続だ！今日も記録してつなげよう🔥`
          : `いま${streak}日連続だよ！今日も記録してつなげよう🔥`,
      };
    }
    return {
      mood: "cheer",
      text: male ? "今日の体重を記録しよう！10秒で終わるぞ⏱️" : "今日の体重を教えてね！10秒で終わるよ✏️",
    };
  }

  const diff = diffFromPrevious(data.records);
  if (data.goalWeight !== null && latest.weight <= data.goalWeight) {
    return { mood: "celebrate", text: male ? "目標達成中！最高だ🏆" : "目標達成中！ほんとにすごいよ〜🎉" };
  }
  if (diff !== null && diff < 0) {
    const kg = (-diff).toFixed(1);
    return {
      mood: "celebrate",
      text: male ? `前回から −${kg}kg！いい調子だ💪` : `前回から −${kg}kg！その調子だよ✨`,
    };
  }
  if (streak >= 3) {
    return {
      mood: "happy",
      text: male ? `${streak}日連続記録！ナイスだ👍` : `${streak}日連続で記録できてる！えらいね💮`,
    };
  }
  if (diff !== null && diff > 0) {
    return {
      mood: "happy",
      text: male
        ? "増えても気にするな。続けることが一番の力だ💪"
        : "ちょっと増えても大丈夫。続けることがいちばん大事だよ🍀",
    };
  }
  return { mood: "happy", text: male ? "ナイス！今日もクリア✅" : "今日もえらい！記録できたね💮" };
}
