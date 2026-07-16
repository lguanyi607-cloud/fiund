/**
 * Fiund 后端 API 服务层
 * 封装与 Flask 后端的 HTTP 通信
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── 通用请求 ─── */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

/* ─── 物品接口 ─── */
export const itemsApi = {
  /** 获取物品列表（支持按类型、关键词、分类筛选） */
  list(params?: { type?: string; search?: string; category?: string }) {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    const qs = query.toString();
    return request<{ items: any[] }>(`/items/${qs ? `?${qs}` : ""}`);
  },

  /** 获取单个物品详情 */
  getById(id: number) {
    return request<{ item: any }>(`/items/${id}`);
  },

  /** 发布物品 */
  create(item: Record<string, any>) {
    return request<{ message: string; item: any }>("/items/", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  /** 更新物品 */
  update(id: number, data: Record<string, any>) {
    return request<{ message: string; item: any }>(`/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /** 删除/下架物品 */
  remove(id: number) {
    return request<{ message: string }>(`/items/${id}`, {
      method: "DELETE",
    });
  },
};

/* ─── 认证接口 ─── */
export const authApi = {
  register(email: string, password: string) {
    return request<{ message: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  login(email: string, password: string) {
    return request<{ message: string; access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout() {
    return request<{ message: string }>("/auth/logout", { method: "POST" });
  },
};

/* ─── 消息接口 ─── */
export const messagesApi = {
  getConversations() {
    return request<{ conversations: any[] }>("/messages/conversations");
  },
  getMessages(conversationId: number) {
    return request<{ messages: any[] }>(`/messages/${conversationId}`);
  },
  send(conversationId: number, senderId: string, content: string) {
    return request<{ message: string; data: any }>("/messages/", {
      method: "POST",
      body: JSON.stringify({ conversation_id: conversationId, sender_id: senderId, content }),
    });
  },
  markRead(conversationId: number, userId: string) {
    return request<{ message: string }>(`/messages/read/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },
};

/* ─── 健康检查 ─── */
export function healthCheck() {
  return request<{ status: string; version: string }>("/health");
}
