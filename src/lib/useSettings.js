import { useEffect, useState } from "react";
import { SITE_SETTINGS } from "@/data/catalog";
import { getProducts, groupFamilies } from "@/lib/supabaseCatalog";

const CATALOG_CACHE_TTL = 60_000;
let cachedProductRows = null;
let cachedProductRowsAt = 0;
let productRowsRequest = null;

function seedProductRows(rows) {
  cachedProductRows = rows;
  cachedProductRowsAt = Date.now();
  return rows;
}

function loadProductRows({ refresh = false } = {}) {
  const cacheIsFresh = cachedProductRows && Date.now() - cachedProductRowsAt < CATALOG_CACHE_TTL;
  if (!refresh && cacheIsFresh) return Promise.resolve(cachedProductRows);
  if (productRowsRequest) return productRowsRequest;

  productRowsRequest = getProducts()
    .then(seedProductRows)
    .finally(() => {
      productRowsRequest = null;
    });

  return productRowsRequest;
}

export function useSettings() {
  return { settings: SITE_SETTINGS, isLoading: false };
}

// Family-grouped cards for listing pages (Shop, Home, ProductCard).
export function useProducts() {
  const [state, setState] = useState(() => ({
    products: cachedProductRows ? groupFamilies(cachedProductRows) : [],
    isLoading: !cachedProductRows,
  }));

  useEffect(() => {
    let cancelled = false;
    const cacheIsStale = cachedProductRows && Date.now() - cachedProductRowsAt >= CATALOG_CACHE_TTL;
    loadProductRows({ refresh: Boolean(cacheIsStale) })
      .then((rows) => {
        if (!cancelled) setState({ products: groupFamilies(rows), isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        if (!cancelled && !cachedProductRows) setState({ products: [], isLoading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

// Flat rows — each is its own real, independently-routable product page.
export function useProductRows(initialProducts = null) {
  const [state, setState] = useState(() => {
    const products = initialProducts?.length ? initialProducts : cachedProductRows;
    return { products: products || [], isLoading: !products };
  });

  useEffect(() => {
    if (initialProducts?.length) {
      seedProductRows(initialProducts);
      setState((current) =>
        current.products === initialProducts
          ? current
          : { products: initialProducts, isLoading: false }
      );
      return undefined;
    }

    let cancelled = false;
    const cacheIsStale = cachedProductRows && Date.now() - cachedProductRowsAt >= CATALOG_CACHE_TTL;
    loadProductRows({ refresh: Boolean(cacheIsStale) })
      .then((products) => {
        if (!cancelled) setState({ products, isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to load products", error);
        if (!cancelled && !cachedProductRows) setState({ products: [], isLoading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [initialProducts]);

  return state;
}
