"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/data/chats";
import { useItems } from "@/data/items";
import { useFavorites } from "@/data/favorites";
import { useHistory } from "@/data/history";

/* 功能菜单项 */
const menuItems = [
  { label: "我的发布", icon: "📦", desc: "查看你发布的物品", href: "/my-items" },
  { label: "我的收藏", icon: "⭐", desc: "收藏感兴趣的物品", href: "/favorites" },
  { label: "浏览记录", icon: "👁️", desc: "最近看过的物品",   href: "/history" },
];

export default function ProfilePage() {
  const { isLoggedIn, username, avatar, login, logout, setUsername, setAvatar } = useAuth();
  const conversations = useConversations();
  const allItems = useItems();
  const favIds = useFavorites();
  const historyItems = useHistory();

  const [showEditName, setShowEditName] = useState(false);
  const [editName, setEditName] = useState("");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const myItemsCount = allItems.filter((item) => item.id > 1000000).length;
  const favCount = favIds.length;
  const historyCount = historyItems.length;

  function handleAvatarFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("图片大小建议不超过 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleAvatarFile(file);
    setShowAvatarMenu(false);
  }

  function handleRemoveAvatar() {
    setAvatar(null);
    setShowAvatarMenu(false);
  }

  function handleSaveName() {
    const name = editName.trim();
    if (name) {
      setUsername(name);
    }
    setShowEditName(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ 顶部个人信息区 ═══ */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-5 pt-6 pb-10">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="relative shrink-0">
            <button
              onClick={() => { if (isLoggedIn) setShowAvatarMenu(!showAvatarMenu); }}
              className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-white/40 shadow-lg overflow-hidden hover:ring-white/60 transition"
            >
              {avatar ? (
                <img src={avatar} alt="头像" className="w-full h-full object-cover" />
              ) : isLoggedIn ? (
                <span>{username.charAt(0).toUpperCase()}</span>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>
            {/* 头像编辑小图标 */}
            {isLoggedIn && (
              <button
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            )}

            {/* 头像操作菜单 */}
            {showAvatarMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-orange-100 py-1 z-50 min-w-[130px] animate-scale-in">
                  <button
                    onClick={() => {
                      avatarInputRef.current?.click();
                      setShowAvatarMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 transition flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    {avatar ? "更换头像" : "上传头像"}
                  </button>
                  {avatar && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      移除头像
                    </button>
                  )}
                </div>
              </>
            )}

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* 用户名 + 状态 */}
          <div className="flex-1 min-w-0">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white truncate">{username}</h2>
                  <button
                    onClick={() => { setEditName(username); setShowEditName(true); }}
                    className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition shrink-0"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </div>
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
              <p className="text-xl font-bold text-white">{myItemsCount}</p>
              <p className="text-xs text-orange-100">发布</p>
            </div>
            <div className="w-px bg-white/25" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{favCount}</p>
              <p className="text-xs text-orange-100">收藏</p>
            </div>
            <div className="w-px bg-white/25" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{historyCount}</p>
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

      {/* ═══ 修改用户名弹窗 ═══ */}
      {showEditName && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setShowEditName(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-scale-in">
              <h3 className="text-base font-bold text-gray-800 mb-4">修改昵称</h3>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 bg-orange-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 transition-all duration-200"
                placeholder="请输入新昵称"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowEditName(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveName}
                  disabled={!editName.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                    !editName.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-primary shadow-warm"
                  }`}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
