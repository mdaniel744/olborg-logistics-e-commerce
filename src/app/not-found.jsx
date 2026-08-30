import Link from "next/link";

export const metadata = { title: "Strona nie istnieje" };

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-[#F8F9FA] px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-[#A9700A]">404</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-[#1A1C1E]">
          Strona nie istnieje
        </h1>
        <p className="mt-3 text-[#6B7075]">
          Nie znaleźliśmy tego adresu. Wróć do strony głównej i wybierz właściwy dział.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center bg-[#1A1C1E] px-6 font-semibold text-white hover:bg-black"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </main>
  );
}
