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
  messages?: Message[];  // 已弃用，消息已迁移到共享存储
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
    { id: 1, name: "张三", avatar: "张", lastMessage: "", time: "", unread: 0 },
    { id: 2, name: "李四", avatar: "李", lastMessage: "", time: "", unread: 0 },
    { id: 3, name: "王五", avatar: "王", lastMessage: "", time: "", unread: 0 },
    { id: 4, name: "赵六", avatar: "赵", lastMessage: "", time: "", unread: 0 },
  ];
}

function loadConversations(username: string): Conversation[] {
  if (typeof window === "undefined" || !username) return [];
  try {
    const raw = localStorage.getItem(getKey(username));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      // 数据格式损坏，重新初始化
      localStorage.removeItem(getKey(username));
    }
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

/** 迁移旧数据 */
function migrateOldData(username: string) {
  if (typeof window === "undefined") return;
  try {
    const newKey = getKey(username);
    if (localStorage.getItem(newKey)) return;

    // 尝试从旧的全局 key 迁移
    const oldRaw = localStorage.getItem("fiund_chats");
    if (oldRaw) {
      const parsed = JSON.parse(oldRaw);
      if (Array.isArray(parsed)) {
        localStorage.setItem(newKey, oldRaw);
      } else if (typeof parsed === "object" && parsed !== null) {
        // 旧格式: Record<number, {messages, lastMessage, time, unread}>
        const defaults = getDefaultConversations();
        for (const conv of defaults) {
          const extra = parsed[conv.id] || parsed[String(conv.id)];
          if (extra && Array.isArray(extra.messages)) {
            conv.messages = extra.messages;
            conv.lastMessage = extra.lastMessage || "";
            conv.time = extra.time || "";
            conv.unread = extra.unread ?? 0;
          }
        }
        localStorage.setItem(newKey, JSON.stringify(defaults));
      }
      localStorage.removeItem("fiund_chats");
    }

    // 尝试从旧的按用户 key 迁移（之前的 per-user 格式）
    const oldUserKey = `fiund_chats_${username}`;
    // 这个 key 和 newKey 相同，已经在上面检查过了
  } catch {}
}

/** 切换当前用户 */
export function switchChatUser(username: string) {
  migrateOldData(username);
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

/** 查找或创建与某人的会话，返回会话 id */
export function findOrCreateConversation(name: string, username?: string): number {
  const user = username || currentUsername;
  if (!user) return 0;

  if (user !== currentUsername) {
    switchChatUser(user);
  }

  // 查找已有会话
  const existing = conversations.find((c) => c.name === name);
  if (existing) return existing.id;

  // 创建新会话
  const newId = conversations.length > 0
    ? Math.max(...conversations.map((c) => c.id)) + 1
    : 1;
  const newConv: Conversation = {
    id: newId,
    name,
    avatar: name.charAt(0),
    lastMessage: "",
    time: "刚刚",
    unread: 0,
  };
  conversations = [...conversations, newConv];
  saveConversations();
  notify();
  return newId;
}

/* ══════════════════════════════════════════════════════════
   共享消息存储 —— 聊天双方都能看到相同的消息记录
   存储 key: fiund_msg_{userA}__{userB}（按字母序排列）
   消息的 senderId 存储实际用户名（非 "me"）
   ══════════════════════════════════════════════════════════ */

function getPairKey(userA: string, userB: string): string {
  const sorted = [userA, userB].sort();
  return `fiund_msg_${sorted[0]}__${sorted[1]}`;
}

function loadSharedMessages(userA: string, userB: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getPairKey(userA, userB));
    if (raw) return JSON.parse(raw);
    return [];
  } catch {
    return [];
  }
}

function saveSharedMessages(userA: string, userB: string, messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getPairKey(userA, userB), JSON.stringify(messages));
  } catch {}
}

/** 获取两人之间的消息列表 */
export function getMessagesBetween(userA: string, userB: string): Message[] {
  return loadSharedMessages(userA, userB);
}

/** 确保接收方的会话列表里有发送者的对话（这样接收方才能看到聊天） */
function ensureRecipientConversation(senderName: string, recipientName: string) {
  if (typeof window === "undefined" || !recipientName) return;
  try {
    const recipientKey = `fiund_chats_${recipientName}`;
    let recipientConvs: Conversation[] = [];
    try {
      const raw = localStorage.getItem(recipientKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) recipientConvs = parsed;
      }
    } catch {}

    // 如果接收方没有和发送者的对话，创建一个
    if (!recipientConvs.find((c) => c.name === senderName)) {
      const newId = recipientConvs.length > 0
        ? Math.max(...recipientConvs.map((c) => c.id)) + 1
        : 1;
      recipientConvs.push({
        id: newId,
        name: senderName,
        avatar: senderName.charAt(0),
        lastMessage: "",
        time: "刚刚",
        unread: 1,
      });
      localStorage.setItem(recipientKey, JSON.stringify(recipientConvs));
    }
  } catch {}
}

/** 发送消息（写入共享存储 + 更新发送者的会话元数据 + 确保接收方有对话） */
export function addMessage(text: string, sender: string, contactName: string): Message {
  if (!sender || !contactName) {
    return { id: 0, senderId: "", text: "", time: "" };
  }

  // 确保加载当前用户数据
  if (sender !== currentUsername) {
    switchChatUser(sender);
  }

  const msg: Message = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderId: sender,
    text,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  };

  // 写入共享消息存储
  const messages = loadSharedMessages(sender, contactName);
  messages.push(msg);
  saveSharedMessages(sender, contactName, messages);

  // 确保接收方的会话列表里有发送者的对话
  ensureRecipientConversation(sender, contactName);

  // 更新发送者的会话列表元数据（lastMessage / time）
  const convIdx = conversations.findIndex((c) => c.name === contactName);
  if (convIdx >= 0) {
    conversations[convIdx] = {
      ...conversations[convIdx],
      lastMessage: text,
      time: "刚刚",
    };
    saveConversations();
  }

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

/** React Hook —— 获取两人之间的共享消息列表 */
export function useMessages(myUsername: string | undefined, contactName: string | undefined): Message[] {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (myUsername && contactName) {
      setMessages(loadSharedMessages(myUsername, contactName));
    } else {
      setMessages([]);
    }
    const sub = () => {
      if (myUsername && contactName) {
        setMessages(loadSharedMessages(myUsername, contactName));
      }
    };
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [myUsername, contactName]);

  return messages;
}
