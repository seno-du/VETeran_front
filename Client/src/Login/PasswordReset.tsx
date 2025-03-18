import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const PasswordReset: React.FC = () => {

    const [userInfoCheck, setUserInfoCheck] = useState({
        userId: '',
        userPhone: '',
    });
    const [passwordReset, setPasswordReset] = useState(false);
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [token, setToken] = useState("")
    const [timeLeft, setTimeLeft] = useState(0);
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [code, setCode] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setPasswordReset(true);
    }

    useEffect(() => {
        const phoneNumber = phone1 + phone2 + phone3;
        setIsPhoneValid(phoneNumber.length === 11);
    }, [phone1, phone2, phone3]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, part: string) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (part === 'part1') setPhone1(value);
        if (part === 'part2') setPhone2(value);
        if (part === 'part3') setPhone3(value);
    };

    useEffect(() => {
        if (isTimerActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // 클린업 함수 추가
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
        }
    }, [isTimerActive, timeLeft]);

    const handlePhoneVerification = async () => {

        console.log(phone1 + phone2 + phone3)
        try {
            const userPhone = phone1 + phone2 + phone3;
            setUserInfoCheck({...userInfoCheck, userPhone : userPhone})
            const response = await axios.post(
                'http://localhost:8000/phone/verify/',
                { phone_number: userPhone },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                setToken(response.data.token)
                setIsVerificationCodeSent(true);
                alert("인증번호가 전송되었습니다.");
                setTimeLeft(300);
                setIsTimerActive(true);
            } else {
                alert('인증번호 전송이 실패하였습니다. 잠시 후 다시 시도하세요.')
            }
            if (timeLeft === 1) {
                alert("인증번호 유효 시간이 만료되었습니다. 다시 시도해주세요.");
                return;
            }
        } catch (error) {
            console.error('인증번호 전송 에러', error)
            alert('인증번호 전송 중 오류가 발생했습니다.')
        }
    }

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(
                "http://localhost:7124/back/api/user/jwt/verifycode",
                { code: code, token: token }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            );
            const data = response.data.result;

            if (data) {
                alert("인증번호가 확인되었습니다.");
                setIsTimerActive(false);
                getTemporaryPasswordResetToken();
            } else {
                alert("인증번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("인증 오류", error);
            alert("오류가 발생하였습니다.");
        }
    };

    const getTemporaryPasswordResetToken = async () => {
        try {
            console.log(userInfoCheck.userPhone)
            console.log(userInfoCheck.userId)

            const response = await axios.post(`http://localhost:7124/back/api/user/jwt/resetPassword`,userInfoCheck,
                {
                    headers: {
                      'Content-Type': 'application/json',
                    }
                  }
            );

            if (response.status === 200) {
                navigate('/login/passwordresetPage', { state: { token: response.data.token } });
            }

        } catch (error : any) {
            console.error('Error :', error);
            alert(error.response.data);
        }
    };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfoCheck({ ...userInfoCheck, [e.target.name]: e.target.value });
      };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">비밀번호 재설정</h1>
                {!passwordReset ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                            <input
                                type="text"
                                name='userId'
                                placeholder="아이디"
                                value={userInfoCheck.userId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={phone1}
                                    onChange={(e) => handlePhoneChange(e, 'part1')}
                                    maxLength={3}
                                    placeholder="010"
                                    className="w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                />
                                <span className="flex items-center">-</span>
                                <input
                                    type="text"
                                    value={phone2}
                                    onChange={(e) => handlePhoneChange(e, 'part2')}
                                    maxLength={4}
                                    placeholder="0000"
                                    className="w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                />
                                <span className="flex items-center">-</span>
                                <input
                                    type="text"
                                    value={phone3}
                                    onChange={(e) => handlePhoneChange(e, 'part3')}
                                    maxLength={4}
                                    placeholder="0000"
                                    className="w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handlePhoneVerification}
                            disabled={!isPhoneValid}
                            className={`py-2 px-4 rounded-lg transition-colors mt-2 ${isPhoneValid
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-300 text-gray-700 cursor-not-allowed"
                                }`}
                        >
                            인증번호 받기
                        </button>
                        {isVerificationCodeSent && (
                            <div>
                                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-0.5">인증번호</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        id="verificationCodeInput"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="인증번호"
                                        className="w-1/2 md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        인증번호 확인
                                    </button>
                                    <span className="text-red-500 font-bold ml-2 mt-7">
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="text-center text-gray-700 font-medium">인증 번호가 성공적으로 전송되었습니다.<br />인증번호를 확인해주세요.</div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <button className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium" onClick={() => navigate('/')}>홈으로</button>
                        <button className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium" onClick={() => navigate('/login/form')}>로그인</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordReset;
