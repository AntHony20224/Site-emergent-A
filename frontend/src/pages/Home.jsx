import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/Seo";
import { ServiceIcon } from "@/components/ServiceIcon";
import { Testimonials } from "@/components/Testimonials";
import { useSite } from "@/context/SiteContext";

const HERO_IMG = "https://images.unsplash.com/photo-1768729797971-472ce92e7a71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=80&w=1600&auto=format";

export default function Home() {
  const { services } = useSite();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get("/projects?featured=true").then((r) => setProjects(r.data.slice(0, 3))).catch(() => {});
    api.get("/testimonials").then((r) => setTestimonials(r.data)).catch(() => {});
  }, []);

  const highlight = services.find((s) => s.highlight);
  const topServices = services.filter((s) => !s.highlight).slice(0, 3);

  return (
    <main>
      <Seo description="Borcioni Design e Comunicação: identidade visual, redes sociais, impressos e publicidade para supermercados em Sapiranga (RS) e região. Mais valor, menos preço." />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center bg-[#0A0A0A]" data-testid="hero-section">
        <img src={HERO_IMG} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 w-full">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white max-w-3xl leading-[1.05] fade-up" data-testid="hero-slogan">
            Marcas que comunicam.<br />
            <span className="text-[#A855F7]">Ideias que permanecem.</span>
          </h1>
          <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-lg mt-7 fade-up" style={{ animationDelay: "0.2s" }} data-testid="hero-description">
            Design e comunicação que fazem sua empresa ser lembrada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 fade-up" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/portfolio"
              data-testid="hero-cta-projetos"
              className="font-ui font-extrabold text-sm border border-white/40 text-white rounded-full px-8 py-4 text-center hover:bg-white hover:text-black transition-colors duration-200 active:scale-95"
            >
              Conhecer projetos
            </Link>
            <Link
              to="/contato"
              data-testid="hero-cta-orcamento"
              className="font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-8 py-4 text-center hover:bg-[#A855F7] transition-colors duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              Solicitar orçamento <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* POSICIONAMENTO */}
      <section className="bg-[#9333EA] py-10" data-testid="positioning-strip">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          <BadgeCheck size={32} className="text-white shrink-0" aria-hidden="true" />
          <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Mais valor, menos preço — comunicação profissional ao alcance da sua empresa.
          </p>
        </div>
      </section>

      {/* QUEM SOMOS */}
      <section className="bg-white py-16 sm:py-20" data-testid="home-about-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="border border-black/10 rounded-lg p-8 sm:p-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <img src="/assets/logo-v-roxa.png" alt="Símbolo da Borcioni Design" className="h-16 w-auto shrink-0" />
            <div className="flex-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mb-2">Quem somos</h2>
              <p className="text-sm sm:text-base text-[#525252] leading-relaxed max-w-2xl">
                Estúdio de design e comunicação de Sapiranga (RS), atendendo toda a região. Criamos identidades visuais, campanhas e publicidade para pequenas e médias empresas.
              </p>
            </div>
            <Link to="/sobre" className="font-ui text-sm font-extrabold text-[#9333EA] hover:text-[#7E22CE] flex items-center gap-1 shrink-0 transition-colors" data-testid="home-about-link">
              Conhecer o estúdio <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS PREVIEW */}
      <section className="bg-[#FAFAFA] py-24 sm:py-32" data-testid="home-services-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#9333EA] mb-3">Serviços</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
                Tudo para sua marca ser vista
              </h2>
            </div>
            <Link to="/servicos" className="font-ui text-sm font-extrabold text-[#9333EA] hover:text-[#7E22CE] flex items-center gap-1 transition-colors" data-testid="home-services-link">
              Ver todos os serviços <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlight && (
              <article className="md:col-span-2 bg-[#0A0A0A] rounded-lg p-8 sm:p-10 border border-black" data-testid="home-service-highlight">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#9333EA] flex items-center justify-center text-white mb-6">
                    <ServiceIcon name={highlight.icon} size={24} />
                  </div>
                  <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-2">Especialidade da casa</p>
                  <h3 className="font-sub text-xl font-semibold text-white mb-3">{highlight.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed max-w-lg">{highlight.description}</p>
                </div>
                {highlight.items?.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-8">
                    {highlight.items.map((item) => (
                      <li key={item} className="font-ui text-xs font-bold text-white bg-white/10 rounded-full px-3 py-1.5">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            )}
            {topServices.map((s) => (
              <article key={s.id} className="bg-white border border-black/20 rounded-lg p-8" data-testid={`home-service-card-${s.id}`}>
                <div className="w-12 h-12 rounded-lg bg-[#0A0A0A] flex items-center justify-center text-white mb-6">
                  <ServiceIcon name={s.icon} size={24} />
                </div>
                <h3 className="font-sub text-lg font-semibold text-[#171717] mb-2">{s.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFÓLIO PREVIEW */}
      <section className="bg-[#0A0A0A] py-24 sm:py-32" data-testid="home-portfolio-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-3">Portfólio</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                Projetos em destaque
              </h2>
            </div>
            <Link to="/portfolio" className="font-ui text-sm font-extrabold text-[#A855F7] hover:text-white flex items-center gap-1 transition-colors" data-testid="home-portfolio-link">
              Ver portfólio completo <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                to={`/portfolio/${p.id}`}
                data-testid={`home-project-card-${p.id}`}
                className="relative rounded-lg overflow-hidden border border-white/10 aspect-[4/3] block"
              >
                <img src={p.cover_image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-ui text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-1">{p.category}</p>
                  <h3 className="font-sub text-lg font-semibold text-white">{p.title}</h3>
                </div>
                {p.is_demo && (
                  <span className="absolute top-4 left-4 font-ui text-[10px] font-extrabold uppercase tracking-widest bg-white/90 text-black rounded-full px-3 py-1">
                    Demonstrativo
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} />

      {/* CTA FINAL */}
      <section className="bg-[#0A0A0A] py-24 sm:py-32 border-t border-white/10" data-testid="home-cta-section">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-6">
            Sua marca pronta para ser lembrada?
          </h2>
          <p className="text-white/65 leading-relaxed max-w-xl mx-auto mb-10">
            Conte sua ideia e receba uma proposta sem compromisso.
          </p>
          <Link
            to="/contato"
            data-testid="home-cta-orcamento"
            className="inline-flex items-center gap-2 font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-10 py-4 hover:bg-[#A855F7] transition-colors duration-200 active:scale-95"
          >
            Solicitar orçamento <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
