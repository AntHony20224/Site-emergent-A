import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext({ settings: null, services: [] });

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <SiteContext.Provider value={{ settings, services }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
