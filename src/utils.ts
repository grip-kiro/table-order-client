export const fmt = (n: number) => n.toLocaleString("ko-KR") + "원";

export const timeAgo = (date: Date): string => {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diff < 1) return "방금 전";
  if (diff < 60) return `${diff}분 전`;
  return `${Math.floor(diff / 60)}시간 전`;
};

export const timeStr = (date: Date): string =>
  date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
