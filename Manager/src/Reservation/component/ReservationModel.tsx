import React from "react";

const ReservationModal = ({ reservation, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">예약 상세 정보</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">담당 의사</p>
                    <p className="font-medium">{reservation.doctorName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">예약 시간</p>
                    <p className="font-medium">{reservation.dateTime}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">보호자명</p>
                    <p className="font-medium">{reservation.patientName}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">반려동물 정보</p>
                    <p className="font-medium">{reservation.petName} ({reservation.petBreed})</p>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-sm text-gray-500">메모</p>
                <p className="mt-1 text-gray-700">{reservation.note}</p>
            </div>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                    닫기
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                    수정
                </button>
            </div>
        </div>
    </div>
);

export default ReservationModal