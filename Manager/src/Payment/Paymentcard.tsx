import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Paymentcard: React.FC = () => {
    const token = sessionStorage.getItem("accessToken");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [paymentCheck, setPaymentCheck] = useState<any[]>([]);
    const totalPages = Math.ceil(totalCount / pageSize);

    // 데이터 가져오는 함수 
    const fetchPaymentCards = async () => {
        try {
            const response = await axios.get(`http://localhost:7124/back/api/paymentcheck?page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setPageSize(response.data.pageSize);
                setTotalCount(response.data.totalCount);
                setPaymentCheck(response.data.paymentCheck);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 로드
    useEffect(() => {
        fetchPaymentCards();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const currentData = paymentCheck.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">Payment Cards</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">번호</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">이름</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">확률</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">정상 임계값</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">이상 확률</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">이상거래</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">IP</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">결제시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData
                                .filter((card) => card.id !== undefined && card.userName) // id와 userName이 없는 데이터 제외
                                .map((card) => (
                                    <tr key={card.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">{card.id}</td>
                                        <td className="px-6 py-4 text-sm">{card.userName}</td>
                                        <td className="px-6 py-4 text-sm">{card.mse}</td>
                                        <td className="px-6 py-4 text-sm">{card.normalAboveThreshold}</td>
                                        <td className="px-6 py-4 text-sm">{card.anomalyProbability}</td>
                                        <td className="px-6 py-4 text-sm">{card.isAnomaly ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4 text-sm">{card.userIP}</td>
                                        <td className="px-6 py-4 text-sm">{new Date(card.createdAt).toLocaleString("ko-KR")}</td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-6 space-x-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
                            }`}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Paymentcard;
