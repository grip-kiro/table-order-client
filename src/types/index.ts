export interface Menu {
  id: number;
  name: string;
  price: number;
  category: string;
  desc: string;
  img: string;
}

export interface CartItem extends Menu {
  qty: number;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = "대기중" | "준비중" | "완료";

export interface Order {
  id: string;
  createdAt: Date;
  sessionId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

export interface TableSession {
  storeId: string;
  tableNo: number;
  sessionId: string;
}
