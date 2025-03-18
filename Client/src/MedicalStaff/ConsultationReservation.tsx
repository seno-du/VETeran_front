import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ConsultationReservation: React.FC = () => {
    const location = useLocation();

    return (
        <>
            <div className="flex justify-center gap-8 bg-white py-6 shadow">
                {/* <Link
                    to="/information"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${
                        location.pathname === '/information' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                    }`}
                >
                    오시는길
                </Link> */}
                <Link
                    to="/hour"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${
                        location.pathname === '/hour' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                    }`}
                >
                    특화진료
                </Link>
                <Link
                    to="/doctors"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${
                        location.pathname === '/doctors' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                    }`}
                >
                    의료진 소개
                </Link>  
                <Link
                    to="/consultation"
                    className={`px-4 py-2 border-none cursor-pointer text-xl transition-all duration-200 ${
                        location.pathname === '/consultation' ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'
                    }`}
                >
                    상담예약
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px- py-24 mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    상담예약 <img src="/icons/consult-icon.png" alt="Consultation Icon" className="ml-2 w-6 h-6" />
                </h2>
                <p className="text-gray-600 mb-16">
                    지점별 대표전화와 카카오톡채널을 통해 진료 예약 및 상담 신청하세요.
                </p>

                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-center">대표전화 안내</h3>
                            <ul className="space-y-2 text-lg flex flex-col items-center">
                                {[
                                    { branch: "청담점", phone: "02-1813-7522" },
                                    { branch: "성북점", phone: "02-1736-7522" },
                                    { branch: "동대문점", phone: "02-1027-7522" },
                                    { branch: "노원점", phone: "02-1323-7522" },
                                    { branch: "서초점", phone: "02-1120-7522" },
                                ].map((item, index) => (
                                    <li key={index} className="flex justify-center items-center w-full max-w-lg text-gray-800">
                                        <button className="w-36 h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200">
                                            <img src="/icons/phone-icon.png" alt="Phone" className="w-5 h-5 mr-2" />
                                            <span className="font-semibold text-md">{item.branch}</span>
                                        </button>
                                        <span className="ml-6 text-gray-700 text-lg font-medium">{item.phone}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-4 items-center text-center">상담문의</h3>
                            <div className="flex flex-col items-center space-y-3">
                                <button className="w-80 border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all duration-200">
                                    홈페이지 문의하기 게시판 이용
                                </button>
                                <button className="w-80 border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all duration-200">
                                    지점별 대표전화 이용
                                </button>
                                <button className="w-80 border border-blue-500 text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all duration-200">
                                    지점별 카카오톡채널 이용
                                </button>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <img src="/icons/chat-icon.png" alt="Chat" className="w-12 h-12" />
                                <img src="/icons/phone-icon.png" alt="Phone" className="w-12 h-12" />
                                <img src="/icons/kakao-icon.png" alt="Kakao" className="w-12 h-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConsultationReservation;
