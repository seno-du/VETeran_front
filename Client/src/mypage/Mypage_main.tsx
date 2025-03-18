import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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
  userAddressNum: string;
  userStatus: string;
  userSignupDate: string;
}

const Mypage_main: React.FC = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState<userInfo>();
  const token = useSelector((state: any) => state.auth.token);
  console.log(token)

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/user/one`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">마이차트</h1>

        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-red-500 text-white font-bold text-xl rounded-full w-10 h-10 flex items-center justify-center">
              {user?.userName.charAt(0).toUpperCase()}
            </div>
            <span className="ml-3 font-semibold text-lg">{user?.userName}님 반갑습니다!</span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">나의 정보 관리</h2>
            <ul className="divide-y divide-gray-300">
              {[
                { icon: '🧑', title: '나의 정보 관리', path: `/mypage/view` },
                { icon: '🔒', title: '개인 / 보안', path: `/mypage/security` },
                { icon: '💬', title: '멍트리오 상담 내역', path: '/mypage/chatHistory' },
                { icon: '⚙️', title: '공지사항', path: '/notice/all' },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-4 px-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(item.path)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-base font-medium">{item.title}</span>
                  </div>
                  <span className="text-gray-400">{'>'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {[
            { icon: '🐾', title: '반려동물 관리', count: 0, path: `/mypage/petInfo` },
            { title: '예약내역', icon: '📅', count: 0, path: `/mypage/reservation` },
            { title: '진료이력 및 입원일정', icon: '🩺', count: 0, path: `/mypage/medicalHistory` },
          ].map((item, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-6 shadow bg-white relative">
              <div className="text-lg font-semibold">{item.title}</div>
              <div className="text-5xl my-4">
                <button
                  className="font-bold text-red-500 rounded-lg p-6 px-4 py-2 hover:scale-110 transition-transform"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                </button>
              </div>
              {item.title}
              {item.count > 0 && (
                <>
                  <span className="mx-2"> : </span>
                  {item.count} 건
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Mypage_main