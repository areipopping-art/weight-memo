/** 端末の時刻での今日の日付 "YYYY-MM-DD" */
export function todayString(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** "2026-11-24" → "11/24" */
export function formatShortDate(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** "2026-11-24" に n 日足した日付（n は負でもよい） */
export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(y, m - 1, d + n);
  const mm = String(next.getMonth() + 1).padStart(2, "0");
  const dd = String(next.getDate()).padStart(2, "0");
  return `${next.getFullYear()}-${mm}-${dd}`;
}

/** from から to までの日数（to が後なら正） */
export function daysBetween(from: string, to: string): number {
  const toTime = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toTime(to) - toTime(from)) / 86_400_000);
}
