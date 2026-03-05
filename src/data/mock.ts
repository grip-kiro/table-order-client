import { Menu, Order, TableSession } from "../types";

export const MOCK_SESSION: TableSession = {
  storeId: "gripfood-01",
  tableNo: 3,
  sessionId: "sess-abc123",
};

export const CATEGORIES = ["전체", "메인", "사이드", "음료", "디저트"];

export const MOCK_MENUS: Menu[] = [
  { id: 1, name: "김치찌개", price: 9000, category: "메인", desc: "깊고 얼큰한 국물의 돼지고기 김치찌개", img: "🍲" },
  { id: 2, name: "된장찌개", price: 8500, category: "메인", desc: "구수하고 담백한 손두부 된장찌개", img: "🥘" },
  { id: 3, name: "삼겹살 (1인분)", price: 14000, category: "메인", desc: "국내산 신선 삼겹살, 쌈채소 포함", img: "🥓" },
  { id: 4, name: "제육볶음", price: 10000, category: "메인", desc: "매콤달콤 양념 돼지불고기", img: "🍖" },
  { id: 5, name: "계란말이", price: 6000, category: "사이드", desc: "부드러운 일본식 계란말이", img: "🥚" },
  { id: 6, name: "감자튀김", price: 5000, category: "사이드", desc: "바삭하게 튀긴 황금 감자튀김", img: "🍟" },
  { id: 7, name: "군만두", price: 6500, category: "사이드", desc: "겉은 바삭, 속은 촉촉한 고기만두", img: "🥟" },
  { id: 8, name: "콜라", price: 2000, category: "음료", desc: "시원한 코카콜라 355ml", img: "🥤" },
  { id: 9, name: "사이다", price: 2000, category: "음료", desc: "청량한 칠성사이다 355ml", img: "🫧" },
  { id: 10, name: "아이스 아메리카노", price: 3000, category: "음료", desc: "진한 에스프레소 아이스 아메리카노", img: "☕" },
  { id: 11, name: "식혜", price: 3500, category: "음료", desc: "달콤하고 시원한 전통 식혜", img: "🍶" },
  { id: 12, name: "아이스크림", price: 3000, category: "디저트", desc: "부드러운 바닐라 소프트아이스크림", img: "🍦" },
  { id: 13, name: "팥빙수", price: 7000, category: "디저트", desc: "달콤한 팥과 쫄깃한 떡이 가득", img: "🧊" },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    createdAt: new Date(Date.now() - 25 * 60000),
    sessionId: "sess-abc123",
    items: [
      { name: "김치찌개", qty: 2, price: 9000 },
      { name: "콜라", qty: 2, price: 2000 },
    ],
    total: 22000,
    status: "완료",
  },
  {
    id: "ORD-002",
    createdAt: new Date(Date.now() - 10 * 60000),
    sessionId: "sess-abc123",
    items: [
      { name: "감자튀김", qty: 1, price: 5000 },
      { name: "계란말이", qty: 1, price: 6000 },
    ],
    total: 11000,
    status: "준비중",
  },
];
