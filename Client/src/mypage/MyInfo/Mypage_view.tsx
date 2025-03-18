import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

interface userInfo {
  userNum: number;
  userName: string;
  userId: string;
  userPwd: string;
  userPhone: string;
  userBirth: number;
  userEmail: string;
  userAddress: string;
  userAddressNum: string;
  userStatus: string;
  userSignupDate: number;
}

const Mypage_view: React.FC = () => {

  const navigate = useNavigate();
  const { userNum } = useParams<{ userNum: string }>();

  const [user, setUser] = useState<userInfo>({
    userNum: 0,
    userName: '',
    userId: '',
    userPwd: '',
    userPhone: '',
    userBirth: 0,
    userEmail: '',
    userAddress: '',
    userAddressNum: '',
    userStatus: '',
    userSignupDate: 0,
  });
  const [password, setPassword] = useState({
    currentPassword: '',
  });
  const [changePageModal, setChangePageModal] = useState(false);
  const token = useSelector((state: any) => state.auth.token);


  const handleModelOpen = (): void => {
    setChangePageModal(true)
  };

  const handleCloseModel = () => {
    setChangePageModal(false);
  };


  const getUser = async () => {
    try {
      const response = await axios.get<userInfo>(`http://localhost:7124/back/api/user/one`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error('Error : ', error);
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  const handleVerifyPwd = async () => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/user/verifyPwd`, password,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status == 200) {
        handleCloseModel();
        navigate(`/mypage/edit`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log('Error :', error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getUser();
  }, []);

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);

    const year = date.getUTCFullYear();  // UTC 년도 가져오기
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // UTC 월 가져오기
    const day = String(date.getUTCDate()).padStart(2, '0');  // UTC 일 가져오기

    return `${year}-${month}-${day}`;
  }

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
            <div className="flex">
              <label className="w-32 font-semibold">이름</label>
              <p className="text-gray-600 font-semibold">{user?.userName}</p>
            </div>

            <div className="flex">
              <label className="w-32 font-semibold">아이디</label>
              <p className="text-gray-600 font-semibold">
                {
                  user?.userId != null
                    ? user?.userId
                    : "sns 회원가입 사용자"
                }
              </p>
            </div>

            <div className="flex">
              <label className="w-32 font-semibold">생년월일</label>
              <p className="text-gray-600 font-semibold">{user?.userBirth}</p>
            </div>

            <div className="flex">
              <label className="w-32 font-semibold">주소</label>
              <p className="text-gray-600 font-semibold">{user?.userAddress}</p>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">이메일 주소</label>
              <p className="text-gray-600 font-semibold">{user?.userEmail.split("@")[0]}</p>
              <span className="mx-2">@</span>
              <p className="text-gray-600 font-semibold">{user?.userEmail.split("@")[1]}</p>
            </div>

            <div className="flex">
              <label className="w-32 font-semibold">휴대전화</label>
              <p className="text-gray-600 font-semibold">{user?.userPhone.slice(0, 3)}</p>
              <span className="mx-2">-</span>
              <p className="text-gray-600 font-semibold">****</p>
              <span className="mx-2">-</span>
              <p className="text-gray-600 font-semibold">{user?.userPhone.slice(7,)}</p>
            </div>
            {
              user?.userId == null
                ?
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <h2 className="font-bold text-lg mb-4">연결 SNS 정보</h2>
                  <p className="text-yellow-600 font-semibold">Kakao (카카오)</p>
                  <p className="text-gray-500">연결일시: {user?.userSignupDate}</p>
                </div>
                : null}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md shadow hover:bg-red-600"
            onClick={handleModelOpen}>내 정보 수정하기</button>
        </div>
        {
          changePageModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
                <h1 className="text-xl font-semibold text-gray-900 mb-6">비밀번호 확인</h1>
                {
                  <div className="w-full max-w-md">
                    <p className="text-center text-lg mb-4">비밀번호를 입력해주세요</p>
                    <input
                      type="password"
                      name="currentPassword"
                      onChange={handleChange}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyPwd()}
                      placeholder="기존 비밀번호"
                      className="w-full border border-black rounded-md p-3 focus:outline-none"
                    />
                    <button
                      onClick={handleVerifyPwd}
                      className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                    >
                      다음
                    </button>
                  </div>
                }
                <button
                  onClick={handleCloseModel}
                  className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
                >
                  닫기
                </button>
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
}

export default Mypage_view