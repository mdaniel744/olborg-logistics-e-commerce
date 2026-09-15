const STORAGE_KEY = "olborg_last_order";
let lastOrder = null;

function isOrder(value) {
  return value !== null && typeof value === "object" &&
    typeof value.id === "string" && value.id.trim().length > 0 &&
    typeof value.order_number === "string" && value.order_number.trim().length > 0;
}

function browserStorage() {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

// Storage is optional: a browser privacy setting must not turn a saved order into a checkout error.
export function rememberOrder(order, storage) {
  if (!isOrder(order)) return false;
  lastOrder = order;
  try {
    (storage === undefined ? browserStorage() : storage)?.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Keep the confirmation available during client navigation even if persistence is denied.
  }
  return true;
}

export function readLastOrder(storage) {
  if (isOrder(lastOrder)) return lastOrder;
  try {
    const saved = JSON.parse((storage === undefined ? browserStorage() : storage)?.getItem(STORAGE_KEY) ?? "null");
    if (isOrder(saved)) {
      lastOrder = saved;
      return saved;
    }
  } catch {
    // A missing, blocked, or damaged session must leave the confirmation in its empty state.
  }
  return null;
}
