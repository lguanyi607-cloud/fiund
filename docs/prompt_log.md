# AI 工具运用日志

## 记录说明

本文档用于记录项目开发过程中 AI 辅助工具的使用情况，包括任务描述、工具选型、生成内容及效果评估。

---

## 日志记录

### 2026-07-14 — 项目工程骨架初始化

**任务描述：**
在空的 `fiund` 文件夹下初始化"校园物品流转全栈 Web 应用"的完整工程骨架，包含前后端分离架构、4 个功能路由页面、Blueprint 后端模块划分、Supabase 集成配置，以及实训文档目录。

**AI 工具：** QoderWork (Agent Mode)

**生成内容清单：**

- **前端 (Next.js)**
  - 项目配置文件：package.json, tsconfig.json, tailwind.config.ts, postcss.config.mjs, next.config.mjs
  - 环境变量模板：.env.local
  - App Router 路由页面：首页 (page.tsx)、二手交易 (market/page.tsx)、失物招领 (lost-found/page.tsx)、私信 (messages/page.tsx)
  - 通用组件：TabBar 底部导航栏、ItemCard 物品卡片
  - 全局样式：globals.css（移动端优先布局，max-width: 480px）
  - 根布局：layout.tsx（集成 TabBar 与 viewport 配置）

- **后端 (Flask)**
  - 应用入口：app.py（含 Supabase 初始化、蓝图注册、健康检查接口）
  - Blueprint 模块：auth.py（注册/登录/登出）、items.py（CRUD + 筛选）、messages.py（会话/消息/已读标记）
  - 依赖声明：requirements.txt
  - 环境变量模板：.env.example

- **文档**
  - README.md（项目介绍、技术栈、目录结构、启动指南、API 概览）
  - prompt_log.md（本文件）

**效果评估：**
- 共生成 20 个文件，覆盖完整的前后端工程骨架
- 前端 4 个页面均包含示例数据和交互逻辑（搜索、筛选、登录拦截），可直接 `npm run dev` 预览
- 后端 API 路由结构清晰，Blueprint 模块化设计便于后续扩展
- Supabase 集成代码已就绪，填入密钥后即可对接

**用时：** 约 3 分钟

**AI 返回代码示例（layout.tsx 根布局）：**

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabBar from "@/components/TabBar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Fiund - 校园物品流转平台",
  description: "校园二手交易与失物招领一站式平台",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <main className="pb-20 min-h-screen">{children}</main>
          <TabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2026-07-14 — 物品详情页功能与统一数据层

