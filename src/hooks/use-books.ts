"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  applyProgressUpdate,
  type Book,
  type CreateBookInput,
} from "@/domain/books";
import type { BookQuery } from "@/domain/repository";
import { DexieBookRepository } from "@/persistence/dexie-book-repository";

type UseBooksResult = {
  books: Book[];
  loading: boolean;
  error?: string;
  createBook: (input: CreateBookInput) => Promise<Book | undefined>;
  updateBook: (book: Book) => Promise<Book | undefined>;
  deleteBook: (bookId: string) => Promise<void>;
  updateProgress: (book: Book, page: number) => Promise<Book | undefined>;
  refreshBooks: (nextQuery?: BookQuery) => Promise<void>;
};

const repository = new DexieBookRepository();

export function useBooks(initialQuery: BookQuery = {}): UseBooksResult {
  const [books, setBooks] = useState<Book[]>([]);
  const queryRef = useRef<BookQuery>(initialQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const refreshBooks = useCallback(async (nextQuery?: BookQuery) => {
    const activeQuery = nextQuery ?? queryRef.current;
    queryRef.current = activeQuery;
    setLoading(true);
    setError(undefined);

    try {
      const nextBooks = await repository.listBooks(activeQuery);
      setBooks(nextBooks);
    } catch {
      setError("Не удалось загрузить локальную полку.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshBooks(initialQuery);
    });
    // The hook intentionally performs one initial local IndexedDB read.
    // Subsequent query changes are driven by refreshBooks from callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions = useMemo(
    () => ({
      createBook: async (input: CreateBookInput) => {
        setError(undefined);

        try {
          const created = await repository.createBook({
            title: input.title,
            author: input.author,
            coverUrl: input.coverUrl,
            totalPages: input.totalPages,
            currentPage: input.currentPage ?? 0,
            status: input.status ?? "want_to_read",
            rating: input.rating,
            tags: input.tags ?? [],
            startedAt: input.startedAt,
            finishedAt: input.finishedAt,
          });
          await refreshBooks();
          return created;
        } catch {
          setError("Не удалось сохранить книгу.");
          return undefined;
        }
      },
      updateBook: async (book: Book) => {
        setError(undefined);

        try {
          const previous = await repository.getBook(book.id);
          const updated = await repository.updateBook(book);

          if (previous && previous.status !== updated.status) {
            await repository.addStatusHistoryEntry({
              bookId: updated.id,
              fromStatus: previous.status,
              toStatus: updated.status,
            });
          }

          await refreshBooks();
          return updated;
        } catch {
          setError("Не удалось обновить книгу.");
          return undefined;
        }
      },
      deleteBook: async (bookId: string) => {
        setError(undefined);

        try {
          await repository.deleteBook(bookId);
          await refreshBooks();
        } catch {
          setError("Не удалось удалить книгу.");
        }
      },
      updateProgress: async (book: Book, page: number) => {
        setError(undefined);

        try {
          const updated = applyProgressUpdate(book, page);
          const saved = await repository.updateBook(updated);
          await repository.addProgressEntry({
            bookId: saved.id,
            page: saved.currentPage,
            deltaPages: saved.currentPage - book.currentPage,
          });
          await refreshBooks();
          return saved;
        } catch {
          setError("Не удалось обновить прогресс.");
          return undefined;
        }
      },
    }),
    [refreshBooks],
  );

  return {
    books,
    loading,
    error,
    refreshBooks,
    ...actions,
  };
}
