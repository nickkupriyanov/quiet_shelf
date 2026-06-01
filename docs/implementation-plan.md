# QuietShelf MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the local-first QuietShelf MVP described in `docs/app-spec.md` and styled according to `docs/ui-spec.md`.

**Architecture:** Next.js App Router renders the product shell and routes. Domain logic lives outside React, persistence is hidden behind a `BookRepository`, and the first repository implementation uses IndexedDB. UI flows consume the repository through client-side hooks so a future `Next API + Postgres` repository can replace local persistence without rewriting screens.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, IndexedDB via Dexie, Vitest, React Testing Library, Playwright, Tabler icons.

**Localization:** All visible UI copy is Russian. The brand remains `QuietShelf`. TypeScript types, route names, enum values, repository methods, and internal API names remain English.

---

## File Structure

Create this structure after scaffolding the Next app:

```text
src/
  app/
    layout.tsx
    page.tsx
    library/page.tsx
    books/[bookId]/page.tsx
    globals.css
  components/
    app-shell.tsx
    book-card.tsx
    book-cover.tsx
    book-form.tsx
    book-progress.tsx
    empty-state.tsx
    segmented-control.tsx
    weekly-summary.tsx
  domain/
    books.ts
    reading-stats.ts
    repository.ts
  persistence/
    dexie-book-repository.ts
  hooks/
    use-books.ts
  lib/
    demo-data.ts
    ids.ts
    metadata-search.ts
test/
  domain/
    books.test.ts
    reading-stats.test.ts
  persistence/
    dexie-book-repository.test.ts
e2e/
  quietshelf.spec.ts
```

Keep files focused. Do not put domain validation, IndexedDB calls, and JSX in the same file.

## Task 0: Create And Review The Design Mockup

**Files:**

- Create: `docs/mockups/quietshelf-mvp.html`
- Modify: `docs/ui-spec.md` only if review changes the visual direction.

- [ ] **Step 1: Build the disposable HTML mockup**

Create a static HTML/CSS mockup that shows:

- Full-width home dashboard with a seven-day reading cadence strip, an active book, a profile summary, actions, and a right-side insight widget.
- Library with search, filters, sorting, and shelf-like cards.
- Empty library or add-book flow.
- Desktop and mobile responsive behavior.

Rules:

- Visible copy is Russian.
- Brand in the shell is `QuietShelf`.
- Use the soft product dashboard direction from `docs/ui-spec.md`: milk-white shell, graphite actions, pastel modules, sage progress, and no muddy olive-dominant surfaces.
- Do not use future social nav items or placeholder screens.
- The insight widget uses an auto-rotating carousel with slides: `Сегодня`, `Неделя`, `История`, `Финиш`. Rotate every 20 seconds and show highlighted dots at the bottom.
- This file is a design artifact, not production UI.

- [ ] **Step 2: Review before app implementation**

Open `docs/mockups/quietshelf-mvp.html` in a browser and review:

- The active book is the strongest visual object.
- `+10 страниц` is easy to reach.
- The dashboard uses the full viewport width harmoniously on desktop.
- The insight widget remains useful and stable across all four slides.
- Mobile order is `Ритм`, active book, profile summary, `Фокус`, then shelf.
- Mobile bottom navigation does not obscure interactive content.
- Library feels shelf-like without literal clutter.
- Mobile has no horizontal overflow.
- The visual direction still matches `docs/ui-spec.md`.

Expected: design direction is approved before Task 1 starts.

## Task 1: Scaffold The App

**Files:**

- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Preserve: `AGENTS.md`, `docs/app-spec.md`, `docs/ui-spec.md`, `docs/implementation-plan.md`

- [ ] **Step 1: Scaffold Next.js into a temporary folder**

Run:

```bash
npm create next-app@latest /private/tmp/quietshelf-next -- --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Expected: a fresh Next.js project exists at `/private/tmp/quietshelf-next`.

- [ ] **Step 2: Copy scaffold files into this project**

Run from `/Users/nickkupriyanov/Documents/projects/quiet_shelf`:

```bash
cp -R /private/tmp/quietshelf-next/. .
```

Expected: `package.json`, `src/app`, Tailwind config, and Next config exist while existing `docs/` and `AGENTS.md` remain.

- [ ] **Step 3: Install product and test dependencies**

Run:

```bash
npm install dexie @tabler/icons-react
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 4: Add test scripts**

