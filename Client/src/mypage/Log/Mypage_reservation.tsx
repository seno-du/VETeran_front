import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

interface PageDTO {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

interface reserve {
  petName: string;
  userNum: number;
  managerNum: number;
  petNum: number;
  department: string;
  managerName: string;
  reserveNum: number;
  reserveDate: number;
  reserveNotice: string;
  reserveStatus: string;
};

interface result {
  PageDTO: PageDTO;
  list: reserve[];
};

interface userPwd {
  currentPassword: string;
}


const Mypage_reservation: React.FC = () => {

  const [step, setStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [reserveList, setReserveList] = useState<reserve[]>();
  const [viewPetInfoModalOpen, setViewPetInfoModalOpen] = useState(false);
  const [viewReserveModalOpen, setViewReserveModalOpen] = useState(false);

  const token = useSelector((state: any) => state.auth.token);

  const imagePath = "http://localhost:7124/back/uploads/";

  const [oneOfReserve, setOneOfReserve] = useState<reserve>({
    petName: '',
    userNum: 0,
    managerNum: 0,
    petNum: 0,
    department: '',
    managerName: '',
    reserveNum: 0,
    reserveDate: 0,
    reserveNotice: '',
    reserveStatus: '',
  });
  const [pageDTO, setPageDTO] = useState<PageDTO>({
    currentPage: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [oneOfPets, setOneOfPets] = useState({
    userNum: 0,
    petNum: 0,
    petGender: '',
    petIsNeutered: '',
    petWeight: 0,
    petColor: '',
    userName: '',
    petName: '',
    petSpecies: '',
    petMicrochip: '',
    petBreed: '',
    petImage: '',
    petStatus: '',
    petBirth: 0,
  });
  const [password, setPassword] = useState<userPwd>({
    currentPassword: '',
  });

  const handleModelOpen = (number: number, petNum: number, index: number): void => {
    if (step > 1)
      setStep(1);
    if (number == 1) {
      setViewPetInfoModalOpen(true);
      fetchOnePetData(petNum);
    } else {
      setViewReserveModalOpen(true);
      setOneOfReserve(reserveList?.[index])
    }
  };

  const handleCloseModel = () => {
    setViewPetInfoModalOpen(false);
    setViewReserveModalOpen(false);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const getReserveList = async (page: number) => {
    try {
      const response = await axios.get<result>(`http://localhost:7124/back/api/reserve/mypage?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPageDTO(response.data.PageDTO);
      setReserveList(response.data.list)

    } catch (error) {
      console.error('Error :', error);
    }
  };


  const handleSwitchStatusOfReserve = async (reserveNum: number) => {

    try {
      const response = await axios.post(
        `http://localhost:7124/back/api/reserve/mypage/upreservataion/${reserveNum}`, password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        alert(response.data);
        handleCloseModel();
        window.location.reload();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const fetchOnePetData = async (petNum: number) => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/pet/${petNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOneOfPets(response.data);
      console.log(response.data.petImage);

    } catch (error) {
      console.log('Error :', error);
    }
  }

  const handleVerifyPwd = async () => {
    try {
      const response = await axios.post(`http://localhost:7124/back/api/user/verifyPwd`, password,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (response.status == 200) {
        alert(response.data);
        handleSwitchStatusOfReserve(oneOfReserve?.reserveNum)
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data);
      }
      console.log('Error :', error);
    }
  }

  useEffect(() => {
    getReserveList(currentPage);
  }, [currentPage]);

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">진료예약 조회</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex border-b">
            <button className="w-full py-2 text-center font-semibold text-red-600 border-b-2 border-red-600">
              나의 진료예약
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded-md mt-4">
            <h2 className="font-semibold text-lg mb-2">진료 예약 조회 서비스 안내</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>진료 예약 조회 서비스에서는 인터넷으로 예약하신 진료 내역을 모두 확인하실 수 있습니다.</li>
              <li>인터넷으로 진료 예약하신 경우, 인터넷에서 예약 취소를 하실 수 있으며 즉시 취소 처리됩니다.</li>
              <li>예약 변경이 필요하신 경우, 먼저 기존 예약을 취소하신 후 새로운 일정으로 다시 예약해 주시기 바랍니다. </li>
              <li>전화, 방문 예약을 하신 경우 고객센터(02-1234-5678)로 문의하여 내역 확인 및 취소를 해주시기 바랍니다.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">인터넷 진료 예약 현황</h2>
          <table className="w-full border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2">번호</th>
                <th className="border border-gray-300 py-2">반려동물 정보</th>
                <th className="border border-gray-300 py-2">예약 일시</th>
                <th className="border border-gray-300 py-2">진료과</th>
                <th className="border border-gray-300 py-2">의료진</th>
                <th className="border border-gray-300 py-2">예약상태</th>
                <th className="border border-gray-300 py-2">상세보기</th>
              </tr>
            </thead>
            <tbody>
              {reserveList && reserveList.length > 0 ? (
                reserveList.map((reserve, index) => (
                  <tr key={reserve.reserveNum}>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{(pageDTO.pageSize * (currentPage - 1)) + index + 1}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(1, reserve.petNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
                      {reserve.petName}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{formatDate(reserve.reserveDate)}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{reserve.department}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{reserve.managerName}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{reserve.reserveStatus}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(2, reserve.reserveNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
                      상세보기</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border border-gray-300 py-4 text-gray-500">조회 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-6 items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"}`}>이전
        </button>
        <span className="px-4 py-2 text-lg font-semibold text-red-500">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * pageDTO.pageSize >= pageDTO.totalRecords}
          className={`px-4 py-2 rounded-lg ${currentPage * pageDTO.pageSize >= pageDTO.totalRecords
            ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`} >다음
        </button>
      </div>
      {/* ================================================================================================ */}
      {viewPetInfoModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
            <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 정보 조회 </h1>
            {step === 1 && (
              <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                {oneOfPets.petImage != '' && (
                  <div className="w-full flex justify-center p-4"> {/* 패딩 추가하고 가로폭 전체로 확장 */}
                    <img
                      src={`${imagePath}${oneOfPets.petImage}`}
                      className="w-[200px] h-[150px] rounded-lg border-4 border-gray-300 object-cover"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-y-4 text-left">
                  <p className="font-semibold text-gray-600">품종:</p>
                  <p>{oneOfPets.petSpecies} ({oneOfPets.petBreed}, {oneOfPets.petColor})</p>

                  <p className="font-semibold text-gray-600">성별:</p>
                  <p>{oneOfPets.petGender} (중성화: {oneOfPets.petIsNeutered ? "예" : "아니오"})</p>

                  <p className="font-semibold text-gray-600">생년월:</p>
                  <p>{formatDate(oneOfPets.petBirth)}</p>

                  {oneOfPets.petWeight != 0 && (
                    <>
                      <p className="font-semibold text-gray-600">몸무게:</p>
                      <p>{oneOfPets.petWeight}kg</p>
                    </>
                  )}
                  {oneOfPets.petMicrochip && (
                    <>
                      <p className="font-semibold text-gray-600">MicroChip 번호:</p>
                      <p>{oneOfPets.petMicrochip}</p>
                    </>
                  )}
                </div>
              </div>
            )}
            <button onClick={handleCloseModel} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2">
              닫기
            </button>
          </div>
        </div>
      )}
      {viewReserveModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
            <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 예약 내역 상세보기 </h1>
            {step === 1 && (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                  <div className="grid grid-cols-2 gap-y-4 text-left">
                    <p className="font-semibold text-gray-600">예약 일자 :</p>
                    <p>{formatDate(oneOfReserve?.reserveDate)} ({oneOfReserve?.reserveStatus})</p>

                    <p className="font-semibold text-gray-600">진료과:</p>
                    <p>{oneOfReserve?.department}</p>

                    <p className="font-semibold text-gray-600">담당 의사:</p>
                    <p>{oneOfReserve?.managerName}</p>

                    <p className="font-semibold text-gray-600">예약 메모:</p>
                    <p>{oneOfReserve?.reserveNotice}</p>

                    <p className="font-semibold text-gray-600">진행 상태:</p>
                    <p>{oneOfReserve?.reserveStatus}</p>
                  </div>
                </div>
                {oneOfReserve?.reserveStatus == '대기' &&
                  <div className="mt-6 flex justify-around">
                    <button onClick={handleNext} className="bg-red-500 text-white px-6 py-2 rounded-md">예약 취소하기</button>
                  </div>}
              </>
            )}
            {step === 2 && (
              <div className="w-full max-w-md">
                <p className="text-center text-lg mb-4">예약 취소를 위해 비밀번호를 입력해주세요</p>
                <input
                  type="password"
                  name="currentPassword"
                  onChange={handleChange}
                  placeholder="기존 비밀번호"
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyPwd()}
                  className="w-full border border-black rounded-md p-3 focus:outline-none"
                />
                <button
                  onClick={() => handleVerifyPwd()}
                  // onClick={handleNext}
                  className="mt-8 px-8 py-2 rounded-lg text-white font-bold bg-red-500 mr-4"
                >
                  다음
                </button>
              </div>
            )}
            <button
              onClick={handleCloseModel}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mypage_reservation