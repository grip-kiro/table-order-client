import { Order, CategoryWithMenus, TableCredential, TableSession, TokenPair } from "../types";

const API_BASE = process.env.REACT_APP_API_BASE || "";

// ── 세션 만료 콜백 (App에서 등록) ──

let onSessionExpired: (() => void) | null = null;
let sessionExpiredFired = false;

export function setSessionExpiredHandler(handler: () => void) {
  onSessionExpired = handler;
  sessionExpiredFired = false;
}

function fireSessionExpired() {
  if (sessionExpiredFired) return;
  sessionExpiredFired = true;
  sessionStorage.removeItem("table-order-session");
  localStorage.removeItem("table-order-credential");
  localStorage.removeItem("table-order-cart");
  if (onSessionExpired) onSessionExpired();
}

// ── 토큰 갱신 ──

let refreshPromise: Promise<TokenPair> | null = null;

async function doRefresh(token: string): Promise<TokenPair> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: token }),
  });
  if (!res.ok) throw new Error("토큰 갱신 실패");
  return res.json();
}

async function authFetch(url: string, options: RequestInit, session: TableSession): Promise<Response> {
  if (sessionExpiredFired) throw new Error("세션이 만료되었습니다");

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    Authorization: `Bearer ${session.accessToken}`,
  };
  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    if (!refreshPromise) {
      refreshPromise = doRefresh(session.refreshToken).finally(() => {
        refreshPromise = null;
      });
    }
    try {
      const newTokens = await refreshPromise;
      session.accessToken = newTokens.accessToken;
      session.refreshToken = newTokens.refreshToken;
      sessionStorage.setItem("table-order-session", JSON.stringify(session));
      headers.Authorization = `Bearer ${newTokens.accessToken}`;
      return fetch(url, { ...options, headers });
    } catch {
      fireSessionExpired();
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }
  }
  return res;
}

// ── 인증 ──

export async function loginTable(credential: TableCredential): Promise<TableSession> {
  const res = await fetch(`${API_BASE}/api/auth/table/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "인증에 실패했습니다");
  }
  sessionExpiredFired = false;
  return res.json();
}

// ── 메뉴 ──

export async function fetchMenusGrouped(session: TableSession): Promise<CategoryWithMenus[]> {
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

export async function createOrder(session: TableSession, req: CreateOrderRequest): Promise<Order> {
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
  const res = await authFetch(
    `${API_BASE}/api/tables/${session.tableId}/orders`,
    {},
    session
  );
  if (!res.ok) throw new Error("주문 내역을 불러올 수 없습니다");
  const orders: Order[] = await res.json();
  return orders.reverse();
}