Modify `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:run": "vitest run",
    "e2e": "playwright test"
  }
}
```

- [ ] **Step 5: Verify scaffold**

Run:

```bash
npm run build
```

Expected: build completes successfully.

Commit:

```bash
git add .
git commit -m "chore: scaffold quietshelf app"
```

## Task 2: Add Domain Model And Tests

**Files:**

- Create: `src/domain/books.ts`
- Create: `src/domain/repository.ts`
- Create: `test/domain/books.test.ts`

- [ ] **Step 1: Write domain tests**

Create tests for these behaviors:

```ts
import {
  applyProgressUpdate,
  calculateProgressPercent,
  createBook,
  shouldSuggestFinish,
} from "@/domain/books";

it("calculates progress percentage", () => {
  expect(calculateProgressPercent(120, 300)).toBe(40);
});

it("clamps progress updates to total pages", () => {
  const book = createBook({ title: "Dune", author: "Frank Herbert", totalPages: 412 });
  const updated = applyProgressUpdate(book, 500);
  expect(updated.currentPage).toBe(412);
});

it("suggests finish when current page reaches total pages", () => {
  const book = createBook({ title: "Dune", totalPages: 412, currentPage: 412 });
  expect(shouldSuggestFinish(book)).toBe(true);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test:run test/domain/books.test.ts
```

Expected: fail because domain functions do not exist.

- [ ] **Step 3: Implement domain types and functions**

Implement:

```ts
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
```

Rules:

- `createBook` trims title and throws when title is empty.
- `totalPages` must be positive.
- `currentPage` is clamped to `0..totalPages`.
- `rating` must be `1..5` when present.
- `applyProgressUpdate(book, page)` returns a new book with updated `currentPage` and `updatedAt`.
- status changes create `StatusHistoryEntry` records through the repository layer.
- `calculateProgressPercent` returns a rounded whole number.

- [ ] **Step 4: Define repository interface**

Create `src/domain/repository.ts`:

```ts
import type { Book, ProgressEntry, ReadingStatus, StatusHistoryEntry } from "./books";

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
  addProgressEntry(entry: Omit<ProgressEntry, "id" | "createdAt">): Promise<ProgressEntry>;
  listProgressEntries(bookId: string): Promise<ProgressEntry[]>;
  addStatusHistoryEntry(entry: Omit<StatusHistoryEntry, "id" | "createdAt">): Promise<StatusHistoryEntry>;
  listStatusHistoryEntries(bookId: string): Promise<StatusHistoryEntry[]>;
};
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run test:run test/domain/books.test.ts
```

Expected: tests pass.

Commit:

```bash
git add src/domain test/domain
git commit -m "feat: add book domain model"
```

## Task 3: Implement Local Repository

**Files:**

- Create: `src/persistence/dexie-book-repository.ts`
- Create: `test/persistence/dexie-book-repository.test.ts`

- [ ] **Step 1: Write repository tests**

Cover:

```ts
it("creates and lists books");
it("filters by status");
it("searches title, author, and tags");
it("sorts by progress");
it("stores progress entries");
it("stores status history entries");
```

Use a unique IndexedDB database name per test and delete it after each test.

- [ ] **Step 2: Implement Dexie schema**

Create a Dexie database with:

```ts
books: "id, title, author, status, updatedAt"
progressEntries: "id, bookId, createdAt"
statusHistoryEntries: "id, bookId, createdAt"
```

Implement the full `BookRepository` interface.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm run test:run test/persistence/dexie-book-repository.test.ts
```

Expected: repository tests pass.

Commit:

```bash
git add src/persistence test/persistence
git commit -m "feat: add indexeddb book repository"
```

## Task 4: Add App Styling And Shell

**Files:**

- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/segmented-control.tsx`

- [ ] **Step 1: Add design tokens**

