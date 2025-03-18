import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 스타일 추가
import ReservationGrid from "./ReservationGrid";

const CalendarSection: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<"morning" | "afternoon">("morning"); // 오전/오후 선택

    // 날짜 변경 핸들러
    const handleDateChange = (date: Date | null) => {
        if (date) {
            const localDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
            setSelectedDate(localDate);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3"> {/* flex로 날짜 선택과 버튼을 수평 정렬 */}
                <h3 className="text-sm font-semibold text-gray-700 mr-4"> {/* mr-4로 여백 추가 */}
                    <span className="text-teal-600 mr-1">◢</span> 예약 날짜 선택
                </h3>

                {/* 오전/오후 버튼을 오른쪽으로 이동시키기 위해 ml-auto 추가 */}
                <div className="flex ml-auto"> 
                    <button 
                        className={`px-4 py-2 mr-2 rounded ${selectedTimeSlot === "morning" ? "bg-teal-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectedTimeSlot("morning")}
                    >
                        오전
                    </button>
                    <button 
                        className={`px-4 py-2 rounded ${selectedTimeSlot === "afternoon" ? "bg-teal-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectedTimeSlot("afternoon")}
                    >
                        오후
                    </button>
                </div>
            </div>

            {/* 캘린더 & 예약 그리드 가로 정렬 */}
            <div className="flex gap-4">
                {/* 캘린더 */}
                <div className="w-1/3">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        locale="ko-KR"
                        className="w-full border-none shadow-none"
                        formatShortWeekday={(_, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
                        formatDay={(_, date) => date.getDate()}
                    />
                </div>

                {/* 예약 테이블 */}
                <div className="w-2/3">
                    <ReservationGrid selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} />
                </div>
            </div>
        </div>
    );
};

export default CalendarSection;
