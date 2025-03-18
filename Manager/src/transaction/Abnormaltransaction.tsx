import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface User {
    userNum: number,
    userName: string,
    userId: string,
    userPhone: string,
    userBirth: Date,
    userEmail: string,
    userAddress: string,
    userAddressNum: string,
    userStatus: string,
    userSignupDate: Date
}

const Abnormaltransaction: React.FC = () => {
    const [user, setUser] = useState<User[]>([]);
    const navigate = useNavigate();

    const page = useParams().page;

    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:7124/back/api/user/userPage/${page}`);
            console.log("✅ user API 응답:", response.data);
            const sortedData = response.data;
            setUser(sortedData);
        } catch (error) {
            console.error("❌ user 데이터 불러오기 실패:", error);
            setUser([]);
        }
    };

    useEffect(() => {
        getUser();
    }, []);  // 빈 배열로 의존성 추가하여 컴포넌트가 처음 마운트될 때만 호출

    useEffect(() => {
        console.log(user);  // 상태 업데이트 후 확인
    }, [user]);

    return (
        <div className="flex min-h-screen">
            {/* 왼쪽 컨트롤 영역 (1/5) */}
            <div className="w-1/5 p-6 bg-white shadow-md">
                <h2 className="text-lg font-bold mb-4 border-b pb-2">
                    <span className="text-teal-600 mr-2">◢</span> 사용자 관리
                </h2>
                <div className="space-y-1">
                    <button className="w-full flex items-center px-4 py-3 rounded-md bg-white text-gray-700 font-semibold hover:shadow-lg transition cursor-pointer">
                        <span className="mr-3"></span>
                        <span>▪️ 활성화 회원</span>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 rounded-md bg-white text-gray-700 font-semibold hover:shadow-lg transition cursor-pointer">
                        <span className="mr-3"></span>
                        <span>▪️ 최신 회원</span>
                    </button>
                    <button className="w-full flex items-center px-4 py-3 rounded-md bg-white text-gray-700 font-semibold hover:shadow-lg transition cursor-pointer">
                        <span className="mr-3"></span>
                        <span>▪️ 최근 1달 회원</span>
                    </button>
                </div>
            </div>

            {/* 오른쪽 유저 정보 영역 - 카드 레이아웃 적용 */}
            <div className="w-4/5 p-6 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">사용자 목록</h2>
                <div className="grid grid-cols-3 gap-6">
                    {user?.length > 0 ? (
                        user.map((user) => {
                            const formattedDate = new Date(user.userSignupDate).toLocaleDateString("ko-KR");
                            return (
                                <div
                                    key={`${user.userNum}-${user.userId}`}
                                    className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                                >
                                    <div className="flex justify-between mb-4">
                                        <span className="text-lg font-bold">{user.userName}</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${user.userStatus === "활성화"
                                                ? "bg-green-100 text-teal-500"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {user.userStatus}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">ID: {user.userId}</p>
                                    <p className="text-sm text-gray-600">Phone: {user.userPhone}</p>
                                    <p className="text-sm text-gray-600">Email: {user.userEmail}</p>
                                    <p className="text-sm text-gray-600">Address: {user.userAddress}</p>
                                    <p className="text-sm text-gray-600">Zip: {user.userAddressNum}</p>
                                    <p className="text-sm text-gray-600">Joined: {formattedDate}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 text-center text-gray-500 py-4">
                            등록된 사용자가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Abnormaltransaction;
