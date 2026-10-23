import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Mail, MapPin } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { whatsappUrl } from "@/lib/api";
import { MessageCircle } from "lucide-react";

export function Footer() {
  const { settings } = useSite();
  const year = new Date().getFullYear();

  const socials = [
    { label: "Instagram", url: settings?.instagram, Icon: Instagram, testid: "footer-social-instagram" },
    { label: "Facebook", url: settings?.facebook, Icon: Facebook, testid: "footer-social-facebook" },
    { label: "LinkedIn", url: settings?.linkedin, Icon: Linkedin, testid: "footer-social-linkedin" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-12 md:grid-cols-3">
        <div>
          <img src="/assets/logo-h-branca.png" alt="Borcioni Design" className="h-10 w-auto mb-5" />
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Marcas que comunicam. Ideias que permanecem. Valor em cada ação — Sapiranga (RS) e região.
          </p>
        </div>

        <div>
          <h3 className="font-sub text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-5">Navegação</h3>
          <ul className="space-y-3 font-ui text-sm font-semibold">
            <li><Link to="/servicos" className="text-white/80 hover:text-[#A855F7] transition-colors">Serviços</Link></li>
            <li><Link to="/portfolio" className="text-white/80 hover:text-[#A855F7] transition-colors">Portfólio</Link></li>
            <li><Link to="/sobre" className="text-white/80 hover:text-[#A855F7] transition-colors">Sobre</Link></li>
            <li><Link to="/contato" className="text-white/80 hover:text-[#A855F7] transition-colors">Contato e orçamento</Link></li>
            <li><Link to="/privacidade" className="text-white/80 hover:text-[#A855F7] transition-colors">Política de Privacidade</Link></li>
            <li><Link to="/termos" className="text-white/80 hover:text-[#A855F7] transition-colors">Termos de Uso</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sub text-sm font-bold uppercase tracking-[0.2em] text-white/50 mb-5">Contato</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-[#A855F7]" />
              {settings?.whatsapp_number ? (
                <a href={whatsappUrl(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-testid="footer-whatsapp-link">
                  {settings.whatsapp_display || settings.whatsapp_number}
                </a>
              ) : "WhatsApp em breve"}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#A855F7]" />
              {settings?.email ? (
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors" data-testid="footer-email-link">{settings.email}</a>
              ) : "E-mail em breve"}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-[#A855F7]" />
              Sapiranga (RS) e região
            </li>
          </ul>
          <div className="flex gap-3 mt-6">
            {socials.map(({ label, url, Icon, testid }) => (
              <a
                key={label}
                href={url || "#"}
                target={url ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={`${label} da Borcioni Design${url ? "" : " (link em breve)"}`}
                title={url ? label : `${label} — em breve`}
                data-testid={testid}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-[#9333EA] hover:bg-[#9333EA]/20 transition-colors duration-200"
              >
                <Icon size={18} />
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
