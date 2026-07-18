"""
Fiund 校园物品流转平台 - 后端 API
使用 SQLite 数据库存储数据

启动方式：
  pip install -r requirements.txt
  cp .env.example .env   # 可选：自定义环境变量
  python app.py

接口列表：
  GET  /api/health          - 健康检查
  GET  /api/items            - 获取物品列表（支持 ?type=market|lost|found, ?search=, ?category= 筛选）
  GET  /api/items/<id>       - 获取单个物品详情
  POST /api/items            - 发布物品
  DELETE /api/items/<id>     - 下架/删除物品
"""

import sqlite3
import logging
import os
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv

# ═══ 环境变量 & 日志配置 ════════════════════════════════

load_dotenv()  # 从 .env 文件加载环境变量

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("fiund")

app = Flask(__name__)

# CORS：生产环境限制来源，开发环境放行所有
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
if CORS_ORIGINS == "*":
    CORS(app)
else:
    CORS(app, origins=[o.strip() for o in CORS_ORIGINS.split(",")])


# ═══ 全局错误处理（返回 JSON 而非 HTML） ════════════════

@app.errorhandler(400)
def bad_request(e):
    return jsonify({"error": "请求格式错误"}), 400


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "接口不存在"}), 404


@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "请求方法不允许"}), 405


@app.errorhandler(500)
def internal_error(e):
    logger.error("服务器内部错误: %s", e)
    return jsonify({"error": "服务器内部错误"}), 500


# ═══ 请求日志 ═══════════════════════════════════════════

@app.before_request
def log_request():
    """记录每个 API 请求的方法、路径和来源 IP"""
    if request.path.startswith("/api/"):
        logger.info("%s %s from %s", request.method, request.path, request.remote_addr)

# 数据库文件路径（可通过 DATABASE_PATH 环境变量覆盖）
DATABASE = os.getenv(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db"),
)


# ═══ 数据库连接管理 ═══════════════════════════════════════

def get_db():
    """获取当前请求的数据库连接（自动管理生命周期）"""
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception):
    """请求结束后自动关闭数据库连接"""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    """初始化数据库：建表 + 插入示例数据"""
    conn = sqlite3.connect(DATABASE)
    conn.execute("PRAGMA journal_mode=WAL")
    c = conn.cursor()

    # 建表
    c.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            title       TEXT    NOT NULL,
            description TEXT    DEFAULT '',
            detail      TEXT    DEFAULT '',
            price       REAL,
            type        TEXT    NOT NULL DEFAULT 'market',
            category    TEXT,
            location    TEXT,
            contact     TEXT    DEFAULT '',
            date        TEXT    DEFAULT '刚刚',
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()

    # 如果表为空，插入示例数据
    c.execute("SELECT COUNT(*) FROM items")
    if c.fetchone()[0] == 0:
        sample_items = [
            ("二手 iPad Air 4", "95新，配件齐全，可面交",
             "iPad Air 4 64GB 天蓝色，屏幕无划痕，电池健康度96%。",
             1800, "market", "数码", None, "微信: ipad_seller_2026", "2小时前"),
            ("高等数学教材（第七版）", "有少量笔记标注",
             "同济大学出版社《高等数学》第七版上下册合售。",
             25, "market", "教材", None, "QQ: 123456789", "3小时前"),
            ("寻找丢失的校园卡", "蓝色卡套，内有校园一卡通",
             "今天下午在图书馆三楼自习室遗忘了一张校园卡。",
             None, "lost", None, "图书馆", "电话: 137xxxx9012", "今天"),
            ("拾到一副 AirPods", "白色 AirPods Pro，在食堂二楼座位上发现",
             "昨天中午在食堂二楼靠窗座位拾到白色 AirPods Pro。",
             None, "found", None, "食堂二楼", "交到食堂一楼前台", "昨天"),
            ("小米台灯", "毕业带不走，便宜出",
             "小米米家台灯Pro，三档色温调节，功能完全正常。",
             35, "market", "生活", None, "电话: 138xxxx1234", "昨天"),
        ]
        c.executemany(
            "INSERT INTO items (title, description, detail, price, type, category, location, contact, date) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            sample_items,
        )
        conn.commit()
        logger.info("已插入 %d 条示例数据", len(sample_items))

    conn.close()


