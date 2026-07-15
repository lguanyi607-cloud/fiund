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
  const [showChoice, setShowChoice] = useState(false);
  const [publishType, setPublishType] = useState<"lost" | "found" | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isLoggedIn } = useAuth();
  const allItems = useItems();
  const lostFoundItems = allItems.filter(
    (item) => item.type === "lost" || item.type === "found"
  );

  const filteredItems = lostFoundItems.filter((item) => {
    if (activeFilter === "全部") return true;
    return item.status === activeFilter;
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
      <div className="p-4 grid grid-cols-2 gap-3 pb-24">
        {filteredItems.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`}>
            <ItemCard {...item} />
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无相关信息</p>
      )}

      {/* 右下角 FAB 发布按钮 */}
      <button
        onClick={handleFabClick}
        className="fixed bottom-24 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition active:scale-90"
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
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowChoice(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-2xl z-50 py-2">
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <p className="text-center text-sm text-gray-500 py-2">选择发布类型</p>
            <button
              onClick={() => { setPublishType("lost"); setShowChoice(false); }}
              className="w-full py-3 text-center text-sm font-medium text-orange-600 hover:bg-orange-50 transition border-t border-gray-100"
            >
              寻物启事（我丢了东西）
            </button>
            <button
              onClick={() => { setPublishType("found"); setShowChoice(false); }}
              className="w-full py-3 text-center text-sm font-medium text-green-600 hover:bg-green-50 transition border-t border-gray-100"
            >
              拾到通知（我捡到东西）
            </button>
            <button
              onClick={() => setShowChoice(false)}
              className="w-full py-3 text-center text-sm text-gray-400 hover:bg-gray-50 transition border-t border-gray-100"
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
