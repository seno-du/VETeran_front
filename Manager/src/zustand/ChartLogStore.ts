// src/zustand/ChartLogStore.ts
import { create } from 'zustand';

export interface ChartLog {
    chartNum: number;
    historyNum: number;  // number로 유지
}

interface ChartLogState {
    planItems: ChartLog[];
    setPlanItems: (items: ChartLog[]) => void;
}

export const useChartLogStore = create<ChartLogState>((set) => ({
    planItems: [],
    setPlanItems: (chartlogs: ChartLog[]) => set({ planItems: chartlogs }),
}));
