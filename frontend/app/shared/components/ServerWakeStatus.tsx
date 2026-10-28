import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";

export const useServerWakeTimer = (active: boolean, thresholdMs = 2500) => {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!active) {
      setSeconds(null);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      if (elapsed >= thresholdMs) {
        setSeconds(Math.round(elapsed / 1000));
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [active, thresholdMs]);

  return seconds;
};

export const ServerWakeStatus = ({ seconds }: { seconds: number }) => (
  <div className="server-wake-status" role="status" aria-live="polite">
    <Spinner />
    <div>
      <strong>Waking the server</strong>
      <p>The first request of the day can take up to a minute while the server starts.</p>
      <small>
        Waiting {seconds} second{seconds === 1 ? "" : "s"}. Do not close this screen.
      </small>
    </div>
  </div>
);
