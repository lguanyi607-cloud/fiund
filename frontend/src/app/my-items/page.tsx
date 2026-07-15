"use client";

import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";

export default function MyItemsPage() {
  const allItems = useItems();
  /* 用户发布的物品 = 动态添加的物品（id > 1000 表示用户创建的） */
  const myItems = allItems.filter((item) => item.id > 1000000);

  const typeLabel = (type: string) => {
    if (type === "market") return "二手";
    if (type === "lost") return "寻物";
    return "拾到";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3">
        <Link href="/messages" className="text-gray-600 hover:text-blue-600 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我的发布</h1>
      </header>

      {/* 分类统计 */}
      {myItems.length > 0 && (
        <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-50">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
            全部 {myItems.length}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
            二手 {myItems.filter((i) => i.type === "market").length}
          </span>
          <span className="px-2.5 py-1 bg-orange-50 text-orange-500 rounded-full text-xs">
            寻物 {myItems.filter((i) => i.type === "lost").length}
          </span>
          <span className="px-2.5 py-1 bg-green-50 text-green-500 rounded-full text-xs">
            拾到 {myItems.filter((i) => i.type === "found").length}
          </span>
        </div>
      )}

      {/* 物品列表 */}
      {myItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
          {myItems.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`}>
              <div className="relative">
                <ItemCard {...item} />
                {/* 类型角标 */}
                <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded text-white ${
                  item.type === "market" ? "bg-blue-500" : item.type === "lost" ? "bg-orange-500" : "bg-green-500"
                }`}>
                  {typeLabel(item.type)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center mt-24 px-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-1">还没有发布任何物品</p>
          <p className="text-xs text-gray-400 text-center">
            去二手交易或失物招领页面，<br />点击右下角 + 按钮发布你的第一条信息
          </p>
          <Link
            href="/market"
            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition"
          >
            去发布
          </Link>
        </div>
      )}
    </div>
  );
}
