from flask import Blueprint, request, jsonify
from supabase import create_client
import os

items_bp = Blueprint("items", __name__)


def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


# ── 获取物品列表 ────────────────────────────────────────
@items_bp.route("/", methods=["GET"])
def get_items():
    """
    获取物品列表
    查询参数:
      - type: market | lost | found（可选）
      - search: 关键词搜索（可选）
      - category: 分类筛选（可选）
    """
    item_type  = request.args.get("type")
    search     = request.args.get("search", "")
    category   = request.args.get("category", "")

    try:
        supabase = get_supabase()
        query = supabase.table("items").select("*")

        if item_type:
            query = query.eq("type", item_type)
        if search:
            query = query.ilike("title", f"%{search}%")
        if category:
            query = query.eq("category", category)

        query = query.order("created_at", desc=True)
        result = query.execute()
        return jsonify({"items": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── 获取单个物品详情 ───────────────────────────────────
@items_bp.route("/<int:item_id>", methods=["GET"])
def get_item(item_id):
    try:
        supabase = get_supabase()
        result = supabase.table("items").select("*").eq("id", item_id).execute()
        if result.data:
            return jsonify({"item": result.data[0]}), 200
        return jsonify({"error": "物品不存在"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── 创建物品 ───────────────────────────────────────────
@items_bp.route("/", methods=["POST"])
def create_item():
    """创建物品（需登录，请求头携带 Authorization: Bearer <token>）"""
    data = request.get_json()
    try:
        supabase = get_supabase()
        result = supabase.table("items").insert(data).execute()
        return jsonify({"message": "发布成功", "item": result.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 更新物品状态 ───────────────────────────────────────
@items_bp.route("/<int:item_id>", methods=["PATCH"])
def update_item(item_id):
    """更新物品信息（如状态变更：寻找中 → 已认领）"""
    data = request.get_json()
    try:
        supabase = get_supabase()
        result = supabase.table("items").update(data).eq("id", item_id).execute()
        return jsonify({"message": "更新成功", "item": result.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 删除物品 ───────────────────────────────────────────
@items_bp.route("/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    try:
        supabase = get_supabase()
        supabase.table("items").delete().eq("id", item_id).execute()
        return jsonify({"message": "删除成功"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