Define CSS variables from `docs/ui-spec.md` for light and dark mode:

```css
:root {
  --surface-page: #f2f1fb;
  --surface-shell: #f8f7f2;
  --surface-card: #fffefa;
  --surface-soft: #f2efe8;
  --text-primary: #1d2730;
  --text-secondary: #65707a;
  --text-muted: #8b96a1;
  --border-soft: #e7e2da;
  --accent-ink: #243241;
  --accent-sage: #7d9b77;
  --accent-mint: #dff3db;
  --accent-lilac: #ede5ff;
  --accent-lavender: #c9b8ff;
  --accent-peach: #ffe3c5;
  --accent-rose: #f2c8ca;
  --accent-gold: #f0c66e;
}
```

Add matching dark variables under `@media (prefers-color-scheme: dark)`.

- [ ] **Step 2: Build app shell**

Implement:

- Desktop full-width rounded app shell with compact top navigation: `QuietShelf`, `Главная`, `Ритм`, `Библиотека`, `Добавить`.
- Mobile top bar and bottom navigation.
- No future social nav items.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm run build
```

Expected: build passes.

Commit:

```bash
git add src/app src/components
git commit -m "feat: add app shell and design tokens"
```

## Task 5: Build Book UI Components

**Files:**

- Create: `src/components/book-cover.tsx`
- Create: `src/components/book-card.tsx`
- Create: `src/components/book-progress.tsx`
- Create: `src/components/weekly-summary.tsx`
- Create: `src/components/empty-state.tsx`

- [ ] **Step 1: Implement `BookCover`**

Requirements:

- Real cover keeps `2:3` aspect ratio.
- Missing cover uses title/author fallback and app palette.
- Cover image has meaningful `alt`.

- [ ] **Step 2: Implement `BookProgress`**

Requirements:

- Shows text value and visual progress.
- Uses sage-green fill.
- Does not rely on visual-only progress.

- [ ] **Step 3: Implement `BookCard`**

Requirements:

- Shows cover, title, author, status, progress, rating, and up to three tags.
- Uses shelf-like proportions, not square dashboard cards.

- [ ] **Step 4: Implement `WeeklySummary` and `EmptyState`**

Requirements:

- Weekly summary shows pages this week and current streak.
- Empty state uses copy: `Начните с книги на прикроватной тумбочке.`

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run build
```

Expected: build passes.

Commit:

```bash
git add src/components
git commit -m "feat: add quietshelf ui components"
```

## Task 6: Add Book State Hook

**Files:**

- Create: `src/hooks/use-books.ts`
- Create: `src/lib/demo-data.ts`

- [ ] **Step 1: Implement hook**

`useBooks` should provide:

```ts
{
  books,
  loading,
  error,
  createBook,
  updateBook,
  deleteBook,
  updateProgress,
  refreshBooks
}
```

Use the Dexie repository internally for MVP.

- [ ] **Step 2: Add demo data helper for development**

Create a helper that seeds three books only when the repository is empty and only when explicitly called from development UI or tests.

- [ ] **Step 3: Verify and commit**

Run:

```bash
npm run build
```

Expected: build passes.

Commit:

```bash
git add src/hooks src/lib
git commit -m "feat: add book state hook"
```

## Task 7: Implement Home Dashboard

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build home screen**

Include:

- Active-book hero.
- Large cover.
- Title, author, current page, total pages, progress.
- `+10 страниц` quick action.
- `Обновить` exact page action.
- Weekly summary.
- Current streak.
- Continue shelf.
- Empty state when no books exist.

- [ ] **Step 2: Verify core interaction**

Manually confirm:

