import { ReactNode, useState } from "react";
import { SheetContext } from "./Sheet";

interface SheetProviderProps {
    children: ReactNode;
}

const SheetProvider = ({ children }: SheetProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SheetContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SheetContext.Provider>
    );
};

export default SheetProvider;
