"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconArrowRight,
  IconBook2,
  IconCheck,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";

import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { BookProgress } from "@/components/book-progress";
import { EmptyState } from "@/components/empty-state";
import { WeeklySummary } from "@/components/weekly-summary";
import { shouldSuggestFinish, type Book } from "@/domain/books";
import { useBooks } from "@/hooks/use-books";

type InsightTab = "today" | "week" | "history" | "finish";

const insightTabs: { value: InsightTab; label: string }[] = [
  { value: "today", label: "Сегодня" },
  { value: "week", label: "Неделя" },
  { value: "history", label: "История" },
  { value: "finish", label: "Финиш" },
];

export default function Home() {
  const query = useMemo(() => ({ sort: "recently_updated" as const }), []);
  const { books, loading, error, updateBook, updateProgress, refreshBooks } =
    useBooks(query);
  const activeBook = useMemo(() => findActiveBook(books), [books]);
  const continueBooks = books
    .filter((book) => book.status === "reading" && book.id !== activeBook?.id)
    .slice(0, 5);
  const [pageDraft, setPageDraft] = useState({ bookId: "", value: "" });
  const [pageError, setPageError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [insightTab, setInsightTab] = useState<InsightTab>("today");

  useEffect(() => {
    queueMicrotask(() => {
      void refreshBooks(query);
    });
  }, [query, refreshBooks]);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (!activeBook) {
    return (
      <div className="grid min-h-[560px] place-items-center">
        <EmptyState />
      </div>
    );
  }

  const pageInput =
    pageDraft.bookId === activeBook.id
      ? pageDraft.value
      : String(activeBook.currentPage);
  const canAddPages = activeBook.currentPage < activeBook.totalPages;
  const finishedCount = books.filter((book) => book.status === "finished").length;
  const readingCount = books.filter((book) => book.status === "reading").length;
  const pagesTotal = books.reduce((sum, book) => sum + book.currentPage, 0);

  const submitExactPage = async () => {
    const nextPage = Number(pageInput);

    if (
      !Number.isInteger(nextPage) ||
      nextPage < 0 ||
      nextPage > activeBook.totalPages
    ) {
      setPageError(`Введите страницу от 0 до ${activeBook.totalPages}.`);
      return;
    }

    const updated = await updateProgress(activeBook, nextPage);
    if (updated) {
      setPageError("");
      setSaveMessage("Прогресс сохранен.");
    }
  };

  const addTenPages = async () => {
    if (!canAddPages) {
      return;
    }

    const updated = await updateProgress(activeBook, activeBook.currentPage + 10);
    if (updated) {
      setSaveMessage("Добавлено 10 страниц.");
    }
  };

  const finishBook = async () => {
    const updated = await updateBook({
      ...activeBook,
      status: "finished",
      finishedAt: new Date().toISOString(),
    });

    if (updated) {
      setSaveMessage("Книга отмечена как прочитанная.");
    }
  };

  return (
    <div className="grid gap-[14px] xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.68fr)]">
      <div className="grid gap-[14px]">
        <WeeklySummary
          pagesThisWeek={activeBook.currentPage}
          currentStreak={activeBook.currentPage > 0 ? 1 : 0}
          days={buildWeek(activeBook)}
        />

        <section
          className="quiet-panel grid gap-5 rounded-[22px] p-5 md:grid-cols-[176px_minmax(0,1fr)] md:items-center lg:p-[22px]"
          aria-label="Активная книга"
        >
          <div className="mx-auto w-full max-w-[180px] md:max-w-none">
            <BookCover
              title={activeBook.title}
              author={activeBook.author}
              coverUrl={activeBook.coverUrl}
              size="hero"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-secondary">Сейчас читаю</p>
            <h1 className="mt-2 max-w-[780px] text-[clamp(34px,4.2vw,58px)] font-black leading-[1.02] tracking-normal text-primary">
              {activeBook.title}
            </h1>
            {activeBook.author ? (
              <p className="mt-2 text-lg font-semibold text-secondary">
                {activeBook.author}
              </p>
            ) : null}

            <div className="mt-5 max-w-3xl">
              <BookProgress
                currentPage={activeBook.currentPage}
                totalPages={activeBook.totalPages}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addTenPages}
                disabled={!canAddPages}
                className="quiet-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-black transition hover:translate-y-px disabled:translate-y-0"
              >
                <IconPlus size={18} aria-hidden="true" />
                {canAddPages ? "+10 страниц" : "Страницы обновлены"}
              </button>

              <div className="flex min-w-[260px] flex-1 flex-wrap gap-2 sm:flex-nowrap">
                <label className="sr-only" htmlFor="current-page">
                  Текущая страница
                </label>
                <input
                  id="current-page"
                  type="number"
                  min={0}
                  max={activeBook.totalPages}
                  value={pageInput}
                  onChange={(event) =>
                    setPageDraft({
                      bookId: activeBook.id,
                      value: event.target.value,
                    })
                  }
                  aria-describedby={pageError ? "current-page-error" : undefined}
                  className="min-h-10 min-w-[120px] flex-1 rounded-full border border-border-soft bg-card px-4 text-primary"
                />
                <button
                  type="button"
                  onClick={submitExactPage}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-border-soft bg-card px-5 text-sm font-black text-ink transition hover:bg-soft"
                >
                  Обновить
                </button>
              </div>
            </div>

            {shouldSuggestFinish(activeBook) ? (
              <button
                type="button"
                onClick={finishBook}
                className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-primary"
              >
                <IconCheck size={17} aria-hidden="true" />
                Завершить книгу
              </button>
            ) : null}

            {pageError ? (
              <p id="current-page-error" className="mt-3 text-sm font-semibold text-[#9f2f3a]">
                {pageError}
              </p>
            ) : null}
            {saveMessage || error ? (
              <p
                className="mt-3 text-sm font-bold text-secondary"
                role={error ? "alert" : "status"}
              >
                {error ?? saveMessage}
              </p>
            ) : null}
          </div>
        </section>

        <section className="quiet-panel rounded-[22px] p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lilac text-ink">
                <IconBook2 size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-black leading-tight text-primary">
                  Полка
                </h2>
                <p className="text-sm font-semibold text-secondary">
                  Книги, которые уже в процессе.
                </p>
              </div>
            </div>
            <a
              href="/library"
              className="hidden items-center gap-2 rounded-full bg-soft px-4 py-2 text-sm font-black text-primary transition hover:bg-mint sm:inline-flex"
            >
              Библиотека
              <IconArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          {continueBooks.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {continueBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="rounded-[14px] bg-soft p-4 text-sm font-semibold text-secondary">
              Пока нет других книг в чтении.
            </p>
          )}
        </section>
      </div>

      <aside className="grid gap-[14px] content-start">
        <ReaderSummary
          bookCount={books.length}
          readingCount={readingCount}
          finishedCount={finishedCount}
          pagesTotal={pagesTotal}
        />
        <QuickActions onAddTen={addTenPages} canAddPages={canAddPages} />
        <InsightWidget
          tab={insightTab}
          onTabChange={setInsightTab}
          activeBook={activeBook}
          pagesTotal={pagesTotal}
          finishedCount={finishedCount}
          readingCount={readingCount}
          onAddTen={addTenPages}
          canAddPages={canAddPages}
        />
      </aside>
    </div>
  );
}

