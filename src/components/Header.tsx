import React from "react";
import { NavLink } from "react-router-dom";
import { TableSession } from "../types";
import "./Header.css";

interface Props {
  session: TableSession;
  cartCount: number;
  onLogout: () => void;
}

export default function Header({ session, cartCount, onLogout }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-logo">🍽</span>
        <div>
          <div className="header-store">테이블 오더</div>
          <div className="header-table">테이블 {session.tableNo}번</div>
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
        <button className="nav-btn logout-btn" onClick={onLogout}>
          나가기
        </button>
      </nav>
    </header>
  );
}
