import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   收藏功能 —— localStorage 持久化 + 订阅通知
   ══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "fiund_favorites";
let favorites: number[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function save() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); } catch {}
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
  favorites = load();
}

/** 切换收藏状态 */
export function toggleFavorite(itemId: number) {
  const idx = favorites.indexOf(itemId);
  if (idx >= 0) {
    favorites = favorites.filter((id) => id !== itemId);
  } else {
    favorites = [...favorites, itemId];
  }
  save();
  notify();
}

/** 检查是否已收藏 */
export function isFavorited(itemId: number): boolean {
  return favorites.includes(itemId);
}

/** React Hook —— 获取收藏 ID 列表，自动响应变化 */
export function useFavorites(): number[] {
  const [ids, setIds] = useState<number[]>(favorites);

  useEffect(() => {
    setIds(favorites);
    const sub = () => setIds([...favorites]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, []);

  return ids;
}
