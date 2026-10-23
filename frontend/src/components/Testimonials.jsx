export function Testimonials({ items }) {
  return (
    <section className="bg-[#FAFAFA] py-24 sm:py-32" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-[#9333EA] mb-3">Depoimentos</p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717] mb-12">
          Quem confia, recomenda
        </h2>

        {items && items.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="testimonials-grid">
            {items.map((t) => (
              <figure
                key={t.id}
                data-testid={`testimonial-card-${t.id}`}
                className="bg-white border border-black/10 rounded-lg p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-300"
              >
                <blockquote className="text-[#171717] leading-relaxed mb-6">“{t.text}”</blockquote>
                <figcaption>
                  <p className="font-ui font-extrabold text-sm text-[#171717]">{t.name}</p>
                  {t.company && <p className="font-ui text-xs text-[#525252] mt-0.5">{t.company}</p>}
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
              Publicamos aqui apenas depoimentos reais e autorizados.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
