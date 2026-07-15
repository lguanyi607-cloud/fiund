"use client";

import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems, getItemById } from "@/data/items";
import { useFavorites, toggleFavorite } from "@/data/favorites";

export default function FavoritesPage() {
  const allItems = useItems();
  const favIds = useFavorites();

  /* 根据收藏 ID 找到对应的物品 */
  const favItems = favIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as typeof allItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3">
        <Link href="/messages" className="text-gray-600 hover:text-blue-600 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我的收藏</h1>
        {favItems.length > 0 && (
          <span className="text-xs text-gray-400">{favItems.length} 件</span>
        )}
      </header>

      {/* 收藏列表 */}
      {favItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
          {favItems.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`}>
              <ItemCard {...item} />
            </Link>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center mt-24 px-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-1">还没有收藏任何物品</p>
          <p className="text-xs text-gray-400 text-center">
            进入物品详情页，点击右上角星标即可收藏
          </p>
          <Link
            href="/"
            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition"
          >
            去逛逛
          </Link>
        </div>
      )}
    </div>
  );
}
