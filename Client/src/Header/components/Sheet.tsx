import { createContext, useState, ReactNode } from "react";

interface SheetProps {
    children: ReactNode;
}

export interface SheetContextProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SheetContext = createContext<SheetContextProps | undefined>(undefined);

const Sheet = ({ children }: SheetProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SheetContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SheetContext.Provider>
    );
};

export default Sheet;
