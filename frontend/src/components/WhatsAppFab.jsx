import { MessageCircle } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { whatsappUrl } from "@/lib/api";

export function WhatsAppFab() {
  const { settings } = useSite();
  if (!settings?.whatsapp_number) return null;

  return (
    <a
      href={whatsappUrl(settings.whatsapp_number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar no WhatsApp ${settings.whatsapp_display || ""}`}
      data-testid="whatsapp-fab"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:bg-[#1EBE5B] transition-colors duration-200"
    >
      <MessageCircle size={26} fill="currentColor" />
    </a>
  );
}
