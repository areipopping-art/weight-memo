"use client";

import { useEffect } from "react";
import { useWeightMemo } from "@/lib/useWeightMemo";

/** 性別に合わせて <html data-theme> を付け替える（男性は青のテーマ） */
export default function ThemeSync() {
  const { data } = useWeightMemo();
  const theme = data?.sex === "male" ? "male" : "female";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}
