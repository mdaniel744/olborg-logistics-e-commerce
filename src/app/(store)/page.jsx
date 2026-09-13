import Home from "@/features/storefront/Home";
import { publicPageMetadata } from "@/lib/pageMetadata";

export const metadata = publicPageMetadata("/", "pl");

export default function HomePage() {
  return <Home />;
}
