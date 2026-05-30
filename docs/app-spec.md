# Bookshelf App Spec

## Summary

Bookshelf MVP is a private web app for tracking personal reading momentum. It starts local-first without accounts, sync, friends, clubs, public profiles, recommendations, or achievements.

The product centers on one daily job: help the user quickly see what they are reading, update progress, and keep a useful personal library.

The MVP should preserve the signals needed for future social features: ratings, tags, reading cadence, finished dates, and status history.

## Core Product

### Home Dashboard

Purpose: answer "what should I read or update right now?"

Required behavior:

- Show the active book as the primary object.
- Show cover, title, author, current page, total pages, and progress.
- Provide quick actions: `+10 pages` and `Update`.
- Show weekly reading summary, current streak, and a small continue shelf.
- If no books exist, show an empty shelf state with a primary `Add book` action.

### Library

Purpose: browse and manage the personal shelf.

Required behavior:

- Search by title, author, and tags.
- Filter by status: `reading`, `want_to_read`, `finished`, `paused`, and all.
- Sort by recently updated, title, author, and progress.
- Show progress for reading books.
- Show rating and tags for finished or tagged books.
- Handle empty filtered results with `Clear filters` and `Add book` actions.

### Add/Edit Book

Purpose: make adding a book fast even when external metadata fails.

Required behavior:

- Support manual entry as the reliable default path.
- Support optional metadata search by title or author.
- Let search suggestions prefill book fields.
- Keep manual entry available when search fails.
- Validate page counts, current page, rating, and required title.

### Book Detail

Purpose: manage one book without losing reading momentum.

Required behavior:

- Show cover, title, author, status, dates, current page, total pages, and progress.
- Allow quick progress updates and exact page updates.
- Store progress history.
- Allow editing status, rating, and tags.
- Suggest marking the book finished when current page reaches total pages.
- Do not require rating or tags to finish a book.

## Data And Interfaces

### Domain Types

`Book`:

- `id`
- `title`
- `author`
- `coverUrl`
- `totalPages`
- `currentPage`
- `status`
- `rating`
- `tags`
- `startedAt`
- `finishedAt`
- `createdAt`
- `updatedAt`

`ReadingStatus`:

- `want_to_read`
- `reading`
- `finished`
- `paused`

`ProgressEntry`:

- `id`
- `bookId`
- `page`
- `deltaPages`
- `createdAt`

`BookRepository`:

- Create a book.
- Update a book.
- Delete a book.
- Get a book by id.
- List books.
- Search, filter, and sort books.
- Add and list progress entries.

### Rules

- `title` is required.
- `totalPages` is required for progress tracking.
- `currentPage` must stay within `0..totalPages`.
- `rating` is optional and must be `1-5` when present.
- Tags are optional short freeform labels.
- Progress updates should create history entries.
- Reaching `totalPages` should suggest finishing the book.
- External metadata search is helper behavior only. Manual entry must always work.

## Architecture

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS with semantic design tokens
- Local-first persistence behind `BookRepository`

Boundaries:

- UI components handle rendering and user interaction.
- Domain logic handles validation, progress calculations, status transitions, and finish suggestions.
- Persistence is hidden behind repository interfaces.
- Local storage implementation should be replaceable later with `Next API + Postgres`.

Recommended local persistence:

- IndexedDB for durable local data and query flexibility.
- A small seed/demo data helper may exist for development, but production behavior should not depend on demo data.

Future backend direction:

- `Next API + Postgres`
- Auth and sync should be added later without rewriting the MVP domain model.

## UX And States

Required states:

- Empty library
- Empty filtered library
- Missing cover
- Search loading
- Search error
- Save success
- Save error
- Invalid page input
- Local data loading

State behavior:

- Empty library should guide the user to add the first book.
- Missing covers should use a generated fallback cover.
- Search errors should keep the manual form usable.
- Save errors should preserve input and explain what failed.
- Loading should use skeletons shaped like the final UI, not generic spinners.

## Future Social Readiness

Do not implement social features in MVP.

Preserve data for later:

- Ratings for taste matching.
- Tags for interest overlap.
- Finished dates for reading history.
- Progress history for cadence, streaks, and future achievements.
- Status history for future profile or club activity.

Possible future surfaces:

- Taste profile
- Friends and similarity
- Shared books
- Reading clubs
- Club progress and discussion prompts
- Achievements

## Test Plan

Unit tests:

- Progress percentage calculation.
- Page validation.
- `+10 pages` behavior near `totalPages`.
- Finish suggestion.
- Status transitions.
- Rating and tag validation.

Repository tests:

- Create, update, delete, get, and list books.
- Search by title, author, and tags.
- Filter by status.
- Sort by updated date, title, author, and progress.
- Persist and retrieve progress history.
- Survive page reload with local data intact.

UI/e2e scenarios:

- Add a book manually.
- Update progress from the home dashboard.
- Filter the library.
- Open book detail.
- Finish a book.
- Add rating and tags after finishing.
- Recover from metadata search failure by using manual entry.

## Assumptions

- MVP is single-user and local-first.
- No auth, sync, social features, public pages, recommendations, or achievements in v1.
- UI follows `docs/ui-spec.md`.
- Project-wide agent guidance lives in `AGENTS.md`.
- Future backend direction is `Next API + Postgres`, not Supabase by default.
