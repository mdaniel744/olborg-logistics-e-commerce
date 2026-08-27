import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

// Admin-only: fetches the latest EUR/PLN mid reference rate from NBP (table A)
// and stores it as the reference rate. Does NOT change the published rate —
// the admin commits that explicitly from Settings → Currency.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const res = await fetch(
      "https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json",
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) {
      return Response.json(
        { error: `NBP API returned ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    const rate = data?.rates?.[0]?.mid;
    const effectiveDate = data?.rates?.[0]?.effectiveDate;
    if (typeof rate !== "number") {
      return Response.json({ error: "Unexpected NBP response" }, { status: 502 });
    }

    const settingsList = await base44.entities.SiteSettings.filter({
      singleton_key: "main",
    });
    const now = new Date().toISOString();
    if (settingsList.length > 0) {
      const current = settingsList[0];
      await base44.entities.SiteSettings.update(current.id, {
        fx: {
          ...(current.fx || {}),
          provider: "NBP",
          reference_rate: rate,
          reference_fetched_at: now,
        },
      });
    }

    return Response.json({
      provider: "NBP",
      reference_rate: rate,
      effective_date: effectiveDate,
      fetched_at: now,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}