import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const SiteContext = createContext({ settings: null, services: [] });

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data)).catch(() => {});
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
    api.get("/social-profiles").then((r) => setSocials(r.data)).catch(() => {});
  }, []);

  return (
    <SiteContext.Provider value={{ settings, services, socials }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
