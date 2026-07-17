"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  email: string;
  avatar: string | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, password: string, email: string) => boolean;
  logout: () => void;
  setUsername: (name: string) => void;
  setAvatar: (dataUrl: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: "校园用户",
  email: "",
  avatar: null,
  login: () => false,
  register: () => false,
  logout: () => {},
  setUsername: () => {},
  setAvatar: () => {},
});

/** 头像映射 */
function loadAvatarMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem("fiund_avatars");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("[Auth] 加载头像数据失败:", e);
    return {};
  }
}

function saveAvatarForUser(username: string, dataUrl: string | null) {
  const map = loadAvatarMap();
  if (dataUrl) map[username] = dataUrl;
  else delete map[username];
  localStorage.setItem("fiund_avatars", JSON.stringify(map));
}

/** 用户表：按邮箱索引 → { username, password } */
interface UserRecord {
  username: string;
  password: string;
}

function loadUsers(): Record<string, UserRecord> {
  try {
    const raw = localStorage.getItem("fiund_users");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("[Auth] 加载用户数据失败:", e);
    return {};
  }
}

function saveUsers(users: Record<string, UserRecord>) {
  localStorage.setItem("fiund_users", JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsernameState] = useState("校园用户");
  const [email, setEmailState] = useState("");
  const [avatar, setAvatarState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("fiund_logged_in") === "true";
      setIsLoggedIn(loggedIn);

      const savedName = localStorage.getItem("fiund_username");
      const savedEmail = localStorage.getItem("fiund_email") || "";
      const currentName = savedName || "校园用户";
      if (savedName) setUsernameState(savedName);
      if (savedEmail) setEmailState(savedEmail);

      if (loggedIn) {
        const map = loadAvatarMap();
        if (map[currentName]) setAvatarState(map[currentName]);
      }
    } catch (e) {
      console.warn("[Auth] 恢复登录状态失败:", e);
    }
  }, []);

  function register(name: string, password: string, emailAddress: string): boolean {
    const users = loadUsers();
    if (users[emailAddress]) return false; // 邮箱已注册
    users[emailAddress] = { username: name, password };
    saveUsers(users);

    setIsLoggedIn(true);
    setUsernameState(name);
    setEmailState(emailAddress);
    try {
      localStorage.setItem("fiund_logged_in", "true");
      localStorage.setItem("fiund_username", name);
      localStorage.setItem("fiund_email", emailAddress);
    } catch {}
    setAvatarState(null);
    return true;
  }

  function login(emailAddr: string, password: string): boolean {
    const trimmed = typeof emailAddr === "string" ? emailAddr.trim() : "";
    if (!trimmed) return false;

    const users = loadUsers();
    const user = users[trimmed];
    if (!user) return false; // 邮箱未注册
    if (user.password !== password) return false;

    setIsLoggedIn(true);
    setUsernameState(user.username);
    setEmailState(trimmed);
    try {
      localStorage.setItem("fiund_logged_in", "true");
      localStorage.setItem("fiund_username", user.username);
      localStorage.setItem("fiund_email", trimmed);
    } catch {}
    const map = loadAvatarMap();
    setAvatarState(map[user.username] || null);
    return true;
  }

  function logout() {
    setIsLoggedIn(false);
    setAvatarState(null);
    setUsernameState("校园用户");
    setEmailState("");
    try {
      localStorage.removeItem("fiund_logged_in");
      localStorage.removeItem("fiund_username");
      localStorage.removeItem("fiund_email");
    } catch {}
  }

  function setUsername(name: string) {
    setUsernameState(name);
    try { localStorage.setItem("fiund_username", name); } catch {}
    const map = loadAvatarMap();
    setAvatarState(map[name] || null);
  }

  function setAvatar(dataUrl: string | null) {
    setAvatarState(dataUrl);
    if (isLoggedIn) {
      try {
        saveAvatarForUser(username, dataUrl);
      } catch {}
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, email, avatar, login, register, logout, setUsername, setAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
