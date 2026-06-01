"use client";

import { useEffect, useMemo, useState } from "react";
import { IconTrendingUp } from "@tabler/icons-react";

import type { Book } from "@/domain/books";

const SLIDE_DURATION_MS = 20_000;

type InsightSlide = "today" | "week" | "history" | "finish";

type InsightWidgetProps = {
  activeBook: Book;
  pagesTotal: number;
  finishedCount: number;
  readingCount: number;
  onAddTen: () => void;
  canAddPages: boolean;
};

type SlideConfig = {
  value: InsightSlide;
  label: string;
};

const insightSlides: SlideConfig[] = [
  { value: "today", label: "Сегодня" },
  { value: "week", label: "Неделя" },
  { value: "history", label: "История" },
  { value: "finish", label: "Финиш" },
];

export function InsightWidget({
  activeBook,
  pagesTotal,
  finishedCount,
  readingCount,
  onAddTen,
  canAddPages,
}: InsightWidgetProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const remaining = Math.max(activeBook.totalPages - activeBook.currentPage, 0);
  const activeSlide = insightSlides[activeSlideIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlideIndex((currentIndex) =>
        currentIndex === insightSlides.length - 1 ? 0 : currentIndex + 1,
      );
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeSlideIndex]);

  const slideContent = useMemo(
    () => ({
      today: (
        <>
          <p className="text-sm font-semibold text-white/70">
            Активная книга
          </p>
          <h3 className="text-2xl font-black leading-tight">
            {activeBook.title}
          </h3>
          <p className="text-sm leading-6 text-white/76">
            До конца осталось {remaining} стр. Самое быстрое действие рядом.
          </p>
          <button
            type="button"
            onClick={onAddTen}
            disabled={!canAddPages}
            className="mt-1 inline-flex min-h-10 w-fit items-center justify-center rounded-full bg-[#fffefa] px-5 text-sm font-black text-ink disabled:bg-white/18 disabled:text-white/60"
          >
            {canAddPages ? "+10 страниц" : "Готово"}
          </button>
        </>
      ),
      week: (
        <>
          <h3 className="text-2xl font-black leading-tight">Неделя</h3>
          <div className="grid grid-cols-3 gap-2">
            <InsightMetric label="страниц" value={activeBook.currentPage} />
            <InsightMetric label="читаю" value={readingCount} />
            <InsightMetric label="финишей" value={finishedCount} />
          </div>
        </>
      ),
      history: (
        <>
          <h3 className="text-2xl font-black leading-tight">История</h3>
          <div className="grid gap-2 text-sm text-white/76">
            <p className="border-b border-white/15 pb-2">
              Последний прогресс: {activeBook.currentPage} стр.
            </p>
            <p className="border-b border-white/15 pb-2">
              Статус: {statusLabel(activeBook.status)}
            </p>
            <p>Всего на полке: {pagesTotal} стр.</p>
          </div>
        </>
      ),
      finish: (
        <>
          <h3 className="text-2xl font-black leading-tight">Финиш</h3>
          <p className="text-sm leading-6 text-white/76">
            {activeBook.status === "finished"
              ? "Книга прочитана. Можно добавить оценку и теги в карточке."
              : `Осталось ${remaining} стр. до завершения.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeBook.rating ? (
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black">
                Оценка {activeBook.rating}
              </span>
            ) : null}
            {activeBook.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/12 px-3 py-1 text-xs font-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      ),
    }),
    [
      activeBook.currentPage,
      activeBook.rating,
      activeBook.status,
      activeBook.tags,
      activeBook.title,
      canAddPages,
      finishedCount,
      onAddTen,
      pagesTotal,
      readingCount,
      remaining,
    ],
  );

  return (
    <section
      className="flex min-h-[360px] flex-col rounded-[20px] bg-[radial-gradient(circle_at_88%_86%,rgba(190,218,165,0.92),transparent_34%),linear-gradient(135deg,#263544,#172330)] p-4 text-[#fffefa]"
      aria-labelledby="insight-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white/70">
            {activeSlide.label}
          </p>
          <h2 id="insight-title" className="mt-1 text-2xl font-black leading-tight">
            Фокус
          </h2>
        </div>
        <IconTrendingUp size={22} className="text-sage" aria-hidden="true" />
      </div>

      <div
        className="mt-4 grid flex-1 content-start gap-3"
        aria-live="polite"
      >
        {slideContent[activeSlide.value]}
      </div>

      <div
        className="mt-4 flex justify-center gap-2"
        aria-label="Слайды блока Фокус"
      >
        {insightSlides.map((slide, index) => (
          <button
            key={slide.value}
            type="button"
            aria-label={`Показать слайд ${slide.label}`}
            aria-current={activeSlideIndex === index ? "true" : undefined}
            onClick={() => setActiveSlideIndex(index)}
            className={[
              "h-2.5 rounded-full transition",
              activeSlideIndex === index
                ? "w-8 bg-[#fffefa]"
                : "w-2.5 bg-white/30 hover:bg-white/60",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}

function InsightMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-3">
      <strong className="block text-2xl leading-none">{value}</strong>
      <span className="text-xs font-bold text-white/70">{label}</span>
    </div>
  );
}

function statusLabel(status: Book["status"]) {
  return {
    reading: "читаю",
    want_to_read: "планирую",
    finished: "прочитано",
    paused: "пауза",
  }[status];
}
