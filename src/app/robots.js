import { siteOrigin } from "@/lib/siteUrl";

export default function robots() {
  if (!siteOrigin || process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_DEMO_PRODUCTS === "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/uploads/"] },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