function findActiveBook(books: Book[]) {
  return (
    books.find((book) => book.status === "reading") ??
    books.find((book) => book.status === "want_to_read") ??
    books[0]
  );
}

function buildWeek(book: Book) {
  const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const base = Math.max(Math.round(book.currentPage / 7), 0);

  return labels.map((label, index) => ({
    label,
    current: index === 1,
    pages:
      index === 1
        ? Math.max(book.currentPage, 1)
        : book.currentPage > 0
          ? Math.max(base - index, 0)
          : 0,
  }));
}

function ReaderSummary({
  bookCount,
  readingCount,
  finishedCount,
  pagesTotal,
}: {
  bookCount: number;
  readingCount: number;
  finishedCount: number;
  pagesTotal: number;
}) {
  return (
    <section className="quiet-panel rounded-[22px] p-4">
      <div className="grid grid-cols-[46px_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-peach font-mono text-sm font-black text-primary">
          QS
        </span>
        <div>
          <h2 className="text-2xl font-black leading-tight text-primary">Профиль</h2>
          <p className="text-sm font-semibold text-secondary">Локальная полка</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
        <Metric label="на полке" value={bookCount} />
        <Metric label="читаю" value={readingCount} />
        <Metric label="прочитано" value={finishedCount} />
        <Metric label="страниц" value={pagesTotal} />
      </div>
    </section>
  );
}

