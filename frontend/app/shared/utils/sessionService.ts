import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_KEY = "authToken";
const LEGACY_TOKEN_KEY = "token";
const EXPIRED_NOTICE_KEY = "notes.session-expired";
const LAST_ACTIVITY_KEY = "notes.last-activity";

export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

const inBrowser = (): boolean =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

export const getStoredAuthToken = (): string | null => {
  if (!inBrowser()) return null;
  return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
};

export const storeAuthToken = (token: string): void => {
  if (!inBrowser()) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  markSessionActivity();
};

export const clearStoredSession = (): void => {
  if (!inBrowser()) return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

export const markSessionActivity = (): void => {
  if (inBrowser() && getStoredAuthToken()) {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  }
};

export const getTokenExpiration = (token = getStoredAuthToken()): number | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isSessionInactive = (): boolean => {
  const token = getStoredAuthToken();
  if (!token) return false;

  const expiration = getTokenExpiration(token);
  if (expiration !== null && expiration <= Date.now()) return true;

  const lastActivity = inBrowser()
    ? Number(localStorage.getItem(LAST_ACTIVITY_KEY))
    : 0;
  return Number.isFinite(lastActivity) && lastActivity > 0
    ? Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS
    : false;
};

export const markSessionExpired = (): void => {
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(EXPIRED_NOTICE_KEY, "1");
  }
};

export const consumeSessionExpiredNotice = (): boolean => {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return false;
  }
  const expired = sessionStorage.getItem(EXPIRED_NOTICE_KEY) === "1";
  sessionStorage.removeItem(EXPIRED_NOTICE_KEY);
  return expired;
};

export const expireSession = (): void => {
  clearStoredSession();
  markSessionExpired();
};
