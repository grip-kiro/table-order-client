import React, { useState } from "react";
import { Menu, CartItem } from "../types";
import { fmt } from "../utils";
import "./MenuCard.css";

interface Props {
  menu: Menu;
  cartItem?: CartItem;
  onAdd: (menu: Menu, qty: number) => void;
  onUpdateQty: (menuId: number, delta: number) => void;
  onDetail: (menu: Menu) => void;
}

export default function MenuCard({ menu, cartItem, onAdd, onUpdateQty, onDetail }: Props) {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAdd(menu, qty);
    setQty(1);
  };

  return (
    <div className={`menu-card${menu.isSoldOut ? " sold-out" : ""}`}>
      <div className="menu-img-area" onClick={() => onDetail(menu)}>
        {menu.imageUrl ? (
          <img className="menu-img" src={menu.imageUrl} alt={menu.name} />
        ) : (
          <span className="menu-placeholder">🍽️</span>
        )}
        {menu.isSoldOut && <div className="sold-out-badge">품절</div>}
      </div>
      <div className="menu-info" onClick={() => onDetail(menu)}>
        <div className="menu-name">{menu.name}</div>
        <div className="menu-desc">{menu.description}</div>
        {menu.categories.length > 0 && (
          <span className="menu-category">{menu.categories[0].name}</span>
        )}
      </div>
      <div className="menu-bottom">
        <div className="menu-price">{fmt(menu.price * qty)}</div>
        {menu.isSoldOut ? (
          <button className="add-btn" disabled>품절</button>
        ) : (
          <div className="add-row">
            <div className="qty-row">
              <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="add-btn" onClick={handleAdd}>담기</button>
          </div>
        )}
      </div>
    </div>
  );
}
