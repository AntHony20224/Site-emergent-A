import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/portfolio", label: "Portfólio" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" aria-label="Borcioni Design — Início" data-testid="nav-logo" onClick={() => setOpen(false)}>
          <img src="/assets/logo-h-branca.png" alt="Borcioni Design" className="h-8 sm:h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`}
              className={({ isActive }) =>
                `font-ui text-sm font-bold tracking-wide transition-colors duration-200 ${
                  isActive ? "text-[#A855F7]" : "text-white/80 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            data-testid="nav-cta-orcamento"
            className="font-ui text-sm font-extrabold bg-[#9333EA] hover:bg-[#A855F7] text-white rounded-full px-5 py-2.5 transition-colors duration-200 active:scale-95"
          >
            Solicitar orçamento
          </Link>
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

      {open && (
        <nav className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 px-5 py-6 flex flex-col gap-5" aria-label="Menu móvel" data-testid="nav-mobile-menu">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-ui text-base font-bold ${isActive ? "text-[#A855F7]" : "text-white/85"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            onClick={() => setOpen(false)}
            className="font-ui text-base font-extrabold bg-[#9333EA] text-white rounded-full px-5 py-3 text-center"
          >
            Solicitar orçamento
          </Link>
        </nav>
      )}
    </header>
  );
}
