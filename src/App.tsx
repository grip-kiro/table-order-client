import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessOverlay from "./components/OrderSuccessOverlay";
import Toast from "./components/Toast";
import { useSession } from "./hooks/useSession";
import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";
import { Menu } from "./types";
import "./App.css";

function AppInner() {
  const navigate = useNavigate();
  const { session, savedCredential, loading: authLoading, error: authError, login, autoLogin, logout } = useSession();
  const { cart, add, updateQty, clear, total, count } = useCart();
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  if (!session) {
    return (
      <LoginPage
        savedCredential={savedCredential}
        loading={authLoading}
        error={authError}
        onLogin={login}
        onAutoLogin={autoLogin}
      />
    );
  }

  return (
    <AuthenticatedApp
      session={session}
      cart={cart}
      add={add}
      updateQty={updateQty}
      clear={clear}
      total={total}
      count={count}
      successOrderId={successOrderId}
      setSuccessOrderId={setSuccessOrderId}
      navigate={navigate}
      logout={logout}
    />
  );
}

function AuthenticatedApp({
  session,
  cart,
  add,
  updateQty,
  clear,
  total,
  count,
  successOrderId,
  setSuccessOrderId,
  navigate,
  logout,
}: any) {
  const { orders, loading: ordersLoading, hasMore, loadOrders, refreshOrders, placeOrder } = useOrders(session);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = useCallback((menu: Menu, qty: number = 1) => {
    add(menu, qty);
    setToast(`${menu.name} ${qty}개가 장바구니에 추가되었습니다`);
  }, [add]);

  const handleOrder = useCallback(async () => {
    if (cart.length === 0) return;
    try {
      const order = await placeOrder(cart, total);
      clear();
      setSuccessOrderId(order.id);
      setTimeout(() => {
        setSuccessOrderId(null);
        navigate("/");
      }, 5000);
    } catch (e: any) {
      alert(e.message || "주문에 실패했습니다. 다시 시도해주세요.");
    }
  }, [cart, total, placeOrder, clear, navigate, setSuccessOrderId]);

  return (
    <div className="app">
      <Header session={session} cartCount={count} onLogout={logout} />
      <OrderSuccessOverlay orderId={successOrderId} />
      <Toast message={toast} onDone={() => setToast(null)} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <MenuPage
                storeId={session.storeId}
                cart={cart}
                onAdd={handleAdd}
                onUpdateQty={updateQty}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                total={total}
                onUpdateQty={updateQty}
                onClear={clear}
                onOrder={handleOrder}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrdersPage
                orders={orders}
                loading={ordersLoading}
                hasMore={hasMore}
                onLoadMore={loadOrders}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
