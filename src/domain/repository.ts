import type {
  Book,
  ProgressEntry,
  ReadingStatus,
  StatusHistoryEntry,
} from "./books";

export type BookSort = "recently_updated" | "title" | "author" | "progress";

export type BookQuery = {
  search?: string;
  status?: ReadingStatus | "all";
  sort?: BookSort;
};

export type BookRepository = {
  createBook(input: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book>;
  updateBook(book: Book): Promise<Book>;
  deleteBook(bookId: string): Promise<void>;
  getBook(bookId: string): Promise<Book | undefined>;
  listBooks(query?: BookQuery): Promise<Book[]>;
  addProgressEntry(
    entry: Omit<ProgressEntry, "id" | "createdAt">,
  ): Promise<ProgressEntry>;
  listProgressEntries(bookId: string): Promise<ProgressEntry[]>;
  addStatusHistoryEntry(
    entry: Omit<StatusHistoryEntry, "id" | "createdAt">,
  ): Promise<StatusHistoryEntry>;
  listStatusHistoryEntries(bookId: string): Promise<StatusHistoryEntry[]>;
};
