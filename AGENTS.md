# AGENTS.md

## Project

Bookshelf is a personal web app for tracking reading progress. The MVP is a private, local-first reading tracker: no accounts, sync, friends, clubs, public profiles, recommendations, or achievements in v1.

The product should help one reader answer three questions quickly:

- What am I reading now?
- How do I update my progress with minimal friction?
- What is on my personal shelf?

Future social features are important, but they are not part of the MVP. Preserve the data signals that will support them later: tags, ratings, finished dates, reading cadence, and status history.

## Source Of Truth

Read these before making product, UI, or architecture decisions:

- `docs/ui-spec.md`: visual direction, layout, tokens, component rules, states, and interaction style.
- `docs/app-spec.md`: product scope, domain model, architecture, and testing plan. This file may not exist yet; if missing, create it from the approved app spec in the conversation before implementation work.
- `docs/implementation-plan.md`: task-by-task build plan for the MVP. Use it when starting implementation instead of inventing a new sequence.

If a future implementation detail conflicts with these specs, update the spec deliberately instead of silently drifting.

## Product Scope

MVP includes:

- Home dashboard with an active-book hero, quick progress actions, weekly summary, streak, and continue shelf.
- Library with search, status filters, sorting, and shelf-like book cards.
- Add/edit book flow with manual entry and optional metadata search.
- Book detail view with progress controls, status, dates, rating, tags, and progress history.
- Local browser persistence behind a repository boundary.

MVP excludes:

- Authentication
- Cloud sync
- Friends
- Clubs
- Feeds
- Public profiles
- Recommendations
- Achievement systems
- Payment or billing

## Architecture Direction

Preferred stack:

- Next.js App Router
- TypeScript
- Tailwind CSS with semantic design tokens
- Local-first persistence through a `BookRepository`

Keep these boundaries:

- UI components render screens and user interactions.
- Domain logic validates progress, statuses, ratings, tags, and finish behavior.
- Persistence is hidden behind repository interfaces.
- Future backend implementation should be able to replace local storage with `Next API + Postgres` without rewriting core UI flows.

Recommended domain concepts:

- `Book`
- `ReadingStatus`
- `ProgressEntry`
- `Rating`
- `Tag`
- `BookRepository`

Do not put storage-specific logic directly inside UI components.

## Design Direction

Follow `docs/ui-spec.md`.

Core visual idea:

- Object-led dashboard: the active book cover is the main visual anchor.
- Warm bookshelf language: tactile, calm, personal, not generic SaaS.
- Sage-green progress system: progress feels recognizable but not like a fitness app.

Important constraints:

- Use a warm paper, olive, sage, muted burgundy, and restrained gold palette.
- Do not introduce blue, purple, neon, or multiple competing accents.
- Use modern sans-serif typography. Avoid serif as the default.
- Use soft radii consistently: panels `16px`, cards/inputs `12px`, buttons pill-shaped.
- Motion should be quiet: hover, active press, subtle entrance, reduced-motion support.
- Avoid fake dashboards, decorative status dots, generic three-card layouts, and ornamental clutter.

## Data Rules

Progress:

- `currentPage` must stay within `0..totalPages`.
- Progress updates should create history entries.
- Reaching `totalPages` should suggest finishing the book.
- Finishing a book should not require rating or tags.

Book entry:

- Manual entry must always work.
- External metadata search is a convenience only.
- Search errors must not block adding a book.

Taste signals:

- Ratings are `1-5`.
- Tags are short freeform labels.
- Preserve finished dates and progress history for future social matching.

## UX States

Implement complete states, not only the happy path:

- Empty library
- Empty filtered library
- Missing cover
- Search loading
- Search error
- Save success
- Save error
- Invalid page input
- Local data loading

Use shaped skeletons instead of generic spinners where possible.

## Accessibility

Requirements:

- All text and controls meet WCAG AA contrast.
- Keyboard navigation reaches every interactive element.
- Focus states are visible on warm backgrounds.
- Progress is exposed as text, not only a visual bar.
- Form labels sit above inputs.
- Placeholder text is never the only label.
- Error messages are associated with the relevant fields.
- Cover images have meaningful alt text, unless nearby text already duplicates the same information.

## Testing Expectations

When implementation begins, cover:

- Domain logic: progress percentage, page validation, finish suggestion, status transitions, rating/tag handling.
- Repository behavior: create, update, delete, list, search, filter, sort, progress history persistence.
- UI flow: add book manually, update progress, filter library, open detail, finish book, add rating and tags.
- Edge cases: search failure, missing cover, empty library, invalid page input, reload persistence.

## Development Notes

- Follow `docs/implementation-plan.md` when implementing the MVP.
- Prefer small, well-bounded modules over large files.
- Use existing project patterns once the app is scaffolded.
- Do not add unrelated refactors while implementing a feature.
- Do not expose future social navigation unless the screens exist.
- Keep visible copy plain and useful.
- Avoid em dashes in visible UI copy.

## Documentation Maintenance

When product behavior, domain rules, or UI direction changes:

- Update `docs/app-spec.md` for product/architecture/data changes.
- Update `docs/ui-spec.md` for visual, interaction, layout, or component changes.
- Update this `AGENTS.md` only when future agents need new project-wide guidance.
