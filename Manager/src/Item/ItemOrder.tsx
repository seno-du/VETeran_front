import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const ItemOrder: React.FC = () => {

    const location = useLocation();
    const receivedItemId = location.state?.itemId;

    const token = sessionStorage.getItem("accessToken");

    const [supplierName, setSupplierName] = useState('');
    const [supplierCode, setSupplierCode] = useState('');
    const [supplierEmployee, setSupplierEmployee] = useState('');
    const [supplierTransactionId, setSupplierTransactionId] = useState('');
    const [itemId, setItemId] = useState(receivedItemId || '');
    const [supplierProductWeight, setSupplierProductWeight] = useState(0);
    const [supplierProductQuantity, setSupplierProductQuantity] = useState(0);
    const [supplierExpirationDate, setSupplierExpirationDate] = useState<Date>(new Date());

    const navigate = useNavigate();
    useEffect(() => {
        if (receivedItemId) {
            setItemId(receivedItemId);
        }
    }, [receivedItemId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            "supplierName": supplierName,
            "supplierCode": supplierCode,
            "supplierEmployee": supplierEmployee,
            "supplierTransactionId": supplierTransactionId,
            "itemId": itemId,
            "supplierProductWeight": supplierProductWeight,
            "supplierProductQuantity": supplierProductQuantity,
            "supplierExpirationDate": supplierExpirationDate
        }

        try {
            console.log(data)
            console.log(token)
            const response = await axios.post('http://localhost:7124/back/api/supplier/insert', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                if (response.data === "success") {
                    alert("성공적으로 처리되었습니다.");
                    navigate('/item/list');
                } else if (response.data === "isOrder") {
                    alert("이미 처리가 된 주문입니다.")
                }
            } else {
                alert("처리 실패했습니다.");
            }
        } catch (error) {
            console.error("문제가 발생했습니다:", error);
            alert("서버와의 통신에 문제가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-10">
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold mb-8 text-primary text-center text-gray-800">
                    재고 주문
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Supplier Name */}
                    <div>
                        <label htmlFor="supplierName" className="block text-gray-700">공급업체 이름</label>
                        <input
                            type="text"
                            id="supplierName"
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Supplier Code */}
                    <div>
                        <label htmlFor="supplierCode" className="block text-gray-700">공급업체 코드</label>
                        <input
                            type="text"
                            id="supplierCode"
                            value={supplierCode}
                            onChange={(e) => setSupplierCode(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Supplier Employee */}
                    <div>
                        <label htmlFor="supplierEmployee" className="block text-gray-700">공급업체 담당자</label>
                        <input
                            type="text"
                            id="supplierEmployee"
                            value={supplierEmployee}
                            onChange={(e) => setSupplierEmployee(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Supplier Transaction ID */}
                    <div>
                        <label htmlFor="supplierTransactionId" className="block text-gray-700">공급업체 거래 ID</label>
                        <input
                            type="text"
                            id="supplierTransactionId"
                            value={supplierTransactionId}
                            onChange={(e) => setSupplierTransactionId(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Item ID */}
                    <div>
                        <label htmlFor="itemId" className="block text-gray-700">아이템 ID</label>
                        {receivedItemId ? (
                            <input
                                type="text"
                                id="itemId"
                                value={itemId}
                                disabled
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <input
                                type="text"
                                id="itemId"
                                value={itemId}
                                onChange={(e) => setItemId(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        )}
                    </div>

                    {/* Product Weight */}
                    <div>
                        <label htmlFor="supplierProductWeight" className="block text-gray-700 font-semibold">제품 무게 (kg)</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                id="supplierProductWeight"
                                value={supplierProductWeight}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // 빈 문자열인 경우 처리 (빈 값이 들어오면 0으로 처리)
                                    if (value === "") {
                                        setSupplierProductWeight(0);
                                    } else {
                                        // 정규식으로 소수점 두 자리까지 허용
                                        const parsedValue = parseFloat(value);
                                        if (/^\d*\.?\d{0,2}$/.test(value) && !isNaN(parsedValue)) {
                                            // 값이 0 이상 99 이하인 경우에만 업데이트
                                            const limitedValue = Math.max(0, Math.min(99, parsedValue));
                                            setSupplierProductWeight(parseFloat(limitedValue.toFixed(2)));
                                        } else {
                                            alert("소수점 두 자리까지만 입력 가능합니다.");
                                        }
                                    }
                                }}
                                className="w-32 p-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                                required
                                min="0"
                                max="99"
                            />
                            {/* Buttons for increasing and decreasing */}
                            <div className="space-x-2">
                                {/* 1 증가 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setSupplierProductWeight(prev => {
                                        const newValue = prev + 1;
                                        return parseFloat(Math.min(99, Math.max(0, newValue)).toFixed(2)); // 소수점 두 자리까지 제한
                                    })}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
                                >
                                    +1
                                </button>

                                {/* 1 감소 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setSupplierProductWeight(prev => {
                                        const newValue = prev - 1;
                                        return parseFloat(Math.min(99, Math.max(0, newValue)).toFixed(2)); // 소수점 두 자리까지 제한
                                    })}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                                >
                                    -1
                                </button>

                                {/* 0.1 증가 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setSupplierProductWeight(prev => {
                                        const newValue = prev + 0.1;
                                        return parseFloat(Math.min(99, Math.max(0, newValue)).toFixed(2)); // 소수점 두 자리까지 제한
                                    })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                                >
                                    +0.1
                                </button>

                                {/* 0.1 감소 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setSupplierProductWeight(prev => {
                                        const newValue = prev - 0.1;
                                        return parseFloat(Math.min(99, Math.max(0, newValue)).toFixed(2)); // 소수점 두 자리까지 제한
                                    })}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
                                >
                                    -0.1
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Quantity */}
                    <div>
                        <label htmlFor="supplierProductQuantity" className="block text-gray-700">제품 수량</label>
                        <input
                            type="number"
                            id="supplierProductQuantity"
                            value={supplierProductQuantity}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value) && value >= 0) {
                                    setSupplierProductQuantity(value);
                                } else {
                                    alert("올바른 숫자를 입력하세요.");
                                }
                            }}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            min="0"
                        />
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <label htmlFor="supplierExpirationDate" className="block text-gray-700">유효 기간</label>
                        <input
                            type="date"
                            id="supplierExpirationDate"
                            value={supplierExpirationDate}
                            onChange={(e) => setSupplierExpirationDate(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                            주문 제출
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemOrder;
