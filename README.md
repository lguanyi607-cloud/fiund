# Fiund - 校园物品流转平台

校园二手交易与失物招领一站式平台，移动端优先设计（max-width: 480px）。

## 技术栈

**前端：** Next.js 14 (App Router) + TypeScript + Tailwind CSS  
**后端：** Python Flask + Supabase (Auth + PostgreSQL)  
**部署：** GitHub + Vercel / Railway

## 功能概览

- 首页混合流（二手交易 + 失物招领）
- 二手商品筛选（按分类、关键词搜索）
- 失物招领卡片流（寻物/拾到分类）
- 物品发布（二手出售 / 寻物启事 / 拾到通知）
- 物品详情（联系方式、留言、私信）
- 收藏 / 我想要 / 浏览记录
- 个人中心（头像、昵称、我的发布、下架）
- 私信聊天

## 目录结构

```
fiund/
├── frontend/          # Next.js 前端
│   ├── src/
│   │   ├── app/       # App Router 页面
│   │   ├── components/# 通用组件
│   │   ├── contexts/  # React Context（登录状态）
│   │   ├── data/      # 数据层（localStorage 持久化）
│   │   └── lib/       # API 服务层
│   └── public/        # 静态资源
├── backend/           # Flask 后端
│   ├── app.py         # 应用入口
│   └── api/           # Blueprint 模块
│       ├── auth.py    # 认证（Supabase Auth）
│       ├── items.py   # 物品 CRUD
│       ├── messages.py# 私信消息
│       └── db.py      # Supabase 客户端
└── docs/              # 文档
    ├── supabase_init.sql  # 数据库初始化脚本
    └── prompt_log.md      # AI 辅助日志
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 后端

1. 创建 Supabase 项目：https://supabase.com
2. 在 SQL Editor 中执行 `docs/supabase_init.sql`
3. 获取项目 URL 和 Service Key

```bash
cd backend
pip install -r requirements.txt
```

创建 `.env` 文件：

```
SUPABASE_URL=你的Supabase项目URL
SUPABASE_SERVICE_KEY=你的Service Role Key
SECRET_KEY=自定义密钥
FLASK_DEBUG=True
PORT=5000
```

```bash
python app.py
```

后端 API 运行在 http://localhost:5000

### 前后端联调

前端通过 `NEXT_PUBLIC_API_URL` 环境变量连接后端：

在 `frontend/.env.local` 中添加：

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

发布物品和下架操作会自动同步到后端 API。

## API 文档

### 健康检查

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 服务状态检查 |

### 认证 `/api/auth`

| 方法 | 路径 | 参数 | 说明 |
|------|------|------|------|
| POST | `/api/auth/register` | `{ email, password }` | 用户注册 |
| POST | `/api/auth/login` | `{ email, password }` | 用户登录，返回 access_token |
| POST | `/api/auth/logout` | 无 | 用户登出 |

### 物品 `/api/items`

| 方法 | 路径 | 参数 | 说明 |
|------|------|------|------|
| GET | `/api/items/` | `?type=market&search=关键词&category=数码` | 获取物品列表 |
| GET | `/api/items/:id` | URL 参数 id | 获取单个物品 |
| POST | `/api/items/` | `{ title, type, description, ... }` | 发布物品 |
| PATCH | `/api/items/:id` | `{ status, ... }` | 更新物品 |
| DELETE | `/api/items/:id` | URL 参数 id | 下架/删除物品 |

### 消息 `/api/messages`

| 方法 | 路径 | 参数 | 说明 |
|------|------|------|------|
| GET | `/api/messages/conversations` | 无 | 获取会话列表 |
| GET | `/api/messages/:id` | URL 参数 conversation_id | 获取会话消息 |
| POST | `/api/messages/` | `{ conversation_id, sender_id, content }` | 发送消息 |
| POST | `/api/messages/read/:id` | `{ user_id }` | 标记已读 |

### 请求示例

**发布物品：**
```bash
curl -X POST http://localhost:5000/api/items/ \
  -H "Content-Type: application/json" \
  -d '{"title":"二手iPad","type":"market","price":1800,"description":"95新","category":"数码"}'
```

**获取物品列表：**
```bash
curl http://localhost:5000/api/items/?type=market
```

**下架物品：**
```bash
curl -X DELETE http://localhost:5000/api/items/123
```
