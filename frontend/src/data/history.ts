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

let currentUser = "";
let history: HistoryRecord[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function getKey(username: string) {
  return `fiund_history_${username}`;
}

function load(username: string): HistoryRecord[] {
  if (typeof window === "undefined" || !username) return [];
  try {
    const raw = localStorage.getItem(getKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save() {
  if (typeof window !== "undefined" && currentUser) {
    try {
      localStorage.setItem(getKey(currentUser), JSON.stringify(history));
    } catch {}
  }
}

/** 迁移旧数据 */
function migrateOldData(username: string) {
  if (typeof window === "undefined") return;
  try {
    const newKey = getKey(username);
    if (localStorage.getItem(newKey)) return;
    const oldRaw = localStorage.getItem("fiund_history");
    if (oldRaw) {
      localStorage.setItem(newKey, oldRaw);
      localStorage.removeItem("fiund_history");
    }
  } catch {}
}

/** 切换当前用户 */
export function switchHistoryUser(username: string) {
  migrateOldData(username);
  currentUser = username;
  history = load(username);
  notify();
}

/** 记录一次浏览 */
export function recordView(record: Omit<HistoryRecord, "viewedAt">) {
  if (!currentUser) return;
  history = history.filter((r) => r.itemId !== record.itemId);
  history = [
    { ...record, viewedAt: new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) },
    ...history,
  ].slice(0, 50);
  save();
  notify();
}

/** React Hook 获取浏览记录，按用户隔离 */
export function useHistory(username?: string): HistoryRecord[] {
  const [items, setItems] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    if (username) {
      switchHistoryUser(username);
      setItems(load(username));
    } else {
      setItems([]);
    }
    const sub = () => setItems([...history]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [username]);

  return items;
}
