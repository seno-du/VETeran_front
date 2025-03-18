import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';  // lodash를 사용하여 디바운스 적용

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

const InventoryManagement: React.FC = () => {
    const [locationList, setLocationList] = useState<Location[]>([]);
    const [searchType, setSearchType] = useState<'itemId' | 'itemName'>('itemId');
    const [inputValue, setInputValue] = useState('');

    // 입력값이 변경될 때마다 검색을 디바운스로 처리
    const debouncedSearch = debounce(async (searchValue: string) => {
        if (searchValue) {
            if (searchType === 'itemId') {
                try {
                    const response = await axios.get<ItemList>(`http://localhost:7124/back/api/itemhistory/itemid/${searchValue}`);
                    setLocationList(response.data.locations);
                } catch (error) {
                    console.error("Error fetching item by ID", error);
                }
            } else if (searchType === 'itemName') {
                try {
                    const response = await axios.get<ItemList>(`http://localhost:7124/back/api/itemhistory/itemname/${searchValue}`);
                    setLocationList(response.data.locations);
                } catch (error) {
                    console.error("Error fetching item by Name", error);
                }
            }
        } else {
            setLocationList([]);
        }
    }, 100);

    // 입력값 변경 시 디바운스를 적용한 함수 호출
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    return (
        <div className="min-h-[90vh] bg-gray-100 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">재고 검색</h2>

                <div className="mb-4">
                    {/* 버튼 클릭 시 검색 타입 설정 */}
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

                {/* 입력창 */}
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

            {/* 검색 결과 테이블 출력 */}
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

export default InventoryManagement;
