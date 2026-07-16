"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useHistory } from "@/data/history";
import { useAuth } from "@/contexts/AuthContext";

export default function HistoryPage() {
  const { username, isLoggedIn } = useAuth();
  const historyItems = useHistory(isLoggedIn ? username : undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link href="/messages" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 flex-1">浏览记录</h1>
        {mounted && historyItems.length > 0 && (
          <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">{historyItems.length} 条</span>
        )}
      </header>

      {historyItems.length > 0 ? (
        <div className="p-4 pb-24 space-y-3">
          {historyItems.map((item, idx) => (
            <Link
              key={`${item.itemId}-${idx}`}
              href={`/item/${item.itemId}`}
              className="flex gap-3 bg-white rounded-2xl p-3 shadow-card hover:shadow-card-hover transition-all duration-200 animate-slide-up border border-orange-100/50"
              style={{ animationDelay: `${Math.min(idx, 10) * 40}ms`, animationFillMode: "both" }}
            >
              {/* 缩略图 */}
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {item.type === "market" ? "🛍️" : item.type === "lost" ? "🔍" : "📦"}
                  </div>
                )}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.price !== undefined && (
                    <span className="text-gradient font-bold text-sm">¥{item.price}</span>
                  )}
                  <span className="text-[10px] text-gray-400">{item.viewedAt}</span>
                </div>
              </div>

              {/* 箭头 */}
              <div className="flex items-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-24 px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5 text-3xl">
            👁️
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">暂无浏览记录</p>
          <p className="text-xs text-gray-400 text-center leading-relaxed">你浏览过的物品会出现在这里</p>
        </div>
      )}
    </div>
  );
}
