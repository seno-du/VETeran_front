import axios from 'axios';
import React, { useEffect } from 'react';

const NaverLogin: React.FC = () => {
    const handleNaverLogin = async () => {
        try {
            const response = await axios.post('http://localhost:7124/back/api/naver/login');
            window.location.href = response.data;
        } catch (error) {
            console.error("로그인 URL을 가져오는 데 실패했습니다:", error);
        }
    };

    useEffect(() => {
        handleNaverLogin();

    }, []);

    return null;
};

export default NaverLogin;
