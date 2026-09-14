import { round2 } from "./format.js";

export function calculateOrderTotals({ itemsNet, deliveryCharge, vatRate }) {
  if (![itemsNet, deliveryCharge, vatRate].every(Number.isFinite)) return null;
  if (itemsNet < 0 || deliveryCharge < 0 || vatRate < 0) return null;

  const deliveryNet = round2(deliveryCharge / (1 + vatRate / 100));
  const itemsVat = round2(itemsNet * (vatRate / 100));
  const itemsGross = round2(itemsNet + itemsVat);
  const deliveryVat = round2(deliveryCharge - deliveryNet);
  const vatAmount = round2(itemsVat + deliveryVat);

  return {
    items_net: round2(itemsNet),
    items_gross: itemsGross,
    delivery_net: deliveryNet,
    delivery_charge: round2(deliveryCharge),
    net_subtotal: round2(itemsNet + deliveryNet),
    vat_rate: vatRate,
    vat_amount: vatAmount,
    gross_total: round2(itemsGross + deliveryCharge),
  };
}
