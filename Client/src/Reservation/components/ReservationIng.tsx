import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface ReservationIngCheck {
    check: boolean
}

const ReservationIng: React.FC<ReservationIngCheck> = ({ check }) => {

    const token = useSelector((state: any) => state.auth.token);

    const [userName, setUserName] = useState('');

    const User = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/user/one`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUserName(response.data.userName);
    }
    useEffect(() => {
        User();
    }, [])

    return (
        <div className="max-w-6xl mx-auto py-10 px-5 bg-white">
            {/* 예약 완료 상태 */}
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold">

                    {!check ? (
                        <>
                            <span className="text-green-600">{userName}</span>님의 진료예약{" "}
                            <span className="text-orange-600">진행 중</span>입니다
                        </>
                    ) : (
                        <>
                            {/* 상단 제목 */}
                            <h1 className="text-3xl font-bold text-left mb-4">인터넷 진료예약 확인</h1>
                            <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

                            <span className="text-green-600">{userName}</span>님의 진료예약이{" "}
                            <span className="text-orange-600">완료</span>되었습니다

                        </>
                    )}
                </h2>
            </div>
        </div>
    );
};

export default ReservationIng;