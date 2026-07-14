from flask import Blueprint, request, jsonify
from supabase import create_client
import os

auth_bp = Blueprint("auth", __name__)

# 获取 Supabase 客户端（延迟初始化，避免循环引用）
def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


@auth_bp.route("/register", methods=["POST"])
def register():
    """用户注册 —— 基于 Supabase Auth"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "邮箱和密码为必填项"}), 400

    try:
        supabase = get_supabase()
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })
        return jsonify({
            "message": "注册成功，请查收验证邮件",
            "user": {"id": response.user.id, "email": response.user.email},
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """用户登录"""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "邮箱和密码为必填项"}), 400

    try:
        supabase = get_supabase()
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
        return jsonify({
            "message": "登录成功",
            "access_token": response.session.access_token,
            "user": {"id": response.user.id, "email": response.user.email},
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """用户登出"""
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        return jsonify({"message": "已登出"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
