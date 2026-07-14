"use client";

import { useState } from "react";
import ItemCard from "@/components/ItemCard";

/* 示例失物招领数据 */
const lostFoundItems = [
  { id: 1, title: "寻找丢失的校园卡",     type: "lost"  as const, date: "今天",   location: "图书馆",   status: "寻找中" },
  { id: 2, title: "拾到一副 AirPods",     type: "found" as const, date: "昨天",   location: "食堂二楼", status: "等待认领" },
  { id: 3, title: "丢失一串钥匙",         type: "lost"  as const, date: "2天前",  location: "操场附近", status: "寻找中" },
  { id: 4, title: "拾到一本《线性代数》",  type: "found" as const, date: "3天前",  location: "教学楼A",  status: "已认领" },
  { id: 5, title: "丢失黑色双肩包",       type: "lost"  as const, date: "4天前",  location: "校车站",   status: "寻找中" },
  { id: 6, title: "拾到一把雨伞",         type: "found" as const, date: "5天前",  location: "实验楼",   status: "等待认领" },
];

const filters = ["全部", "寻找中", "已认领"];

export default function LostFoundPage() {
  const [activeFilter, setActiveFilter] = useState("全部");

  const filteredItems = lostFoundItems.filter((item) => {
    if (activeFilter === "全部") return true;
    return item.status === activeFilter;
  });

  return (
    <div className="min-h-screen">
      {/* 顶部标题 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">失物招领</h1>
      </header>

      {/* 状态筛选标签 */}
      <div className="px-4 py-2 flex gap-2 bg-white border-b border-gray-50">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-full text-xs transition ${
              activeFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 失物招领卡片流 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无相关信息</p>
      )}
    </div>
  );
}
