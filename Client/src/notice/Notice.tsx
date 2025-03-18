import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import noticeBanner from '/images/notice.webp';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Notice {
  noticeNum: number;
  noticeTitle: string;
  noticeContent: string;
  noticeDate: Date;
  noticeImage: string;
  noticeHit: number;
  noticeStatus: string;
}

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

const Notice: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // 현재 선택된 항목 인덱스
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [pageDTO, setPageDTO] = useState<PageDTO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const filePath = "http://localhost:7124/back/uploads/";
  const suggestionBoxRef = useRef<HTMLUListElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isAdmin] = useState(true); // 관리자 여부 (임시)
  // const [isAdmin, setIsAdmin] = useState(false); 
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const token = useSelector((state: any) => state.auth.token);
  // 로그인한 사용자가 관리자 권한을 가진 경우 isAdmin을 true로 설정
  useEffect(() => {
    console.log("token", token);
    if (token) {
      // axios
      //   .get("http://localhost:7124/back/api/user/role", {
      //     headers: { Authorization: `Bearer ${token}` },
      //   })
      //   .then((response) => {
      //     // 백엔드에서 반환한 사용자 역할을 확인
      //     if (response.data.role === "admin") {
      //       setIsAdmin(true); // 관리자일 경우
      //     } else {
      //       setIsAdmin(false); // 관리자 아닌 경우
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("관리자 권한 확인 실패", error);
      //     setIsAdmin(false); // 권한 확인 실패 시 기본값 false
      //   });
    }
  }, []);

  const formatDate = (noticeDate: Date) => {
    const date = new Date(noticeDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  //검색---------------------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('noticeTitle');
  const [searchDate, setSearchDate] = useState<string>("");

  // 공지 클릭 시 세부 페이지로 이동
  const handleNoticeClick = (noticeNum: number) => {
    navigate(`/notice/detail/${noticeNum}`);
  };

  // 자동완성 목록 클릭 시 입력창에 반영
  const handleSuggestionClick = (suggestion: string, index: number) => {
    setSearchTerm(suggestion);
    setSelectedIndex(index); // 클릭된 항목에 해당하는 인덱스 설정
    setSuggestions([]); // 자동완성 목록 초기화
  };



  const handleSearch = async () => {
    setNoResults(false);
    setError('');  // 기존 오류 메시지 초기화

    const endpointMap = {
      noticeTitle: "title",
      noticeContent: "content",
      noticeDate: "date",
    };
    const endpoint = endpointMap[searchType];
    const queryParamKey = searchType === "noticeDate" ? "noticeDate" : searchType === "noticeContent" ? "noticeContent" : "noticeTitle";
    const queryParam =
      searchType === "noticeDate" ? searchDate :
        searchType === "noticeContent" ? searchTerm :
          searchTerm;

    try {
      const response = await axios.get(`http://localhost:7124/back/api/notice/search/${endpoint}`, {
        params: { [queryParamKey]: queryParam },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // 응답 데이터 확인
      if (response.status === 200) {
        if (response.data.length === 0) {
          setNoResults(true);  // 결과가 없으면 상태 업데이트
          setError(`${searchType === 'noticeDate' ? '선택된 날짜' : '검색어'}에 해당하는 결과가 없습니다.`);
        } else {
          // 검색어에 맞는 글만 필터링하여 상태 업데이트
          const filteredNotices = response.data.filter((notice: Notice) => {
            if (searchType === 'noticeTitle') {
              return notice.noticeTitle.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchType === 'noticeContent') {
              return notice.noticeContent.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchType === 'noticeDate') {
              return new Date(notice.noticeDate).toLocaleDateString().includes(searchDate);
            }
            return true;
          });
          setNotices(filteredNotices);
        }
      } else {
        // 응답이 200이 아닌 다른 경우 오류 처리
        setError('응답 처리 중 오류 발생');
      }
      setSuggestions([]);
      navigate(`/notice/search/${endpoint}?${queryParamKey}=${encodeURIComponent(queryParam)}`);
    } catch (error) {
      console.error("검색 오류:", error);
      alert("존재하지 않는 글입니다");
      setNoResults(true);
    }
  };



  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => {
        if (suggestions.length === 0) return prevIndex;
        return prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex;
      });
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => {
        if (suggestions.length === 0) return prevIndex;
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      });
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        // Enter 키를 눌렀을 때 선택된 항목만 보여주기
        setSearchTerm(suggestions[selectedIndex]);
        setSuggestions([]);
        handleSearch();
      } else {
        handleSearch()
      }
    }
  };





  // 검색 입력 변경 시 호출
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // 검색어 상태 업데이트

    if (!value.trim()) {
      // 검색어가 비었을 때는 모든 공지사항을 다시 불러오기
      fetchNotices(1);
      setSuggestions([]); // 자동완성 목록 초기화
    } else {
      // 검색어가 있을 경우는 기존의 검색 방식으로 처리
      const endpointMap: Record<string, string> = {
        noticeTitle: "title",
        noticeContent: "content",
        noticeDate: "date",
      };
      const endpoint = endpointMap[searchType] || "title";

      try {
        const response = await axios.get(`http://localhost:7124/back/api/notice/search/${endpoint}`, {
          params: { [searchType]: value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.length > 0) {
          setSuggestions(response.data.map((notice: Notice) => {
            if (searchType === "noticeTitle") {
              return notice.noticeTitle;
            } else if (searchType === "noticeContent") {
              return notice.noticeContent;
            } else if (searchType === "noticeDate") {
              return notice.noticeDate;
            }
          }));
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("자동완성 오류:", error);
        setSuggestions([]);
      }
    }
  };


  const fetchNotices = async (page: number) => {
    try {
      const response = await axios.get("http://localhost:7124/back/api/notice/all", {
        params: { page },
        headers: {
          'Authorization': `Bearer ${token}`,  // 토큰을 Authorization 헤더에 추가
        },
      });

      if (response.data && response.data.list) {
        // 비활성 공지사항 제외
        setNotices(response.data.list.filter((notice: Notice) => notice.noticeStatus !== '비활성'));
        setPageDTO(response.data.PageDTO);
      } else {
        throw new Error("응답 데이터 구조가 잘못되었습니다.");
      }

      setLoading(false);
    } catch (error) {
      console.error("🚨 데이터 로드 실패:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!searchTerm.trim()) {
      // 검색어가 비어 있을 때는 모든 공지사항을 불러오기
      fetchNotices(1);
    }
  }, [searchTerm]); // 검색어가 변경될 때마다 호출



  const handlePageChange = (page: number) => {
    setCurrentPage(page); // ✅ 상태 업데이트
    navigate(`/notice/all?page=${page}`); // ✅ URL 변경 형식 수정
  };


  if (error) return <div className="text-red-500 font-bold">오류: {error}</div>;

  return (
    <div className="relative overflow-hidden" style={{ marginTop: "-4rem" }}>
      {noResults && (
        <div className="text-center my-4 text-lg">
          검색 결과가 없습니다.
        </div>
      )}
      <div className="relative w-full">
        <img
          ref={imageRef}
          src={noticeBanner}
          alt="Notice Banner"
          className="w-full object-cover h-[40vh] md:h-[50vh] lg:h-[60vh] xl:h-[70vh] max-h-[700px]"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

        <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center text-center 
        px-4 sm:px-6 md:px-8 lg:px-12 text-white"
          style={{ height: "100%", width: "100%" }}>
          <img src="/images/dog_banner.webp" alt="Notice Icon" className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 mb-4" />
          <p className="text-yellow-400 font-semibold text-sm sm:text-lg md:text-xl lg:text-2xl mb-2">
            멍트리오 NEWS ROOM
          </p>
          <p className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold my-4 sm:my-5 md:my-6">
            멍트리오 Notice
          </p>
          <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mt-2 sm:mt-3">
            멍트리오 동물의료센터의 공지를 알려드립니다.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-16 mt-[5vh]">
        {notices && notices.map((notice, index) => (
          <div
            key={notice.noticeNum}
            className={`group border-t ${index === 0 ? 'border-transparent' : 'border-gray-300'} 
            py-6 transition-colors duration-200 hover:bg-gray-100`}
            onClick={() => handleNoticeClick(notice.noticeNum)}
          >
            <div className="flex items-start space-x-6 px-4 py-2">
              {notice.noticeImage ? (
                <>
                  {console.log("이미지 URL:", `${filePath}${notice.noticeImage}`)}
                  <img
                    src={`${filePath}${notice.noticeImage}`}
                    alt={notice.noticeTitle}
                    className="w-64 h-40 object-cover rounded-lg"

                  />
                </>
              ) : (
                <div className="w-64 h-40 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  이미지 없음
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 transition-colors duration-200 group-hover:text-blue-600">
                  {notice.noticeTitle}
                </h3>
                <p className="text-gray-600">{notice.noticeContent}</p>
                <div className="flex justify-start items-center mt-4 text-sm text-gray-500 space-x-6">
                  <div className="flex items-center space-x-2">
                    <img src="/images/eye.webp" alt="Views" className="w-4 h-4" />
                    <span>{notice.noticeHit ?? 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img src="/images/clock.webp" alt="Date" className="w-4 h-4" />
                    <span>{formatDate(notice.noticeDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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


      <div className="flex justify-center items-center mt-4 mb-32 space-x-2">
        <div className="relative">
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="border-2 border-black text-gray-700 py-2 rounded-l-full focus:outline-none focus:border-blue-500 pl-3 pr-8 font-semibold">
            <option value="noticeTitle">제목</option>
            <option value="noticeContent">내용</option>
            <option value="noticeDate">날짜</option>
          </select>
        </div>

        <div className="relative w-3/4 max-w-lg flex-grow">
          <input
            type={searchType === "noticeDate" ? "date" : "text"}
            placeholder="검색어를 입력해주세요"
            value={searchType === "noticeDate" ? searchDate : searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-3 pr-12 py-2 w-full border-2 border-black rounded-r-full text-gray-700 focus:outline-none focus:border-blue-500"
          />

          {/* 자동완성 목록 표시 */}
          {suggestions.length > 0 && (
            <ul ref={suggestionBoxRef} className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 cursor-pointer ${index === selectedIndex ? 'bg-gray-200' : ''}`} // 선택된 항목 강조
                  onClick={() => handleSuggestionClick(suggestion, index)} // 클릭 시 인덱스와 함께 처리
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}


          {/* 🔹 검색 버튼 */}
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-transparent"
            style={{ outline: 'none' }}
          >
            <img src="/icons/magnifier.webp" alt="Search" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

};

export default Notice