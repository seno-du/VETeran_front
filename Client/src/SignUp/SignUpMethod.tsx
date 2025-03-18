import React, { useEffect} from 'react';
import { useNavigate } from "react-router-dom";
// import { loginService } from '../services/loginService';
import { useProfileStore } from '../zustand/KakaoProfile';

const KAKAOAPIKEY = "0c3cef55aaafd667f4eb1d903f66683e"
const SignUpMethod: React.FC = () => {

    const navigate = useNavigate();
    const { setUserEmail } = useProfileStore();

    useEffect(() => {
        if (window.Kakao) {
            window.Kakao.init(KAKAOAPIKEY);
        } else {
            const script = document.createElement('script');
            script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
            script.onload = () => {
                window.Kakao.init(KAKAOAPIKEY);
            };
            document.head.appendChild(script);
        }
    }, []);

    const handleKakaoSignUp = () => {
        console.log('카카오로 회원가입 시작');

        if (!window.Kakao) {
            console.error("Kakao SDK가 로드되지 않았습니다.");
            return;
        }

        window.Kakao.Auth.login({
            scope: "account_email, profile_nickname,profile_image",
            success: (authObj: unknown) => {
                console.log(authObj);

                window.Kakao.API.request({
                    url: "/v2/user/me",
                    success: async (res: any) => {
                        const kakao_account = res.kakao_account;
                        localStorage.setItem("forKakaoEmail", kakao_account.email);

                        console.log("이메일", kakao_account.email)
                        try {
                            setUserEmail(kakao_account.email)
                            navigate("/signup");
                        } catch (error) {
                            console.log(error)
                        }
                    },
                    fail: (error) => {
                        console.error("카카오 사용자 정보를 가져오는 데 실패했습니다:", error);
                    },
                });
            },

            fail: (error) => {
                console.error("카카오 로그인 실패:", error);
            },
        });
    };

    const handleNaverSignUp = async () => {
        console.log('네이버로 회원가입 시작');
        navigate('/login/naver')
    };

    const handleSmsSignUp = () => {
        console.log('문자인증으로 회원가입 시작');
        navigate("/signup");
    };

    const handleGoogleSignUp = () => {
        console.log('구글로 회원가입 시작');
        navigate("/login/google");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">회원가입</h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                    동물병원 서비스를 이용하려면 회원가입이 필요합니다.
                </p>
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center text-gray-500 text-sm mb-6">간편 회원가입</div>
                    <div className="space-y-4">
                        <button
                            type="button"
                            className="w-full bg-yellow-400 text-black py-4 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center space-x-3"
                            onClick={handleKakaoSignUp}
                        >
                            <img src="/icons/kakao_icon.svg" alt="Kakao" className="w-6 h-6" />
                            <span>카카오로 회원가입</span>
                        </button>

                        <button
                            type="button"
                            className="w-full bg-green-500 text-black py-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-3"
                            onClick={handleNaverSignUp}
                        >
                            <img src="/icons/naver_icon.svg" alt="Naver" className="w-6 h-6" />
                            <span>네이버로 회원가입</span>
                        </button>


                        <button
                            type="button"
                            className="w-full bg-blue-500 text-black py-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-3"
                            onClick={handleSmsSignUp}
                        >
                            <img src="/icons/sms_icon.svg" alt="SMS" className="w-6 h-6" />
                            <span>문자인증으로 회원가입</span>
                        </button>

                        <button
                            id="googleSignInBtn"
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="w-full bg-gray-400 text-black py-4 rounded-lg hover:bg-gray-500 transition-colors font-medium flex items-center justify-center space-x-3"
                        >
                            <img src="/icons/google_icon.svg" alt="Google" className="w-6 h-6" />
                            <span>구글로 회원가입</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpMethod;
