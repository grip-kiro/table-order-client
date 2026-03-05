import React, { useState, useEffect, useMemo } from "react";
import { Menu, CartItem, Category, CategoryWithMenus, TableSession } from "../types";
import { fetchMenusGrouped } from "../api/client";
import MenuCard from "../components/MenuCard";
import MenuDetailModal from "../components/MenuDetailModal";
import "./MenuPage.css";

interface Props {
  session: TableSession;
  cart: CartItem[];
  onAdd: (menu: Menu, qty: number) => void;
  onUpdateQty: (menuId: number, delta: number) => void;
}

export default function MenuPage({ session, cart, onAdd, onUpdateQty }: Props) {
  const [groups, setGroups] = useState<CategoryWithMenus[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0); // 0 = 전체
  const [detailMenu, setDetailMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMenusGrouped(session)
      .then(setGroups)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const categories: Category[] = useMemo(
    () => groups.map((g) => ({ id: g.id, name: g.name, displayOrder: g.displayOrder })),
    [groups]
  );

  const menus: Menu[] = useMemo(() => {
    if (categoryId === 0) {
      return groups.flatMap((g) => g.menus).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const group = groups.find((g) => g.id === categoryId);
    return group ? group.menus.sort((a, b) => a.displayOrder - b.displayOrder) : [];
  }, [groups, categoryId]);

  const allCategories = [{ id: 0, name: "전체", displayOrder: 0 }, ...categories];

  return (
    <div className="menu-page">
      <div className="category-bar">
        {allCategories.map((c) => (
          <button
            key={c.id}
            className={`cat-btn${categoryId === c.id ? " active" : ""}`}
            onClick={() => setCategoryId(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="scroll-loader">
          <span className="loader-dot">불러오는 중...</span>
        </div>
      ) : (
        <div className="menu-grid">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              cartItem={cart.find((i) => i.menuId === menu.id)}
              onAdd={onAdd}
              onUpdateQty={onUpdateQty}
              onDetail={setDetailMenu}
            />
          ))}
        </div>
      )}

      <MenuDetailModal menu={detailMenu} onClose={() => setDetailMenu(null)} onAdd={onAdd} />
    </div>
  );
}
