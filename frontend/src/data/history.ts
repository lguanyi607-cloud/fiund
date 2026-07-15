import { useState, useEffect } from "react";

export interface HistoryRecord {
  itemId: number;
  title: string;
  description: string;
  image?: string;
  type: "market" | "lost" | "found";
  price?: number;
  viewedAt: string;
}

let history: HistoryRecord[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function load(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fiund_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("fiund_history", JSON.stringify(history));
  } catch {}
}

// 初始化
if (typeof window !== "undefined") {
  history = load();
}

/** 记录一次浏览 */
export function recordView(record: Omit<HistoryRecord, "viewedAt">) {
  // 去重：如果已有同一物品，先删除旧记录
  history = history.filter((r) => r.itemId !== record.itemId);
  // 新记录放最前面
  history = [
    { ...record, viewedAt: new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) },
    ...history,
  ].slice(0, 50); // 最多保留 50 条
  save();
  notify();
}

/** React Hook 获取浏览记录 */
export function useHistory(): HistoryRecord[] {
  const [items, setItems] = useState<HistoryRecord[]>(history);

  useEffect(() => {
    setItems(load());
    const sub = () => setItems([...history]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, []);

  return items;
}