**任务描述：**
对照《AI辅助编程与工程化实训考核方案》检查项目完整度，发现缺少物品详情页（点击卡片无法查看详情）。需要实现动态路由 `/item/[id]`，为所有卡片添加点击跳转，并建立统一的数据源模块避免各页面数据重复。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "你还要做每个物品的详情界面实现点击出现详情信息，思想也是一样也要有详情信息"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/data/items.ts` | 统一数据源模块，包含 14 个物品的完整信息（标题、描述、价格、详情文字、联系方式等），提供 `getItemById()`、`getItemsByType()`、`getMixedItems()` 三个查询函数 |
| `src/app/item/[id]/page.tsx` | 动态详情路由页面，展示大图、类型/状态标签、价格、分类/地点/时间标签组、详细描述、联系方式卡片、底部操作按钮（我想要/私信卖家/我有线索等） |
| `src/app/page.tsx` | 首页改造：接入统一数据源 `getMixedItems()`，卡片外层包裹 `<Link>` 实现点击跳转 |
| `src/app/market/page.tsx` | 二手交易页改造：接入 `getItemsByType("market")`，卡片可点击跳转详情 |
| `src/app/lost-found/page.tsx` | 失物招领页改造：接入共享数据并过滤 lost/found 类型，新增"等待认领"筛选项，卡片可点击跳转 |

**效果评估：**
- 新增 1 个动态路由 + 1 个数据模块 + 3 个页面改造
- 所有卡片均可点击跳转至详情页，详情页包含完整的物品信息展示
- 详情页根据物品类型（market/lost/found）自动切换操作按钮文案
- 数据层统一后各页面不再各自维护重复数据，后续接入 API 只需修改 `src/data/items.ts`

**用时：** 约 2 分钟

---

### 2026-07-15 — 发布功能 + 全局登录拦截

**任务描述：**
为二手交易和失物招领页面添加"发布物品"功能（右下角 + 按钮），同时要求发布操作必须登录后才能使用，未登录时弹出登录提醒弹窗。登录状态需要全局共享（私信页、发布按钮共用同一套登录态）。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "继续帮我添加上线功能，在二手交易和失物招领发布键位置是在右下加ui是一个加号"
> "注意这个只有登录后才可以使用还有如果没有登录就要提醒登录"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/contexts/AuthContext.tsx` | 全局登录状态 Context，提供 login/logout/isLoggedIn，localStorage 持久化 |
| `src/components/PublishModal.tsx` | 发布表单底部抽屉组件，根据类型（market/lost/found）自动切换表单字段 |
| `src/components/LoginPromptModal.tsx` | 登录提醒底部弹窗，带锁图标和"立即登录"按钮 |
| `src/data/items.ts` | 数据层升级：新增 addDynamicItem()、useItems() hook、localStorage 读写、订阅通知模式 |
| `src/app/layout.tsx` | 根布局包裹 AuthProvider，全局提供登录状态 |
| `src/app/market/page.tsx` | 接入 FAB + 登录拦截：未登录弹提醒，登录后打开发布表单 |
| `src/app/lost-found/page.tsx` | 同上，FAB 先弹类型选择（寻物/拾到），再打开对应表单 |
| `src/app/messages/page.tsx` | 改用全局 useAuth() 替代本地 useState，登录/退出全局同步 |
| `src/app/page.tsx` | 首页改用 useItems() hook，新发布的物品会出现在首页 |

**效果评估：**
- 发布功能完整可用：填写表单 → 提交 → 物品立即出现在列表顶部，刷新页面后仍存在
- 登录拦截覆盖所有需要身份的操作：发布按钮、私信页面
- 登录状态全局共享：任意位置登录后，所有页面同步解锁
- 失物招领 FAB 支持类型选择（寻物/拾到），再弹出对应表单

**用时：** 约 5 分钟

---

### 2026-07-15 — 个人中心改造与私信聊天系统

**任务描述：**
将原来的"私信"页面改造为综合性的"个人中心"页面，底部 Tab 标签从"私信"改为"我的"。新增私信聊天详情页，点击会话列表中的联系人可进入聊天界面发送消息。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "私信页改造为个人中心，底部Tab改为'我的'"
> "新增私信聊天详情页，点击会话进入聊天界面"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/app/messages/page.tsx` | 个人中心页面：头像展示、用户信息、功能菜单入口（我的发布/收藏/浏览记录/私信） |
| `src/app/chat/[id]/page.tsx` | 私信聊天详情页：顶部导航 + 对方头像、消息气泡列表（左右分布）、底部输入框 + 发送按钮 |
| `src/data/chats.ts` | 聊天数据模块：4 个默认会话（张三/李四/王五/赵六）、消息数据结构、会话 CRUD |
| `src/components/TabBar.tsx` | 底部导航栏更新：最后一个 Tab 改为"我的" |

**效果评估：**
- 个人中心页面整合了所有用户相关功能入口，信息层次更清晰
- 聊天界面支持消息发送和实时显示，气泡按发送方/接收方左右分布
- 会话列表和聊天详情页的数据结构为后续持久化奠定了基础

**用时：** 约 4 分钟

---

### 2026-07-15 — 收藏功能与个人数据管理页面

**任务描述：**
在物品详情页添加收藏（星标）按钮，实现"我的收藏"页面展示收藏列表。同时创建"我的发布"和"浏览记录"页面，个人中心菜单点击可跳转到对应功能页面。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "实现收藏功能，详情页加星标按钮，我的收藏页展示收藏列表"
> "实现我的发布/收藏/浏览记录页面，点击菜单跳转新界面"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/data/favorites.ts` | 收藏数据模块：localStorage 持久化、toggleFavorite()、useFavorites() hook |
| `src/data/history.ts` | 浏览记录数据模块：recordView()、useHistory() hook |
| `src/app/favorites/page.tsx` | 我的收藏页面：展示已收藏物品列表 |
| `src/app/my-items/page.tsx` | 我的发布页面：展示当前用户发布的物品 |
| `src/app/history/page.tsx` | 浏览记录页面：按时间倒序展示浏览过的物品 |
| `src/app/item/[id]/page.tsx` | 详情页增加星标收藏按钮，自动记录浏览历史 |

