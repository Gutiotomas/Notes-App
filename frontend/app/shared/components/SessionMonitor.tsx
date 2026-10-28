import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  expireSession,
  INACTIVITY_TIMEOUT_MS,
  isSessionInactive,
  markSessionActivity,
} from "../utils/sessionService";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;

export const SessionMonitor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer: number;

    const closeExpiredSession = () => {
      expireSession();
      if (location.pathname !== "/login") navigate("/login", { replace: true });
    };

    const checkSession = () => {
      if (isSessionInactive()) closeExpiredSession();
    };

    const recordActivity = () => markSessionActivity();

    timer = window.setInterval(checkSession, 30_000);
    ACTIVITY_EVENTS.forEach((event) =>
      window.addEventListener(event, recordActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", checkSession);

    checkSession();

    return () => {
      window.clearInterval(timer);
      ACTIVITY_EVENTS.forEach((event) =>
        window.removeEventListener(event, recordActivity),
      );
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, [location.pathname, navigate]);

  return null;
};

export { INACTIVITY_TIMEOUT_MS };
