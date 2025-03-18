import React from 'react';

interface Location {
    itemId: string;
    itemName: string;
    itemCategory: string;
    itemPrice: number;
    remainingStock: number;
}

interface LocationTableProps {
    locationList: Location[];
}

const LocationTable: React.FC<LocationTableProps> = ({ locationList }) => {
    return (
        <div className="mt-8 w-full">
            <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2">Item ID</th>
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {locationList.map((location, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2">{location.itemId}</td>
                            <td className="px-4 py-2">{location.itemName}</td>
                            <td className="px-4 py-2">{location.itemCategory}</td>
                            <td className="px-4 py-2">{location.itemPrice}</td>
                            <td className="px-4 py-2">{location.remainingStock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LocationTable;
