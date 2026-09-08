import { redirect } from "next/navigation";

/** The signed-in storefront and the public one are the same sheet now. */
export default function Home() {
  redirect("/");
}
