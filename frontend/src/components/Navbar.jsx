import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <a href="#inicio" aria-label="Borcioni Design — Início" data-testid="nav-logo" onClick={() => setOpen(false)}>
          <img src="/assets/logo-h-branca.png" alt="Borcioni Design" className="h-8 sm:h-10 w-auto" />
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`}
              className="font-ui text-sm font-bold tracking-wide text-white/70 hover:text-white transition-colors duration-200 hover:underline underline-offset-8 decoration-2"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            data-testid="nav-cta-orcamento"
            className="font-ui text-sm font-extrabold bg-white text-black hover:bg-neutral-200 rounded-full px-5 py-2.5 transition-colors duration-200 active:scale-95"
          >
            Solicitar orçamento
          </a>
        </nav>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu móvel em tela cheia, estilo editorial */}
      {open && (
        <nav className="md:hidden fixed inset-0 top-16 bg-black z-40 px-8 py-10 flex flex-col gap-2" aria-label="Menu móvel" data-testid="nav-mobile-menu">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-black text-white/85 hover:text-white py-3 border-b border-white/10 tracking-tight fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="font-ui text-base font-extrabold bg-white text-black rounded-full px-6 py-4 text-center mt-6"
            data-testid="nav-mobile-cta"
          >
            Solicitar orçamento
          </a>
        </nav>
      )}
    </header>
  );
}
