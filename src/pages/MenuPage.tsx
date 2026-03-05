import React, { useState } from "react";
import { Menu, CartItem } from "../types";
import { MOCK_MENUS, CATEGORIES } from "../data/mock";
import MenuCard from "../components/MenuCard";
import MenuDetailModal from "../components/MenuDetailModal";
import "./MenuPage.css";

interface Props {
  cart: CartItem[];
  onAdd: (menu: Menu) => void;
  onUpdateQty: (id: number, delta: number) => void;
}

export default function MenuPage({ cart, onAdd, onUpdateQty }: Props) {
  const [category, setCategory] = useState("전체");
  const [detailMenu, setDetailMenu] = useState<Menu | null>(null);

  const filtered =
    category === "전체" ? MOCK_MENUS : MOCK_MENUS.filter((m) => m.category === category);

  return (
    <div className="menu-page">
      <div className="category-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-btn${category === c ? " active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            cartItem={cart.find((i) => i.id === menu.id)}
            onAdd={onAdd}
            onUpdateQty={onUpdateQty}
            onDetail={setDetailMenu}
          />
        ))}
      </div>

      <MenuDetailModal menu={detailMenu} onClose={() => setDetailMenu(null)} onAdd={onAdd} />
    </div>
  );
}
