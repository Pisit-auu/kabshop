import type { Metadata, Viewport } from "next";
import { Kanit, Sarabun } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { FlashProvider } from "./components/flash";
import { MeProvider } from "./components/me";

const display = Kanit({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const text = Sarabun({
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
  themeColor: "#191813",
  width: "device-width",
  initialScale: 1,
};

const DIRECTION_CONTRACT = `<!--
  seed 26e10119 · direction: The Classified
  THESIS: a general store that carries everything is a classified section, not a grid
  of rounded cards floating on grey. Rules are the material; the price is the headline.
  It refuses the marketplace card-and-chip arrangement outright.
  OWN-WORLD: newsprint ground with white cell stock, soft-black ink, hairline column
  rules, and four flat section inks (scarlet, cobalt, jade, chrome) that flood whole
  regions. Kanit display and figures, Sarabun text. Zero radius, zero shadow.
  STORY: the shopper reads the day's sheet, finds a section, reads a price they trust,
  and leaves with a numbered receipt.
  FIRST VIEWPORT: black masthead bar, KABSHOP set large; a section-ink flash rule; the
  category index as a ruled table of contents with counts; the search slug; then the
  rack of ruled classified cells, price largest inside each.
  FORM: candidate 6 of the grounded list - the Thai daily's classified and news-stand.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
  review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
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
