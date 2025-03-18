import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "./input";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";


export default function LoginUi() {
  const [showLogo, setShowLogo] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPasswordless, setIsPasswordless] = useState(false); // ✅ 패스워드리스 UI 전환 상태 추가
  const [error, setError] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); // 패스워드리스 인증 코드 입력 활성화
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    verificationCode: "", // 패스워드리스 인증 코드
  });



  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ JWT 로그인
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:6100/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
      } else {
        setError("로그인 실패: " + data.message);
      }
    } catch (error) {
      console.error("로그인 에러", error);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  // ✅ 패스워드리스 인증 코드 요청
  const handlePasswordlessRequest = async () => {
    try {
      const response = await fetch("http://localhost:6100/api/auth/passwordless/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await response.json();
      if (data.success) {
        setIsCodeSent(true);
        alert("인증 코드가 이메일로 전송되었습니다.");
      } else {
        setError("인증 코드 요청 실패: " + data.message);
      }
    } catch (error) {
      console.error("인증 코드 요청 에러", error);
      setError("인증 코드 요청 중 오류가 발생했습니다.");
    }
  };

  // ✅ 패스워드리스 인증 코드 검증
  const handlePasswordlessVerify = async () => {
    try {
      const response = await fetch("http://localhost:6100/api/auth/passwordless/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          code: form.verificationCode,
        }),
      });

      const data = await response.json();
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/dashboard");
      } else {
        setError("인증 실패: " + data.message);
      }
    } catch (error) {
      console.error("인증 코드 확인 에러", error);
      setError("인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
      setTimeout(() => setShowForm(true), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white"> {/* ✅ 배경색 수정 */}
      {showLogo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute text-5xl font-bold"
        >
          <span className="text-teal-600">Vet</span>eran {/* ✅ 헤더와 같은 녹색 사용 */}
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg w-[520px] max-w-md">

          {/* ✅ 로그인 UI / 패스워드리스 UI 전환 */}
          {!isPasswordless ? (
            <>
              <h2 className="text-2xl font-semibold text-center text-gray-800">로그인</h2>
              <div className="mt-6">
                <Input
                  type="text"
                  name="email"
                  placeholder="이메일"
                  value={form.email}
                  onChange={handleChange}
                  className="mb-4" />
                <Input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={form.password}
                  onChange={handleChange}
                  className="mb-4" />
                <Button
                  onClick={handleLogin}
                  className="w-full bg-teal-600 hover:bg-teal-800 text-white">
                  로그인
                </Button>
              </div>


              {/* ✅ 패스워드리스 로그인 버튼 추가 */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsPasswordless(true)}
                  className="text-teal-500 hover:underline">
                  패스워드리스 로그인
                </button>
              </div>


              <div className="mt-4 text-center text-sm">
                <button onClick={() => navigate("/find-id")} className="text-teal-500 hover:underline">
                  아이디 찾기
                </button>
                <button onClick={() => navigate("/find-password")} className="text-teal-500 hover:underline mx-2">
                  비밀번호 찾기
                </button>
                <button onClick={() => navigate("/signup")} className="text-teal-500 hover:underline">
                  회원가입
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ✅ 패스워드리스 로그인 UI */}
              <h2 className="text-2xl font-semibold text-center text-gray-800">패스워드리스 로그인</h2>
              <div className="mt-6">
                <Input type="text" name="email" placeholder="이메일 입력" value={form.email} onChange={handleChange} className="mb-4" />
                <Button onClick={handlePasswordlessRequest} className="w-full bg-teal-600 hover:bg-teal-800 text-white">
                  인증 코드 요청
                </Button>
              </div>

              {/* 인증 코드 입력 필드 */}
              {isCodeSent && (
                <div className="mt-4">
                  <Input type="text" name="verificationCode" placeholder="인증 코드 입력" value={form.verificationCode} onChange={handleChange} className="mb-4" />
                  <Button onClick={handlePasswordlessVerify} className="w-full bg-teal-600 hover:bg-teal-800 text-white">
                    인증 코드 확인
                  </Button>
                </div>
              )}

              {/* ✅ 뒤로 가기 버튼 */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsPasswordless(false)}
                  className="text-gray-600 hover:underline"
                >
                  뒤로 가기
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

