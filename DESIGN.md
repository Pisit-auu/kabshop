---
name: KABSHOP
description: A Thai general store set as a daily classified sheet — newsprint ground, hairline rules, four section inks, and one numeral treatment from the rack to the receipt.
colors:
  paper: "#edebe4"
  paper-deep: "#e3e0d6"
  stock: "#fbfaf7"
  ink: "#191813"
  ink-mid: "#57554a"
  ink-soft: "#656358"
  rule: "#c9c6b8"
  rule-mid: "#ada99a"
  scarlet: "#c81e24"
  scarlet-text: "#a81318"
  cobalt: "#1240c4"
  jade: "#0b6b4f"
  jade-text: "#0a5f46"
  chrome: "#e9a400"
  chrome-text: "#8a5a00"
  section-on: "#ffffff"
typography:
  masthead:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 8vw, 5.5rem)"
    fontWeight: 900
    lineHeight: "0.86"
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "50px"
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "40px"
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "27px"
    fontWeight: 800
    lineHeight: "32px"
    letterSpacing: "-0.015em"
  h4:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: "27px"
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Sarabun, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "30px"
  base:
    fontFamily: "Sarabun, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "27px"
  small:
    fontFamily: "Sarabun, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
  caption:
    fontFamily: "Sarabun, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "17px"
  label:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "14px"
    letterSpacing: "0.09em"
  figure:
    fontFamily: "Kanit, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
    fontFeature: "tnum 1, lnum 1"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "20": "80px"
components:
  button-section:
    backgroundColor: "{colors.scarlet}"
    textColor: "{colors.section-on}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "46px"
    typography: "{typography.small}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "46px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "46px"
  button-quiet-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.scarlet-text}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "46px"
  button-disabled:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink-soft}"
  field:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "11px 12px"
    width: "100%"
  cell:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
  mark-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
    typography: "{typography.label}"
  mark-scarlet:
    backgroundColor: "{colors.scarlet}"
    textColor: "{colors.section-on}"
    rounded: "{rounded.none}"
    padding: "2px 6px"
  index-cell-active:
    backgroundColor: "{colors.scarlet}"
    textColor: "{colors.section-on}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "46px"
---

# Design System: KABSHOP

## Overview

**Creative North Star: "The Classified"**

KABSHOP is set as the classified section of a Thai daily. A general store that carries
everything has no single vertical to dress itself in, so it borrows the one layout built
for exactly that problem: a ruled sheet where anything can be listed next to anything, and
the reader still knows where they are. Rules are the material. Not decoration between
things — the thing itself. Cells sit shoulder to shoulder separated by a single hairline;
grids draw their gutters by letting a `rule`-coloured parent show through one-pixel gaps.
Where a marketplace would float a rounded card on grey, this sheet prints a white block on
newsprint and draws a line around it.

