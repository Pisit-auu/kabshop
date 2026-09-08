import type { Metadata, Viewport } from "next";
import { Anuphan, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { FlashProvider } from "./components/flash";
import { MeProvider } from "./components/me";

const display = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const text = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "KABSHOP", template: "%s · KABSHOP" },
  description: "ร้านค้าออนไลน์รวมสินค้าหลายหมวด ส่งทั่วไทย ค่าส่งคงที่ 36 บาท",
  applicationName: "KABSHOP",
  icons: { icon: "/KAB.png" },
  openGraph: {
    title: "KABSHOP",
    description: "ร้านค้าออนไลน์รวมสินค้าหลายหมวด ส่งทั่วไทย ค่าส่งคงที่ 36 บาท",
    siteName: "KABSHOP",
    locale: "th_TH",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const DIRECTION_CONTRACT = `<!--
  direction: the category standard, executed at full craft (user's standing choice)
  THESIS: KABSHOP is a modern retail storefront, played straight. No metaphor and no
  invented world — the value is in finish: honest product imagery, a calm grid, and
  money a shopper can read without effort.
  OWN-WORLD: warm-neutral canvas, white product surfaces, hairline borders, soft
  elevation on lift only. Near-black primary actions in the Uniqlo/Zara register.
  Colour is reserved: red for price urgency and destructive acts, green for fulfilment.
  Anuphan display, Noto Sans Thai text, tabular figures for every number.
  STORY: the shopper scans a category, trusts the price, and completes checkout with a
  visible running total and an order number they can quote back.
  FIRST VIEWPORT: sticky header with prominent search and cart count; a category rail;
  then the product grid — square imagery, two-line title, price in the heaviest weight
  on the card, stock state stated rather than implied.
  BAR: Apple / Uniqlo / Zara for restraint and finish, Shopify storefronts for layout
  grammar, Shopee / Lazada for commercial clarity. Recorded in PRODUCT.md.
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${text.variable}`}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <SessionProvider>
          <FlashProvider>
            <MeProvider>{children}</MeProvider>
          </FlashProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
