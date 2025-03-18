import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChatMain from '../Chatbot/ChatMain.tsx';

const Main_Page = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const sliderRef = useRef<HTMLDivElement | null>(null);

    const emergencyServices = [
        { title: '24시간 응급실 운영', description: '연중무휴 응급진료 가능', image: '/images/사모예드우유.webp' },
        { title: '전문의 상주', description: '각 분야 전문의 진료', image: '/images/안주.webp' },
        { title: '최신 의료장비', description: 'CT, MRI 등 첨단장비', image: '/images/허스키부끄.webp' },
        { title: '진료 서비스', description: '모든 종류의 진료 가능', image: '/images/춘봉이.webp' },
        { title: '24시간 약국', description: '필요한 약 바로 제공', image: '/images/리트리버인절미.webp' },
        { title: '펫 호텔 서비스', description: '펫만을 위한 서비스', image: '/images/고양이무지.webp' }
    ];

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % emergencyServices.length); // 마지막 이미지 다음에 첫 번째 이미지가 이어짐
        }, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [emergencyServices.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % emergencyServices.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + emergencyServices.length) % emergencyServices.length);
    };

    return (
        <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
            {/* 첫번째 화면 */}
            <div className="snap-start h-screen w-full relative " style={{ backgroundImage: 'url("/images/home_image.webp")', backgroundSize: 'cover' }}>
                <main className="absolute inset-0 bg-black bg-opacity-50 py-60 z-10">
                    <section className="bg-transparent p-24">
                        <ChatMain />
                    </section>
                </main>
            </div>
            {/* 두번째 화면 */}
            <div className="snap-start h-screen w-full relative" style={{ backgroundImage: 'url("/images/home_image2.webp")', backgroundSize: 'cover', zIndex: 0 }}>
                <div className="absolute inset-0 bg-black bg-opacity-50" style={{ zIndex: 1 }}></div>
                <main className="max-w-7xl mx-auto px-16 py-48 flex flex-col justify-center space-y-6 z-20" style={{ position: 'relative', zIndex: 20 }}>
                    <section className="flex justify-between items-center bg-transparent text-white overflow-hidden py-48">
                        <div className="flex-shrink-0">
                            <h3 className="text-2xl font-semibold mb-6 text-center">자주 쓰는 메뉴</h3>
                            <ul className="space-y-4 text-lg text-center">
                                <li><Link to="/notice/all" className="hover:text-blue-400 transition-colors">공지사항</Link></li>
                                <li><Link to="/reservation" className="hover:text-blue-400 transition-colors">진료예약</Link></li>
                                <li><Link to="/information" className="hover:text-blue-400 transition-colors">오시는 길</Link></li>
                            </ul>
                        </div>

                        <div className="flex items-center">
                            <button onClick={handlePrev} className="p-3 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 mr-2">
                                <ChevronLeft className="h-8 w-8 text-white" />
                            </button>

                            <div className="flex justify-center items-center overflow-hidden w-full mx-2">

                                <div className="relative w-full overflow-hidden">
                                    <div className="flex"
                                        ref={sliderRef}
                                        style={{
                                            transition: 'transform 1000ms ease-in-out',
                                            transform: `translateX(-${currentIndex * 100 / 3}%)`,
                                            width: `${emergencyServices.length * 100 / 6}%`
                                        }}>
                                        {emergencyServices.concat(emergencyServices.slice(0, 3)).map((article, index) => (
                                            <div key={index} className="flex-shrink-0 flex justify-center items-center relative group" style={{ width: '33.3333%' }}>
                                                {/* 이미지 */}
                                                <img src={article.image} alt={article.title} className="w-60 h-64 object-cover rounded-xl" />

                                                {/* 오버레이 */}
                                                <div className="absolute w-60 h-64 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl translate-x+2">
                                                    <span className="text-white text-xl font-bold text-center px-3 ">{article.description}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>




                                <button onClick={handleNext} className="p-3 bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 ml-4 mr-0">
                                    <ChevronRight className="h-8 w-8 text-white" />
                                </button>
                            </div>
                        </div>


                    </section>
                </main>
            </div>


            {/* 세 번째 화면 - 아이콘 크기 및 색상 조정 */}
            <div className="snap-end h-[69vh] flex flex-col justify-center items-center overflow-hidden" style={{ background: '#000000' }}>
                <div className="grid grid-cols-4 gap-4 w-full max-w-7xl p-4">
                    <div className="p-7 text-white flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: '#1a3c70' }}>
                        <img src="/icons/bulb.webp" alt="Vision Icon" className="h-16 w-16" />
                        <h4 className="text-xl font-bold">비전</h4>
                        <p className="text-sm text-center whitespace-pre-wrap">{"최고 수준의 진료, 교육, 연구를 통하여 임상수의학 발전과 반려동물의 건강한 삶에 기여하는 월드클래스 동물병원"}</p>
                    </div>
                    <div className="p-6 text-white flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: '#206fbf' }}>
                        <img src="/icons/handshake.webp" alt="Culture Icon" className="h-16 w-16" />
                        <h4 className="text-xl font-bold">기업문화</h4>
                        <p className="text-sm text-center whitespace-pre-wrap">{"반려동물을 사랑한다면,\n멍트리오와 함께하세요!"}</p>
                    </div>
                    <div className="p-6 text-white flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: '#8b572a' }}>
                        <img src="/icons/atomic.webp" alt="Business Icon" className="h-16 w-16" />
                        <h4 className="text-xl font-bold">사업영역</h4>
                        <p className="text-sm text-center whitespace-pre-wrap">멍트리오의료센터는 의료센터를 기반으로 부설치료기관 운영, 동물 치료에 관한 연구, 수의학계와의 다양한 협력활동을 이어가고 있습니다.</p>
                    </div>
                    <div className="p-6 text-white flex flex-col items-center justify-center space-y-3" style={{ backgroundColor: '#6c757d' }}>
                        <img src="/icons/presentation.webp" alt="Academic Icon" className="h-16 w-16" />
                        <h4 className="text-xl font-bold">학술활동</h4>
                        <p className="text-sm text-center whitespace-pre-wrap">매 해마다 관련 대학과의 교류활동을 통해 취업향상 도움은 물론, 임직원을 위한 다방면의 교육지원에 앞장섭니다.</p>
                    </div>
                </div>
            </div>


        </div>



    );
};

export default Main_Page;


{/* <section className="grid md:grid-cols-2 gap-6">
                <MapComponent />
            </section> */}
