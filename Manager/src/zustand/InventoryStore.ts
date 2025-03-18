// src/zustand/InventoryStore.ts
import { create } from 'zustand';

export interface PlanItem {
  orderId: number;        // 아이템 ID (숫자로 변환)
  testName: string;       // 아이템명 (예: "EQUIP-401", "Kong 장난감" 등)
  orderPrice: number;     // 아이템 가격
  orderQuantity: number;  // 주문(출고) 수량
}

interface InventoryState {
  planItems: PlanItem[];
  setPlanItems: (items: PlanItem[]) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  planItems: [],
  setPlanItems: (items: PlanItem[]) => set({ planItems: items }),
}));
