import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Location {
    itemId: string;
    locationStock: number;
    itemName: string;
    itemCategory: string;
    itemState: string;
    itemPrice: number;
    remainingStock: number;
}

interface ItemList {
    totalRemainingStock: number;
    locations: Location[];
}

const ItemSearch: React.FC = () => {
    const location = useLocation();
    const receivedItemId = location.state?.itemId; // 네비게이션에서 전달된 itemId

    const [locationList, setLocationList] = useState<Location[]>([]);
    const [searchType, setSearchType] = useState<'itemId' | 'itemName'>('itemId');
    const [inputValue, setInputValue] = useState(receivedItemId || '');
    const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const searchItem = async (searchValue: string) => {
        if (!searchValue) return;

        if (cancelToken) {
            cancelToken.cancel("Request cancelled due to new input.");
        }

        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken); // 새로운 cancelToken 설정

        try {
            let response;
            if (searchType === 'itemId') {
                response = await axios.get<ItemList>(`http://localhost:7124/back/api/itemhistory/itemid/${searchValue}`);
                if (response && response.data.locations) {
                    setLocationList(response.data.locations);
                }
            } else if (searchType === 'itemName') {
                response = await axios.get<ItemList>(`http://localhost:7124/back/api/itemhistory/itemname/${searchValue}`);
                if (response && response.data.locations) {
                    setLocationList(response.data.locations);
                }
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request cancelled:", error.message);
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timeout = setTimeout(() => {
            searchItem(value);
        }, 50);

        setTypingTimeout(timeout);
    };

    useEffect(() => {
        if (inputValue) {
            searchItem(inputValue);
        }
    }, [inputValue, searchType]);

    return (
        <div className="min-h-[90vh] bg-gray-100 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">재고 검색</h2>

                <div className="mb-4">
                    <button
                        onClick={() => setSearchType('itemId')}
                        className={`px-4 py-2 mr-2 rounded-lg ${searchType === 'itemId' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        재고 ID
                    </button>
                    <button
                        onClick={() => setSearchType('itemName')}
                        className={`px-4 py-2 rounded-lg ${searchType === 'itemName' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        재고 이름
                    </button>
                </div>

                <div className="mb-4">
                    <label htmlFor="searchInput" className="block text-gray-700 mb-2">
                        {searchType === 'itemId' ? '재고 ID 입력' : '재고 이름 입력'}
                    </label>
                    <input
                        id="searchInput"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={searchType === 'itemId' ? '재고 ID를 입력하세요' : '재고 이름을 입력하세요'}
                    />
                </div>
            </div>

            {locationList.length === 0 && inputValue && (
                <div className="text-center text-gray-500 mt-4">검색된 결과가 없습니다.</div>
            )}

            {locationList.length > 0 && (
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
            )}
        </div>
    );
};

export default ItemSearch;
