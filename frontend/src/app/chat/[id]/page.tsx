"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getConversationById, type Message } from "@/data/chats";

export default function ChatPage({ params }: { params: { id: string } }) {
  const conv = getConversationById(Number(params.id));

  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* 自动滚到底部 */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (!conv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <p className="text-gray-500 text-sm mb-4">会话不存在</p>
        <Link href="/messages" className="text-blue-600 text-sm">返回</Link>
      </div>
    );
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: Date.now(),
      senderId: "me",
      text,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ═══ 顶部导航 ═══ */}
      <header className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
        <Link
          href="/messages"
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        {/* 对方头像 */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
          {conv.avatar}
        </div>

        <h1 className="text-sm font-semibold text-gray-800 flex-1">{conv.name}</h1>
      </header>

      {/* ═══ 消息列表 ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                {/* 头像 */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  isMe ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                }`}>
                  {isMe ? "U" : conv.avatar}
                </div>

                {/* 气泡 */}
                <div>
                  <div className={`px-3 py-2 text-sm leading-relaxed ${
                    isMe
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-0.5 ${isMe ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ 底部输入区 ═══ */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="输入消息..."
          className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 ${
            input.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
