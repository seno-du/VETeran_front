import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';

const Mypage_medical_history: React.FC = () => {

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

  interface chart {
    petName: string;
    userNum: number;
    managerNum: number
    petNum: number;
    chartDate: number;
    chartNum: number;
    department: string;
    managerName: string;
    reserveNum: number;
    chartNote: string;
  }

  interface hospital {
    petName: string;
    userNum: number;
    managerNum: number
    petNum: number;
    hospitalNum: number;
    chartNum: number;
    department: string;
    managerName: string;
    reserveNum: number;
    hospitalStatus: string;
    hospitalStartTime: number;
    hospitalMemo: string;
  }

  const [currentPageOfChart, setCurrentPageOfChart] = useState(1);
  const [currentPageOfHospital, setCurrentPageOfHospital] = useState(1);

  const [chartList, setChartList] = useState<chart[]>();
  const [hospitalList, setHospitalList] = useState<hospital[]>();

  const [viewPetInfoModalOpen, setViewPetInfoModalOpen] = useState(false);
  const [viewChartModalOpen, setViewChartModalOpen] = useState(false);
  const [viewHospitalModalOpen, setViewHospitalModalOpen] = useState(false);
  const token = useSelector((state: any) => state.auth.token);

  const imagePath = "http://localhost:7124/back/uploads/";

  const [oneOfChart, setOneOfChart] = useState<chart>({
    petName: '',
    userNum: 0,
    managerNum: 0,
    petNum: 0,
    chartDate: 0,
    chartNum: 0,
    department: '',
    managerName: '',
    reserveNum: 0,
    chartNote: '',
  });

  const [oneOfHospital, setOneOfHospital] = useState<hospital>({
    petName: '',
    userNum: 0,
    managerNum: 0,
    petNum: 0,
    hospitalNum: 0,
    chartNum: 0,
    department: '',
    managerName: '',
    reserveNum: 0,
    hospitalStatus: '',
    hospitalStartTime: 0,
    hospitalMemo: '',
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

  const handleModelOpen = (number: number, petNum: number, index: number): void => {
    if (number == 1) {
      setViewPetInfoModalOpen(true);
      fetchOnePetData(petNum);
    } else if (number == 2) {
      setViewChartModalOpen(true);
      setOneOfChart(chartList?.[index])
    } else {
      setViewHospitalModalOpen(true);
      setOneOfHospital(hospitalList?.[index])
    }
  };

  const handleCloseModel = () => {
    setViewPetInfoModalOpen(false);
    setViewChartModalOpen(false);
    setViewHospitalModalOpen(false);
  };


  const getChartList = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/chart/mypage?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPageDTO(response.data.PageDTO);
      setChartList(response.data.list)

    } catch (error) {
      console.error('Error :', error);
    }
  };

  const getHospitalList = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/hospital/mypage?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPageDTO(response.data.PageDTO);
      setHospitalList(response.data.list)

    } catch (error) {
      console.error('Error :', error);
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

  useEffect(() => {
    getChartList(currentPageOfChart);
  }, [currentPageOfChart]);

  useEffect(() => {
    getHospitalList(currentPageOfHospital);
  }, [currentPageOfHospital]);

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handlePageOfChartChange = (page: number) => {
    setCurrentPageOfChart(page);
  };

  const handlePageOfHospitalChange = (page: number) => {
    setCurrentPageOfHospital(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-center text-2xl font-bold mb-6">진료내역 및 입원일정</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex border-b">
            <button className="w-full py-2 text-center font-semibold text-red-600 border-b-2 border-red-600">
              반려동물 진료내역 및 입원일정
            </button>
          </div>
          <div className="p-4 border border-gray-300 rounded-md mt-4">
            <h2 className="font-semibold text-lg mb-2">진료내역 조회 안내</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>반려동물의 진료 기록은 법적 의무에 따라 2년간 보관됩니다. 보관 기간이 만료된 후에는 기록이 자동으로 삭제됩니다. 이를 참고하여 필요한 진료 기록을 미리 요청해 주세요.</li>
              <li>검사 결과는 최대 1년 동안 보관되며, 그 이후에는 자동으로 삭제됩니다. 검사 결과가 필요한 경우, 기간 내에 다운로드하시거나 병원에 문의해주세요.</li>
              <li>처방된 의약품 내역은 처방일로부터 1년간 보관됩니다. 처방 내역이 필요하시면 미리 확인해 주세요.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">진료 내역</h2>
          <table className="w-full border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2">번호</th>
                <th className="border border-gray-300 py-2">반려동물 정보</th>
                <th className="border border-gray-300 py-2">진료 일시</th>
                <th className="border border-gray-300 py-2">진료과</th>
                <th className="border border-gray-300 py-2">의료진</th>
                <th className="border border-gray-300 py-2">상세보기</th>
              </tr>
            </thead>
            <tbody>
              {chartList && chartList.length > 0 ? (
                chartList.map((chart, index) => (
                  <tr key={chart.chartNum}>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{(pageDTO.pageSize * (currentPageOfChart - 1)) + index + 1}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(1, chart.petNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
                      {chart.petName}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{formatDate(chart.chartDate)}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{chart.department}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{chart.managerName}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(2, chart.chartNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
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
          <div className="flex justify-center mt-6 items-center space-x-4">
            <button
              onClick={() => handlePageOfChartChange(currentPageOfChart - 1)}
              disabled={currentPageOfChart === 1}
              className={`px-4 py-2 rounded-lg ${currentPageOfChart === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"}`}>이전
            </button>
            <span className="px-4 py-2 text-lg font-semibold text-red-500">
              {currentPageOfChart}
            </span>
            <button
              onClick={() => handlePageOfChartChange(currentPageOfChart + 1)}
              disabled={currentPageOfChart * pageDTO.pageSize >= pageDTO.totalRecords}
              className={`px-4 py-2 rounded-lg ${currentPageOfChart * pageDTO.pageSize >= pageDTO.totalRecords
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`} >다음
            </button>
          </div>
        </div>


        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">입원 일정</h2>
          <table className="w-full border border-gray-300 text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 py-2">번호</th>
                <th className="border border-gray-300 py-2">반려동물 정보</th>
                <th className="border border-gray-300 py-2">입원 일시</th>
                <th className="border border-gray-300 py-2">진료과</th>
                <th className="border border-gray-300 py-2">의료진</th>
                <th className="border border-gray-300 py-2">상세보기</th>
              </tr>
            </thead>
            <tbody>
              {hospitalList && hospitalList.length > 0 ? (
                hospitalList.map((hospital, index) => (
                  <tr key={hospital.reserveNum}>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{(pageDTO.pageSize * (currentPageOfHospital - 1)) + index + 1}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(1, hospital.petNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
                      {hospital.petName}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{formatDate(hospital.hospitalStartTime)}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{hospital.department}</td>
                    <td colSpan={1} className="border border-gray-300 py-4 text-gray-500">{hospital.managerName}</td>
                    <td colSpan={1} onClick={() => handleModelOpen(3, hospital.hospitalNum, index)} className="border border-gray-300 py-4 text-gray-500 cursor-pointer  hover:text-blue-500 hover:underline transition-all">
                      상세보기
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border border-gray-300 py-4 text-gray-500">조회 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-6 items-center space-x-4">
            <button
              onClick={() => handlePageOfHospitalChange(currentPageOfHospital - 1)}
              disabled={currentPageOfHospital === 1}
              className={`px-4 py-2 rounded-lg ${currentPageOfHospital === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"}`}>이전
            </button>
            <span className="px-4 py-2 text-lg font-semibold text-red-500">
              {currentPageOfHospital}
            </span>
            <button
              onClick={() => handlePageOfHospitalChange(currentPageOfHospital + 1)}
              disabled={currentPageOfHospital * pageDTO.pageSize >= pageDTO.totalRecords}
              className={`px-4 py-2 rounded-lg ${currentPageOfHospital * pageDTO.pageSize >= pageDTO.totalRecords
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`} >다음
            </button>
          </div>
        </div>

        {/* ================================================================================================ */}
        {viewPetInfoModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 정보 조회 </h1>
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                  {oneOfPets.petImage && (
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
              <button onClick={handleCloseModel} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2">
                닫기
              </button>
            </div>
          </div>
        )}
        {viewChartModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 진료 내역 상세보기 </h1>
              <>
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                  <div className="grid grid-cols-2 gap-y-4 text-left">
                    <p className="font-semibold text-gray-600">진료 일자 :</p>
                    <p>{formatDate(oneOfChart?.chartDate)}</p>

                    <p className="font-semibold text-gray-600">진료과:</p>
                    <p>{oneOfChart?.department}</p>

                    <p className="font-semibold text-gray-600">담당 의사:</p>
                    <p>{oneOfChart?.managerName}</p>

                    <p className="font-semibold text-gray-600">진료 메모:</p>
                    <p>{oneOfChart?.chartNote}</p>
                  </div>
                </div>
              </>
              <button
                onClick={handleCloseModel}
                className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500 p-2"
              >
                닫기
              </button>
            </div>
          </div>
        )}
        {viewHospitalModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full relative">
              <h1 className="text-xl font-semibold text-gray-900 mb-6"><span>{oneOfPets?.petName}</span> 입원 내역 상세보기 </h1>
              <>
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-gray-800">
                  <div className="grid grid-cols-2 gap-y-4 text-left">
                    <p className="font-semibold text-gray-600">입원 일자 :</p>
                    <p>{formatDate(oneOfHospital?.hospitalStartTime)}</p>

                    <p className="font-semibold text-gray-600">진료과:</p>
                    <p>{oneOfHospital?.department}</p>

                    <p className="font-semibold text-gray-600">담당 의사:</p>
                    <p>{oneOfHospital?.managerName}</p>

                    <p className="font-semibold text-gray-600">입원 메모:</p>
                    <p>{oneOfHospital?.hospitalMemo}</p>

                    <p className="font-semibold text-gray-600">입원 상태:</p>
                    <p>{oneOfHospital?.hospitalStatus}</p>
                  </div>
                </div>
              </>
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
    </div>
  );
}

export default Mypage_medical_history