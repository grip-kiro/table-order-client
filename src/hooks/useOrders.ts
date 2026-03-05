import { useState, useCallback } from "react";
import { Order, CartItem, OrderStatus } from "../types";
import { MOCK_ORDERS, MOCK_SESSION } from "../data/mock";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const placeOrder = useCallback(
    (cart: CartItem[], total: number): Order => {
      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
        sessionId: MOCK_SESSION.sessionId,
        items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
        status: "대기중" as OrderStatus,
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    [orders.length]
  );

  const sessionOrders = orders.filter((o) => o.sessionId === MOCK_SESSION.sessionId);

  return { orders, sessionOrders, placeOrder };
}
