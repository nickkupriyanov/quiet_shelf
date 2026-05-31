"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconClockHour4,
  IconHistory,
  IconPlus,
  IconStarFilled,
} from "@tabler/icons-react";

import { BookCover } from "@/components/book-cover";
import { BookProgress } from "@/components/book-progress";
import {
  shouldSuggestFinish,
  type Book,
  type ProgressEntry,
  type ReadingStatus,
  type StatusHistoryEntry,
} from "@/domain/books";
import { useBooks } from "@/hooks/use-books";

const statusLabels: Record<ReadingStatus, string> = {
  reading: "Читаю",
  want_to_read: "Планирую",
  finished: "Прочитано",
  paused: "Пауза",
};

const statusOptions: { value: ReadingStatus; label: string }[] = [
  { value: "reading", label: "Читаю" },
  { value: "want_to_read", label: "Планирую" },
  { value: "finished", label: "Прочитано" },
  { value: "paused", label: "Пауза" },
];

export default function BookDetailPage() {
  const params = useParams<{ bookId: string }>();
  const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;
  const {
    books,
    loading,
    error,
    updateBook,
    updateProgress,
    listProgressEntries,
    listStatusHistoryEntries,
    refreshBooks,
  } = useBooks();
  const book = useMemo(
    () => books.find((candidate) => candidate.id === bookId),
    [bookId, books],
  );
  const [pageDraft, setPageDraft] = useState({ bookId: "", value: "" });
  const [detailsDraft, setDetailsDraft] = useState<{
    bookId: string;
    status?: ReadingStatus;
    rating?: string;
    tags?: string;
  }>({ bookId: "" });
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [statusEntries, setStatusEntries] = useState<StatusHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshBooks();
    });
  }, [refreshBooks]);

  useEffect(() => {
    if (!bookId || !book) {
      return;
    }

    let active = true;
    Promise.all([
      listProgressEntries(bookId),
      listStatusHistoryEntries(bookId),
    ]).then(([nextProgressEntries, nextStatusEntries]) => {
      if (!active) {
        return;
      }

      setProgressEntries(nextProgressEntries.toReversed());
      setStatusEntries(nextStatusEntries.toReversed());
      setHistoryLoading(false);
    });

    return () => {
      active = false;
    };
  }, [book, bookId, listProgressEntries, listStatusHistoryEntries]);

  const reloadHistory = async () => {
    const [nextProgressEntries, nextStatusEntries] = await Promise.all([
      listProgressEntries(bookId),
      listStatusHistoryEntries(bookId),
    ]);
    setProgressEntries(nextProgressEntries.toReversed());
    setStatusEntries(nextStatusEntries.toReversed());
  };

  if (loading) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return <MissingBookState />;
  }

  const canAddPages = book.currentPage < book.totalPages;
  const pageValue =
    pageDraft.bookId === book.id ? pageDraft.value : String(book.currentPage);
  const statusValue =
    detailsDraft.bookId === book.id && detailsDraft.status
      ? detailsDraft.status
      : book.status;
  const ratingValue =
    detailsDraft.bookId === book.id && detailsDraft.rating !== undefined
      ? detailsDraft.rating
      : book.rating
        ? String(book.rating)
        : "";
  const tagsValue =
    detailsDraft.bookId === book.id && detailsDraft.tags !== undefined
      ? detailsDraft.tags
      : book.tags.join(", ");

  const addTenPages = async () => {
    if (!canAddPages) {
      return;
    }

    const updated = await updateProgress(book, book.currentPage + 10);
    if (updated) {
      setSaveMessage("Добавлено 10 страниц.");
      setPageError("");
      await reloadHistory();
    }
  };

  const submitExactPage = async () => {
    const nextPage = Number(pageValue);

    if (!Number.isInteger(nextPage) || nextPage < 0 || nextPage > book.totalPages) {
      setPageError(`Введите страницу от 0 до ${book.totalPages}.`);
      return;
    }

    const updated = await updateProgress(book, nextPage);
    if (updated) {
      setSaveMessage("Прогресс сохранен.");
      setPageError("");
      await reloadHistory();
    }
  };

  const finishBook = async () => {
    const updated = await updateBook({
      ...book,
      currentPage: book.totalPages,
      status: "finished",
      finishedAt: book.finishedAt ?? new Date().toISOString(),
    });

    if (updated) {
      setSaveMessage("Книга отмечена как прочитанная.");
      await reloadHistory();
    }
  };

  const saveDetails = async () => {
    setFormError("");
    setSaveMessage("");
    const parsedRating = ratingValue ? Number(ratingValue) : undefined;

    if (
      parsedRating !== undefined &&
      (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5)
    ) {
      setFormError("Оценка должна быть от 1 до 5.");
      return;
    }

    const updated = await updateBook({
      ...book,
      status: statusValue,
      rating: parsedRating,
      tags: tagsValue
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      finishedAt:
        statusValue === "finished"
          ? book.finishedAt ?? new Date().toISOString()
          : book.finishedAt,
    });

    if (updated) {
      setSaveMessage("Детали сохранены.");
      await reloadHistory();
    }
  };

  return (
    <div className="grid gap-[14px] xl:grid-cols-[minmax(0,1.28fr)_minmax(340px,0.72fr)]">
      <section className="quiet-panel grid gap-5 rounded-[22px] p-5 md:grid-cols-[minmax(160px,220px)_minmax(0,1fr)] lg:p-[22px]">
        <div>
          <Link
            href="/library"
            className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-soft px-4 text-sm font-black text-primary transition hover:bg-mint"
          >
            <IconArrowLeft size={17} aria-hidden="true" />
            Библиотека
          </Link>
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            size="hero"
          />
        </div>

        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-mint px-3 py-1 text-sm font-bold text-primary">
            {statusLabels[book.status]}
          </span>
          <h1 className="mt-3 text-[clamp(34px,4vw,58px)] font-black leading-[1.02] tracking-normal text-primary">
            {book.title}
          </h1>
          {book.author ? (
            <p className="mt-2 text-lg font-semibold text-secondary">
              {book.author}
            </p>
          ) : null}

          <div className="mt-6 max-w-3xl">
            <BookProgress
              currentPage={book.currentPage}
              totalPages={book.totalPages}
            />
          </div>

          <div className="mt-5 grid gap-3 rounded-[18px] bg-soft p-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="detail-current-page"
                className="mb-2 block text-sm font-bold text-secondary"
              >
                Текущая страница
              </label>
              <input
                id="detail-current-page"
                type="number"
                min={0}
                max={book.totalPages}
                value={pageValue}
                onChange={(event) =>
                  setPageDraft({ bookId: book.id, value: event.target.value })
                }
                aria-describedby={pageError ? "detail-page-error" : undefined}
                className="form-input bg-card"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addTenPages}
                disabled={!canAddPages}
                className="quiet-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-black"
              >
                <IconPlus size={18} aria-hidden="true" />
                +10 страниц
              </button>
              <button
                type="button"
                onClick={submitExactPage}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-soft bg-card px-5 text-sm font-black text-ink transition hover:bg-mint"
              >
                Обновить
              </button>
            </div>
          </div>

          {shouldSuggestFinish(book) ? (
            <button
              type="button"
              onClick={finishBook}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-primary"
            >
              <IconCheck size={18} aria-hidden="true" />
              Завершить книгу
            </button>
          ) : null}

          {pageError ? (
            <p id="detail-page-error" className="mt-3 text-sm font-semibold text-[#9f2f3a]">
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

      <aside className="grid content-start gap-[14px]">
        <section className="quiet-panel rounded-[22px] p-5">
          <h2 className="text-2xl font-black text-primary">Детали</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Статус" htmlFor="detail-status">
              <select
                id="detail-status"
                value={statusValue}
                onChange={(event) =>
                  setDetailsDraft((draft) => ({
                    ...draft,
                    bookId: book.id,
                    status: event.target.value as ReadingStatus,
                  }))
                }
                className="form-input"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Оценка" htmlFor="detail-rating">
              <input
                id="detail-rating"
                type="number"
                min={1}
                max={5}
                value={ratingValue}
                onChange={(event) =>
                  setDetailsDraft((draft) => ({
                    ...draft,
                    bookId: book.id,
                    rating: event.target.value,
                  }))
                }
                className="form-input"
              />
            </Field>
            <Field label="Теги" htmlFor="detail-tags">
              <input
                id="detail-tags"
                value={tagsValue}
                onChange={(event) =>
                  setDetailsDraft((draft) => ({
                    ...draft,
                    bookId: book.id,
                    tags: event.target.value,
                  }))
                }
                className="form-input"
                placeholder="через запятую"
              />
            </Field>
          </div>
          {formError ? (
            <p className="mt-3 text-sm font-semibold text-[#9f2f3a]" role="alert">
              {formError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={saveDetails}
            className="quiet-cta mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 text-sm font-black"
          >
            Сохранить детали
          </button>
        </section>

        <BookFacts book={book} />
      </aside>

      <section className="quiet-panel rounded-[22px] p-5 xl:col-span-2">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-lilac text-ink">
            <IconHistory size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-primary">История</h2>
            <p className="text-sm font-semibold text-secondary">
              Прогресс и смена статусов по этой книге.
            </p>
          </div>
        </div>
        {historyLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-28 animate-pulse rounded-[16px] bg-soft" />
            <div className="h-28 animate-pulse rounded-[16px] bg-soft" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <HistoryList
              title="Прогресс"
              empty="История страниц появится после первого обновления."
              entries={progressEntries.map((entry) => ({
                id: entry.id,
                label: `${entry.page} стр.`,
                meta:
                  entry.deltaPages >= 0
                    ? `+${entry.deltaPages} стр.`
                    : `${entry.deltaPages} стр.`,
                date: entry.createdAt,
              }))}
            />
            <HistoryList
              title="Статусы"
              empty="История статусов появится после смены статуса."
              entries={statusEntries.map((entry) => ({
                id: entry.id,
                label: `${entry.fromStatus ? statusLabels[entry.fromStatus] : "Старт"} -> ${statusLabels[entry.toStatus]}`,
                meta: "Смена статуса",
                date: entry.createdAt,
              }))}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

function BookFacts({ book }: { book: Book }) {
  return (
    <section className="quiet-panel rounded-[22px] p-5">
      <h2 className="text-2xl font-black text-primary">Сводка</h2>
      <div className="mt-4 grid gap-3">
        <Fact label="Страницы" value={`${book.currentPage} из ${book.totalPages}`} />
        <Fact label="Создано" value={formatDate(book.createdAt)} />
        <Fact label="Обновлено" value={formatDate(book.updatedAt)} />
        {book.startedAt ? <Fact label="Начато" value={formatDate(book.startedAt)} /> : null}
        {book.finishedAt ? (
          <Fact label="Завершено" value={formatDate(book.finishedAt)} />
        ) : null}
        {book.rating ? (
          <div className="flex items-center justify-between gap-3 rounded-[14px] bg-peach px-4 py-3">
            <span className="text-sm font-bold text-secondary">Оценка</span>
            <span className="inline-flex items-center gap-1 text-sm font-black text-primary">
              <IconStarFilled size={15} aria-hidden="true" />
              {book.rating}
            </span>
          </div>
        ) : null}
        {book.tags.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-bold text-secondary">Теги</p>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-soft px-3 py-1 text-xs font-bold text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] bg-soft px-4 py-3">
      <span className="text-sm font-bold text-secondary">{label}</span>
      <span className="text-right text-sm font-black text-primary">{value}</span>
    </div>
  );
}

function HistoryList({
  title,
  empty,
  entries,
}: {
  title: string;
  empty: string;
  entries: { id: string; label: string; meta: string; date: string }[];
}) {
  return (
    <div className="rounded-[18px] bg-soft p-4">
      <h3 className="text-lg font-black text-primary">{title}</h3>
      {entries.length > 0 ? (
        <ol className="mt-3 grid gap-2">
          {entries.slice(0, 8).map((entry) => (
            <li
              key={entry.id}
              className="grid gap-1 rounded-[14px] bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-primary">{entry.label}</span>
                <span className="text-sm font-semibold text-secondary">
                  {entry.meta}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
                <IconClockHour4 size={14} aria-hidden="true" />
                {formatDate(entry.date)}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 rounded-[14px] bg-card p-4 text-sm font-semibold text-secondary">
          {empty}
        </p>
      )}
    </div>
  );
}

function MissingBookState() {
  return (
    <section className="quiet-panel grid min-h-[520px] place-items-center rounded-[22px] p-8 text-center">
      <div className="max-w-md">
        <p className="font-mono text-sm font-bold text-secondary">QuietShelf</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-primary">
          Книга не найдена
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-secondary">
          Возможно, она была удалена или еще не добавлена на личную полку.
        </p>
        <Link
          href="/library"
          className="quiet-cta mt-6 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-black"
        >
          Открыть библиотеку
        </Link>
      </div>
    </section>
  );
}

function BookDetailSkeleton() {
  return (
    <div className="grid gap-[14px] xl:grid-cols-[minmax(0,1.28fr)_minmax(340px,0.72fr)]">
      <section className="quiet-panel grid animate-pulse gap-5 rounded-[22px] p-5 md:grid-cols-[220px_1fr]">
        <div className="aspect-[2/3] rounded-xl bg-soft" />
        <div className="grid content-center gap-4">
          <div className="h-10 w-2/3 rounded-full bg-soft" />
          <div className="h-5 w-1/3 rounded-full bg-soft" />
          <div className="h-20 rounded-[18px] bg-soft" />
        </div>
      </section>
      <aside className="grid gap-[14px]">
        <div className="h-64 animate-pulse rounded-[22px] bg-card" />
        <div className="h-64 animate-pulse rounded-[22px] bg-card" />
      </aside>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
