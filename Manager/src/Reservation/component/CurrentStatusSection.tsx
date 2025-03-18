import React from "react";

const CurrentStatusSection = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-700">
                <span className="text-teal-600 mr-1">◢</span> 현재 진료 현황
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {/* 현재 진료 중 */}
                <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-teal-800">현재 진료 중</span>
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">진행중</span>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-teal-200">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium text-gray-700">이영희 님</span>
                                <span className="text-xs text-gray-500">Dr. 김진헌</span>
                            </div>
                            <p className="text-xs text-gray-600">초롱이 (말티즈) - 정기검진</p>
                        </div>
                    </div>
                </div>

                {/* 대기 현황 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">대기 현황</span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">3명 대기</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">김철수 님</span>
                            <span className="text-gray-500">Dr. 박수정</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">박지민 님</span>
                            <span className="text-gray-500">Dr. 김진헌</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">최영호 님</span>
                            <span className="text-gray-500">Dr. 박수정</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentStatusSection