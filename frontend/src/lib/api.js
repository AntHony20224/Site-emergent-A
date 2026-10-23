import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bd_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function formatApiError(error, fallback = "Algo deu errado. Tente novamente.") {
  const detail = error?.response?.data?.detail;
  if (!detail) return error?.message || fallback;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || "").filter(Boolean).join(" ");
  return fallback;
}

export function whatsappUrl(number, message) {
  const text = encodeURIComponent(message || "Olá! Vim pelo site da Borcioni Design e gostaria de mais informações.");
  return `https://wa.me/${(number || "").replace(/\D/g, "")}?text=${text}`;
}
