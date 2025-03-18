import { useState, useEffect } from "react";
import TableCell from "./TableCell";
import TableHeader from "./TableHeader";
import axios, { CancelTokenSource } from "axios";
import { useChartStore, Location } from "../../zustand/ChartStore";
import { ItemHistory, useItemHistoryStore } from "../../zustand/ItemStore";

interface SelectedItem extends Location {
  quantity: number;
}

interface ItemList {
  totalRemainingStock: number;
  locations: Location[];
}

interface PlanTableProps {
  buttonSize?: "small" | "medium" | "large"; // 버튼 크기를 조절할 수 있는 props
}

const PlanTable: React.FC<PlanTableProps> = () => {
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [searchType, setSearchType] = useState<"itemId" | "itemName">("itemId");
  const [searchValue, setSearchValue] = useState<string>("");
  const [cancelToken, setCancelToken] = useState<CancelTokenSource | null>(
    null
  );
  const addItems = useItemHistoryStore((state) => state.addItems);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const setItem = useItemHistoryStore((state) => state.planItems);

  // const chartStore = useChartStore();
  const setPlanItems = useChartStore((state) => state.setPlanItems);

  const searchItem = async (searchValue: string) => {
    // 빈 검색어는 결과를 초기화
    if (!searchValue) {
      setLocationList([]);
      return;
    }

    // 이전 요청 취소
    if (cancelToken) {
      cancelToken.cancel("Request cancelled due to new input.");
    }

    const newCancelToken = axios.CancelToken.source();
    setCancelToken(newCancelToken); // 새로운 cancelToken 설정

    try {
      let response;
      if (searchType === "itemId") {
        response = await axios.get<ItemList>(
          `http://localhost:7124/back/api/itemhistory/itemid/${searchValue}`,
          {
            cancelToken: newCancelToken.token,
          }
        );
      } else if (searchType === "itemName") {
        response = await axios.get<ItemList>(
          `http://localhost:7124/back/api/itemhistory/itemname/${searchValue}`,
          {
            cancelToken: newCancelToken.token,
          }
        );
      }

      if (response && response.data.locations) {
        setLocationList(response.data.locations);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request cancelled:", error.message);
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    // 검색어가 변경될 때마다 검색 실행
    if (searchValue) {
      const debounceSearch = setTimeout(() => {
        searchItem(searchValue);
      }, 50); // 500ms로 디바운스를 설정
      return () => clearTimeout(debounceSearch); // cleanup: 이전 타이머를 정리
    }
  }, [searchValue, searchType]); // searchValue나 searchType이 변경될 때마다 실행

  // item 클릭 시 선택/해제 토글 (선택 시 기본 quantity는 1)
  const toggleSelection = (item: Location) => {
    const alreadySelected = selectedItems.find(
      (si) => si.itemId === item.itemId
    );
    if (alreadySelected) {
      setSelectedItems(selectedItems.filter((si) => si.itemId !== item.itemId));
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 0 }]);
    }
  };


  const updateQuantity = (itemId: string, newQuantity: number) => {
    // selectedItems 업데이트
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );

    // selectedItems에서 중복된 itemId를 제거하고, 각 아이템에 대해 한 번만 기록
    const updatedItemHistories: ItemHistory[] = selectedItems
      .filter((item, index, self) =>
        // itemId가 중복되지 않도록 필터링
        index === self.findIndex((t) => t.itemId === item.itemId)
      )
      .map((item) => ({
        itemId: item.itemId,
        locationId: 1,
        historyQuantity: item.quantity, // 아이템 수량을 기록
        transactionType: "출고", // 출고로 고정
      }));

    // 아이템 히스토리 상태에 추가
    addItems(updatedItemHistories);
  };

  // 화면에 보여줄 아이템 목록: 선택된 아이템 + (검색 결과 중 선택되지 않은 아이템)
  const displayedItems = [
    ...selectedItems,
    ...locationList.filter(
      (item) => !selectedItems.some((si) => si.itemId === item.itemId)
    ),
  ];

  useEffect(() => {
    setPlanItems(selectedItems);
  }, [selectedItems, setPlanItems]);

  // 버튼 크기를 결정하는 클래스명
  // const buttonClasses = {
  //   small: "px-2 py-1 text-xs",
  //   medium: "px-4 py-2 text-sm",
  //   large: "px-6 py-3 text-base",
  // };

  return (
    <div className="plan-table-container bg-white">
      {/* 검색 입력 */}
      <div className="search-container mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="아이디 또는 이름 검색"
            className="flex-grow pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-700 text-sm"
          />
          <button
            onClick={() => {
              const newSearchType =
                searchType === "itemId" ? "itemName" : "itemId";
              setSearchType(newSearchType);
            }}
            className="px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm"
          >
            {searchType === "itemId" ? "itemId" : "itemName"}
          </button>
        </div>
      </div>

      {/* 검색 결과가 없을 때 테이블 숨기기 */}
      {/* {locationList.length > 0 ? ( */}

      {/* 아이템이 하나라도 있으면 테이블로 표시 */}
      {displayedItems.length > 0 ? (
        <div className="overflow-hidden">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-200 border-b border-gray-500 sticky top-0">
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>항목</TableHeader>
                <TableHeader>금액</TableHeader>
                <TableHeader>현재수량</TableHeader>
                <TableHeader>청구수량</TableHeader>
              </tr>
            </thead>
          </table>

          <div className="overflow-y-auto max-h-[345px]">
            <table className="w-full table-fixed border-collapse">
              <tbody>
                {displayedItems.map((item) => (
                  <tr
                    key={item.itemId}
                    onClick={() => toggleSelection(item)}
                    className={`cursor-pointer hover:bg-gray-100 ${selectedItems.some((si) => si.itemId === item.itemId)
                      ? "bg-teal-100"
                      : ""
                      }`}
                  >
                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.itemPrice.toLocaleString()}</TableCell>
                    <TableCell>{item.remainingStock}</TableCell>
                    <TableCell>
                      {selectedItems.some((si) => si.itemId === item.itemId) ? (
                        <input
                          type="number"
                          min="1"
                          value={
                            selectedItems.find(
                              (si) => si.itemId === item.itemId
                            )?.quantity || 0
                          }
                          onClick={(e) => e.stopPropagation()} // input 클릭 시 toggle 방지
                          onChange={(e) => {
                            const newQty = Number(e.target.value);
                            if (!isNaN(newQty) && newQty > 0) {
                              updateQuantity(item.itemId, newQty);
                            }
                          }}
                          className="w-16 border border-gray-300 rounded text-center"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default PlanTable;
