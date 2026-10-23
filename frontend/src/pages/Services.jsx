import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Seo } from "@/components/Seo";
import { ServiceIcon } from "@/components/ServiceIcon";
import { useSite } from "@/context/SiteContext";

export default function Services() {
  const { services } = useSite();
  const highlight = services.find((s) => s.highlight);
  const regular = services.filter((s) => !s.highlight);

  return (
    <main className="bg-white">
      <Seo title="Serviços" description="Marketing para redes sociais, identidade visual, materiais gráficos, anúncios impulsionados e publicidade completa para supermercados." />

      <section className="bg-[#0A0A0A] pt-28 pb-14 sm:pt-32 sm:pb-16" data-testid="services-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-4">Serviços</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white max-w-2xl leading-[1.05]">
            Comunicação completa
          </h1>
          <p className="text-white/65 leading-relaxed max-w-xl mt-6">
            Do logotipo ao anúncio impulsionado, tudo com um só objetivo: fazer sua marca crescer.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20" data-testid="services-grid-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {highlight && (
              <article className="md:col-span-2 bg-white rounded-lg p-8 sm:p-10 border border-black/20" data-testid="service-highlight-card">
                <div className="w-12 h-12 rounded-lg bg-[#9333EA]/10 flex items-center justify-center text-[#9333EA] mb-6">
                  <ServiceIcon name={highlight.icon} size={28} />
                </div>
                <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#9333EA] mb-2">Especialidade da casa</p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-[#171717] mb-3">{highlight.title}</h2>
                <p className="text-[#525252] leading-relaxed max-w-2xl mb-8">{highlight.description}</p>
                <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {highlight.items?.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-ui text-sm font-bold text-[#171717]">
                      <span className="w-6 h-6 rounded-full bg-[#9333EA]/10 text-[#9333EA] flex items-center justify-center shrink-0">
                        <Check size={14} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {regular.map((s) => (
              <article
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className="bg-white border border-black/20 rounded-lg p-8 sm:p-10"
              >
                <div className="w-12 h-12 rounded-lg bg-[#9333EA]/10 flex items-center justify-center text-[#9333EA] mb-6">
                  <ServiceIcon name={s.icon} size={24} />
                </div>
                <h3 className="font-sub text-xl font-semibold text-[#171717] mb-3">{s.title}</h3>
                <p className="text-[#525252] leading-relaxed">{s.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/contato"
              data-testid="services-cta-orcamento"
              className="inline-flex items-center gap-2 font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-10 py-4 hover:bg-[#7E22CE] transition-colors duration-200 active:scale-95"
            >
              Pedir proposta para minha empresa <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
