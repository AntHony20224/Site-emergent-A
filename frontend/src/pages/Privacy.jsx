import { Seo } from "@/components/Seo";

export default function Privacy() {
  return (
    <main className="bg-white">
      <Seo title="Política de Privacidade" description="Como a Borcioni Design e Comunicação coleta, usa e protege seus dados pessoais, em conformidade com a LGPD." />
      <section className="bg-[#0A0A0A] pt-32 pb-16 sm:pt-40 sm:pb-20" data-testid="privacy-header">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tighter text-white">Política de Privacidade</h1>
        </div>
      </section>
      <section className="py-16 sm:py-24" data-testid="privacy-content">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-8 text-[#525252] leading-relaxed">
          <p>A Borcioni Design e Comunicação respeita a sua privacidade e trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">1. Dados que coletamos</h2>
            <p>Ao preencher nossos formulários de contato ou orçamento, coletamos: nome, empresa (opcional), e-mail, número de WhatsApp, serviços de interesse, orçamento estimado (opcional) e a descrição do projeto.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">2. Como usamos seus dados</h2>
            <p>Os dados são usados exclusivamente para responder à sua solicitação, elaborar propostas e manter contato sobre o projeto solicitado. Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">3. Armazenamento e segurança</h2>
            <p>As informações são armazenadas em banco de dados protegido, com acesso restrito à administração do site, autenticada por senha com criptografia.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">4. Seus direitos</h2>
            <p>Você pode solicitar a qualquer momento a confirmação, correção ou exclusão dos seus dados pessoais entrando em contato pelo e-mail borcionidesign@gmail.com.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">5. Cookies</h2>
            <p>Este site não utiliza cookies de rastreamento publicitário. Apenas recursos técnicos essenciais ao funcionamento podem ser utilizados.</p>
          </div>

          <div>
            <h2 className="font-sub text-xl font-semibold text-[#171717] mb-3">6. Alterações</h2>
            <p>Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página.</p>
          </div>

          <p className="text-sm text-[#A3A3A3]">Última atualização: outubro de 2025.</p>
        </div>
      </section>
    </main>
  );
}
