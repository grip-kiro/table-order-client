import { Menu, Order, Category, TableCredential, TableSession, CursorPage, TokenPair } from "../types";
import { MOCK_MENUS, MOCK_ORDERS, MOCK_CATEGORIES } from "../data/mock";

const API_BASE = process.env.REACT_APP_API_BASE || "";

// ── 토큰 갱신 ──

let refreshPromise: Promise<TokenPair> | null = null;

export async function refreshToken(token: string): Promise<TokenPair> {
  if (!API_BASE) {
    return { accessToken: `mock-access-${Date.now()}`, refreshToken: `mock-refresh-${Date.now()}`, expiresIn: 3600 };
  }
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (!res.ok) throw new Error("토큰 갱신 실패");
  return res.json();
}

async function authFetch(url: string, options: RequestInit, session: TableSession): Promise<Response> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    Authorization: `Bearer ${session.accessToken}`,
  };
  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && API_BASE) {
    // 토큰 갱신 시도 (중복 방지)
    if (!refreshPromise) {
      refreshPromise = refreshToken(session.refreshToken).finally(() => { refreshPromise = null; });
    }
    const newTokens = await refreshPromise;
    session.accessToken = newTokens.accessToken;
    session.refreshToken = newTokens.refreshToken;
    sessionStorage.setItem("table-order-session", JSON.stringify(session));
    headers.Authorization = `Bearer ${newTokens.accessToken}`;
    return fetch(url, { ...options, headers });
  }
  return res;
}

// ── 인증 ──

export async function loginTable(credential: TableCredential): Promise<TableSession> {
  if (!API_BASE) {
    return {
      storeId: credential.storeId,
      tableId: credential.tableNumber,
      tableNumber: credential.tableNumber,
      sessionId: `sess-${Date.now()}`,
      accessToken: `mock-access-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
      expiresIn: 3600,
    };
  }

  const res = await fetch(`${API_BASE}/api/auth/table/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });
  if (!res.ok) throw new Error("인증에 실패했습니다");
  return res.json();
}

// ── 카테고리 ──

export async function fetchCategories(storeId: number): Promise<Category[]> {
  if (!API_BASE) {
    return MOCK_CATEGORIES;
  }
  const res = await fetch(`${API_BASE}/api/stores/${storeId}/menus`);
  if (!res.ok) throw new Error("카테고리를 불러올 수 없습니다");
  return res.json();
}

// ── 메뉴 ──

const PAGE_SIZE = 4;

export async function fetchMenus(
  storeId: number,
  category: string,
  cursor: number | null
): Promise<CursorPage<Menu>> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 300));
    const all = category === "전체"
      ? MOCK_MENUS
      : MOCK_MENUS.filter((m) => m.categories.some((c) => c.name === category));
    const sorted = [...all].sort((a, b) => a.displayOrder - b.displayOrder);
    const startIdx = cursor !== null ? sorted.findIndex((m) => m.id === cursor) + 1 : 0;
    const items = sorted.slice(startIdx, startIdx + PAGE_SIZE);
    const nextCursor = startIdx + PAGE_SIZE < sorted.length ? String(items[items.length - 1]?.id ?? "") : null;
    return { items, nextCursor };
  }

  const params = new URLSearchParams({ size: String(PAGE_SIZE) });
  if (category !== "전체") params.set("category", category);
  if (cursor !== null) params.set("cursor", String(cursor));

  const res = await fetch(`${API_BASE}/api/stores/${storeId}/menus?${params}`);
  if (!res.ok) throw new Error("메뉴를 불러올 수 없습니다");
  return res.json();
}

// ── 주문 ──

export interface CreateOrderRequest {
  items: { menuId: number; quantity: number }[];
}

let mockOrderCounter = 0;

export async function createOrder(
  session: TableSession,
  req: CreateOrderRequest
): Promise<Order> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 200));
    mockOrderCounter++;
    // mock: 클라이언트에서 메뉴 정보 조회하여 주문 구성
    const items = req.items.map((item, idx) => {
      const menu = MOCK_MENUS.find((m) => m.id === item.menuId);
      if (menu?.isSoldOut) throw new Error("품절된 메뉴가 포함되어 있습니다");
      return {
        id: idx + 1,
        menuId: item.menuId,
        menuName: menu?.name || "",
        quantity: item.quantity,
        unitPrice: menu?.price || 0,
        subtotal: (menu?.price || 0) * item.quantity,
      };
    });
    const order: Order = {
      id: mockOrderCounter,
      storeId: session.storeId,
      tableId: session.tableId,
      sessionId: session.sessionId,
      totalAmount: items.reduce((s, i) => s + i.subtotal, 0),
      status: "PENDING",
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_ORDERS.unshift(order);
    return order;
  }

  const res = await authFetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  }, session);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    if (err?.code === "MENU_SOLD_OUT") throw new Error("품절된 메뉴가 포함되어 있습니다");
    throw new Error(err?.message || "주문에 실패했습니다");
  }
  return res.json();
}

export async function fetchOrders(
  session: TableSession,
  cursor: string | null
): Promise<CursorPage<Order>> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 200));
    const sessionOrders = MOCK_ORDERS.filter((o) => o.sessionId === session.sessionId);
    const startIdx = cursor ? sessionOrders.findIndex((o) => String(o.id) === cursor) + 1 : 0;
    const items = sessionOrders.slice(startIdx, startIdx + 10);
    const nextCursor = startIdx + 10 < sessionOrders.length ? String(items[items.length - 1]?.id ?? "") : null;
    return { items, nextCursor };
  }

  const params = new URLSearchParams({ size: "10" });
  if (cursor) params.set("cursor", cursor);

  const res = await authFetch(
    `${API_BASE}/api/tables/${session.tableId}/orders?${params}`,
    {},
    session
  );
  if (!res.ok) throw new Error("주문 내역을 불러올 수 없습니다");
  return res.json();
}