**效果评估：**
- 收藏功能完整可用，详情页星标按钮实时切换状态
- 三个个人数据页面（发布/收藏/浏览记录）均已实现，菜单跳转正常
- 数据持久化到 localStorage，刷新页面后数据不丢失

**用时：** 约 5 分钟

**AI 返回代码示例（favorites.ts 收藏核心逻辑）：**

```ts
/** 切换收藏状态 */
export function toggleFavorite(itemId: number) {
  const idx = favorites.indexOf(itemId);
  if (idx >= 0) {
    favorites = favorites.filter((id) => id !== itemId);
  } else {
    favorites = [...favorites, itemId];
  }
  save();
  notify();
}

/** React Hook —— 获取收藏 ID 列表，按用户隔离 */
export function useFavorites(username?: string): number[] {
  const [ids, setIds] = useState<number[]>([]);
  useEffect(() => {
    if (username) {
      switchFavoritesUser(username);
      setIds(load(username));
    } else {
      setIds([]);
    }
    const sub = () => setIds([...favorites]);
    listeners.add(sub);
    return () => { listeners.delete(sub); };
  }, [username]);
  return ids;
}
```

---

### 2026-07-15 — UI 美化、图片本地化与搜索功能

**任务描述：**
全站 UI 切换为橙色暖色调主题，将商品图片从外部链接下载到本地存储避免加载失败，并为首屏和失物招领页面添加搜索功能。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "全站UI美化，切换橙色暖色调主题"
> "商品图片全部下载到本地存储，不再依赖外部网络"
> "首页和失物招领页增加搜索功能"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/app/globals.css` | 全局样式重构：橙色渐变主题变量、卡片阴影、圆角、过渡动画 |
| `tailwind.config.ts` | Tailwind 配置扩展：自定义颜色（orange 系列）、渐变、阴影 |
| `src/app/page.tsx` | 首页增加搜索栏，支持关键词实时过滤 |
| `src/app/lost-found/page.tsx` | 失物招领页增加搜索栏 |
| `public/images/` | 14 张商品图片下载到本地，替换所有外部 URL |
| `src/data/items.ts` | 图片路径全部改为本地 `/images/xxx.jpg` 格式 |

**效果评估：**
- 全站统一为橙色暖色调视觉风格，卡片、按钮、标签风格一致
- 图片加载不再依赖外部网络，解决了之前校园卡/台灯/雨伞等图片 404 的问题
- 搜索功能支持实时输入过滤，提升了信息检索效率

**用时：** 约 6 分钟

---

### 2026-07-16 — 后端重构：SQLite 替代 Supabase

**任务描述：**
将后端从 Supabase（需要云数据库配置）重构为 SQLite 本地存储方案，所有后端逻辑合并到单个 `app.py` 文件中，移除 Blueprint 模块化和 Supabase 依赖，简化部署流程。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "把后端给我改一下，改成后端在app.py里面放入后端，数据库在database.db里面存储数据"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `backend/app.py` | 单文件后端应用：SQLite 数据库初始化、自动建表、示例数据填充、5 个 REST 接口（health、items CRUD） |
| `backend/requirements.txt` | 精简依赖：仅 Flask + flask-cors |
| `backend/database.db` | SQLite 数据库文件（运行时自动生成） |

**效果评估：**
- 后端从 4 个 Blueprint 模块 + Supabase 集成简化为单文件 + SQLite
- 首次启动自动建表并填充 5 条示例数据，零配置即可运行
- 移除了 Supabase 密钥依赖，大幅降低了环境配置复杂度
- API 接口精简为实际使用的 5 个端点

**用时：** 约 3 分钟

---

### 2026-07-16 — 登录注册系统重构与数据按账号隔离

**任务描述：**
将登录系统从简单的用户名输入重构为邮箱+密码的注册/登录模式，实现完整的注册和登录流程。同时将所有用户数据（收藏、想要、浏览记录、私信）按账号隔离，不同账号看到独立的个人数据。头像与账号关联。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "这个点击登录改成注册/登录然后可以选择登录还是注册"
> "登录也是邮箱和密码啊"
> "现在这个私信消息内容肯定是和账号绑定的啊"
> "这个我发布的，我想要，我的收藏，浏览记录肯定要和账号绑定啊"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/contexts/AuthContext.tsx` | 认证 Context 重构：邮箱+密码注册登录、用户记录存储（fiund_users）、头像按用户名关联（fiund_avatars） |
| `src/components/LoginPromptModal.tsx` | 登录/注册双模式弹窗：支持在登录和注册之间切换，邮箱+密码+确认密码表单 |
| `src/data/favorites.ts` | 收藏数据隔离：存储 key 改为 `fiund_favorites_{username}` |
| `src/data/wants.ts` | 想要数据隔离：存储 key 改为 `fiund_wants_{username}` |
| `src/data/history.ts` | 浏览记录隔离：存储 key 改为 `fiund_history_{username}` |
| `src/data/chats.ts` | 私信隔离：会话存储 key 改为 `fiund_chats_{username}`，含旧数据迁移逻辑 |
| `src/app/messages/page.tsx` | 个人中心适配：展示真实邮箱、按账号加载数据 |

