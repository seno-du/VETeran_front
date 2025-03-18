import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

interface UpBoardDTO {
  upboardNum: number;
  upboardTitle: string;
  userNum: number;
  userName: string;
  upboardHit: number;
  upboardBdate: string;
  commentCount: number;
  upboardImgn: string;
}

const API_BASE_URL = "http://localhost:7124/back";

const UpboardList: React.FC = () => {
  const [upboardList, setUpboardList] = useState<UpBoardDTO[]>([]);
  const [filteredBoardList, setFilteredBoardList] = useState<UpBoardDTO[]>([]);
  const [top5Boards, setTop5Boards] = useState<UpBoardDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // 블록 단위 페이징 처리 (블록 사이즈 5)
  const blockSize = 5;
  const currentBlock = Math.floor((page - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(totalPages, startPage + blockSize - 1);
  const token = useSelector((state: any) => state.auth.token);

  const [user, setUser] = useState({
    userNum: 0,
        userId: '',
    userPwd: '',
    userPhone: '',
    userBirth: '',
    userEmail: '',
    userAddress: '',
    userdetailedAddress: '',
    userAddressNum: '',
    userStatus: '',
    userSignupDate: '',
  });


  const fetchUpboardList = async (page: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upboard/list`, {
        params: { page, size: 10 },
      });

      setUpboardList(response.data.data);

      setFilteredBoardList(response.data.data); // 초기에는 전체 리스트
      setTotalPages(response.data.totalPages || 1);
      setTotalCount(response.data.totalCount || 0);

    } catch (error: any) {
      console.error("게시판 목록을 불러오는 중 오류 발생", error.response || error.message);
    }
  };

  // TOP 5 게시글 가져오기
  const fetchTop5Boards = async () => {
    try {

      const response = await axios.get(`${API_BASE_URL}/upboard/top5`);
      setTop5Boards(response.data);

    } catch (error: any) {
      console.error("TOP 5 게시글을 불러오는 중 오류 발생", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchUpboardList(page);
    fetchTop5Boards();
  }, [page]);

  const handleSearch = () => {
    const filtered = upboardList.filter((item) =>
      item.upboardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userNum.toString().includes(searchTerm)
    );
    setFilteredBoardList(filtered);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const parsedDate = new Date(dateString.replace(" ", "T"));
      return parsedDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      console.error("날짜 변환 오류:", error);
    }
    return "-";
  };

  // 게시글이 오늘 작성된 것인지 체크 (새 글 표시)
  // const isNewPost = (dateString: string | null) => {
  //   if (!dateString) return false;
  //   const postDate = new Date(dateString.replace(" ", "T"));
  //   const today = new Date();
  //   return (
  //     postDate.getFullYear() === today.getFullYear() &&
  //     postDate.getMonth() === today.getMonth() &&
  //     postDate.getDate() === today.getDate()
  //   );
  // };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* 인기 게시글 카드 영역 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-black mb-4">🔥 실시간 인기 게시글 🔥</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {top5Boards.length > 0 ? (
              top5Boards.map((item) => (
                <div
                  key={item.upboardNum}
                  className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 transition transform hover:scale-105 hover:shadow-2xl"
                >
                  <Link
                    to={`/review/UpboardList/${item.upboardNum}`}
                    className="block text-xl font-semibold text-gray-800 hover:underline mb-2"
                  >
                    {item.upboardTitle}
                  </Link>
                  <p className="text-sm text-gray-600">
                    조회 {item.upboardHit} | 댓글 {item.commentCount}개
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-4">🔥 인기 게시글이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 게시글 목록 테이블 */}
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-300">
          <table className="w-full bg-white border border-gray-200 text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b font-semibold">제목</th>
                <th className="py-3 px-4 border-b font-semibold">작성자</th>
                <th className="py-3 px-4 border-b font-semibold">조회수</th>
                <th className="py-3 px-4 border-b font-semibold">댓글수</th>
                <th className="py-3 px-4 border-b font-semibold">작성일</th>
              </tr>
            </thead>
            <tbody>
              {filteredBoardList.length > 0 ? (
                filteredBoardList.map((item) => (
                  <tr key={item.upboardNum} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">
                      <Link to={`/review/UpboardList/${item.upboardNum}`} className="text-black font-medium hover:underline">
                        {item.upboardTitle}{" "}
                        {/* {isNewPost(item.upboardBdate) && <strong className="ml-1 text-red-500">N</strong>} */}
                      </Link>
                    </td>
                    <td className="py-3 px-4 border-b text-gray-600">{item.userName}</td>
                    <td className="py-3 px-4 border-b text-gray-600">{item.upboardHit}</td>
                    <td className="py-3 px-4 border-b text-gray-600">{item.commentCount}</td>
                    <td className="py-3 px-4 border-b text-gray-600">{formatDate(item.upboardBdate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        {/* 검색창: 페이징 처리 위에 추가, 인기 게시글과 동일한 여백 */}
        <div className="pt-5 mb-8 flex items-center space-x-2 justify-center">
          <input
            type="text"
            className="w-1/2 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-black focus:border-black transition"
            placeholder="제목 또는 작성자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 text-sm rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            검색
          </button>
        </div>

        {/* 페이징 처리 영역 */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          <Link
            to="/review/UpboardList/UpboardForm"
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-black-600 border border-gray-400 rounded-lg"
          >
            글쓰기
          </Link>
          {currentBlock > 0 && (
            <button
              onClick={() => handlePageChange(startPage - 1)}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              이전
            </button>
          )}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 text-sm font-medium ${p === page ? "font-bold" : "text-gray-700 hover:text-black-600"}`}
            >
              {p}
            </button>
          ))}
          {endPage < totalPages && (
            <button
              onClick={() => handlePageChange(endPage + 1)}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpboardList;
