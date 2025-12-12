import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Role = "PATIENT" | "DOCTOR" | "ADMIN";
type User = { id: number; email: string; fullName: string; role: Role };
type AuthState = { user: User | null; accessToken: string | null; refreshToken: string | null };

type AuthCtx = AuthState & {
  signup: (data: { email: string; password: string; fullName: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { user: null, accessToken: null, refreshToken: null };
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(state));
  }, [state]);

  async function signup(data: { email: string; password: string; fullName: string }) {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).message || "Signup failed");
    // signup returns message only (verify email). Keep user logged out.
  }

  async function login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Login failed");

    setState({
      user: json.user,
      accessToken: json.accessToken,
      refreshToken: json.refreshToken,
    });
  }

  async function refresh() {
    if (!state.refreshToken) return;
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: state.refreshToken }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Refresh failed");

    setState((s) => ({ ...s, accessToken: json.accessToken }));
  }

  async function logout() {
    if (state.refreshToken) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });
    }
    setState({ user: null, accessToken: null, refreshToken: null });
  }

  // Optional: refresh token on app start
  useEffect(() => {
    if (state.refreshToken && !state.accessToken) {
      refresh().catch(() => {
        setState({ user: null, accessToken: null, refreshToken: null });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ ...state, signup, login, logout, refresh }),
    [state]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}