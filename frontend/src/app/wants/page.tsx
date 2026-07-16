"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";
import { useWants } from "@/data/wants";
import { useAuth } from "@/contexts/AuthContext";

export default function WantsPage() {
  const { username, isLoggedIn } = useAuth();
  const allItems = useItems();
  const wantIds = useWants(isLoggedIn ? username : undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* 根据"我想要" ID 找到对应的物品 */
  const wantItems = wantIds
    .map((id) => allItems.find((item) => item.id === id))
    .filter(Boolean) as typeof allItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link href="/messages" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我想要</h1>
        {mounted && wantItems.length > 0 && (
          <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">{wantItems.length} 件</span>
        )}
      </header>

      {/* 想要列表 */}
      {wantItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
          {wantItems.map((item, idx) => (
            <Link key={item.id} href={`/item/${item.id}`}
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}>
              <ItemCard {...item} />
            </Link>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center mt-24 px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">还没有标记想要的物品</p>
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            进入物品详情页，点击"我想要"即可标记
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2.5 bg-gradient-primary text-white rounded-full text-xs font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-95"
          >
            去逛逛
          </Link>
        </div>
      )}
    </div>
  );
}
