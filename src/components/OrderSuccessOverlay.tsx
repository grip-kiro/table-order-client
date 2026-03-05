import React from "react";
import "./OrderSuccessOverlay.css";

interface Props {
  orderId: number | null;
}

export default function OrderSuccessOverlay({ orderId }: Props) {
  if (!orderId) return null;
  return (
    <div className="success-overlay">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <div className="success-title">주문 완료!</div>
        <div className="success-order-no">#{orderId}</div>
        <div className="success-sub">잠시 후 메뉴 화면으로 이동합니다</div>
      </div>
    </div>
  );
}
