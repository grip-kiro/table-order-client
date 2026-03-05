import { useState, useCallback } from "react";
import { TableSession, TableCredential } from "../types";
import { loginTable } from "../api/client";

const CRED_KEY = "table-order-credential";
const SESSION_KEY = "table-order-session";

// ── 디버그용 고정 세션 (로그인 건너뛰기) ──
const DEV_FIXED_SESSION: TableSession = {
  storeId: 1,
  tableId: 1,
  tableNumber: 1,
  sessionId: "a6e4e179-d060-40e6-bb81-5727fa2bbbf6",
  accessToken: "eyJhbGciOiJIUzM4NCJ9.eyJ0YWJsZUlkIjoxLCJyb2xlIjoiVEFCTEUiLCJzZXNzaW9uSWQiOiJhNmU0ZTE3OS1kMDYwLTQwZTYtYmI4MS01NzI3ZmEyYmJiZjYiLCJ0YWJsZU51bWJlciI6MSwic3RvcmVJZCI6MSwiaWF0IjoxNzcyNjk2ODgwLCJleHAiOjE3NzI2OTg2ODB9.2tcyHo4jYC7dtwJYXgG8aUd12UNHFVF-p41R_dITqZ3BwfOlK4q4ZdZ-01M65AaE",
  refreshToken: "cecad4c7-5c84-4ae6-9ddc-1dc9372caa76",
  expiresIn: 1800,
};

export function useSession() {
  const [session, setSession] = useState<TableSession | null>(DEV_FIXED_SESSION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const savedCredential: TableCredential | null = { storeId: 1, tableNumber: 1, pin: "0000" };

  const login = useCallback(async (credential: TableCredential) => {
    setLoading(true);
    setError("");
    try {
      const sess = await loginTable(credential);
      localStorage.setItem(CRED_KEY, JSON.stringify(credential));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      setSession(sess);
    } catch (e: any) {
      setError(e.message || "인증에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, []);

  const autoLogin = useCallback(async () => {}, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CRED_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("table-order-cart");
    setSession(null);
  }, []);

  return { session, savedCredential, loading, error, login, autoLogin, logout };
}
