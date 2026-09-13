import "./globals.css";
import { Poppins } from "next/font/google";
import Providers from "./providers";
import { siteOrigin } from "@/lib/siteUrl";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL(siteOrigin || "http://localhost:3001"),
  robots: !siteOrigin || process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_DEMO_PRODUCTS === "true"
    ? { index: false, follow: false } : { index: true, follow: true },
  title: {
    default: "Olborg Logistics — kontenery morskie",
    template: "%s | Olborg Logistics",
  },
  description:
    "Nowe i używane kontenery morskie z dostawą w Polsce i Niemczech.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pl-PL"
      className={`${poppins.variable} notranslate`}
      translate="no"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="notranslate" translate="no">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
