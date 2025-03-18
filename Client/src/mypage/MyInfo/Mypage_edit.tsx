import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { useSelector } from 'react-redux';

interface userInfo {
  userNum: number;
  userName: string;
  userId: string;
  userPwd: string;
  userPhone: string;
  userBirth: string;
  userEmail: string;
  userAddress: string;
  userdetailedAddress: string;
  userAddressNum: string;
  userStatus: string;
  userSignupDate: string;
}

// interface userEdit {
//   userPhone : number;
//   userEmail : string;
//   userAddress : string;
//   userAddressNum : string;
// }


const Mypage_edit: React.FC = () => {

  const navigate = useNavigate();

  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');

  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false)

  const [code, setCode] = useState("");
  const [token, setToken] = useState("")

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [address, setAddress] = useState({
    address: '',
    addressNum: ''
  });

  const userToken = useSelector((state: any) => state.auth.token);
  
  const [user, setUser] = useState<userInfo>({
    userNum: 0,
    userName: '',
    userId: '',
    userPwd: '',
    userPhone: '',
    userBirth: '',
    userEmail: '',
    userAddress: '',
    userdetailedAddress: '',
    userAddressNum: '',
    userStatus: '',
    userSignupDate: '',
  });


  const getUser = async () => {
    try {
      const response = await axios.get<userInfo>(`http://localhost:7124/back/api/user/one`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEditUserInfo = async () => {
    try {
      const response = await axios.post<userInfo>(
        `http://localhost:7124/back/api/user/updateUserInfo`,
        user,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert(response.data);
        navigate('/mypage/view');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handlePhoneVerification = async () => {

    try {
      const userPhone = phone1 + phone2 + phone3;

      console.log("전화번호:", userPhone);

      const response = await axios.post(
        'http://localhost:8000/phone/verify/',
        { phone_number: userPhone },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {

        setToken(response.data.token)
        setIsVerificationCodeSent(true);

        alert("인증번호가 전송되었습니다.");

        setTimeLeft(300); // 5분(300초) 타이머 시작
        setIsTimerActive(true); // 타이머 활성화

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

    console.log("보낼 코드:", code);  // 입력한 코드 확인
    console.log("보낼 토큰:", token); // 토큰 값 확인

    try {
      const response = await axios.post(
        "http://localhost:7124/back/api/user/jwt/verifycode",
        { code: code, token: token },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const data = response.data.result;

      if (data) {
        alert("인증번호가 확인되었습니다.");
        setIsTimerActive(false);

        const updatedUserPhone = phone1 + phone2 + phone3;
        setUser({ ...user, userPhone: updatedUserPhone });
        
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 오류", error);
      alert("오류가 발생하였습니다.");
    }
  };

  const handlePostalCodeSearch = () => {
    setShowPostcode(true);
  };

  useEffect(() => {
    if (phone1.length === 3 && phone2.length === 4 && phone3.length === 4) {
      setIsPhoneValid(true);  // 전화번호가 모두 입력되면 버튼 활성화
    } else {
      setIsPhoneValid(false);  // 입력이 불완전하면 버튼 비활성화
    }
  }, [phone1, phone2, phone3]);  // phone1, phone2, phone3이 변경될 때마다 실행

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, part: string) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용

    if (part === 'part1') {
      setPhone1(value);
    } else if (part === 'part2') {
      setPhone2(value);
    } else if (part === 'part3') {
      setPhone3(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePostcodeComplete = (data: any) => {
    const fullAddress = data.address;
    const addressNum = data.zonecode;

    setAddress({ address: fullAddress, addressNum: addressNum });
    setUser({ ...user, userAddress: fullAddress, userAddressNum: addressNum });

    setShowPostcode(false); // 주소 선택 후 팝업을 닫음
  };

  const handlePostcodeClose = () => {
    setShowPostcode(false); // 닫기 버튼을 눌렀을 때 팝업을 닫음
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">내 정보관리</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6 text-center">
          <div className="text-red-600 text-lg font-semibold">{user?.userName}님의 개인정보관리</div>
          <p className="text-gray-500">회원가입일 {user?.userSignupDate}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">회원 정보 입력</h2>
          <div className="space-y-4">

            <div className="flex items-center">
              <label className="w-32 font-semibold">이름</label>
              <p className="text-gray-600 font-semibold">{user?.userName}</p>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">아이디</label>
              <p className="text-gray-600 font-semibold">
                {
                  user?.userId != null
                    ? user?.userId
                    : "sns 회원가입 사용자"
                }
              </p>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">생년월일</label>
              <p className="text-gray-600 font-semibold">{user?.userBirth}</p>
            </div>

            <div className="flex items-center">
              <label htmlFor="postalCode" className="w-32 font-semibold">주소</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="userAddressNum"
                  id="postalCode"
                  placeholder={user?.userAddressNum}
                  value={address.addressNum}
                  onChange={handleChange}
                  className="w-2/7 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handlePostalCodeSearch}
                  className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                > 우편번호 찾기 </button>
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

            <div className="flex items-center">
              <label htmlFor="postalCode" className="w-32 font-semibold"></label>
              <input
                type="text"
                name="userAddress"
                placeholder={user?.userAddress}
                value={address.address}
                onChange={handleChange}
                className="w-3/5 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="postalCode" className="w-36 font-semibold"></label>
              <input
                type="text"
                name="detailedAddress"
                placeholder="상세주소"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">이메일 주소</label>
              <p className="text-gray-600 font-semibold">{user?.userEmail.split("@")[0]}</p>
              <span className="mx-2">@</span>
              <p className="text-gray-600 font-semibold">{user?.userEmail.split("@")[1]}</p>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">전화번호</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="phone1"
                  placeholder={user?.userPhone.slice(0, 3)}
                  value={phone1}
                  onChange={(e) => handlePhoneChange(e, 'part1')}
                  maxLength={3}
                  className="w-1/6 px-4 py-3 rounded-lg border border-gray-200"
                />
                <span className="flex items-center">-</span>
                <input
                  type="text"
                  id="phone2"
                  placeholder={user?.userPhone.slice(3, 7)}
                  value={phone2}
                  onChange={(e) => handlePhoneChange(e, 'part2')}
                  maxLength={4}
                  className="w-1/5 px-4 py-3 rounded-lg border border-gray-200"
                />
                <span className="flex items-center">-</span>
                <input
                  type="text"
                  id="phone3"
                  placeholder={user?.userPhone.slice(7,)}
                  value={phone3}
                  onChange={(e) => handlePhoneChange(e, 'part3')}
                  maxLength={4}
                  className="w-1/5 px-4 py-3 rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handlePhoneVerification}
                  disabled={!isPhoneValid}
                  className={`ml-2 py-2 px-4 rounded-lg transition-colors ${isPhoneValid
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    }`}
                >
                  인증번호 받기
                </button>
              </div>
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
                    className="w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  > 인증번호 확인
                  </button>
                  <span className="text-red-500 font-bold ml-2">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
            onClick={handleEditUserInfo}>내 정보 저장</button>
        </div>
      </div>
    </div>
  );
}

export default Mypage_edit