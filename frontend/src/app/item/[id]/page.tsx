"use client";

import Link from "next/link";
import { getItemById } from "@/data/items";
import { useFavorites, toggleFavorite } from "@/data/favorites";

export default function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const item = getItemById(Number(id));
  const favIds = useFavorites();
  const itemId = Number(id);
  const isFav = favIds.includes(itemId);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm mb-4">物品不存在或已被删除</p>
        <Link href="/" className="text-orange-500 text-sm font-medium">返回首页</Link>
      </div>
    );
  }

  const isMarket = item.type === "market";
  const typeLabel = item.type === "lost" ? "寻物启事" : item.type === "found" ? "拾到通知" : "二手出售";
  const typeBg = item.type === "lost"
    ? "bg-orange-50 text-orange-600 border border-orange-200"
    : item.type === "found"
    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
    : "bg-blue-50 text-blue-600 border border-blue-200";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link href="javascript:void(0)" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition"
          onClick={() => typeof window !== 'undefined' && window.history.back()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-sm font-semibold text-gray-800 truncate flex-1">物品详情</h1>
        <button
          onClick={() => toggleFavorite(itemId)}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-200 active:scale-90 hover:bg-orange-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={isFav ? "#f59e0b" : "none"}
            stroke={isFav ? "#f59e0b" : "#9ca3af"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </header>

      {/* 图片区域 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 relative overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            {item.type === "market" ? "🛍️" : item.type === "lost" ? "🔍" : "📦"}
          </div>
        )}
        {/* 渐变遮罩（让标签更清晰） */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        {/* 类型标签 */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${typeBg}`}>
          {typeLabel}
        </span>
        {/* 状态标签 */}
        {item.status && (
          <span className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full text-white shadow-sm backdrop-blur-sm ${
            item.status === "已认领"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : "bg-gradient-to-r from-orange-400 to-amber-400"
          }`}>
            {item.status}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="bg-white px-5 py-5 -mt-3 rounded-t-3xl relative z-10 animate-slide-up">
        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-800 leading-tight">{item.title}</h2>

        {/* 价格 (二手商品) */}
        {isMarket && item.price !== undefined && (
          <p className="text-3xl font-extrabold text-gradient mt-3">¥{item.price}</p>
        )}

        {/* 信息标签 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {item.category && (
            <span className="text-xs px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg font-medium border border-orange-100">{item.category}</span>
          )}
          {item.location && (
            <span className="text-xs px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg font-medium border border-orange-100 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {item.location}
            </span>
          )}
          <span className="text-xs px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg font-medium border border-orange-100 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {item.date}
          </span>
        </div>

        {/* 详细描述 */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <div className="w-1 h-4 bg-gradient-primary rounded-full" />
            详细描述
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.detail}</p>
        </div>

        {/* 联系方式 */}
        {item.contact && (
          <div className="mt-5 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
            <h3 className="text-sm font-bold text-orange-700 mb-1 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              联系方式
            </h3>
            <p className="text-sm text-orange-600 font-medium">{item.contact}</p>
          </div>
        )}

        {/* 底部操作按钮 */}
        <div className="mt-7 flex gap-3">
          {isMarket ? (
            <>
              <button className="flex-1 py-3.5 bg-gradient-primary text-white rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]">
                我想要
              </button>
              <button className="flex-1 py-3.5 bg-orange-50 text-orange-600 rounded-2xl text-sm font-semibold border border-orange-200 hover:bg-orange-100 transition-all duration-200 active:scale-[0.98]">
                私信卖家
              </button>
            </>
          ) : item.type === "lost" ? (
            <button className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]">
              我有线索
            </button>
          ) : (
            <button className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]">
              这是我的物品
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
