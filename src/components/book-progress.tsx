import { calculateProgressPercent } from "@/domain/books";

type BookProgressProps = {
  currentPage: number;
  totalPages: number;
  compact?: boolean;
};

export function BookProgress({
  currentPage,
  totalPages,
  compact = false,
}: BookProgressProps) {
  const percent = calculateProgressPercent(currentPage, totalPages);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-primary">{percent}%</span>
        <span className="text-secondary">
          {currentPage} из {totalPages} стр.
        </span>
      </div>
      <div
        className={compact ? "h-2 rounded-full bg-soft" : "h-3 rounded-full bg-soft"}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`Прогресс чтения ${percent}%`}
      >
        <div
          className="h-full rounded-full bg-sage transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
