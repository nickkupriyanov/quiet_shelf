type DailyQuoteProps = {
  quote: string;
  bookTitle: string;
  author: string;
};

export function DailyQuote({ quote, bookTitle, author }: DailyQuoteProps) {
  return (
    <section className="quiet-panel rounded-[22px] bg-lilac/70 p-4">
      <p className="text-sm font-bold text-secondary">Цитата дня</p>
      <blockquote className="mt-3 text-xl font-black leading-snug text-primary">
        {quote}
      </blockquote>
      <div className="mt-4 rounded-[14px] bg-card/80 p-3">
        <p className="text-sm font-black text-primary">{bookTitle}</p>
        <p className="mt-1 text-sm font-semibold text-secondary">{author}</p>
      </div>
    </section>
  );
}
