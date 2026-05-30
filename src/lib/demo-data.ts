import type { BookRepository } from "@/domain/repository";

const demoBooks = [
  {
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    coverUrl: undefined,
    totalPages: 480,
    currentPage: 170,
    status: "reading" as const,
    rating: undefined,
    tags: ["классика", "вечер"],
    startedAt: new Date().toISOString(),
    finishedAt: undefined,
  },
  {
    title: "Solaris",
    author: "Stanislaw Lem",
    coverUrl: undefined,
    totalPages: 204,
    currentPage: 204,
    status: "finished" as const,
    rating: 5,
    tags: ["science fiction", "любимое"],
    startedAt: undefined,
    finishedAt: new Date().toISOString(),
  },
  {
    title: "Дом, в котором...",
    author: "Мариам Петросян",
    coverUrl: undefined,
    totalPages: 960,
    currentPage: 0,
    status: "want_to_read" as const,
    rating: undefined,
    tags: ["длинное", "полка"],
    startedAt: undefined,
    finishedAt: undefined,
  },
];

export async function seedDemoBooks(repository: BookRepository) {
  const existingBooks = await repository.listBooks();

  if (existingBooks.length > 0) {
    return existingBooks;
  }

  const createdBooks = [];

  for (const book of demoBooks) {
    createdBooks.push(await repository.createBook(book));
  }

  return createdBooks;
}
