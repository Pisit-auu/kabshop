# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Thai online shoppers buying everyday goods across many categories. They arrive
on mobile as often as desktop, browse by category or search, and expect to
recognise a product, trust the price, and finish checkout without creating
friction. A second, much smaller audience is the shop operator (`role: admin`),
who works the same site to add products, manage categories, watch stock and
sales, and read the order log.

## Product Purpose

KABSHOP is a general-merchandise online store: one storefront that carries many
product categories rather than a single vertical. Success is a shopper who finds
a product, adds it to the cart, completes checkout with a correct address, and
receives an order confirmation with a real order number — and an operator who
can keep the catalogue current without leaving the browser.

## Positioning

A single-operator general store. Categories are created by the shop owner at
will, so the catalogue's shape is not fixed and the interface must stay legible
whether the store carries four categories or forty. The storefront and the
back office are the same application, sharing one account system and one
visual world.

## Operating Context

- Anonymous visitors browse the catalogue and product pages but must sign in to
  add to cart or buy.
- Signed-in members browse, manage a cart, maintain a shipping profile
  (name, phone, Line ID, address), check out, and read their order history.
- Checkout requires a complete profile (name, phone, address) before it will
  proceed.
- Payment is selected at checkout: QR PromptPay or cash on delivery. No payment
  gateway is integrated; the selection is recorded intent, not a charge.
- Shipping is a flat ฿36 per order.
- Product images are uploaded to Cloudinary from the admin forms.
- Admins reach the back office from the same account, gated on `role === "admin"`.

## Capabilities and Constraints

- Stack: Next.js 14 App Router, React 18, TypeScript (partially — some files are
  still `.jsx`/`.js`), Tailwind CSS 3, Prisma 5 on PostgreSQL, NextAuth
  (credentials provider, JWT sessions), Cloudinary, Chart.js.
- Data model: `User`, `Post` (product), `Category`, `Cart`, `Order`, `OrderItem`.
- Orders have no lifecycle status field; every order reads as completed.
- `Post.Sales` accumulates baht of revenue per product, not units sold.
- `orderId` is a random six-digit string generated on the client.
- Currency is Thai baht. Interface language is Thai, with English used for
  back-office labels today; consistency is an open decision.
- Real production target: real shoppers, real money, real stock.

## Brand Commitments

"KABSHOP" is the product's name; `public/KAB.png` is the logo in use.

**Standing design preference: the category standard, executed at full craft.**
The user considered a distinctive own-world direction and chose the
conventional modern e-commerce form instead. This is a durable preference, not
a one-off: future surfaces follow mainstream commerce convention rather than
inventing a metaphor.

The craft bar is set by three named references the store should be able to sit
beside without embarrassment:

- **Apple Store / Uniqlo / Zara** — restraint and finish: large honest product
  imagery, generous whitespace, near-black primary actions, very little
  decorative colour.
- **Shopify storefronts (Allbirds, Glossier)** — the layout grammar: a clean
  responsive product grid, soft-cornered cards, quiet elevation, conventional
  cart and checkout patterns.
- **Shopee / Lazada** — the commercial clarity Thai shoppers expect: price and
  stock unmistakable at a glance, category filtering always reachable, nothing
  hidden behind a hover.

Where these conflict, resolve in that order for looks and in Shopee's favour
for information: restraint governs the surface, but a Thai shopper must never
have to hunt for a price, a stock count, or the total.

## Evidence on Hand

- Catalogue content is live store data (products, prices, stock, categories) —
  not authored for this project and never to be fabricated.
- `public/KAB.png` is the incumbent logo; `public/` also holds the icon PNGs the
  old navbar used (`cart.png`, `user.png`, `logout.png`, `menu.png`).
- No testimonials, press, customer names, benchmarks, ratings, delivery-time
  promises, return policy, or guarantee copy exist. None may be invented.

## Product Principles

1. **The catalogue is the product.** Whatever the store carries this month, the
   interface must present it well — including a store with few products, one
   category, or none.
2. **Trust is earned at the money moments.** Price, stock, shipping cost, total,
   and order number must be unambiguous and never move under the shopper.
3. **One account, one world.** Shopper and operator share a visual system; the
   back office is the same product, not a bolted-on admin theme.
4. **Thai-first.** Thai is the interface language; typography, number, date, and
   currency formatting are chosen for Thai readers.
5. **Claim nothing the store cannot honour.** No invented delivery windows,
   guarantees, ratings, or social proof.

## Accessibility & Inclusion

No formal standard was set. Because this ships to real buyers on mobile,
treat as required: visible keyboard focus, real form labels, touch targets of at
least 44px, text contrast meeting WCAG AA, and states that are announced rather
than only coloured.
