import { useEffect, useState } from "react";
import { SITE_SETTINGS } from "@/data/catalog";
import { getProducts, groupFamilies } from "@/lib/supabaseCatalog";

export function useSettings() {
  return { settings: SITE_SETTINGS, isLoading: false };
}

// Family-grouped cards for listing pages (Shop, Home, ProductCard).
export function useProducts() {
  const [state, setState] = useState({ products: [], isLoading: true });

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((rows) => {
        if (!cancelled) setState({ products: groupFamilies(rows), isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        if (!cancelled) setState({ products: [], isLoading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

// Flat rows — each is its own real, independently-routable product page.
export function useProductRows() {
  const [state, setState] = useState({ products: [], isLoading: true });

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((products) => {
        if (!cancelled) setState({ products, isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        if (!cancelled) setState({ products: [], isLoading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
