import {
  Share2, Target, PenTool, Fingerprint, Printer, Mic, Store, Megaphone,
  ShoppingCart, Sparkles,
} from "lucide-react";

const ICONS = { Share2, Target, PenTool, Fingerprint, Printer, Mic, Store, Megaphone, ShoppingCart, Sparkles };

export function ServiceIcon({ name, size = 24, className = "" }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
