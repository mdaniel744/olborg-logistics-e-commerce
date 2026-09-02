const INQUIRIES_URL = "https://wizrktgdocaemfkzlkxp.supabase.co/rest/v1/inquiries";

// inquiries has an open public INSERT policy for the anon key — no custom endpoint needed,
// unlike checkout. Insert-only: never chain a read after this (the policy has no SELECT
// grant), and the anon key is safe to use client-visible-style here since store_id scoping
// plus the insert-only policy are what actually gate this, not secrecy of the key itself.
export async function submitInquiry(storeId, anonKey, record) {
  const response = await fetch(INQUIRIES_URL, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ store_id: storeId, ...record }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Inquiry submission failed: HTTP ${response.status} ${detail}`.trim());
  }
}
