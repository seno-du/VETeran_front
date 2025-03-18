import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}


export const useChatbotStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));