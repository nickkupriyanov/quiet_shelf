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
  variant?: "row" | "tile";
};

export function BookCard({ book, variant = "row" }: BookCardProps) {
  if (variant === "tile") {
    return (
      <Link
        href={`/books/${book.id}`}
        className="group min-h-[230px] rounded-[18px] bg-mint p-3 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(36,50,65,0.10)] even:bg-[#eef4ff] [&:nth-child(3n)]:bg-peach [&:nth-child(4n)]:bg-lilac [&:nth-child(5n)]:bg-rose"
      >
        <div className="w-[82px]">
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            size="thumb"
          />
        </div>
        <div className="mt-3 min-w-0">
          <p className="line-clamp-2 text-[17px] font-black leading-tight text-primary">
            {book.title}
          </p>
          {book.author ? (
            <p className="mt-1 line-clamp-1 text-sm font-medium text-secondary">
              {book.author}
            </p>
          ) : null}
          <span className="mt-3 inline-flex rounded-full bg-card/80 px-2.5 py-1 text-xs font-bold text-secondary">
            {statusLabels[book.status]}
          </span>
          <div className="mt-3">
            <BookProgress
              currentPage={book.currentPage}
              totalPages={book.totalPages}
              compact
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/books/${book.id}`}
      className="grid grid-cols-[88px_1fr] gap-4 rounded-[14px] border border-border-soft bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(36,50,65,0.10)]"
    >
      <BookCover
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl}
        size="thumb"
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
