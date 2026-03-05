import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, CartItem } from "../types";
import { CATEGORIES, fetchMenus } from "../data/mock";
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
  const [menus, setMenus] = useState<Menu[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const page = await fetchMenus(category, cursor);
    setMenus((prev) => [...prev, ...page.items]);
    setCursor(page.nextCursor);
    setHasMore(page.nextCursor !== null);
    setLoading(false);
  }, [category, cursor, loading, hasMore]);

  // 카테고리 변경 시 리셋
  useEffect(() => {
    setMenus([]);
    setCursor(null);
    setHasMore(true);
  }, [category]);

  // 리셋 후 첫 페이지 로드
  useEffect(() => {
    if (menus.length === 0 && hasMore && !loading) {
      loadMore();
    }
  }, [menus.length, hasMore, loading, loadMore]);

  // IntersectionObserver로 무한 스크롤
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

  return (
    <div className="menu-page">
      <div className="category-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-btn${category === c ? " active" : ""}`}
            onClick={() => handleCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {menus.map((menu) => (
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

      <div ref={loaderRef} className="scroll-loader">
        {loading && <span className="loader-dot">불러오는 중...</span>}
      </div>

      <MenuDetailModal menu={detailMenu} onClose={() => setDetailMenu(null)} onAdd={onAdd} />
    </div>
  );
}
