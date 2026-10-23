import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Seo } from "@/components/Seo";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then((r) => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["Todos", ...new Set(projects.map((p) => p.category))], [projects]);
  const visible = category === "Todos" ? projects : projects.filter((p) => p.category === category);

  return (
    <main className="bg-[#FAFAFA]">
      <Seo title="Portfólio" description="Projetos de identidade visual, campanhas, encartes e materiais gráficos criados pela Borcioni Design." />

      <section className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24 grain-overlay" data-testid="portfolio-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-4">Portfólio</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white max-w-2xl leading-[1.05]">
            Trabalhos que falam por nós
          </h1>
          <p className="text-white/65 leading-relaxed max-w-xl mt-6">
            Enquanto nossos projetos reais não são publicados, apresentamos conceitos demonstrativos que mostram o padrão de qualidade do estúdio.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24" data-testid="portfolio-grid-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Filtrar por categoria">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={category === c}
                data-testid={`portfolio-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCategory(c)}
                className={`font-ui text-sm font-bold rounded-full px-5 py-2.5 transition-colors duration-200 active:scale-95 ${
                  category === c
                    ? "bg-[#9333EA] text-white"
                    : "bg-white border border-black/10 text-[#525252] hover:border-[#9333EA] hover:text-[#9333EA]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-[#525252]" data-testid="portfolio-loading">Carregando projetos…</p>
          ) : visible.length === 0 ? (
            <div className="border border-dashed border-black/15 rounded-lg p-12 text-center bg-white" data-testid="portfolio-empty-state">
              <p className="font-sub text-lg font-medium text-[#171717]">Nenhum projeto nesta categoria ainda.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/portfolio/${p.id}`}
                  data-testid={`portfolio-card-${p.id}`}
                  className="group bg-white rounded-lg overflow-hidden border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-300 fade-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.cover_image} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {p.is_demo && (
                      <span className="absolute top-4 left-4 font-ui text-[10px] font-extrabold uppercase tracking-widest bg-white/90 text-black rounded-full px-3 py-1">
                        Demonstrativo
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="font-ui text-xs font-bold text-[#9333EA] uppercase tracking-wider mb-1">{p.category}</p>
                    <h2 className="font-sub text-lg font-semibold text-[#171717]">{p.title}</h2>
                    <p className="text-sm text-[#525252] mt-2 line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
