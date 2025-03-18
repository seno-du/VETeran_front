import { create } from 'zustand'

interface ChartSearchQuery {
    assessment: string;
    plan: string;
    setAssessment: (str: string) => void;
    setPlan: (str: string) => void;
}

export const useChartSearchStore = create<ChartSearchQuery>()((set) => ({
    assessment: "",
    plan: "",
    setAssessment: (query: string) => set({ assessment: query }), // assessment로 수정
    setPlan: (query: string) => set({ plan: query })  // plan으로 수정
}))