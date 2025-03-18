// src/zustand/ItemStore.ts
import { create } from 'zustand';

export interface ItemHistory {
    itemId: string;        // 아이템 ID
    locationId: number;    // 구역 번호
    historyQuantity: number; // 아이템 갯수
    transactionType: string; // 입고 / 출고
}

interface ItemHistoryState {
    planItems: ItemHistory[]; // 타입을 배열로 수정
    items: ItemHistory[];     // 기존 상태를 그대로 유지
    addItems: (newItems: ItemHistory[]) => void;  // 새로운 아이템 추가 함수
}

export const useItemHistoryStore = create<ItemHistoryState>((set) => ({
    planItems: [],   // 초기값을 빈 배열로 설정
    items: [],
    addItems: (newItems: ItemHistory[]) =>
        set((state) => ({ items: [...state.items, ...newItems] })),
}));
