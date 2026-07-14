"use client";

import Link from "next/link";
import { getItemById } from "@/data/items";

export default function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const item = getItemById(Number(id));

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm mb-4">物品不存在或已被删除</p>
        <Link href="/" className="text-blue-600 text-sm">返回首页</Link>
      </div>
    );
  }

  const isMarket = item.type === "market";
  const typeLabel = item.type === "lost" ? "寻物启事" : item.type === "found" ? "拾到通知" : "二手出售";
  const typeBg = item.type === "lost" ? "bg-orange-50 text-orange-600" : item.type === "found" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100 flex items-center gap-3">
        <Link href="javascript:void(0)" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
          onClick={() => typeof window !== 'undefined' && window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-sm">返回</span>
        </Link>
        <h1 className="text-sm font-medium text-gray-800 truncate flex-1">物品详情</h1>
      </header>

      {/* 图片区域 */}
      <div className="aspect-[4/3] bg-gray-200 relative">
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">
          {item.type === "market" ? "🛍️" : item.type === "lost" ? "🔍" : "📦"}
        </div>
        {/* 类型标签 */}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${typeBg}`}>
          {typeLabel}
        </span>
        {/* 状态标签 */}
        {item.status && (
          <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full text-white ${
            item.status === "已认领" ? "bg-green-500" : "bg-orange-400"
          }`}>
            {item.status}
          </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="bg-white px-4 py-4 -mt-2 rounded-t-2xl relative z-10">
        {/* 标题 */}
        <h2 className="text-lg font-bold text-gray-800 leading-tight">{item.title}</h2>

        {/* 价格 (二手商品) */}
        {isMarket && item.price !== undefined && (
          <p className="text-2xl font-bold text-blue-600 mt-2">¥{item.price}</p>
        )}

        {/* 信息标签 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {item.category && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{item.category}</span>
          )}
          {item.location && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {item.location}
            </span>
          )}
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {item.date}
          </span>
        </div>

        {/* 详细描述 */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">详细描述</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.detail}</p>
        </div>

        {/* 联系方式 */}
        {item.contact && (
          <div className="mt-5 p-3 bg-blue-50 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-700 mb-1">联系方式</h3>
            <p className="text-sm text-blue-600">{item.contact}</p>
          </div>
        )}

        {/* 底部操作按钮 */}
        <div className="mt-6 flex gap-3">
          {isMarket ? (
            <>
              <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition active:scale-[0.98]">
                我想要
              </button>
              <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition active:scale-[0.98]">
                私信卖家
              </button>
            </>
          ) : item.type === "lost" ? (
            <button className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition active:scale-[0.98]">
              我有线索
            </button>
          ) : (
            <button className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition active:scale-[0.98]">
              这是我的物品
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
