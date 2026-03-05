import { useState, useCallback } from "react";
import { Order, CartItem, TableSession } from "../types";
import { createOrder, fetchOrders } from "../api/client";

export function useOrders(session: TableSession) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchOrders(session);
      setOrders(list);
    } catch {
      // 조회 실패 무시
    } finally {
      setLoading(false);
    }
  }, [session]);

  const placeOrder = useCallback(
    async (cart: CartItem[], total: number): Promise<Order> => {
      const order = await createOrder(session, {
        items: cart.map((i) => ({ menuId: i.menuId, quantity: i.qty })),
      });
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [session]
  );

  return { orders, loading, refreshOrders, placeOrder };
}
