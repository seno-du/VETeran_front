import React, { useState, useEffect } from "react";
import axios from "axios";
import RejectionModal from "./RejectionModal";

interface Reserve {
    reserveNum: number;
    petNum: number;
    reserveDate: string;
    reserveNotice: string;
    reserveTime: string;
    managerNum: number;
    pet: {
        petSpecies: string;
        petName: string;
        petBreed: string;
        petGender: string;
    };
    reserveStatus: string;
    managerName: string;
}

const ReservationRequest: React.FC = () => {
    const [reservationData, setReservationData] = useState<Reserve[]>([]);
    const [pageNum, setPageNum] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태 추가
    const [selectedReservations, setSelectedReservations] = useState<Set<number>>(new Set());
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // 예약 거부 사유 모달 상태
    const [rejectionReason, setRejectionReason] = useState(""); // 예약 거부 사유

    const token = sessionStorage.getItem("accessToken");

    const reservationPendingList = async (page: number) => {
        try {
            const response = await axios.get(`http://localhost:7124/back/api/reserve/pendinglist/${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.data.reservations) {
                setReservationData(response.data.reservations);
                setTotalPages(Math.ceil(response.data.totalCount / 10)); // 전체 개수로 페이지 수 계산
            } else {
                setReservationData([]);
                setTotalPages(1);
            }
        } catch (error) {
            alert("예약 데이터를 불러오는 데 실패했습니다.");
        }
    };

    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allReservations = new Set(reservationData.map(reservation => reservation.reserveNum));
            setSelectedReservations(allReservations);
        } else {
            setSelectedReservations(new Set());
        }
    };

    const toggleSelectReservation = (reserveNum: number) => {
        const updatedSelection = new Set(selectedReservations);
        if (updatedSelection.has(reserveNum)) {
            updatedSelection.delete(reserveNum);
        } else {
            updatedSelection.add(reserveNum);
        }
        setSelectedReservations(updatedSelection);
    };

    // 예약 완료/취소 처리
    const handleReservationStatusChange = async (status: string) => {
        const updatedReservations = Array.from(selectedReservations).map(num => Number(num));
        try {
            const response = await axios.put(
                "http://localhost:7124/back/api/reserve/reserveresponse",
                {
                    reserveNum: updatedReservations,
                    reserveStatus: status,
                    rejectionReason: status === "취소" ? rejectionReason : "", // 거부 사유 추가
                },
                { headers: { "Content-Type": "application/json" } }
            );
            reservationPendingList(pageNum);
            setSelectedReservations(new Set());
            setRejectionReason("");  // 거부 사유 초기화
            alert("예약 상태 변경이 완료되었습니다.");
            for (let i = 0; i < updatedReservations.length; i++) {
                await axios.post(
                    "http://localhost:8000/phone/send_reservation_status/",
                    {
                        reserveNum: updatedReservations[i],
                        reserveStatus: status,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );
            }
            console.log(response.data)
        } catch (error) {
            alert("예약 상태 변경에 실패했습니다.");
        }
    };

    const handlePageChange = (newPageNum: number) => {
        // 데이터가 없거나 마지막 페이지라면 페이지를 넘기지 않도록 방지
        if (newPageNum > 0 && newPageNum <= totalPages) {
            setPageNum(newPageNum);
            reservationPendingList(newPageNum); // 페이지 변경 시 데이터 가져오기
        }
    };

    const openRejectionModal = () => {
        setIsReasonModalOpen(true);  // 예약 거부 사유 모달 열기
    };

    const closeRejectionModal = () => {
        setIsReasonModalOpen(false);  // 예약 거부 사유 모달 닫기
    };

    const submitRejectionReason = (reason: string) => {
        setRejectionReason(reason);  // 사유 저장
        setIsReasonModalOpen(false);  // 모달 닫기
        handleReservationStatusChange("취소");  // 예약 거부 처리
    };

    useEffect(() => {
        reservationPendingList(pageNum);
    }, [pageNum]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR'); // 한국 형식으로 날짜를 변환 (YYYY-MM-DD)
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg" style={{ maxWidth: "1400px", minHeight: "650px" }}>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="text-teal-600 mr-2">◢</span> 예약 대기 목록
            </h3>

            {/* 예약 데이터 테이블 */}
            <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md">
                <table className="min-w-full text-sm table-auto border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-black">
                        <tr>
                            <th className="border border-gray-300 p-2 text-center">
                                <input
                                    type="checkbox"
                                    onChange={toggleSelectAll}
                                    checked={reservationData.length === selectedReservations.size}
                                    className="cursor-pointer"
                                />
                            </th>
                            <th className="border border-gray-300 p-2">시간</th>
                            <th className="border border-gray-300 p-2">종류</th>
                            <th className="border border-gray-300 p-2">이름</th>
                            <th className="border border-gray-300 p-2">진료 날짜</th>
                            <th className="border border-gray-300 p-2">담당 의사</th>
                            <th className="border border-gray-300 p-2">진료 정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationData.length > 0 ? (
                            reservationData.map((reservation) => (
                                <tr
                                    key={reservation.reserveNum}
                                    className="text-center hover:bg-gray-100 cursor-pointer"
                                >
                                    <td className="border border-gray-300 p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedReservations.has(reservation.reserveNum)}
                                            onChange={() => toggleSelectReservation(reservation.reserveNum)}
                                            className="cursor-pointer"
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-2">{reservation.reserveTime}</td>
                                    <td className="border border-gray-300 p-2">{reservation.pet.petSpecies}</td>
                                    <td className="border border-gray-300 p-2">{reservation.pet.petName}</td>
                                    <td className="border border-gray-300 p-2">{formatDate(reservation.reserveDate as unknown as number)}</td>
                                    <td className="border border-gray-300 p-2">{reservation.managerName}</td>
                                    <td className="border border-gray-300 p-2">
                                        <div className="text-xs text-gray-600">{reservation.reserveNotice}</div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">예약 대기 목록이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 예약 완료 및 취소 버튼 */}
            <div className="mt-6 flex justify-between">
                <button
                    onClick={() => handleReservationStatusChange("완료")}
                    disabled={selectedReservations.size === 0}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 transition duration-300"
                >
                    예약 승인
                </button>
                <button
                    onClick={openRejectionModal}  // 예약 거부 모달 열기
                    disabled={selectedReservations.size === 0}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 disabled:bg-gray-300 transition duration-300"
                >
                    예약 거부
                </button>
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => handlePageChange(pageNum - 1)}
                    disabled={pageNum <= 1}
                    className="px-6 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 disabled:bg-gray-200 transition duration-300 mr-3"
                >
                    이전
                </button>
                <span className="px-6 py-3 text-black">{pageNum}</span>
                <button
                    onClick={() => handlePageChange(pageNum + 1)}
                    disabled={pageNum >= totalPages} // 총 페이지 수를 넘어가지 않도록 disabled 처리
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 ml-3"
                >
                    다음
                </button>
            </div>

            {/* 예약 거부 사유 모달 */}
            <RejectionModal
                isOpen={isReasonModalOpen}
                onClose={closeRejectionModal}
                onSubmit={submitRejectionReason}
            />
        </div>
    );
};

export default ReservationRequest;
