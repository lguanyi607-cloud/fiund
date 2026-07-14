import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client

# 加载环境变量
load_dotenv()

# 初始化 Flask 应用
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

# 跨域配置 —— 允许前端开发服务器访问
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])

# 初始化 Supabase 客户端
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),
)


# ── 注册蓝图 ────────────────────────────────────────────
from api.auth import auth_bp
from api.items import items_bp
from api.messages import messages_bp

app.register_blueprint(auth_bp,       url_prefix="/api/auth")
app.register_blueprint(items_bp,      url_prefix="/api/items")
app.register_blueprint(messages_bp,   url_prefix="/api/messages")


# ── 健康检查 ────────────────────────────────────────────
@app.route("/api/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Fiund API is running",
        "version": "0.1.0",
    })


# ── 启动 ────────────────────────────────────────────────
if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "True").lower() == "true"
    port = int(os.getenv("PORT", 5000))
    app.run(debug=debug, host="0.0.0.0", port=port)
