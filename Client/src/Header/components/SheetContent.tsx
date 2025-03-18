import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { SheetContext } from './Sheet';

interface SheetContentProps {
    children: React.ReactNode;
    side?: 'left' | 'right';
}

const SheetContent = ({ children, side = 'left' }: SheetContentProps) => {
    // useContext로 SheetContext 값을 가져오기
    const context = useContext(SheetContext);

    // context가 undefined일 경우 처리
    if (!context) {
        throw new Error("SheetContext is not provided");
    }

    const { isOpen, setIsOpen } = context;

    // isOpen이 false일 경우 null 반환 (Sheet이 열리지 않음)
    if (!isOpen) return null;

    // side에 따른 스타일 적용
    const sideStyles = {
        left: 'left-0',
        right: 'right-0',
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setIsOpen(false)} // 배경 클릭 시 닫기
            />
            <div className={`fixed ${sideStyles[side]} top-0 h-full w-64 bg-white p-6 z-50 shadow-xl`}>
                <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </button>
                {children}
            </div>
        </>
    );
};

export default SheetContent;
