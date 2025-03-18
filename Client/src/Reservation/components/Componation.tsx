import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


interface ComponationProps {
    check: boolean
}

const Componation: React.FC<ComponationProps> = ({ check }) => {

    const token = useSelector((state: any) => state.auth.token);

    const [userPhone, setUserPhone] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const User = async () => {
        const response = await axios.get(`http://localhost:7124/back/api/user/one`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setUserName(response.data.userName);
        if (response.data.userPhone.length === 11) {
            // 11자리인 경우, 하이픈(-) 추가
            const formattedPhone = response.data.userPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            setUserPhone(formattedPhone);
        } else {
            // 11자리가 아닌 경우 그대로 설정
            setUserPhone(response.data.userPhone);
        }
    }

    useEffect(() => {
        User();
    }, [])

    return (
        <>
            {!check ? (
                <>
                    {/* 안내 문구 - 왼쪽 정렬 */}
                    <p className="text-gray-700 text-sm flex items-center mb-4">
                        ⚠️ 아래 입력된 휴대전화와 e-mail을 통해 진료예약 안내 정보가 발송됩니다.
                        정확한 정보를 입력해 주세요. (보건부 고시에 의해 가족이 아닌 제3자의 대리 진료가 제한됨을 알려드립니다.)
                    </p>

                    {/* 표 스타일 적용 */}
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                        <div className="flex">
                            <div className="w-1/4 bg-gray-100 p-3 font-bold text-left border-r">환자 성명</div>
                            <div className="w-3/4 p-3 text-left">{userName}</div>
                        </div>
                        <div className="flex border-t">
                            <div className="w-1/4 bg-gray-100 p-3 font-bold text-left border-r">휴대전화</div>
                            <div className="w-3/4 p-3 text-left">{userPhone}</div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* 하단 예약 정보 확인 */}
                    <div className="flex justify-center">
                        <button
                            className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition"
                            onClick={() => navigate("/")}
                        >
                            예약 완료
                        </button>
                    </div>
                </>
            )}
        </>
    )
}

export default Componation;