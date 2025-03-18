import { create } from 'zustand';

interface LoginState {
    token: string;
    setToken: (token: string) => void;
}

export const useTokenStore = create<LoginState>((set) => ({
    token: '',
    setToken: (token: string) => set({ token }),
}));
