import { useEffect, useState } from "react";

export type RuntimeEvent = {
  type: string;
  ts: string;
  payload: any;
};

export function useEventStream() {
  const [events, setEvents] = useState<RuntimeEvent[]>([]);

  useEffect(() => {
    const base = import.meta.env.VITE_RUNTIME_URL || "";
    const es = new EventSource(`${base}/api/stream`);

    es.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        setEvents((prev) => [...prev.slice(-99), parsed]);
      } catch {}
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, []);

  return events;
}
