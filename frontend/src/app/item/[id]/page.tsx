"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getItemById, removeDynamicItem } from "@/data/items";
import { useFavorites, toggleFavorite } from "@/data/favorites";
import { useWants, toggleWant } from "@/data/wants";
import { recordView } from "@/data/history";
import { useAuth } from "@/contexts/AuthContext";

export default function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const item = getItemById(Number(id));
  const { username, isLoggedIn } = useAuth();
  const favIds = useFavorites(isLoggedIn ? username : undefined);
  const wantIds = useWants(isLoggedIn ? username : undefined);
  const itemId = Number(id);
  const isFav = favIds.includes(itemId);
  const isWanted = wantIds.includes(itemId);

  /* 留言功能 */
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ author: string; text: string; time: string }[]>([]);

  // 记录浏览历史
  useEffect(() => {
    if (item) {
      recordView({
        itemId: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        type: item.type,
        price: item.price,
      });
    }
  }, [id]);

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
  const isMyItem = item.id > 1000; // 动态物品（用户自己发布的）id = Date.now()，远大于静态 id
  const typeLabel = item.type === "lost" ? "寻物启事" : item.type === "found" ? "拾到通知" : "二手出售";
  const typeBg = item.type === "lost"
    ? "bg-orange-50 text-orange-600 border border-orange-200"
    : item.type === "found"
    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
    : "bg-blue-50 text-blue-600 border border-blue-200";

  function handleSubmitComment() {
    const text = commentText.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setComments((prev) => [{ author: username || "匿名用户", text, time }, ...prev]);
    setCommentText("");
    setShowCommentInput(false);
  }

  function handleDelist() {
    if (confirm("确定要下架这件物品吗？")) {
      removeDynamicItem(itemId);
      router.push("/my-items");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40 flex items-center gap-3"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${typeBg}`}>
          {typeLabel}
        </span>
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
        <h2 className="text-xl font-bold text-gray-800 leading-tight">{item.title}</h2>

        {isMarket && item.price !== undefined && (
          <p className="text-3xl font-extrabold text-gradient mt-3">¥{item.price}</p>
        )}

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

        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
            <div className="w-1 h-4 bg-gradient-primary rounded-full" />
            详细描述
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{item.detail}</p>
        </div>

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

        {/* 留言列表 */}
        {comments.length > 0 && (
          <div className="mt-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <div className="w-1 h-4 bg-gradient-primary rounded-full" />
              留言 ({comments.length})
            </h3>
            {comments.map((c, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">{c.author}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-sm text-gray-600">{c.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* 留言输入框 */}
        {showCommentInput && !isMyItem && (
          <div className="mt-5 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 animate-scale-in">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 resize-none transition-all"
              placeholder={item.type === "lost" ? "说说你的线索..." : "留言认领你的物品..."}
              autoFocus
            />
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[10px] text-gray-400">{commentText.length}/200</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowCommentInput(false); setCommentText(""); }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all ${
                    !commentText.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-primary shadow-warm"
                  }`}
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-7 flex gap-3">
          {isMyItem ? (
            <button
              onClick={handleDelist}
              className="flex-1 py-3.5 bg-red-50 text-red-500 rounded-2xl text-sm font-semibold border border-red-200 hover:bg-red-100 transition-all duration-200 active:scale-[0.98]"
            >
              下架物品
            </button>
          ) : isMarket ? (
            <>
              <button
                onClick={() => toggleWant(itemId)}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isWanted
                    ? "bg-white text-orange-500 border-2 border-orange-400"
                    : "bg-gradient-primary text-white shadow-warm hover:shadow-warm-lg"
                }`}
              >
                {isWanted ? "✓ 已标记想要" : "我想要"}
              </button>
              <Link href="/chat/1" className="flex-1 py-3.5 bg-orange-50 text-orange-600 rounded-2xl text-sm font-semibold border border-orange-200 hover:bg-orange-100 transition-all duration-200 active:scale-[0.98] text-center">
                私信卖家
              </Link>
            </>
          ) : item.type === "lost" ? (
            <>
              <button
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]"
              >
                我有线索
              </button>
              <Link href="/chat/1" className="flex-1 py-3.5 bg-orange-50 text-orange-600 rounded-2xl text-sm font-semibold border border-orange-200 hover:bg-orange-100 transition-all duration-200 active:scale-[0.98] text-center">
                私信发布者
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-2xl text-sm font-semibold shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]"
              >
                认领留言
              </button>
              <Link href="/chat/1" className="flex-1 py-3.5 bg-orange-50 text-orange-600 rounded-2xl text-sm font-semibold border border-orange-200 hover:bg-orange-100 transition-all duration-200 active:scale-[0.98] text-center">
                私信发布者
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
