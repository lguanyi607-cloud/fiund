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

*后续开发中的 AI 辅助记录请继续追加于此。*
