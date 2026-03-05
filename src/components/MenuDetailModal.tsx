import React from "react";
import { Menu } from "../types";
import { fmt } from "../utils";
import "./MenuDetailModal.css";

interface Props {
  menu: Menu | null;
  onClose: () => void;
  onAdd: (menu: Menu) => void;
}

export default function MenuDetailModal({ menu, onClose, onAdd }: Props) {
  if (!menu) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-emoji">{menu.img}</div>
        <div className="modal-name">{menu.name}</div>
        <div className="modal-desc">{menu.desc}</div>
        <div className="modal-price">{fmt(menu.price)}</div>
        <span className="modal-category">{menu.category}</span>
        <div className="modal-actions">
          <button className="modal-close-btn" onClick={onClose}>닫기</button>
          <button className="modal-add-btn" onClick={() => { onAdd(menu); onClose(); }}>
            장바구니 추가
          </button>
        </div>
      </div>
    </div>
  );
}
