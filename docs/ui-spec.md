# QuietShelf UI Spec

## Design Read

QuietShelf is a personal reading tracker for readers who want a calm, polished way to keep momentum. The first version is a private product UI, not a marketing site. It should feel like a soft, modern reading dashboard with enough structure to become social later.

Design dials:

- `DESIGN_VARIANCE`: 6
- `MOTION_INTENSITY`: 3
- `VISUAL_DENSITY`: 6

The interface should be distinctive through a clean app-frame, soft modular cards, book covers, progress rhythm, and typography. It should not rely on heavy shadows, muddy green surfaces, decorative flourishes, generic dashboard cards, or a beige craft-brand cliche.

Visible UI copy is Russian. The brand name remains `QuietShelf`. Technical identifiers such as routes, TypeScript types, enum values, repository methods, and internal API names remain English.

## Visual Direction

Use `Soft product dashboard` as the main design principle. The app sits in a light rounded shell with a compact top navigation, a calm dashboard grid, and pastel module backgrounds. The active book remains the visual anchor of the home screen: cover first, reading progress second, controls third.

Borrow from `Shelf system` for the library: books should feel arranged, browsable, and tactile. The shelf metaphor should be subtle and structural, expressed through cover proportions, grouped cards, and rhythm rather than wood tones or literal shelves.

Borrow lightly from `Signature progress`: progress should have a recognizable shape across the app, using sage-green fills, small weekly reading bars, and streak metrics. Avoid making the product feel like a fitness app.

Reference direction:

- Light milk-white app container over a soft lilac and graphite page background.
- Compact top navigation with pill active state, not a heavy left rail by default.
- Rounded dashboard modules with clean internal spacing.
- Pastel supporting cards: mint, lilac, peach, rose, and restrained gold.
- Dark graphite primary actions. Sage is used for progress and reading-state confirmation.
- Avoid a swampy olive-dominant interface.
- Use the full browser width for the dashboard shell. The content should feel expansive and balanced, not like a narrow centered card.

## Design Tokens

### Color

Use semantic tokens rather than raw colors in components.

Light mode:

- `surface.page`: `#f2f1fb`
- `surface.shell`: `#f8f7f2`
- `surface.card`: `#fffefa`
- `surface.soft`: `#f2efe8`
- `text.primary`: `#1d2730`
- `text.secondary`: `#65707a`
- `text.muted`: `#8b96a1`
- `border.soft`: `#e7e2da`
- `accent.ink`: `#243241`
- `accent.sage`: `#7d9b77`
- `accent.mint`: `#dff3db`
- `accent.lilac`: `#ede5ff`
- `accent.lavender`: `#c9b8ff`
- `accent.peach`: `#ffe3c5`
- `accent.rose`: `#f2c8ca`
- `accent.gold`: `#f0c66e`

Dark mode:

- `surface.page`: `#171b22`
- `surface.shell`: `#22262d`
- `surface.card`: `#2b3038`
- `surface.soft`: `#313742`
- `text.primary`: `#f4f1ea`
- `text.secondary`: `#c7c2b8`
- `text.muted`: `#969da5`
- `border.soft`: `#3c434c`
- `accent.ink`: `#f4f1ea`
- `accent.sage`: `#9ab28f`
- `accent.mint`: `#314438`
- `accent.lilac`: `#38324d`
- `accent.lavender`: `#9d8ad7`
- `accent.peach`: `#4d3a2c`
- `accent.rose`: `#50363b`
- `accent.gold`: `#d8b969`

Rules:

- Dark graphite is the main action color.
- Sage is the main progress and reading-state color.
- Lilac, mint, peach, and rose are supporting module tints, not competing CTA colors.
- Gold is used sparingly for finished books or special completion moments.
- Do not use muddy olive as the dominant surface color.
- Do not introduce neon or saturated blue/purple glows.

### Typography

Recommended pairing:

- Display and section headings: `Cabinet Grotesk` or `Satoshi`
- UI/body: `Geist`
- Numbers and compact metadata: `Geist Mono`

Scale:

- Page title: `40-48px`, `line-height: 1.05`, weight `750-850`
- Section title: `24-32px`, `line-height: 1.1`, weight `700-800`
- Card title: `17-21px`, `line-height: 1.15`, weight `700`
- Body: `15-16px`, `line-height: 1.55`, weight `400`
- Metadata: `12-13px`, `line-height: 1.3`, weight `500`

Rules:

- Use sentence case for UI labels.
- Avoid all-caps labels except tiny metadata where it improves scanning.
- Avoid serif as the default. The product is warm through color and material, not old-book typography.

