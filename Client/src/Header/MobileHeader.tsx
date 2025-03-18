import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from "../Main/Button";
import SheetProvider from "./components/SheetProvider";
import SheetTrigger from "./components/SheetTrigger";
import MobileNavLink from "../Main/MobileNavLink";
import SheetContent from './components/SheetContent';
import { Menu, User } from 'lucide-react';

const MobileHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	
    if (
        location.pathname.startsWith('/') ||
        location.pathname.startsWith('/signup/') 
      
    ) {
        return null;  // 해당 경로에서는 헤더를 렌더링하지 않음
    }

    return (
        <SheetProvider>
            <header className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
                <div className="px-4 py-3 flex items-center justify-between">
                    {/* 왼쪽 메뉴 버튼 */}
                    <SheetTrigger>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>

                    {/* 모바일 메뉴 내용 */}
                    <SheetContent>
                        <div className="mt-6 space-y-4">
                            <MobileNavLink href="/doctors" active>진료안내</MobileNavLink>
                            <MobileNavLink href="/reservation">진료예약</MobileNavLink>
                            <MobileNavLink href="review/UpboardList">사용후기</MobileNavLink>
                            <MobileNavLink href="/notice/all">공지사항</MobileNavLink>
                        </div>
                    </SheetContent>


                    {/* 오른쪽 사용자 아이콘 및 메뉴 */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="text-gray-700 hover:text-black"
                        >
                            <User className="h-6 w-6" />
                        </button>
                        
                        {/* 사용자 메뉴 */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-4 space-y-2 z-50">
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        navigate('/login/form');
                                    }}
                                    className="w-full text-black text-left hover:bg-gray-100 py-2 px-3 rounded"
                                >
                                    로그인
                                </button>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        navigate('/signup/agree');
                                    }}
                                    className="w-full text-black text-left hover:bg-gray-100 py-2 px-3 rounded"
                                >
                                    회원가입
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </SheetProvider>
    );
};

export default MobileHeader;