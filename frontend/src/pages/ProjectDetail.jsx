import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Seo } from "@/components/Seo";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then((r) => setProject(r.data)).catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="bg-white min-h-screen pt-40 pb-24" data-testid="project-not-found">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h1 className="font-display text-3xl font-black text-[#171717] mb-4">Projeto não encontrado</h1>
          <Link to="/portfolio" className="font-ui font-bold text-[#9333EA]">Voltar ao portfólio</Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return <main className="bg-white min-h-screen pt-40 pb-24 px-5" data-testid="project-loading"><p className="text-[#525252] max-w-3xl mx-auto">Carregando projeto…</p></main>;
  }

  const gallery = [project.cover_image, ...(project.images || [])].filter(Boolean);

  return (
    <main className="bg-white">
      <Seo title={project.title} description={project.description} />

      <section className="relative pt-40 pb-24 bg-[#0A0A0A] overflow-hidden grain-overlay" data-testid="project-hero">
        <img src={project.cover_image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8">
          <Link to="/portfolio" className="inline-flex items-center gap-2 font-ui text-sm font-bold text-white/70 hover:text-white transition-colors mb-8" data-testid="project-back-link">
            <ArrowLeft size={16} /> Voltar ao portfólio
          </Link>
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-3">{project.category}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tighter text-white leading-[1.05]" data-testid="project-title">
            {project.title}
          </h1>
          {project.is_demo && (
            <p className="mt-5 inline-block font-ui text-xs font-extrabold uppercase tracking-widest bg-white/90 text-black rounded-full px-4 py-1.5" data-testid="project-demo-badge">
              Projeto demonstrativo — conceito do estúdio, não um cliente real
            </p>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24" data-testid="project-content">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <p className="text-lg text-[#171717] leading-relaxed mb-14" data-testid="project-description">{project.description}</p>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            {project.objective && (
              <div className="bg-[#FAFAFA] border border-black/10 rounded-lg p-8">
                <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">Objetivo</h2>
                <p className="text-[#525252] leading-relaxed" data-testid="project-objective">{project.objective}</p>
              </div>
            )}
            {project.solution && (
              <div className="bg-[#9333EA]/5 border border-[#9333EA]/20 rounded-lg p-8">
                <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">Solução</h2>
                <p className="text-[#525252] leading-relaxed" data-testid="project-solution">{project.solution}</p>
              </div>
            )}
          </div>

          {gallery.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2" data-testid="project-gallery">
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} — imagem ${i + 1}`}
                  loading="lazy"
                  className={`rounded-lg border border-black/10 object-cover w-full aspect-[4/3] ${gallery.length === 1 ? "sm:col-span-2" : ""}`}
                />
              ))}
            </div>
          )}

          <div className="mt-16 bg-[#0A0A0A] rounded-lg p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Gostou? Vamos criar o seu projeto.</h2>
            <Link
              to="/contato"
              data-testid="project-cta-orcamento"
              className="inline-flex items-center gap-2 font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-8 py-4 hover:bg-[#A855F7] transition-colors duration-200 active:scale-95"
            >
              Solicitar orçamento <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
