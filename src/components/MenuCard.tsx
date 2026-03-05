import React from "react";
import { Menu, CartItem } from "../types";
import { fmt } from "../utils";
import "./MenuCard.css";

interface Props {
  menu: Menu;
  cartItem?: CartItem;
  onAdd: (menu: Menu) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onDetail: (menu: Menu) => void;
}

export default function MenuCard({ menu, cartItem, onAdd, onUpdateQty, onDetail }: Props) {
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
        <div className="menu-price">{fmt(menu.price)}</div>
        {cartItem ? (
          <div className="qty-row">
            <button className="qty-btn" onClick={() => onUpdateQty(menu.id, -1)}>−</button>
            <span className="qty-num">{cartItem.qty}</span>
            <button className="qty-btn" onClick={() => onUpdateQty(menu.id, 1)}>+</button>
          </div>
        ) : (
          <button className="add-btn" onClick={() => onAdd(menu)}>담기</button>
        )}
      </div>
    </div>
  );
}
