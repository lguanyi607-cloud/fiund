import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   收藏功能 —— localStorage 持久化（按用户隔离）+ 订阅通知
   ══════════════════════════════════════════════════════════ */

let currentUser = "";
let favorites: number[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function getKey(username: string) {
  return `fiund_favorites_${username}`;
}

function save() {
  if (typeof window !== "undefined" && currentUser) {
    try { localStorage.setItem(getKey(currentUser), JSON.stringify(favorites)); } catch {}
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
    const oldRaw = localStorage.getItem("fiund_favorites");
    if (oldRaw) {
      localStorage.setItem(newKey, oldRaw);
      localStorage.removeItem("fiund_favorites");
    }
  } catch {}
}

/** 切换当前用户 */
export function switchFavoritesUser(username: string) {
  migrateOldData(username);
  currentUser = username;
  favorites = load(username);
  notify();
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

/** React Hook —— 获取收藏 ID 列表，按用户隔离 */
export function useFavorites(username?: string): number[] {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    if (username) {
      switchFavoritesUser(username);
      setIds(load(username));
    } else {
      setIds([]);
    }
    const sub = () => setIds([...favorites]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [username]);

  return ids;
}
