import { useState, useCallback } from "react";
import { Order, CartItem, TableSession } from "../types";
import { createOrder, fetchOrders } from "../api/client";

export function useOrders(session: TableSession) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const page = await fetchOrders(session, cursor);
      setOrders((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
    } catch {
      // 조회 실패 무시
    } finally {
      setLoading(false);
    }
  }, [session, cursor, loading, hasMore]);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const page = await fetchOrders(session, null);
      setOrders(page.items);
      setCursor(page.nextCursor);
      setHasMore(page.nextCursor !== null);
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

  return { orders, loading, hasMore, loadOrders, refreshOrders, placeOrder };
}
