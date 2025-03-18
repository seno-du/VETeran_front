import React from 'react'
import { Link } from 'react-router-dom'

const Hour: React.FC = () => {
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
            <div className="w-3/4 text-center mx-auto bg-gray-100 p-8 mt-8 mb-20">
                {/* 헤더 섹션 */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-500 text-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold">VIP ANIMAL MEDICAL CENTER</h2>
                    <p className="text-sm mt-2">똑똑한 선택, VIP에서 시작하세요.<br />VIP동물의료센터 진료서비스를 만나 드립니다.</p>
                </div>

                {/* 진료 과목 섹션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {/* 내과/영상의학과 */}
                    <div className="bg-white p-4 shadow-md rounded-lg border-t-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-700">내과/영상의학과</h3>
                        <ul className="mt-2 text-sm text-gray-600">
                            <li>- 종양/항암 관리</li>
                            <li>- 영상진단 검사 (MRI, CT)</li>
                            <li>- 제형학적 관리 (PRP, 줄기세포 치료)</li>
                        </ul>
                    </div>

                    {/* 심장/신장 내과 */}
                    <div className="bg-white p-4 shadow-md rounded-lg border-t-4 border-yellow-500">
                        <h3 className="text-lg font-semibold text-yellow-700">심장/신장 내과</h3>
                        <ul className="mt-2 text-sm text-gray-600">
                            <li>- CRRT 혈액투석 관리</li>
                            <li>- 노령동물건강관리</li>
                            <li>- 심장병 관리</li>
                        </ul>
                    </div>

                    {/* 외과/마취과 */}
                    <div className="bg-white p-4 shadow-md rounded-lg border-t-4 border-green-500">
                        <h3 className="text-lg font-semibold text-green-700">외과/마취과</h3>
                        <ul className="mt-2 text-sm text-gray-600">
                            <li>- 정형외과 특화 수술</li>
                            <li>- 복강경 수술</li>
                            <li>- 신경계 특화 수술</li>
                        </ul>
                    </div>

                    {/* 치과/안과 */}
                    <div className="bg-white p-4 shadow-md rounded-lg border-t-4 border-red-500">
                        <h3 className="text-lg font-semibold text-red-700">치과/안과</h3>
                        <ul className="mt-2 text-sm text-gray-600">
                            <li>- 안과 특화 치료 (녹내장, 백내장 수술)</li>
                            <li>- 치과 특화 치료 (치아 교정, 치주염 치료)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hour