import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TossPay from '../tosspay/TossPay';
import axios from 'axios';

interface Reserve {
    reserveNum: number;
    petNum: number;
    managerNum: number;
    reserveStatus: string;
    reserveDate: Date;
    reserveNotice: string;
    reserveError: number
}

interface PageDTO {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

const doctors = {
    internal: [
        {
            id: 1, name: "김진헌", specialization: ["예방접종", "내과 진료"], photo: "../public/images/김진헌.png", workingDays: [1, 4]
        },
        { id: 2, name: "최재성", specialization: ["예방접종", "내과 진료"], photo: "../public/images/최재성.png", workingDays: [0, 5] },
        { id: 3, name: "이정우", specialization: ["예방접종", "내과 진료"], photo: "../public/images/이정우.png", workingDays: [3, 6] },
        { id: 4, name: "김경민", specialization: ["예방접종", "내과 진료"], photo: "../public/images/김경민.png", workingDays: [1, 4] },
    ],
    surgery: [
        { id: 1, name: "정윤호", specialization: ["수술", "응급처치"], photo: "../public/images/정윤호.png", workingDays: [1, 3] },
        { id: 2, name: "지나은", specialization: ["수술", "응급처치"], photo: "../public/images/지나은.png", workingDays: [2, 0] },
        { id: 3, name: "정효진", specialization: ["수술", "응급처치"], photo: "../public/images/정효진.png", workingDays: [5, 6] },
        { id: 4, name: "김채린", specialization: ["수술", "응급처치"], photo: "../public/images/김채린.png", workingDays: [3, 6] },
    ],
};

const pets = [
    { id: 1, name: "토토", breedType: "강아지", detailedBreed: "푸들", age: 3, photo: "../public/images/터엉모코코.jpg", },
    { id: 2, name: "콩이", breedType: "강아지", detailedBreed: "시츄", age: 2, photo: "../public/images/터엉모코코.jpg", },
    { id: 3, name: "복실이", breedType: "강아지", detailedBreed: "골든 리트리버", age: 4, photo: "../public/images/터엉모코코.jpg", },
    { id: 4, name: "두리", breedType: "고양이", detailedBreed: "러시안 블루", age: 2, photo: "../public/images/터엉모코코.jpg", },
    { id: 5, name: "루비", breedType: "고양이", detailedBreed: "스코티시 폴드", age: 1, photo: "../public/images/터엉모코코.jpg", },
];


const Reservation: React.FC = () => {
    //===========================================================================================================================
    const [selectedDepartment, setSelectedDepartment] = useState<'internal' | 'surgery' | 'all' | null>('all'); // 의사 상태
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // 선택된 의사 객체 (의사가 선택되지 않은 초기 상태는 null)
    const [step, setStep] = useState<1 | 2 | 3>(1); // 진행상황
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // 선택된 예약 날짜 (선택되지 않은 초기 상태는 null)
    const [selectedMorning, setSelectedMorning] = useState<string | null>(null); // 선택된 오전 예약 시간 (문자열, 예: '09:00 AM'; 초기 상태는 null)
    const [selectedAfternoon, setSelectedAfternoon] = useState<string | null>(null); // 선택된 오후 예약 시간 (문자열, 예: '02:00 PM'; 초기 상태는 null)
    const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | null>(null); // 오전 오후 상태
    const [currentPage, setCurrentPage] = useState(1); // 의사 페이징 처리
    const doctorsPerPage = 4; // 한 페이지에 표시할 의사 수
    const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]); // 선택된 펫의 ID 배열 (여러 마리 선택 가능; 초기 상태는 빈 배열)
    const [currentPetIndex, setCurrentPetIndex] = useState<number>(0); // 현재 선택된 펫의 인덱스 (선택된 펫들 중 현재 표시 중인 펫의 위치)
    const currentPetId = selectedPetIds[currentPetIndex]; // 선택된 펫 ID
    const currentPet = pets.find((pet) => pet.id === currentPetId); // 현재 표시 중인 펫 객체 (선택된 펫 배열에서 현재 인덱스에 해당하는 펫)
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]); // 선택된 증상 배열 (사용자가 체크한 증상 목록; 초기 상태는 빈 배열)
    const allDoctors = [...doctors.internal, ...doctors.surgery]; // 모든 의사 목록 (내과 의사와 외과 의사 배열을 결합한 전체 리스트)
    const [goPayment, setGoPayment] = useState(false);
    const [isConfirmClickable, setIsConfirmClickable] = useState(true); // 예약 확인 기능 상태
    //===========================================================================================================================
    const [reserveList, setreserveList] = useState<Reserve[]>([]); // 예약 목록(second)


    const getReserveList = async (page: number) => {
        try {
            const response = await axios.get<Reserve[]>(`http://localhost:7124/back/api/reserve/all?page=${page}`);
            // console.log(response.data)
        } catch {
            // console.log("Axions에러 다시해라");
        }
    }

    useEffect(() => {
        getReserveList(currentPage);
    }, [currentPage]);

    const symptoms = ["기침", "발열", "구토", "설사", "피로", "식욕 감소", "기타"];
    const dayMap = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());

    const handleDepartmentSelect = (department: 'internal' | 'surgery' | 'all') => {
        setSelectedDepartment(department);
        setSelectedDoctor(null); // 의사 선택 초기화
        setCurrentPage(1); // 페이지 초기화
    };

    const getDoctorsForCurrentPage = () => {
        const startIndex = (currentPage - 1) * doctorsPerPage;
        const endIndex = startIndex + doctorsPerPage;
        return allDoctors.slice(startIndex, endIndex);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleNextStep = () => {
        if (selectedDoctor && selectedDate && (selectedMorning || selectedAfternoon)) {
            setStep(3);
        }
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (time: string, period: 'morning' | 'afternoon') => {
        if (period === 'morning') {
            setSelectedMorning(time);
        } else {
            setSelectedAfternoon(time);
        }
    };

    const handleBackToDoctorSelect = () => {
        setStep(1);  // 의사 선택 화면으로 돌아감
    };

    const handleBackToDateSelect = () => {
        setStep(2);  // 예약 날짜 선택 화면으로 돌아감
        setGoPayment(false);
    };

    // 30분 간격의 시간 리스트 생성
    const generateTimeSlots = (period: 'morning' | 'afternoon') => {
        const timeSlots: string[] = [];
        if (period === 'morning') {
            const startTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
            startTimes.forEach(time => timeSlots.push(time));
        } else {
            const startTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
            startTimes.forEach(time => timeSlots.push(time));
        }
        return timeSlots;
    };

    const handlePetToggle = (petId: number) => {
        setSelectedPetIds((prevSelected) =>
            prevSelected.includes(petId)
                ? prevSelected.filter((id) => id !== petId)
                : [...prevSelected, petId]
        );
    };

    const handleSymptomToggle = (symptom: string) => {
        setSelectedSymptoms((prev) =>
            prev.includes(symptom)
                ? prev.filter((item) => item !== symptom)
                : [...prev, symptom]
        );
    };
    const dayToKorean = (day: number) => {
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return days[day];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
            <div className="container mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-center text-teal-600 mb-8">진료 예약</h1>

                {step === 1 && (
                    <>
                        <div className="flex justify-center space-x-4 mb-8">
                            <button
                                className={`px-6 py-3 rounded-lg shadow-md ${selectedDepartment === "all"
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`} onClick={() => handleDepartmentSelect('all')}
                            >
                                전체
                            </button>

                            <button
                                className={`px-6 py-3 rounded-lg shadow-md ${selectedDepartment === "internal"
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                onClick={() => handleDepartmentSelect('internal')}
                            >
                                내과
                            </button>
                            <button
                                className={`px-6 py-3 rounded-lg shadow-md ${selectedDepartment === "surgery"
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                onClick={() => handleDepartmentSelect("surgery")}
                            >
                                외과
                            </button>
                        </div>

                        {selectedDepartment && (
                            <div>
                                <h2 className="text-2xl font-semibold text-center mb-4">
                                    {selectedDepartment === 'all' ? '전체 의사' : selectedDepartment === 'internal' ? '내과 의사' : '외과 의사'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {getDoctorsForCurrentPage().map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-1 ${selectedDoctor?.id === doctor.id ? "border-2 border-teal-400" : ""
                                                }`}
                                            onClick={() => handleDoctorSelect(doctor)}
                                        >
                                            <img
                                                src={doctor.photo}
                                                alt={doctor.name}
                                                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-teal-200"
                                            />
                                            <h3 className="text-xl font-semibold text-center text-gray-800">{doctor.name}</h3>
                                            <ul className="text-sm text-gray-600 text-center mt-2">
                                                {doctor.specialization.map((specialty, index) => (
                                                    <li key={index}>{specialty}</li>
                                                ))}
                                            </ul>
                                            <p className="text-sm text-gray-500 text-center mt-2">
                                                근무 요일: {doctor.workingDays.map((day) => dayMap[day]).join(", ")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {selectedDepartment === 'all' && (
                                    <div className="flex justify-center mt-6 items-center space-x-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-lg ${currentPage === 1
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            이전
                                        </button>
                                        <span className="px-4 py-2 text-lg font-semibold text-teal-600">
                                            {currentPage}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage * doctorsPerPage >= allDoctors.length}
                                            className={`px-4 py-2 rounded-lg ${currentPage * doctorsPerPage >= allDoctors.length
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-gray-200 hover:bg-gray-300"
                                                }`}
                                        >
                                            다음
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedDoctor && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    다음 단계
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <div>
                            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                                날짜 및 시간 선택
                            </h2>
                            <div className="flex flex-col md:flex-row md:space-x-8 bg-white p-6 rounded-lg shadow-lg">
                                {/* 캘린더 */}
                                <div className="flex flex-col items-center justify-center w-full md:w-1/2 mt-8 md:mt-0">
                                    <h3 className="text-lg font-semibold mb-6 text-gray-700 flex justify-center">날짜 선택</h3>
                                    {/* 다른 내용 */}
                                    <Calendar
                                        onChange={(value) => handleDateChange(value as Date)}
                                        value={selectedDate}
                                        locale="ko-KR"
                                        calendarType="gregory"
                                        formatShortWeekday={(_, date) =>
                                            ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                                        }
                                        formatDay={(_, date) => `${date.getDate()}`}
                                        tileDisabled={({ date, view }) => {
                                            if (view === "month") {
                                                const isBeforeToday = date < new Date(new Date().setHours(0, 0, 0, 0));
                                                const isWorkingDay =
                                                    selectedDoctor?.workingDays.includes(date.getDay()) ?? false;

                                                return isBeforeToday || !isWorkingDay;
                                            }
                                            return false;
                                        }}
                                        minDate={today}
                                        maxDate={maxDate}
                                        className="border border-gray-200 rounded-2xl shadow-xl px-4 py-4 bg-white"
                                    />
                                </div>
                                {/* 예약 가능한 시간 */}
                                {selectedDate && (
                                    <div className="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
                                        <h3 className="text-lg font-semibold mb-6 text-gray-700">시간 선택</h3>

                                        {/* 오전/오후 버튼 */}
                                        <div className="flex space-x-4 justify-center mb-6">
                                            <button
                                                onClick={() => setSelectedPeriod("morning")}
                                                className={`px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 duration-200 ${selectedPeriod === "morning"
                                                    ? "bg-teal-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                오전
                                            </button>
                                            <button
                                                onClick={() => setSelectedPeriod("afternoon")}
                                                className={`px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 duration-200 ${selectedPeriod === "afternoon"
                                                    ? "bg-teal-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                오후
                                            </button>
                                        </div>

                                        {/* 시간대 선택 */}
                                        {selectedPeriod && (
                                            <div className="grid grid-cols-3 gap-4 w-full">
                                                {(selectedPeriod === "morning"
                                                    ? generateTimeSlots("morning")
                                                    : generateTimeSlots("afternoon")
                                                ).map((time) => {
                                                    const now = new Date();
                                                    const [hour, minute] = time.split(":").map(Number);
                                                    const timeDate = new Date();
                                                    timeDate.setHours(hour, minute, 0, 0);

                                                    // 선택된 날짜와 오늘 날짜가 같은지 비교
                                                    const isToday = selectedDate.toDateString() === now.toDateString();

                                                    // 오늘일 경우, 2시간 뒤부터 예약 가능, 오늘이 아니면 전부 예약 가능
                                                    const twoHoursLater = new Date(now.getTime() + 60 * 60 * 1000 * 2);
                                                    const isDisabled = isToday && timeDate < twoHoursLater;

                                                    return (
                                                        <button
                                                            key={time}
                                                            onClick={() => handleTimeSelect(time, selectedPeriod)}
                                                            disabled={isDisabled}
                                                            className={`px-4 py-2 text-sm rounded-lg shadow-md transition transform hover:scale-105 duration-200
                    ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : selectedPeriod === "morning"
                                                                    ? selectedMorning === time
                                                                        ? "bg-teal-500 text-white"
                                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                    : selectedAfternoon === time
                                                                        ? "bg-teal-500 text-white"
                                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>


                        {/* 펫 선택 및 증상 입력 */}
                        <div className="mt-12 bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold mb-6 text-gray-800 text-center relative">
                                나의 펫 선택하기
                                {selectedDate && (
                                    <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                                        {selectedDate.toLocaleDateString("ko-KR")} (
                                        {dayToKorean(selectedDate.getDay())})
                                    </span>
                                )}
                            </h3>

                            {/* 펫 리스트 및 선택된 펫 정보 */}
                            <div className="flex flex-wrap md:flex-nowrap gap-8 justify-center items-start p-4 bg-gray-50 rounded-lg shadow-lg">
                                {/* 펫 리스트 */}
                                <div className="flex flex-wrap md:flex-col justify-center gap-4 md:w-1/3">
                                    {pets.map((pet) => (
                                        <button
                                            key={pet.id}
                                            type="button"
                                            onClick={() => handlePetToggle(pet.id)}
                                            className={`flex items-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg border transition transform hover:scale-105 duration-200 ${selectedPetIds.includes(pet.id)
                                                ? "bg-teal-500 text-white border-teal-500 shadow-md"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                                                }`}
                                        >
                                            <img
                                                src={pet.photo}
                                                alt={pet.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            {pet.name}
                                            {pet.breedType === "강아지" ? (
                                                <span className="text-gray-500 text-xs ml-auto">🐶</span>
                                            ) : (
                                                <span className="text-gray-500 text-xs ml-auto">🐱</span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* 선택된 펫 정보 */}
                                {selectedPetIds.length === 0 ? (
                                    <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white md:w-2/3 text-center text-gray-500">
                                        펫을 선택해주세요 🐾
                                    </div>
                                ) : currentPet && (
                                    <div className="p-6 border border-gray-200 rounded-lg shadow-md bg-white md:w-2/3">
                                        <img
                                            src={currentPet.photo}
                                            alt={currentPet.name}
                                            className="w-full h-48 object-cover rounded-md mb-4"
                                        />
                                        <h4 className="text-xl font-semibold text-gray-800 mb-2">{currentPet.name}</h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>견종/묘종:</strong> {currentPet.breedType}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>상세 견종:</strong> {currentPet.detailedBreed}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>나이:</strong> {currentPet.age}살
                                        </p>

                                        {/* 이전 및 다음 버튼 */}
                                        {selectedPetIds.length > 1 && (
                                            <div className="mt-6 flex justify-between items-center">
                                                <button
                                                    onClick={() =>
                                                        setCurrentPetIndex((prevIndex) =>
                                                            prevIndex > 0 ? prevIndex - 1 : selectedPetIds.length - 1
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
                                                >
                                                    <span className="mr-2">◀</span> 이전
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setCurrentPetIndex((prevIndex) =>
                                                            prevIndex < selectedPetIds.length - 1 ? prevIndex + 1 : 0
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition"
                                                >
                                                    다음 <span className="ml-2">▶</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* 증상 입력 */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-700 mb-4">
                                    증상 선택
                                    <div className="text-sm text-gray-500"># 여러마리의 동물일경우 기타 - 한마리씩 증상입력 해주세요.</div>
                                </h3>

                                {/* 증상 체크박스 */}
                                <div className="flex flex-wrap gap-4">
                                    {symptoms.map((symptom) => (
                                        <label key={symptom} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                value={symptom}
                                                checked={selectedSymptoms.includes(symptom)}
                                                onChange={(e) => handleSymptomToggle(e.target.value)}
                                                className="mr-2 accent-teal-500"
                                            />
                                            <span className="text-gray-700">{symptom}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* 선택된 증상에 따른 추가 입력 */}
                                {selectedSymptoms.length > 0 ? (
                                    <div className="mt-6">
                                        <label
                                            htmlFor="symptoms-detail"
                                            className="block text-gray-700 text-sm font-medium mb-2"
                                        >
                                            상세 증상 입력
                                        </label>
                                        <input
                                            type="text"
                                            id="symptoms-detail"
                                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                                            placeholder="예: 기침, 발열, 식욕 감소 등"
                                        />
                                    </div>
                                ) : (
                                    <p className="mt-4 text-sm text-gray-500">
                                        증상을 선택하면 입력 창이 나타납니다.
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* 버튼 */}
                        {selectedSymptoms.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleBackToDoctorSelect}
                                    className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition mr-4"
                                >
                                    이전 단계
                                </button>

                                <button
                                    onClick={handleNextStep}
                                    className="px-6 py-3 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition"
                                >
                                    다음 단계
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 3 && selectedDoctor && selectedDate && (selectedMorning || selectedAfternoon) && (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-6">예약 정보 확인</h2>
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-8">
                            {/* 의사 정보 */}
                            <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg shadow-md bg-white text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">의사 정보</h3>
                                <img
                                    src={selectedDoctor.photo}
                                    alt={selectedDoctor.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md"
                                />
                                <p className="text-lg font-medium text-gray-800 mb-2">
                                    {selectedDoctor.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>전문 분야:</strong> {selectedDoctor.specialization.join(", ")}
                                </p>
                            </div>

                            {/* 사용자 및 예약 정보 */}
                            <div className="w-full md:w-1/2 p-6 border border-gray-200 rounded-lg shadow-md bg-white text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">예약 정보</h3>

                                {/* 사용자 프로필 사진 */}
                                <img
                                    src={''}
                                    alt="사용자 사진"
                                    className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md"
                                />
                                {/* 사용자 이름 */}
                                <p className="text-lg font-medium text-gray-800 mb-4">
                                    {'이름'} 님
                                </p>

                                {/* 동물 정보 */}
                                <div className="text-left text-gray-600">
                                    <p className="text-sm mb-2">
                                        <strong>동물 이름:</strong> {currentPet?.name}
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>동물 정보:</strong> {currentPet?.breedType} / {currentPet?.detailedBreed}, {currentPet?.age}살
                                    </p>
                                    <p className="text-sm mb-2">
                                        <strong>예약 날짜:</strong> {selectedDate?.toLocaleDateString("ko-KR")}
                                    </p>
                                    <p className="text-sm">
                                        <strong>예약 시간:</strong>{" "}
                                        {selectedPeriod === "morning" ? selectedMorning : selectedAfternoon}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    {/* 예약 확인 버튼 */}
                                    <button
                                        onClick={() => setGoPayment(true)} // 버튼 클릭 시 goPayment를 true로 설정
                                        className="mt-6 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg shadow hover:bg-teal-600 transition"
                                    >
                                        예약 확인
                                    </button>

                                    {/* 모달 */}
                                    {goPayment && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                            <div
                                                className={`w-full max-w-sm mx-auto text-center font-medium rounded-lg shadow-lg p-6 cursor-pointer transition border-2 border-teal-500 ${isConfirmClickable ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                {/* 제목 */}
                                                <h3 className="text-lg font-semibold">
                                                    {isConfirmClickable ? "예약 확인" : "이미 확인됨"}
                                                </h3>
                                                {/* 설명 */}
                                                <p className="text-sm mt-2">
                                                    {isConfirmClickable
                                                        ? "예약 정보를 확인하고 완료해주세요"
                                                        : "예약 확인이 완료되었습니다"}
                                                </p>

                                                {/* 확인 버튼 */}
                                                <button
                                                    onClick={() => {
                                                        if (isConfirmClickable) {
                                                            const confirmed = window.confirm("예약을 확인하시겠습니까?");
                                                            if (confirmed) {
                                                                setIsConfirmClickable(false);
                                                                setGoPayment(false); // 모달 닫기
                                                            }
                                                        }
                                                    }}
                                                    className={`mt-4 px-6 py-3 w-full text-white font-medium rounded-lg shadow transition ${isConfirmClickable ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-300 cursor-not-allowed"
                                                        }`}
                                                    disabled={!isConfirmClickable}
                                                >
                                                    {isConfirmClickable ? "예약 확인" : "확인 완료"}
                                                </button>

                                                {/* 이전 버튼 */}
                                                <button
                                                    onClick={() => {
                                                        if (!isConfirmClickable) {
                                                            if (window.confirm("예약을 해제하시겠습니까?")) {
                                                                setIsConfirmClickable(true); // 클릭 가능 상태로 초기화
                                                                setGoPayment(false); // 모달 닫기
                                                            }
                                                        } else {
                                                            setIsConfirmClickable(true); // 클릭 가능 상태로 초기화
                                                            setGoPayment(false); // 모달 닫기
                                                        }
                                                    }}
                                                    className="mt-4 px-6 py-3 w-full bg-gray-400 text-white font-medium rounded-lg shadow hover:bg-gray-500 transition"
                                                >
                                                    {!isConfirmClickable ? "예약 해제" : "이전"}
                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className="flex justify-center items-center mt-8 gap-4">
                            {/* 이전 단계 버튼 */}
                            <button
                                onClick={handleBackToDateSelect}
                                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                            >
                                이전 단계
                            </button>
                            {/* 예약 확인 버튼 */}
                            {/* <button
                                onClick={handlePaymentPopupOpen}
                                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
                            >
                                결제 팝업 열기
                            </button> */}
                            <TossPay />
                        </div>

                    </>
                )}
            </div>
        </div >
    );
};

export default Reservation;
