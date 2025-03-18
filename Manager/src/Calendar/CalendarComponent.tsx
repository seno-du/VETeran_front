import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { useChartStore } from "../zustand/ChartStore.ts";


interface Event {
    title: string;
    start: string;
    end: string;
    description: string;
    id: string;
}

interface CalendarComponentProps {
    onDateClick: (date: string) => void;
    selectedDate: string;
    managerNum: number;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateClick, selectedDate }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = sessionStorage.getItem("accessToken");
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:7124/back/api/calendar/list',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 삽입
                        },
                    });
                const eventsData = response.data.map((event: any) => ({
                    title: event.calendarTitle,
                    start: new Date(event.calendarStartTime).toISOString(),
                    end: new Date(event.calendarEndTime).toISOString(),
                    description: event.calendarMemo || '상세 내용 없음',
                    id: event.calendarNum.toString(),
                }));
                setEvents(eventsData);
            } catch (error) {
                console.error("이벤트를 불러오는 중에 오류가 발생했습니다:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleDayClick = (arg: any) => {
        console.log('📅 클릭한 날짜:', arg.dateStr);
        onDateClick(arg.dateStr);

        const clickedDateEvents = events.filter((event) => {
            const eventDate = event.start.split('T')[0];
            return eventDate === arg.dateStr;
        });

        setSelectedEvents(clickedDateEvents);
        setIsModalOpen(true);
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return '00:00'; // 날짜만 있는 경우 기본값
        }
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <div className="p-5 bg-gray-50 mt-2">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-xl relative z-10">
                <FullCalendar
                    height="auto"
                    contentHeight={600}
                    aspectRatio={1.35}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="ko"
                    events={events}
                    initialDate={selectedDate || new Date().toISOString().split('T')[0]}
                    dayHeaderFormat={{ weekday: 'long' }}
                    dayCellContent={(args) => {
                        const cleanDay = args.dayNumberText.replace(/^0/, '').replace('일', '');
                        return { html: `${cleanDay}` };
                    }}
                    dayCellClassNames={() => 'cursor-pointer'}
                    dateClick={handleDayClick}
                    eventContent={(arg) => {
                        const eventsForDate = events.filter(
                            (event) => event.start.split('T')[0] === arg.event.startStr
                        );
                        const index = eventsForDate.findIndex((e) => e.id === arg.event.id);

                        if (eventsForDate.length > 3) {
                            if (index >= 3) {
                                return { domNodes: [] }; // 4번째 일정부터 숨김
                            }
                        }

                        return { domNodes: [document.createTextNode(arg.event.title)] };
                    }}
                    eventClassNames={[] /* 기본 스타일링 제거 */}
                />
            </div>

            {/* 모달 창 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">📅 상세 일정</h2>
                        {selectedEvents.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedEvents.map((event) => (
                                    <li key={event.id} className="p-3 border rounded-lg shadow-md bg-gray-100">
                                        <h3 className="font-semibold text-lg">{event.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            🕒 {formatTime(event.start)} ~ {formatTime(event.end)}
                                        </p>
                                        <p className="text-sm">{event.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">📭 일정이 없습니다.</p>
                        )}
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600"
                            onClick={() => setIsModalOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
