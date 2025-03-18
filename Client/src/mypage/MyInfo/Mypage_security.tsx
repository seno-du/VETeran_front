import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

interface userPwd {
  currentPassword: string;
  newPassword: string;
}

const Mypage_security: React.FC = () => {

  const [step, setStep] = useState(1);
  const [isChangePwdModalOpen, setIsChangePwdModalOpen] = useState(false);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);

  const token = useSelector((state: any) => state.auth.token);

  const [password, setPassword] = useState<userPwd>({
    currentPassword: '',
    newPassword: '',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleModelOpen = (number: number): void => {

    if (step > 1)
      setStep(1);

    if (number == 1) {
      setIsChangePwdModalOpen(true);
    } else {
      setIsUnsubscribeModalOpen(true);
    }
  };

  const handlePrev = () => {
    setIsChangePwdModalOpen(false);
    setIsUnsubscribeModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
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
      alert(response.data);
      if (response.status == 200) {
        handleNext();
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log('Error :', error);
    }
  }

  const handlechangePwd = async () => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/user/changePwd`, password,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      alert(response.data);
      if (response.status == 200) {
        setIsChangePwdModalOpen(false);
      }

    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log('Error :', error);
    }

  };

  const handleUnsubscribe = async () => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/user/unsubscription`, password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data);
      if (response.status == 200) {
        setIsUnsubscribeModalOpen(false);
      }
    } catch (error) {
      console.error('Error :', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">회원탈퇴 / 비밀번호 변경</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">비밀번호 변경 안내</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">비밀번호 변경 시 기존의 비밀번호를 입력해주세요.</li>
            <li className="mb-2">비밀번호는 영문, 숫자, 특수문자를 포함한 8글자로 입력해주세요.</li>
          </ul>
        </div>

        <div className="flex justify-center pb-4">
          <button onClick={() => handleModelOpen(1)} className="text-red-600 text-red px-6 py-2 rounded-md shadow hover:bg-red-600 hover:text-white flex items-center">
            비밀번호 변경
            <span className="ml-2">⚠</span>
          </button>
        </div>


        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">회원 탈퇴 관련 안내</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li className="mb-2">탈퇴가 정상적으로 처리되면, 회원가입 시 입력하셨던 고객님의 개인정보는 안전하게 모두 영구 삭제 처리됩니다.</li>
            <li className="mb-2">회원 탈퇴 시 홈페이지 이용 기록이 삭제되며, 고객님의 예약기록 및 개인 진료 기록 등은 삭제되지 않습니다.</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <button onClick={() => handleModelOpen(2)} className="text-red-600 text-red px-6 py-2 rounded-md shadow hover:bg-red-600 hover:text-white flex items-center">
            탈퇴하기
            <span className="ml-2">⚠</span>
          </button>
        </div>

        {/* ====================================================================================================================================== */}

        {isChangePwdModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">비밀번호 변경</h1>

              <div className="flex space-x-4 mb-8 justify-center items-center">
                {['기존 비밀번호 확인', '새로운 비밀번호 입력'].map((label, index) => (
                  <div
                    key={index}
                    className={`px-6 py-2 text-center rounded-full text-sm font-semibold ${step === index + 1 ? 'bg-red-500 text-white' : 'border border-gray-400 text-gray-400'}`}
                  >
                    {label}
                  </div>
                ))}
              </div>


              {step === 1 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">기존 비밀번호를 입력해주세요</p>
                  <input
                    type="password"
                    name="currentPassword"
                    onChange={handleChange}
                    placeholder="기존 비밀번호"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyPwd()}
                    className="w-full border border-black rounded-md p-3 focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyPwd}
                    className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                  >
                    다음
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">새로운 비밀번호를 등록해주세요</p>
                  <input
                    type="password"
                    name="newPassword"
                    onChange={handleChange}
                    placeholder="새로운 비밀번호"
                    onKeyDown={(e) => e.key === "Enter" && handlechangePwd()}
                    className="w-full border border-black rounded-md p-3 focus:outline-none"
                  />
                  <button
                    onClick={handlechangePwd}
                    className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                  >
                    다음
                  </button>
                </div>
              )}
              <button
                onClick={handlePrev}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {isUnsubscribeModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6">탈퇴하기</h1>

              <div className="flex space-x-4 mb-8 justify-center items-center">
                {['비밀번호 확인', '탈퇴하기'].map((label, index) => (
                  <div
                    key={index}
                    className={`px-6 py-2 rounded-full text-sm font-semibold ${step === index + 1 ? 'bg-red-500 text-white' : 'border border-gray-400 text-gray-400'}`}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">기존 비밀번호를 입력해주세요</p>
                  <input
                    type="password"
                    name="currentPassword"
                    onChange={handleChange}
                    placeholder="기존 비밀번호"
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyPwd()}
                    className="w-full border border-black rounded-md p-3 focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyPwd}
                    className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                  >
                    다음
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="w-full max-w-md">
                  <p className="text-center text-lg mb-4">정말로 탈퇴하시겠습니까?</p>
                  <button
                    onClick={handleUnsubscribe}
                    className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                  >
                    다음
                  </button>
                </div>
              )}
              <button
                onClick={handlePrev}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Mypage_security