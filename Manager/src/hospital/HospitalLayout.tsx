import axios from "axios";
import React, { useState, useEffect } from "react";
import { useChartStore } from "../zustand/ChartStore";

// HospitalPet 타입은 Hospital 컴포넌트에서 사용 중인 타입과 일치해야 합니다.
export interface HospitalPet {
  hospitalStatus: string;
  hospitalRoom: number;
  petName: string;
  userName: string;
  hospitalMemo: string; // "경증", "보통", "중증", "위중"
  petSpecies: string;
  petBreed: string;
  managerName: string;
  hospitalStartTime: string;
  petNum: number; // 백엔드에서 JOIN으로 받아온 petNum
  chartNum: number;
  hospitalNum: number;
}


const SERVER_URL = "http://localhost:7124/back/api";

const HospitalLayout: React.FC = () => {
  
  const totalBeds = 20;
  const [disabledModalOpen, setDisabledModalOpen] = useState(false);
  const [bedNum, setbedNum] = useState(0);
  const [hospitalLogList, setHospitalLogList] = useState<HospitalPet[]>()

  

  const handleModelOpen = (bedNum: number): void => {
    setDisabledModalOpen(true);
    setbedNum(bedNum)
  };

  const handleCloseModel = () => {
    setDisabledModalOpen(false);
  };

  const getHospitalLogList = async () => {

    try {
      const response = await axios.get(`${SERVER_URL}/hospital/listOfActive`);

      if (response.status === 200) {
        console.log(" 응답 데이터:", response.data);
        setHospitalLogList(response.data);
      }
    } catch (error) {
      console.error("입원 로그 불러오기 오류:", error);
    }
  };

  //  퇴원 처리 기능
  const handleDischargeClick = async (hospitalRoom: number) => {

    try {
      const response = await axios.get(`${SERVER_URL}/hospital/discharge/${hospitalRoom}`);

      if (response.status === 200) {
        console.log(" 응답 데이터:", response.data);

        console.log(
          " 업데이트 후 hospitalStatus:",
          useChartStore.getState().hospitalStatus
        );

        alert("퇴원 처리가 되었습니다.");
        setDisabledModalOpen(false);
        window.location.reload();
      }
    } catch (error : any) {
      console.error("퇴원 처리 오류:", error);
      alert(error.response.data.message);
      setDisabledModalOpen(false);
    }
  };


  const a = useChartStore((state) => state.hospitalNum);
  console.log(a)

  useEffect(() => {
    console.log(" 전달된 환자 데이터:", hospitalLogList);
  }, [hospitalLogList]);

  useEffect(() => {
    getHospitalLogList();
  }, []);


  // 사용 중인 병실 수와 대기 병실 수 계산
  const usedBeds = Array.from({ length: totalBeds }, (_, i) => i + 1).filter(
    (bedNumber) => hospitalLogList?.some((p) => p.hospitalRoom === bedNumber)
  ).length;
  
  const waitingCount = totalBeds - usedBeds;

  const bedData = Array.from({ length: totalBeds }, (_, i) => {
    const bedNumber = i + 1;
    const patient = hospitalLogList?.find(
      (p) => p.hospitalRoom === bedNumber && p.hospitalStatus !== "퇴원"
    );
    return { bedNumber, patient };
  });

  // 중증, 위중일 때 색상 적용
  const getSeverityClass = (memo: string) => {
    if (memo === "중증") {
      return "bg-orange-200";
    } else if (memo === "위중") {
      return "bg-red-200";
    } else if (memo === "경증") {
      return "bg-gray-200";
    } else if (memo === "보통") {
      return "bg-gray-200";
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        <span className="text-teal-600 mr-2">◢</span>입원실 현황
      </h1>
      <div className="flex justify-center gap-6 mb-8 w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center p-6 bg-teal-600 rounded-xl shadow-lg flex-1">
          <p className="text-lg text-white font-semibold">사용 중</p>
          <p className="text-2xl text-white font-bold">{usedBeds}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-gray-200 rounded-xl shadow-lg flex-1">
          <p className="text-lg text-black font-semibold">사용 대기</p>
          <p className="text-2xl text-black font-bold">{waitingCount}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {bedData.map(({ bedNumber, patient }) => (
          <button onClick={() => handleModelOpen(bedNumber)}>
            <div
              key={bedNumber}
              className={`rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col justify-center items-center cursor-pointer min-h-[120px] ${patient ? getSeverityClass(patient.hospitalMemo) : "bg-white"
                }`}
            >

              <div className="text-xl font-semibold text-gray-700 mb-2">
                입원실 {bedNumber}
              </div>
              {patient ? (
                <>
                  <div className="text-sm text-gray-700">
                    환자명: {patient.petName || "정보 없음"}
                  </div>
                  <div className="text-sm text-gray-500">
                    보호자: {patient.userName || "정보 없음"}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">빈 입원실</div>
              )}
            </div>
          </button>
        ))}
      </div>
      {disabledModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
            <div className="w-full max-w-md">
              <p>퇴원처리 하시겠습니까?</p>
              <button
                onClick={() => handleDischargeClick(bedNum)}
                className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-teal-500 mr-4"
              >
                다음
              </button>
            </div>
            <button
              onClick={handleCloseModel}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-teal-500 p-2"
            >
              닫기
            </button>
          </div>
        </div>
      )
      }
    </div>
  );
};

export default HospitalLayout;
