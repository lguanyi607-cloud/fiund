from flask import Blueprint, request, jsonify
from supabase import create_client
import os

messages_bp = Blueprint("messages", __name__)


def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


# ── 获取会话列表 ────────────────────────────────────────
@messages_bp.route("/conversations", methods=["GET"])
def get_conversations():
    """获取当前用户的会话列表（需登录）"""
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "缺少 user_id 参数"}), 400

    try:
        supabase = get_supabase()
        result = (
            supabase.table("conversations")
            .select("*")
            .or_(f"sender_id.eq.{user_id},receiver_id.eq.{user_id}")
            .order("updated_at", desc=True)
            .execute()
        )
        return jsonify({"conversations": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── 获取会话消息 ────────────────────────────────────────
@messages_bp.route("/<int:conversation_id>", methods=["GET"])
def get_messages(conversation_id):
    """获取某个会话内的消息列表"""
    try:
        supabase = get_supabase()
        result = (
            supabase.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .execute()
        )
        return jsonify({"messages": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── 发送消息 ───────────────────────────────────────────
@messages_bp.route("/", methods=["POST"])
def send_message():
    """发送私信（需登录）"""
    data = request.get_json()
    try:
        supabase = get_supabase()
        result = supabase.table("messages").insert(data).execute()
        return jsonify({"message": "消息已发送", "data": result.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ── 标记已读 ───────────────────────────────────────────
@messages_bp.route("/read/<int:conversation_id>", methods=["POST"])
def mark_as_read(conversation_id):
    """将某会话的所有未读消息标记为已读"""
    user_id = request.get_json().get("user_id")
    try:
        supabase = get_supabase()
        supabase.table("messages").update({"is_read": True}).eq(
            "conversation_id", conversation_id
        ).eq("receiver_id", user_id).eq("is_read", False).execute()
        return jsonify({"message": "已标记为已读"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
