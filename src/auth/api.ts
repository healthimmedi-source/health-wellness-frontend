import { useAuth } from "./AuthContext";

export function useApi() {
  const { accessToken, refresh } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  return async function apiFetch(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers || {});
    headers.set("Content-Type", "application/json");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    let res = await fetch(`${API_URL}${path}`, { ...init, headers });

    if (res.status === 401) {
      await refresh();
      // retry once
      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set("Content-Type", "application/json");
      // accessToken updated in state; easiest is to just reload from storage:
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (auth.accessToken) retryHeaders.set("Authorization", `Bearer ${auth.accessToken}`);
      res = await fetch(`${API_URL}${path}`, { ...init, headers: retryHeaders });
    }

    return res;
  };
}