import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Lightbulb, TrendingUp } from "lucide-react";
import { Seo } from "@/components/Seo";

const ABOUT_IMG = "https://images.unsplash.com/photo-1738676524296-364cf18900a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=80&w=1200&auto=format";

const VALUES = [
  { Icon: HeartHandshake, title: "Parceria de verdade", text: "Cada projeto é tratado como se fosse da nossa própria marca." },
  { Icon: Lightbulb, title: "Criatividade com propósito", text: "Cada escolha visual nasce de um objetivo claro." },
  { Icon: TrendingUp, title: "Mais valor, menos preço", text: "Qualidade de grande agência, investimento acessível." },
];

export default function About() {
  return (
    <main className="bg-white">
      <Seo title="Sobre" description="Conheça a Borcioni Design e Comunicação, estúdio de Sapiranga (RS) que acredita em mais valor, menos preço." />

      <section className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24" data-testid="about-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-4">Sobre nós</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              Um estúdio novo, com ambição de gigante
            </h1>
            <p className="text-white/65 leading-relaxed mt-6">
              A Borcioni Design e Comunicação nasceu em Sapiranga (RS) com uma convicção simples: boa comunicação não deveria ser privilégio de quem tem orçamento grande.
            </p>
          </div>
          <img src={ABOUT_IMG} alt="Ambiente de trabalho criativo do estúdio" className="rounded-lg border border-white/10 w-full aspect-[4/3] object-cover" loading="lazy" />
        </div>
      </section>

      <section className="py-24 sm:py-32" data-testid="about-story">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mb-8">Nossa história começa agora — e a sua pode vir junto</h2>
          <div className="space-y-6 text-[#525252] leading-relaxed">
            <p>
              Somos um estúdio em início de trajetória — e isso é uma vantagem: cada cliente recebe atenção total e o comprometimento de quem constrói sua reputação projeto a projeto.
            </p>
            <p>
              Atendemos Sapiranga e região, com carinho especial pelo varejo e pelos supermercados. Nosso posicionamento é claro: <strong className="text-[#171717]">mais valor, menos preço</strong> — qualidade de grande estúdio por um investimento que cabe na sua realidade.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-24 sm:py-32" data-testid="about-values">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mb-14">O que guia nosso trabalho</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map(({ Icon, title, text }) => (
              <article key={title} className="bg-white border border-black/10 rounded-lg p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-lg bg-[#9333EA]/10 flex items-center justify-center text-[#9333EA] mb-6">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="font-sub text-lg font-semibold text-[#171717] mb-2">{title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/contato"
              data-testid="about-cta-orcamento"
              className="inline-flex items-center gap-2 font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-10 py-4 hover:bg-[#7E22CE] transition-colors duration-200 active:scale-95"
            >
              Vamos conversar sobre sua marca <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
