"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageNotFound() {
  const pathname = usePathname();
  const german = pathname === "/de" || pathname.startsWith("/de/");

  return (
    <div className="min-h-[55vh] flex items-center justify-center bg-[#F8F9FA] p-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-[#A9700A]">404</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1A1C1E]">
          {german ? "Seite nicht gefunden" : "Strona nie istnieje"}
        </h1>
        <p className="mt-3 text-[#6B7075]">
          {german
            ? "Die angeforderte Seite ist nicht verfügbar."
            : "Żądana strona nie jest dostępna."}
        </p>
        <Link
          href={german ? "/de" : "/"}
          className="mt-7 inline-flex h-11 items-center bg-[#1A1C1E] px-6 font-semibold text-white hover:bg-black"
        >
          {german ? "Zur Startseite" : "Wróć na stronę główną"}
        </Link>
      </div>
    </div>
  );
}
