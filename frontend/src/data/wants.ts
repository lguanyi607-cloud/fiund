import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   "我想要" 功能 —— localStorage 持久化（按用户隔离）+ 订阅通知
   ══════════════════════════════════════════════════════════ */

let currentUser = "";
let wants: number[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function getKey(username: string) {
  return `fiund_wants_${username}`;
}

function save() {
  if (typeof window !== "undefined" && currentUser) {
    try { localStorage.setItem(getKey(currentUser), JSON.stringify(wants)); } catch {}
  }
}

function load(username: string): number[] {
  if (typeof window === "undefined" || !username) return [];
  try {
    const raw = localStorage.getItem(getKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 迁移旧数据 */
function migrateOldData(username: string) {
  if (typeof window === "undefined") return;
  try {
    const newKey = getKey(username);
    if (localStorage.getItem(newKey)) return;
    const oldRaw = localStorage.getItem("fiund_wants");
    if (oldRaw) {
      localStorage.setItem(newKey, oldRaw);
      localStorage.removeItem("fiund_wants");
    }
  } catch {}
}

/** 切换当前用户 */
export function switchWantsUser(username: string) {
  migrateOldData(username);
  currentUser = username;
  wants = load(username);
  notify();
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

/** React Hook —— 获取"我想要" ID 列表，按用户隔离 */
export function useWants(username?: string): number[] {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    if (username) {
      switchWantsUser(username);
      setIds(load(username));
    } else {
      setIds([]);
    }
    const sub = () => setIds([...wants]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [username]);

  return ids;
}
