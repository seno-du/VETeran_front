import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReservationIng from "./components/ReservationIng";
import { useSelector } from "react-redux";

interface Pets {
  petNum: number;
  userNum: number;
  petName: string;
  petSpecies: "강아지" | "고양이";
  icon: string;
}


const AnimalSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPet, setSelectedPet] = useState<Pets | null>(null);
  const [selectedNotice, setSelectedNotice] = useState("");
  const [pets, setPets] = useState<Pets[]>([]);
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
  // const userNum = useSelector((state: RootState) => state.profile.userNum);
  const [error, setError] = useState<string | null>(null);
  const { department, time, doctor } = location.state || {};

  const token = useSelector((state: any) => state.auth.token);

  const [user, setUser] = useState({
    userNum: 0,
    userName: '',
    userId: '',
    userPwd: '',
    userPhone: '',
    userBirth: '',
    userEmail: '',
    userAddress: '',
    userAddressNum: '',
    userStatus: '',
    userSignupDate: '',
  });

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/user/one`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching community:', error);
    }
  };

  useEffect(() => {

    const fetchPets = async () => {
      try {
        // console.log("Token:", token);
        if (!token) {
          alert("로그인이 필요합니다.");
          // console.log(token);
          navigate("/login/form");
          return;
        }

        const response = await axios.get(`http://localhost:7124/back/api/pet/userNum?page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        if (response.status === 200 && response.data.list) {
          const petsData = response.data.list.map((pet: { petSpecies: string; }) => ({
            ...pet,
            icon: pet.petSpecies === "강아지" ? "🐶" : "🐱"
          }));
          setPets(petsData);
        } else {
          throw new Error('펫 정보 불러오는데 실패');
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
        setError('펫 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchPets();
  }, [user.userNum, currentPage, navigate]);

  const handleSelectPet = (pet: Pets) => {
    setSelectedPet(pet);
  };

  const handleNextStep = () => {
    if (!selectedPet) {
      alert("펫을 선택해주세요!");
      return;
    } navigate('/select_datetime', {
      state: { department, pet: selectedPet, note: selectedNotice, doctor }
    });
  };


  return (
    <div className="max-w-6xl mx-auto py-10 px-5 bg-white mb-20">
      {/* 상단 제목 */}
      <h1 className="text-3xl font-bold text-left mb-4">나의 펫 선택</h1>
      <div className="w-full bg-gray-200 h-0.5 mb-10"></div>

      <ReservationIng check={false} />

      {/* 진행 단계 표시 */}
      <div className="flex justify-center items-center mb-10">
        {[
          { name: "진료과 선택", icon: "📅", path: "/department_selection", disabled: false },
          { name: "의료진 선택", icon: "👨‍⚕️", path: "/select_doctor", disabled: false },
          { name: "나의 펫 선택", icon: "✓", path: "/animal_selection", active: true, disabled: false },
          { name: "진료일/시 선택", icon: "📅", path: "/select_datetime", disabled: true },
          { name: "진료예약 확인", icon: "📅", path: "/reservation_confirmation", disabled: true }
        ].map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex flex-col items-center cursor-pointer ${step.active ? "text-gray-800 font-semibold" : "text-gray-500"}`}
              onClick={() => {
                if (!step.disabled) {
                  navigate(step.path, {
                    state: {
                      department,
                      doctor,
                      pet: selectedPet,
                      note: selectedNotice
                    }
                  });
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

      {/* 🐾 펫 선택 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-12">
        {pets.map((pet) => (
          <div key={pet.petNum} onClick={() => handleSelectPet(pet)}
            className={`flex flex-col items-center p-4 rounded-lg shadow cursor-pointer transition-transform 
            ${selectedPet?.petNum === pet.petNum ? "border-2 border-green-500 bg-green-100" : "bg-gray-100 hover:bg-gray-200"}`}>
            <div className="text-6xl">{pet.icon}</div>
            <p className="mt-2 text-lg font-semibold text-gray-800">{pet.petName}</p>
          </div>
        ))}
      </div>

      {/* 📝 예약 관련 메모 작성란 */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-3">예약 관련 메모</h3>
        <textarea
          className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
          placeholder="진료 시 전달하고 싶은 내용을 입력하세요."
          value={selectedNotice}
          onChange={(e) => setSelectedNotice(e.target.value)}
        />
      </div>

      {/* 🔜 다음 단계 버튼 */}
      <div className="text-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-lg font-bold px-6 py-3 rounded-md"
          onClick={handleNextStep}
        >
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
};

export default AnimalSelection;
