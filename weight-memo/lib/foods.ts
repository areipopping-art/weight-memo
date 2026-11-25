// F-29 食品表からのカロリー自動計算
// 値は「食品カロリー計算表」（100g あたり kcal）による目安。
// ご飯・麺は調理後、肉・魚・野菜は生、小麦粉・米などの穀物は調理前の値。

export type FoodCategory = "grain" | "vegetable" | "fruit" | "meat" | "fish" | "eggDairyBean" | "oilSeasoning" | "sweets";

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  grain: "ご飯・穀物・小麦",
  vegetable: "野菜",
  fruit: "果物",
  meat: "肉",
  fish: "魚介",
  eggDairyBean: "卵・乳・豆",
  oilSeasoning: "油・調味料",
  sweets: "お菓子・パン",
};

export const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  grain: "🍚",
  vegetable: "🥬",
  fruit: "🍎",
  meat: "🍖",
  fish: "🐟",
  eggDairyBean: "🥚",
  oilSeasoning: "🧈",
  sweets: "🍰",
};

/** よく食べる量の目安（例：1杯 150g） */
export type FoodUnit = { label: string; grams: number };

export type Food = {
  name: string;
  kcalPer100g: number;
  category: FoodCategory;
  /** 検索で使う別の呼び方（ひらがな・カタカナは区別しない） */
  aliases?: string[];
  unit?: FoodUnit;
};

function foods(category: FoodCategory, list: Omit<Food, "category">[]): Food[] {
  return list.map((f) => ({ ...f, category }));
}

