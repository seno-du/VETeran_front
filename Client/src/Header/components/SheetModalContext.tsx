import { createContext } from 'react';

export interface ModalContextProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export const SheetModalContext = createContext<ModalContextProps | undefined>(undefined);
