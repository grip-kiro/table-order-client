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
    <div className={`mc${menu.isSoldOut ? " mc--sold" : ""}`}>
      <div className="mc__img" onClick={() => onDetail(menu)}>
        {menu.imageUrl ? (
          <img src={menu.imageUrl} alt={menu.name} />
        ) : (
          <span className="mc__ph">🍽️</span>
        )}
        {menu.isSoldOut && <div className="mc__sold-overlay">품절</div>}
      </div>

      <div className="mc__body">
        <div className="mc__info" onClick={() => onDetail(menu)}>
          <span className="mc__name">{menu.name}</span>
          <span className="mc__price">{fmt(menu.price * qty)}</span>
        </div>

        {menu.isSoldOut ? (
          <div className="mc__actions">
            <button className="mc__btn-add" disabled>품절</button>
          </div>
        ) : (
          <div className="mc__actions">
            <div className="mc__qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button className="mc__btn-add" onClick={handleAdd}>담기</button>
          </div>
        )}
      </div>
    </div>
  );
}
