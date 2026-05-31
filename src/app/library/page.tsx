"use client";

import { useEffect, useMemo, useState } from "react";
import { IconPlus, IconSearch, IconX } from "@tabler/icons-react";

import { BookForm } from "@/components/book-form";
import { BookCard } from "@/components/book-card";
import { EmptyState } from "@/components/empty-state";
import { SegmentedControl } from "@/components/segmented-control";
import type { ReadingStatus } from "@/domain/books";
import type { BookSort } from "@/domain/repository";
import { useBooks } from "@/hooks/use-books";

type StatusFilter = ReadingStatus | "all";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "reading", label: "Читаю" },
  { value: "want_to_read", label: "Планирую" },
  { value: "finished", label: "Прочитано" },
  { value: "paused", label: "Пауза" },
  { value: "all", label: "Все" },
];

const sortLabels: Record<BookSort, string> = {
  recently_updated: "Недавно обновленные",
  title: "Название",
  author: "Автор",
  progress: "Прогресс",
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<BookSort>("recently_updated");
  const query = useMemo(() => ({ search, status, sort }), [search, status, sort]);
  const { books, loading, error, createBook, refreshBooks } = useBooks(query);
  const [showForm, setShowForm] = useState(
    () => typeof window !== "undefined" && window.location.search.includes("add=1"),
  );
  const hasFilters = search.trim() !== "" || status !== "all";

  useEffect(() => {
    queueMicrotask(() => {
      void refreshBooks(query);
    });
  }, [query, refreshBooks]);

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setSort("recently_updated");
  };

  return (
    <div className="grid min-w-0 gap-5">
      <section className="quiet-panel min-w-0 rounded-[22px] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-sm font-bold text-secondary">Библиотека</p>
            <h1 className="mt-2 text-[clamp(34px,4vw,52px)] font-black leading-none tracking-normal text-primary">
              Личная полка
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="quiet-cta inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full px-5 text-sm font-black"
          >
            <IconPlus size={18} aria-hidden="true" />
            Добавить книгу
          </button>
        </div>

        <div className="mt-5 grid min-w-0 gap-3 xl:grid-cols-[minmax(220px,1fr)_auto_240px] xl:items-end">
          <div>
            <label htmlFor="library-search" className="mb-2 block text-sm font-bold text-secondary">
              Поиск
            </label>
            <div className="flex min-h-10 items-center gap-2 rounded-[14px] border border-border-soft bg-card px-3">
              <IconSearch size={18} className="text-muted" aria-hidden="true" />
              <input
                id="library-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-primary outline-none placeholder:text-muted"
                placeholder="Название, автор или тег"
              />
            </div>
          </div>

          <SegmentedControl
            label="Статус"
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />

          <div>
            <label
              htmlFor="library-sort"
              className="mb-2 block text-sm font-medium text-secondary"
            >
              Сортировка
            </label>
            <select
              id="library-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as BookSort)}
              className="min-h-10 w-full rounded-[14px] border border-border-soft bg-card px-3 text-sm font-semibold text-primary"
            >
              {(Object.keys(sortLabels) as BookSort[]).map((value) => (
                <option key={value} value={value}>
                  {sortLabels[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error ? (
        <p className="rounded-[14px] bg-rose p-4 text-sm font-medium text-primary" role="alert">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <section className="quiet-panel min-w-0 rounded-[22px] p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-primary">Добавить книгу</h2>
              <p className="mt-1 text-sm font-semibold text-secondary">
                Ручной ввод всегда доступен, даже если поиск ничего не нашел.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                window.history.replaceState(null, "", "/library");
              }}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-primary"
              aria-label="Закрыть форму"
            >
              <IconX size={18} aria-hidden="true" />
            </button>
          </div>
          <BookForm
            onCancel={() => setShowForm(false)}
            onSave={async (input) => {
              const created = await createBook(input);
              if (created) {
                setShowForm(false);
                window.history.replaceState(null, "", "/library");
              }
              return Boolean(created);
            }}
          />
        </section>
      ) : null}

      {loading ? (
        <LibrarySkeleton />
      ) : books.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="tile" />
          ))}
        </section>
      ) : hasFilters ? (
        <section className="quiet-panel rounded-[22px] p-8 text-center">
          <h2 className="text-2xl font-black text-primary">Ничего не найдено</h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-secondary">
            На этой полке нет книг под выбранные фильтры.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-soft px-5 text-sm font-black text-primary"
            >
              <IconX size={18} aria-hidden="true" />
              Сбросить фильтры
            </button>
            <a
              href="/library?add=1"
              className="quiet-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-black"
            >
              <IconPlus size={18} aria-hidden="true" />
              Добавить книгу
            </a>
          </div>
        </section>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <section className="grid animate-pulse gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-[230px] rounded-[18px] bg-card" />
      ))}
    </section>
  );
}
