---
name: KABSHOP
description: Modern Thai retail commerce, played straight — warm-neutral canvas, white product surfaces, near-black actions, and colour reserved for price urgency and order state.
colors:
  canvas: "#ffffff"
  canvas-2: "#f7f6f4"
  canvas-3: "#efedea"
  surface: "#ffffff"
  ink: "#16161a"
  muted: "#5c5c66"
  subtle: "#6b6b74"
  line: "#e6e4e0"
  line-strong: "#d3d0ca"
  brand: "#16161a"
  brand-hover: "#000000"
  brand-on: "#ffffff"
  sale: "#d6301f"
  sale-text: "#bd2415"
  sale-soft: "#fdecEB"
  go: "#0f7b4f"
  go-text: "#0c6642"
  go-soft: "#e8f4ee"
  focus: "#1e5eff"
fonts:
  display: Anuphan
  text: Noto Sans Thai
rounded:
  sm: "6px"
  DEFAULT: "10px"
  lg: "16px"
  full: "9999px"
shadows:
  card: "0 1px 2px rgb(22 22 26 / 0.05)"
  lift: "0 2px 4px rgb(22 22 26 / 0.05), 0 12px 28px -12px rgb(22 22 26 / 0.22)"
  pop: "0 4px 8px rgb(22 22 26 / 0.06), 0 24px 48px -20px rgb(22 22 26 / 0.28)"
---

# Design System: KABSHOP

## Overview

**Direction: the category standard, executed at full craft.**

KABSHOP does not wear a metaphor. The user considered a distinctive own-world
direction and chose the conventional modern e-commerce form instead, so the
value lives entirely in finish: honest product imagery, a calm grid, and money a
shopper can read without effort. The bar is recorded in PRODUCT.md — Apple /
Uniqlo / Zara for restraint, Shopify storefronts for layout grammar, Shopee /
Lazada for commercial clarity. Where they conflict, restraint governs the
surface and Shopee governs the information: a Thai shopper must never hunt for a
price, a stock count, or a total.

