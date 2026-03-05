import React, { useState, useEffect } from "react";
import { TableCredential } from "../types";
import "./LoginPage.css";

interface Props {
  savedCredential: TableCredential | null;
  loading: boolean;
  error: string;
  onLogin: (credential: TableCredential) => void;
  onAutoLogin: () => void;
}

export default function LoginPage({ savedCredential, loading, error, onLogin, onAutoLogin }: Props) {
  const [storeId, setStoreId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [pin, setPin] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (savedCredential) {
      onAutoLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const storeIdNum = Number(storeId);
    if (!storeId.trim() || isNaN(storeIdNum) || storeIdNum <= 0) {
      setLocalError("매장 ID를 입력해주세요");
      return;
    }
    const tableNum = Number(tableNumber);
    if (!tableNumber.trim() || isNaN(tableNum) || tableNum <= 0) {
      setLocalError("테이블 번호를 입력해주세요");
      return;
    }
    if (!/^\d{4,6}$/.test(pin)) {
      setLocalError("PIN은 4~6자리 숫자입니다");
      return;
    }

    onLogin({ storeId: storeIdNum, tableNumber: tableNum, pin });
  };

  const displayError = error || localError;

  if (savedCredential && loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">🍽</div>
          <h1 className="login-title">테이블 오더</h1>
          <p className="login-subtitle">자동 로그인 중...</p>
          <div className="login-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍽</div>
        <h1 className="login-title">테이블 오더</h1>
        <p className="login-subtitle">테이블 초기 설정</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">매장 ID</label>
          <input
            className="login-input"
            type="number"
            placeholder="매장 ID를 입력하세요"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            autoFocus
            disabled={loading}
          />

          <label className="login-label" style={{ marginTop: 16 }}>테이블 번호</label>
          <input
            className="login-input"
            type="number"
            placeholder="테이블 번호"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            min="1"
            disabled={loading}
          />

          <label className="login-label" style={{ marginTop: 16 }}>PIN</label>
          <input
            className="login-input"
            type="password"
            placeholder="4~6자리 숫자"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            maxLength={6}
            disabled={loading}
          />

          {displayError && <p className="login-error">{displayError}</p>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "연결 중..." : "설정 완료"}
          </button>
        </form>

        <p className="login-notice">
          초기 설정 후 자동으로 로그인됩니다
        </p>
      </div>
    </div>
  );
}
