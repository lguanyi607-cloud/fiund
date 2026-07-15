"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/data/chats";

/* 功能菜单项 */
const menuItems = [
  { label: "我的发布", icon: "📦", desc: "查看你发布的物品", href: "/my-items" },
  { label: "我的收藏", icon: "⭐", desc: "收藏感兴趣的物品", href: "/favorites" },
  { label: "浏览记录", icon: "👁️", desc: "最近看过的物品",   href: "/history" },
];

export default function ProfilePage() {
  const { isLoggedIn, login, logout } = useAuth();
  const conversations = useConversations();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ 顶部个人信息区 ═══ */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-5 pt-6 pb-10">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-2 ring-white/40 shadow-lg">
            {isLoggedIn ? "U" : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          {/* 用户名 + 状态 */}
          <div className="flex-1 min-w-0">
            {isLoggedIn ? (
              <>
                <h2 className="text-lg font-bold text-white">校园用户</h2>
                <p className="text-xs text-orange-100 mt-0.5">已登录 · student@example.com</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">未登录</h2>
                <button
                  onClick={login}
                  className="mt-1.5 px-4 py-1.5 bg-white text-orange-600 rounded-full text-xs font-semibold hover:bg-orange-50 transition active:scale-95 shadow-sm"
                >
                  点击登录
                </button>
              </>
            )}
          </div>

          {/* 退出按钮 */}
          {isLoggedIn && (
            <button
              onClick={logout}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {/* 统计栏（已登录显示） */}
        {isLoggedIn && (
          <div className="flex justify-around mt-5 bg-white/15 rounded-2xl py-3.5" style={{ backdropFilter: "blur(10px)" }}>
            <div className="text-center">
              <p className="text-xl font-bold text-white">3</p>
              <p className="text-xs text-orange-100">发布</p>
            </div>
            <div className="w-px bg-white/25" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">5</p>
              <p className="text-xs text-orange-100">收藏</p>
            </div>
            <div className="w-px bg-white/25" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">12</p>
              <p className="text-xs text-orange-100">浏览</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 功能菜单 ═══ */}
      <div className="mx-4 -mt-5 bg-white rounded-2xl shadow-card overflow-hidden">
        {menuItems.map((item, idx) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-4 hover:bg-orange-50/50 transition cursor-pointer group ${
              idx < menuItems.length - 1 ? "border-b border-orange-50" : ""
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>

      {/* ═══ 私信列表 ═══ */}
      {isLoggedIn && (
        <div className="mt-5 mx-4">
          <h3 className="text-sm font-bold text-gray-700 px-1 mb-2.5">私信消息</h3>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-orange-50">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-orange-50/50 transition cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 font-semibold text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-800">{conv.name}</span>
                    <span className="text-[10px] text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-semibold shadow-sm">
                    {conv.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══ 未登录提示 ═══ */}
      {!isLoggedIn && (
        <div className="mt-8 mx-6 text-center">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-4">登录后即可使用私信、发布、收藏等功能</p>
            <button
              onClick={login}
              className="w-full py-3.5 bg-gradient-primary text-white rounded-2xl font-semibold text-sm shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98]"
            >
              立即登录
            </button>
            <p className="text-xs text-gray-300 mt-3">后续将接入 Supabase Auth 实现真实登录</p>
          </div>
        </div>
      )}

      {/* 底部间距 */}
      <div className="h-8" />
    </div>
  );
}
