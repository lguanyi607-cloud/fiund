"use client";

import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/data/items";
import { useAuth } from "@/contexts/AuthContext";

export default function MyItemsPage() {
  const { username, isLoggedIn } = useAuth();
  const allItems = useItems();
  /* 用户发布的物品 = owner 为当前用户名 */
  const myItems = allItems.filter((item) => item.owner === username);

  const typeLabel = (type: string) => {
    if (type === "market") return "二手";
    if (type === "lost") return "寻物";
    return "拾到";
  };

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
        <h1 className="text-sm font-semibold text-gray-800 flex-1">我的发布</h1>
      </header>

      {/* 分类统计 */}
      {myItems.length > 0 && (
        <div className="flex gap-2 px-4 py-3 bg-white border-b border-orange-50">
          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-semibold border border-orange-100">
            全部 {myItems.length}
          </span>
          <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-100">
            二手 {myItems.filter((i) => i.type === "market").length}
          </span>
          <span className="px-3 py-1 bg-orange-50/50 text-orange-500 rounded-full text-xs font-medium border border-orange-100/50">
            寻物 {myItems.filter((i) => i.type === "lost").length}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-xs font-medium border border-emerald-100">
            拾到 {myItems.filter((i) => i.type === "found").length}
          </span>
        </div>
      )}

      {/* 物品列表 */}
      {myItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-3 pb-24">
          {myItems.map((item, idx) => (
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">还没有发布任何物品</p>
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            去二手交易或失物招领页面，<br />点击右下角 + 按钮发布你的第一条信息
          </p>
          <Link
            href="/market"
            className="mt-6 px-6 py-2.5 bg-gradient-primary text-white rounded-full text-xs font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-95"
          >
            去发布
          </Link>
        </div>
      )}
    </div>
  );
}
