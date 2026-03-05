import React, { useState } from "react";
import { Menu, CartItem } from "../types";
import { fmt } from "../utils";
import "./MenuCard.css";

interface Props {
  menu: Menu;
  cartItem?: CartItem;
  onAdd: (menu: Menu, qty: number) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onDetail: (menu: Menu) => void;
}

export default function MenuCard({ menu, cartItem, onAdd, onUpdateQty, onDetail }: Props) {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAdd(menu, qty);
    setQty(1);
  };

  return (
    <div className="menu-card">
      <div className="menu-emoji" onClick={() => onDetail(menu)}>
        {menu.img}
      </div>
      <div className="menu-info" onClick={() => onDetail(menu)}>
        <div className="menu-name">{menu.name}</div>
        <div className="menu-desc">{menu.desc}</div>
        <span className="menu-category">{menu.category}</span>
      </div>
      <div className="menu-bottom">
        <div className="menu-price">{fmt(menu.price * qty)}</div>
        <div className="add-row">
          <div className="qty-row">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="qty-num">{qty}</span>
            <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className="add-btn" onClick={handleAdd}>담기</button>
        </div>
      </div>
    </div>
  );
}
