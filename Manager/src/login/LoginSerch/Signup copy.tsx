import { useState } from "react";
import DaumPostcode from "react-daum-postcode"; // 📌 카카오 주소 검색 라이브러리 추가
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../loginUiPage/input";
import { Button } from "../loginUiPage/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();


  const [form, setForm] = useState({
    managerName: "",
    managerId: "",
    managerEmail: "",
    managerPwd: "",
    managerPhone: "",
    managerPhone1: "",
    managerPhone2: "",
    managerPhone3: "",
    managerLicenseNum: "",
    managerBirth: "",
    managerAddress: "", // ✅ 주소 (도로명 주소)
    managerAddressDetail: "", // ✅ 상세 주소 추가 (동/호수 입력)
    managerGender: "여성",
    managerStatus: "활성화",
  });

  const [error, setError] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [isDomainListVisible, setIsDomainListVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isEmailVerificationVisible, setIsEmailVerificationVisible] = useState(false);



  const departments = ["안과", "치과", "내과", "외과", "마취과", "영상검사과", "재고관리", "매니저", "부관리자", "관리자"]; // 과 선택 리스트 추가

  const emailDomains = ["naver.com", "gmail.com", "hotmail.com", "daum.net"];

  const validateId = (id: string) => /^[A-Za-z0-9]+$/.test(id);

  // ✅ 비밀번호 유효성 검사 함수 추가 (📍validateId 함수 아래에 추가!)
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8; // 8자 이상
    const hasNoSpaces = !/\s/.test(password); // 공백 금지
    const hasLetters = /[A-Za-z]/.test(password); // 영어 포함
    const hasNumbers = /[0-9]/.test(password); // 숫자 포함
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // 특수문자 포함

    if (!hasMinLength) return "비밀번호는 8자 이상이어야 합니다.";
    if (!hasNoSpaces) return "비밀번호에 공백을 포함할 수 없습니다.";
    if (!hasLetters || !hasNumbers || !hasSpecialChar) return "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.";
    return "가능한 비밀번호입니다."; // ✅ 유효하면 빈 문자열 반환
  };

  // ✅ 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailVerification = () => {
    if (!validateEmail(form.managerEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    setIsEmailVerificationVisible(true);
  };


  // 📌 주소 선택 시 처리할 함수
  const handleAddressSelect = (data: any) => {
    setForm({ ...form, managerAddress: data.address }); // ✅ 선택한 주소 저장
    setIsAddressOpen(false); // 모달 닫기
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "managerId") {
      setIsIdChecked(false);
      setIdCheckMessage("");
      setIdError(validateId(value) ? "" : "아이디는 영어와 숫자로만 구성되어야 합니다.");
    }

    if (name === "managerPwd") {
      const errorMsg = validatePassword(value); // ✅ 비밀번호 검증 실행 (📍이 부분 추가!)
      setPasswordError(errorMsg); // ✅ 오류 메시지 업데이트
    }

    if (name === "managerEmail") {
      const parts = value.split("@");
      setEmailDomain(parts[1] || "");
      setIsDomainListVisible(parts.length > 1);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const onlyNumbers = value.replace(/[^0-9]/g, "");

    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: onlyNumbers };
      newForm.managerPhone = `${newForm.managerPhone1 || ""}-${newForm.managerPhone2 || ""}-${newForm.managerPhone3 || ""}`;
      return newForm;
    });
  };

  const checkDuplicateId = async () => {
    if (!form.managerId) {
      setIdCheckMessage("아이디를 입력해주세요.");
      return;
    }

    if (idError) {
      setIdCheckMessage("아이디 형식을 확인해주세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:6100/api/Login/checkId?managerId=${form.managerId}`);
      const data = await response.json();

      if (data.exists) {
        setIdCheckMessage("이미 사용 중인 아이디입니다.");
        setIsIdChecked(false);
      } else {
        setIdCheckMessage("사용 가능한 아이디입니다.");
        setIsIdChecked(true);
      }
    } catch (error) {
      setIdCheckMessage("중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdChecked) {
      setError("아이디 중복 확인을 해주세요.");
      return;
    }

    if (!form.managerId || !form.managerPwd || !form.managerEmail || !form.managerPhone || !form.managerName) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }


    // ✅ 도로명 주소 + 상세주소를 하나로 합쳐서 저장
    const fullAddress = `${form.managerAddress} ${form.managerAddressDetail || ""}`.trim();
    const updatedForm = { ...form, managerAddress: fullAddress };


    const response = await fetch("http://localhost:6100/api/Login/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedForm),
    });

    const data = await response.json();
    if (data.result === "OK") {
      alert("회원가입이 완료되었습니다. 로그인하세요!");
      navigate("/");
    } else {
      setError(data.result || "회원가입 실패");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-gray-900 p-8 rounded-2xl shadow-lg w-[450px]"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">회원가입</h2>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input type="text" name="managerName" placeholder="이름" value={form.managerName} onChange={handleChange} />

          <div className="flex items-center gap-2">
            <Input type="text" name="managerId" placeholder="아이디" value={form.managerId} onChange={handleChange} />
            <Button type="button" onClick={checkDuplicateId} className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded-md w-[130px] h-[44px] text-sm">
              중복 확인
            </Button>
          </div>

          {idError && <p className="text-red-500 text-sm">{idError}</p>}
          {idCheckMessage && <p className="text-sm mt-1 text-gray-700">{idCheckMessage}</p>}

          <div className="flex items-center gap-2">
            <Input type="email" name="managerEmail" placeholder="이메일" value={form.managerEmail} onChange={handleChange} />
            {/* ✅ 이메일 인증 버튼 */}
            <Button
              type="button"
              onClick={handleEmailVerification} // ✅ 이메일 형식 검증 후 인증번호 입력칸 활성화
              className="bg-teal-600 hover:bg-teal-800 text-white px-4 py-2 rounded-md w-[130px] h-[44px] text-sm">
              인증하기
            </Button>





            {isDomainListVisible && (
              <div className="absolute top-full left-0 w-full bg-white text-black shadow-md z-10">
                {emailDomains.filter(domain => domain.includes(emailDomain)).map(domain => (
                  <button key={domain} type="button" onClick={() => {
                    setForm({ ...form, managerEmail: `${form.managerEmail.split('@')[0]}@${domain}` });
                    setIsDomainListVisible(false);
                  }}
                    className="w-full text-left px-4 py-2 hover:bg-teal-600 hover:text-white">
                    {domain}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ✅ 이메일 인증 입력란 (버튼 클릭 시 나타남) */}
          {isEmailVerificationVisible && (
            <Input
              type="text"
              name="emailVerificationCode"
              placeholder="인증번호 입력"
              onChange={handleChange} />
          )}

          <Input type="password" name="managerPwd" placeholder="비밀번호" value={form.managerPwd} onChange={handleChange} />

          {/* ✅ 비밀번호 유효성 검사 결과 출력 */}
          {passwordError && <p className={`${passwordError === "가능한 비밀번호입니다." ? "text-green-500" : "text-red-500"} text-sm mt-1`}>
            {passwordError}
          </p>}

          <div className="flex gap-2">
            <Input type="text" name="managerPhone1" placeholder="010" maxLength={3} value={form.managerPhone1} onChange={handlePhoneChange} />
            <Input type="text" name="managerPhone2" placeholder="1234" maxLength={4} value={form.managerPhone2} onChange={handlePhoneChange} />
            <Input type="text" name="managerPhone3" placeholder="5678" maxLength={4} value={form.managerPhone3} onChange={handlePhoneChange} />
          </div>

          <div className="flex flex-col">
            <DatePicker
              selected={form.managerBirth ? new Date(form.managerBirth) : null}
              onChange={(date) => setForm({ ...form, managerBirth: date.toISOString().split("T")[0] })}
              dateFormat="yyyy-MM-dd"
              placeholderText="생년월일 선택"
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </div>

          {/* ✅ 성별 선택 라디오 버튼 */}
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="managerGender"
                value="여성"
                checked={form.managerGender === "여성"}
                onChange={handleChange}
                className="mr-2" />
              여성
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="managerGender"
                value="남성"
                checked={form.managerGender === "남성"}
                onChange={handleChange}
                className="mr-2" />
              남성
            </label>
          </div>


          {/* ✅ 주소 검색 버튼 & 입력 필드 추가 */}
          <div className="flex gap-2">
            <Input type="text" name="managerAddress" placeholder="주소" value={form.managerAddress} readOnly className="flex-1 h-[44px]" />
            <Button type="button" onClick={() => setIsAddressOpen(true)} className="bg-teal-600 hover:bg-teal-800 text-white flex-shrink-0 h-[44px] px-4">
              주소 검색
            </Button>
          </div>

          {/* ✅ 상세 주소 입력 필드 추가 */}
          <Input
            type="text"
            name="managerAddressDetail"
            placeholder="상세 주소 (동/호수 입력)"
            value={form.managerAddressDetail || ""}
            onChange={(e) => setForm({ ...form, managerAddressDetail: e.target.value })}
          />


          {/* ✅ 주소 검색 모달 */}
          {isAddressOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">
                <DaumPostcode onComplete={handleAddressSelect} />
                <button onClick={() => setIsAddressOpen(false)} className="mt-4 w-full text-center text-red-500 hover:underline">
                  닫기
                </button>
              </div>
            </div>
          )}

          <Input type="text" name="managerLicenseNum" placeholder="과 선택" value={form.managerLicenseNum}
            onChange={handleChange} onClick={() => setIsModalOpen(true)} // 🔥 모달 열기 이벤트 추가
          />
          {/* 🔥 모달 구현 */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-[350px] max-h-[400px] overflow-auto">
                <h3 className="text-lg font-semibold text-center mb-2 mt-0">과 선택</h3>

                <div className="text-sm font-medium text-gray-600 text-center mt-0 mb-0">
                  해당되는 과를 선택하세요.
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setForm({ ...form, managerLicenseNum: dept });
                        setIsModalOpen(false);
                      }}
                      className="w-24 h-12 flex items-center justify-center bg-gray-700 text-white hover:bg-teal-600 hover:text-white rounded-md font-semibold"
                    >
                      {dept}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="mt-4 w-full text-center text-teal-600 hover:underline">
                  닫기
                </button>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-800 text-white">
            회원가입
          </Button>

          <Button
            type="button"
            onClick={() => navigate(-1)} // 🔥 이전 페이지로 이동
            className="w-full bg-gray-500 hover:bg-gray-700 text-white">
            뒤로가기
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
