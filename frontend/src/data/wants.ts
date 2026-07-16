import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   "我想要" 功能 —— localStorage 持久化 + 订阅通知
   ══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "fiund_wants";
let wants: number[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function save() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wants)); } catch {}
  }
}

function load(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* 初始化加载 */
if (typeof window !== "undefined") {
  wants = load();
}

/** 切换"我想要"状态 */
export function toggleWant(itemId: number) {
  const idx = wants.indexOf(itemId);
  if (idx >= 0) {
    wants = wants.filter((id) => id !== itemId);
  } else {
    wants = [...wants, itemId];
  }
  save();
  notify();
}

/** 检查是否已标记"我想要" */
export function isWanted(itemId: number): boolean {
  return wants.includes(itemId);
}

/** React Hook —— 获取"我想要" ID 列表，自动响应变化 */
export function useWants(): number[] {
  const [ids, setIds] = useState<number[]>(wants);

  useEffect(() => {
    setIds(wants);
    const sub = () => setIds([...wants]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, []);

  return ids;
}
