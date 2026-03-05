import React, { useEffect, useRef } from "react";
import { Order } from "../types";
import { fmt, timeAgo, timeStr } from "../utils";
import "./OrdersPage.css";

interface Props {
  orders: Order[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  대기중: "#f59e0b",
  준비중: "#3b82f6",
  완료: "#10b981",
};

export default function OrdersPage({ orders, loading, hasMore, onLoadMore }: Props) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadMore]);

  return (
    <div className="orders-page">
      <h2 className="page-title">주문 내역</h2>

      {orders.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">주문 내역이 없습니다</div>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-no">{order.id}</span>
                  <span className="order-time">{timeAgo(order.createdAt)}</span>
                  <span className="order-clock">{timeStr(order.createdAt)}</span>
                </div>
                <span
                  className="status-badge"
                  style={{
                    background: STATUS_COLOR[order.status] + "22",
                    color: STATUS_COLOR[order.status],
                    border: `1px solid ${STATUS_COLOR[order.status]}44`,
                  }}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((it, i) => (
                  <div key={i} className="order-item-row">
                    <span className="order-item-name">{it.name}</span>
                    <span className="order-item-qty">× {it.qty}</span>
                    <span className="order-item-amt">{fmt(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer-row">
                <span>총 금액</span>
                <span className="order-total">{fmt(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={loaderRef} className="scroll-loader">
        {loading && <span className="loader-dot">불러오는 중...</span>}
      </div>
    </div>
  );
}
