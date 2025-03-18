import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../zustand/KakaoProfile';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import { useLocation, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userPwd, setUserPwd] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const { userEmail } = useProfileStore()
    const [userAddressNum, setUserAddressNum] = useState('');
    const [email, setEmail] = useState('');
    const [emailDomain, setEmailDomain] = useState('선택');
    const [customEmailDomain, setCustomEmailDomain] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isSocial, setIsSocial] = useState(false);
    const [showPostcode, setShowPostcode] = useState(false)
    const [code, setCode] = useState("");
    const [token, setToken] = useState("")
    const [isFormValid, setIsFormValid] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(false);


    useEffect(() => {
        setIsPhoneValid(phone1.length === 3 && phone2.length === 4 && phone3.length === 4);
    }, [phone1, phone2, phone3]);

    useEffect(() => {
        if (!isTimerActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerActive]);

    useEffect(() => {
        if (userEmail) {
            setIsSocial(true)
        }

    }, [userEmail])

    useEffect(() => {
        console.log("Signup 페이지에서 받은 location state:", location.state);  // state가 제대로 전달되었는지 확인
        if (location.state?.email) {
            setEmail(location.state.email.split('@')[0]);
            setEmailDomain(location.state.email.split('@')[1]);
        }
    }, [location]);


    useEffect(() => {
        setIsFormValid(Boolean(userId && userPwd && confirmPassword && userName && phone1 && phone2 && phone3 && userBirth));
        console.log(isFormValid)
    }, [userId, userPwd, confirmPassword, userName, phone1, phone2, phone3, userBirth])

    const handleCheckUsername = async () => {
        if (userId.trim().length === 0) {
            alert("아이디를 입력해주세요.")
            return
        }
        try {
            const response = await axios.get(`http://localhost:7124/back/api/user/jwt/idcheck?userId=${userId}`)

            if (response.data === true) {
                alert("사용 가능한 아이디입니다.");
            } else {
                alert("이미 사용중인 아이디 입니다.")
            }
        } catch {
            alert("아이디 중복 확인 중 오류가 발생했습니다.");
        }
    }

    const handlePostalCodeSearch = () => {
        setShowPostcode(true);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, part: string) => {
        const value = e.target.value.replace(/[^0-9]/g, '');

        if (part === 'part1') setPhone1(value);
        if (part === 'part2') setPhone2(value);
        if (part === 'part3') setPhone3(value);
    };


    const handlePhoneVerification = async () => {

        console.log(phone1 + phone2 + phone3)
        try {
            const userPhone = phone1 + phone2 + phone3;
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
            } else {
                alert("인증번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("인증 오류", error);
            alert("오류가 발생하였습니다.");
        }
    };


    const handlePostcodeComplete = (data: any) => {
        const fullAddress = data.address;
        const addressNum = data.zonecode;
        setUserAddress(fullAddress);
        setUserAddressNum(addressNum);
        setShowPostcode(false);
    };

    const handlePostcodeClose = () => {
        setShowPostcode(false);
    };


    const signUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userId.trim().length === 0) {
            alert("아이디를 입력해주세요.");
            return;
        }


        if (userAddress.trim().length === 0) {
            alert("주소를 입력해주세요.");
        };
        if (userAddressNum.trim().length === 0) {
            alert("우편번호를 입력해주세요.");
        };

        const userPhone = phone1 + phone2 + phone3;
        const finalEmailDomain = emailDomain !== "직접입력" ? emailDomain : customEmailDomain;
        const formData = {
            userId,
            userEmail: isSocial ? userEmail : email + "@" + finalEmailDomain,
            userPwd,
            userName,
            userBirth,
            userPhone: userPhone,
            userAddress: userAddress + " " + detailedAddress,
            userAddressNum
        }
        console.log("회원가입 데이터:", formData)
        try {
            const response = await axios.post("http://localhost:7124/back/api/user/jwt/signup", formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                }
            );
            if (response.status === 200 || (response.data && response.data.success)) {
                alert('회원가입이 완료되었습니다.');
                navigate("/")
                window.moveTo(0, 0)
            } else {
                alert('회원가입에 실패하였습니다.');
            }
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorType = error.response.data;

                    if (errorType === "ID_DUPLICATE") {
                        setErrorMessage("중복된 아이디 입니다.");
                    } else if (errorType === "EMAIL_DUPLICATE") {
                        setErrorMessage("중복된 이메일 입니다.");
                    } else if (errorType === "PHONE_DUPLICATE") {
                        setErrorMessage("이미 가입 된 전화번호 입니다.");
                    } else if (errorType === "PHONE_NOTAUTH") {
                        setErrorMessage("전화번호를 인증해주세요.");
                    } else if (errorType === "NONE_PASSWORD_TYPE") {
                        setErrorMessage("유효하지 않은 비밀번호 형식입니다.(8자리 이상, 공백 포함 불가, 영문, 숫자, 특수문자 포함).");
                    } else if (errorType === "NONE_EMAIL_TYPE") {
                        setErrorMessage("유효하지 않은 이메일 형식입니다.");
                    } else if (errorType === "TRIM_IN_NAME") {
                        setErrorMessage("이름에 공백을 제거해주세요.");
                    } else if (errorType === "NONE_ID_TYPE") {
                        setErrorMessage("유효하지 않은 아이디 형식입니다.");
                    } else if (errorType === "TRIM_IN_PWD") {
                        setErrorMessage("비밀번호에 공백을 제거해주세요.");
                    }
                    else {
                        setErrorMessage("알 수 없는 오류가 발생했습니다.");
                    }
                } else {
                    setErrorMessage("네트워크 오류가 발생했습니다.");
                }
            } else {
                setErrorMessage("알 수 없는 오류가 발생했습니다.");
            }
        }
    };
    useEffect(() => {
        if (confirmPassword && userPwd !== confirmPassword) {
            setPasswordError('비밀번호가 다릅니다');
        } else {
            setPasswordError('');
        }
    }, [userPwd, confirmPassword]);

    useEffect(() => {
        // 모든 필수 입력값이 채워졌는지 확인
        setIsFormValid(
            userId.trim() !== '' &&
            userPwd.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            userName.trim() !== '' &&
            phone1.trim() !== '' &&
            phone2.trim() !== '' &&
            phone3.trim() !== '' &&
            userBirth.trim() !== '' &&
            userAddress.trim() !== '' &&
            userAddressNum.trim() !== '' &&
            detailedAddress.trim() !== '' &&
            email.trim() !== '' &&
            (emailDomain !== '선택' || customEmailDomain.trim() !== '') &&
            passwordError === ''
        );
    }, [userId, userPwd, confirmPassword, userName, phone1, phone2, phone3, userBirth, userAddress, userAddressNum, detailedAddress, email, emailDomain, customEmailDomain, passwordError]);


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-[864px]">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">회원가입</h1>
                <p className="text-gray-500 text-center text-sm mb-6">
                    동물병원 서비스를 이용하시려면 회원가입을 해주세요
                </p>

                <form onSubmit={signUp} className="space-y-4">
                    <div className="flex flex-wrap items-center">
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-0.5 w-full md:w-auto">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            placeholder="아이디"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all ml-1"
                        />
                        <button
                            type="button"
                            onClick={handleCheckUsername}
                            className="mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors ml-2"
                        >
                            아이디 중복 확인
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center">
                        <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-0.5 w-full md:w-auto">
                            이메일
                        </label>
                        <div className="flex space-x-2 items-center w-full md:w-auto">
                            {/* 이메일 아이디 입력 */}
                            <input
                                type="text"
                                placeholder="이메일"
                                value={isSocial ? userEmail.split("@")[0] : email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all ml-1"
                                disabled={isSocial ? true : false} // email 값이 있으면 입력 불가능
                            />
                            <span>@</span>

                            {/* 이메일 도메인 입력 */}
                            {isSocial ? (
                                <input
                                    className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                                    value={userEmail.split("@")[1]}
                                    disabled
                                />
                            ) : (
                                <>
                                    {emailDomain === "직접입력" ? (
                                        <input
                                            type="text"
                                            placeholder="직접 입력"
                                            value={customEmailDomain}
                                            onChange={(e) => setCustomEmailDomain(e.target.value)}
                                            className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                                            disabled={!!customEmailDomain} // 도메인 값이 있으면 입력 불가능
                                        />
                                    ) : (
                                        <select
                                            value={emailDomain}
                                            onChange={(e) => setEmailDomain(e.target.value)}
                                            className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                                        >
                                            <option value="">선택</option>
                                            <option value="직접입력">직접입력</option>
                                            <option value="naver.com">naver.com</option>
                                            <option value="daum.net">daum.net</option>
                                            <option value="gmail.com">gmail.com</option>
                                            <option value="yahoo.com">yahoo.com</option>
                                            <option value="kakao.com">kakao.com</option>
                                            <option value="hanmail.net">hanmail.net</option>
                                            <option value="nate.com">nate.com</option>
                                            <option value="hotmail.com">hotmail.com</option>
                                            <option value="korea.com">korea.com</option>
                                            <option value="dreamwiz.com">dreamwiz.com</option>
                                            <option value="chol.com">chol.com</option>
                                            <option value="lycos.co.kr">lycos.co.kr</option>
                                            <option value="empal.com">empal.com</option>
                                        </select>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-0.5">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="비밀번호"
                            value={userPwd}
                            onChange={(e) => setUserPwd(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-0.5">비밀번호 확인</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-0.5">이름</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="이름"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full md:w-1/5 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="birth" className="block text-sm font-medium text-gray-700 mb-0.5">생년월일</label>
                        <input
                            type="date"
                            id="dob"
                            value={userBirth}
                            onChange={(e) => setUserBirth(e.target.value)}
                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-0.5">전화번호</label>
                        <div className="flex flex-wrap space-x-2 items-center">
                            <input
                                type="text"
                                id="phone1"
                                value={phone1}
                                onChange={(e) => handlePhoneChange(e, 'part1')}
                                maxLength={3}
                                placeholder="010"
                                className="w-1/2 md:w-1/6 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                            <span className="flex items-center">-</span>
                            <input
                                type="text"
                                id="phone2"
                                value={phone2}
                                onChange={(e) => handlePhoneChange(e, 'part2')}
                                maxLength={4}
                                placeholder="0000"
                                className="w-1/2 md:w-1/5 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                            <span className="flex items-center">-</span>
                            <input
                                type="text"
                                id="phone3"
                                value={phone3}
                                onChange={(e) => handlePhoneChange(e, 'part3')}
                                maxLength={4}
                                placeholder="0000"
                                className="w-1/2 md:w-1/5 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
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
                    </div>

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

                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-0.5">우편번호</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="postalCode"
                                placeholder="우편번호"
                                value={userAddressNum}
                                onChange={(e) => setUserAddressNum(e.target.value)}
                                className="w-2/5 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={handlePostalCodeSearch}
                                className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                우편번호 찾기
                            </button>
                        </div>
                    </div>

                    {showPostcode && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                            <div className="relative w-[400px] h-[500px]">
                                <DaumPostcode onComplete={handlePostcodeComplete} />
                                <button
                                    type="button"
                                    onClick={handlePostcodeClose}
                                    className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 mb-0.5">주소</label>
                        <input
                            type="text"
                            id="userAddress"
                            placeholder="주소"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="detailedAddress" className="block text-sm font-medium text-gray-700 mb-0.5">상세주소</label>
                        <input
                            type="text"
                            id="detailedAddress"
                            placeholder="상세주소"
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                        />
                    </div>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <button
                        type="submit"
                        disabled={!isFormValid} // 모든 입력값이 채워져야 활성화됨
                        className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer 
        ${isFormValid ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                    >
                        가입하기
                    </button>
                </form>
            </div>
        </div>
    );

};

export default SignUp;
