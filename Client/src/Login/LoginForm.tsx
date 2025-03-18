/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../zustand/profileSlice';

const LoginForm = () => {
    const [userId, setUserId] = useState('');
    const [userPwd, setUserPwd] = useState('');

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // console.log('Login attempt:', { userId });

        if ((userId.trim().length) === 0) {
            return alert("아이디를 입력해주세요");
        }

        if ((userPwd.trim().length) === 0) {
            return alert("비밀번호를 입력해주세요");
        }

        try {

            const response = await axios.post('http://localhost:7124/back/api/user/jwt/login', { userId, userPwd });

            if (response.status === 200) {
                const { token } = response.data;
                dispatch(setToken(token))
                // localStorage.setItem('token', token);

                // 로그인 성공 후 홈페이지로 이동
                navigate('/');
            }
        } catch (error: any) {
            alert(error.response.data);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h1>
                <p className="text-gray-500 text-center text-sm mb-8">
                    동물병원 서비스를 이용하시려면 로그인해주세요
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="아이디"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={userPwd}
                            onChange={(e) => setUserPwd(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600">
                            <input
                                type="checkbox"
                                className="w-4 h-4 mr-2 border-gray-300 rounded text-red-500 focus:ring-red-500"
                            />
                            <span>로그인 상태 유지</span>
                        </label>
                        <a href="/login/idserch" className="text-red-500 hover:text-red-600 transition-colors">
                            아이디 찾기
                        </a>
                        <a href="/login/passwordreset" className="text-red-500 hover:text-red-600 transition-colors">
                            비밀번호 찾기
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                        로그인
                    </button>

                    <div className="text-center text-gray-500">
                        <p>
                            아직 회원이 아니신가요?
                            <a href="/signup/agree" className="text-red-500 hover:text-red-600 transition-colors font-medium ml-2">
                                회원가입
                            </a>
                        </p>
                    </div>
                </form>

                {/* Social Login Options */}
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-500 text-sm">소셜 계정으로 로그인</p>
                    <div className="flex flex-row justify-center items-center space-x-4">
                        {[
                            { title: 'Google', icon: 'https://accounts.hancom.com/static/media/ico-oauth-google.f4c4305ba7c5d2007ce2032de9fe7df0.svg', path: '/login/google' },
                            { title: 'Kakao', icon: 'https://accounts.hancom.com/static/media/ico-oauth-kakao.5a9a86d270bca7df1abc57343fdaa42f.svg', path: '/login/kakao' },
                            { title: 'Naver', icon: 'https://accounts.hancom.com/static/media/ico-oauth-naver.524dc5606e96f3d5fb6eccb0b3c65783.svg', path: '/login/naver' },
                        ].map((item, index) => (
                            <img
                                key={index}
                                src={item.icon}
                                alt={item.title}
                                onClick={() => navigate(item.path)}
                                className="w-12 h-12 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;