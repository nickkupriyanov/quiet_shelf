# Bookshelf UI Spec

## Design Read

Bookshelf is a personal reading tracker for readers who want a warm, calm way to keep momentum. The first version is a private product UI, not a marketing site. It should feel like a personal reading room with enough structure to become social later.

Design dials:

- `DESIGN_VARIANCE`: 5
- `MOTION_INTENSITY`: 3
- `VISUAL_DENSITY`: 5

The interface should be distinctive through material, book covers, progress rhythm, and typography. It should not rely on decorative flourishes, heavy animation, generic dashboard cards, or a beige craft-brand cliche.

## Visual Direction

Use `Object-led dashboard` as the main design principle. The active book is the visual anchor of the home screen: cover first, reading progress second, controls third.

Borrow from `Shelf system` for the library: books should feel arranged, browsable, and tactile. The shelf metaphor should be subtle and structural, not literal decoration everywhere.

Borrow lightly from `Signature progress`: progress should have a recognizable shape across the app, using sage-green fills, small weekly reading bars, and streak metrics. Avoid making the product feel like a fitness app.

## Design Tokens

### Color

Use semantic tokens rather than raw colors in components.

Light mode:

- `surface.base`: `#f3efe5`
- `surface.raised`: `#fffaf2`
- `surface.muted`: `#e9e1d1`
- `surface.shelf`: `#d8c7aa`
- `text.primary`: `#243025`
- `text.secondary`: `#6b6256`
- `text.muted`: `#8a8174`
- `border.soft`: `#d7cec0`
- `accent.primary`: `#536f48`
- `accent.primaryDark`: `#34452f`
- `accent.secondary`: `#8b3f47`
- `accent.gold`: `#c9a968`

Dark mode:

- `surface.base`: `#171b16`
- `surface.raised`: `#22271f`
- `surface.muted`: `#2d3429`
- `surface.shelf`: `#4b3d2f`
- `text.primary`: `#f2eadc`
- `text.secondary`: `#c9bead`
- `text.muted`: `#948878`
- `border.soft`: `#3c4437`
- `accent.primary`: `#9bab7b`
- `accent.primaryDark`: `#c5d0a1`
- `accent.secondary`: `#c9828b`
- `accent.gold`: `#d4b66d`

Rules:

- Green is the main action and progress color.
- Burgundy is reserved for rare taste, tag, or rating accents.
- Gold is used sparingly for finished books or achievement-like moments.
- Do not introduce blue, purple, neon, or multiple competing accent colors.

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

- App panels and book detail containers: `16px`
- Cards and inputs: `12px`
- Book covers: `6-8px`
- Buttons and segmented controls: full pill

Spacing:

- App shell padding desktop: `32px`
- App shell padding tablet: `24px`
- App shell padding mobile: `16px`
- Component gap: `12-16px`
- Section gap: `28-40px`

Elevation:

- Use soft, warm shadows only for covers and raised panels.
- Use borders and spacing before shadows for hierarchy.
- Cover shadows may be stronger than UI panel shadows because covers are physical objects.

## Core Layout

### App Shell

Desktop layout:

- Left sidebar or compact top-left rail with app name, primary nav, and add-book action.
- Main content max width around `1180-1280px`.
- Home dashboard uses a two-column composition: active book module on the left, weekly/streak modules on the right.

Mobile layout:

- Top app bar with app name and add action.
- Bottom navigation with Home, Library, and Profile/Stats placeholder.
- Home stacks active book first, then quick actions, then weekly metrics.

Primary nav:

- Home
- Library
- Add

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
- Weekly reading summary
- Current streak
- Continue shelf with other active books

Active book hero:

- Large book cover on the left or top.
- Title, author, current page, total pages, and progress percent.
- Primary action: `+10 pages`
- Secondary action: `Update`
- Tertiary action inside detail flow: `Finish book`

Progress presentation:

- Use a sage progress fill.
- Prefer a tactile horizontal progress strip in the hero.
- Add small weekly bars in the secondary summary area.
- Do not use large generic dashboard tracks everywhere.

Empty state:

- Show a composed empty shelf with one primary action: `Add book`.
- Copy: "Start with the book on your nightstand."

### Library

Purpose: browse and manage the personal shelf.

Required controls:

- Search input
- Status segmented control: `Reading`, `Want`, `Finished`, `Paused`, `All`
- Sort menu: `Recently updated`, `Title`, `Author`, `Progress`

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

- Explain the empty status and offer `Clear filters` or `Add book`.

### Add/Edit Book

Purpose: make adding a book fast even when external metadata fails.

Flow:

- Search by title or author.
- Show metadata suggestions when available.
- Manual entry is always visible or one click away.

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
- Message: "Search is unavailable. You can still add the book manually."

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

- When current page reaches total pages, suggest `Mark as finished`.
- On finish, prompt for rating and tags.
- Do not block finishing if rating/tags are skipped.

## Component System

### Buttons

Primary:

- Pill shape
- Dark olive background in light mode
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

- Want to read
- Reading
- Paused
- Finished
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
