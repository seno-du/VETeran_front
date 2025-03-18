/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../zustand/profileSlice';

const NaverLoginCallback: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    // URL에서 code와 state 파라미터 추출
    const getQueryParams = () => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        return { code, state };
    };

    // 백엔드로 code와 state 전달하는 함수
    const handleCallback = async () => {
        const { code, state } = getQueryParams();

        if (!code || !state) {
            setError('Invalid callback parameters');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:7124/back/api/naver/callback', {
                params: { code, state },
            });

            if (!response.data || !response.data.email) {
                setError("로그인 처리중 오류가 발생하였습니다.");
                setLoading(false);
                return;
            }

            const response3 = await axios.post('http://localhost:7124/back/api/user/jwt/login/social', {
                userEmail: response.data.email
            });

            if (response3.status === 200) {
                if (response3.data === "is not exist") {
                    return navigate("/signup", { state: { email: response.data.email } })
                }
                dispatch(setToken(response3.data.token));
                // localStorage.setItem('token', response3.data.token);

                // 로그인 성공 후 홈페이지로 이동
                navigate('/');
            } else {
                setError("로그인 처리중 오류가 발생하였습니다.");
            }
        } catch (err) {
            console.error('Failed to handle callback:', err);
            setError('Callback 처리 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleCallback();
    }, [location.search]);  // URL의 검색 파라미터가 바뀔 때마다 실행

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen text-2xl font-bold text-[#555]">
            Naver 로그인 중입니다... 잠시만 기다려주세요! ⏳
        </div>
    )

};

export default NaverLoginCallback;
