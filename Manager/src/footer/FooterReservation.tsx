import React from 'react'

const FooterReservation: React.FC = () => {
    return (
        <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="grid grid-cols-8 gap-4">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">📅</span>
                    <span className="text-xs text-gray-600">신규예약</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">📋</span>
                    <span className="text-xs text-gray-600">예약조회</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">✏️</span>
                    <span className="text-xs text-gray-600">예약수정</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">❌</span>
                    <span className="text-xs text-gray-600">예약취소</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">📊</span>
                    <span className="text-xs text-gray-600">통계</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">📱</span>
                    <span className="text-xs text-gray-600">알림</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">⚙️</span>
                    <span className="text-xs text-gray-600">설정</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl mb-1">💾</span>
                    <span className="text-xs text-gray-600">저장</span>
                </div>
            </div>
        </div>
    )
}

export default FooterReservation