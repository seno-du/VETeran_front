import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Reservation_Home: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const token = useSelector((state: any) => state.auth.token);

    useEffect(() => {
        if (token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [token]);

    // 로그인 여부를 확인하고 예약 페이지로 이동
    const handleReservationRedirect = (path: string) => {
        if (!isLogin) {
            alert('로그인 후 이용해주세요.');
            navigate('/login/form'); // 로그인 페이지로 이동
        } else {
            navigate(path); // 로그인 되어 있으면 예약 페이지로 이동
        }
    };


    return (
        <div className="max-w-7xl mx-auto py-10 px-5 bg-white">
            <h1 className="text-4xl font-bold text-left mb-3 mt-6">인터넷 진료예약</h1>
            <div className="w-full bg-gray-200 h-0.5 my-4"></div>
            <div className="text-center w-full">
                <h2 className="text-5xl font-black mb-3 mt-14" style={{ marginTop: '100px' }}>멍트리오 동물병원</h2>
                <h3 className="text-2xl font-bold mb-5">인터넷 진료예약 서비스</h3>
                <p className="text-lg font-medium">인터넷진료예약은 진료과 및 의료진으로 예약할 수 있습니다.</p>
            </div>
            <div className="relative grid grid-cols-2 gap-10 mb-24" style={{ marginBottom: '220px', marginTop: '130px' }}>
                <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-sm"
                    style={{ height: 'calc(100% + 6rem)', top: '-3rem', margin: '4% 3%', width: '95%' }}>
                </div>
                <div className="flex flex-col items-center p-8 bg-gray-50 rounded-xl shadow-sm z-10 w-full"
                    style={{ maxWidth: '450px', transform: 'translateX(30%)', height: '645px', marginTop: '100px' }}>
                    <h3 className="text-3xl font-bold mb-4" style={{ marginTop: '100px', marginBottom: '20px' }}>진료과로 예약</h3>
                    <p className="text-gray-800 mb-6 text-center" style={{ maxWidth: '380px' }}>
                        진료과명을 알고 계신 경우 해당 진료과에서<br />
                        예약이 가능한 전체 의료진을 확인하실 수 있습니다.
                    </p>
                    <button
                        onClick={() => handleReservationRedirect('/department_selection')}
                        className="bg-white hover:bg-black text-black hover:text-white text-lg font-bold py-2 px-6 rounded border border-black my-4">
                        예약하기
                    </button>
                    <img src="/images/reservation_left.webp"
                        alt="진료과 예약"
                        className="mt-2 w-96 h-auto block"
                        style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <div className="flex flex-col items-center p-8 bg-gray-50 rounded-xl shadow-sm z-10 w-full"
                    style={{ maxWidth: '450px', marginTop: '100px', height: '640px' }}>
                    <h3 className="text-3xl font-bold mb-4" style={{ marginTop: '100px', marginBottom: '20px' }}>의료진으로 예약</h3>
                    <p className="text-gray-800 mb-6 text-center" style={{ maxWidth: '480px' }}>
                        의료진 성명 혹은 전문 진료분야를 알고 계신 경우<br />
                        해당 의료진에 대한 일정을 확인할 수 있습니다.
                    </p>
                    <button
                        onClick={() => handleReservationRedirect('/department_find')}
                        className="bg-white hover:bg-black text-black hover:text-white text-lg font-bold py-2 px-6 rounded border border-black my-4">
                        예약하기
                    </button>
                    <img src="/images/reservation_right.webp"
                        alt="의료진 예약"
                        className="mt-4 w-96 h-auto block"
                        style={{ maxWidth: '100%', position: 'relative', top: '65px', bottom: '-20px' }} />
                </div>
            </div>
        </div>
    );
}

export default Reservation_Home;
