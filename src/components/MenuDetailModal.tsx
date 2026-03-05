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
        <div className="modal-emoji">{menu.img}</div>
        <div className="modal-name">{menu.name}</div>
        <div className="modal-desc">{menu.desc}</div>
        <div className="modal-price">{fmt(menu.price * qty)}</div>
        <span className="modal-category">{menu.category}</span>
        <div className="modal-qty-row">
          <button className="modal-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="modal-qty-num">{qty}</span>
          <button className="modal-qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <div className="modal-actions">
          <button className="modal-close-btn" onClick={onClose}>닫기</button>
          <button className="modal-add-btn" onClick={() => { onAdd(menu, qty); onClose(); }}>
            {qty}개 담기 · {fmt(menu.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
