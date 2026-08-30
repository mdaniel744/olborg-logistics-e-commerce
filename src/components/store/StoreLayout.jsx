"use client";

import React from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import CookieConsent from "@/components/store/CookieConsent";

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
    </div>
  );
}
