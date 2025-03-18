import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import CalendarSection from "./component/CalendarSection";
import ReservationRequest from './component/ReservationRequest';
import axios from 'axios';

const Reservation: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());  // 선택된 날짜 상태
    const [dailyReserve, setDailyReserve] = useState<number>(0)
    const [weeklyReserve, setWeeklyReserve] = useState<number>(0)
    const [monthReserve, setMonthReserve] = useState<number>(0)

    // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];  // '2025-03-05' 형식
    }

    const fetchDailyReserve = async () => {
        try {
            const formattedDate = formatDate(selectedDate); // 선택된 날짜를 'YYYY-MM-DD' 형식으로 변환
            const response = await axios.get(`http://localhost:7124/back/api/reserve/count/daily?targetDate=${formattedDate}`);
            setDailyReserve(response.data);  // 서버에서 반환된 데이터에서 count를 사용
            console.log(formattedDate);
            console.log(response.data, "일일 데이터");
        } catch (error) {
            console.log(error, "일일 데이터 못 불러옴");
            console.log(selectedDate);
        }
    }
    fetchDailyReserve();

    const fetchmonthReserve = async () => {
        try {
            const formattedDate = formatDate(selectedDate); // 선택된 날짜를 'YYYY-MM-DD' 형식으로 변환
            const response = await axios.get(`http://localhost:7124/back/api/reserve/count/month?targetDate=${formattedDate}`);
            setMonthReserve(response.data);  // 서버에서 반환된 데이터에서 count를 사용
            console.log(formattedDate);
            console.log(response.data, "일일 데이터");
        } catch (error) {
            console.log(error, "월간 데이터 못 불러옴");
            console.log(selectedDate);
        }
    }
    fetchmonthReserve();
    const fetchWeeklyReserve = async () => {
        try {
            const formattedDate = formatDate(selectedDate); // 선택된 날짜를 'YYYY-MM-DD' 형식으로 변환
            const response = await axios.get(`http://localhost:7124/back/api/reserve/count/weekly?targetDate=${formattedDate}`);
            setWeeklyReserve(response.data);  // 서버에서 반환된 데이터에서 count를 사용
            console.log(formattedDate);
            console.log(response.data, "일일 데이터");
        } catch (error) {
            console.log(error, "주간 데이터 못 불러옴");
            console.log(selectedDate);
        }
    }
    fetchWeeklyReserve();



    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-grow p-4 pb-24">
                <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <CalendarSection
                            selectedDate={selectedDate}  // 선택된 날짜를 전달
                            setSelectedDate={setSelectedDate}  // 날짜 변경 시 setSelectedDate 호출  
                        />
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                                <span className="text-teal-600 mr-1">◢</span> 예약 통계
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">금일 예약</p>
                                    <p className="text-lg font-semibold text-teal-600">{dailyReserve}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">이번 주 예약</p>
                                    <p className="text-lg font-semibold text-teal-600">{weeklyReserve}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">이번 달 예약</p>
                                    <p className="text-lg font-semibold text-teal-600">{monthReserve}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ReservationRequest />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;
