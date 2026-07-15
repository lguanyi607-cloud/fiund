"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useConversation, addMessage, type Message } from "@/data/chats";

export default function ChatPage({ params }: { params: { id: string } }) {
  const convId = Number(params.id);
  const conv = useConversation(convId);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = conv?.messages ?? [];

  /* 自动滚到底部 */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (!conv) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm mb-4">会话不存在</p>
        <Link href="/messages" className="text-orange-500 text-sm font-medium">返回</Link>
      </div>
    );
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    addMessage(convId, text);
    setInput("");
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-orange-50/30 to-gray-50"
      style={{ height: "calc(100vh - 60px)" }}>
      {/* ═══ 顶部导航 ═══ */}
      <header className="bg-white/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 shrink-0"
        style={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)" }}>
        <Link
          href="/messages"
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        {/* 对方头像 */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-600 font-semibold text-sm shrink-0 shadow-sm">
          {conv.avatar}
        </div>

        <h1 className="text-sm font-semibold text-gray-800 flex-1">{conv.name}</h1>
      </header>

      {/* ═══ 消息列表 ═══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ WebkitOverflowScrolling: "touch" }}>
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === "me";
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${Math.min(idx, 10) * 30}ms`, animationFillMode: "both" }}>
              <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                {/* 头像 */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 shadow-sm ${
                  isMe
                    ? "bg-gradient-primary text-white"
                    : "bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600"
                }`}>
                  {isMe ? "U" : conv.avatar}
                </div>

                {/* 气泡 */}
                <div>
                  <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? "bg-gradient-primary text-white rounded-2xl rounded-br-sm shadow-warm"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-card border border-orange-50"
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
      <div className="bg-white border-t border-orange-100 px-4 py-3 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="输入消息..."
          className="flex-1 px-4 py-2.5 bg-orange-50/50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-200 border border-orange-100 transition-all duration-200 placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
            input.trim()
              ? "bg-gradient-primary text-white shadow-warm"
              : "bg-gray-100 text-gray-400"
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
