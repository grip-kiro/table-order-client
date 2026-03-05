import React, { useState, useEffect } from "react";
import { Menu } from "../types";
import { fmt } from "../utils";
import "./MenuDetailModal.css";

interface Props {
  menu: Menu | null;
  onClose: () => void;
  onAdd: (menu: Menu, qty: number) => void;
}

export default function MenuDetailModal({ menu, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [menu]);

  if (!menu) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-img-area">
          {menu.imageUrl ? (
            <img className="modal-img" src={menu.imageUrl} alt={menu.name} />
          ) : (
            <span className="modal-placeholder">🍽️</span>
          )}
        </div>
        <div className="modal-name">{menu.name}</div>
        <div className="modal-desc">{menu.description}</div>
        <div className="modal-price">{fmt(menu.price * qty)}</div>
        {menu.categories.length > 0 && (
          <span className="modal-category">{menu.categories[0].name}</span>
        )}
        {!menu.isSoldOut && (
          <div className="modal-qty-row">
            <button className="modal-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="modal-qty-num">{qty}</span>
            <button className="modal-qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
        )}
        <div className="modal-actions">
          <button className="modal-close-btn" onClick={onClose}>닫기</button>
          <button
            className="modal-add-btn"
            disabled={menu.isSoldOut}
            onClick={() => { onAdd(menu, qty); onClose(); }}
          >
            {menu.isSoldOut ? "품절" : `${qty}개 담기 · ${fmt(menu.price * qty)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
