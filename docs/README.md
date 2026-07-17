# Fiund - 校园物品流转平台

## 项目简介

Fiund 是一个面向高校校园的全栈 Web 应用，旨在为师生提供一个便捷的物品流转平台。项目涵盖**二手物品交易**和**失物招领**两大核心场景，并通过**私信系统**支持买卖双方直接沟通。所有用户数据（收藏、想要、浏览记录、私信）均按账号隔离，发布物品全局可见。

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | Next.js 14 (App Router) + TypeScript | 移动端优先的响应式 UI（max-width: 480px） |
| 样式 | Tailwind CSS 3 | 原子化 CSS，橙色暖色调主题 |
| 状态管理 | React Context + localStorage | 全局登录态 + 客户端数据持久化 |
| 后端 | Python Flask | 单文件 RESTful API |
| 数据库 | SQLite | 轻量本地存储（database.db） |

## 目录结构

```
fiund/
├── frontend/                          # Next.js 前端
│   ├── src/
│   │   ├── app/                       # App Router 路由页面
│   │   │   ├── page.tsx                    # 首页（混合卡片流 + 搜索）
│   │   │   ├── market/page.tsx             # 二手交易（搜索 + 价格筛选）
│   │   │   ├── lost-found/page.tsx         # 失物招领（状态筛选）
│   │   │   ├── item/[id]/page.tsx          # 物品详情（动态路由）
│   │   │   ├── messages/page.tsx           # 个人中心（登录/注册/菜单）
│   │   │   ├── chat/[id]/page.tsx          # 私信聊天（双向消息）
│   │   │   ├── my-items/page.tsx           # 我的发布
│   │   │   ├── favorites/page.tsx          # 我的收藏
│   │   │   ├── wants/page.tsx              # 我想要
│   │   │   ├── history/page.tsx            # 浏览记录
│   │   │   └── layout.tsx                  # 根布局（TabBar + AuthProvider）
│   │   ├── components/                # 通用组件
│   │   │   ├── TabBar.tsx                  # 底部导航栏
│   │   │   ├── ItemCard.tsx                # 物品卡片
│   │   │   ├── PublishModal.tsx            # 发布表单底部抽屉
│   │   │   └── LoginPromptModal.tsx        # 登录/注册弹窗
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx             # 全局认证 Context（邮箱+密码）
│   │   └── data/                      # 客户端数据层
│   │       ├── items.ts                    # 物品（全局共享，含 owner 字段）
│   │       ├── favorites.ts                # 收藏（按用户隔离）
│   │       ├── wants.ts                    # 想要（按用户隔离）
│   │       ├── history.ts                  # 浏览记录（按用户隔离）
│   │       └── chats.ts                    # 私信（会话按用户隔离，消息按双方共享）
│   ├── package.json
│   ├── tailwind.config.ts
│   └── postcss.config.mjs
│
├── backend/                       # Flask 后端
│   ├── app.py                     # 单文件应用（SQLite + REST API）
│   ├── database.db                # SQLite 数据库文件
│   └── requirements.txt           # Python 依赖
│
└── docs/                          # 实训文档
    ├── README.md                  # 本文档
    ├── API.md                     # 后端 API 接口文档
    ├── prompt_log.md              # AI 工具运用日志
    └── supabase_init.sql          # 早期 Supabase 数据库脚本（已弃用）
```

## 本地启动

### 1. 前端

```bash
cd frontend
npm install
npm run dev
# 浏览器打开 http://localhost:3000
```

### 2. 后端

```bash
cd backend

# 创建虚拟环境（推荐）
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py
# 默认运行在 http://localhost:5000
# 首次启动自动建表并填充示例数据
```

## 核心功能

1. **首页** — 二手商品与失物招领信息的混合卡片流，支持关键词搜索
2. **二手交易** — 商品列表，支持搜索与价格分类筛选，可发布和标记"想要"
3. **失物招领** — 寻找中/已认领状态卡片流，支持状态筛选，可发布寻物/拾到信息
4. **物品详情** — 大图展示、价格/分类/地点/时间标签、详细描述、联系方式、留言功能
5. **发布物品** — 右下角浮动按钮，根据页面类型自动切换表单字段，需登录
6. **收藏/想要** — 详情页一键收藏或标记想要，独立页面查看列表
7. **我的发布** — 查看和管理自己发布的物品，支持下架
8. **浏览记录** — 自动记录浏览过的物品
9. **个人中心** — 登录/注册、头像更换、个人信息展示
10. **私信聊天** — 双向消息系统，消息按聊天双方共享存储，支持从物品详情页直接私信发布者

## 数据架构

项目采用**客户端 localStorage + 服务端 SQLite** 的混合数据架构：

**客户端（localStorage）：**
- 物品数据全局共享（`fiund_items`），所有用户看到相同的物品列表
- 收藏、想要、浏览记录按用户隔离（`fiund_favorites_{username}` 等）
- 会话列表按用户隔离（`fiund_chats_{username}`）
- 聊天消息按双方共享（`fiund_msg_{userA}__{userB}`，按字母序排列）
- 用户账号信息（`fiund_users`）和头像（`fiund_avatars`）

**服务端（SQLite）：**
- `items` 表：物品信息持久化存储
- 自动建表 + 示例数据填充

## API 接口

后端提供以下 RESTful 接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/items` | 获取物品列表 |
| GET | `/api/items/<id>` | 获取物品详情 |
| POST | `/api/items` | 发布物品 |
| DELETE | `/api/items/<id>` | 删除物品 |

请求示例：

```bash
# 健康检查
curl http://localhost:5000/api/health

# 获取所有物品
curl http://localhost:5000/api/items

# 发布物品
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title": "二手教材", "description": "九成新", "price": 15, "type": "market"}'
```

详细接口文档（含请求/响应格式、参数说明、数据库表结构）请参阅 [API.md](./API.md)。

## 认证系统

采用邮箱 + 密码的注册登录方式，登录状态通过 React Context 全局共享：

- 登录/注册通过 `LoginPromptModal` 弹窗完成
- 登录状态持久化到 localStorage，刷新页面后保持
- 未登录时发布物品、私信等操作会弹出登录提醒
- 不同账号的收藏、想要、浏览记录、私信完全隔离
