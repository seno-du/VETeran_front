import { create } from 'zustand'

interface IsAuth {
    isAuth : boolean
    setIsAuth : (isAuth : boolean) => void
}

export const useIsAuthStore = create<IsAuth>()(set => ({
    isAuth : false,
    setIsAuth : (isAuth : boolean) => set({ isAuth })
}))