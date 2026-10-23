import { useEffect } from "react";

const DEFAULT_TITLE = "Borcioni Design e Comunicação";

export function Seo({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : `${DEFAULT_TITLE} — Marcas que comunicam. Ideias que permanecem.`;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", description);
    }
  }, [title, description]);
  return null;
}
