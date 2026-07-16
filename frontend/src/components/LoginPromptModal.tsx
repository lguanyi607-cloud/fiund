"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setInputName("");
    setInputEmail("");
    setInputPassword("");
    setConfirmPassword("");
    setError("");
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    resetForm();
  }

  function handleSubmit() {
    const email = inputEmail.trim();
    const pwd = inputPassword;

    if (!email) {
      setError("请输入邮箱");
      return;
    }
    if (!pwd) {
      setError("请输入密码");
      return;
    }

    if (mode === "register") {
      const name = inputName.trim();
      if (!name) {
        setError("请输入用户名");
        return;
      }
      if (pwd !== confirmPassword) {
        setError("两次密码不一致");
        return;
      }
      const ok = register(name, pwd, email);
      if (!ok) {
        setError("该邮箱已被注册");
        return;
      }
    } else {
      const ok = login(email, pwd);
      if (!ok) {
        setError("邮箱或密码错误");
        return;
      }
    }

    resetForm();
    onClose();
  }

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[28px] z-50 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-10 h-1 bg-orange-200 rounded-full" />
        </div>

        <div className="px-6 pb-10 flex flex-col items-center">
          {/* 图标 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center my-5 shadow-sm">
            {mode === "login" ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {mode === "login" ? "登录账号" : "注册账号"}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
            {mode === "login"
              ? "登录后可发布物品和使用私信功能"
              : "注册后即可发布物品和使用私信功能"}
          </p>

          {/* 注册模式：用户名 */}
          {mode === "register" && (
            <input
              type="text"
              value={inputName}
              onChange={(e) => { setInputName(e.target.value); setError(""); }}
              placeholder="用户名（如：张三）"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition mb-3"
            />
          )}

          {/* 邮箱 */}
          <input
            type="text"
            value={inputEmail}
            onChange={(e) => { setInputEmail(e.target.value); setError(""); }}
            placeholder="邮箱"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition mb-3"
          />

          {/* 密码 */}
          <input
            type="password"
            value={inputPassword}
            onChange={(e) => { setInputPassword(e.target.value); setError(""); }}
            placeholder="密码"
            onKeyDown={(e) => { if (e.key === "Enter" && mode === "login") handleSubmit(); }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition mb-3"
          />

          {/* 注册模式：确认密码 */}
          {mode === "register" && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
              placeholder="确认密码"
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition mb-3"
            />
          )}

          {/* 错误提示 */}
          {error && (
            <p className="w-full text-xs text-red-500 mb-2 pl-1">{error}</p>
          )}

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-gradient-primary text-white rounded-2xl font-semibold text-sm shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-[0.98] mt-1"
          >
            {mode === "login" ? "登录" : "注册"}
          </button>

          {/* 切换登录/注册 */}
          <button
            onClick={switchMode}
            className="text-sm text-orange-500 font-medium mt-4 hover:text-orange-600 transition"
          >
            {mode === "login" ? "没有账号？去注册" : "已有账号？去登录"}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-400 mt-2 hover:text-gray-500 transition"
          >
            稍后再说
          </button>
        </div>
      </div>
    </>
  );
}
