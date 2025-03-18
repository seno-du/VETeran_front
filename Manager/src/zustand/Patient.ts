import { create } from 'zustand'

interface Patient {
    patientId: number | null,
    setPatientId: (id: number) => void
}

export const usePatientStore = create<Patient>()((set) => ({
    patientId : null,
    setPatientId: (id: number) => set({ patientId: id }),
}))