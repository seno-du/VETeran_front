const Footer = () => {
    return (
        <footer className="hidden lg:block pt-4 border-t" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // 검정색 반투명 배경
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">
                {/* 병원 정보 및 진료시간을 한 줄로 배치 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 text-center md:text-left">
                    {/* 병원 정보 */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-semibold text-white mb-3">동물병원</h3>
                        <div className="space-y-1 text-sm text-gray-300">
                            <p>서울특별시 강남구 테헤란로 123</p>
                            <p>Tel: 02-1234-5678</p>
                            <p>Email: info@hospital.com</p>
                        </div>
                    </div>

                    {/* 진료시간 */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-semibold text-white mb-3">진료시간</h3>
                        <div className="space-y-1 text-sm text-gray-300">
                            <p>평일: 09:00 - 21:00</p>
                            <p>토요일: 09:00 - 18:00</p>
                            <p>일요일/공휴일: 09:00 - 17:00</p>
                            <p className="text-red-400">* 응급진료 24시간 가능</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-4 border-t text-center text-sm text-gray-400 w-full" style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                }}>
                    © 2024 동물병원. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
