import React, { useState } from "react";

interface RejectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        onSubmit(reason);  // 사유를 부모 컴포넌트에 전달
        setReason(""); // 제출 후 입력창 초기화
        onClose(); // 모달 닫기
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl mb-4">예약 거부 사유 입력</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="예약 거부 사유를 입력하세요..."
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-white rounded-md"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                        제출
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
