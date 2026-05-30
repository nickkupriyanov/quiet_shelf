import { describe, expect, it } from "vitest";

import {
  applyProgressUpdate,
  calculateProgressPercent,
  createBook,
  shouldSuggestFinish,
} from "@/domain/books";

describe("book domain", () => {
  it("calculates progress percentage", () => {
    expect(calculateProgressPercent(120, 300)).toBe(40);
  });

  it("clamps progress updates to total pages", () => {
    const book = createBook({
      title: "Dune",
      author: "Frank Herbert",
      totalPages: 412,
    });

    const updated = applyProgressUpdate(book, 500);

    expect(updated.currentPage).toBe(412);
  });

  it("suggests finish when current page reaches total pages", () => {
    const book = createBook({
      title: "Dune",
      totalPages: 412,
      currentPage: 412,
    });

    expect(shouldSuggestFinish(book)).toBe(true);
  });

  it("trims titles and rejects an empty title", () => {
    expect(() => createBook({ title: "   ", totalPages: 120 })).toThrow(
      "Book title is required",
    );

    expect(createBook({ title: "  Solaris  ", totalPages: 204 }).title).toBe(
      "Solaris",
    );
  });

  it("requires a positive page count", () => {
    expect(() => createBook({ title: "Solaris", totalPages: 0 })).toThrow(
      "Total pages must be positive",
    );
  });

  it("validates optional ratings", () => {
    expect(() =>
      createBook({ title: "Solaris", totalPages: 204, rating: 6 }),
    ).toThrow("Rating must be between 1 and 5");
  });
});
