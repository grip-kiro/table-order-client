import React from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types";
import { fmt } from "../utils";
import "./CartPage.css";

interface Props {
  cart: CartItem[];
  total: number;
  onUpdateQty: (menuId: number, delta: number) => void;
  onClear: () => void;
  onOrder: () => void;
}

export default function CartPage({ cart, total, onUpdateQty, onClear, onOrder }: Props) {
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h2 className="page-title">장바구니</h2>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-text">장바구니가 비어있습니다</div>
          <button className="go-menu-btn" onClick={() => navigate("/")}>
            메뉴 보러가기
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.menuId} className="cart-item">
                <span className="cart-emoji">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="cart-img" />
                  ) : (
                    "🍽️"
                  )}
                </span>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{fmt(item.price)}</div>
                </div>
                <div className="qty-row">
                  <button className="qty-btn" onClick={() => onUpdateQty(item.menuId, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onUpdateQty(item.menuId, 1)}>+</button>
                </div>
                <div className="cart-item-total">{fmt(item.price * item.qty)}</div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="total-row">
              <span>합계</span>
              <span className="total-amt">{fmt(total)}</span>
            </div>
            <div className="cart-footer-btns">
              <button className="clear-btn" onClick={onClear}>비우기</button>
              <button className="order-btn" onClick={onOrder}>주문하기</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
