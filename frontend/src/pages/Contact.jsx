import { useState } from "react";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError, whatsappUrl } from "@/lib/api";
import { Seo } from "@/components/Seo";
import { useSite } from "@/context/SiteContext";

const BUDGET_OPTIONS = ["", "Até R$ 500", "R$ 500 a R$ 1.500", "R$ 1.500 a R$ 3.000", "Acima de R$ 3.000", "Prefiro conversar sobre isso"];

const initialForm = { name: "", company: "", email: "", whatsapp: "", services: [], budget: "", description: "" };

export default function Contact() {
  const { settings, services } = useSite();
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
      toast.success("Contato enviado com sucesso!");
    } catch (err) {
      toast.error(formatApiError(err, "Não foi possível enviar. Tente novamente."));
    } finally {
      setSending(false);
    }
  };

  const inputCls = "w-full font-ui text-sm rounded-lg border border-black/15 bg-white px-4 py-3 text-[#171717] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent transition-shadow";
  const labelCls = "block font-ui text-sm font-bold text-[#171717] mb-2";

  return (
    <main className="bg-[#FAFAFA]">
      <Seo title="Contato e Orçamento" description="Solicite um orçamento sem compromisso: identidade visual, redes sociais, impressos e publicidade para supermercados." />

      <section className="bg-[#0A0A0A] pt-32 pb-20 sm:pt-40 sm:pb-24" data-testid="contact-header">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#A855F7] mb-4">Contato</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white max-w-2xl leading-[1.05]">
            Vamos tirar sua ideia do papel
          </h1>
          <p className="text-white/65 leading-relaxed max-w-xl mt-6">
            Preencha o formulário ou chame no WhatsApp. Respondemos rápido e sem compromisso.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid gap-12 lg:grid-cols-3">
          {/* Info lateral */}
          <aside className="space-y-6">
            <div className="bg-[#0A0A0A] rounded-lg p-8">
              <h2 className="font-sub text-lg font-semibold text-white mb-6">Fale direto com a gente</h2>
              <ul className="space-y-5 text-sm">
                <li>
                  {settings?.whatsapp_number ? (
                    <a href={whatsappUrl(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/85 hover:text-white transition-colors" data-testid="contact-whatsapp-link">
                      <span className="w-10 h-10 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0"><MessageCircle size={18} /></span>
                      <span><span className="block font-ui font-extrabold">WhatsApp</span>{settings.whatsapp_display || settings.whatsapp_number}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-3 text-white/60"><MessageCircle size={18} /> WhatsApp em breve</span>
                  )}
                </li>
                <li>
                  {settings?.email ? (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-white/85 hover:text-white transition-colors" data-testid="contact-email-link">
                      <span className="w-10 h-10 rounded-lg bg-[#9333EA]/20 text-[#A855F7] flex items-center justify-center shrink-0"><Mail size={18} /></span>
                      <span><span className="block font-ui font-extrabold">E-mail</span>{settings.email}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-3 text-white/60"><Mail size={18} /> E-mail em breve</span>
                  )}
                </li>
                <li className="flex items-center gap-3 text-white/85">
                  <span className="w-10 h-10 rounded-lg bg-[#9333EA]/20 text-[#A855F7] flex items-center justify-center shrink-0"><MapPin size={18} /></span>
                  <span><span className="block font-ui font-extrabold">Região</span>Sapiranga (RS) e região</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#9333EA] rounded-lg p-8">
              <p className="font-display text-xl font-bold text-white leading-snug">Mais valor, menos preço.</p>
              <p className="text-white/80 text-sm mt-2 leading-relaxed">Proposta clara, sem letra miúda e sem compromisso.</p>
            </div>
          </aside>

          {/* Formulário */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white border border-[#9333EA]/30 rounded-lg p-12 text-center" data-testid="contact-success-message">
                <div className="w-14 h-14 rounded-full bg-[#9333EA]/10 text-[#9333EA] flex items-center justify-center mx-auto mb-6">
                  <Send size={24} />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#171717] mb-3">Recebemos seu contato!</h2>
                <p className="text-[#525252] leading-relaxed max-w-md mx-auto mb-8">
                  Obrigado pelo interesse. Vamos analisar sua ideia e retornar em breve pelo e-mail ou WhatsApp informado.
                </p>
                <button onClick={() => setSent(false)} className="font-ui text-sm font-extrabold text-[#9333EA] hover:text-[#7E22CE] transition-colors" data-testid="contact-send-another">
                  Enviar outro contato
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border border-black/10 rounded-lg p-8 sm:p-10" data-testid="contact-form">
                <h2 className="font-sub text-xl font-semibold text-[#171717] mb-8">Solicite um orçamento</h2>
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
                            ? "bg-[#9333EA] border-[#9333EA] text-white"
                            : "bg-white border-black/15 text-[#525252] hover:border-[#9333EA] hover:text-[#9333EA]"
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6">
                  <label htmlFor="budget" className={labelCls}>Orçamento estimado (opcional)</label>
                  <select id="budget" value={form.budget} onChange={set("budget")} className={inputCls} data-testid="contact-input-budget">
                    {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b || "Selecione…"}</option>)}
                  </select>
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className={labelCls}>Descrição do projeto *</label>
                  <textarea id="description" required rows={5} value={form.description} onChange={set("description")} placeholder="Conte um pouco sobre o que você precisa…" className={inputCls} data-testid="contact-input-description" />
                </div>

                <p className="text-xs text-[#525252] mt-4">
                  Ao enviar, você concorda com a nossa <a href="/privacidade" className="underline text-[#9333EA]">Política de Privacidade</a>. Seus dados são usados apenas para responder ao seu contato.
                </p>

                <button
                  type="submit"
                  disabled={sending}
                  data-testid="contact-submit-button"
                  className="mt-8 w-full sm:w-auto font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-10 py-4 hover:bg-[#7E22CE] transition-colors duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sending ? "Enviando…" : "Enviar solicitação"} <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
