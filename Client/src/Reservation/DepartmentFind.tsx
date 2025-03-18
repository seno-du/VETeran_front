import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationIng from './components/ReservationIng';
import axios from 'axios';

const DepartmentFind: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<{ name: string; department: string; specialty: string; note: string; image: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ 한글 진료과 → managerNum 변환 맵핑
  const departmentMap: { [key: string]: string } = {
    "안과": "4",
    "내과": "5",
    "외과": "6"
  };

  // 🔍 검색 실행 함수
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('진료과를 입력해주세요.');
      return;
    }

    // ✅ 한글 입력값을 managerNum으로 변환
    const managerNum = departmentMap[searchTerm];
    if (!managerNum) {
      setError('올바른 진료과를 입력해주세요. (예: 안과, 내과, 외과)');
      return;
    }

    setLoading(true);
    setError('');

    try {

      const response = await axios.get(`http://localhost:7124/back/api/managers/selectManagerIdWhereRHK/${managerNum}`);

      // console.log("📩 API 응답 데이터:", response.data);

      if (!response.data || response.data.length === 0) {
        setDoctors([]);
        setError('검색 결과가 없습니다.');
        alert('검색 결과가 없습니다.');
        return;
      }

      //응답 데이터를 기반으로 doctor 객체 생성
      const doctorList = response.data.map((doctorData: any, index: number) => ({
        name: doctorData.managerName, // 🟢 올바르게 매핑
        managerNum: doctorData.managerNum, // 필요하면 추가
        department: searchTerm,
        specialty: getRandomItem(specialties[searchTerm] || []),
        note: getRandomItem(notes[searchTerm] || []),
        image: images[index % images.length]
    }));
    

      setDoctors(doctorList);
    } catch (err) {
      console.error('❌ 데이터 로드 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 전문분야 및 비고사항 정의
  const specialties: { [key: string]: string[] } = {
    "안과": ["시력 회복", "백내장", "망막 질환", "안구 건조증"],
    "내과": ["심장 질환", "고혈압", "당뇨병", "소화기 질환"],
    "외과": ["외상 치료", "수술", "장기 이식", "암 치료"]
  };

  const notes: { [key: string]: string[] } = {
    "안과": ["휴가 : 2025-03-01~2025-03-05", "출장 : 2025-04-01~2025-04-10"],
    "내과": ["학회 : 2025-03-15~2025-03-20", "진료중 : 2025-04-05~2025-04-10"],
    "외과": ["휴가 : 2025-03-20~2025-03-25", "출장 : 2025-05-01~2025-05-10"]
  };

  const images = [
    "/images/의사사진1.webp",
    "/images/의사사진2.webp",
    "/images/의사사진3.webp",
    "/images/의사사진4.webp"
  ];

  const getRandomItem = (arr: string[]) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : "");

  const handleSelectDoctor = (doctor: any) => {
    navigate("/animal_selection", {
      state: {
        department: departmentMap[searchTerm], 
        selectedDoctor: doctor 
      }
    });
  };
  

  return (
    <div className="max-w-6xl mx-auto py-10 px-5 bg-white">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-left mb-4">인터넷 진료예약</h1>
      <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

      <ReservationIng check={false} />

      {/* 진행 단계 표시 */}
      <div className="flex justify-center items-center mb-10">
        {[
          { name: "진료과 선택", icon: "📅", path: "/department_selection", disabled: false },
          { name: "의료진 선택", icon: "✓", path: "/select_doctor", active: true, disabled: false },
          { name: "나의 펫 선택", icon: "🐾", path: "/animal_selection", disabled: true },
          { name: "진료일/시 선택", icon: "📅", path: "/select_datetime", disabled: true },
          { name: "진료예약 확인", icon: "📅", path: "/reservation_confirmation", disabled: true }
        ].map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex flex-col items-center cursor-pointer ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}
              onClick={() => {
                if (!step.disabled) {
                  navigate(step.path);
                }
              }}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${step.active ? "bg-green-500 text-white" : "bg-gray-300 text-white"}`}>
                {step.icon}
              </div>
              <p className={`mt-2 ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}>
                {step.name}
              </p>
            </div>
            {index < 4 && <div className="w-16 h-0.5 bg-gray-300 relative -top-3"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* 검색창 UI */}
      <div className="flex justify-center items-center mt-12 mb-10">
        <input
          type="text"
          placeholder="예) 안과, 내과, 외과"
          className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="ml-4 bg-green-500 text-white px-6 py-3 rounded-md font-medium"
        >
          검색
        </button>
      </div>

      {/* 안내 텍스트 */}
      <div className="text-center mt-4 text-sm text-gray-600 mb-24">
        <p>
          <span className="font-semibold">의료진 성명과 전문분야</span>를 알고 계신 경우 더
          간편하게 진료예약을 하실 수 있습니다.
        </p>
        <p className="mt-2 text-gray-400">대표전화: 1577-3330</p>
      </div>

      {/* 의료진 리스트 */}
      <div className="grid grid-cols-2 gap-9 mb-7">
                {doctors.map((doctor, index) => (
                    <div key={index} className="flex bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        {/* 의사 사진 */}
                        <img src={doctor.image} alt={doctor.name} className="w-[9rem] h-[9rem] mt-4 rounded-lg object-cover" />

                        {/* 의사 정보 */}
                        <div className="ml-6 flex-1">
                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                            <p className="text-green-600 font-semibold">{doctor.department}</p>
                            <hr className="my-2 border-gray-300" />

                            <p className="text-gray-600">
                                <span className="font-bold text-gray-800">전문분야</span> <br />
                                {doctor.specialty}
                            </p>

                            <p className="text-gray-600 mt-2 whitespace-nowrap">
                                <span className="font-bold text-gray-800">비고사항</span> <br />
                                {doctor.note}
                            </p>
                        </div>

                        {/* 예약 버튼 */}
                        <button
                            className="bg-green-500 whitespace-nowrap hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-md h-fit self-start"
                            onClick={() => handleSelectDoctor(doctor)}
                        >
                            진료예약
                        </button>
                    </div>
                ))}
            </div>

    </div>
  )
}

export default DepartmentFind
