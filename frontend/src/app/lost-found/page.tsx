"use client";

import { useState } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import PublishModal from "@/components/PublishModal";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useItems } from "@/data/items";
import { useAuth } from "@/contexts/AuthContext";

const filters = ["全部", "寻找中", "等待认领", "已认领"];

export default function LostFoundPage() {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [search, setSearch] = useState("");
  const [showChoice, setShowChoice] = useState(false);
  const [publishType, setPublishType] = useState<"lost" | "found" | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isLoggedIn } = useAuth();
  const allItems = useItems();
  const lostFoundItems = allItems.filter(
    (item) => item.type === "lost" || item.type === "found"
  );

  const filteredItems = lostFoundItems.filter((item) => {
    const matchesFilter = activeFilter === "全部" || item.status === activeFilter;
    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  function handleFabClick() {
    if (isLoggedIn) {
      setShowChoice(true);
    } else {
      setShowLoginPrompt(true);
    }
  }

  return (
    <div className="min-h-screen">
      {/* 顶部标题 */}
      <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-40"
        style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)" }}>
        <h1 className="text-lg font-bold text-gray-800 mb-3">失物招领</h1>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="搜索物品、地点..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-orange-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 transition-all duration-200 placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* 状态筛选标签 */}
      <div className="px-4 py-3 flex gap-2 bg-white border-b border-orange-50">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeFilter === filter
                ? "bg-gradient-primary text-white shadow-warm"
                : "bg-orange-50 text-gray-600 hover:bg-orange-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 失物招领卡片流 */}
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
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-400 text-sm">暂无相关信息</p>
          {search.trim() && (
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-orange-500 text-xs font-medium"
            >
              清除搜索
            </button>
          )}
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

      {/* 类型选择底部弹出（仅登录后） */}
      {showChoice && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" style={{ backdropFilter: "blur(4px)" }} onClick={() => setShowChoice(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[28px] z-50 py-2 animate-slide-up">
            <div className="flex justify-center pt-2 pb-2">
              <div className="w-10 h-1 bg-orange-200 rounded-full" />
            </div>
            <p className="text-center text-sm font-medium text-gray-600 py-2">选择发布类型</p>
            <button
              onClick={() => { setPublishType("lost"); setShowChoice(false); }}
              className="w-full py-3.5 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 transition border-t border-orange-50 flex items-center justify-center gap-2"
            >
              <span className="text-lg">🔍</span>
              寻物启事（我丢了东西）
            </button>
            <button
              onClick={() => { setPublishType("found"); setShowChoice(false); }}
              className="w-full py-3.5 text-center text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition border-t border-orange-50 flex items-center justify-center gap-2"
            >
              <span className="text-lg">📦</span>
              拾到通知（我捡到东西）
            </button>
            <button
              onClick={() => setShowChoice(false)}
              className="w-full py-3 text-center text-sm text-gray-400 hover:bg-gray-50 transition border-t border-orange-50"
            >
              取消
            </button>
          </div>
        </>
      )}

      {/* 发布表单弹窗 */}
      {publishType && (
        <PublishModal
          open={!!publishType}
          onClose={() => setPublishType(null)}
          type={publishType}
        />
      )}

      {/* 登录提醒弹窗（未登录时） */}
      <LoginPromptModal open={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
