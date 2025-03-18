import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReservationIng from "./components/ReservationIng";

const DateTimeSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 단계에서 받은 데이터 (진료과, 의사, 펫 정보까지 유지)
  const { department, pet, note, doctor } = location.state || {};
  console.log(department, pet, note, doctor);
  // 로그 추가 (데이터 정상적으로 받아왔는지 확인)
  useEffect(() => {
    // console.log("DateTimeSelection 페이지 렌더링됨!");
    console.log("전달받은 데이터:", { department, pet, note, doctor });
  }, [pet, note, doctor]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // 연도 변경 핸들러
  const handleYearChange = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearDropdown(false); // 선택 후 드롭다운 닫기
  };

  // 월 변경 핸들러
  const handleMonthChange = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setShowMonthDropdown(false); // 선택 후 드롭다운 닫기
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // 오늘 날짜의 시간을 00:00:00으로 설정하여 날짜만 비교

    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const prevLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const daysInMonth = lastDay.getDate();
    const prevDays = firstDay.getDay();
    const nextDays = 42 - (prevDays + daysInMonth);

    const calendarDays = [];

    // 이전 달 날짜 비활성화
    for (let i = prevDays; i > 0; i--) {
      calendarDays.push({ day: prevLastDay.getDate() - i + 1, month: "prev" });
    }

    // 이번 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);

      // 날짜 비교: 시간을 00:00:00으로 설정하고 오늘 날짜와 비교
      const isDisabled = date.setHours(0, 0, 0, 0) < today.getTime();  // 오늘 이전 날짜는 비활성화

      calendarDays.push({
        day: i,
        month: "current",
        disabled: isDisabled,
      });
    }

    // 다음 달 날짜 비활성화
    for (let i = 1; i <= nextDays; i++) {
      calendarDays.push({ day: i, month: "next" });
    }

    return calendarDays;
  };


  const availableTimes = {
    오전: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
    오후: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  };

  // 현재 날짜 이후의 시간만 표시
  const getFilteredTimes = (times: string[], selectedDate: string | null) => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // 현재 시간을 분 단위로 변환

    // selectedDate와 비교하여 날짜별로 시간이 다르게 필터링되도록 수정
    const isToday = selectedDate === `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

    return times.filter((time) => {
      const [hour, minute] = time.split(":").map(Number);
      const timeInMinutes = hour * 60 + minute;

      if (isToday) {
        return timeInMinutes > currentTimeInMinutes;  // 오늘 날짜인 경우, 현재 시간 이후의 시간만 표시
      } else {
        return true;  // 오늘이 아니면 모든 시간대 표시
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-5 bg-white mb-20">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-left mb-4">인터넷 진료예약 확인</h1>
      <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

      <ReservationIng check={false} />

      {/* 진행 단계 표시 */}
      <div className="flex justify-center items-center mb-10">
        {[
          { name: "진료과 선택", icon: "📅", path: "/department_selection" },
          { name: "의료진 선택", icon: "👨‍⚕️", path: "/select_doctor" },
          { name: "나의 펫 선택", icon: "🐾", path: "/animal_selection" },
          { name: "진료일/시 선택", icon: "✓", path: "/select_datetime", active: true },
          { name: "진료예약 확인", icon: "📝" }
        ].map((step, index) => (
          <React.Fragment key={index}>
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (step.path) {
                  navigate(step.path, {
                    state: { department, pet, note, doctor }
                  });
                }
              }}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full 
                    ${step.active ? "bg-green-500 text-white" : "bg-gray-300 text-white"}`}>
                {step.icon}
              </div>
              <p className={`mt-2 ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
            {index < 4 && <div className="w-16 h-0.5 bg-gray-300 relative -top-3"></div>}
          </React.Fragment>
        ))}
      </div>


      {/* 진료일 및 시간 선택 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 진료일 선택 */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-12">진료일 선택</h3>
          <div className="flex justify-between items-center mb-4 relative">
            <button onClick={prevMonth} className="text-gray-500 hover:text-black">{"<"}</button>

            {/* 연도 및 월 선택 (드롭다운 추가) */}
            <div className="flex gap-3 relative">
              {/* 연도 선택 */}
              <div className="relative">
                <button
                  className="text-lg font-bold px-2"
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false); // 연도 선택 시 월 드롭다운 닫기
                  }}
                >
                  {currentMonth.getFullYear()}년
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded z-10 w-24 text-center max-h-48 overflow-y-auto">
                    {Array.from({ length: 30 }, (_, index) => currentMonth.getFullYear() - 15 + index).map((yr) => (
                      <button
                        key={yr}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                        onClick={() => handleYearChange(yr)}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 월 선택 */}
              <div className="relative">
                <button
                  className="text-lg font-bold px-2"
                  onClick={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false); // 월 선택 시 연도 드롭다운 닫기
                  }}
                >
                  {currentMonth.getMonth() + 1}월
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded z-10 w-24 text-center max-h-48 overflow-y-auto">
                    {Array.from({ length: 12 }, (_, index) => index).map((m) => (
                      <button
                        key={m}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                        onClick={() => handleMonthChange(m)}
                      >
                        {m + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button onClick={nextMonth} className="text-gray-500 hover:text-black">{">"}</button>
          </div>

          <div className="grid grid-cols-7 text-center text-gray-700 font-semibold">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <span key={day} className="py-2">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {generateCalendar().map((date, index) => (
              <button
                key={index}
                className={`py-2 rounded-md 
        ${date.month === "current" ?
                    selectedDate === `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                    : "text-gray-400"} 
        ${date.disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                disabled={date.disabled}
                onClick={() => setSelectedDate(`${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`)}
                style={date.disabled ? {
                  backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0%, transparent 4px, rgba(0, 0, 0, 0.25) 1px, rgba(0, 0, 0, 0.1) 5px)'
                } : {}}
              >
                {date.day}
              </button>
            ))}
          </div>
        </div>

        {/* 진료시간 선택 */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">진료시간 선택</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(availableTimes).map(([period, times]) => {
                const filteredTimes = getFilteredTimes(times, selectedDate);  // 날짜별로 시간 필터링

                return (
                  <div key={period} className="bg-white rounded-lg overflow-y-auto max-h-56 p-3 shadow-sm">
                    <h4 className="text-md font-semibold text-gray-700 mb-2 text-center border-b pb-2">{period}</h4>

                    {/* 필터링된 시간이 없으면 마감 문구 출력 */}
                    {filteredTimes.length === 0 ? (
                      <p className="text-red-500 text-center">예약이 마감되었습니다.</p>
                    ) : (
                      filteredTimes.map((time) => (
                        <button
                          key={time}
                          className={`w-full py-2 text-center rounded-md mb-1 ${selectedTime === time ? "bg-green-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* 선택된 진료일/시간 (오른쪽 정렬) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">선택한 진료일/시</h3>
            <p className="text-gray-700 font-semibold">
              📅 진료일: {selectedDate || "날짜 선택"} <br />
              ⏰ 진료시간: {selectedTime || "시간 선택"}
            </p>
          </div>

          {/* 선택된 진료일/시간 확인 후 예약 버튼 클릭 시 데이터 전송 */}
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md mt-4 w-full hover:bg-green-600"
            disabled={!selectedDate || !selectedTime}
            onClick={() => {

              navigate("/confirm_reservation", {
                state: {
                  department,
                  time: { selectedDate, selectedTime },
                  pet,
                  note,
                  doctor
                }
              });
            }}
          >
            선택된 진료일/시로 예약하기
          </button>

        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
