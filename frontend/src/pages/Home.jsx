import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { Seo } from "@/components/Seo";
import { ServiceIcon } from "@/components/ServiceIcon";
import { Testimonials } from "@/components/Testimonials";
import { useSite } from "@/context/SiteContext";

const HERO_IMG = "https://images.unsplash.com/photo-1768729797971-472ce92e7a71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=80&w=1600&auto=format";

const BUDGET_OPTIONS = ["", "Até R$ 500", "R$ 500 a R$ 1.500", "R$ 1.500 a R$ 3.000", "Acima de R$ 3.000", "Prefiro conversar sobre isso"];

// ---------------------------------------------------------------------------
// Contadores animados (Sobre)
// ---------------------------------------------------------------------------
const STATS = [
  { value: 10, suffix: "", label: "clientes satisfeitos", testid: "stat-clientes" },
  { value: 5, suffix: "", label: "setores diferentes", testid: "stat-setores" },
  { value: 500, suffix: " mil", label: "pessoas alcançadas", testid: "stat-alcance" },
];

function Stat({ value, suffix, label, testid }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1200;
      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center" data-testid={testid}>
      <p className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-[#171717]">
        +{display}{suffix}
      </p>
      <p className="font-ui text-sm font-bold text-[#525252] mt-2">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------
export default function Home() {
  const { services } = useSite();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [openService, setOpenService] = useState(null);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data)).catch(() => {});
    api.get("/testimonials").then((r) => setTestimonials(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const first = services.find((s) => s.highlight) || services[0];
    if (first) setOpenService((cur) => cur ?? first.id);
  }, [services]);

  const categories = ["Todos", ...new Set(projects.map((p) => p.category))];
  const visibleProjects = (category === "Todos" ? projects : projects.filter((p) => p.category === category)).slice(0, 6);

  return (
    <main>
      <Seo description="Borcioni Design e Comunicação: identidade visual, redes sociais, impressos e publicidade para supermercados em Sapiranga (RS) e região. Marcas que comunicam — valor em cada ação." />

      {/* HERO */}
      <section id="inicio" className="relative min-h-[88vh] flex items-center bg-[#0A0A0A]" data-testid="hero-section">
        <img src={HERO_IMG} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 w-full">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white max-w-3xl leading-[1.05] fade-up" data-testid="hero-slogan">
            Marcas que comunicam.<br />
            <span className="text-white underline decoration-white/30 underline-offset-8">Valor em cada ação.</span>
          </h1>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-lg mt-7 fade-up" style={{ animationDelay: "0.15s" }} data-testid="hero-description">
            Design e comunicação que fazem sua empresa ser lembrada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 fade-up" style={{ animationDelay: "0.25s" }}>
            <a
              href="#portfolio"
              data-testid="hero-cta-projetos"
              className="font-ui font-extrabold text-sm border border-white/40 text-white rounded-full px-8 py-4 text-center hover:bg-white hover:text-black transition-colors duration-200 active:scale-95"
            >
              Conhecer projetos
            </a>
            <a
              href="#contato"
              data-testid="hero-cta-orcamento"
              className="font-ui font-extrabold text-sm bg-white text-black rounded-full px-8 py-4 text-center hover:bg-neutral-200 transition-colors duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Solicitar orçamento <ArrowRight size={16} />
            </a>
          </div>
          <a href="#servicos" aria-label="Rolar para serviços" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors hidden sm:block">
            <ArrowDown size={22} />
          </a>
        </div>
      </section>

      {/* SERVIÇOS — catálogo interativo */}
      <section id="servicos" className="bg-white py-16 sm:py-24 scroll-mt-20" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#525252] mb-3">Serviços</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717] mb-4">
            O que fazemos
          </h2>
          <p className="text-[#525252] max-w-xl mb-12">Toque em um serviço para ver o que está incluído.</p>

          <div className="border-t border-black/15" data-testid="services-accordion">
            {services.map((s, i) => {
              const open = openService === s.id;
              return (
                <div key={s.id} className={`border-b border-black/15 transition-colors ${open ? (s.highlight ? "bg-[#0A0A0A]" : "bg-[#FAFAFA]") : "bg-white hover:bg-[#FAFAFA]"}`}>
                  <button
                    onClick={() => setOpenService(open ? null : s.id)}
                    aria-expanded={open}
                    data-testid={`service-row-${s.id}`}
                    className="w-full flex items-center gap-4 sm:gap-8 px-2 sm:px-6 py-6 text-left"
                  >
                    <span className={`font-display text-sm font-bold w-8 shrink-0 ${open && s.highlight ? "text-white/40" : "text-[#A3A3A3]"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight flex-1 ${open && s.highlight ? "text-white" : "text-[#171717]"}`}>
                      {s.title}
                    </span>
                    {s.highlight && (
                      <span className={`hidden sm:inline font-ui text-[10px] font-extrabold uppercase tracking-widest rounded-full px-3 py-1 ${open ? "bg-white/10 text-white" : "bg-black/5 text-[#525252]"}`}>
                        Especialidade
                      </span>
                    )}
                    <Plus size={22} className={`shrink-0 transition-transform duration-300 ${open ? `rotate-45 ${s.highlight ? "text-white" : "text-[#171717]"}` : "text-[#A3A3A3]"}`} aria-hidden="true" />
                  </button>

                  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="px-2 sm:px-6 pb-7 sm:pl-[72px] flex flex-col sm:flex-row gap-5 sm:gap-10 sm:items-start">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${open && s.highlight ? "bg-white/10 text-white" : "bg-[#0A0A0A] text-white"}`}>
                          <ServiceIcon name={s.icon} size={22} />
                        </div>
                        <div className="flex-1">
                          <p className={`leading-relaxed max-w-2xl ${open && s.highlight ? "text-white/75" : "text-[#525252]"}`}>
                            {s.description}
                          </p>
                          {s.items?.length > 0 && (
                            <ul className="flex flex-wrap gap-2 mt-4">
                              {s.items.map((item) => (
                                <li key={item} className={`font-ui text-xs font-bold rounded-full px-3 py-1.5 ${open && s.highlight ? "bg-white/10 text-white" : "bg-black/5 text-[#171717]"}`}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                          <a
                            href="#contato"
                            className={`inline-flex items-center gap-1.5 font-ui text-sm font-extrabold mt-5 ${open && s.highlight ? "text-white hover:text-white/70" : "text-[#171717] hover:text-[#525252]"} transition-colors`}
                            data-testid={`service-cta-${s.id}`}
                          >
                            Pedir orçamento deste serviço <ArrowRight size={15} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFÓLIO */}
      <section id="portfolio" className="bg-[#0A0A0A] py-16 sm:py-24 scroll-mt-20" data-testid="portfolio-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-white/50 mb-3">Portfólio</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-10">
            Trabalhos que falam por nós
          </h2>

          <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filtrar por categoria">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                data-testid={`portfolio-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`font-ui text-sm font-bold rounded-full px-5 py-2.5 transition-colors duration-200 active:scale-95 ${
                  category === c
                    ? "bg-white text-black"
                    : "bg-transparent border border-white/25 text-white/70 hover:border-white hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="border border-dashed border-white/15 rounded-lg p-12 text-center" data-testid="portfolio-empty-state">
              <p className="font-sub text-lg font-semibold text-white">Nenhum projeto nesta categoria ainda.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/portfolio/${p.id}`}
                  data-testid={`portfolio-card-${p.id}`}
                  className="group bg-white rounded-lg overflow-hidden block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.cover_image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    {p.is_demo && (
                      <span className="absolute top-4 left-4 font-ui text-[10px] font-extrabold uppercase tracking-widest bg-white/90 text-black rounded-full px-3 py-1">
                        Demonstrativo
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-ui text-xs font-bold text-[#525252] uppercase tracking-wider mb-1">{p.category}</p>
                    <h3 className="font-sub text-lg font-semibold text-[#171717]">{p.title}</h3>
                    <p className="text-sm text-[#525252] mt-2 line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-white py-16 sm:py-24 scroll-mt-20" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#525252] mb-3">Quem somos</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717] mb-14 max-w-2xl">
            Um estúdio novo, com ambição de gigante
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 border-y border-black/10 py-12 mb-14">
            {STATS.map((s) => <Stat key={s.testid} {...s} />)}
          </div>

          <div className="max-w-3xl space-y-6 text-[#525252] leading-relaxed">
            <p>
              A Borcioni Design e Comunicação nasceu em 2024, em Sapiranga (RS), da paixão do fundador Anthony Borcioni por design digital e construção de marcas. Em 2025, a participação na Oktober Beer — evento que reuniu cerca de 1.500 pessoas — marcou essa trajetória, que hoje segue por projetos em estéticas, choperias, distribuidoras e promotoras de eventos.
            </p>
            <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#171717] pt-2">
              Nunca foi apenas sobre preço. Sempre foi sobre valor.
            </p>
          </div>
        </div>
      </section>

      {/* FEEDBACKS */}
      <div id="feedbacks" className="scroll-mt-20">
        <Testimonials items={testimonials} />
      </div>

      {/* CONTATO */}
      <ContactSection services={services} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// Formulário de orçamento
// ---------------------------------------------------------------------------
const initialForm = { name: "", company: "", email: "", whatsapp: "", services: [], budget: "", description: "" };

function ContactSection({ services }) {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleService = (title) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(title) ? f.services.filter((s) => s !== title) : [...f.services, title],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/leads", form);
      setSent(true);
      setForm(initialForm);
      toast.success("Orçamento enviado com sucesso!");
    } catch (err) {
      toast.error(formatApiError(err, "Não foi possível enviar. Tente novamente."));
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full font-ui text-sm rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-shadow";
  const labelCls = "block font-ui text-sm font-bold text-white mb-2";

  return (
    <section id="contato" className="bg-[#0A0A0A] py-16 sm:py-24 scroll-mt-20" data-testid="contact-section">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-white/50 mb-3">Contato</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Solicite um orçamento
        </h2>
        <p className="text-white/60 mb-12 max-w-xl">
          Preencha e envie — sua solicitação chega direto no nosso e-mail e respondemos rápido.
        </p>

        {sent ? (
          <div className="border border-white/20 rounded-lg p-12 text-center" data-testid="contact-success-message">
            <div className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-6">
              <Send size={24} />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Recebemos seu pedido!</h3>
            <p className="text-white/60 leading-relaxed max-w-md mx-auto mb-8">
              Sua solicitação foi enviada para nossa equipe por e-mail. Retornaremos em breve.
            </p>
            <button onClick={() => setSent(false)} className="font-ui text-sm font-extrabold text-white hover:text-white/70 transition-colors" data-testid="contact-send-another">
              Enviar outra solicitação
            </button>
          </div>
        ) : (
          <form onSubmit={submit} data-testid="contact-form">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelCls}>Nome *</label>
                <input id="name" required value={form.name} onChange={set("name")} placeholder="Seu nome" className={inputCls} data-testid="contact-input-name" />
              </div>
              <div>
                <label htmlFor="company" className={labelCls}>Empresa</label>
                <input id="company" value={form.company} onChange={set("company")} placeholder="Nome da empresa" className={inputCls} data-testid="contact-input-company" />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>E-mail *</label>
                <input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="voce@empresa.com" className={inputCls} data-testid="contact-input-email" />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelCls}>WhatsApp *</label>
                <input id="whatsapp" required value={form.whatsapp} onChange={set("whatsapp")} placeholder="(51) 99999-9999" className={inputCls} data-testid="contact-input-whatsapp" />
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className={labelCls}>Serviços desejados</legend>
              <div className="flex flex-wrap gap-2" data-testid="contact-services-options">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => toggleService(s.title)}
                    aria-pressed={form.services.includes(s.title)}
                    data-testid={`contact-service-${s.id}`}
                    className={`font-ui text-xs font-bold rounded-full px-4 py-2 border transition-colors duration-200 active:scale-95 ${
                      form.services.includes(s.title)
                        ? "bg-white border-white text-black"
                        : "bg-transparent border-white/25 text-white/70 hover:border-white hover:text-white"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label htmlFor="budget" className={labelCls}>Orçamento estimado (opcional)</label>
              <select id="budget" value={form.budget} onChange={set("budget")} className={`${inputCls} [&>option]:text-black`} data-testid="contact-input-budget">
                {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b || "Selecione…"}</option>)}
              </select>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className={labelCls}>Descrição do projeto *</label>
              <textarea id="description" required rows={5} value={form.description} onChange={set("description")} placeholder="Conte um pouco sobre o que você precisa…" className={`${inputCls} resize-none`} data-testid="contact-input-description" />
            </div>

            <p className="text-xs text-white/40 mt-4">
              Ao enviar, você concorda com a nossa <Link to="/privacidade" className="underline text-white/70">Política de Privacidade</Link>. Seus dados são usados apenas para responder ao seu contato.
            </p>

            <button
              type="submit"
              disabled={sending}
              data-testid="contact-submit-button"
              className="mt-8 w-full sm:w-auto font-ui font-extrabold text-sm bg-white text-black rounded-full px-10 py-4 hover:bg-neutral-200 transition-colors duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {sending ? "Enviando…" : "Enviar solicitação"} <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
