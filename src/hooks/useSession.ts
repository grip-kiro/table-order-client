import { useState, useCallback } from "react";
import { TableSession, TableCredential } from "../types";
import { loginTable } from "../api/client";

const CRED_KEY = "table-order-credential";
const SESSION_KEY = "table-order-session";

function loadSession(): TableSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadCredential(): TableCredential | null {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useSession() {
  const [session, setSession] = useState<TableSession | null>(loadSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const savedCredential = loadCredential();

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

  const autoLogin = useCallback(async () => {
    const cred = loadCredential();
    if (!cred) return;
    setLoading(true);
    try {
      const sess = await loginTable(cred);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      setSession(sess);
    } catch {
      localStorage.removeItem(CRED_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CRED_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("table-order-cart");
    setSession(null);
  }, []);

  return { session, savedCredential, loading, error, login, autoLogin, logout };
}
