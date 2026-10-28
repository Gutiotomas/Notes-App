import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_KEY = "authToken";
const LEGACY_TOKEN_KEY = "token";
const EXPIRED_NOTICE_KEY = "notes.session-expired";
const LAST_ACTIVITY_KEY = "notes.last-activity";

export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;

export const getStoredAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);

export const storeAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  markSessionActivity();
};

export const clearStoredSession = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

export const markSessionActivity = (): void => {
  if (getStoredAuthToken()) {
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

  const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
  return Number.isFinite(lastActivity) && lastActivity > 0
    ? Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS
    : false;
};

export const markSessionExpired = (): void => {
  sessionStorage.setItem(EXPIRED_NOTICE_KEY, "1");
};

export const consumeSessionExpiredNotice = (): boolean => {
  const expired = sessionStorage.getItem(EXPIRED_NOTICE_KEY) === "1";
  sessionStorage.removeItem(EXPIRED_NOTICE_KEY);
  return expired;
};

export const expireSession = (): void => {
  clearStoredSession();
  markSessionExpired();
};
