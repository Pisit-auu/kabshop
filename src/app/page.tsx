import Masthead from "./components/masthead";
import Rack from "./components/rack";
import { Sheet } from "./components/press";
import SiteFoot from "./components/sitefoot";

export default function Storefront() {
  return (
    <div className="min-h-screen">
      <Masthead size="full" />
      <main>
        <Sheet className="pb-20 pt-8">
          <Rack />
        </Sheet>
      </main>
      <SiteFoot />
    </div>
  );
}
