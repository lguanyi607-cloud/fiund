"use client";

import { useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { allItems } from "@/data/items";

const filters = ["全部", "寻找中", "等待认领", "已认领"];

export default function LostFoundPage() {
  const [activeFilter, setActiveFilter] = useState("全部");

  /* 只取 lost 和 found 类型 */
  const lostFoundItems = allItems.filter(
    (item) => item.type === "lost" || item.type === "found"
  );

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

      {/* 失物招领卡片流 —— 点击跳转详情 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无相关信息</p>
      )}
    </div>
  );
}
