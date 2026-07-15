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
      <header className="bg-gradient-primary px-5 pt-5 pb-5 sticky top-0 z-40"
        style={{ boxShadow: "0 4px 20px rgba(249, 115, 22, 0.2)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Fiund</h1>
            <p className="text-xs text-orange-100 mt-0.5">校园物品流转平台</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </header>

      {/* 混合卡片流 —— 点击卡片跳转详情 */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {items.map((item, idx) => (
          <Link key={item.id} href={`/item/${item.id}`}
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>
    </div>
  );
}