The ground is real stock. `paper` (#edebe4) carries a two-axis repeating-gradient fibre
tooth so it reads as a sheet rather than as a flat grey; cells are printed on `stock`
(#fbfaf7), a lighter, cleaner white. Depth comes from that stock difference and from rule
weight — hairline, 3px, 6px, `border-t-2` — never from a shadow. Four flat section inks
(scarlet, cobalt, jade, chrome) flood whole regions rather than tinting small ones, and
only one is live at a time: it is set as a data attribute on the document root, so choosing
a category re-rules the masthead flash, the index, the section head, the focus ring, the
caret, the text selection and every cell shoulder in a single move.

Money is the headline. Every baht, stock count, quantity, phone number and order serial in
the product is set in one numeral treatment — Kanit, tabular lining figures — on the rack,
in the cart, at checkout and on the receipt alike. The price is the largest type inside a
product cell, larger than the product's own name, because the trust moment in a general
store is the number. Interface language is Thai throughout; Kanit and Sarabun are both
loaded with the Thai subset, and the type ramp's line-heights are set generous enough for
Thai ascenders and tone marks.

**Key Characteristics:**
- Newsprint ground with a printed fibre tooth; white cell stock on top of it.
- Hairline rules as the structural material — including as grid gutters (`gap-px`).
- Four flat section inks, one live at a time, set on the document root.
- Zero border radius and zero drop shadows anywhere in the build.
- One numeral treatment for every figure, storefront through receipt.
- Reversed-type blocks for state; no pastel tint chips.
- Thai-first typography: Kanit for display and figures, Sarabun for text.

## Colors

A newsprint neutral spine — four paper/ink greys and two rule greys — cut by four saturated
flat inks that never mix on one screen.

### Primary

- **Section Ink** (`--section-fill`, a live alias): the one accent in play. Resolved from
  `[data-section]` on `<html>`, defaulting to scarlet. It fills the masthead flash rule, the
  active index cell, the section-ink shoulder on every product cell, the primary button,
  the selected payment method, the active account-menu row, and the browser's own surfaces
  (selection, caret, `accent-color`, focus outline). Its paired `--section-text` is the
  darkened, on-paper legible variant used for links and small emphasis; `--section-on`
  (#ffffff, or `ink` under chrome) is the reversed-type foreground.
- **Scarlet** (#c81e24 / text #a81318): the default section and the alarm ink. Doubles as
  the destructive tone — delete affordances, the "เหลือ N ชิ้น" low-stock mark, invalid
  fields — regardless of which section is live.
- **Cobalt** (#1240c4): the back office's fixed section. Every `/admin` route and the
  profile form pin `data-section="cobalt"`, so the operator's world is a stable colour
  rather than a hashed one. Its `-text` variant is the same value; cobalt is dark enough to
  read on paper unchanged.
- **Jade** (#0b6b4f / text #0a5f46): the completion ink. The section for order history, the
  receipt header's flood, the grand-total figure on the bill, and the `ok` flash.
- **Chrome** (#e9a400 / text #8a5a00): the light section ink. It is the one ink that
  reverses to `ink` rather than white; its `-text` variant is heavily darkened because the
  raw amber fails on paper.

### Neutral

- **Newsprint** (`paper`, #edebe4): the page ground, printed with a faint fibre tooth
  (two repeating linear gradients at ~2% opacity). Also the reversed foreground on ink bars.
- **Deep Newsprint** (`paper-deep`, #e3e0d6): image wells, disabled surfaces, the footer
  ground, the inert half of a flash rule, skeleton blocks.
- **Cell Stock** (`stock`, #fbfaf7): the printed-on-white of every cell, panel, fieldset and
  receipt. The single most-used surface after the ground.
- **Soft Black** (`ink`, #191813): all primary text, the masthead bar, the heavy rules,
  reversed-type marks, and the browser theme colour. Warm, not #000.
- **Mid Ink** (`ink-mid`, #57554a): secondary copy — metadata lines, descriptions, `dt`
  labels, the `u-label` colour.
- **Soft Ink** (`ink-soft`, #656358): the quietest legible text — placeholders, notes,
  captions under figures, disabled type, empty-state glyph fills.
- **Hairline** (`rule`, #c9c6b8): the default 1px rule and the grid-gutter colour.
- **Heavy Hairline** (`rule-mid`, #ada99a): field borders, dashed tear lines, scrollbar
  thumb, decorative underlines at rest.

### Named Rules

**The One Ink Rule.** Exactly one section ink is live per page, set as
`document.documentElement.dataset.section` and cleared on unmount. Never hardcode a second
ink into a region to "add colour" — if a surface needs an ink, it reads the live one via
`var(--section-fill)`. The only inks allowed outside the live section are scarlet as the
danger/alarm role and jade as the success role.

**The Flood Rule.** Section ink arrives as a solid flood of a whole region — a full-bleed
flash rule, a filled index cell, a filled receipt header — or as a 3px–6px bar. It is never
a 10% tint behind text and never a border-only accent on an otherwise neutral block.

**The Reversed-Type Rule.** State is printed, not tinted. Stock warnings, flash messages
and status marks are solid ink blocks with reversed type; there are no pale pastel chips
anywhere in the build.

## Typography

**Display Font:** Kanit (weights 500–900, Thai + Latin subsets, `--font-display`), fallback
`system-ui, sans-serif`
**Body Font:** Sarabun (weights 400–700, Thai + Latin subsets, `--font-text`), fallback
`system-ui, sans-serif`
**Figures:** Kanit, tabular lining (`tnum`, `lnum`), tracked −0.02em — the `.u-fig` role

**Character:** Kanit is a Thai grotesque with flat terminals and a loop-less construction
that sets like a headline face at 800–900 and like a newspaper figure at any size; Sarabun
is the looped, quieter reading face underneath it. The pairing is the news-stand
relationship: everything shouted is Kanit, everything read is Sarabun, and every number is
Kanit so figures column up wherever they appear.

### Hierarchy

- **Masthead** (Kanit 900, `clamp(2.25rem, 8vw, 5.5rem)`, line-height 0.86, −0.035em): the
  KABSHOP nameplate on the front page only. It is that page's `<h1>`.
- **Display / h1** (Kanit 800, 48px/50px, −0.03em): route titles at `sm` and up; the
  `RunningHead` title and the product name step up to this size on wide screens.
- **h2** (Kanit 800, 36px/40px, −0.02em): the default `RunningHead` title size, auth-frame
  headings, receipt confirmation.
- **h3** (Kanit 800, 27px/32px, −0.015em): the rack's live section name; the checkout
  grand total figure.
- **h4** (Kanit 800, 21px/27px, −0.01em): the product cell's price, back-office section
  headings, empty-state titles, the order-serial figure on the receipt.
- **Lead** (Sarabun 400, 18px/30px): the quantity figure in the product stepper; sparse.
- **Body** (Sarabun 400, 16px/27px): product descriptions and form input text. Prose is
  capped at 68ch (`u-measure`).
- **Small** (Sarabun 400, 14px/22px): the workhorse — cell titles, table rows, metadata,
  notice bodies, button labels at `md`.
- **Caption** (Sarabun 400, 12px/17px): notes under figures, breadcrumbs, helper text,
  button labels at `sm`.
- **Label** (`u-label`; Kanit 600, 11px/14px, +0.09em, uppercase, `ink-mid`): field labels,
  `dt` terms, section eyebrows inside components, the flag line above the nameplate.

### Named Rules

**The One Numeral Rule.** Every figure a reader might check — price, subtotal, shipping,
grand total, stock count, cart count, quantity, phone number, order serial, accumulated
spend — is set with `.u-fig`. Same face, same tabular lining figures, same tracking, on the
storefront, in the drawer, at checkout and on the printed receipt. Never let a number
inherit Sarabun.

**The Price-Is-The-Headline Rule.** Inside a product cell the price is the largest type in
the block (h4, above a 14px title); on the product page it is set at 40px in the section
text ink, above everything but the product name. If a layout makes the price smaller than
its neighbours, the layout is wrong.

**The Single Nameplate Rule.** Every route carries exactly one `<h1>`. On the storefront it
is the masthead wordmark itself (`Masthead size="full"` renders the wordmark as `h1`); every
other route renders `size="strip"`, where the wordmark drops to a `span` and the page's own
`RunningHead` (default `as="h1"`) supplies the heading.

## Layout

The page is a **sheet**: a centred column at `max-w-sheet` (1240px) with 16px gutters
rising to 24px at `sm`, and — this is the structural move — an inset 1px vertical rule down
its left edge (`.u-spine`, `box-shadow: inset 1px 0 0`), with content indented past it. Every
region on a page registers to that one line. Two narrower widths exist for single-column
work: `narrow` (720px, the receipt and error states) and `column` (980px).

Spacing rides Tailwind's default 4px scale, unpruned and deliberately so — the discipline
lives in the usage, not in a truncated scale that would silently void utilities like `h-11`.
In practice: 12px inside a compact cell, 20px inside a panel, 24px inside a page section,
32px between panels, 40px between major page regions, 80px of bottom padding before the
footer.

Grids are ruled, not gapped. A product rack is `grid gap-px bg-rule` with `bg-stock`
children, so the one-pixel gutter *is* the hairline; the same trick draws the admin figures
band, the receipt's meta pairs and the payment-method pair. Breakpoints are Tailwind's
defaults, used at three densities: the rack runs 2 columns on phones, 3 at `sm` (640px),
4 at `lg` (1024px). Task pages (checkout, admin) collapse a
`[minmax(0,1fr)_360px]` / `[minmax(0,1fr)_320px]` two-track layout to a single column below
`lg`, and the checkout summary sticks at `lg:top-6`. The back office prints a ruled list on
phones and a table only at `lg`, and its content track carries `min-w-0` so a wide table
cannot push the document sideways.

Interactive targets are floored at 44–46px: `min-h-[46px]` on buttons, index cells and menu
rows, `h-11` on masthead controls, `min-h-[52px]` on account rows, `min-h-[40px]` on inline
text links so a tap has somewhere to land.

### Named Rules

**The Spine Rule.** Content inside a `Sheet` never sits flush left. It registers to the
spine's hairline with a 16/24px indent, the way columns register to a margin rule.

**The Hairline Gutter Rule.** A grid of cells separates its cells with `gap-px` over a
`bg-rule` parent. Do not add per-cell borders that would double up into 2px seams, and do
not use empty space where a rule belongs.

## Elevation & Depth

**There are no drop shadows in this system.** No `box-shadow` in the build casts anything
outward; there is no `boxShadow` scale in the Tailwind config. Depth is printed: the stock
difference between the `paper` ground and the `stock` cell, the fibre tooth on the ground,
and a four-step rule weight that reads as hierarchy the way a printed page's rules do —
1px hairline (`rule`) for ordinary separation, 3px (`rule` weight `mid`) for a section head,
6px for a page head, and `border-2 border-ink` for the heaviest frame in a region (the
checkout total box, the receipt's item list).

Only overlays leave the plane, and they do it with ink rather than shadow: the index drawer
sits on a `bg-ink/55` scrim, the flash stack sits at `z-[100]` as solid blocks.

### Shadow Vocabulary

The two `box-shadow` values in the build both point inward. They are pressure, not elevation.

- **Section pressure** (`box-shadow: inset 0 -3px 0 rgba(0,0,0,0.34)`): hover on a filled
  section-ink or scarlet control — the ink darkening at the bottom edge, as if pressed.
- **Ink pressure** (`box-shadow: inset 0 -3px 0 rgba(255,255,255,0.28)`): hover on a filled
  `ink` control, the same gesture reversed out.
- **Spine** (`box-shadow: inset 1px 0 0 var(--rule)`): structural, not stateful — the sheet's
  registration rule.

### Named Rules

**The Pressure-Not-Lift Rule.** A control under the cursor gets an inset bottom bar and, on
`:active`, `translate-y-px`. It never lifts, never gains an offset block shadow, and never
scales. The one scale in the system is a 1.03 image zoom inside a product cell's fixed
frame, which reads as the picture moving under the crop, not the cell rising.

## Shapes

**Zero radius, everywhere.** The Tailwind radius scale is pruned to `none` (0px) and `full`
(9999px), and in the shipped build no `rounded-*` class appears at all — the cart-count
badge, which the scale reserves `full` for, ships as a square ink block like everything
else. Corners are corners. This is the load-bearing constraint of the world: the moment one
surface curves, it stops being printed and starts being a card.

Form language is drawn with borders and fills only:

- **Cells and panels**: 1px `rule` border on `stock`. The heaviest variant is
  `border-2 border-ink` for a totals box.
- **Marks**: solid rectangles of ink with reversed 11px uppercase Kanit — no pill, no
  outline, flush to the corner of an image well when they annotate one.
- **Flash rules**: a two-part horizontal bar, a short section-ink run (`w-1/3`, `w-24`,
  `w-20`) butted against a long `ink` or `paper-deep` remainder. This asymmetric bar is the
  system's recurring silhouette: it appears under the masthead, under every `RunningHead`,
  under the rack's section title, and under every back-office form header.
- **Tear lines**: `border-dashed border-rule-mid` — used for the receipt's torn top and
  bottom edges, its item rows, and the sidebar's accumulated-spend divider.
- **Icons** are Lucide line icons at 13–40px, `strokeWidth` 1.5 for large decorative use and
  2–2.5 inside solid marks. No glyph or emoji icons.

## Components

### Buttons

Stamped ink blocks. Four tones, three sizes, one shared base of `font-display font-semibold`
at `tracking-[0.01em]`, transitions on box-shadow/background/colour/transform at 150ms
`ease-press`.

- **Shape:** square (0px radius), 1px border on every tone including the filled ones.
- **Sizes:** `sm` `min-h-38px / px-12px / caption`, `md` `min-h-46px / px-20px / small`,
  `lg` `min-h-56px / px-24px / base`.
- **Section (default):** section-ink fill, `--section-on` text, section-ink border.
- **Ink:** soft-black fill, newsprint text — the neutral affirmative (e.g. "เลือกซื้อสินค้าต่อ").
- **Quiet:** transparent with a 1px ink border; hover inverts to a solid ink block.
- **Danger:** transparent with a scarlet border and `scarlet-text` label; hover floods
  scarlet with white type.
- **Hover / Active:** inset bottom pressure bar (see Elevation); `active:translate-y-px`.
- **Busy:** `busy` sets `aria-busy`, disables the control, and prepends a spinning
  `Loader2` at 16px. Busy and disabled are the same visual state.
- **Disabled:** forced to `paper-deep` on `ink-soft` with a `rule-mid` border and no shadow,
  via `!important` so no tone can override it.
- `ButtonLink` renders the identical skin as a `next/link` for navigation.

### Inputs / Fields

- **Style** (`.u-field`): full-width `stock` block, 1px `rule-mid` border, and a **2px
  soft-black bottom border** — a compositor's slug: a hairline box sitting on a thick
  baseline. 11px/12px padding, 16px text (never smaller, so iOS does not zoom).
- **Hover:** border darkens to `ink-mid`.
- **Focus:** all four edges take the live section ink; the native outline is suppressed in
  favour of that, while everything else in the app uses a 2px section-ink
  `:focus-visible` outline at 2px offset.
- **Invalid:** `[aria-invalid="true"]` turns the box and its baseline scarlet.
- **Disabled:** `paper-deep` ground, `ink-soft` text, `rule-mid` baseline, `not-allowed`.
- **Select:** native chevron removed and redrawn as two 6px ink triangles from gradients,
  with 34px of right padding.
- **Labels** (`Label`): 11px uppercase Kanit `u-label`, 8px above the field, with an optional
  lowercase `caption` hint set beside it on the baseline.

### Cards / Containers

There are no cards — there are cells and panels.

- **Product cell:** a full-height `stock` block opening with a 3px section-ink shoulder,
  then a 4:3 image well on `paper-deep`, then a `rule`-bordered text block carrying the
  category label in that cell's own section text ink, a two-line clamped 14px title, and the
  price pushed to the bottom with `mt-auto` at h4. Each cell carries its own
  `data-section`, hashed from its category name, so the shoulder colours by section even
  inside a mixed rack. Hover: ground lifts to pure white, title underlines, image scales
  1.03 over 500ms.
- **Panel:** `border border-rule bg-stock` with a `border-b border-rule` header strip
  (12px/20px padding, 14px bold Kanit) and 20px body padding. Used for every checkout
  section, every admin section and the account sidebar.
- **Fieldset:** the same panel with a visually-hidden `legend` and a printed title row.
- **Internal padding:** 12px in a compact cell, 16–20px in a panel, 24–40px on the receipt.

### Navigation

- **Masthead:** a full-width soft-black bar. A flag line across the top prints the Thai long
  date (rendered after mount, since server and reader rarely share a day) and the standing
  shipping fact in 11px uppercase at `white/60`. `size="full"` centres the nameplate for the
  front page with the drawer button absolutely positioned left and the account nav right;
  `size="strip"` prints a compact row with the wordmark at h4/h3 and the logo hidden below
  `sm`. Controls are 44px squares with `white/25` borders that fill to `white/10` on hover.
  The bar closes with the **flash rule**: a one-third section-ink run against a `paper-deep`
  remainder, transitioning colour over 300ms when the section changes.
- **Index drawer:** a `min(340px, 86vw)` newsprint panel over an `ink/55` scrim, with an ink
  header, `border-b border-rule` rows at 46px minimum, `aria-current="page"` on the active
  row, and Escape-to-close with body scroll locked.
- **Category index (the rack's table of contents):** a wrapping row of ruled cells bounded
  top and bottom by `border-2 border-ink`, each cell a 46px `border-b border-r rule` button
  carrying the category name and its product count in `u-fig`. Active cell floods with the
  section ink; inactive hover takes `paper-deep`. `aria-pressed` carries selection state.
- **Account sidebar:** a bordered `stock` panel whose head prints the account name and
  accumulated spend across a dashed rule, above 52px rows that flood with section ink when
  active.
- **Footer:** `border-t-2 border-ink` on `paper-deep`, the wordmark and the standing facts
  left, underlined links right, a `rule-mid` divider above the copyright line.

### Marks

Small reversed-type rectangles at 11px uppercase Kanit with `+0.08em` tracking and 6px/2px
padding. Tones: `ink` (default, e.g. "หมดชั่วคราว"), `section`, `scarlet` (low stock),
`jade`, `chrome`, and `quiet` (`paper-deep` on `ink-mid`) for a neutral count. They sit flush
into the top-left corner of an image well when annotating one.

### Notices and Flashes

- **Notice** (inline, `role="alert"`): a `stock` block with a `rule` border and a 8px
  full-height colour bar on the left edge — scarlet for `warn`, jade for `ok`, ink for
  `info` — plus a printed Thai status word ("ไม่สำเร็จ" / "สำเร็จ" / "แจ้งให้ทราบ") above the
  message. The word carries the meaning; the bar only confirms it.
- **Flash** (transient, `role="status" aria-live="polite"`): a fixed stack at the top of the
  viewport, max 560px wide, gap 1px. Each item is a fully flooded ink block — jade, scarlet
  or soft-black — split into three cells by `white/25` rules: an icon + status word, the
  message, and a dismiss button. Enters with `flash-in` (260ms), auto-dismisses after 5s,
  and holds at most three. This replaced every `window.alert()` in the app.

### Empty and Loading States

- **Empty:** a `border-dashed border-rule-mid` block on `stock` with 64px of vertical
  padding, an optional large line icon in `ink-soft`, an h4 title, a 42ch body in `ink-mid`,
  and one action. It always names the situation and hands over the next move.
- **PageLoading:** three 4px-tall rules — ink, section ink, `rule-mid` — drawing left to
  right on a 90ms stagger under a `u-label` caption. The press starting up.
- **Skeleton:** flat `paper-deep` blocks in the shape of the content that is coming, with a
  screen-reader-only "กำลังโหลด". The rack ships its own inline skeleton grid using the same
  ruled `gap-px` structure as the real rack, so the layout does not jump.

### The Receipt

The system's signature surface. A `narrow` sheet holds an article with left/right `rule`
borders and **dashed tear lines top and bottom**, opened by a fully jade-flooded header with
a check glyph and reversed type. Inside: a two-up ruled `dl` of the order serial (h4
`u-fig`) and the placed-at date; the shipping address; the item list bounded by
`border-y-2 border-ink` with dashed rows; then the totals ladder — subtotal, shipping, and a
grand total set at h2 in `jade-text` above a `border-b-2 border-ink`. Actions carry
`print:hidden` so the printed page is the document of record.

### Named Rules

**The Section-On-Root Rule.** A page that belongs to a section sets
`document.documentElement.dataset.section` in an effect and deletes it on cleanup. The back
office and the profile form pin `cobalt`; order history pins `jade`; the storefront and
product pages hash their category name through `inkFor()` to one of the four. Nothing else
should set section colour, and no component should accept an ink as a prop.

## Do's and Don'ts

### Do:

- **Do** draw structure with rules at four weights — 1px `rule`, 3px, 6px, `border-2
  border-ink` — and let the heaviest one frame the most important block on the page.
- **Do** build grids as `grid gap-px bg-rule` with `bg-stock` children so the gutter is the
  hairline.
- **Do** set every number with `.u-fig`, including phone numbers, counts and order serials.
- **Do** read the live ink through `var(--section-fill)` / `var(--section-text)` /
  `var(--section-on)`; set the section once, on the document root, and clean it up on unmount.
- **Do** print state as a word plus a solid block — "ไม่สำเร็จ", "เหลือ 2 ชิ้น" — so colour
  is never the only carrier of meaning.
- **Do** keep interactive targets at 44px or more (`min-h-[46px]` is the house default) and
  keep the section-ink `:focus-visible` outline visible.
- **Do** cap running prose at 68ch with `u-measure`.
- **Do** use `Sheet` for page width so content registers to the spine.
- **Do** write interface copy in Thai and format numbers, dates and currency with
  `th-TH` locale formatting.

### Don't:

- **Don't** add a border radius to anything. Not a card, not a button, not an avatar, not a
  badge. The zero-radius rule has no exceptions in the shipped build.
- **Don't** add a drop shadow, a lift, an offset block shadow or a glow. Hover pressure is
  an inset bottom bar; that is the entire elevation vocabulary.
- **Don't** tint. No 10%-opacity ink washes behind text, no pastel status chips — a section
  ink either floods a region or draws a bar.
- **Don't** put two section inks on one page. Scarlet-as-danger and jade-as-success are the
  only inks that may appear beside the live one.
- **Don't** hardcode an ink hex in a component (a chart dataset, an inline style) when
  `var(--cobalt)` or `var(--section-fill)` is available — a hardcoded hex will not re-rule
  when the section changes.
- **Don't** let a product's title outweigh its price, or set money in Sarabun.
- **Don't** render a second `<h1>` on a route; on the storefront the masthead nameplate is
  already it, so inner pages must use `Masthead size="strip"`.
- **Don't** introduce a third typeface, a system display face, or an icon font. Kanit,
  Sarabun and Lucide line icons are the whole kit.
- **Don't** drop input font-size below 16px, or remove the 2px baseline that makes a field
  read as a compositor's slug.
- **Don't** call `window.alert()`; push a flash.