export const FOODS: Food[] = [
  ...foods("grain", [
    { name: "白米（炊いたご飯）", kcalPer100g: 156, aliases: ["ごはん", "ご飯", "ライス", "こめ", "米"], unit: { label: "1杯", grams: 150 } },
    { name: "玄米（炊いたご飯）", kcalPer100g: 152, aliases: ["げんまい", "ごはん"], unit: { label: "1杯", grams: 150 } },
    { name: "おかゆ", kcalPer100g: 65, aliases: ["かゆ"], unit: { label: "1杯", grams: 200 } },
    { name: "もち", kcalPer100g: 223, aliases: ["餅"], unit: { label: "1個", grams: 50 } },
    { name: "食パン", kcalPer100g: 248, aliases: ["ぱん", "トースト"], unit: { label: "6枚切り1枚", grams: 60 } },
    { name: "フランスパン", kcalPer100g: 289, aliases: ["ぱん", "バゲット"] },
    { name: "うどん（ゆで）", kcalPer100g: 95, aliases: ["饂飩"], unit: { label: "1玉", grams: 200 } },
    { name: "そば（ゆで）", kcalPer100g: 130, aliases: ["蕎麦"], unit: { label: "1玉", grams: 200 } },
    { name: "中華麺（ゆで）", kcalPer100g: 133, aliases: ["ラーメン", "ちゅうかめん", "焼きそば"], unit: { label: "1玉", grams: 200 } },
    { name: "パスタ（ゆで）", kcalPer100g: 150, aliases: ["スパゲッティ", "スパゲティ"], unit: { label: "1人前", grams: 250 } },
    { name: "パスタ（乾燥）", kcalPer100g: 347, aliases: ["スパゲッティ", "スパゲティ"], unit: { label: "1人前", grams: 100 } },
    { name: "小麦粉（薄力粉）", kcalPer100g: 349, aliases: ["こむぎこ", "はくりきこ"] },
    { name: "小麦粉（強力粉）", kcalPer100g: 337, aliases: ["こむぎこ", "きょうりきこ"] },
    { name: "米粉", kcalPer100g: 356, aliases: ["こめこ"] },
    { name: "オートミール（乾燥）", kcalPer100g: 350, aliases: ["オーツ"], unit: { label: "1食", grams: 30 } },
    { name: "コーンフレーク", kcalPer100g: 380, aliases: ["シリアル"], unit: { label: "1食", grams: 40 } },
  ]),
  ...foods("vegetable", [
    { name: "キャベツ", kcalPer100g: 23 },
    { name: "レタス", kcalPer100g: 11 },
    { name: "白菜", kcalPer100g: 13, aliases: ["はくさい"] },
    { name: "ほうれん草", kcalPer100g: 18, aliases: ["ほうれんそう"] },
    { name: "小松菜", kcalPer100g: 13, aliases: ["こまつな"] },
    { name: "ブロッコリー", kcalPer100g: 37, unit: { label: "小房4つ", grams: 50 } },
    { name: "きゅうり", kcalPer100g: 13, aliases: ["胡瓜"], unit: { label: "1本", grams: 100 } },
    { name: "トマト", kcalPer100g: 20, unit: { label: "1個", grams: 150 } },
    { name: "ミニトマト", kcalPer100g: 30, aliases: ["プチトマト"], unit: { label: "1個", grams: 10 } },
    { name: "大根", kcalPer100g: 15, aliases: ["だいこん"] },
    { name: "にんじん", kcalPer100g: 35, aliases: ["人参"] },
    { name: "玉ねぎ", kcalPer100g: 33, aliases: ["たまねぎ", "玉葱"] },
    { name: "長ねぎ", kcalPer100g: 35, aliases: ["ながねぎ", "ねぎ", "葱"] },
    { name: "ピーマン", kcalPer100g: 20 },
    { name: "なす", kcalPer100g: 18, aliases: ["茄子"] },
    { name: "もやし", kcalPer100g: 15, unit: { label: "1袋", grams: 200 } },
    { name: "かぼちゃ", kcalPer100g: 78, aliases: ["南瓜"] },
    { name: "さつまいも", kcalPer100g: 126, aliases: ["さつま芋", "いも"] },
    { name: "じゃがいも", kcalPer100g: 59, aliases: ["じゃが芋", "ポテト", "いも"], unit: { label: "1個", grams: 150 } },
    { name: "れんこん", kcalPer100g: 66, aliases: ["蓮根"] },
    { name: "ごぼう", kcalPer100g: 58, aliases: ["牛蒡"] },
    { name: "アボカド", kcalPer100g: 176, unit: { label: "1/2個", grams: 70 } },
  ]),
  // 補った値（表の果物は「りんごム 118」の1行だけで読み取れなかったため、一般的な目安を入れた）
  ...foods("fruit", [
    { name: "りんご", kcalPer100g: 53, aliases: ["林檎"], unit: { label: "1/2個", grams: 125 } },
    { name: "バナナ", kcalPer100g: 93, unit: { label: "1本", grams: 100 } },
    { name: "みかん", kcalPer100g: 49, aliases: ["蜜柑"], unit: { label: "1個", grams: 80 } },
    { name: "いちご", kcalPer100g: 31, aliases: ["苺", "ストロベリー"] },
    { name: "ぶどう", kcalPer100g: 58, aliases: ["葡萄", "グレープ"] },
    { name: "キウイ", kcalPer100g: 51, aliases: ["キウイフルーツ"], unit: { label: "1個", grams: 85 } },
    { name: "もも", kcalPer100g: 38, aliases: ["桃", "ピーチ"] },
    { name: "なし", kcalPer100g: 38, aliases: ["梨"] },
  ]),
  // 補った値（表に「4. 肉類」がなかったため、一般的な目安を入れた。鶏むねは「よく使う食品の量」の表の値）
  ...foods("meat", [
    { name: "鶏むね肉（皮なし）", kcalPer100g: 105, aliases: ["とりむね", "鶏肉", "とりにく", "チキン"], unit: { label: "1枚の半分", grams: 100 } },
    { name: "鶏もも肉（皮つき）", kcalPer100g: 190, aliases: ["とりもも", "鶏肉", "とりにく", "チキン"] },
    { name: "ささみ", kcalPer100g: 98, aliases: ["鶏ささみ", "とりにく"], unit: { label: "1本", grams: 50 } },
    { name: "豚ロース", kcalPer100g: 248, aliases: ["ぶた", "豚肉", "とんかつ"] },
    { name: "豚バラ", kcalPer100g: 366, aliases: ["ぶた", "豚肉"] },
    { name: "豚ひき肉", kcalPer100g: 209, aliases: ["ぶた", "豚肉", "ひきにく", "挽肉"] },
    { name: "牛もも", kcalPer100g: 196, aliases: ["ぎゅう", "牛肉", "ビーフ"] },
    { name: "牛バラ", kcalPer100g: 381, aliases: ["ぎゅう", "牛肉", "ビーフ", "カルビ"] },
    { name: "牛ひき肉", kcalPer100g: 251, aliases: ["ぎゅう", "牛肉", "ひきにく", "挽肉"] },
    { name: "ロースハム", kcalPer100g: 211, aliases: ["ハム"], unit: { label: "1枚", grams: 10 } },
    { name: "ベーコン", kcalPer100g: 400, unit: { label: "1枚", grams: 17 } },
    { name: "ウインナー", kcalPer100g: 319, aliases: ["ウィンナー", "ソーセージ"], unit: { label: "1本", grams: 20 } },
  ]),
  ...foods("fish", [
    { name: "鮭", kcalPer100g: 124, aliases: ["さけ", "しゃけ", "サーモン"], unit: { label: "1切れ", grams: 80 } },
    { name: "さば", kcalPer100g: 211, aliases: ["鯖"], unit: { label: "1切れ", grams: 80 } },
    { name: "まぐろ（赤身）", kcalPer100g: 115, aliases: ["鮪", "マグロ", "刺身"] },
    { name: "まぐろ（トロ）", kcalPer100g: 308, aliases: ["鮪", "マグロ", "とろ", "刺身"] },
    { name: "ぶり", kcalPer100g: 222, aliases: ["鰤"], unit: { label: "1切れ", grams: 80 } },
    { name: "たら", kcalPer100g: 72, aliases: ["鱈"], unit: { label: "1切れ", grams: 80 } },
    { name: "えび", kcalPer100g: 82, aliases: ["海老", "エビ"] },
    { name: "いか", kcalPer100g: 76, aliases: ["烏賊"] },
    { name: "たこ", kcalPer100g: 70, aliases: ["蛸"] },
    { name: "あさり", kcalPer100g: 27, aliases: ["浅蜊"] },
    { name: "ほたて", kcalPer100g: 66, aliases: ["帆立"] },
    { name: "しらす", kcalPer100g: 113 },
  ]),
  ...foods("eggDairyBean", [
    { name: "卵（全卵）", kcalPer100g: 142, aliases: ["たまご", "玉子", "タマゴ", "ゆで卵", "目玉焼き"], unit: { label: "1個", grams: 50 } },
    { name: "牛乳", kcalPer100g: 61, aliases: ["ぎゅうにゅう", "ミルク"], unit: { label: "1杯", grams: 200 } },
    { name: "低脂肪乳", kcalPer100g: 42, aliases: ["ミルク"], unit: { label: "1杯", grams: 200 } },
    { name: "無脂肪ヨーグルト", kcalPer100g: 37, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "プレーンヨーグルト", kcalPer100g: 56, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "ギリシャヨーグルト", kcalPer100g: 100, aliases: ["よーぐると"], unit: { label: "1個", grams: 100 } },
    { name: "プロセスチーズ", kcalPer100g: 313, aliases: ["チーズ"], unit: { label: "1切れ", grams: 20 } },
    { name: "木綿豆腐", kcalPer100g: 73, aliases: ["とうふ", "豆腐"], unit: { label: "1/2丁", grams: 150 } },
    { name: "絹ごし豆腐", kcalPer100g: 56, aliases: ["とうふ", "豆腐"], unit: { label: "1/2丁", grams: 150 } },
    { name: "納豆", kcalPer100g: 184, aliases: ["なっとう"], unit: { label: "1パック", grams: 45 } },
    { name: "豆乳（無調整）", kcalPer100g: 43, aliases: ["とうにゅう"], unit: { label: "1杯", grams: 200 } },
    { name: "おから", kcalPer100g: 88 },
    { name: "ゆで大豆", kcalPer100g: 163, aliases: ["だいず"] },
  ]),
  ...foods("oilSeasoning", [
    { name: "サラダ油", kcalPer100g: 886, aliases: ["あぶら", "油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "オリーブオイル", kcalPer100g: 886, aliases: ["あぶら", "油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "ごま油", kcalPer100g: 890, aliases: ["あぶら", "油", "胡麻油"], unit: { label: "小さじ1", grams: 4 } },
    { name: "バター", kcalPer100g: 700, unit: { label: "1かけ", grams: 10 } },
    { name: "マヨネーズ", kcalPer100g: 668, unit: { label: "大さじ1", grams: 12 } },
    { name: "ケチャップ", kcalPer100g: 104, unit: { label: "大さじ1", grams: 15 } },
    { name: "醤油", kcalPer100g: 76, aliases: ["しょうゆ"], unit: { label: "大さじ1", grams: 18 } },
    { name: "味噌", kcalPer100g: 182, aliases: ["みそ", "味噌汁"], unit: { label: "大さじ1", grams: 18 } },
    { name: "砂糖", kcalPer100g: 391, aliases: ["さとう"], unit: { label: "小さじ1", grams: 3 } },
    { name: "はちみつ", kcalPer100g: 329, aliases: ["蜂蜜", "ハニー"], unit: { label: "大さじ1", grams: 21 } },
    { name: "ピーナッツ", kcalPer100g: 585, aliases: ["落花生", "ナッツ"] },
    { name: "アーモンド", kcalPer100g: 609, aliases: ["ナッツ"], unit: { label: "10粒", grams: 10 } },
    { name: "くるみ", kcalPer100g: 713, aliases: ["胡桃", "ナッツ"] },
  ]),
  ...foods("sweets", [
    { name: "ショートケーキ", kcalPer100g: 320, aliases: ["けーき"], unit: { label: "1個", grams: 100 } },
    { name: "チョコレート", kcalPer100g: 550, aliases: ["ちょこ"], unit: { label: "1かけ", grams: 5 } },
    { name: "クッキー", kcalPer100g: 480, aliases: ["ビスケット"], unit: { label: "1枚", grams: 10 } },
    { name: "ポテトチップス", kcalPer100g: 540, aliases: ["ポテチ"], unit: { label: "1袋", grams: 60 } },
    { name: "どら焼き", kcalPer100g: 280, aliases: ["どらやき"], unit: { label: "1個", grams: 80 } },
    { name: "大福", kcalPer100g: 250, aliases: ["だいふく"], unit: { label: "1個", grams: 70 } },
    { name: "あんパン", kcalPer100g: 280, aliases: ["ぱん"], unit: { label: "1個", grams: 100 } },
    { name: "メロンパン", kcalPer100g: 350, aliases: ["ぱん"], unit: { label: "1個", grams: 100 } },
    // 補った値（表では「約4105」と数字が崩れていたため 410 にした）
    { name: "クロワッサン", kcalPer100g: 410, aliases: ["ぱん"], unit: { label: "1個", grams: 40 } },
  ]),
];

export const MIN_GRAMS = 1;
export const MAX_GRAMS = 2000;

/** カロリー ＝ 100gあたりのkcal × 食べた量(g) ÷ 100（四捨五入） */
export function kcalOf(food: Pick<Food, "kcalPer100g">, grams: number): number {
  return Math.round((food.kcalPer100g * grams) / 100);
}

/** グラム欄の文字列を数値に（範囲外・数字でなければ null） */
export function parseGrams(text: string): number | null {
  const s = text.trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < MIN_GRAMS || n > MAX_GRAMS) return null;
  return Math.round(n * 10) / 10;
}

/** 食事メモに書く短い名前（かっこの補足を外す。例：鶏むね肉（皮なし）→ 鶏むね肉） */
export function shortName(food: Pick<Food, "name">): string {
  return food.name.replace(/（.*?）/g, "");
}

/** 検索用に、カタカナをひらがなにして小文字にする */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/** 名前・別の呼び方で部分一致する食品（名前の先頭で一致するものを先に） */
export function searchFoods(query: string, limit: number): Food[] {
  const q = normalize(query);
  if (q === "") return [];
  const scored: { food: Food; score: number }[] = [];
  for (const food of FOODS) {
    const names = [food.name, ...(food.aliases ?? [])].map(normalize);
    if (names.some((n) => n.startsWith(q))) scored.push({ food, score: 0 });
    else if (names.some((n) => n.includes(q))) scored.push({ food, score: 1 });
  }
  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((s) => s.food);
}
