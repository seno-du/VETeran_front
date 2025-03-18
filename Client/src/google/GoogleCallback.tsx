/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../zustand/profileSlice";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {

      if (code) {
        try {
          const response = await axios.get(`http://localhost:7124/back/api/login/google?code=${code}`);
          if (!response.data.email) {
            return alert("로그인 처리중 오류가 발생하였습니다.");
          }

          const response3 = await axios.post('http://localhost:7124/back/api/user/jwt/login/social', {
            userEmail: response.data.email
          });

          if (response3.status === 200) {
            if (response3.data === "is not exist") {
              return navigate("/signup", { state: { email: response.data.email } })
            }
            dispatch(setToken(response3.data.token));

            // localStorage.setItem('token', response3.data.token);
            navigate("/");
          } else {
            console.error("로그인 처리중 오류가 발생하였습니다.");
          }
        } catch (error) {
          console.error("로그인 처리 실패:", error);
        }
      }
    }
    handleCallback();
  }, [code]);

  return (
    <div className="flex justify-center items-center h-screen text-2xl font-bold text-[#555]">
      Google 로그인 중입니다... 잠시만 기다려주세요! ⏳
    </div>
  );
};

export default GoogleCallback;