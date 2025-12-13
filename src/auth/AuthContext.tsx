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

import { auth } from "../../firebase";

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type BackendAuthResponse = {
  token: string;
  user?: any;
};

type AuthContextType = {
  user: FirebaseUser | null;
  loading: boolean;
  token: string | null;

  signup: (data: SignupInput) => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  refreshIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

function persistToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function persistUser(user: any | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

/**
 * Recommended: Exchange Firebase ID token -> Backend API JWT
 * You must have a backend endpoint for this, e.g. POST /api/auth/firebase
 * that validates the Firebase token and returns { token, user }.
 *
 * If you DO NOT have it yet, this function will throw and we will fallback
 * to using the Firebase idToken (not ideal for your requireAuth unless backend supports it).
 */
async function exchangeFirebaseTokenForApiToken(idToken: string): Promise<BackendAuthResponse> {
  const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!API_BASE) throw new Error("VITE_API_BASE_URL is not set");

  const res = await fetch(`${API_BASE}/api/auth/firebase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<BackendAuthResponse> & {
    message?: string;
  };

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Failed to exchange Firebase token");
  }

  return { token: data.token, user: data.user };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // Keep token in localStorage whenever it changes
  useEffect(() => {
    persistToken(token);
  }, [token]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setToken(null);
        persistUser(null);
        setLoading(false);
        return;
      }

      try {
        // 1) Get Firebase idToken
        const idToken = await getIdToken(firebaseUser, true);

        // 2) Try exchange -> backend API token (recommended for your requireAuth)
        try {
          const backend = await exchangeFirebaseTokenForApiToken(idToken);
          setToken(backend.token);

          // optional: store backend user for UI
          if (backend.user) persistUser(backend.user);
          else persistUser({ email: firebaseUser.email, name: firebaseUser.displayName });
        } catch {
          // 3) Fallback: store Firebase token (only works if backend accepts Firebase tokens)
          setToken(idToken);
          persistUser({ email: firebaseUser.email, name: firebaseUser.displayName });
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signup = async ({ fullName, email, password }: SignupInput) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    if (fullName?.trim()) {
      await updateProfile(cred.user, { displayName: fullName.trim() });
    }

    // onAuthStateChanged will run and set token
  };

  const login = async ({ email, password }: LoginInput) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will run and set token
    const idToken = await cred.user.getIdToken(true);
    await exchangeFirebaseTokenForApiToken(idToken);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const idToken = await cred.user.getIdToken(true);
    // onAuthStateChanged will run and set token
    await exchangeFirebaseTokenForApiToken(idToken);
  };

  const logout = async () => {
    await signOut(auth);
    setToken(null);
    persistUser(null);
  };

  // Returns the currently stored token (API token preferred; Firebase token fallback)
  const refreshIdToken = async () => {
    const u = auth.currentUser;
    if (!u) return null;

    // Force refresh Firebase idToken
    const idToken = await getIdToken(u, true);

    // Try to refresh backend token as well (recommended)
    try {
      const backend = await exchangeFirebaseTokenForApiToken(idToken);
      setToken(backend.token);
      if (backend.user) persistUser(backend.user);
      return backend.token;
    } catch {
      // fallback
      setToken(idToken);
      return idToken;
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      token,
      signup,
      login,
      loginWithGoogle,
      logout,
      refreshIdToken,
    }),
    [user, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}