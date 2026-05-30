import Dexie, { type Table } from "dexie";

import {
  calculateProgressPercent,
  createBook,
  type Book,
  type ProgressEntry,
  type StatusHistoryEntry,
} from "@/domain/books";
import type { BookQuery, BookRepository } from "@/domain/repository";

type QuietShelfSchema = {
  books: Book;
  progressEntries: ProgressEntry;
  statusHistoryEntries: StatusHistoryEntry;
};

class QuietShelfDatabase extends Dexie {
  books!: Table<Book, string>;
  progressEntries!: Table<ProgressEntry, string>;
  statusHistoryEntries!: Table<StatusHistoryEntry, string>;

  constructor(name: string) {
    super(name);

    this.version(1).stores({
      books: "id, title, author, status, updatedAt",
      progressEntries: "id, bookId, createdAt",
      statusHistoryEntries: "id, bookId, createdAt",
    } satisfies Record<keyof QuietShelfSchema, string>);
  }
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
};

const nowIso = () => new Date().toISOString();

export class DexieBookRepository implements BookRepository {
  private readonly db: QuietShelfDatabase;

  constructor(databaseName = "quietshelf") {
    this.db = new QuietShelfDatabase(databaseName);
  }

  async createBook(
    input: Omit<Book, "id" | "createdAt" | "updatedAt">,
  ): Promise<Book> {
    const book = createBook(input);
    await this.db.books.add(book);
    return book;
  }

  async updateBook(book: Book): Promise<Book> {
    const updated = {
      ...book,
      updatedAt: nowIso(),
    };

    await this.db.books.put(updated);
    return updated;
  }

  async deleteBook(bookId: string): Promise<void> {
    await this.db.transaction(
      "rw",
      this.db.books,
      this.db.progressEntries,
      this.db.statusHistoryEntries,
      async () => {
        await this.db.books.delete(bookId);
        await this.db.progressEntries.where("bookId").equals(bookId).delete();
        await this.db.statusHistoryEntries.where("bookId").equals(bookId).delete();
      },
    );
  }

  async getBook(bookId: string): Promise<Book | undefined> {
    return this.db.books.get(bookId);
  }

  async listBooks(query: BookQuery = {}): Promise<Book[]> {
    let books = await this.db.books.toArray();

    if (query.status && query.status !== "all") {
      books = books.filter((book) => book.status === query.status);
    }

    const search = query.search?.trim().toLowerCase();
    if (search) {
      books = books.filter((book) => {
        const searchable = [book.title, book.author, ...book.tags]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(search);
      });
    }

    return sortBooks(books, query.sort ?? "recently_updated");
  }

  async addProgressEntry(
    entry: Omit<ProgressEntry, "id" | "createdAt">,
  ): Promise<ProgressEntry> {
    const progressEntry = {
      ...entry,
      id: createId(),
      createdAt: nowIso(),
    };

    await this.db.progressEntries.add(progressEntry);
    return progressEntry;
  }

  async listProgressEntries(bookId: string): Promise<ProgressEntry[]> {
    return this.db.progressEntries
      .where("bookId")
      .equals(bookId)
      .sortBy("createdAt");
  }

  async addStatusHistoryEntry(
    entry: Omit<StatusHistoryEntry, "id" | "createdAt">,
  ): Promise<StatusHistoryEntry> {
    const statusHistoryEntry = {
      ...entry,
      id: createId(),
      createdAt: nowIso(),
    };

    await this.db.statusHistoryEntries.add(statusHistoryEntry);
    return statusHistoryEntry;
  }

  async listStatusHistoryEntries(
    bookId: string,
  ): Promise<StatusHistoryEntry[]> {
    return this.db.statusHistoryEntries
      .where("bookId")
      .equals(bookId)
      .sortBy("createdAt");
  }

  async deleteDatabase() {
    await this.db.delete();
  }
}

function sortBooks(books: Book[], sort: BookQuery["sort"]) {
  return [...books].sort((left, right) => {
    if (sort === "title") {
      return left.title.localeCompare(right.title, "ru");
    }

    if (sort === "author") {
      return (left.author ?? "").localeCompare(right.author ?? "", "ru");
    }

    if (sort === "progress") {
      return (
        calculateProgressPercent(right.currentPage, right.totalPages) -
        calculateProgressPercent(left.currentPage, left.totalPages)
      );
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
