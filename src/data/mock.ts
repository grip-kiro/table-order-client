import { Menu, Order, Category } from "../types";

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "메인", displayOrder: 1 },
  { id: 2, name: "사이드", displayOrder: 2 },
  { id: 3, name: "음료", displayOrder: 3 },
  { id: 4, name: "디저트", displayOrder: 4 },
];

export const MOCK_MENUS: Menu[] = [
  { id: 1, name: "김치찌개", price: 9000, categories: [{ id: 1, name: "메인" }], description: "깊고 얼큰한 국물의 돼지고기 김치찌개", imageUrl: null, isSoldOut: false, displayOrder: 1 },
  { id: 2, name: "된장찌개", price: 8500, categories: [{ id: 1, name: "메인" }], description: "구수하고 담백한 손두부 된장찌개", imageUrl: null, isSoldOut: false, displayOrder: 2 },
  { id: 3, name: "삼겹살 (1인분)", price: 14000, categories: [{ id: 1, name: "메인" }], description: "국내산 신선 삼겹살, 쌈채소 포함", imageUrl: null, isSoldOut: false, displayOrder: 3 },
  { id: 4, name: "제육볶음", price: 10000, categories: [{ id: 1, name: "메인" }], description: "매콤달콤 양념 돼지불고기", imageUrl: null, isSoldOut: true, displayOrder: 4 },
  { id: 5, name: "계란말이", price: 6000, categories: [{ id: 2, name: "사이드" }], description: "부드러운 일본식 계란말이", imageUrl: null, isSoldOut: false, displayOrder: 5 },
  { id: 6, name: "감자튀김", price: 5000, categories: [{ id: 2, name: "사이드" }], description: "바삭하게 튀긴 황금 감자튀김", imageUrl: null, isSoldOut: false, displayOrder: 6 },
  { id: 7, name: "군만두", price: 6500, categories: [{ id: 2, name: "사이드" }], description: "겉은 바삭, 속은 촉촉한 고기만두", imageUrl: null, isSoldOut: false, displayOrder: 7 },
  { id: 8, name: "콜라", price: 2000, categories: [{ id: 3, name: "음료" }], description: "시원한 코카콜라 355ml", imageUrl: null, isSoldOut: false, displayOrder: 8 },
  { id: 9, name: "사이다", price: 2000, categories: [{ id: 3, name: "음료" }], description: "청량한 칠성사이다 355ml", imageUrl: null, isSoldOut: false, displayOrder: 9 },
  { id: 10, name: "아이스 아메리카노", price: 3000, categories: [{ id: 3, name: "음료" }], description: "진한 에스프레소 아이스 아메리카노", imageUrl: null, isSoldOut: false, displayOrder: 10 },
  { id: 11, name: "식혜", price: 3500, categories: [{ id: 3, name: "음료" }], description: "달콤하고 시원한 전통 식혜", imageUrl: null, isSoldOut: false, displayOrder: 11 },
  { id: 12, name: "아이스크림", price: 3000, categories: [{ id: 4, name: "디저트" }], description: "부드러운 바닐라 소프트아이스크림", imageUrl: null, isSoldOut: false, displayOrder: 12 },
  { id: 13, name: "팥빙수", price: 7000, categories: [{ id: 4, name: "디저트" }], description: "달콤한 팥과 쫄깃한 떡이 가득", imageUrl: null, isSoldOut: false, displayOrder: 13 },
];

export const MOCK_ORDERS: Order[] = [];
