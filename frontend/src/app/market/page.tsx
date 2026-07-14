"use client";

import { useState } from "react";
import ItemCard from "@/components/ItemCard";

/* 示例二手商品数据 */
const marketItems = [
  { id: 1,  title: "二手 iPad Air 4",       price: 1800, date: "2小时前",  description: "95新，配件齐全，可面交",   category: "数码" },
  { id: 2,  title: "高等数学教材（第七版）", price: 25,   date: "3小时前",  description: "有少量笔记标注",           category: "教材" },
  { id: 3,  title: "小米台灯",              price: 35,   date: "昨天",     description: "毕业带不走，便宜出",        category: "生活" },
  { id: 4,  title: "Nike Air Max 运动鞋",   price: 120,  date: "2天前",    description: "42码，八成新",             category: "服饰" },
  { id: 5,  title: "罗技 G304 鼠标",        price: 89,   date: "3天前",    description: "无线游戏鼠标，手感极佳",    category: "数码" },
  { id: 6,  title: "考研英语真题集",         price: 15,   date: "4天前",    description: "2015-2025 十年真题",       category: "教材" },
  { id: 7,  title: "宿舍小风扇",            price: 20,   date: "5天前",    description: "USB 充电，三挡调速",        category: "生活" },
  { id: 8,  title: "优衣库黑色外套",        price: 60,   date: "一周前",   description: "L码，几乎没穿过",          category: "服饰" },
];

const categories = ["全部", "教材", "数码", "生活", "服饰"];

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

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

      {/* 商品列表 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} {...item} type="market" />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无相关商品</p>
      )}
    </div>
  );
}
