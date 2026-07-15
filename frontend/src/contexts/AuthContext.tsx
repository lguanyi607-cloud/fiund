"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* 客户端挂载后从 localStorage 恢复登录态 */
  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem("fiund_logged_in") === "true");
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

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
