import { create } from 'zustand'

interface DICOMViewer {
    url : string
    isOpen : boolean
    setUrl : (url : string) => void
    setIsOpen : (isOpen : boolean) => void
}

export const useDICOMStore = create<DICOMViewer>()((set) => ({
    url : "",
    isOpen : false,
    setUrl : (url : string) => set({ url : url }),
    setIsOpen : (isOpen : boolean) => set({ isOpen : isOpen }),
}))