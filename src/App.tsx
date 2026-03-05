import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessOverlay from "./components/OrderSuccessOverlay";
import { useSession } from "./hooks/useSession";
import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";
import "./App.css";

function AppInner() {
  const navigate = useNavigate();
  const { session, savedCredential, loading: authLoading, error: authError, login, autoLogin, logout } = useSession();
  const { cart, add, updateQty, clear, total, count } = useCart();
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

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

// 세션이 있을 때만 렌더링되는 컴포넌트 (useOrders를 안전하게 호출)
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
  const { orders, loading: ordersLoading, hasMore, orderError, loadOrders, refreshOrders, placeOrder } = useOrders(session);

  // 첫 로드 시 주문 내역 조회
  useEffect(() => {
    refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <MenuPage
                storeId={session.storeId}
                cart={cart}
                onAdd={add}
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
