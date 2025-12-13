import { auth } from "../../firebase";

/**
 * apiFetch:
 * - Uses VITE_API_URL (example: http://localhost:4000 OR your Vercel backend URL)
 * - Automatically attaches Firebase ID token:
 *      Authorization: Bearer <firebase_id_token>
 */
export function useApi() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  return async function apiFetch(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers || {});
    headers.set("Content-Type", "application/json");

    // Attach Firebase token if logged in
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); // auto refresh handled by Firebase
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });

    return res;
  };
}