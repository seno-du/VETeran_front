import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import FooterSave from "../footer/FooterSave";

// ✅ 페이지네이션 인터페이스
interface PageDTO {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

// ✅ 문서 데이터 인터페이스
interface Document {
  mfileNum: number;
  mfileName: string;
  mfileRealName: string;
  mfileTitle: string;
  mfileContent: string;
  mfileCategory: number;
  mfileDate: Date;
  mfileUploader: string;
  mfileDownloadCount: number;
  mfileModifiedDate: Date;
  mfileStatus: string;
}

// 카테고리 매핑
const categories = [
  "내과 & 영상의학과",
  "심장 & 신장 내외과",
  "외과 & 마취과",
  "치과 & 안과",
  "피부과 & 면역과",
  "정형외과 & 재활의학과",
  "종양학 & 혈액학"
];

const Document: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<Document[]>([]);
  const [pageDTO, setPageDTO] = useState<PageDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // 검색 필터 상태 추가
  const [searchDate, setSearchDate] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchUploader, setSearchUploader] = useState<string>("");
  // const token = sessionStorage.getItem("accessToken");
  // API 호출 함수
  const fetchFiles = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/mfile/all`, {
        params: { page },
      });

      console.log("API 응답 데이터:", response.data);

      if (response.data && response.data.list) {
        // 비활성 파일(`mfileStatus === "비활성"`)을 목록에서 제외
        setFiles(response.data.list.filter((file: Document) => file.mfileStatus !== "비활성"));
        setPageDTO(response.data.PageDTO);
      } else {
        throw new Error("응답 데이터 구조가 잘못되었습니다.");
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };


  // 페이지 변경 시 API 호출
  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage]);



  // API 호출 함수 (검색 필터 반영)
  const searchFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:7124/back/api/mfile/search`, {
        params: {
          mfileDate: searchDate,
          mfileCategory: searchCategory ? parseInt(searchCategory, 10) : undefined,
          mfileUploader: searchUploader,
        },
      });

      console.log("검색 API 응답 데이터:", response.data); 

      if (response.data && response.data.length > 0) {
        // 검색된 결과만 적용 & 비활성 파일 제외
        setFiles(response.data.filter((file: Document) => file.mfileStatus !== "비활성"));
        setPageDTO(null);  // ✅ 검색 시 페이지네이션 초기화 (필요 시 유지 가능)
      } else {
        setFiles([]); // 데이터 없을 경우 빈 배열
      }
    } catch (error) {
      console.error("검색 데이터 로드 실패:", error);
      setFiles([]);  // 오류 발생 시 빈 배열
    }
  };

  // 검색 필터 적용 버튼 클릭 시 API 요청
  const handleFilterApply = () => {
    searchFiles();
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 상태 업데이트
    navigate(`/mfile/all?page=${page}`); // URL 변경 형식 수정
  };

  // 상세 페이지로 이동하는 함수 추가
  const goToDetailPage = (id: number) => {
    navigate(`/mfile/detail/${id}`);
  };

  const formatDate = (mfileDate: Date) => {
    const mfiledate = new Date(mfileDate);
    return mfiledate.toLocaleDateString() + " " + mfiledate.toLocaleTimeString();
  };

  const formatModifiedDate = (mfileModifiedDate: Date) => {
    const date = new Date(mfileModifiedDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      {/* 파일 목록 */}
      <div className="bg-gradient-to-br from-gray-100 to-white-300 min-h-screen text-black p-6">
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex gap-6">
            {/* 필터 메뉴 */}
            <div className="w-1/4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">필터</h3>

              <label className="block mb-2 text-gray-600">업로드 날짜</label>
              <input
                type="date"
                className="w-full p-2 border rounded mb-4"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                required
              />

              <label className="block mb-2 text-gray-600">카테고리</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                required
              >
                <option value="">선택</option>
                {categories.map((category, index) => (
                  <option key={index} value={index + 1}>{category}</option>
                ))}
              </select>

              <label className="block mb-2 text-gray-600">담당자</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                placeholder="담당자 이름"
                value={searchUploader}
                onChange={(e) => setSearchUploader(e.target.value)}
                required
              />

              <button
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                onClick={handleFilterApply}
              >
                필터 적용
              </button>
            </div>

            {/* 게시판 */}
            <div className="w-3/4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => navigate("/mfile/upload")}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 flex items-center">
                  파일 업로드
                </button>
              </div>
              <table className="w-full text-gray-800 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 border border-gray-300">
                    <th className="py-3 px-4 border border-gray-300">ID</th>
                    <th className="py-3 px-4 border border-gray-300">파일명</th>
                    <th className="py-3 px-4 border border-gray-300">카테고리</th>
                    <th className="py-3 px-4 border border-gray-300">업로드 날짜</th>
                    <th className="py-3 px-4 border border-gray-300">담당자</th>
                    <th className="py-3 px-4 border border-gray-300">다운로드 횟수</th>
                    <th className="py-3 px-4 border border-gray-300">최근 수정</th>
                  </tr>
                </thead>
                <tbody>
                  {files.length > 0 ? (
                    files.map((file) => (
                      <tr
                        key={file.mfileNum}
                        className="border-b border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                        onClick={() => goToDetailPage(file.mfileNum)}
                      >
                        <td className="py-3 px-4 border border-gray-300 text-center">
                          {file.mfileNum}
                        </td>
                        <td className="py-3 px-4 border border-gray-300">
                          {file.mfileRealName}
                        </td>
                        <td className="py-3 px-4 border border-gray-300">
                          {categories[file.mfileCategory - 1] || "미정"}
                        </td>
                        <td className="py-3 px-4 border border-gray-300 text-center">
                          {formatDate(file.mfileDate)}
                        </td>
                        <td className="py-3 px-4 border border-gray-300 text-center">
                          {file.mfileUploader}
                        </td>
                        <td className="py-3 px-4 border border-gray-300 text-center">
                          {file.mfileDownloadCount}
                        </td>
                        <td className="py-3 px-4 border border-gray-300 text-center">
                          {formatModifiedDate(file.mfileModifiedDate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pageDTO && pageDTO.totalRecords > 0 && (
                <div className="flex justify-center items-center my-8 space-x-4">
                  {/* 이전 페이지 버튼 */}
                  <button
                    className={`p-2 ${pageDTO.currentPage > 1 ? 'text-black hover:text-blue-600' : 'text-gray-400'} cursor-pointer`}
                    onClick={() => pageDTO.currentPage > 1 && handlePageChange(pageDTO.currentPage - 1)}
                    disabled={pageDTO.currentPage === 1}
                    aria-label="Previous"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: pageDTO.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`px-2 mx-5 text-lg lg:text-2xl ${page === pageDTO.currentPage ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-600'} focus:outline-none`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 페이지 버튼 */}
                  <button
                    className={`p-2 ${pageDTO.hasNextPage ? 'text-black hover:text-blue-600' : 'text-gray-400'} cursor-pointer`}
                    onClick={() => pageDTO.hasNextPage && handlePageChange(pageDTO.currentPage + 1)}
                    disabled={!pageDTO.hasNextPage}
                    aria-label="Next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FooterSave />
    </div>
  );
};

export default Document;
