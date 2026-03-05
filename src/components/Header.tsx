import React from "react";
import { NavLink } from "react-router-dom";
import { MOCK_SESSION } from "../data/mock";
import "./Header.css";

interface Props {
  cartCount: number;
}

export default function Header({ cartCount }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-logo">🍽</span>
        <div>
          <div className="header-store">테이블 오더</div>
          <div className="header-table">테이블 {MOCK_SESSION.tableNo}번</div>
        </div>
      </div>
      <nav className="header-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>
          메뉴
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>
          장바구니
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>
          주문내역
        </NavLink>
      </nav>
    </header>
  );
}
