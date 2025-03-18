import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pet } from "../Types/Pet";

interface PageDTO {
  currentPage: number;
  total: number;
  size: number;
  hasNextPage: boolean;
}

interface PetData extends Pet {
  hasLatestChart: number;
}
const imagePath = "http://localhost:7124/back/uploads/";
const SERVER_URL = "http://localhost:7124/back/api";

const PatientFind: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");  // 보호자ID
  const [patientName, setPatientName] = useState<string>(""); // 환자명
  const [selectedPatient, setSelectedPatient] = useState<PetData | null>(null);
  const [patients, setPatients] = useState<PetData[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageDTO, setPageDTO] = useState<PageDTO | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<PetData[]>([]);  // 필터링된 환자 목록

  const navigate = useNavigate();

  // 환자 목록 가져오기
  const fetchNotices = async (page: number) => {
    try {
      const response = await axios.get(`${SERVER_URL}/pet/all`, {
        headers: { "Content-Type": "application/json" },
        params: { page },
      });
      console.log("✅ 데이터 로드 완료: ", response.data);
      if (response.data && response.data.data) {
        setPatients(response.data.data);
        setPageDTO({
          currentPage: response.data.currentPage,
          total: response.data.total,
          size: response.data.size,
          hasNextPage:
            response.data.currentPage * response.data.size <
            response.data.total,
        });
      } else {
        throw new Error("응답 데이터 구조가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("🚨 데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  // 필터링 로직
  useEffect(() => {
    if (patients) {
      const filtered = patients.filter((patient) => {
        const matchesSearchTerm = patient.userName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesPatientName = patient.petName
          .toLowerCase()
          .includes(patientName.toLowerCase());
        return matchesSearchTerm && matchesPatientName;
      });
      console.log("✅ 필터링된 환자 목록: ", filtered); // 필터링된 데이터 확인
      setFilteredPatients(filtered);
    }
  }, [patients, searchTerm, patientName]);

  const formatDate = (noticeDate: number | Date) => {
    const date = new Date(noticeDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // 차트 이동 함수
  const navigateToLatestChart = async (petNum: number) => {
    try {
      console.log("petNum", petNum);
      const response = await axios.get(
        `${SERVER_URL}/chart/getLatestChart?petNum=${petNum}`
      );
      if (response.data === "") {
        alert("차트 데이터를 찾을 수 없습니다.");
      } else {
        navigate("/chart/" + response.data);
      }
    } catch (error) {
      console.error("차트 이동 실패:", error);
      alert("차트 이동에 실패했습니다.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`/?page=${page}`);
  };


  return (
    <div className="p-6 mx-auto mt-6 bg-white border shadow-lg rounded-xl h-[90vh]">
      <div className="flex flex-row h-[100%]">
        {/* 왼쪽 필터 메뉴와 미니 차트 영역 */}
        <div className="flex flex-col w-1/4 mr-6 h-[100%]">
          {/* 필터 섹션 */}
          <div className="p-4 mb-4 bg-gray-100 rounded-lg shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">필터 검색</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">보호자ID</label>
              <input
                type="text"
                placeholder="보호자ID 입력"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">환자명</label>
              <input
                type="text"
                placeholder="환자명 입력"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              className="w-full px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => {
                // 추가 필터 로직 필요 시 구현
              }}
            >
              필터 적용
            </button>
          </div>

          {/* 미니 차트 영역 - 선택된 환자가 있을 때만 표시 */}
          {selectedPatient && (
            <div className="flex flex-col flex-1 p-4 overflow-y-scroll bg-white rounded-lg shadow">
              <h3 className="pb-2 mb-2 text-lg font-semibold text-gray-700 border-b">
                환자 정보
              </h3>
              <div className="mb-3">
                {selectedPatient.petImage != ''? (
                  <img
                  src={`${imagePath}${selectedPatient.petImage}`}/>
                  ):(
                  <img
                  src={
                    "https://img2.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202304/21/bemypet/20230421120037737gfub.jpg"
                  }
                  alt="Pet"
                  className="object-cover w-full h-40 mb-3 rounded-lg"
                />
              )}
                
                <h4 className="mb-2 text-xl font-bold text-teal-700">
                  {selectedPatient.petName}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">보호자명</span>
                    <span>{selectedPatient.userName}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">종</span>
                    <span>{selectedPatient.petSpecies}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">품종</span>
                    <span>{selectedPatient.petBreed}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">성별</span>
                    <span>{selectedPatient.petGender}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">모색</span>
                    <span>{selectedPatient.petColor}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">생년월일</span>
                    <span>{formatDate(new Date(selectedPatient.petBirth)).slice(0,(formatDate(new Date(selectedPatient.petBirth))).length - 11)}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">마이크로칩</span>
                    <span>{selectedPatient.petMicrochip || "없음"}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-gray-50">
                    <span className="font-medium text-gray-600">체중</span>
                    <span>{selectedPatient.petWeight} kg</span>
                  </div>
                </div>
                {/* 두 버튼을 감싸는 컨테이너 */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      navigateToLatestChart(selectedPatient.petNum)
                    }
                    className={selectedPatient.hasLatestChart === 1
                      ? "flex-1 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      : "flex-1 px-4 py-2 text-sm font-bold text-white rounded-lg shadow-md cursor-not-allowed bg-gradient-to-r from-gray-400 to-gray-500 hover:shadow-none focus:outline-none focus:ring-2 focus:ring-gray-400"}
                    disabled={selectedPatient.hasLatestChart !== 1}
                  >
                    차트 이동
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 컨텐츠 영역 */}
        <div className="flex-1">
          {/* 환자 목록 */}
          <div className="overflow-auto border border-gray-300 rounded-lg shadow-md">
            <table className="w-full text-left text-gray-800 table-auto">
              <thead className="text-gray-700 bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    이름
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    보호자 이름
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    품종
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    종
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    성별
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    모색
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold border-b-2 border-gray-300">
                    생년월일
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className="transition-colors duration-200 hover:bg-gray-100"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 border-b border-gray-300">
                        {patient.petName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                        {patient.userName}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                        {patient.petBreed}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                        {patient.petSpecies}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                        {patient.petGender}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                        {patient.petColor}
                      </td>
                      <td className="px-4 py-3 text-gray-700 border-b border-gray-300">
                       {formatDate(new Date(patient.petBirth)).slice(0,(formatDate(new Date(patient.petBirth))).length - 11)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      검색된 환자가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 UI */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <button
              className={`px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 ${pageDTO && pageDTO?.currentPage > 1
                ? "text-gray-700 hover:text-teal-600"
                : "text-gray-400 cursor-not-allowed"
                }`}
              onClick={() =>
                pageDTO &&
                pageDTO?.currentPage > 1 &&
                handlePageChange(pageDTO.currentPage - 1)
              }
              disabled={pageDTO?.currentPage === 1}
            >
              이전
            </button>

            <div className="flex space-x-2">
              {Array.from(
                {
                  length: pageDTO ? Math.ceil(pageDTO.total / pageDTO.size) : 1,
                },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 ${page === currentPage
                    ? "text-teal-600 font-bold border-b-2 border-teal-600"
                    : "text-gray-700 hover:text-teal-600"
                    }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className={`px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 ${pageDTO?.hasNextPage
                ? "text-gray-700 hover:text-teal-600"
                : "text-gray-400 cursor-not-allowed"
                }`}
              onClick={() =>
                pageDTO?.hasNextPage &&
                handlePageChange(pageDTO.currentPage + 1)
              }
              disabled={!pageDTO?.hasNextPage}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFind;
