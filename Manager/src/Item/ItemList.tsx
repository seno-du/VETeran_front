import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useFetchItems from '../Inventory/ItemSerch';

interface ItemHistory {
    itemId: string;
    itemName: string;
    itemCategory: string;
    itemState: string;
    itemPrice: number;
    remainingStock: number;
}

const ItemList: React.FC = () => {
    const [itemList, setItemList] = useState<ItemHistory[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchType, setSearchType] = useState<'id' | 'name'>('id'); // 검색 타입 (ID / 이름)
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();

    const { locationList, loading, error, fetchItems } = useFetchItems(searchValue);

    // 검색 값 변경 시 디바운싱 적용
    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer); // 기존 타이머를 취소
        }

        const newTimer = setTimeout(() => {
            setSearching(true); // 검색 시작
            fetchItems(); // 검색 수행
        });

        setDebounceTimer(newTimer); // 새로운 타이머 설정
        return () => {
            if (newTimer) clearTimeout(newTimer); // 컴포넌트 언마운트 시 타이머 클리어
        };
    }, [searchValue, fetchItems]);

    // 전체 아이템 목록을 불러오는 함수
    useEffect(() => {
        if (!searchValue) {
            const fetchItemList = async () => {
                try {
                    const response = await axios.get(`http://localhost:7124/back/api/itemhistory/selectall/${pageNum}`);
                    if (response.status === 200) {
                        setItemList(response.data.items);
                        setTotalItems(response.data.totalSize);
                        setPageSize(response.data.pageSize);
                    } else {
                        console.error(`API request failed with status: ${response.status}`);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchItemList();
        } else {
            setItemList(locationList); // 검색 결과 설정
        }
    }, [searchValue, locationList, pageNum]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const handleClick = (itemId: string, action: string) => {
        if (action === 'order') {
            navigate('/inventory/order', { state: { itemId } });
        } else if (action === 'details') {
            navigate('/inventory/total/zone', { state: { itemId } });
        }
    };

    const handleSearchTypeChange = (type: 'id' | 'name') => {
        setSearchType(type);
        setSearchValue('');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">재고 목록</h2>

            {/* 검색 타입 선택 */}
            <div className="mb-6">
                <button
                    onClick={() => handleSearchTypeChange('id')}
                    className={`px-4 py-2 border rounded-md ${searchType === 'id' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    ID 검색
                </button>
                <button
                    onClick={() => handleSearchTypeChange('name')}
                    className={`ml-2 px-4 py-2 border rounded-md ${searchType === 'name' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                    이름 검색
                </button>
            </div>

            {/* 검색창 */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder={searchType === 'id' ? 'ID를 입력하세요' : '이름을 입력하세요'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                />
            </div>

            {/* 검색 결과 */}
            {searching && !loading && error && <div className="text-red-500">{error}</div>}
            {loading && <div>로딩 중...</div>}

            <table className="w-3/4 table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-teal-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">ID</th>
                        <th className="px-6 py-3 text-left">이름</th>
                        <th className="px-6 py-3 text-left">카테고리</th>
                        <th className="px-6 py-3 text-left">상태</th>
                        <th className="px-6 py-3 text-left">단위</th>
                        <th className="px-6 py-3 text-left">수량</th>
                        <th className="px-6 py-3 text-left">주문</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((item, key) => (
                        <tr key={key} className="hover:bg-gray-100">
                            <td className="px-6 py-3">{item.itemId}</td>
                            <td className="px-6 py-3">{item.itemName}</td>
                            <td className="px-6 py-3">{item.itemCategory}</td>
                            <td className="px-6 py-3">{item.itemState}</td>
                            <td className="px-6 py-3">{item.itemPrice}</td>
                            <td className="px-6 py-3">{item.remainingStock}</td>
                            <td className="px-6 py-3">
                                <button
                                    onClick={() => handleClick(item.itemId, 'order')}
                                    className="text-blue-500"
                                >
                                    재고 주문
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination - 검색 중이면 숨기기 */}
            {!loading && (
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={() => setPageNum(pageNum - 1)}
                        disabled={pageNum === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                    >
                        이전
                    </button>

                    <span className="text-lg">{pageNum} / {totalPages}</span>

                    <button
                        onClick={() => setPageNum(pageNum + 1)}
                        disabled={pageNum === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
};

export default ItemList;
