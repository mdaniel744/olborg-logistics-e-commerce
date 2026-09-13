// A verified deployment domain must be configured; never infer it from a request Host header.
export function publicSiteOrigin(value = process.env.NEXT_PUBLIC_SITE_URL) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
        /^(localhost|127\.|0\.|\[::1\])/.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteOrigin = publicSiteOrigin();