### Shape, Spacing, Elevation

Radius system:

- App shell: `20px`
- App panels and book detail containers: `18-20px`
- Cards and inputs: `12-14px`
- Book covers: `6-8px`
- Buttons and segmented controls: full pill

Spacing:

- App shell padding desktop: `16px` inside the rounded app-frame
- App shell padding tablet: `24px`
- App shell padding mobile: `16px`
- Component gap: `10-14px`
- Section gap: `14-18px` inside dashboard grids

Elevation:

- Use soft, cool-neutral shadows only for covers and raised panels.
- Use borders and spacing before shadows for hierarchy.
- Cover shadows may be stronger than UI panel shadows because covers are physical objects.

## Core Layout

### App Shell

Desktop layout:

- Rounded app-frame fills the available browser width with compact top navigation, app name, primary nav, and utility actions.
- Main content uses `100%` width with responsive horizontal padding. Cap individual text blocks rather than the whole dashboard.
- Home dashboard uses a two-column structure on desktop: the left column contains reading cadence, active book, and shelf; the right column contains profile, actions, and the insight widget.
- A left rail is allowed only if the final implementation needs denser navigation later. It is not the default MVP direction.

Mobile layout:

- Top app bar with app name and add action.
- Bottom navigation with `Главная`, `Библиотека`, and `Добавить`.
- Home stacks header, reading cadence, active book, profile summary, insight widget, and shelf.
- The active book and `+10 страниц` action must remain visible before the user reaches the shelf.

Primary nav:

- `Главная`
- `Библиотека`
- `Добавить`

Future nav slots:

- Taste
- Friends
- Clubs

Do not expose future nav items in MVP unless they have real screens.

### Home Dashboard

Purpose: answer "what should I read or update right now?"

Required modules:

- Active book hero
- Quick progress actions
- Reading cadence strip with the current seven-day range
- Weekly reading summary
- Current streak
- Continue shelf with other active books
- Reader summary with local reading stats
- Insight widget carousel with `Сегодня`, `Неделя`, `История`, and `Финиш` slides

Active book hero:

- Large book cover on the left or top.
- Title, author, current page, total pages, and progress percent.
- Primary action: `+10 страниц`
- Secondary action: `Обновить`
- Tertiary action inside detail flow: `Завершить книгу`

Progress presentation:

- Use a sage progress fill.
- Prefer a tactile horizontal progress strip in the hero.
- Add small weekly bars in the secondary summary area.
- Do not use large generic dashboard tracks everywhere.

Right-side insight widget:

- Use an auto-rotating carousel with slides: `Сегодня`, `Неделя`, `История`, `Финиш`.
- Rotate every 20 seconds.
- Default to `Сегодня`.
- Show one dot per slide at the bottom of the widget and highlight the active dot.
- `Сегодня`: prompt to update the active book, with `+10 страниц` and `Обновить`.
- `Неделя`: show pages read, current streak, and finished count.
- `История`: show recent progress entries and status changes. This uses `ProgressEntry` and `StatusHistoryEntry`; it is not a notes feature.
- `Финиш`: show remaining pages for unfinished books, or rating, tags, finish date, and status history for finished books.
- Keep the container height stable across slides on desktop.

Empty state:

- Show a composed empty shelf with one primary action: `Добавить книгу`.
- Copy: "Начните с книги на прикроватной тумбочке."

### Library

Purpose: browse and manage the personal shelf.

Required controls:

- Search input
- Status segmented control: `Читаю`, `Планирую`, `Прочитано`, `Пауза`, `Все`
- Sort menu: `Недавно обновленные`, `Название`, `Автор`, `Прогресс`

Grid:

- Desktop: shelf-inspired grid with book covers and compact metadata.
- Mobile: one-column list with cover thumbnail, title, author, status, and progress.
- Avoid identical square cards. Book covers should create natural variation.

Book card content:

- Cover
- Title
- Author
- Status
- Progress if reading
- Rating if finished
- Tags as subdued chips, max 3 visible

Empty filtered state:

- Explain the empty status and offer `Сбросить фильтры` or `Добавить книгу`.

### Add/Edit Book

Purpose: make adding a book fast even when external metadata fails.

Flow:

- Search by title or author.
- Show metadata suggestions when available.
- Manual entry is always visible or one click away.
- MVP metadata search is stub-only: keep the UI and error state ready, but do not require a real external provider.

Fields:

- Title, required
- Author, optional but encouraged
- Total pages, required for progress tracking
- Cover URL or generated placeholder color
- Status
- Current page
- Tags
- Rating

Validation:

