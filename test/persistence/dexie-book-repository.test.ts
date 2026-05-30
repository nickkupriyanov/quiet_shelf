import "fake-indexeddb/auto";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { Book } from "@/domain/books";
import { DexieBookRepository } from "@/persistence/dexie-book-repository";

const bookInput = (overrides: Partial<Book> = {}) => ({
  title: "Solaris",
  author: "Stanislaw Lem",
  coverUrl: undefined,
  totalPages: 204,
  currentPage: 20,
  status: "reading" as const,
  rating: undefined,
  tags: ["science fiction"],
  startedAt: undefined,
  finishedAt: undefined,
  ...overrides,
});

describe("DexieBookRepository", () => {
  let repository: DexieBookRepository;

  beforeEach(() => {
    repository = new DexieBookRepository(`quietshelf-test-${crypto.randomUUID()}`);
  });

  afterEach(async () => {
    await repository.deleteDatabase();
  });

  it("creates and lists books", async () => {
    const created = await repository.createBook(bookInput());

    await expect(repository.getBook(created.id)).resolves.toEqual(created);
    await expect(repository.listBooks()).resolves.toEqual([created]);
  });

  it("filters by status", async () => {
    const reading = await repository.createBook(bookInput({ title: "Reading" }));
    await repository.createBook(
      bookInput({ title: "Finished", status: "finished", currentPage: 204 }),
    );

    await expect(repository.listBooks({ status: "reading" })).resolves.toEqual([
      reading,
    ]);
  });

  it("searches title, author, and tags", async () => {
    const tagged = await repository.createBook(
      bookInput({ title: "Dune", author: "Frank Herbert", tags: ["desert"] }),
    );
    await repository.createBook(bookInput({ title: "The Waves", author: "Woolf" }));

    await expect(repository.listBooks({ search: "herbert" })).resolves.toEqual([
      tagged,
    ]);
    await expect(repository.listBooks({ search: "desert" })).resolves.toEqual([
      tagged,
    ]);
  });

  it("sorts by progress", async () => {
    const low = await repository.createBook(
      bookInput({ title: "Low", currentPage: 10, totalPages: 100 }),
    );
    const high = await repository.createBook(
      bookInput({ title: "High", currentPage: 90, totalPages: 100 }),
    );

    await expect(repository.listBooks({ sort: "progress" })).resolves.toEqual([
      high,
      low,
    ]);
  });

  it("stores progress entries", async () => {
    const book = await repository.createBook(bookInput());

    const entry = await repository.addProgressEntry({
      bookId: book.id,
      page: 30,
      deltaPages: 10,
    });

    await expect(repository.listProgressEntries(book.id)).resolves.toEqual([entry]);
  });

  it("stores status history entries", async () => {
    const book = await repository.createBook(bookInput());

    const entry = await repository.addStatusHistoryEntry({
      bookId: book.id,
      fromStatus: "want_to_read",
      toStatus: "reading",
    });

    await expect(repository.listStatusHistoryEntries(book.id)).resolves.toEqual([
      entry,
    ]);
  });
});
