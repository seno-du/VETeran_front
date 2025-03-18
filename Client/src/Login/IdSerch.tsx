import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const IdSerch: React.FC = () => {

    const [userInfo, setUserInfo] = useState({
        email: '',
        name: '',
    });
    const [userId, setUserId] = useState('');
    const [IdSerchCheck, setIdSerchCheck] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIdSerchCheck(true);
        console.log(IdSerchCheck);
    }

    const handleCheckUserInfo = async () => {
        try {
            if (userInfo.email === '' || userInfo.name === '') {
                alert('이메일와 이름을 입력해주세요');
                return;
            }
            const response = await axios.post(`http://localhost:7124/back/api/user/searchId`,userInfo,
                {
                    headers: {
                    'Content-Type': 'application/json',  // JSON으로 데이터 보내기
                  }
                }
            );
            if (response.status === 200) {
                setUserId(response.data);
                setIdSerchCheck(true);
            }
        } catch (error : any) {
            console.error('Error :', error);
            alert(error.response.data);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    return (

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">아이디 찾기</h1>
                {!IdSerchCheck ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                name='email'
                                placeholder="이메일"
                                value={userInfo.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name='name'
                                placeholder="이름"
                                value={userInfo.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleCheckUserInfo}
                            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            아이디 찾기
                        </button>
                    </form>
                ) : (
                    <>
                        {userId ? (
                            <>
                                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center shadow-md w-full max-w-sm mx-auto">
                                    <p className="text-lg font-semibold text-gray-700">회원님의 아이디는</p>
                                    <p className="text-2xl font-bold text-red-500 mt-2">{userId.slice(0, (userId.length/2))}{userId.slice(userId.length/2).replace(/./g, '*')}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                                        onClick={() => navigate('/login/passwordreset')}
                                    >
                                        비밀번호찾기 이동
                                    </button>

                                </div>
                            </>
                        ) : (
                            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center shadow-md w-full max-w-sm mx-auto">
                                <p className="text-lg font-semibold text-gray-700">일치하는 회원이 없습니다.</p>
                                <p className="text-lg font-semibold text-gray-700 mt-2">성함과 이메일을 한번 더 확인해주세요.</p>
                            </div>
                        )}
                    </>

                )}


                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => navigate('/')}>
                            홈화면으로 이동
                        </button>
                        <button className="w-full py-3 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium" onClick={() => navigate('/login/form')}>
                            로그인 화면
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IdSerch