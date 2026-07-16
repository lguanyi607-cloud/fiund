"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  avatar: string | null;
  login: () => void;
  logout: () => void;
  setUsername: (name: string) => void;
  setAvatar: (dataUrl: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: "校园用户",
  avatar: null,
  login: () => {},
  logout: () => {},
  setUsername: () => {},
  setAvatar: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsernameState] = useState("校园用户");
  const [avatar, setAvatarState] = useState<string | null>(null);

  /* 客户端挂载后从 localStorage 恢复登录态、用户名、头像 */
  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem("fiund_logged_in") === "true");
      const savedName = localStorage.getItem("fiund_username");
      if (savedName) setUsernameState(savedName);
      const savedAvatar = localStorage.getItem("fiund_avatar");
      if (savedAvatar) setAvatarState(savedAvatar);
    } catch {}
  }, []);

  function login() {
    setIsLoggedIn(true);
    try { localStorage.setItem("fiund_logged_in", "true"); } catch {}
  }

  function logout() {
    setIsLoggedIn(false);
    try { localStorage.removeItem("fiund_logged_in"); } catch {}
  }

  function setUsername(name: string) {
    setUsernameState(name);
    try { localStorage.setItem("fiund_username", name); } catch {}
  }

  function setAvatar(dataUrl: string | null) {
    setAvatarState(dataUrl);
    try {
      if (dataUrl) {
        localStorage.setItem("fiund_avatar", dataUrl);
      } else {
        localStorage.removeItem("fiund_avatar");
      }
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, avatar, login, logout, setUsername, setAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
