import React, { useState, useEffect } from 'react';
import EventForm from "./EventForm";

// CalendarComponent 임포트 추가 (날짜 클릭 처리)
import CalendarComponent from './CalendarComponent';

const MedicalSchedule: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // 페이지 로드 시 현재 날짜 설정
    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜
        setSelectedDate(currentDate);
    }, []);

    // 날짜 클릭 시 선택된 날짜 상태 업데이트
    const handleDateClick = (date: string) => {
        setSelectedDate(date);
    };

    // 이벤트 저장 함수
    const handleSaveEvent = (eventData: { title: string; start: string; end: string; color: string }) => {
        setEvents((prevEvents) => [
            ...prevEvents,
            {
                title: eventData.title,
                start: eventData.start,
                end: eventData.end,
                color: eventData.color,
            },
        ]);
    };

    return (
        <div className="flex">
            <div className="w-2/3">
                {/* CalendarComponent에 날짜 클릭 처리 전달 */}
                <CalendarComponent onDateClick={handleDateClick} selectedDate={selectedDate} events={events} />
            </div>
            <div className="w-1/3 p-4 bg-white shadow-lg rounded-lg ml-4 mt-4 mr-4">
                <h2 className="text-xl font-bold mb-4">예정된 일정을 추가해 주세요.</h2>

                {/* EventForm을 이벤트 저장 함수와 연결 */}
                <EventForm onSave={handleSaveEvent} />
            </div>
        </div>
    );
};

export default MedicalSchedule;
