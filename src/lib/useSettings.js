import { PRODUCTS, SITE_SETTINGS } from "@/data/catalog";

export function useSettings() {
  return { settings: SITE_SETTINGS, isLoading: false };
}

export function useProducts() {
  return { products: PRODUCTS, isLoading: false };
}
