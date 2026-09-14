import { SITE_SETTINGS } from "@/data/catalog";
import { getProducts } from "@/lib/supabaseCatalog";
import { renderMerchantFeed } from "@/lib/merchantFeed";
import { siteOrigin } from "@/lib/siteUrl";
import { computeVatTreatment } from "@/server/pricing";
import { returnTransportCharge } from "@/lib/checkoutReadiness";

export async function GET(request) {
  const market = (new URL(request.url).searchParams.get("market") || "pl").toUpperCase();
  if (!["PL", "DE"].includes(market)) return Response.json({ error: "unsupported_market" }, { status: 400 });
  if (!siteOrigin) return Response.json({ error: "verified_site_url_required" }, { status: 503 });
  if (!returnTransportCharge(SITE_SETTINGS, market, market.toLowerCase())) {
    return Response.json({ error: "consumer_checkout_not_ready" }, { status: 503 });
  }
  const treatment = computeVatTreatment(SITE_SETTINGS, {
    market, customerType: "private", vatValid: false, deliveryCountry: market,
  });
  return new Response(renderMerchantFeed(await getProducts(), {
    lang: market.toLowerCase(), origin: siteOrigin, vatRate: treatment.rate,
  }), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
