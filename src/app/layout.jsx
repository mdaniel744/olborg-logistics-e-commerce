import "./globals.css";
import { Poppins } from "next/font/google";
import Providers from "./providers";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Olborg Logistics — kontenery morskie",
    template: "%s | Olborg Logistics",
  },
  description:
    "Nowe i używane kontenery morskie z dostawą w Polsce i Niemczech.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pl-PL"
      className={poppins.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
