import React, { useState, useEffect } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:7124/back/api";

interface HospitalAddProps {
  onClose: () => void;
  onScheduleAdded: () => void;
}

interface Pets {
  petNum: number;
  userNum: number;
  userName: string;
  petSpecies: "강아지" | "고양이";
  petName: string;
  petBreed: string;
  petGender: "암컷" | "수컷" | "중성화암컷" | "중성화수컷";
  petBirth: string;
  petColor : string;
  petWeight: number;
  chartNum?: number;
  hospitalNum: number;
}

interface HospitalPet {
  hospitalStatus: string;
  hospitalRoom: number;
  petName: string;
  userName: string;
  hospitalMemo: string;
  petSpecies: string;
  petBreed: string;
  managerName: string;
  hospitalStartTime: string;
  petNum: number;
  chartNum: number;
  hospitalNum: number;
}

const HospitalAdd: React.FC<HospitalAddProps> = ({
  onClose,
  onScheduleAdded,
}) => {
  const [allPets, setAllPets] = useState<Pets[]>([]);
  const [activePet, setActivePet] = useState([]);
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pets | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const severityOptions = ["경증", "보통", "중증", "위중"];
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);


    // 사용 가능한 입원실 조회 및 입원중인 펫 조회
    const fetchPatientsAllList = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/pet/allForHospital`);
        console.log(" API 응답:", response.data);

        const filteredPets = response.data.filter((pet: any) => 
          !activePet.some((active: any) => active === pet.petName)
        );
        setAllPets(filteredPets);

        console.log("입원 안한 환자:", filteredPets);

      } catch (error) {
        console.error(" 데이터 불러오기 실패:", error);
      }
    };


    // 사용 가능한 입원실 조회 및 입원중인 펫 조회
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/hospital/listOfActive`);
        console.log(" API 응답:", response.data);

        const petNames = response.data.map((item: any) => item.petName);
        setActivePet(petNames);

        console.log("입원한 환자:", activePet)

        const hospitalRooms = response.data.map((item: any) => item.hospitalRoom);
        const allRooms = Array.from({ length: 20 }, (_, i) => i + 1);
        const filteredRooms = allRooms.filter(room => !hospitalRooms.includes(room));
        setAvailableRooms(filteredRooms);

        console.log("사용가능 입원실:", filteredRooms);

      } catch (error) {
        console.error(" 데이터 불러오기 실패:", error);
      }
    };

    useEffect(() => {
      fetchPatients();
    },[])

    useEffect(() => {
      fetchPatientsAllList();
    },[activePet])


    useEffect(() => {
      
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 전체 pet 목록 필터링 (검색)
  const filteredPets = allPets.filter(
    (pet) =>
      pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(pet.userNum).includes(searchTerm)
  );

  const handleSubmit = async () => {
    if (!selectedPet) {
      alert("반드시 환자를 선택해야 합니다.");
      return;
    }
    if (!selectedRoom) {
      alert("입원실을 선택해야 합니다.");
      return;
    }
    if (!selectedSeverity) {
      alert("중증도를 선택해야 합니다.");
      return;
    }

    try {
      //  차트 번호 유효성 검사 (null 또는 -1이면 예외 처리)
      if (!selectedPet.chartNum || selectedPet.chartNum < 0) {
        alert("해당 환자의 차트 정보가 없습니다.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const fullDateTime = `${today} ${selectedTime}:00`;

      const requestData = {
        chartNum: Number(selectedPet.chartNum),
        hospitalNum: Number(selectedPet.hospitalNum),
        hospitalRoom: Number(selectedRoom),
        hospitalStartTime: fullDateTime,
        hospitalMemo: String(selectedSeverity),
      };

      const response = await axios.post(`${SERVER_URL}/hospital/add`, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(" 입원 스케줄 추가 성공:", response.data);
      alert("입원 스케줄 추가 완료");
      onScheduleAdded();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("입원 스케줄 추가 실패:", error);
      if (error.response && error.response.status === 409) {
        alert("이미 입원 중인 환자입니다.");
        return;
      } else {
        alert("오류 발생: " + (error.response?.data?.message || "서버에 연결할 수 없습니다."));
      }
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          <span className="text-teal-600 mr-2">◢</span>입원 스케줄 추가
        </h2>

        {/* 검색 필드 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="pet 이름 또는 보호자 번호 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        {/* 펫 목록 (전체 목록 표시) */}
        <div className="h-60 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-2">
          {filteredPets.length > 0 ? (
            [
              ...new Map(filteredPets.map((pet) => [pet.petNum, pet])).values(),
            ].map((pet) => (
              <div
                key={pet.petNum} 
                className={`p-3 border rounded-lg cursor-pointer transition duration-200 hover:bg-gray-100 ${selectedPet?.petNum === pet.petNum
                  ? "bg-gray-200 border-gray-600"
                  : ""
                  }`}
                onClick={() => setSelectedPet(pet)}
              >
                <p className="font-bold">
                  {pet.petName}
                </p>
                <p className="text-sm">보호자: {pet.userName}</p>
                <p className="text-sm">품종: {pet.petBreed}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">등록된 pet이 없습니다.</p>
          )}
        </div>
        {/* 입원실 선택 */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            <span className="text-teal-600 mr-2">◢</span>입원실 선택
          </p>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedRoom?.toString()}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800"
            >
              <option value="">입원실을 선택해주세요</option> {/* 기본 선택 옵션 */}
              {availableRooms.map((room) => (
                <option
                  key={room}
                  value={room}
                  className={selectedRoom === room ? "bg-teal-600 text-white" : ""}
                >
                  {room}번
                </option>
              ))}
            </select>
          </div>
        </div>



        {/* 중증도 선택 */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            <span className="text-teal-600 mr-2">◢</span>중증도 선택
          </p>
          <div className="flex gap-2">
            {severityOptions.map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded ${selectedSeverity === sev
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* 입원 시간 선택 - 버튼 그룹으로 수정 */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            입원 시간 선택
          </p>
          <div className="flex gap-2 flex-wrap">
            {[
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ].map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-3 py-1 rounded ${selectedTime === time
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 text-white py-2 rounded-lg"
        >
          입원 스케줄 추가
        </button>
      </div >
    </div >
  );
};

export default HospitalAdd;