The ground is a hair warm (`canvas-2` #f7f6f4) rather than clinical grey, so
product photography sits on it instead of floating. Product surfaces are pure
white. Structure comes from hairline borders and rounded corners, not from
shadow — elevation appears only on hover of a primary action and on transient
overlays. Colour is deliberately scarce: near-black carries every primary
action, red means price urgency or a destructive act, green means fulfilment.
Nothing else is coloured.

Interface language is Thai throughout. Both faces load the Thai subset, and the
type ramp's line-heights are set generous enough for Thai ascenders and tone
marks.

**Key characteristics**

- Warm-neutral canvas; pure white product surfaces; hairline borders.
- Near-black primary actions; no coloured brand button.
- Colour reserved for two jobs only: price urgency (red) and fulfilment (green).
- Rounded corners at three steps; soft elevation on lift only.
- One numeral treatment for every figure a shopper reads as money or count.
- Thai-first typography: Anuphan display, Noto Sans Thai text.

## Colors

Each colour is stored once as RGB channels (`--c-ink: 22 22 26`) so Tailwind's
opacity modifiers work (`bg-ink/45`), with a plain alias (`--ink`) for
hand-written CSS. Never add a colour as a bare hex — the alpha modifier silently
dies if you do.

### Neutrals

| Token | Value | Use |
|---|---|---|
| `canvas` | `#ffffff` | Page ground |
| `canvas-2` | `#f7f6f4` | Section bands, image wells, table headers, chips at rest |
| `canvas-3` | `#efedea` | Skeleton highlight, disabled fills |
| `surface` | `#ffffff` | Cards and any raised panel |
| `line` | `#e6e4e0` | Default hairline: card edges, dividers, table rules |
| `line-strong` | `#d3d0ca` | Input borders and control edges that must be found by eye |

### Text

| Token | Value | On white | Use |
|---|---|---|---|
| `ink` | `#16161a` | 18.04:1 | Headings, body, prices |
| `muted` | `#5c5c66` | 6.61:1 | Secondary copy, labels, table cells |
| `subtle` | `#6b6b74` | 5.28:1 | Placeholders, tertiary meta, icon rest state |

All three clear WCAG AA on `canvas`, `canvas-2` and `canvas-3`.

### Action and signal

| Token | Value | Use |
|---|---|---|
| `brand` / `brand-hover` / `brand-on` | `#16161a` / `#000000` / `#ffffff` | Every primary button and the announcement bar |
| `sale` / `sale-text` / `sale-soft` | `#d6301f` / `#bd2415` / `#fdeceb` | Low stock, cart badge, destructive actions, error notices |
| `go` / `go-text` / `go-soft` | `#0f7b4f` / `#0c6642` / `#e8f4ee` | In-stock, order received, success notices |
| `focus` | `#1e5eff` | Focus ring and caret only — never a fill |

**Rules**

- Never introduce a fourth accent. If something needs emphasis and is neither
  price urgency nor fulfilment, give it weight or size instead.
- Solid `sale` and `go` fills carry white text; the `-soft` tints carry their
  `-text` variant. Both pairs clear AA.
- `focus` exists for the focus ring and the caret. It is not a link colour —
  links are `ink` with an underline.

## Typography

**Anuphan** (`--font-display`, 400/500/600/700) sets headings, buttons and every
figure. **Noto Sans Thai** (`--font-text`, 400/500/600/700) sets body and UI
copy. Both are loaded through `next/font/google` with the `thai` and `latin`
subsets and are self-hosted at build time.

### Ramp

| Step | Size / line-height | Use |
|---|---|---|
| `hero` | `clamp(2rem, 5vw, 3.5rem)` / 1.08 | Reserved; unused at present |
| `h1` | 40 / 48 | Page titles, the PDP price |
| `h2` | 32 / 40 | Page titles on mobile, confirmation heading |
| `h3` | 24 / 32 | Catalogue heading, PDP product name |
| `h4` | 20 / 28 | Card prices, section headings, wordmark |
| `lead` | 18 / 29 | Rare — avatar initial, emphasis |
| `base` | 16 / 26 | Body copy, form inputs |
| `small` | 14 / 22 | UI default: buttons, labels, table cells, nav |
| `caption` | 13 / 19 | Meta, hints, helper text |
| `micro` | 11 / 15 | Badges, announcement bar, category eyebrow |

### Roles

- `.u-display` — Anuphan 600, `-0.015em`, `text-wrap: balance`. Every heading.
- `.u-fig` — tabular lining figures. **Every** number a shopper reads as money
  or count: price, stock, quantity, totals, order serial, phone. Applied by
  `<Money>` automatically; add it by hand for bare counts.
- `.u-label` — 12px/600 in `muted`. Small field and data labels.
- `.u-measure` — 68ch. Any prose paragraph longer than two lines.

**Rules**

- Body copy never drops below `caption` (13px).
- 16px minimum on form inputs, so iOS does not zoom on focus.
- Do not introduce a size outside the ramp. The detector checks this against
  this file.

## Layout

- Page shell: `<Shell>` — `max-w-shell` (1360px), `px-4 sm:px-6 lg:px-8`.
  `width="column"` (980px) for admin forms, `width="narrow"` (720px) for the
  receipt and single-column error states.
- Spacing rides Tailwind's default 4px scale. Section rhythm is `pt-8 sm:pt-10`
  above a page head, `mt-14` between major sections, `gap-8` between columns.
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`,
  `gap-x-4 gap-y-8`.
- Two-column task pages (cart, checkout, account) put the summary or nav in a
  fixed track and the content in `minmax(0,1fr)`: `lg:grid-cols-[minmax(0,1fr)_360px]`.
  **Always `minmax(0,…)`** — a bare `1fr` track stretches to its content's
  intrinsic width and scrolls the whole document sideways on a phone.
- Summary and account panels are `lg:sticky lg:top-28 lg:self-start`.
- Every page has exactly one `<h1>`. On the storefront it is visually hidden;
  every other page uses `<PageHead>`.

## Elevation and shape

| Token | Use |
|---|---|
| `rounded-sm` (6px) | Inputs, buttons at `sm`/`md`, small controls |
| `rounded` (10px) | Cards, image wells, notices, large buttons |
| `rounded-lg` (16px) | The PDP gallery |
| `rounded-full` | Category chips, badges, avatars, cart count |

| Shadow | Use |
|---|---|
| `shadow-card` | Rarely — a panel that must separate from an equally light ground |
| `shadow-lift` | Primary button hover only |
| `shadow-pop` | Toasts and other transient overlays |

Cards are defined by their border, not their shadow. A resting card has no
shadow at all.

## Components

### Buttons — `<Button>`, `<ButtonLink>`

Tones: `primary` (near-black fill, lifts on hover), `secondary` (white with
`line-strong` border), `ghost` (transparent, tints on hover), `danger` (white
with `sale` border, fills red on hover).
Sizes: `sm` 36px, `md` 44px, `lg` 52px.
`busy` shows a spinner and sets `aria-busy`. The disabled skin uses `!important`
so it beats the tone's own colours — without that the tone's border survives and
a disabled button still looks live.

### Badges — `<Badge>`

Pill, `micro`, four tones: `neutral`, `sale`, `go`, `solid`. Stock state is
always stated in words inside the badge, never carried by colour alone.

### Money — `<Money>`

The only way to render a baht figure. Renders the ฿ sign at 60% opacity and
normal weight so the number leads, sets `u-fig`, and puts "บาท" in an
`sr-only` span for screen readers.

### Fields — `.u-field`

White, `line-strong` border, `rounded-sm`, 16px text, 44px effective height.
Focus is a `focus`-coloured border plus a 3px ring. `aria-invalid="true"`
switches both to `sale`. Selects get a hand-drawn chevron so they match across
browsers. Always pair with `<Label>`; never rely on a placeholder as the label.

### Cards — `.u-card` / `<Card>`

White, `line` border, `rounded`. Cards do not nest. A card that needs an
internal header uses a `border-b border-line bg-canvas-2` strip, not a second
card.

### Header — `<Masthead>`

Announcement bar (near-black, the ฿36 shipping fact) → sticky header
(`bg-surface/95 backdrop-blur`, `border-b border-line`). Logo, search, account
cluster. Search drives the catalogue through the URL (`?q=`), so a filtered view
is shareable and the back button works. Below `lg` the search moves to its own
row and navigation moves into a left drawer.

### Catalogue — `<Rack>`

Category chip rail (horizontal scroll, never wraps), then a heading with a live
result count, then the grid. Category, query and sort all live in the URL.
Product cards: square image well, category eyebrow, two-line title with a
`min-h-[44px]` so prices align across a row, then the price at `h4`. Out of
stock dims the photo to 45% and lays a scrim with a solid badge over it.

### Feedback — `<Notice>`, `useFlash()`

`<Notice>` is inline and permanent — form errors, blocking conditions. Flash
toasts are transient and land top-centre with `role="status"` and
`aria-live="polite"`. **`window.alert()` is banned**; there is none left in the
codebase.

### Empty and loading

`<Empty>` names the situation, explains it in one line, and offers the next
action. `<Skeleton>` mirrors the shape of what is coming — never a spinner in a
grid. `<PageLoading>` is for whole-route waits only.

## Motion

Two keyframes, one easing (`cubic-bezier(0.22, 1, 0.36, 1)`, exposed as
`ease-ease`).

- `animate-fade-up` (420ms) — product cards, staggered 30ms by index, capped at
  10 so a long grid does not crawl in.
- `animate-slide-down` (240ms) — toasts and the mobile drawer.
- Hover: 150–200ms on colour, 500ms on the product image scale (1.04).

Everything is wrapped by a `prefers-reduced-motion` reset. Do not animate
anything that moves layout.

## Browser surfaces

Themed rather than left to the browser: text selection, caret, `accent-color`,
scrollbar track and thumb, the focus ring, and underline offset. These are the
cheapest signal that a page was built rather than assembled.

## Do

- Reach for weight, size and space before reaching for colour.
- State stock and order status in words; let colour reinforce, never carry.
- Put every filter in the URL.
- Give every interactive target at least 40px of height.
- Use `<Money>` for every baht figure and `u-fig` for every bare count.

## Don't

- Don't add a brand colour to a button — primary is near-black.
- Don't nest cards, or put a shadow on a resting one.
- Don't add a type size or a colour outside this file.
- Don't write a bare hex into the token block; channels or the modifier breaks.
- Don't use a bare `1fr` grid track next to content that can exceed it.
- Don't reintroduce `window.alert()`.
