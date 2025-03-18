import React, { useState, useEffect } from "react";
import axios from "axios";
import HospitalAdd from "./HospitalAdd";
import HospitalLayout from "./HospitalLayout";
import { HospitalPet } from "../Types/HospitalPet";
import Calendar from "react-calendar";

const SERVER_URL = "http://localhost:7124/back/api/hospital";

const Hospital: React.FC = () => {
  const [patients, setPatients] = useState<HospitalPet[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dayList, setDayList] = useState<string[]>([]);
  const [day, setDay] = useState('');
  const today = new Date();

  // 환자 데이터 불러오기 (전체 데이터를 다시 불러옴)
  const fetchPatients = async (selectDay: string) => {

    console.log("선택한 날:", selectDay);

    try {
      const response = await axios.get(`${SERVER_URL}/date/${selectDay}`);
      console.log(" 선택한 날의 입원 환자들 :", response.data);

      // 퇴원 상태가 아닌 환자만 필터링
      const activePatients = response.data.filter(
        (patient: HospitalPet) => patient.hospitalStatus !== "퇴원"
      );
      setPatients(activePatients);
      console.log("업데이트된 환자 데이터:", activePatients);
    } catch (error) {
      console.error(" 데이터 불러오기 실패:", error);
    }
  };


  const getHospitalHistorydate = async () => {
    try {

      const response = await axios.get<string[]>(`http://localhost:7124/back/api/hospital/date`);

      setDayList(response.data);
      setDay(response.data[response.data.length - 1]);
      console.log(response.data[response.data.length - 1]);

    } catch (error) {
      console.error('네트워크 오류:', error);
      return '네트워크 오류';
    }
  };

  useEffect(() => {
    getHospitalHistorydate();
  }, []);

  useEffect(() => {
    fetchPatients(day);
  }, [day])

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g,"-") // 'yyyy. mm. dd.' → 'yyyy-mm-dd'
      .replace(".", ""); // 마지막 점 제거
  };


  const handleDateChange = (date: Date) => {
    const formattedDate = formatDate(date);
    if (dayList.includes(formattedDate)) {
      setDay(formattedDate);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-16 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 왼쪽: 입원 스케줄 목록 */}
        <div className="lg:col-span-1 bg-white shadow-md rounded-lg p-6 border border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
            <span className="text-teal-600 mr-2">◢</span>입원 스케줄
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-[100%]">
            <Calendar
              onChange={(date) => handleDateChange(date as Date)}
              tileDisabled={({ date }) => !dayList.includes(formatDate(date))}
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const dateStr = formatDate(date);
                  if (dateStr === formatDate(today)) {
                    return "relative bg-white text-red-500 font-bold before:content-[''] before:absolute before:inset-0 before:border-2 before:border-red-500 before:rounded-full";
                  }
                  if (dateStr === day) {
                    return "bg-red-500 bg-opacity-30 text-gray-900 rounded-lg";
                  }
                }
                return "";
              }}
            />
            {day && (
              <p className="text-lg font-semibold mt-4 text-gray-800">선택한 날짜: {day}</p>
            )}
          </div>
          <div className="divide-y divide-gray-200 max-h-[800px] overflow-y-scroll">
            {patients.map((patient, index) => (
              <div
                key={index}
                className="py-4 px-4 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition flex flex-col"
              >
                <p className="text-xl font-bold text-gray-800 mb-1">
                  {patient.hospitalStartTime}
                </p>
                <p className="text-gray-700 font-medium">
                  환자: {patient.petName || "정보 없음"} (
                  {patient.petSpecies || "정보 없음"})
                </p>
                <p className="text-gray-700">
                  보호자: {patient.userName || "정보 없음"}
                </p>
                <p className="text-gray-700">
                  주치의: {patient.managerName || "정보 없음"}
                </p>
                <p className="text-gray-700">
                  품종: {patient.petBreed || "정보 없음"}
                </p>
                <p className="text-gray-700">
                  입원실: {patient.hospitalRoom}번
                </p>
                <p className="text-gray-700">
                  특이사항: {patient.hospitalMemo || "정보 없음"}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="mt-4 w-full px-4 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm"
          >
            + 환자 추가
          </button>
        </div>
        {/* 오른쪽: 입원실 현황 */}
        <div className="lg:col-span-2">
          <HospitalLayout />
        </div>
      </div>
      {isPopupOpen && (
        <HospitalAdd
          onClose={() => setIsPopupOpen(false)}
          onScheduleAdded={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default Hospital;
