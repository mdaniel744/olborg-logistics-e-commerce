// Use the same pure validation and calculation for previews and order submissions.
export {
  findZone as findZoneClient,
  calculateDelivery as calcDeliveryClient,
  flatRateDelivery,
  normalizePostalCode,
} from "../server/delivery.js";
