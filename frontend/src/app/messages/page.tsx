"use client";

import { useAuth } from "@/contexts/AuthContext";

/* 示例私信数据 */
const conversations = [
  { id: 1, name: "张三", lastMessage: "iPad 还在吗？想看看实物", time: "刚刚",   unread: 2, avatar: "张" },
  { id: 2, name: "李四", lastMessage: "校园卡找到了，谢谢你！",   time: "1小时前", unread: 0, avatar: "李" },
  { id: 3, name: "王五", lastMessage: "教材可以便宜点吗？",       time: "昨天",   unread: 1, avatar: "王" },
  { id: 4, name: "赵六", lastMessage: "钥匙是你的吗？来宿舍取",   time: "2天前",  unread: 0, avatar: "赵" },
];

/* 功能菜单项 */
const menuItems = [
  { label: "我的发布", icon: "📦", desc: "查看你发布的物品" },
  { label: "我的收藏", icon: "⭐", desc: "收藏感兴趣的物品" },
  { label: "浏览记录", icon: "👁️", desc: "最近看过的物品" },
];

export default function ProfilePage() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══ 顶部个人信息区 ═══ */}
      <div className="bg-blue-600 px-5 pt-6 pb-8">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-2 ring-white/30">
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
                <p className="text-xs text-blue-100 mt-0.5">已登录 · student@example.com</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">未登录</h2>
                <button
                  onClick={login}
                  className="mt-1 px-4 py-1.5 bg-white text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-50 transition active:scale-95"
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
              className="text-xs text-blue-200 hover:text-white transition px-2 py-1"
            >
              退出
            </button>
          )}
        </div>

        {/* 统计栏（已登录显示） */}
        {isLoggedIn && (
          <div className="flex justify-around mt-5 bg-white/10 rounded-xl py-3">
            <div className="text-center">
              <p className="text-lg font-bold text-white">3</p>
              <p className="text-xs text-blue-100">发布</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">5</p>
              <p className="text-xs text-blue-100">收藏</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-lg font-bold text-white">12</p>
              <p className="text-xs text-blue-100">浏览</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 功能菜单 ═══ */}
      <div className="mx-4 -mt-4 bg-white rounded-xl shadow-sm overflow-hidden">
        {menuItems.map((item, idx) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition cursor-pointer ${
              idx < menuItems.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ 私信列表 ═══ */}
      {isLoggedIn && (
        <div className="mt-4 mx-4">
          <h3 className="text-sm font-semibold text-gray-700 px-1 mb-2">私信消息</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-gray-800">{conv.name}</span>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {conv.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ 未登录提示 ═══ */}
      {!isLoggedIn && (
        <div className="mt-8 mx-8 text-center">
          <p className="text-sm text-gray-400 mb-4">登录后即可使用私信、发布、收藏等功能</p>
          <button
            onClick={login}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition active:scale-[0.98]"
          >
            立即登录
          </button>
          <p className="text-xs text-gray-300 mt-3">后续将接入 Supabase Auth 实现真实登录</p>
        </div>
      )}

      {/* 底部间距 */}
      <div className="h-8" />
    </div>
  );
}
