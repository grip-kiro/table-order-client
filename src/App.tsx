import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessOverlay from "./components/OrderSuccessOverlay";
import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";
import "./App.css";

function AppInner() {
  const navigate = useNavigate();
  const { cart, add, updateQty, clear, total, count } = useCart();
  const { sessionOrders, placeOrder } = useOrders();
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const handleOrder = useCallback(() => {
    if (cart.length === 0) return;
    const order = placeOrder(cart, total);
    clear();
    setSuccessOrderId(order.id);
    setTimeout(() => {
      setSuccessOrderId(null);
      navigate("/");
    }, 4000);
  }, [cart, total, placeOrder, clear, navigate]);

  return (
    <div className="app">
      <Header cartCount={count} />
      <OrderSuccessOverlay orderId={successOrderId} />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<MenuPage cart={cart} onAdd={add} onUpdateQty={updateQty} />}
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
          <Route path="/orders" element={<OrdersPage orders={sessionOrders} />} />
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
