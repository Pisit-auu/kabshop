import { Suspense } from "react";
import Masthead from "./components/masthead";
import Rack from "./components/rack";
import SiteFoot from "./components/sitefoot";
import { Shell, PageLoading } from "./components/press";

export default function Storefront() {
  return (
    <div className="flex min-h-screen flex-col">
      <Masthead />
      <main className="flex-1">
        <Shell className="pb-20 pt-6">
          <h1 className="sr-only">KABSHOP — ร้านค้าออนไลน์รวมสินค้าหลายหมวด</h1>
          <Suspense fallback={<PageLoading label="กำลังโหลดสินค้า" />}>
            <Rack />
          </Suspense>
        </Shell>
      </main>
      <SiteFoot />
    </div>
  );
}
