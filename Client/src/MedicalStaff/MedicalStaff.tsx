import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Doctor {
    id: number;
    name: string;
    specialization: string[];
    department: string; // 추가: 부서 정보
    photo: string;
    workingDays: number[];
}

// 의료진 데이터
const doctors: Doctor[] = [
    { id: 1, name: "김진헌", specialization: ["예방접종", "내과 진료"], department: "내과", photo: "/images/김진헌.png", workingDays: [1, 4] },
    { id: 2, name: "최재성", specialization: ["수술", "외과 진료"], department: "외과", photo: "/images/최재성.png", workingDays: [2, 5] },
    { id: 3, name: "이정우", specialization: ["내시경", "내과 진료"], department: "내과", photo: "/images/이정우.png", workingDays: [3, 6] },
    { id: 4, name: "김경민", specialization: ["외과 수술"], department: "외과", photo: "/images/김경민.png", workingDays: [4, 7] },
    { id: 5, name: "김채린", specialization: ["진단 검사", "내과 진료"], department: "내과", photo: "/images/김채린.png", workingDays: [5, 8] },
    { id: 6, name: "정윤호", specialization: ["외상 치료"], department: "외과", photo: "/images/정윤호.png", workingDays: [5, 8] },
    { id: 7, name: "정효진", specialization: ["심장내과"], department: "내과", photo: "/images/정효진.png", workingDays: [5, 8] },
    { id: 8, name: "지나은", specialization: ["정형외과"], department: "외과", photo: "/images/지나은.png", workingDays: [5, 8] },
];

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

const MedicalStaff: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("전체");
    const doctorsPerPage = 4;

    // 필터링된 의료진 데이터
    const filteredDoctors = filter === "전체" ? doctors : doctors.filter((doc) => doc.department === filter);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
    const currentDoctors = filteredDoctors.slice((currentPage - 1) * doctorsPerPage, currentPage * doctorsPerPage);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    };

    return (
        <>
            <div className="flex justify-center gap-8 bg-white py-6 shadow">
                {/* <Link
                    to="/information"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/information' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    오시는길
                </Link> */}
                <Link
                    to="/hour"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/hour' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    특화진료
                </Link>
                <Link
                    to="/doctors"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/doctors' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    의료진 소개
                </Link>
                <Link
                    to="/consultation"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${location.pathname === '/consultation' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                        }`}
                >
                    상담예약
                </Link>
            </div>

            {/* 제목 */}
            <h2 className="text-3xl font-bold text-center py-6">의료진 소개</h2>

            {/* 필터 탭 */}
            <div className="flex justify-center gap-4 mb-6">
                {["전체", "외과", "내과"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleFilterChange(tab)}
                        className={`px-4 py-2 text-lg font-medium rounded-lg transition-all ${filter === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-black hover:bg-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 의료진 카드 */}
            <div className="container mx-auto justify-center py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-6 justify-items-center max-w-5xl mx-auto">
                    {currentDoctors.map((doctor) => (
                        <div key={doctor.id} className="border p-8 rounded-lg text-center shadow-sm hover:bg-gray-100" style={{ maxWidth: '450px', width: '100%' }}>
                            <img src={doctor.photo} alt={doctor.name} className="w-28 h-28 rounded-full mx-auto" />
                            <h3 className="text-xl font-semibold mt-4">{doctor.name}</h3>
                            <p className="text-md text-gray-600">{doctor.specialization.join(', ')}</p>
                            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner flex items-center w-full">
                                <div className="font-bold text-md flex items-center mr-4 whitespace-nowrap flex-shrink-0">
                                    <img src="/icons/calendar-icon.webp" alt="Calendar Icon" className="w-6 h-6 mr-2" />진료일정
                                </div>

                                <div className="border-l-2 border-gray-300 pl-2 flex-grow">
                                    <div className="flex justify-around">
                                        {weekDays.map((day, index) => (
                                            <div key={index} className="text-center">
                                                <span className="text-md">{day}</span><br />
                                                {doctor.workingDays.includes(index + 1) ? (
                                                    <span className="inline-block w-5 h-5 rounded-full bg-blue-500"></span>
                                                ) : (
                                                    <span className="text-md text-gray-500">휴무</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center items-center space-x-4 mt-0 py-16">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    이전
                </button>
                <span className="text-lg font-medium">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        </>
    );
};

export default MedicalStaff;
