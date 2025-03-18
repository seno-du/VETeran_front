import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "./input";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../utils/useWebSocket";
import { callApi, getOneTimeToken, getServicePassword, joinPasswordless, passwordlessManageCheck } from "../utils/passwordlessApiService";

export default function LoginUi() {
  const [showLogo, setShowLogo] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // ✅ 패스워드리스 UI 전환 상태 추가
  const [error, setError] = useState("");
  const [QR, setQR] = useState("");
  const [wsState, setWsState] = useState({
    url : "",
    token : ""
  });
  const [authState, setAuthState] = useState({
    token : "",
    sessionId : "",
    verificationCode : ""
  })
  const [navigateTimer, setNavigateTimer] = useState(0); // ✅ 타이머 상태
  const [initialTimerValue, setInitialTimerValue] = useState(0); // ✅ 초기 타이머 값 상태 추가

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  useWebSocket({
    url: wsState.url,
    token: wsState.token,
    onMessage: async (data) => {
      if (data.type === "result") {
        await checkStatus();
      }
    },
  });

  const handleJoin = async () => {
    try {
        const manageRes = await passwordlessManageCheck(form.email, form.password);

        if(manageRes.data.result === "이미 등록된 사용자") {
          alert("이미 등록된 사용자 입니다")
          return;
        }

        const PasswordlessToken = manageRes.data.PasswordlessToken;
        setAuthState({ ...authState, token: PasswordlessToken });

        const joinRes = await joinPasswordless(form.email, PasswordlessToken);
        const jsonRes = JSON.parse(joinRes.data.data);

        setQR(jsonRes.data.qr)
        setWsState({
          url : jsonRes.data.pushConnectorUrl,
          token : jsonRes.data.pushConnectorToken
        })
    } catch (error) {
        console.error("등록 중 오류:", error);
    }
};

  const checkStatus = async () => {
    try {
      const params =
      !isLogin
          ? { url: "isApUrl", params: `userId=${form.email}&QRReg=T&token=${authState.token}` }
          : { url: "resultUrl", params: `userId=${form.email}&sessionId=${authState.sessionId}` };

      const response = await callApi(params.url, params.params);
      if (response.data.result === "OK") {
        if(isLogin){
          sessionStorage.setItem("accessToken", response.data.token)
        }
        alert(
          !isLogin
            ? "Passwordless 등록이 완료되었습니다."
            : "로그인이 완료되었습니다."
        );
        navigate("/")
        console.log(authState)
      }
    } catch (error) {
      console.error("상태 확인 오류:", error);
    }
  };

  const handleLogin = async () => {
    try {
        const oneTimeRes = await getOneTimeToken(form.email);
        const oneTimeToken = oneTimeRes.data.oneTimeToken;
        setAuthState({...authState, token : oneTimeToken})

        const spRes = await getServicePassword(form.email, oneTimeToken);
        const spData = JSON.parse(spRes.data.data);
        console.log(spData.data.term)
        setWsState({
            token : spData.data.pushConnectorToken,
            url : spData.data.pushConnectorUrl
        })
        setAuthState({...authState, sessionId : spRes.data.sessionId, verificationCode : spData.data.servicePassword})
        setNavigateTimer(spData.data.term); // ✅ 타이머 초기값 설정
        setInitialTimerValue(spData.data.term); // ✅ 초기 타이머 값 저장

    } catch (error) {
        console.error("로그인 중 오류:", error);
    }
};


  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setAuthState({
      token : "",
      verificationCode : "",
      sessionId : ""
    })
    setWsState({
      url : "",
      token : ""
    })
    setForm({
      email : "",
      password : ""
    })
    setQR("");
    setNavigateTimer(0); // ✅ isLogin 변경 시 타이머 초기화
  }, [isLogin])

  useEffect(() => {
    if (navigateTimer > 0) {
        const timer = setInterval(() => {
            setNavigateTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }
    if (navigateTimer === 0 && authState.verificationCode !== "") {
        setAuthState({...authState, verificationCode: ""});
    }
}, [navigateTimer, authState.verificationCode]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
      setTimeout(() => setShowForm(true), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center justify-center h-screen text-white bg-gray-900">
      {" "}
      {/* ✅ 배경색 수정 */}
      {showLogo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute text-5xl font-bold"
        >
          <span className="text-teal-600">Vet</span>eran{" "}
          {/* ✅ 헤더와 같은 녹색 사용 */}
        </motion.div>
      )}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg w-[520px] max-w-md"
        >
          {/* ✅ 로그인 UI / 패스워드리스 UI 전환 */}
          {!isLogin ? (
            <>
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                패스워드리스 등록
              </h2>
              {QR ? (
                <div className="flex justify-center">
                  <img src={QR} alt="QR" />
                </div>
              ) : (
                <div className="mt-6">
                <Input
                  type="text"
                  name="email"
                  placeholder="이메일"
                  value={form.email}
                  onChange={handleChange}
                  className="mb-4"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={form.password}
                  onChange={handleChange}
                  className="mb-4"
                />
                <Button onClick={handleJoin} className="w-full text-white bg-teal-600 hover:bg-teal-800">
                패스워드리스 등록 시작
                </Button>
              </div>
              )}

              {/* ✅ 패스워드리스 로그인 버튼 추가 */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-teal-500 hover:underline"
                >
                  패스워드리스 로그인
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ✅ 패스워드리스 로그인 UI */}
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                패스워드리스 로그인
              </h2>
              <div className="mt-6">
                <Input
                  type="text"
                  name="email"
                  placeholder="이메일 입력"
                  value={form.email}
                  onChange={handleChange}
                  className="mb-4"
                />
                <Button onClick={handleLogin} className="w-full text-white bg-teal-600 hover:bg-teal-800">
                  인증 코드 요청
                </Button>
              </div>

              {authState.verificationCode && (
                            <div className="flex flex-col p-4 mt-4 font-bold text-gray-800 bg-gray-100 rounded-md"> {/* ✅ flex-col 추가 */}
                                <div className="flex items-center justify-between mb-2"> {/* ✅ mb-2 추가 */}
                                    <span>인증 코드: {authState.verificationCode}</span>
                                    {navigateTimer > 0 && (
                                        <span className="ml-4 text-sm font-normal"> (남은 시간: {formatTime(navigateTimer)})</span>
                                    )}
                                    {navigateTimer === 0 && authState.verificationCode !== "" && (
                                        <span className="ml-4 text-sm font-normal text-red-500"> (시간 초과)</span>
                                    )}
                                </div>
                                <div className="w-full h-2 overflow-hidden bg-gray-300 rounded-full"> {/* ✅ 타이머 바 배경 */}
                                    <div
                                        className="h-full duration-1000 ease-linear bg-teal-600 rounded-full transition-width"  // ✅ 타이머 바 채우는 부분, 애니메이션 효과
                                        style={{ width: initialTimerValue === 0 ? '100%' : `${(navigateTimer / initialTimerValue) * 100}%` }} // ✅ 너비 동적 스타일링 + initialTimerValue === 0 조건 추가
                                    ></div>
                                </div>
                            </div>
                        )}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-teal-500 hover:underline"
                >
                  패스워드리스 등록하기
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}