- `+10 страниц` updates the active book.
- Progress does not exceed total pages.
- Empty state appears when there are no books.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build reading dashboard"
```

## Task 8: Implement Library

**Files:**

- Create: `src/app/library/page.tsx`

- [ ] **Step 1: Build library screen**

Include:

- Search input.
- Status segmented control.
- Sort menu.
- Book grid on desktop.
- Compact book rows on mobile.
- Empty filtered state with `Сбросить фильтры` and `Добавить книгу`.

- [ ] **Step 2: Verify behavior**

Manually confirm:

- Search works by title, author, and tags.
- Status filters work.
- Sort options work.
- Empty filtered state appears.

- [ ] **Step 3: Commit**

```bash
git add src/app/library
git commit -m "feat: build library screen"
```

## Task 9: Implement Add/Edit Book Flow

**Files:**

- Create: `src/components/book-form.tsx`
- Create: `src/lib/metadata-search.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/library/page.tsx`

- [ ] **Step 1: Implement metadata search stub**

Create `searchBookMetadata(query)` that returns an empty array when no provider is configured. This keeps the UI ready for real API search while preserving manual entry. The MVP must not depend on a real external metadata provider.

- [ ] **Step 2: Implement book form**

Fields:

- Название
- Автор
- Всего страниц
- URL обложки
- Статус
- Текущая страница
- Теги
- Оценка

Validation:

- Название required.
- Total pages positive.
- Current page within range.
- Rating `1..5` when present.

- [ ] **Step 3: Wire add/edit access**

Use a modal or dedicated inline panel reachable from `Добавить` actions in shell, home, and library.

- [ ] **Step 4: Commit**

```bash
git add src/components/book-form.tsx src/lib/metadata-search.ts src/app
git commit -m "feat: add book form flow"
```

## Task 10: Implement Book Detail

**Files:**

- Create: `src/app/books/[bookId]/page.tsx`

- [ ] **Step 1: Build detail route**

Include:

- Cover and metadata.
- Reading progress module.
- Quick progress actions.
- Exact update action.
- Status, dates, rating, tags.
- Progress history.
- Finish suggestion when current page equals total pages.

- [ ] **Step 2: Verify missing book state**

Show a helpful not-found state when the book id does not exist.

- [ ] **Step 3: Commit**

```bash
git add src/app/books
git commit -m "feat: build book detail screen"
```

## Task 11: Add Tests And E2E Coverage

**Files:**

- Create: `e2e/quietshelf.spec.ts`
- Update: unit and repository tests as needed

- [ ] **Step 1: Add Playwright config**

Configure Playwright to run against `http://127.0.0.1:3000`.

- [ ] **Step 2: Add e2e scenario**

Cover:

- Add a book manually using Russian labels.
- Update progress from home using `+10 страниц`.
- Filter in library.
- Open detail.
- Finish a book using Russian labels.
- Add rating and tags.

- [ ] **Step 3: Run verification**

Run:

```bash
npm run test:run
npm run build
npm run e2e
```

Expected: all checks pass.

- [ ] **Step 4: Commit**

```bash
git add e2e test playwright.config.*
git commit -m "test: cover quietshelf mvp flows"
```

## Task 12: Final Polish And Documentation Check

**Files:**

- Modify: `docs/app-spec.md` only if implementation intentionally changes behavior.
- Modify: `docs/ui-spec.md` only if implementation intentionally changes UI rules.
- Modify: `AGENTS.md` only if project-wide guidance changes.

- [ ] **Step 1: Run final checks**

Run:

```bash
npm run lint
npm run test:run
npm run build
npm run e2e
```

Expected: all checks pass.

- [ ] **Step 2: Manual design check**

Check:

- Active book is the strongest visual object on home.
- Library feels shelf-like without literal clutter.
- Progress is readable as text and visual state.
- Mobile layout has no horizontal overflow.
- Dark mode keeps contrast and the same design language.
- Visible copy is Russian except the `QuietShelf` brand.

- [ ] **Step 3: Commit final polish**

```bash
git add .
git commit -m "chore: polish quietshelf mvp"
```

## Self-Review

- Spec coverage: app scope, domain model, repository boundary, UI screens, states, local-first storage, tests, Russian visible copy, and future social readiness are covered.
- Placeholder scan: no unresolved placeholder markers or undefined future work is required for MVP.
- Type consistency: `Book`, `ReadingStatus`, `ProgressEntry`, `StatusHistoryEntry`, `BookRepository`, and route responsibilities match `docs/app-spec.md`.
- UI consistency: visual requirements defer to `docs/ui-spec.md` and are explicitly checked in final polish.
