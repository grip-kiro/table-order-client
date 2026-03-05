import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, CartItem, Category } from "../types";
import { fetchMenus, fetchCategories } from "../api/client";
import MenuCard from "../components/MenuCard";
import MenuDetailModal from "../components/MenuDetailModal";
import "./MenuPage.css";

interface Props {
  storeId: number;
  cart: CartItem[];
  onAdd: (menu: Menu, qty: number) => void;
  onUpdateQty: (menuId: number, delta: number) => void;
}

export default function MenuPage({ storeId, cart, onAdd, onUpdateQty }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("전체");
  const [detailMenu, setDetailMenu] = useState<Menu | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchCategories(storeId).then(setCategories).catch(() => {});
  }, [storeId]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const page = await fetchMenus(storeId, category, cursor);
      setMenus((prev) => [...prev, ...page.items]);
      setCursor(page.nextCursor !== null ? Number(page.nextCursor) : null);
      setHasMore(page.nextCursor !== null);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [storeId, category, cursor, loading, hasMore]);

  useEffect(() => {
    setMenus([]);
    setCursor(null);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    if (menus.length === 0 && hasMore && !loading) {
      loadMore();
    }
  }, [menus.length, hasMore, loading, loadMore]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleCategory = (c: string) => {
    if (c === category) return;
    setCategory(c);
  };

  const allCategories = [{ id: 0, name: "전체", displayOrder: 0 }, ...categories];

  return (
    <div className="menu-page">
      <div className="category-bar">
        {allCategories.map((c) => (
          <button
            key={c.id}
            className={`cat-btn${category === c.name ? " active" : ""}`}
            onClick={() => handleCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

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

      <div ref={loaderRef} className="scroll-loader">
        {loading && <span className="loader-dot">불러오는 중...</span>}
      </div>

      <MenuDetailModal menu={detailMenu} onClose={() => setDetailMenu(null)} onAdd={onAdd} />
    </div>
  );
}
