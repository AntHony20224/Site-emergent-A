import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";

const ABOUT_IMG = "https://images.unsplash.com/photo-1738676524296-364cf18900a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=80&w=1200&auto=format";

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
      <p className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-[#9333EA]">
        +{display}{suffix}
      </p>
      <p className="font-ui text-sm font-bold text-[#525252] mt-2">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <main className="bg-white">
      <Seo title="Sobre" description="Conheça a Borcioni Design e Comunicação, estúdio de Sapiranga (RS) que acredita em mais valor, menos preço." />

      <section className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24" data-testid="about-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-4">Quem somos</p>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              Um estúdio novo, com ambição de gigante
            </h1>
          </div>
          <img src={ABOUT_IMG} alt="Ambiente de trabalho criativo do estúdio" className="rounded-lg border border-white/10 w-full aspect-[4/3] object-cover" loading="lazy" />
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 border-b border-black/10" data-testid="about-stats">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STATS.map((s) => <Stat key={s.testid} {...s} />)}
        </div>
      </section>

      <section className="py-24 sm:py-32" data-testid="about-story">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="space-y-6 text-[#525252] leading-relaxed">
            <p>
              A Borcioni Design e Comunicação nasceu em 2024, em Sapiranga, no Rio Grande do Sul, a partir da paixão de seu fundador, Anthony Borcioni, pelo design digital, pela comunicação visual e pela construção de marcas. O que começou com projetos para amigos e empresas locais tornou-se uma iniciativa dedicada a transformar ideias em soluções criativas, unindo talento, dedicação e visão estratégica para ajudar negócios a conquistarem seu espaço no mercado.
            </p>
            <p>
              Em 2025, a participação na realização da Oktober Beer, em Sapiranga, evento que reuniu aproximadamente 1.500 pessoas, marcou um importante capítulo dessa trajetória. Desde então, a empresa vem ampliando sua experiência por meio de projetos para diferentes segmentos, como estéticas, choperias, distribuidoras e promotoras de eventos. Cada parceria representa uma oportunidade de explorar novas possibilidades, compreender diferentes mercados e contribuir para o crescimento de cada negócio.
            </p>
            <p>
              Acreditamos que o design vai muito além da estética: é uma ferramenta capaz de transmitir confiança, despertar interesse e tornar marcas memoráveis. Por isso, unimos criatividade, planejamento e execução para desenvolver soluções alinhadas à identidade e aos objetivos de nossos clientes, valorizando cada detalhe e buscando transformar a comunicação em um diferencial competitivo.
            </p>
            <p>
              Nossa história continua sendo construída a cada projeto, parceria e desafio, sempre guiada pela paixão pelo que fazemos e pelo compromisso de entregar valor. Afinal, vender envolve estratégia, dedicação e execução precisa, mas conquistar espaço no mercado exige também identidade, propósito e confiança.
            </p>
            <p className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#171717] pt-4">
              Nunca foi apenas sobre preço. Sempre foi sobre valor.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-24 sm:py-32" data-testid="about-cta">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-8">
            Vamos construir o próximo capítulo juntos?
          </h2>
          <Link
            to="/contato"
            data-testid="about-cta-orcamento"
            className="inline-flex items-center gap-2 font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-10 py-4 hover:bg-[#7E22CE] transition-colors duration-200 active:scale-95"
          >
            Vamos conversar sobre sua marca <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
