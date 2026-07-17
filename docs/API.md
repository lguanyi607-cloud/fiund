# Fiund API 接口文档

## 基本信息

| 项目 | 说明 |
|------|------|
| 基础地址 | `http://localhost:5000/api` |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 跨域支持 | 已启用（flask-cors） |
| 后端框架 | Flask + SQLite |

## 通用说明

所有接口返回 JSON 格式。成功响应 HTTP 状态码为 200（创建为 201），失败时返回对应错误码及 `error` 字段说明原因。

错误响应示例：

```json
{
  "error": "错误描述信息"
}
```

---

## 接口列表

### 1. 健康检查

检查后端服务是否正常运行。

**请求**

```
GET /api/health
```

无参数。

**响应** `200 OK`

```json
{
  "status": "ok",
  "message": "Fiund API is running",
  "version": "1.0.0",
  "endpoints": [
    "GET  /api/health",
    "GET  /api/items",
    "GET  /api/items/<id>",
    "POST /api/items",
    "DELETE /api/items/<id>"
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| status | string | 服务状态，固定值 `"ok"` |
| message | string | 状态描述 |
| version | string | API 版本号 |
| endpoints | string[] | 可用接口列表 |

---

### 2. 获取物品列表

获取所有物品，支持按类型、关键词、分类进行筛选。结果按 ID 降序排列（最新发布的在前）。

**请求**

```
GET /api/items
```

**查询参数（均为可选）**

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| type | string | 物品类型：`market`（二手交易）、`lost`（寻物）、`found`（拾到） | `?type=market` |
| search | string | 按标题关键词模糊搜索 | `?search=iPad` |
| category | string | 按分类筛选（如 `数码`、`教材`、`生活`） | `?category=数码` |

参数可组合使用，例如：`/api/items?type=market&search=iPad&category=数码`

**响应** `200 OK`

```json
{
  "total": 3,
  "items": [
    {
      "id": 1,
      "title": "二手 iPad Air 4",
      "description": "95新，配件齐全，可面交",
      "detail": "iPad Air 4 64GB 天蓝色，屏幕无划痕，电池健康度96%。",
      "price": 1800.0,
      "type": "market",
      "category": "数码",
      "location": null,
      "contact": "微信: ipad_seller_2026",
      "date": "2小时前",
      "created_at": "2026-07-14 10:00:00"
    }
  ]
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| total | number | 本次返回的物品数量 |
| items | object[] | 物品数组 |
| items[].id | number | 物品唯一 ID |
| items[].title | string | 标题 |
| items[].description | string | 简短描述 |
| items[].detail | string | 详细描述 |
| items[].price | number \| null | 价格（二手交易有值，失物招领为 null） |
| items[].type | string | 类型：`market` / `lost` / `found` |
| items[].category | string \| null | 分类名称 |
| items[].location | string \| null | 地点（失物招领相关） |
| items[].contact | string | 联系方式 |
| items[].date | string | 发布时间的友好展示 |
| items[].created_at | string | 数据库创建时间戳 |

---

### 3. 获取单个物品详情

根据 ID 获取一件物品的完整信息。

**请求**

```
GET /api/items/:id
```

| 路径参数 | 类型 | 说明 |
|----------|------|------|
| id | number | 物品 ID |

**响应** `200 OK`

```json
{
  "item": {
    "id": 1,
    "title": "二手 iPad Air 4",
    "description": "95新，配件齐全，可面交",
    "detail": "iPad Air 4 64GB 天蓝色，屏幕无划痕，电池健康度96%。",
    "price": 1800.0,
    "type": "market",
    "category": "数码",
    "location": null,
    "contact": "微信: ipad_seller_2026",
    "date": "2小时前",
    "created_at": "2026-07-14 10:00:00"
  }
}
```

**错误响应** `404 Not Found`

```json
{
  "error": "物品不存在"
}
```

---

### 4. 发布物品

发布一件新物品到平台。

**请求**

```
POST /api/items
Content-Type: application/json
```

**请求体**

```json
{
  "title": "二手自行车",
  "description": "大四毕业转让，骑了两年",
  "detail": "捷安特山地车，21速变速器，前后碟刹。",
  "price": 200,
  "type": "market",
  "category": "生活",
  "location": null,
  "contact": "微信: bike_seller"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 物品标题 |
| description | string | 否 | 简短描述，默认 `""` |
| detail | string | 否 | 详细描述，默认 `""` |
| price | number | 否 | 价格，失物招领类可不填 |
| type | string | 否 | 类型：`market`（默认）/ `lost` / `found` |
| category | string | 否 | 分类：`数码` / `教材` / `生活` 等 |
| location | string | 否 | 地点（失物招领时使用） |
| contact | string | 否 | 联系方式，默认 `""` |

**响应** `201 Created`

```json
{
  "message": "发布成功",
  "item": {
    "id": 6,
    "title": "二手自行车",
    "description": "大四毕业转让，骑了两年",
    "detail": "捷安特山地车，21速变速器，前后碟刹。",
    "price": 200.0,
    "type": "market",
    "category": "生活",
    "location": null,
    "contact": "微信: bike_seller",
    "date": "刚刚",
    "created_at": "2026-07-17 14:30:00"
  }
}
```

**错误响应** `400 Bad Request`

```json
{
  "error": "title 为必填项"
}
```

---

### 5. 下架/删除物品

根据 ID 删除一件物品。

**请求**

```
DELETE /api/items/:id
```

| 路径参数 | 类型 | 说明 |
|----------|------|------|
| id | number | 物品 ID |

无请求体。

**响应** `200 OK`

```json
{
  "message": "删除成功",
  "remaining": 4
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| message | string | 操作结果描述 |
| remaining | number | 删除后剩余物品总数 |

**错误响应** `404 Not Found`

```json
{
  "error": "物品不存在"
}
```

---

## 数据库表结构

### items 表

| 列名 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 自增主键 |
| title | TEXT | NOT NULL | 物品标题 |
| description | TEXT | DEFAULT '' | 简短描述 |
| detail | TEXT | DEFAULT '' | 详细描述 |
| price | REAL | 可空 | 价格 |
| type | TEXT | NOT NULL DEFAULT 'market' | 物品类型 |
| category | TEXT | 可空 | 分类 |
| location | TEXT | 可空 | 地点 |
| contact | TEXT | DEFAULT '' | 联系方式 |
| date | TEXT | DEFAULT '刚刚' | 发布时间展示文本 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间戳 |

---

## 前端调用方式

前端通过 `src/lib/api.ts` 封装了所有后端调用，基础地址通过环境变量 `NEXT_PUBLIC_API_URL` 配置，默认值为 `http://localhost:5000/api`。

```typescript
// 获取物品列表
const { items } = await itemsApi.list({ type: "market", search: "iPad" });

// 获取单个物品
const { item } = await itemsApi.getById(1);

// 发布物品
const { item } = await itemsApi.create({ title: "二手自行车", price: 200 });

// 下架物品
await itemsApi.remove(1);

// 健康检查
const { status } = await healthCheck();
```

---

## 快速测试

启动后端后，可使用以下命令测试接口：

```bash
# 健康检查
curl http://localhost:5000/api/health

# 获取所有物品
curl http://localhost:5000/api/items

# 按类型筛选
curl "http://localhost:5000/api/items?type=market"

# 关键词搜索
curl "http://localhost:5000/api/items?search=iPad"

# 获取单个物品
curl http://localhost:5000/api/items/1

# 发布物品
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"测试物品","description":"这是一件测试物品","price":100,"type":"market"}'

# 删除物品
curl -X DELETE http://localhost:5000/api/items/1
```