- Current page must be between `0` and `totalPages`.
- Rating is `1-5`.
- Tags are short freeform labels.

Search error:

- Keep the manual form usable.
- Message: "Поиск недоступен. Книгу все равно можно добавить вручную."

### Book Detail

Purpose: manage one book without losing reading momentum.

Required sections:

- Cover and primary metadata
- Reading progress module
- Quick update controls
- Status and dates
- Rating and tags
- Progress history

Progress history:

- Show a compact timeline or grouped list by date.
- Keep it secondary. It supports reflection, not daily action.

Finish flow:

- When current page reaches total pages, suggest `Завершить книгу`.
- On finish, prompt for rating and tags.
- Do not block finishing if rating/tags are skipped.

## Component System

### Buttons

Primary:

- Pill shape
- Dark graphite background in light mode
- Light text with WCAG AA contrast
- Active state: translate down `1px`

Secondary:

- Pill shape
- Transparent or raised surface
- Soft border
- Olive text

Icon buttons:

- Use one icon family only, preferably Phosphor or Tabler.
- Use icons for add, edit, search, filter, close, and more actions.
- Always include accessible labels.

### Book Covers

Real covers:

- Preserve aspect ratio around `2:3`.
- Reserve layout space to prevent shift.
- Use cover shadow and subtle border.

Fallback covers:

- Generate from title, author, and one of the app palette colors.
- Include short title text only when it remains readable.
- Avoid fake detailed cover art.

### Tags and Ratings

Tags:

- Rounded chips with muted background.
- Use lower visual weight than progress or primary actions.
- Limit visible tags in cards to 3.

Ratings:

- Use text or simple icon treatment.
- Avoid loud gold stars everywhere. Gold is a finish-state accent, not a dominant color.

### Forms

Rules:

- Labels above inputs.
- Placeholder is never the label.
- Helper/error text below inputs.
- Focus ring uses `accent.primary`.
- Inputs use `surface.raised`, `border.soft`, and clear text contrast.

## Motion and Interaction

Motion should communicate feedback, not spectacle.

Allowed:

- Hover lift on book covers: small translate and shadow shift.
- Button active press: `translateY(1px)` or `scale(0.98)`.
- Add/update success: subtle inline confirmation.
- Route or panel entrance: opacity and `8-12px` translate.

Reduced motion:

- Disable non-essential movement.
- Keep instant state changes and focus states.

Do not use:

- Scroll hijacking
- Marquees
- Parallax
- Constant pulsing
- Decorative cursor effects

## Responsive Rules

Breakpoints:

- Mobile: `< 768px`
- Tablet: `768-1023px`
- Desktop: `1024px+`

Mobile requirements:

- No horizontal scrolling.
- Active book cover remains visible but does not dominate the whole viewport.
- Primary progress action is reachable without scrolling far.
- Library cards become compact rows.
- Forms use full-width controls.

Desktop requirements:

- Navigation fits one line or one rail.
- No CTA text wraps.
- Home first viewport shows active book and at least one progress metric.

## Accessibility

Requirements:

- All text and controls meet WCAG AA contrast.
- Keyboard navigation reaches every interactive element.
- Focus states are visible on warm backgrounds.
- Book cover images have meaningful alt text or are marked decorative when duplicated by nearby text.
- Progress values are exposed as text, not only visuals.
- Error messages are associated with fields.

## States

Global states:

- Loading local data
- Empty library
- Search loading
- Search error
- Save success
- Save error

Book states:

- Планирую
- Читаю
- Пауза
- Прочитано
- Missing cover
- Invalid page input

Do not use generic spinners as the primary loading pattern. Use skeletons shaped like the final panels or rows.

## Future Social Readiness

The MVP UI should quietly collect and display data that later supports friends and similarity:

- Tags
- Ratings
- Finished dates
- Reading cadence
- Status history

Do not implement friends, clubs, feeds, public profiles, or achievements in MVP. Reserve visual space only where it does not create dead UI.

Future surfaces:

- Taste profile: genre/tag distribution and favorite books.
- Friends: overlap, shared books, compatible tags.
- Clubs: shared book, group progress, discussion prompts.

## Acceptance Checklist

- Home screen feels like a personal reading room, not a generic dashboard.
- Active book is the strongest visual object on the home screen.
- Library feels shelf-like without becoming literal or decorative.
- Progress is clear, fast to update, and visually consistent.
- Manual book entry works even if metadata search fails.
- The UI remains usable and calm on mobile.
- Dark mode uses the same design language, not a separate theme.
- No AI-purple gradients, generic three-card feature rows, fake dashboard screenshots, decorative status dots, or em-dashes in visible copy.
