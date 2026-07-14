"use client";

import { useState } from "react";

/* 示例私信数据 */
const conversations = [
  { id: 1, name: "张三", lastMessage: "iPad 还在吗？想看看实物", time: "刚刚",   unread: 2, avatar: "张" },
  { id: 2, name: "李四", lastMessage: "校园卡找到了，谢谢你！",   time: "1小时前", unread: 0, avatar: "李" },
  { id: 3, name: "王五", lastMessage: "教材可以便宜点吗？",       time: "昨天",   unread: 1, avatar: "王" },
  { id: 4, name: "赵六", lastMessage: "钥匙是你的吗？来宿舍取",   time: "2天前",  unread: 0, avatar: "赵" },
];

export default function MessagesPage() {
  /* 登录状态 —— 后续接入 Supabase Auth */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---- 未登录：登录拦截页 ---- */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        {/* 锁图标 */}
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">登录后查看私信</h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          登录账号后即可使用私信功能，<br />
          与卖家或拾到物品的人直接沟通。
        </p>

        <button
          onClick={() => setIsLoggedIn(true)}
          className="w-full max-w-xs py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition active:scale-[0.98]"
        >
          立即登录
        </button>

        <p className="text-xs text-gray-400 mt-4">
          后续将接入 Supabase Auth 实现真实登录
        </p>
      </div>
    );
  }

  /* ---- 已登录：私信聊天列表 ---- */
  return (
    <div className="min-h-screen">
      {/* 顶部标题 */}
      <header className="bg-white px-4 py-3 sticky top-0 z-40 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">私信</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-xs text-gray-400 hover:text-red-500 transition"
        >
          退出
        </button>
      </header>

      {/* 聊天会话列表 */}
      <div className="divide-y divide-gray-50">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            {/* 头像 */}
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shrink-0">
              {conv.avatar}
            </div>

            {/* 消息内容 */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-gray-800">{conv.name}</span>
                <span className="text-xs text-gray-400">{conv.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
            </div>

            {/* 未读角标 */}
            {conv.unread > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {conv.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      {conversations.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">暂无私信消息</p>
      )}
    </div>
  );
}