# ═══ 辅助函数：将 sqlite3.Row 转为普通字典 ═══════════════

def row_to_dict(row):
    if row is None:
        return None
    return dict(row)


# ═══ 接口1: 健康检查 ═══════════════════════════════════

@app.route("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "Fiund API is running",
        "version": "1.0.0",
        "endpoints": [
            "GET  /api/health",
            "GET  /api/items",
            "GET  /api/items/<id>",
            "POST /api/items",
            "DELETE /api/items/<id>",
        ],
    })


# ═══ 接口2: 获取物品列表（支持筛选） ═══════════════════

@app.route("/api/items")
def get_items():
    """
    查询参数:
      ?type=market|lost|found  按类型筛选
      ?search=关键词           搜索标题
      ?category=分类名         按分类筛选
    """
    db = get_db()

    query = "SELECT * FROM items WHERE 1=1"
    params = []

    item_type = request.args.get("type")
    search = request.args.get("search")
    category = request.args.get("category")

    if item_type:
        query += " AND type = ?"
        params.append(item_type)
    if search:
        query += " AND title LIKE ?"
        params.append(f"%{search}%")
    if category:
        query += " AND category = ?"
        params.append(category)

    query += " ORDER BY id DESC"

    rows = db.execute(query, params).fetchall()
    items = [row_to_dict(r) for r in rows]

    return jsonify({
        "total": len(items),
        "items": items,
    })


# ═══ 接口3: 获取单个物品详情 ═══════════════════════════

@app.route("/api/items/<int:item_id>")
def get_item(item_id):
    db = get_db()
    row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()

    if not row:
        return jsonify({"error": "物品不存在"}), 404

    return jsonify({"item": row_to_dict(row)})


# ═══ 接口4: 发布物品 ═══════════════════════════════════

@app.route("/api/items", methods=["POST"])
def create_item():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "title 为必填项"}), 400

    # 校验 type 字段
    valid_types = ("market", "lost", "found")
    item_type = data.get("type", "market")
    if item_type not in valid_types:
        return jsonify({"error": f"type 必须为 {', '.join(valid_types)} 之一"}), 400

    # 校验 price 字段
    price = data.get("price")
    if price is not None and price < 0:
        return jsonify({"error": "price 不能为负数"}), 400

    db = get_db()
    cursor = db.execute(
        "INSERT INTO items (title, description, detail, price, type, category, location, contact, date) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            data["title"],
            data.get("description", ""),
            data.get("detail", ""),
            price,
            item_type,
            data.get("category"),
            data.get("location"),
            data.get("contact", ""),
            "刚刚",
        ),
    )
    db.commit()

    new_item = row_to_dict(
        db.execute("SELECT * FROM items WHERE id = ?", (cursor.lastrowid,)).fetchone()
    )
    logger.info("新物品发布: id=%s title=%s", new_item["id"], new_item["title"])

    return jsonify({"message": "发布成功", "item": new_item}), 201


# ═══ 接口5: 下架/删除物品 ══════════════════════════════

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    db = get_db()
    cursor = db.execute("DELETE FROM items WHERE id = ?", (item_id,))
    db.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "物品不存在"}), 404

    remaining = db.execute("SELECT COUNT(*) FROM items").fetchone()[0]
    logger.info("物品已删除: id=%d, 剩余 %d 条", item_id, remaining)
    return jsonify({"message": "删除成功", "remaining": remaining})


# ═══ 启动 ══════════════════════════════════════════════

if __name__ == "__main__":
    init_db()
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    logger.info("=" * 40)
    logger.info("Fiund API 已启动")
    logger.info("数据库: %s", DATABASE)
    logger.info("http://%s:%d/api/health", FLASK_HOST, FLASK_PORT)
    logger.info("=" * 40)
    app.run(debug=FLASK_DEBUG, host=FLASK_HOST, port=FLASK_PORT)
