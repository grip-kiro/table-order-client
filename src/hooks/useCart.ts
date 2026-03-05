import { useState, useEffect, useCallback } from "react";
import { CartItem, Menu } from "../types";

const STORAGE_KEY = "table-order-cart";

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const add = useCallback((menu: Menu, qty: number = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === menu.id);
      if (exists) return prev.map((i) => (i.id === menu.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...menu, qty }];
    });
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return { cart, add, updateQty, clear, total, count };
}