**效果评估：**
- 注册登录流程完整：填写邮箱/密码 → 注册 → 邮箱/密码 → 登录 → 状态持久化
- 所有用户数据按账号完全隔离，切换账号后数据独立
- 头像与账号绑定，退出登录后头像清空
- 旧数据迁移逻辑保证升级后不丢失已有数据

**用时：** 约 8 分钟

**AI 返回代码示例（AuthContext.tsx 注册函数）：**

```tsx
function register(name: string, password: string, emailAddress: string): true | string {
  const users = loadUsers();
  if (users[emailAddress]) return "该邮箱已被注册";
  const nameTaken = Object.values(users).some((u) => u.username === name);
  if (nameTaken) return "该用户名已被使用";
  users[emailAddress] = { username: name, password };
  saveUsers(users);

  setIsLoggedIn(true);
  setUsernameState(name);
  setEmailState(emailAddress);
  try {
    localStorage.setItem("fiund_logged_in", "true");
    localStorage.setItem("fiund_username", name);
    localStorage.setItem("fiund_email", emailAddress);
  } catch {}
  setAvatarState(null);
  return true;
}
```

---

### 2026-07-16 — 物品数据全局化与数据模型修正

**任务描述：**
修正数据模型：发布的物品应该对所有用户全局可见（浏览页面展示所有物品），但"我的发布"只展示当前用户的物品。同时新增物品下架功能，修复详情页操作按钮逻辑（自己发布的物品不显示收藏/想要等按钮），新增留言和私信入口。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "正常逻辑应该是浏览页面所有人看到相同的物品，我的页面看自己的数据"
> "新增物品下架功能"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/data/items.ts` | 物品数据模型重构：全局存储 `fiund_items`，新增 `owner` 字段标记发布者，useItems() 返回全部物品 |
| `src/app/my-items/page.tsx` | 我的发布：从全局物品中按 `item.owner === username` 过滤 |
| `src/app/item/[id]/page.tsx` | 详情页优化：自己发布的物品显示"下架"按钮、隐藏不合理的收藏/想要操作、新增留言区域和私信入口 |
| `src/app/page.tsx` | 首页：展示全局物品（所有用户发布的都能浏览） |
| `src/app/market/page.tsx` | 二手交易页：同上，展示全局物品 |
| `src/app/lost-found/page.tsx` | 失物招领页：同上，展示全局物品 |

**效果评估：**
- 数据模型修正后逻辑符合真实产品：浏览页看到所有人的物品，个人区只看自己的
- `owner` 字段使物品归属关系明确，下架功能完善
- 详情页操作按钮根据身份智能切换，体验更合理

**用时：** 约 5 分钟

---

### 2026-07-16 — 双向私信聊天与私信按钮定位发布者

**任务描述：**
实现真正的双向私信聊天：消息按聊天双方共享存储（非按用户隔离），A 给 B 发消息后 B 也能看到。物品详情页的"私信卖家/发布者"按钮不再跳转到固定的聊天，而是动态定位到物品发布者的对话。发消息时自动给接收方创建会话记录。

**AI 工具：** QoderWork (Agent Mode)

**Prompt 摘要：**
> "这个私信发布者还是不准确，就要给发布用户发消息啊"
> "收到消息也要同步啊实现正经聊天那种"

**生成内容清单：**

| 文件路径 | 说明 |
|----------|------|
| `src/data/chats.ts` | 聊天系统重构：新增共享消息存储（`fiund_msg_{A}__{B}` 按字母序排列）、`findOrCreateConversation()` 动态创建会话、`addMessage(text, sender, contactName)` 写入共享存储、`ensureRecipientConversation()` 自动给接收方创建会话、`useMessages()` hook 读取共享消息 |
| `src/app/chat/[id]/page.tsx` | 聊天页改造：从共享存储读取消息、发送后立即刷新、500ms 轮询检测对方新消息、`senderId` 存真实用户名 |
| `src/app/item/[id]/page.tsx` | 私信按钮：导入 `findOrCreateConversation`，三个 `<Link href="/chat/1">` 替换为 `handleMessageOwner()` 动态定位发布者聊天 |

**效果评估：**
- 消息双向同步：A 发消息 → 共享存储写入 → B 登录后能看到相同消息
- 私信按钮准确定位：点击"私信卖家"自动找到或创建与物品发布者的对话
- 接收方自动创建会话：A 给 B 发消息时，B 的会话列表中自动出现 A 的对话
- 轮询机制保证消息实时性，发送后立即刷新列表

**用时：** 约 10 分钟

**AI 返回代码示例（chats.ts 双向消息发送与共享存储）：**

```ts
/** 发送消息（写入共享存储 + 更新发送者的会话元数据 + 确保接收方有对话） */
export function addMessage(text: string, sender: string, contactName: string): Message {
  if (!sender || !contactName) {
    return { id: 0, senderId: "", text: "", time: "" };
  }
  if (sender !== currentUsername) {
    switchChatUser(sender);
  }
  const msg: Message = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderId: sender,
    text,
    time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
  };
  // 写入共享消息存储（双方可见）
  const messages = loadSharedMessages(sender, contactName);
  messages.push(msg);
  saveSharedMessages(sender, contactName, messages);
  // 确保接收方的会话列表里有发送者的对话
  ensureRecipientConversation(sender, contactName);
  // 更新发送者的会话列表元数据
  const convIdx = conversations.findIndex((c) => c.name === contactName);
  if (convIdx >= 0) {
    conversations[convIdx] = { ...conversations[convIdx], lastMessage: text, time: "刚刚" };
    saveConversations();
  }
  notify();
  return msg;
}
```

---

*后续开发中的 AI 辅助记录请继续追加于此。*
