import Link from "next/link";
import { IconStarFilled } from "@tabler/icons-react";

import type { Book, ReadingStatus } from "@/domain/books";
import { BookCover } from "@/components/book-cover";
import { BookProgress } from "@/components/book-progress";

const statusLabels: Record<ReadingStatus, string> = {
  reading: "Читаю",
  want_to_read: "Планирую",
  finished: "Прочитано",
  paused: "Пауза",
};

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="grid grid-cols-[88px_1fr] gap-4 rounded-[14px] border border-border-soft bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(36,50,65,0.10)]"
    >
      <BookCover
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
      />
      <div className="min-w-0 py-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold leading-tight text-primary">
              {book.title}
            </p>
            {book.author ? (
              <p className="mt-1 truncate text-sm text-secondary">{book.author}</p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-full bg-mint px-3 py-1 text-xs font-medium text-primary">
            {statusLabels[book.status]}
          </span>
        </div>

        <div className="mt-4">
          <BookProgress
            currentPage={book.currentPage}
            totalPages={book.totalPages}
            compact
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {book.rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-1 text-xs font-medium text-primary">
              <IconStarFilled size={13} aria-hidden="true" />
              {book.rating}
            </span>
          ) : null}
          {book.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
