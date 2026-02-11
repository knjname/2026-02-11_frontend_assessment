import { proxy } from "valtio";
import type { User } from "@app/api";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

function getSavedToken(): string | null {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

const savedToken = getSavedToken();

export const authStore = proxy<AuthState>({
  user: null,
  token: savedToken,
  isAuthenticated: false,
});

export function setAuth(user: User, token: string) {
  authStore.user = user;
  authStore.token = token;
  authStore.isAuthenticated = true;
  try {
    localStorage.setItem("auth_token", token);
  } catch {
    // noop
  }
}

export function clearAuth() {
  authStore.user = null;
  authStore.token = null;
  authStore.isAuthenticated = false;
  try {
    localStorage.removeItem("auth_token");
  } catch {
    // noop
  }
}
