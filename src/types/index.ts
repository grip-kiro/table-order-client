export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isSoldOut: boolean;
  displayOrder: number;
  categories: { id: number; name: string }[];
}

export interface CartItem {
  menuId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
}

export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "대기중",
  PREPARING: "준비중",
  COMPLETED: "완료",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "#f59e0b",
  PREPARING: "#3b82f6",
  COMPLETED: "#10b981",
};

export interface Order {
  id: number;
  storeId: number;
  tableId: number;
  sessionId: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TableCredential {
  storeId: number;
  tableNumber: number;
  pin: string;
}

export interface TableSession {
  storeId: number;
  tableId: number;
  tableNumber: number;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}
