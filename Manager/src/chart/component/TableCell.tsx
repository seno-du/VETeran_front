import React from "react";

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => (
    <td className={`border-b border-gray-200 p-2 ${className}`}>
        {children}
    </td>
);

export default TableCell;
