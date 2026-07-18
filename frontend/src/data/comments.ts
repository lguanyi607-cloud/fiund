import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════
   留言/线索数据 —— localStorage 持久化（按物品 ID 存储）
   所有用户共享同一物品的留言列表
   ══════════════════════════════════════════════════════════ */

export interface Comment {
  author: string;
  text: string;
  time: string;
}

function getKey(itemId: number) {
  return `fiund_comments_${itemId}`;
}

function loadComments(itemId: number): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getKey(itemId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveComments(itemId: number, comments: Comment[]) {
  localStorage.setItem(getKey(itemId), JSON.stringify(comments));
}

/** 添加一条留言到指定物品 */
export function addComment(itemId: number, comment: Comment): Comment[] {
  const comments = loadComments(itemId);
  const updated = [comment, ...comments];
  saveComments(itemId, updated);
  return updated;
}

/** React Hook：监听某物品的留言列表，返回 [comments, addFn] */
export function useComments(itemId: number): [Comment[], (c: Comment) => void] {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setComments(loadComments(itemId));
  }, [itemId]);

  const add = (c: Comment) => {
    const updated = addComment(itemId, c);
    setComments(updated);
  };

  return [comments, add];
}
