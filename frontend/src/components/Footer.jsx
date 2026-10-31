import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { whatsappUrl } from "@/lib/api";
import { BrandIcon } from "@/components/BrandIcons";

export function Footer() {
  const { settings } = useSite();
  const year = new Date().getFullYear();
  const wa = settings?.whatsapp_number ? whatsappUrl(settings.whatsapp_number) : "#";

  const socials = [
    { label: "Instagram", url: "https://instagram.com/borcionidesign", icon: "instagram" },
    { label: "Facebook", url: "https://facebook.com/borcionidesign", icon: "facebook" },
    { label: "WhatsApp", url: wa, icon: "whatsapp" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-12 md:grid-cols-3">
        <div>
          <img src="/assets/logo-h-branca.png" alt="Borcioni Design" className="h-10 w-auto mb-5" />
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Marcas que comunicam — valor em cada ação. Design e comunicação em Sapiranga (RS) e região.
          </p>
        </div>

        <div>
          <h3 className="font-sub text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-5">Navegação</h3>
          <ul className="space-y-3 font-ui text-sm font-semibold">
            <li><a href="#servicos" className="text-white/80 hover:text-white transition-colors">Serviços</a></li>
            <li><a href="#portfolio" className="text-white/80 hover:text-white transition-colors">Portfólio</a></li>
            <li><a href="#sobre" className="text-white/80 hover:text-white transition-colors">Sobre</a></li>
            <li><a href="#contato" className="text-white/80 hover:text-white transition-colors">Contato e orçamento</a></li>
            <li><Link to="/privacidade" className="text-white/80 hover:text-white transition-colors">Política de Privacidade</Link></li>
            <li><Link to="/termos" className="text-white/80 hover:text-white transition-colors">Termos de Uso</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-5">Contato</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <BrandIcon name="whatsapp" size={16} className="text-white/70" />
              {settings?.whatsapp_number ? (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-testid="footer-whatsapp-link">
                  {settings.whatsapp_display || settings.whatsapp_number}
                </a>
              ) : "WhatsApp em breve"}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-white/70" />
              <a href="mailto:borcionidesign@gmail.com" className="hover:text-white transition-colors" data-testid="footer-email-link">borcionidesign@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-white/70" />
              Sapiranga (RS) e região
            </li>
          </ul>
          <div className="flex gap-3 mt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} da Borcioni Design`}
                title={s.label}
                data-testid={`footer-social-${s.icon}`}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white hover:bg-white/10 transition-colors duration-200"
              >
                <BrandIcon name={s.icon} size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40 font-ui">
        © {year} Borcioni Design e Comunicação. Todos os direitos reservados.
      </div>
    </footer>
  );
}
