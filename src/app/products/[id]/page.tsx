import { redirect } from "next/navigation";

/** Old catalogue links land on the single product page. */
export default function LegacyProduct({ params }: { params: { id: string } }) {
  redirect(`/product/${params.id}`);
}
