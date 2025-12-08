import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "PATIENT" | "DOCTOR" | "ADMIN";

interface User {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // TEMP: fake login (no backend yet)
  const login = async (email: string, _password: string) => {
    setUser({
      id: 1,
      email,
      role: "PATIENT",
    });
  };

  // TEMP: fake register then login
  const register = async (fullName: string, email: string, _password: string) => {
    console.log("Registered full name:", fullName);
    setUser({
      id: 1,
      email,
      role: "PATIENT",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
