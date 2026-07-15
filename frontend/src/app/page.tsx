"use client";

import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";

export default function HomePage() {
  const allItems = useItems();
  const items = allItems.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* 顶部标题栏 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">Fiund</h1>
        <p className="text-xs text-gray-400">校园物品流转平台</p>
      </header>

      {/* 混合卡片流 —— 点击卡片跳转详情 */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>
    </div>
  );
}
