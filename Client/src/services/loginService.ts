import axios from "axios";

export const loginService = {
    checkKakaoUser: async (email: string) => {
        // 백엔드 API 호출 코드 예시
        const response = await axios.get(`/api/check-kakao-user?email=${email}`);
        console.log(response)
        return response.data.token;
    },
    getUserInfo: async (token: string) => {
        const response = await fetch(`/api/user-info?token=${token}`);
        const userInfo = await response.json();
        return userInfo;
    }
};
