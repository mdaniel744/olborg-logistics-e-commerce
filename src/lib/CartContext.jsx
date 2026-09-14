"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { applyCartPriceUpdates, cartItemKey, normalizeStoredCart } from "./cartItems";

const CartContext = createContext(null);
const STORAGE_KEY = "olborg_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      setItems(normalizeStoredCart(stored));
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const key = cartItemKey(item);
      if (!key) return prev;
      const addedQuantity = Number.isInteger(item.quantity) ? Math.min(100, Math.max(1, item.quantity)) : 1;
      const existing = prev.find((i) => cartItemKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key ? { ...i, quantity: Math.min(100, i.quantity + addedQuantity) } : i
        );
      }
      return [...prev, { ...item, quantity: addedQuantity }];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => cartItemKey(i) !== key)
        : prev.map((i) => (cartItemKey(i) === key ? { ...i, quantity: Math.min(100, quantity) } : i))
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const applyPriceUpdates = useCallback((updates, market) => {
    setItems((prev) => applyCartPriceUpdates(prev, updates, market));
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, hydrated, addItem, updateQuantity, removeItem, clearCart, applyPriceUpdates, count, drawerOpen, setDrawerOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
