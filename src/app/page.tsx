"use client";

import { useMemo, useState } from "react";
import { IconArrowRight, IconCheck, IconPlus } from "@tabler/icons-react";

import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { BookProgress } from "@/components/book-progress";
import { EmptyState } from "@/components/empty-state";
import { WeeklySummary } from "@/components/weekly-summary";
import { shouldSuggestFinish, type Book } from "@/domain/books";
import { useBooks } from "@/hooks/use-books";

export default function Home() {
  const { books, loading, error, updateBook, updateProgress } = useBooks({
    sort: "recently_updated",
  });
  const activeBook = useMemo(() => findActiveBook(books), [books]);
  const continueBooks = books
    .filter((book) => book.status === "reading" && book.id !== activeBook?.id)
    .slice(0, 3);
  const [pageDraft, setPageDraft] = useState({ bookId: "", value: "" });
  const [pageError, setPageError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

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

  const submitExactPage = async () => {
    const nextPage = Number(pageInput);

    if (!Number.isInteger(nextPage) || nextPage < 0 || nextPage > activeBook.totalPages) {
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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-4">
        <WeeklySummary
          pagesThisWeek={activeBook.currentPage}
          currentStreak={activeBook.currentPage > 0 ? 1 : 0}
          days={buildWeek(activeBook)}
        />

        <section className="quiet-panel grid gap-6 overflow-hidden rounded-[20px] p-5 md:grid-cols-[230px_1fr] lg:p-6">
          <div className="mx-auto w-full max-w-[220px] md:max-w-none">
            <BookCover
              title={activeBook.title}
              author={activeBook.author}
              coverUrl={activeBook.coverUrl}
            />
          </div>

          <div className="flex min-w-0 flex-col justify-between gap-7">
            <div>
              <p className="text-sm font-semibold text-secondary">Сейчас читаю</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight text-primary lg:text-5xl">
                {activeBook.title}
              </h1>
              {activeBook.author ? (
                <p className="mt-2 text-lg text-secondary">{activeBook.author}</p>
              ) : null}
              <div className="mt-7 max-w-2xl">
                <BookProgress
                  currentPage={activeBook.currentPage}
                  totalPages={activeBook.totalPages}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(260px,520px)_minmax(240px,320px)] lg:items-end">
              <button
                type="button"
                onClick={addTenPages}
                disabled={activeBook.currentPage >= activeBook.totalPages}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-base font-semibold text-[#f8f7f2] shadow-[0_12px_26px_rgba(36,50,65,0.16)] transition hover:-translate-y-0.5 disabled:bg-soft disabled:text-secondary disabled:shadow-none"
              >
                <IconPlus size={20} aria-hidden="true" />
                {activeBook.currentPage >= activeBook.totalPages
                  ? "Страницы обновлены"
                  : "+10 страниц"}
              </button>

              <div>
                <label
                  htmlFor="current-page"
                  className="mb-2 block text-sm font-medium text-secondary"
                >
                  Текущая страница
                </label>
                <div className="flex gap-2">
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
                    className="min-h-12 min-w-0 flex-1 rounded-full border border-border-soft bg-shell px-4 text-primary shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={submitExactPage}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-soft px-4 text-sm font-semibold text-primary transition hover:bg-mint"
                  >
                    Обновить
                  </button>
                </div>
                {pageError ? (
                  <p id="current-page-error" className="mt-2 text-sm text-[#9f2f3a]">
                    {pageError}
                  </p>
                ) : null}
              </div>
            </div>

            {shouldSuggestFinish(activeBook) ? (
              <button
                type="button"
                onClick={finishBook}
                className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-primary shadow-sm"
              >
                <IconCheck size={18} aria-hidden="true" />
                Завершить книгу
              </button>
            ) : null}

            {saveMessage || error ? (
              <p
                className="text-sm font-medium text-secondary"
                role={error ? "alert" : "status"}
              >
                {error ?? saveMessage}
              </p>
            ) : null}
          </div>
        </section>

        <section className="quiet-panel rounded-[18px] p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">Продолжить полку</h2>
              <p className="mt-1 text-sm text-secondary">
                Другие книги, которые уже в процессе.
              </p>
            </div>
            <a
              href="/library"
              className="hidden items-center gap-2 rounded-full bg-soft px-4 py-2 text-sm font-semibold text-primary transition hover:bg-mint sm:inline-flex"
            >
              Библиотека
              <IconArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          {continueBooks.length > 0 ? (
            <div className="grid gap-3 lg:grid-cols-3">
              {continueBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="rounded-[14px] bg-soft p-4 text-sm text-secondary">
              Пока нет других книг в чтении.
            </p>
          )}
        </section>
      </div>

      <aside className="grid gap-4">
        <ReaderSummary books={books} />
        <FocusCard activeBook={activeBook} onAddTen={addTenPages} />
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
    pages: index === labels.length - 1 ? book.currentPage % 25 : Math.max(base - index, 0),
  }));
}

function ReaderSummary({ books }: { books: Book[] }) {
  const readingCount = books.filter((book) => book.status === "reading").length;
  const finishedCount = books.filter((book) => book.status === "finished").length;

  return (
    <section className="rounded-[18px] border border-[#f2d2b3] bg-peach p-5 shadow-[0_14px_36px_rgba(36,50,65,0.06)]">
      <h2 className="text-xl font-bold text-primary">Профиль</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="На полке" value={books.length} />
        <Metric label="Читаю" value={readingCount} />
        <Metric label="Прочитано" value={finishedCount} />
        <Metric label="Серия" value={readingCount > 0 ? 1 : 0} />
      </div>
    </section>
  );
}

function FocusCard({
  activeBook,
  onAddTen,
}: {
  activeBook: Book;
  onAddTen: () => void;
}) {
  const remaining = activeBook.totalPages - activeBook.currentPage;

  return (
    <section className="rounded-[18px] border border-[#d9cee9] bg-lilac p-5 shadow-[0_14px_36px_rgba(36,50,65,0.06)]">
      <p className="text-sm font-semibold text-secondary">Сегодня</p>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-primary">Фокус</h2>
      <p className="mt-3 text-sm leading-6 text-secondary">
        До конца книги осталось {remaining} стр. Самое быстрое действие уже рядом.
      </p>
      <button
        type="button"
        onClick={onAddTen}
        disabled={activeBook.currentPage >= activeBook.totalPages}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-[#f8f7f2] shadow-[0_10px_22px_rgba(36,50,65,0.14)] disabled:bg-card disabled:text-secondary disabled:shadow-none"
      >
        <IconPlus size={18} aria-hidden="true" />
        {activeBook.currentPage >= activeBook.totalPages ? "Готово" : "+10 страниц"}
      </button>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[14px] bg-card p-4 shadow-sm">
      <p className="font-mono text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-sm text-secondary">{label}</p>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-4">
        <div className="h-40 rounded-[18px] bg-soft" />
        <div className="h-[430px] rounded-[20px] bg-card" />
        <div className="h-40 rounded-[18px] bg-card" />
      </div>
      <div className="hidden gap-4 xl:grid">
        <div className="h-56 rounded-[18px] bg-peach" />
        <div className="h-56 rounded-[18px] bg-lilac" />
      </div>
    </div>
  );
}
