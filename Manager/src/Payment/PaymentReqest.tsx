import axios from "axios";
import React, { useState, useEffect } from "react";

// Payment 데이터 구조 정의
interface Payment {
    userNum: number;
    amount: number;
    requestedAt: number; // 타임스탬프
    paymentMethod: string;
    paymentKey?: string;
    approvedAt?: number; // 타임스탬프
    userName: string;
    managerName: string;
    reserveNum: number;
    reserveDate: number; // 타임스탬프
    paymentStatus: string;
    reserveNotice?: string;
}

const PaymentRequest: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const pageSize: number = 10;

    // 페이징에 필요한 계산
    const totalPages = Math.ceil(totalCount / pageSize);

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get<{
                    totalCount: number;
                    paymentList: Payment[];
                }>(`http://localhost:7124/back/api/paymentrequest/paymentList?page=${page}`, {
                    // headers: { Authorization: `Bearer ${token}` },
                });

                setPayments(response.data.paymentList);
                setTotalCount(response.data.totalCount);
            } catch (error) {
                console.error("결제 정보 불러오기 실패:", error);
            }
        };

        fetchPayments();
    }, [page]);

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">결제 관리</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3 text-left">유저명</th>
                            <th className="p-3 text-left">결제 금액</th>
                            <th className="p-3 text-left">결제 방식</th>
                            <th className="p-3 text-left">결제 상태</th>
                            <th className="p-3 text-left">예약 번호</th>
                            <th className="p-3 text-left">예약 날짜</th>
                            <th className="p-3 text-left">결제날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.reserveNum} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{payment.userName}</td>
                                    <td className="p-3">{payment.amount.toLocaleString()} 원</td>
                                    <td className="p-3">{payment.paymentMethod}</td>
                                    <td className="p-3 text-blue-600 font-semibold">{payment.paymentStatus}</td>
                                    <td className="p-3">{payment.reserveNum}</td>
                                    <td className="p-3">
                                        {new Date(payment.reserveDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        {payment.approvedAt
                                            ? new Date(payment.approvedAt).toLocaleDateString()
                                            : new Date(payment.requestedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={!hasPrevPage}
                >
                    이전 페이지
                </button>
                <span className="text-lg font-semibold">페이지 {page} / {totalPages}</span>
                <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={!hasNextPage}
                >
                    다음 페이지
                </button>
            </div>
        </div>
    );
};

export default PaymentRequest;
