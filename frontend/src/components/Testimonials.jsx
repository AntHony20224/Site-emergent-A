import { useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function Stars({ value, size = 15 }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= value ? "text-[#171717]" : "text-black/20"} fill={i <= value ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function ReviewForm({ onSent }) {
  const [form, setForm] = useState({ name: "", email: "", text: "" });
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (rating < 1) { toast.error("Escolha de 1 a 5 estrelas"); return; }
    setSending(true);
    try {
      await api.post("/testimonials/public", { ...form, rating });
      toast.success("Avaliação enviada! Ela será publicada após análise.");
      onSent();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally { setSending(false); }
  };

  const inputCls = "w-full font-ui text-sm rounded-lg border border-black/15 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <form onSubmit={submit} className="space-y-4" data-testid="review-form">
      <div>
        <span className="block font-ui text-sm font-bold mb-2">Sua nota *</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Nota de 1 a 5 estrelas">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button" key={i} onClick={() => setRating(i)}
              role="radio" aria-checked={rating === i} aria-label={`${i} estrela${i > 1 ? "s" : ""}`}
              data-testid={`review-star-${i}`}
              className="p-1 transition-transform active:scale-90"
            >
              <Star size={26} className={i <= rating ? "text-[#171717]" : "text-black/20"} fill={i <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="rv-name" className="block font-ui text-sm font-bold mb-1.5">Nome *</label>
        <input id="rv-name" required minLength={2} maxLength={60} className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="review-name" />
      </div>
      <div>
        <label htmlFor="rv-email" className="block font-ui text-sm font-bold mb-1.5">E-mail * <span className="font-normal text-[#737373]">(não será exibido)</span></label>
        <input id="rv-email" type="email" required className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="review-email" />
      </div>
      <div>
        <label htmlFor="rv-text" className="block font-ui text-sm font-bold mb-1.5">Comentário *</label>
        <textarea id="rv-text" required minLength={10} maxLength={600} rows={4} className={`${inputCls} resize-none`} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} data-testid="review-text" />
      </div>
      <button type="submit" disabled={sending} className="w-full font-ui font-extrabold text-sm bg-[#0A0A0A] text-white rounded-full px-6 py-3.5 hover:bg-[#262626] transition-colors active:scale-95 disabled:opacity-60" data-testid="review-submit">
        {sending ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}

export function Testimonials({ items }) {
  const [open, setOpen] = useState(false);
  const real = items || [];
  const rated = real.filter((t) => t.rating >= 1);
  const average = rated.length ? (rated.reduce((s, t) => s + t.rating, 0) / rated.length) : null;

  return (
    <section className="bg-[#FAFAFA] py-14 sm:py-20" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#525252] mb-3">Feedbacks</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
              Quem confia, recomenda
            </h2>
            {average !== null && (
              <p className="flex items-center gap-2 mt-3" data-testid="testimonials-average">
                <Stars value={Math.round(average)} />
                <span className="font-ui text-sm font-bold text-[#171717]">{average.toFixed(1)}</span>
                <span className="font-ui text-xs text-[#737373]">({rated.length} avaliaç{rated.length === 1 ? "ão" : "ões"})</span>
              </p>
            )}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="font-ui text-sm font-extrabold border border-black/20 rounded-full px-6 py-3 hover:bg-black/5 transition-colors shrink-0" data-testid="review-open-button">
                Avaliar nosso trabalho
              </button>
            </DialogTrigger>
            <DialogContent data-testid="review-dialog">
              <DialogHeader><DialogTitle className="font-display">Avalie nosso trabalho</DialogTitle></DialogHeader>
              <ReviewForm onSent={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {real.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="testimonials-grid">
            {real.map((t) => (
              <figure
                key={t.id}
                data-testid={`testimonial-card-${t.id}`}
                className="bg-white border border-black/20 rounded-lg p-8"
              >
                {t.rating >= 1 && <Stars value={t.rating} />}
                <blockquote className="text-[#171717] text-sm leading-relaxed my-4">“{t.text}”</blockquote>
                <figcaption className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-ui font-extrabold text-sm text-[#171717] flex items-center gap-1.5">
                      {t.name}
                      {t.verified && <BadgeCheck size={14} className="text-[#171717]" aria-label="Avaliação verificada" role="img" />}
                    </p>
                    {t.company && <p className="font-ui text-xs text-[#525252] mt-0.5">{t.company}</p>}
                  </div>
                  {t.created_at && (
                    <time className="font-ui text-[10px] text-[#A3A3A3]" dateTime={t.created_at}>
                      {new Date(t.created_at).toLocaleDateString("pt-BR")}
                    </time>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div
            className="border border-dashed border-black/15 rounded-lg p-12 text-center bg-white"
            data-testid="testimonials-empty-state"
          >
            <p className="font-sub text-lg font-semibold text-[#171717] mb-2">Em breve, feedbacks de nossos parceiros.</p>
            <p className="text-sm text-[#525252] max-w-md mx-auto">
              Publicamos aqui apenas avaliações reais e autorizadas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
