"use client";

import { useAuth } from "@/contexts/AuthContext";

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ open, onClose }: LoginPromptModalProps) {
  const { login } = useAuth();

  function handleLogin() {
    login();
    onClose();
  }

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-3xl z-50 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pb-8 flex flex-col items-center">
          {/* 锁图标 */}
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center my-4">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-1">需要登录</h2>
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            登录账号后即可发布物品和使用私信功能
          </p>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition active:scale-[0.98]"
          >
            立即登录
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-400 mt-2"
          >
            稍后再说
          </button>

          <p className="text-xs text-gray-300 mt-3">
            后续将接入 Supabase Auth 实现真实登录
          </p>
        </div>
      </div>
    </>
  );
}