function QuickActions({
  onAddTen,
  canAddPages,
}: {
  onAddTen: () => void;
  canAddPages: boolean;
}) {
  return (
    <section className="quiet-panel grid grid-cols-2 gap-2 rounded-[22px] p-2">
      <button
        type="button"
        onClick={onAddTen}
        disabled={!canAddPages}
        className="quiet-cta min-h-12 rounded-full px-4 text-sm font-black"
      >
        +10 страниц
      </button>
      <a
        href="/library?add=1"
        className="grid min-h-12 place-items-center rounded-full border border-border-soft bg-card px-4 text-sm font-black text-ink"
      >
        Добавить
      </a>
    </section>
  );
}

function InsightWidget({
  tab,
  onTabChange,
  activeBook,
  pagesTotal,
  finishedCount,
  readingCount,
  onAddTen,
  canAddPages,
}: {
  tab: InsightTab;
  onTabChange: (tab: InsightTab) => void;
  activeBook: Book;
  pagesTotal: number;
  finishedCount: number;
  readingCount: number;
  onAddTen: () => void;
  canAddPages: boolean;
}) {
  const remaining = Math.max(activeBook.totalPages - activeBook.currentPage, 0);

  return (
    <section className="quiet-panel flex min-h-[360px] flex-col rounded-[22px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-secondary">Сегодня</p>
          <h2 className="mt-1 text-2xl font-black leading-tight text-primary">
            Фокус
          </h2>
        </div>
        <IconTrendingUp size={22} className="text-sage" aria-hidden="true" />
      </div>

      <div
        className="mt-4 grid grid-cols-4 gap-1 rounded-full border border-border-soft bg-soft p-1"
        role="tablist"
        aria-label="Режимы блока Фокус"
      >
        {insightTabs.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => onTabChange(item.value)}
            className={[
              "min-h-9 rounded-full px-2 text-xs font-black transition",
              tab === item.value
                ? "bg-ink text-[#fffefa]"
                : "text-secondary hover:bg-card",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid flex-1 content-start gap-3 rounded-[20px] bg-[radial-gradient(circle_at_88%_86%,rgba(190,218,165,0.92),transparent_34%),linear-gradient(135deg,#263544,#172330)] p-4 text-[#fffefa]">
        {tab === "today" ? (
          <>
            <p className="text-sm font-semibold text-white/70">Активная книга</p>
            <h3 className="text-2xl font-black leading-tight">{activeBook.title}</h3>
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
        ) : null}

        {tab === "week" ? (
          <>
            <h3 className="text-2xl font-black leading-tight">Неделя</h3>
            <div className="grid grid-cols-3 gap-2">
              <InsightMetric label="страниц" value={activeBook.currentPage} />
              <InsightMetric label="читаю" value={readingCount} />
              <InsightMetric label="финишей" value={finishedCount} />
            </div>
          </>
        ) : null}

        {tab === "history" ? (
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
        ) : null}

        {tab === "finish" ? (
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
        ) : null}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-h-[60px] rounded-[16px] bg-card p-3">
      <p className="font-mono text-2xl font-black leading-none text-primary">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-secondary">{label}</p>
    </div>
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

function HomeSkeleton() {
  return (
    <div className="grid animate-pulse gap-[14px] xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.68fr)]">
      <div className="grid gap-[14px]">
        <div className="quiet-panel h-[118px] rounded-[22px]" />
        <div className="quiet-panel grid h-[310px] grid-cols-[176px_1fr] gap-5 rounded-[22px] p-5">
          <div className="rounded-xl bg-lilac" />
          <div className="rounded-[18px] bg-soft" />
        </div>
        <div className="quiet-panel h-[170px] rounded-[22px]" />
      </div>
      <div className="hidden gap-[14px] xl:grid">
        <div className="quiet-panel h-[160px] rounded-[22px]" />
        <div className="quiet-panel h-[70px] rounded-[22px]" />
        <div className="quiet-panel h-[360px] rounded-[22px]" />
      </div>
    </div>
  );
}
