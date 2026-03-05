import React, { useEffect } from "react";
import "./Toast.css";

interface Props {
  message: string | null;
  onDone: () => void;
}

export default function Toast({ message, onDone }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="toast" key={message}>
      {message}
    </div>
  );
}
