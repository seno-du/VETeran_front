import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentManagerStore } from "../../zustand/CurrentManager";

const SERVER_URL = "http://localhost:7124/back";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { role, setRole } = useCurrentManagerStore();

  // 현재 로그인된 매니저 정보 가져오기
  const getCurrentManager = async (token: string) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/user/jwt/currentManager`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      if (response.status === 200) {
        setRole(response.data);
      }
    } catch (error) {
      console.error("현재 매니저 정보를 가져오는 데 실패했습니다.", error);
      sessionStorage.removeItem("accessToken");
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    console.log(role)
    if (!token) {
      navigate("/login");
    } else {
      setAccessToken(token);
    }
    if (role.length === 0) {
      if (token) {
        getCurrentManager(token);
      }
    }
  },[])

  return children;
}