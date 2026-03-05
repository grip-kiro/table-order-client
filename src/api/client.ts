import { Menu, Order, OrderStatus, TableCredential, TableSession, CursorPage, CartItem } from "../types";
import { MOCK_MENUS, MOCK_ORDERS } from "../data/mock";

const API_BASE = process.env.REACT_APP_API_BASE || "";

// ── 인증 ──

export async function loginTable(credential: TableCredential): Promise<TableSession> {
  if (!API_BASE) {
    // mock: 아무 값이든 통과
    return {
      storeId: credential.storeId,
      tableNo: credential.tableNo,
      sessionId: `sess-${Date.now()}`,
      token: `mock-token-${Date.now()}`,
    };
  }

  const res = await fetch(`${API_BASE}/api/tables/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });
  if (!res.ok) throw new Error("로그인에 실패했습니다");
  return res.json();
}

// ── 메뉴 ──

const PAGE_SIZE = 4;

export async function fetchMenus(
  storeId: string,
  category: string,
  cursor: number | null
): Promise<CursorPage<Menu>> {
  if (!API_BASE) {
    // mock
    await new Promise((r) => setTimeout(r, 300));
    const all = category === "전체" ? MOCK_MENUS : MOCK_MENUS.filter((m) => m.category === category);
    const startIdx = cursor !== null ? all.findIndex((m) => m.id === cursor) + 1 : 0;
    const items = all.slice(startIdx, startIdx + PAGE_SIZE);
    const nextCursor = startIdx + PAGE_SIZE < all.length ? String(items[items.length - 1]?.id ?? "") : null;
    return { items, nextCursor };
  }

  const params = new URLSearchParams({ size: String(PAGE_SIZE) });
  if (category !== "전체") params.set("category", category);
  if (cursor !== null) params.set("cursor", String(cursor));

  const res = await fetch(`${API_BASE}/api/stores/${storeId}/menus?${params}`);
  if (!res.ok) throw new Error("메뉴를 불러올 수 없습니다");
  return res.json();
}

// ── 카테고리 ──

export async function fetchCategories(storeId: string): Promise<string[]> {
  if (!API_BASE) {
    return ["전체", "메인", "사이드", "음료", "디저트"];
  }

  const res = await fetch(`${API_BASE}/api/stores/${storeId}/categories`);
  if (!res.ok) throw new Error("카테고리를 불러올 수 없습니다");
  const categories: string[] = await res.json();
  return ["전체", ...categories];
}

// ── 주문 ──

export interface CreateOrderRequest {
  storeId: string;
  tableNo: number;
  sessionId: string;
  items: { menuId: number; name: string; qty: number; price: number }[];
  total: number;
}

let mockOrderCounter = MOCK_ORDERS.length;

export async function createOrder(
  token: string,
  req: CreateOrderRequest
): Promise<Order> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 200));
    mockOrderCounter++;
    const order: Order = {
      id: `ORD-${String(mockOrderCounter).padStart(3, "0")}`,
      createdAt: new Date(),
      sessionId: req.sessionId,
      storeId: req.storeId,
      tableNo: req.tableNo,
      items: req.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: req.total,
      status: "대기중",
    };
    MOCK_ORDERS.unshift(order);
    return order;
  }

  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("주문에 실패했습니다");
  return res.json();
}

export async function fetchOrders(
  token: string,
  sessionId: string,
  cursor: string | null
): Promise<CursorPage<Order>> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 200));
    const sessionOrders = MOCK_ORDERS.filter((o) => o.sessionId === sessionId);
    const startIdx = cursor ? sessionOrders.findIndex((o) => o.id === cursor) + 1 : 0;
    const items = sessionOrders.slice(startIdx, startIdx + 10);
    const nextCursor = startIdx + 10 < sessionOrders.length ? items[items.length - 1]?.id ?? null : null;
    return { items, nextCursor };
  }

  const params = new URLSearchParams({ sessionId, size: "10" });
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(`${API_BASE}/api/orders?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("주문 내역을 불러올 수 없습니다");
  return res.json();
}
