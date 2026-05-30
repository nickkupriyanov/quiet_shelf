export type ReadingStatus = "want_to_read" | "reading" | "finished" | "paused";

export type Book = {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string;
  totalPages: number;
  currentPage: number;
  status: ReadingStatus;
  rating?: number;
  tags: string[];
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProgressEntry = {
  id: string;
  bookId: string;
  page: number;
  deltaPages: number;
  createdAt: string;
};

export type StatusHistoryEntry = {
  id: string;
  bookId: string;
  fromStatus?: ReadingStatus;
  toStatus: ReadingStatus;
  createdAt: string;
};

export type CreateBookInput = {
  title: string;
  author?: string;
  coverUrl?: string;
  totalPages: number;
  currentPage?: number;
  status?: ReadingStatus;
  rating?: number;
  tags?: string[];
  startedAt?: string;
  finishedAt?: string;
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const nowIso = () => new Date().toISOString();

export function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(page), 0), totalPages);
}

export function validateRating(rating?: number) {
  if (rating === undefined) {
    return;
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
}

export function calculateProgressPercent(currentPage: number, totalPages: number) {
  if (totalPages <= 0) {
    return 0;
  }

  return Math.round((clampPage(currentPage, totalPages) / totalPages) * 100);
}

export function createBook(input: CreateBookInput): Book {
  const title = input.title.trim();

  if (!title) {
    throw new Error("Book title is required");
  }

  if (!Number.isInteger(input.totalPages) || input.totalPages <= 0) {
    throw new Error("Total pages must be positive");
  }

  validateRating(input.rating);

  const createdAt = nowIso();
  const currentPage = clampPage(input.currentPage ?? 0, input.totalPages);

  return {
    id: createId(),
    title,
    author: input.author?.trim() || undefined,
    coverUrl: input.coverUrl?.trim() || undefined,
    totalPages: input.totalPages,
    currentPage,
    status: input.status ?? (currentPage > 0 ? "reading" : "want_to_read"),
    rating: input.rating,
    tags: normalizeTags(input.tags ?? []),
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    createdAt,
    updatedAt: createdAt,
  };
}

export function applyProgressUpdate(book: Book, page: number): Book {
  return {
    ...book,
    currentPage: clampPage(page, book.totalPages),
    updatedAt: nowIso(),
  };
}

export function shouldSuggestFinish(book: Book) {
  return book.status !== "finished" && book.currentPage >= book.totalPages;
}

export function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => tag.slice(0, 32)),
    ),
  );
}
