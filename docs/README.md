# Fiund - 校园物品流转平台

## 项目简介

Fiund 是一个面向高校校园的全栈 Web 应用，旨在为师生提供一个便捷的物品流转平台。项目涵盖**二手物品交易**和**失物招领**两大核心场景，并通过**私信系统**支持买卖双方直接沟通。

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端 | Next.js 14 (App Router) + TypeScript | 移动端优先的响应式 UI |
| 样式 | Tailwind CSS 3 | 原子化 CSS，快速构建界面 |
| 后端 | Python Flask + Blueprint | RESTful API 模块化架构 |
| 数据库 | Supabase (PostgreSQL) | 实时数据库 + 行级安全策略 |
| 认证 | Supabase Auth | 邮箱/密码注册登录 |

## 目录结构

```
fiund/
├── frontend/               # Next.js 前端
│   ├── src/
│   │   ├── app/            # App Router 路由
│   │   │   ├── page.tsx          # 首页（混合卡片流）
│   │   │   ├── market/           # 二手交易
│   │   │   ├── lost-found/       # 失物招领
│   │   │   └── messages/         # 私信（含登录拦截）
│   │   └── components/     # 通用组件
│   │       ├── TabBar.tsx        # 底部导航栏
│   │       └── ItemCard.tsx      # 物品卡片
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.local          # Supabase 密钥（不提交到 Git）
│
├── backend/                # Flask 后端
│   ├── app.py              # 应用入口
│   ├── api/                # Blueprint 业务模块
│   │   ├── auth.py               # 认证（注册/登录/登出）
│   │   ├── items.py              # 物品 CRUD
│   │   └── messages.py           # 私信系统
│   ├── requirements.txt
│   └── .env.example        # 环境变量模板
│
└── docs/                   # 实训文档
    ├── README.md           # 本文档
    └── prompt_log.md       # AI 工具运用日志
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
# source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 Supabase 密钥

# 启动服务
python app.py
# 默认运行在 http://localhost:5000
```

### 3. 环境变量

前端 `frontend/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase 匿名密钥
```

后端 `backend/.env`:
```
SUPABASE_URL=你的 Supabase 项目 URL
SUPABASE_SERVICE_KEY=你的 Supabase Service Role Key
SECRET_KEY=自定义 Flask 密钥
```

## 核心功能

1. **首页** — 二手商品与失物招领信息的混合卡片流
2. **二手交易** — 支持关键词搜索与价格分类筛选
3. **失物招领** — 寻找中/已认领状态卡片的动态流
4. **私信** — 登录拦截 + 聊天会话列表（基于 Supabase Auth）

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/items/` | 获取物品列表（支持 type/search/category 筛选） |
| GET | `/api/items/<id>` | 获取物品详情 |
| POST | `/api/items/` | 发布物品 |
| PATCH | `/api/items/<id>` | 更新物品 |
| DELETE | `/api/items/<id>` | 删除物品 |
| GET | `/api/messages/conversations` | 获取会话列表 |
| GET | `/api/messages/<id>` | 获取会话消息 |
| POST | `/api/messages/` | 发送消息 |
| POST | `/api/messages/read/<id>` | 标记已读 |
