import React, { useState } from "react";
import {
    FaBed,
    FaCalendarAlt,
    FaFileAlt,
    FaFileMedical,
    FaImage,
    FaMicroscope,
    FaNotesMedical,
    FaPen,
    FaSearch,
    FaShoppingCart,
    FaStethoscope,
    FaUserMd
} from "react-icons/fa";
import { Link } from "react-router-dom";

interface SubMenuItem {
    name: string;
    icon: React.ReactNode;
    path?: string;
}

interface MenuItem {
    label: string;
    subMenu: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    {
        label: '진료',
        subMenu: [
            { name: '찾기', icon: <FaSearch />, path: "/" },
            { name: '입원', icon: <FaBed />, path: "/hospital" },
            { name: '예약', icon: <FaCalendarAlt />, path: "/reservation" },
            { name: '일정관리', icon: <FaStethoscope />, path: "/medicalSchedule" },
            { name: '진단', icon: <FaNotesMedical />, path: "/diagnosis" },
            // { name: 'PACS', icon: <FaImage />, path: "/PACS/test" },
        ]
    },
    {
        label: '재고',
        subMenu: [
            // { name: '재고검색', icon: <FaSearch />, path: "/item/search" },
            { name: '재고조회', icon: <FaSearch />, path: "/item/list" },
            // { name: '재고조회', icon: <FaBox />, path: "/inventory/list" },
            { name: '발주관리', icon: <FaShoppingCart />, path: "/inventory/order" },
            { name: '마취/마약 의료품', icon: <FaShoppingCart />, path: "/inventory/ItemFace" },
        ]
    },
    {
        label: '종합',
        subMenu: [
            { name: '사원 관리', icon: <FaUserMd />, path: "/admin" },
            { name: '파일관리', icon: <FaFileMedical />, path: "/mfile/all" },
            { name: '카드 거래내역', icon: <FaBed />, path: "/paymentcard" },
            { name: '결제 관리', icon: <FaBed />, path: "/paymentreqest" },
            { name: '이상거래', icon: <FaFileMedical />, path: "/abnormaltransaction/1" },
            { name: '공지사항 작성', icon: <FaPen />, path: "/notice/all" },
        ]
    }
];

const Header: React.FC = () => {
    const [activeButton, setActiveButton] = useState(menuItems[0].label);

    const activeSubMenu = menuItems.find((item) => item.label === activeButton)?.subMenu ?? [];

    return (
        <div>
            <nav className="flex items-center px-4 py-2 shadow-md bg-slate-800">
                <span className="mr-6 text-lg font-bold text-teal-600">
                    <Link to={"/"}>
                        <b className="text-white">Vet</b>eran
                    </Link>
                </span>
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => setActiveButton(item.label)}
                        className={`text-white text-xs font-semibold py-2 px-3 rounded-md mx-0.5 transition-all duration-300 
                            ${activeButton === item.label ? 'bg-teal-600' : 'bg-slate-800'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 bg-white shadow-md rounded-b-md">
                <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${Math.min(6, activeSubMenu.length)} xl:grid-cols-${Math.min(6, activeSubMenu.length)}`}>
                    {activeSubMenu.map((subItem) => (
                        <Link
                            key={subItem.name}
                            to={subItem.path ?? '#'}
                            className="block"
                        >
                            <button className="flex flex-col items-center justify-center w-full px-4 py-2 text-xs font-semibold text-white transition-all duration-300 rounded-md bg-slate-800 hover:bg-teal-600">
                                {subItem.icon}
                                <span className="mt-1">{subItem.name}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Header;
