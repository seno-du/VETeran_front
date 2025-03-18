import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';
import Button from "../Main/Button";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../zustand/profileSlice';

const DesktopHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    // const token = localStorage.getItem("token");  // localStorage에서 토큰 가져오기
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const token = useSelector((state: any) => state.auth.token);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("token: ", token)


        if (token) {
            setIsLogin(true);
            fetchUser();
        } else {
            setIsLogin(false);
        }
    }, [token]);

    const fetchUser = async () => {
        if (token) {
            try {
                const response = await axios.get(`http://localhost:7124/back/api/user/one`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log("User data:", response.data);
                setUserName(response.data.userName);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");  // localStorage에서 토큰 제거
        setIsLogin(false);
        dispatch(setToken(""));
        navigate("/");
        // window.location.reload();
    };

    const navItems = [
        { path: '/doctors', label: '진료안내' },
        { path: '/reservation', label: '진료예약' },
        { path: '/review/UpboardList', label: '사용후기' },
        { path: '/notice/all', label: '공지사항' }
    ];

    // const paddingTop = location.pathname === '/' ? '0' : '64px'; // 메인 홈에서는 0, 다른 페이지에서는 64px

    useEffect(() => {
        // ✅ 페이지 이동 시 드롭다운 자동 닫기
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);
    

    return (
        <>
            {/* 홈 화면일 때는 `absolute`, 그 외에는 `sticky` */}
            <nav className={`top-0 left-0 right-0 flex items-center justify-between w-full px-4 py-3 z-50 bg-black bg-opacity-75 
    ${location.pathname === '/' ? 'absolute' : 'sticky'} 
    ${!location.pathname.startsWith('/doctors') && !location.pathname.startsWith('/reservation') ? 'border-b border-solid border-white border-opacity-20' : ''}`}
                style={{ zIndex: 1040 }}>

                <div className="hidden lg:flex items-center space-x-8">
                    <Link to={'/'}>
                        <h1 className="text-xl font-bold text-white">동물병원</h1>
                    </Link>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`font-medium text-white hover:text-blue-500 hover:font-bold transition-colors ${location.pathname === item.path ? 'underline' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center space-x-4">
                    {isLogin ? (
                        <>
                            <Button onClick={() => { setIsUserMenuOpen(false); navigate('/mypage/main'); }} className="text-white font-medium bg-transparent hover:bg-white hover:text-black border border-white py-2 px-4">{userName}님</Button>
                            <Button onClick={handleLogout} className="text-white font-medium bg-transparent hover:bg-white hover:text-black border border-white py-2 px-4">로그아웃</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login/form')} className="text-white font-medium bg-transparent hover:bg-white hover:text-black border border-white py-2 px-4">로그인</Button>
                            <Button onClick={() => navigate('/signup/agree')} className="text-white font-light bg-transparent hover:bg-white hover:text-black border border-white py-2 px-4">회원가입</Button>
                        </>
                    )}
                </div>


                {/* 모바일 메뉴 버튼 */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative lg:hidden text-white p-2 z-[1051]"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* 타이틀 (모바일 환경에서 중앙에 표시) */}
                <div className="lg:hidden flex-1 flex justify-center z-[1051]">
                    <Link to={'/'}>
                        <h1 className="text-xl font-bold text-white">동물병원</h1>
                    </Link>
                </div>

                {/* 모바일 환경: 오른쪽 로그인 및 회원가입 버튼 (오른쪽 벽) */}
                <div className="lg:hidden relative z-[1051]">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="text-white p-2">
                        <User className="h-6 w-6" />
                    </button>

                    {/* 로그인 및 회원가입 드롭다운 (오른쪽 벽) */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 top-full mt-4 w-32 bg-white shadow-lg rounded-lg py-2 z-[1052]">
                            {isLogin ? (
                                <>
                                    <button
                                        onClick={() => navigate('/mypage/main')}
                                        className="w-full text-black text-left hover:bg-gray-100 py-1 px-3 rounded"
                                    >
                                        {userName}님
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-black text-left hover:bg-gray-100 py-1 px-3 rounded"
                                    >
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login/form')}
                                        className="w-full text-black text-left hover:bg-gray-100 py-3 px-3 rounded"
                                    >
                                        로그인
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup/agree')}
                                        className="w-full text-black text-left hover:bg-gray-100 py-1 px-3 rounded"
                                    >
                                        회원가입
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* 모바일 메뉴 내용 (네비게이션 메뉴 - 왼쪽 벽) */}
                {isMenuOpen && (
                    <div className="absolute left-2 top-[70px] w-1/6 text-center bg-white shadow-lg rounded-md z-50 py-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
};
export default DesktopHeader;