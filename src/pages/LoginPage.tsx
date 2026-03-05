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
  const [tableNo, setTableNo] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // 저장된 인증 정보가 있으면 자동 로그인 시도
  useEffect(() => {
    if (savedCredential) {
      onAutoLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!storeId.trim()) {
      setLocalError("매장 식별자를 입력해주세요");
      return;
    }
    if (!tableNo.trim() || isNaN(Number(tableNo))) {
      setLocalError("올바른 테이블 번호를 입력해주세요");
      return;
    }
    if (!password.trim()) {
      setLocalError("비밀번호를 입력해주세요");
      return;
    }

    onLogin({ storeId: storeId.trim(), tableNo: Number(tableNo), password: password.trim() });
  };

  const displayError = error || localError;

  // 자동 로그인 진행 중
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
          <label className="login-label">매장 식별자</label>
          <input
            className="login-input"
            type="text"
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
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            min="1"
            disabled={loading}
          />

          <label className="login-label" style={{ marginTop: 16 }}>비밀번호</label>
          <input
            className="login-input"
            type="password"
            placeholder="테이블 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
