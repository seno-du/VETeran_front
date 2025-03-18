import React, { useState } from 'react';
import axios from 'axios';

interface EventFormProps {
    onSave: (eventData: { title: string; start: string; end: string; memo: string }) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSave }) => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식
    const formattedTime = now.toTimeString().slice(0, 5); // HH:MM 형식
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(formattedDate);
    const [startTime, setStartTime] = useState(formattedTime);
    const [endTime, setEndTime] = useState(formattedTime);
    const [memo, setMemo] = useState('');
    const token = sessionStorage.getItem("accessToken");

    
    // 저장 핸들러
    const handleSave = async () => {
        const start = `${date} ${startTime}:00`;  // 'T' 대신 공백 추가
        const end = `${date} ${endTime}:00`;  // 'T' 대신 공백 추가
        
        console.log(start,"시작시간")
        console.log(end,"끝시간")

        if (new Date(start) > new Date(end)) {
            alert('종료 시간이 시작 시간보다 이전일 수 없습니다.');
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:7124/back/api/calendar/add",
                {
                    calendarTitle: title,
                    calendarStartTime: start,
                    calendarEndTime: end,
                    calendarMemo: memo
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 삽입
                    },
                }
            );
            console.log("응답 데이터", response.data);
            onSave({ title, start, end, memo });
    
            setTitle('');
            setDate(formattedDate);
            setStartTime(formattedTime);
            setEndTime(formattedTime);
            setMemo('');
            console.log(response.data, "저장 데이터")
            if (response.status === 200 || (response.data && response.data.success)) {
                alert('입력이 완료되었습니다.');
                window.location.reload();
            } else {
                alert('입력하지 않은 값이 있습니다.');
            }
        } catch (error) {
            console.error(error);
            if (error) {
                console.error("서버 오류 응답:", error); // 서버 응답 로그 확인
            }
            alert('저장 중 오류가 발생했습니다.');
        }
    };
    
    

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-body p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">제목</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">날짜</label>
                                <input
                                    type="date"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">시작 시간</label>
                                <input
                                    type="time"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">종료 시간</label>
                                <input
                                    type="time"
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">내용</label>
                            <input
                                type="text"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="내용을 입력하세요"
                            />
                        </div>
                    </div>
                    <div className="modal-footer bg-white-100 p-4 rounded-b-lg flex justify-end">
                        <button type="button" className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md" data-bs-dismiss="modal">
                            닫기
                        </button>
                        <button type="button" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md ml-2" onClick={handleSave}>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventForm;
