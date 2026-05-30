"use client";

import { FormEvent, useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

import type { Book, CreateBookInput, ReadingStatus } from "@/domain/books";
import {
  searchBookMetadata,
  type BookMetadataSuggestion,
} from "@/lib/metadata-search";

const statusOptions: { value: ReadingStatus; label: string }[] = [
  { value: "reading", label: "Читаю" },
  { value: "want_to_read", label: "Планирую" },
  { value: "finished", label: "Прочитано" },
  { value: "paused", label: "Пауза" },
];

type BookFormProps = {
  initialBook?: Book;
  onSave: (input: CreateBookInput) => Promise<boolean>;
  onCancel?: () => void;
};

export function BookForm({ initialBook, onSave, onCancel }: BookFormProps) {
  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [totalPages, setTotalPages] = useState(
    initialBook ? String(initialBook.totalPages) : "",
  );
  const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl ?? "");
  const [status, setStatus] = useState<ReadingStatus>(
    initialBook?.status ?? "reading",
  );
  const [currentPage, setCurrentPage] = useState(
    initialBook ? String(initialBook.currentPage) : "0",
  );
  const [tags, setTags] = useState(initialBook?.tags.join(", ") ?? "");
  const [rating, setRating] = useState(
    initialBook?.rating ? String(initialBook.rating) : "",
  );
  const [metadataQuery, setMetadataQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BookMetadataSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleMetadataSearch = async () => {
    setSearching(true);
    setSearchError("");

    try {
      const nextSuggestions = await searchBookMetadata(metadataQuery);
      setSuggestions(nextSuggestions);
    } catch {
      setSearchError("Не удалось выполнить поиск. Ручной ввод доступен.");
    } finally {
      setSearching(false);
    }
  };

  const applySuggestion = (suggestion: BookMetadataSuggestion) => {
    setTitle(suggestion.title);
    setAuthor(suggestion.author ?? "");
    setCoverUrl(suggestion.coverUrl ?? "");
    setTotalPages(suggestion.totalPages ? String(suggestion.totalPages) : "");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldError("");
    setSaveMessage("");

    const parsedTotalPages = Number(totalPages);
    const parsedCurrentPage = Number(currentPage);
    const parsedRating = rating ? Number(rating) : undefined;

    if (!title.trim()) {
      setFieldError("Укажите название книги.");
      return;
    }

    if (!Number.isInteger(parsedTotalPages) || parsedTotalPages <= 0) {
      setFieldError("Укажите положительное количество страниц.");
      return;
    }

    if (
      !Number.isInteger(parsedCurrentPage) ||
      parsedCurrentPage < 0 ||
      parsedCurrentPage > parsedTotalPages
    ) {
      setFieldError(`Текущая страница должна быть от 0 до ${parsedTotalPages}.`);
      return;
    }

    if (
      parsedRating !== undefined &&
      (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5)
    ) {
      setFieldError("Оценка должна быть от 1 до 5.");
      return;
    }

    setSaving(true);
    const saved = await onSave({
      title,
      author,
      coverUrl,
      totalPages: parsedTotalPages,
      currentPage: parsedCurrentPage,
      status,
      rating: parsedRating,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      startedAt: status === "reading" ? new Date().toISOString() : undefined,
      finishedAt: status === "finished" ? new Date().toISOString() : undefined,
    });
    setSaving(false);

    if (saved) {
      setSaveMessage("Книга сохранена.");
    } else {
      setFieldError("Не удалось сохранить книгу.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <section className="rounded-[16px] bg-soft p-4">
        <label
          htmlFor="metadata-query"
          className="mb-2 block text-sm font-medium text-secondary"
        >
          Поиск метаданных
        </label>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <input
            id="metadata-query"
            value={metadataQuery}
            onChange={(event) => setMetadataQuery(event.target.value)}
            className="min-h-11 min-w-0 flex-1 rounded-full border border-border-soft bg-card px-4 text-primary"
            placeholder="Название или автор"
          />
          <button
            type="button"
            onClick={handleMetadataSearch}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-card px-4 text-sm font-semibold text-primary"
          >
            <IconSearch size={18} aria-hidden="true" />
            {searching ? "Ищу" : "Найти"}
          </button>
        </div>
        {searchError ? (
          <p className="mt-2 text-sm text-[#9f2f3a]" role="alert">
            {searchError}
          </p>
        ) : null}
        {!searching && metadataQuery && suggestions.length === 0 ? (
          <p className="mt-2 text-sm text-secondary">
            Ничего не найдено. Заполните поля вручную.
          </p>
        ) : null}
        {suggestions.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.title}-${suggestion.author}`}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className="rounded-[12px] bg-card p-3 text-left text-sm text-primary"
              >
                {suggestion.title}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <Field label="Название" htmlFor="book-title" required>
          <input
            id="book-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="form-input"
            aria-invalid={fieldError.includes("название")}
          />
        </Field>
        <Field label="Автор" htmlFor="book-author">
          <input
            id="book-author"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Всего страниц" htmlFor="book-total-pages" required>
          <input
            id="book-total-pages"
            type="number"
            min={1}
            value={totalPages}
            onChange={(event) => setTotalPages(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Текущая страница" htmlFor="book-current-page">
          <input
            id="book-current-page"
            type="number"
            min={0}
            value={currentPage}
            onChange={(event) => setCurrentPage(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Статус" htmlFor="book-status">
          <select
            id="book-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ReadingStatus)}
            className="form-input"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Оценка" htmlFor="book-rating">
          <input
            id="book-rating"
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="URL обложки" htmlFor="book-cover-url">
          <input
            id="book-cover-url"
            value={coverUrl}
            onChange={(event) => setCoverUrl(event.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="Теги" htmlFor="book-tags">
          <input
            id="book-tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="form-input"
            placeholder="через запятую"
          />
        </Field>
      </div>

      {fieldError ? (
        <p className="rounded-[12px] bg-rose p-3 text-sm font-medium text-primary" role="alert">
          {fieldError}
        </p>
      ) : null}
      {saveMessage ? (
        <p className="rounded-[12px] bg-mint p-3 text-sm font-medium text-primary" role="status">
          {saveMessage}
        </p>
      ) : null}

      <div className="flex flex-col justify-end gap-3 sm:flex-row">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-soft px-5 text-sm font-semibold text-primary"
          >
            <IconX size={18} aria-hidden="true" />
            Отмена
          </button>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-[#f8f7f2] disabled:opacity-60"
        >
          {saving ? "Сохраняю" : "Сохранить книгу"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-secondary">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
