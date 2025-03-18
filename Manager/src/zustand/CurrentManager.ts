import { create } from 'zustand'

interface CurrentManager {
    role : string[];
    setRole : (role: string[]) => void;
}

export const useCurrentManagerStore = create<CurrentManager>()((set) => ({
    role : [],
    setRole : (role : string[]) => set({role : role})
}))