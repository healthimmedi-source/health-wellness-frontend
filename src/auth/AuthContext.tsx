import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getIdToken,
  type User as FirebaseUser,
} from "firebase/auth";

import { auth } from "../../firebase"; // ✅ FIX: this is why "auth" was undefined

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function syncUserToBackend() {
  // Optional: only if your backend supports it
  const API_URL = import.meta.env.VITE_API_URL as string | undefined;
  if (!API_URL) return;

  const user = auth.currentUser;
  if (!user) return;

  const token = await getIdToken(user, true);

  await fetch(`${API_URL}/auth/firebase/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      // optional payload; backend can also decode token for these
      email: user.email,
      fullName: user.displayName,
      uid: user.uid,
    }),
  }).catch(() => {
    // keep non-blocking; sync failure should not break login/signup
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Optional backend sync on session change
      if (firebaseUser) {
        await syncUserToBackend();
      }
    });

    return () => unsub();
  }, []);

  const signup = async ({ fullName, email, password }: SignupInput) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name
    if (fullName?.trim()) {
      await updateProfile(cred.user, { displayName: fullName.trim() });
    }

    // Optional backend sync
    await syncUserToBackend();
  };

  const login = async ({ email, password }: LoginInput) => {
    await signInWithEmailAndPassword(auth, email, password);
    await syncUserToBackend();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await syncUserToBackend();
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshIdToken = async () => {
    const u = auth.currentUser;
    if (!u) return null;
    return await getIdToken(u, true);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      refreshIdToken,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}