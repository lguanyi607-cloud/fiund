"use client";

import { useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import PublishModal from "@/components/PublishModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useItems } from "@/data/items";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["全部", "教材", "数码", "生活", "服饰"];

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [showPublish, setShowPublish] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isLoggedIn } = useAuth();
  const allItems = useItems();
  const marketItems = allItems.filter((item) => item.type === "market");

  const filteredItems = marketItems.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "全部" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function handleFabClick() {
    if (isLoggedIn) {
      setShowPublish(true);
    } else {
      setShowLoginPrompt(true);
    }
  }

  return (
    <div className="min-h-screen">
      {/* 顶部搜索区域 */}
      <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-40"
        style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)" }}>
        <h1 className="text-lg font-bold text-gray-800 mb-3">二手交易</h1>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="搜索商品..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-orange-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 transition-all duration-200 placeholder:text-gray-400"
          />
        </div>
      </header>

      {/* 分类筛选标签 */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-white border-b border-orange-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-gradient-primary text-white shadow-warm"
                : "bg-orange-50 text-gray-600 hover:bg-orange-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {filteredItems.map((item, idx) => (
          <Link key={item.id} href={`/item/${item.id}`}
            className="animate-slide-up"
            style={{ animationDelay: `${Math.min(idx, 10) * 40}ms`, animationFillMode: "both" }}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-400 text-sm">暂无相关商品</p>
        </div>
      )}

      {/* 右下角 FAB 发布按钮 */}
      <button
        onClick={handleFabClick}
        className="fixed bottom-24 z-40 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-warm-lg flex items-center justify-center transition-all duration-200 active:scale-90 hover:shadow-[0_8px_30px_rgba(249,115,22,0.4)]"
        style={{ right: "max(1rem, calc(50% - 232px))" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 发布表单（仅登录后） */}
      <PublishModal open={showPublish} onClose={() => setShowPublish(false)} type="market" />

      {/* 登录提醒弹窗（未登录时） */}
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
