"use client";

import ScrollToTop from "@/components/ScrollToTop";
import { CartProvider } from "@/lib/CartContext";
import { LanguageProvider } from "@/lib/i18n";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <CartProvider>
        <ScrollToTop />
        {children}
      </CartProvider>
    </LanguageProvider>
  );
}
