import React, { ReactElement, useContext } from 'react';
import { SheetContext, SheetContextProps } from './Sheet';

interface SheetTriggerProps {
    children: ReactElement;
}

const SheetTrigger = ({ children }: SheetTriggerProps) => {
    const { setIsOpen } = useContext(SheetContext) as SheetContextProps;

    return React.cloneElement(children, { onClick: () => setIsOpen(true) });
};

export default SheetTrigger;
