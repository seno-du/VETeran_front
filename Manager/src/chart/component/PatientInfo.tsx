import React from "react";
import { useChartStore } from "../../zustand/ChartStore.ts";

// 생년월일을 이용해 나이 계산 (간단한 예시)
const calculateAge = (birth: string): string => {
  const birthDate = new Date(Number(birth));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age + "세";
};

const PatientInfo: React.FC = () => {
  const chartStore = useChartStore();
  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      {/* 헤더 영역: 컬럼 수를 9개로 지정 */}
      <div className="grid grid-cols-9 gap-1 bg-gray-50 p-3 rounded-t-lg border-b">
        <div className="text-xs font-medium text-gray-600">환자명</div>
        <div className="text-xs font-medium text-gray-600">동물 종류</div>
        <div className="text-xs font-medium text-gray-600">품종</div>
        <div className="text-xs font-medium text-gray-600">나이</div>
        <div className="text-xs font-medium text-gray-600">성별</div>
        <div className="text-xs font-medium text-gray-600">보호자명</div>
        <div className="text-xs font-medium text-gray-600">진료일</div>
        <div className="text-xs font-medium text-gray-600">수납금액</div>
        <div className="text-xs font-medium text-gray-600">상태</div>
      </div>
      {/* 내용 영역: 컬럼 수를 9개로 지정 */}
      <div className="grid grid-cols-9 gap-1 p-3 items-center text-sm">
        <div>{chartStore.petName}</div>
        <div>{chartStore.petSpecies}</div>
        <div>{chartStore.petBreed}</div>
        <div>{calculateAge(chartStore.petBirth)}</div>
        <div>{chartStore.petGender}</div>
        <div>{chartStore.userName}</div>
        {/* 진료일은 별도 정보가 없다면 오늘 날짜 적용 */}
        <div>{new Date().toISOString().split("T")[0]}</div>
        {/* 수납금액 정보가 없을 경우, 필요 시 관련 데이터를 추가 */}
        <div>{"-"}</div>
        <div>{chartStore.petStatus}</div>
      </div>
    </div>
  );
};

export default PatientInfo;
