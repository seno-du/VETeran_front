/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../zustand/profileSlice';

const KakaoLogin: React.FC = () => {
    const navigate = useNavigate();

    const kakaoKey = import.meta.env.VITE_KAKAO_KEY;
    const dispatch = useDispatch();


    useEffect(() => {
        // Kakao SDK 초기화
        if (window.Kakao) {
            window.Kakao.init(kakaoKey);
        }
        handleKakaoLogin();
    }, []);

    const handleKakaoLoginRequest = async (useremail: string) => {
        try {
            const response3 = await axios.post('http://localhost:7124/back/api/user/jwt/login/social', {
                userEmail: useremail
            });

            if (response3.status == 200) {
                if (response3.data === "is not exist") {
                    return navigate("/signup", { state: { email: useremail } })
                }

                dispatch(setToken(response3.data.token));
                // localStorage.setItem('token', response3.data.token);
                // 로그인 성공 후 홈페이지로 이동
                navigate('/');
            } else {
                console.log("로그인 처리중 오류가 발생하였습니다.");
            }
        } catch (err) {
            console.error('Failed to handle callback:', err);
        }
    }

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            console.error("Kakao SDK is not loaded");
            return;
        }

        window.Kakao.Auth.login({
            scope: "profile_nickname,profile_image,account_email",
            success: () => {
                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success: async (res) => {
                        const kakao_account = res.kakao_account;
                        localStorage.setItem("forKakaoNickname", kakao_account.profile.nickname);
                        handleKakaoLoginRequest(kakao_account.email); // 이메일로 로그인 요청
                    },
                    fail: (error) => {
                        console.error("Failed to get Kakao user info:", error);
                    },
                });
            },
            fail: (error) => {
                console.error("Kakao login failed:", error);
            },
        });
    };

    return (
        <div className="flex justify-center items-center h-screen text-2xl font-bold text-[#555]">
            Kakao 로그인 중입니다... 잠시만 기다려주세요! ⏳
        </div>
    );
};

export default KakaoLogin;
