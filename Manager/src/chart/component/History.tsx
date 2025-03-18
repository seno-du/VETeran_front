import React, { useEffect, useState, useCallback } from "react";
import { useChartHistoryStore } from "../../zustand/ChartStore.ts";
import axios from "axios";
import { useParams } from "react-router-dom";

const SERVER_URL = "http://localhost:7124/back/api/chart";

interface ChartHistory {
  chartNum: number;
  managerName: string;
  chartNote: string;
  chartDate: number; // 밀리초 timestamp
  totalAmount?: number; // Plan 합계 (옵션)
  plan?: Array<{
    itemName: string;
    itemPrice: number;
    historyQuantity: number;
    totalPrice: number;
  }>;
}

const History: React.FC = () => {
  const { selectedHistory, setSelectedHistory } = useChartHistoryStore();
  const [history, setHistory] = useState<ChartHistory | null>(null);
  const [chartHistory, setChartHistory] = useState<any[]>([]);
  const { chartNum } = useParams();

  // timestamp를 "YYYY-MM-DD"로 변환
  const formatDate = (timestamp: number) => {
    if (!timestamp || isNaN(timestamp)) {
      return "유효하지 않은 날짜";
    }
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 진료내역 조회 함수
  const fetchChartDetail = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/detail/${chartNum}`);
      if (!response.data || response.data === "") {
        setHistory(null);
        return;
      }
      setHistory(response.data);
    } catch (error) {
      console.error("진료내역 불러오기 실패:", error);
    }
  }, [chartNum]);

  // 청구 내역 조회 함수 (itemhistory/billing)
  const fetchChartDetail2 = async () => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/itemhistory/billing?chartNum=${chartNum}`);

      const billingData = response.data;
      if (billingData && billingData.length > 0) {
        // BLOOD_COLLECTION_TUBE 항목만 필터링
        const filteredPlan = billingData.filter((item: any) => item.아이템ID === 'BLOOD_COLLECTION_TUBE').map((item: any) => ({
          itemName: item.아이템ID, // itemId (아이템 ID)
          itemPrice: item.제품가격, // 제품 가격
          historyQuantity: item.수량, // 수량
          totalPrice: item.청구금액, // 청구 금액
        }));

        // 데이터를 결합하여 history에 추가
        setHistory((prevHistory) => {
          const newHistory: ChartHistory = {
            chartNum: prevHistory?.chartNum || 0,
            managerName: prevHistory?.managerName || "",
            chartNote: prevHistory?.chartNote || "",
            chartDate: prevHistory?.chartDate || Date.now(),
            plan: filteredPlan, // 필터링된 항목만 저장
            totalAmount: filteredPlan.reduce((total: number, item: any) => total + item.totalPrice, 0),
          };
          return newHistory;
        });
      } else {
        console.log("청구 내역이 없습니다.");
      }
    } catch (error) {
      console.error("차트 역사 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (chartNum) { // chartNum이 있을 때만 호출
      fetchChartDetail();
      fetchChartDetail2();
    }
  }, [chartNum, selectedHistory]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex h-[35.2rem] gap-3 p-4">
        {/* 왼쪽: 진료일자 목록 */}
        <div className="flex flex-col w-1/3 border rounded-md bg-gray-50">
          <div className="p-2 text-xs font-medium text-gray-600 bg-gray-100 border-b">
            진료일자
          </div>
          <div className="flex-grow overflow-y-auto">
            {history ? (
              <div
                onClick={() => setSelectedHistory(history.chartNum)}
                className={`p-2 text-sm cursor-pointer hover:bg-white transition-colors ${
                  history.chartNum === selectedHistory ? "bg-white text-teal-700 font-medium" : "text-gray-600"
                }`}
              >
                {formatDate(history.chartDate)}, {history.chartNum}
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500">진료 날짜가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 오른쪽: 진료 내역 상세 */}
        <div className="flex flex-col w-2/3 border rounded-md">
          <div className="flex items-center p-2 text-xs font-medium text-gray-600 bg-gray-100 border-b">
            진료내역
          </div>
          <div className="flex-grow p-4 overflow-y-auto whitespace-pre-line">
            {history ? (
              <div key={history.chartNum} className="space-y-2">
                {/* 주치의 */}
                <div>
                  <strong>주치의:</strong> {history.managerName || "주치의 없음"}
                </div>

                {/* 진료 내용 */}
                <div>
                  <strong>진료 내용:</strong> {history.chartNote || "기록 없음"}
                </div>

                {/* 청구 항목 */}
                <div>
                  <strong>청구 항목:</strong>
                  {history.plan && history.plan.length > 0 ? (
                    <ul>
                      {history.plan.map((planItem, idx) => (
                        <li key={idx}>
                          {planItem.itemName}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "항목 없음"
                  )}
                </div>

                {/* 청구 금액 */}
                <div>
                  <strong>청구 금액:</strong> {history.totalAmount?.toLocaleString() || "금액 없음"}
                </div>
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-500">진료 기록이 선택되지 않았습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default History;