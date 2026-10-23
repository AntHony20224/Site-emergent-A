import { Seo } from "@/components/Seo";

export default function Terms() {
  return (
    <main className="bg-white">
      <Seo title="Termos de Uso" description="Termos de uso do site da Borcioni Design e Comunicação." />
      <section className="bg-[#0A0A0A] pt-28 pb-12 sm:pt-32 sm:pb-16" data-testid="terms-header">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">Termos de Uso</h1>
        </div>
      </section>
      <section className="py-12 sm:py-16" data-testid="terms-content">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8 text-[#525252] leading-relaxed">
          <p>Ao acessar o site da Borcioni Design e Comunicação, você concorda com os termos abaixo.</p>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">1. Conteúdo do site</h2>
            <p>As informações deste site têm caráter institucional e informativo. Projetos identificados como "demonstrativo" são conceitos do estúdio e não representam clientes reais.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">2. Propriedade intelectual</h2>
            <p>A marca, a identidade visual, as logotipos e os conteúdos deste site pertencem à Borcioni Design e Comunicação e não podem ser reproduzidos sem autorização prévia.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">3. Solicitações de orçamento</h2>
            <p>O envio de formulários de contato ou orçamento não gera obrigação de contratação por nenhuma das partes. Propostas comerciais são válidas somente quando formalizadas por escrito.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">4. Serviços</h2>
            <p>Os materiais gráficos para impressão são entregues como arte final digital; a impressão não está inclusa e é de responsabilidade do cliente contratar a gráfica.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">5. Responsabilidades</h2>
            <p>Envidamos esforços para manter o site disponível e atualizado, mas não garantimos funcionamento ininterrupto. Links para redes sociais e serviços de terceiros seguem as políticas dessas plataformas.</p>
          </div>

          <p className="text-sm text-[#A3A3A3]">Última atualização: outubro de 2025.</p>
        </div>
      </section>
    </main>
  );
}
