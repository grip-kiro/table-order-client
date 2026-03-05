import { useState, useCallback } from "react";
import { Order, CartItem, TableSession } from "../types";
import { createOrder, fetchOrders } from "../api/client";

export function useOrders(session: TableSession) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const page = await fetchOrders(session.token, session.sessionId, cursor);
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
      const page = await fetchOrders(session.token, session.sessionId, null);
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
      setOrderError(null);
      const order = await createOrder(session.token, {
        storeId: session.storeId,
        tableNo: session.tableNo,
        sessionId: session.sessionId,
        items: cart.map((i) => ({ menuId: i.id, name: i.name, qty: i.qty, price: i.price })),
        total,
      });
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [session]
  );

  return { orders, loading, hasMore, orderError, loadOrders, refreshOrders, placeOrder };
}
