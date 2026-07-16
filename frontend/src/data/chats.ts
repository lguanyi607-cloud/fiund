import { useState, useEffect } from "react";

export interface Message {
  id: number;
  senderId: string;       // "me" | 对方用户 id
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

/* ══════════════════════════════════════════════════════════
   会话数据 —— localStorage 持久化（完全按用户隔离）
   每个用户有独立的会话数据，未登录不显示任何消息
   ══════════════════════════════════════════════════════════ */

let currentUsername = "";
let conversations: Conversation[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function getKey(username: string) {
  return `fiund_chats_${username}`;
}

/** 新用户初始化默认会话 */
function getDefaultConversations(): Conversation[] {
  return [
    {
      id: 1,
      name: "张三",
      avatar: "张",
      lastMessage: "",
      time: "",
      unread: 0,
      messages: [],
    },
    {
      id: 2,
      name: "李四",
      avatar: "李",
      lastMessage: "",
      time: "",
      unread: 0,
      messages: [],
    },
    {
      id: 3,
      name: "王五",
      avatar: "王",
      lastMessage: "",
      time: "",
      unread: 0,
      messages: [],
    },
    {
      id: 4,
      name: "赵六",
      avatar: "赵",
      lastMessage: "",
      time: "",
      unread: 0,
      messages: [],
    },
  ];
}

function loadConversations(username: string): Conversation[] {
  if (typeof window === "undefined" || !username) return [];
  try {
    const raw = localStorage.getItem(getKey(username));
    if (raw) return JSON.parse(raw);
    // 首次使用，初始化默认会话并保存
    const defaults = getDefaultConversations();
    localStorage.setItem(getKey(username), JSON.stringify(defaults));
    return defaults;
  } catch {
    return [];
  }
}

function saveConversations() {
  if (typeof window !== "undefined" && currentUsername) {
    try {
      localStorage.setItem(getKey(currentUsername), JSON.stringify(conversations));
    } catch {}
  }
}

/** 切换当前用户 */
export function switchChatUser(username: string) {
  currentUsername = username;
  conversations = loadConversations(username);
  notify();
}

/** 获取会话列表 */
export function getConversations(username?: string): Conversation[] {
  const user = username || currentUsername;
  if (!user) return [];
  return loadConversations(user);
}

/** 根据 id 获取会话 */
export function getConversationById(id: number, username?: string): Conversation | undefined {
  return getConversations(username).find((c) => c.id === id);
}

/** 发送消息 */
export function addMessage(conversationId: number, text: string, username?: string): Message {
  const user = username || currentUsername;
  if (!user) return { id: 0, senderId: "me", text: "", time: "" };

  // 确保加载当前用户数据
  if (user !== currentUsername) {
    switchChatUser(user);
  }

  const msg: Message = {
    id: Date.now(),
    senderId: "me",
    text,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  };

  const convIdx = conversations.findIndex((c) => c.id === conversationId);
  if (convIdx >= 0) {
    conversations[convIdx] = {
      ...conversations[convIdx],
      messages: [...conversations[convIdx].messages, msg],
      lastMessage: text,
      time: "刚刚",
    };
  }

  saveConversations();
  notify();
  return msg;
}

/** React Hook —— 获取所有会话列表 */
export function useConversations(username?: string): Conversation[] {
  const [convs, setConvs] = useState<Conversation[]>([]);

  useEffect(() => {
    if (username) {
      switchChatUser(username);
      setConvs(loadConversations(username));
    } else {
      setConvs([]);
    }
    const sub = () => setConvs([...conversations]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [username]);

  return convs;
}

/** React Hook —— 获取单个会话 */
export function useConversation(id: number, username?: string): Conversation | undefined {
  const [conv, setConv] = useState<Conversation | undefined>(undefined);

  useEffect(() => {
    if (username) {
      switchChatUser(username);
      setConv(loadConversations(username).find((c) => c.id === id));
    } else {
      setConv(undefined);
    }
    const sub = () => setConv(conversations.find((c) => c.id === id));
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [id, username]);

  return conv;
}
