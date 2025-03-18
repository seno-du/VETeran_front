import React from "react";

const TableHeader = ({children, className = ""}) => (
    <th className={`border-b border-gray-200 p-2 text-left font-medium text-gray-600 ${className}`}>
        {children}
    </th>
);

export default TableHeader