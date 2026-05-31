type DaySummary = {
  label: string;
  pages: number;
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
  const maxPages = Math.max(...days.map((day) => day.pages), 1);

  return (
    <section
      id="rhythm"
      className="rounded-[18px] border border-[#d3e7cf] bg-mint p-4 sm:p-5"
      aria-label="Ритм чтения за неделю"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Ритм</h2>
          <p className="mt-1 text-sm text-secondary">
            {pagesThisWeek} стр. за неделю
          </p>
        </div>
        <div className="rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-primary shadow-sm">
          {currentStreak} дн.
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 items-end gap-2">
        {days.map((day) => (
          <div key={day.label} className="grid gap-2 text-center">
            <div className="flex h-16 items-end rounded-full bg-card/80 p-1 shadow-inner sm:h-20">
              <div
                className="w-full rounded-full bg-sage"
                style={{ height: `${Math.max((day.pages / maxPages) * 100, 8)}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-medium text-secondary">{day.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
