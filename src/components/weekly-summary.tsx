type DaySummary = {
  label: string;
  pages: number;
  current?: boolean;
};

type WeeklySummaryProps = {
  pagesThisWeek: number;
  currentStreak: number;
  days: DaySummary[];
};

export function WeeklySummary({
  pagesThisWeek,
  currentStreak,
  days,
}: WeeklySummaryProps) {
  return (
    <section
      id="rhythm"
      className="quiet-panel rounded-[22px] p-3"
      aria-label="Ритм чтения за неделю"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day, index) => (
          <article
            key={day.label}
            className={[
              "min-h-[76px] rounded-[18px] p-3 text-secondary",
              day.current
                ? "bg-lilac"
                : day.pages > 0
                  ? "bg-mint"
                  : "bg-card",
            ].join(" ")}
          >
            <span className="text-xs font-bold">{day.label}</span>
            <strong className="mt-2 block text-2xl font-black leading-none text-primary">
              {day.pages || (index + 7)}
            </strong>
            <p className="mt-1 text-xs font-semibold text-muted">
              {day.current ? "сегодня" : day.pages > 0 ? `${day.pages} стр.` : "план"}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm font-bold text-primary">Ритм</p>
        <div className="flex gap-2 text-xs font-bold text-secondary">
          <span>{pagesThisWeek} стр. за неделю</span>
          <span className="rounded-full bg-soft px-2 text-primary">{currentStreak} дн.</span>
        </div>
      </div>
    </section>
  );
}
