"use client";

import { useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { getItemsByType } from "@/data/items";

const categories = ["全部", "教材", "数码", "生活", "服饰"];

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const marketItems = getItemsByType("market");

  const filteredItems = marketItems.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "全部" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* 顶部搜索区域 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800 mb-2">二手交易</h1>
        <input
          type="text"
          placeholder="搜索商品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
      </header>

      {/* 分类筛选标签 */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white border-b border-gray-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 商品列表 —— 点击卡片跳转详情 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无相关商品</p>
      )}
    </div>
  );
}
