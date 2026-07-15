"use client";

import { useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const allItems = useItems();

  const filteredItems = allItems.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  const displayItems = search.trim() ? filteredItems : filteredItems.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* 顶部标题栏 */}
      <header className="bg-gradient-primary px-5 pt-5 pb-5 sticky top-0 z-40"
        style={{ boxShadow: "0 4px 20px rgba(249, 115, 22, 0.2)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Fiund</h1>
            <p className="text-xs text-orange-100 mt-0.5">校园物品流转平台</p>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              showSearch ? "bg-white text-orange-500" : "bg-white/20 text-white"
            }`}
          >
            {showSearch ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>

        {/* 搜索框 */}
        {showSearch && (
          <div className="mt-3 animate-slide-up">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="搜索物品名称、分类、地点..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-white/90 rounded-xl text-sm outline-none placeholder:text-orange-300 text-gray-800 transition-all duration-200"
                style={{ backdropFilter: "blur(8px)" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            {search.trim() && (
              <p className="text-xs text-orange-100 mt-2">
                找到 {filteredItems.length} 个结果
              </p>
            )}
          </div>
        )}
      </header>

      {/* 混合卡片流 —— 点击卡片跳转详情 */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {displayItems.map((item, idx) => (
          <Link key={item.id} href={`/item/${item.id}`}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(idx, 8) * 50}ms`, animationFillMode: "both" }}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>

      {displayItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-400 text-sm">没有找到相关物品</p>
          <button
            onClick={() => { setSearch(""); setShowSearch(false); }}
            className="mt-3 text-orange-500 text-xs font-medium"
          >
            清除搜索
          </button>
        </div>
      )}
    </div>
  );
}
