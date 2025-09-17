import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import backend from "../config/backend";

const useAnalytics = () => {
  const location = useLocation();
  const activeTimeRef = useRef(0);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const updateActivity = () => {
      const now = Date.now();
      activeTimeRef.current += (now - lastActivityRef.current) / 1000; // tiempo en segundos
      lastActivityRef.current = now;
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    // Evento inicial al cargar la página
    fetch(`${backend}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: "pageview",
        page: location.pathname,
        user_agent: navigator.userAgent,
        referer: document.referrer,
      }),
    });

    const interval = setInterval(() => {
      // cada 10s enviamos tiempo activo
      fetch(`${backend}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "active_time",
          page: location.pathname,
          duration_seconds: Math.floor(activeTimeRef.current),
          user_agent: navigator.userAgent,
          referer: document.referrer,
        }),
      });
      activeTimeRef.current = 0; // reiniciamos contador
    }, 10000);

    const handleUnload = () => {
      navigator.sendBeacon(
        `${backend}/analytics`,
        JSON.stringify({
          event_type: "session_end",
          page: location.pathname,
          duration_seconds: Math.floor(activeTimeRef.current),
          user_agent: navigator.userAgent,
          referer: document.referrer,
        })
      );
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      events.forEach((e) => window.removeEventListener(e, updateActivity));
    };
  }, [location.pathname]);
};

export default useAnalytics;
