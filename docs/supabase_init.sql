-- Fiund 校园物品流转平台 - Supabase 数据库初始化脚本
-- 使用方法：在 Supabase Dashboard → SQL Editor 中执行

-- ═══════════════════════════════════════════════
-- 1. 物品表（二手交易 + 失物招领）
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS items (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  description TEXT,
  price      NUMERIC,
  image      TEXT,
  type       TEXT NOT NULL CHECK (type IN ('market', 'lost', 'found')),
  status     TEXT DEFAULT '',
  date       TEXT DEFAULT '刚刚',
  location   TEXT,
  category   TEXT,
  contact    TEXT,
  detail     TEXT DEFAULT '',
  user_id    UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 2. 会话表（私信对话）
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS conversations (
  id            BIGSERIAL PRIMARY KEY,
  participants  TEXT[] NOT NULL DEFAULT '{}',
  last_message  TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 3. 消息表（私信消息）
-- ═══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id              BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       TEXT NOT NULL,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- 4. 行级安全策略（RLS）
-- ═══════════════════════════════════════════════
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 物品：所有人可读，登录用户可写
CREATE POLICY "items_select_all" ON items FOR SELECT USING (true);
CREATE POLICY "items_insert_auth" ON items FOR INSERT WITH CHECK (true);
CREATE POLICY "items_update_auth" ON items FOR UPDATE USING (true);
CREATE POLICY "items_delete_auth" ON items FOR DELETE USING (true);

-- 会话：所有人可读
CREATE POLICY "conv_select_all" ON conversations FOR SELECT USING (true);
CREATE POLICY "conv_insert_all" ON conversations FOR INSERT WITH CHECK (true);

-- 消息：所有人可读可写
CREATE POLICY "msg_select_all" ON messages FOR SELECT USING (true);
CREATE POLICY "msg_insert_all" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "msg_update_all" ON messages FOR UPDATE USING (true);

-- ═══════════════════════════════════════════════
-- 5. 插入示例数据（可选，与前端静态数据对应）
-- ═══════════════════════════════════════════════
INSERT INTO items (title, description, price, type, date, category, contact, detail) VALUES
('二手 iPad Air 4', '95新，配件齐全，可面交', 1800, 'market', '2小时前', '数码', '微信: ipad_seller_2026', 'iPad Air 4 64GB 天蓝色，2024年9月购入。屏幕无划痕，电池健康度96%。'),
('高等数学教材（第七版）', '有少量笔记标注', 25, 'market', '3小时前', '教材', 'QQ: 123456789', '同济大学出版社《高等数学》第七版上下册合售。'),
('寻找丢失的校园卡', '蓝色卡套，内有校园一卡通', NULL, 'lost', '今天', NULL, '电话: 137xxxx9012', '今天下午在图书馆三楼自习室遗忘了一张校园卡。')
ON CONFLICT DO NOTHING;
