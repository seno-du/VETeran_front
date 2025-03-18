import React, { useEffect, useState } from "react";
import axios from "axios";
import { useChartStore } from "../../zustand/ChartStore.ts"; // Zustand에서 상태 가져오기

interface ReserveDTO {
  reserveNum: number;
  petNum: number;
  managerNum: number;
  reserveStatus: string;
  reserveDate: number;
  reserveNotice: string;
  managerName?: string | null;
}

const Followup: React.FC = () => {
  const petNum = useChartStore((state) => state.petNum); // Zustand에서 petNum 가져오기
  const [reservations, setReservations] = useState<ReserveDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Followup.tsx에서 받아온 petNum:", petNum);

  useEffect(() => {
    if (petNum === null || petNum === undefined || petNum === 0) {
      console.warn("🚨 petNum이 없습니다! API 호출을 중단합니다.");
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get(`http://localhost:7124/back/api/reserve/pet/${petNum}`)
      .then((response) => {
        console.log("📌 받아온 예약 데이터:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("올바르지 않은 응답 형식");
        }

        setReservations(response.data);
      })
      .catch((err) => {
        console.error("예약 데이터 가져오기 실패: ", err);
        setError("예약 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false); // 성공/실패와 관계없이 로딩 종료
      });
  }, [petNum]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-base font-semibold mb-3 flex items-center text-gray-700">
        <span className="text-teal-600 mr-2">◢</span> Followup
      </h3>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : reservations.length === 0 ? (
          <p className="text-center py-2">예약 정보가 없습니다.</p>
        ) : (
          <div className="max-h-[7rem] overflow-y-auto border rounded-md">
            <table className="w-full text-sm border-collapse">
              {/* 테이블 헤더 (고정) */}
              <thead className="bg-gray-100 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-2 text-center w-1/6">날짜</th>
                  <th className="p-2 text-center w-1/3">내용</th>
                  <th className="p-2 text-center w-1/6">담당자자</th>
                  <th className="p-2 text-center w-1/6">상태</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.reserveNum} className="border-b">
                    {/* 날짜 */}
                    <td className="p-2 text-gray-700 text-center">
                      {reservation.reserveDate
                        ? new Date(reservation.reserveDate).toLocaleDateString()
                        : "날짜 없음"}
                    </td>

                    {/* 예약 내용 */}
                    <td className="p-2 text-gray-700 text-center">
                      {reservation.reserveNotice}
                    </td>

                    {/* 의사 이름 (없으면 "정보 없음" 표시) */}
                    <td className="p-2 text-gray-700 text-center">
                      {reservation.managerName || "매니저"}
                    </td>

                    {/* 예약 상태 */}
                    <td className="p-2 text-gray-700 text-center">
                      {reservation.reserveStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Followup;
