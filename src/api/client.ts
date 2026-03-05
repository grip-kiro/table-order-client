import { Menu, Order, CategoryWithMenus, TableCredential, TableSession, TokenPair } from "../types";
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
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "인증에 실패했습니다");
  }
  return res.json();
}

// ── 메뉴 (카테고리별 그룹) ──

export async function fetchMenusGrouped(
  session: TableSession
): Promise<CategoryWithMenus[]> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 300));
    // mock: 카테고리별로 그룹핑
    const catMap = new Map<string, Menu[]>();
    for (const menu of MOCK_MENUS) {
      for (const cat of menu.categories) {
        if (!catMap.has(cat.name)) catMap.set(cat.name, []);
        catMap.get(cat.name)!.push(menu);
      }
    }
    const result: CategoryWithMenus[] = MOCK_CATEGORIES.map((c) => ({
      ...c,
      menus: (catMap.get(c.name) || []).sort((a, b) => a.displayOrder - b.displayOrder),
    }));
    return result;
  }

  const res = await authFetch(
    `${API_BASE}/api/stores/${session.storeId}/menus`,
    {},
    session
  );
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
      totalAmount: items.reduce((s, i) => s + i.subtotal, 0),
      status: "PENDING",
      items,
      createdAt: new Date().toISOString(),
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

export async function fetchOrders(session: TableSession): Promise<Order[]> {
  if (!API_BASE) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ORDERS;
  }

  const res = await authFetch(
    `${API_BASE}/api/tables/${session.tableId}/orders`,
    {},
    session
  );
  if (!res.ok) throw new Error("주문 내역을 불러올 수 없습니다");
  return res.json();
}
