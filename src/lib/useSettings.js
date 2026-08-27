import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const list = await base44.entities.SiteSettings.filter({ singleton_key: "main" });
      return list[0] || null;
    },
    staleTime: 5 * 60 * 1000,
  });
  return { settings: data, isLoading };
}

export function useProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.filter({ status: "active" }, "sort_order"),
    staleTime: 2 * 60 * 1000,
  });
  return { products: data || [], isLoading };
}