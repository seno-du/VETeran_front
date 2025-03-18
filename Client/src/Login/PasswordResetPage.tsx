import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const PasswordResetPage: React.FC = () => {

    const location = useLocation();
    const { token } = location.state || {};


    const [password, setPassword] = useState({
        newPassword: '',
        checkPassword: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCheckpassword = () => {
        if (password.newPassword === password.checkPassword) {
            handlechangePwd();
        } else {
            alert('비밀번호가 일치하지 않습니다.');
            setPassword({ ...password, newPassword: '', checkPassword: '' });
        }
    };

    const handlechangePwd = async () => {
        console.log(token)
        try {
            const response = await axios.post(`http://localhost:7124/back/api/user/jwt/newPassword`, password,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-PWD-RESET-AUTH': `Bearer ${token}`,
                    }
                }
            );

            if (response.status == 200) {
                alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요');
                handleLogout();
            }

        } catch (error: any) {
            alert("네트워크 오류가 발생했습니다.");
            console.log('Error :', error);
        }

    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login/form");
        window.location.reload();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">비밀번호 재설정</h1>
                <div>
                    <>대문자, 숫자, 특수문자를 포함한 8자리 이상의 문자열을 입력해주세요.</>
                    <input
                        type="password"
                        name='newPassword'
                        placeholder="새로운 비밀번호"
                        value={password.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name='checkPassword'
                        placeholder="비밀번호 확인"
                        value={password.checkPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleCheckpassword}
                    className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                    확인
                </button>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => navigate('/')}>
                            홈화면으로 이동
                        </button>
                        <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => navigate('/login/form')}>
                            로그인 화면
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordResetPage