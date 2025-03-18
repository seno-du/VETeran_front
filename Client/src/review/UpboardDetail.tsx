import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";

interface UpBoardDTO {
  upboardNum: number;
  upboardTitle: string;
  userName: string;
  userNum: number;
  upboardContent: string;
  upboardImgn: string | null;
  upboardHit: number;
  upboardBdate: string;
  commentCount: number;
  comments?: any[]; // 댓글 데이터
}

const API_BASE_URL = "http://localhost:7124/back";

const UpboardDetail: React.FC = () => {
  const { num } = useParams<{ num: string }>(); // URL에서 num 가져오기
  const postId = Number(num); // 문자열을 숫자로 변환
  const navigate = useNavigate();

  // 게시글 데이터
  const [upboard, setUpboard] = useState<UpBoardDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: any) => state.auth.token);

  const [user, setUser] = useState({userNum: 0,});

  
  //  이미지 URL 변환 함수
  const getImageUrl = (path: string | null) => {
    if (!path) return "/default-placeholder.png"; // 기본 이미지 대체
    if (path.startsWith("http")) return path;
    return `http://localhost:7124/back/uploads${path.replace("/uploads", "")}`;
  };

  //  날짜 변환 함수
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
    } catch (error) {
      console.error(" 날짜 변환 오류:", error);
    }
    return "-";
  };

  // 로그인된 사용자 정보 가져오기
  const fetchUserNum = async () => {
    try {
      console.log("fetchUserNum 실행");
      const response = await axios.get(`${API_BASE_URL}/api/user/one`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("응답 데이터:", response.data);
    
    if (response.data?.userNum) {
      setUser({ userNum: response.data.userNum });
    } else {
      console.warn(" userNum이 응답 데이터에 없음!");
    }
  } catch (error) {
    console.error(" 사용자 정보를 가져오는 중 오류 발생:", error);
  }
};

  // 게시글 상세정보 가져오기
  const fetchDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upboard/detail/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedData = response.data?.data ?? response.data;
      console.log("게시글 데이터:", fetchedData);
      if (!fetchedData || !fetchedData.upboardNum) {
        setError("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        return;
      }
      setUpboard(fetchedData);
      console.log("게시글 데이터:", fetchedData);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setError("게시글 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제 함수
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return; // 삭제 확인

    try {
      await axios.delete(`${API_BASE_URL}/upboard/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("게시글이 삭제되었습니다.");
      navigate("/review/UpboardList"); // 삭제 후 목록으로 이동
    } catch (error) {
      alert("게시글 삭제에 실패했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError("잘못된 게시글 번호입니다.");
      return;
    }

    console.log("postId:", postId);

    // 게시글 상세 불러오기
    fetchDetail();

    // 로그인된 사용자 번호 불러오기
    if (token) {
      fetchUserNum();
    } else {
      setUser({ userNum: 0 });
    }
  }, [postId, token]);

  useEffect(() => {
    console.log("upboard.userNum:", upboard?.userNum);
    console.log("user.userNum:", user.userNum);
  }, [upboard, user]);

  // 로딩/에러 처리
  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        {error}
      </div>
    );
  }

  if (!upboard) {
    return (
      <div className="text-center text-gray-500 py-10">
        게시글 정보를 불러오는 중...
      </div>
    );
  }

  // 댓글 데이터에 비활성 상태 처리
  const processedComments = upboard.comments?.map((comment: any) => {
    if (comment.upboardCommState === "비활성") {
      comment.upboardCommContent = "삭제된 메시지입니다."; // 비활성 댓글은 "삭제된 메시지입니다."로 처리
    }
    return comment;
  });

  // 렌더링
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{upboard.upboardTitle}</h1>

        {/* 메타정보 */}
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 mb-6 border border-gray-200 rounded-md">
          <div className="text-gray-700 text-sm font-semibold">
            작성자: {upboard.userName}
          </div>
          <div className="text-gray-700 text-sm">
            {formatDate(upboard.upboardBdate)}
          </div>
          <div className="text-gray-700 text-sm">
            조회수: {upboard.upboardHit}
          </div>

          {/* 댓글 수 표시 */}
          <div className="text-gray-700 text-sm">
            댓글수: {upboard.commentCount}
          </div>
        </div>

        {/* 게시글 이미지 */}
        {upboard.upboardImgn && (
          <div className="flex justify-center mb-6">
            <img
              src={getImageUrl(upboard.upboardImgn)}
              alt="게시글 이미지"
              className="w-full max-w-lg h-auto object-cover rounded-lg mb-4"
              onError={(e) => {
                console.error("이미지 로드 실패:", e.currentTarget.src);
              }}
            />
          </div>
        )}

        {/* 게시글 내용 */}
        <p className="text-gray-700 whitespace-pre-line mb-8 leading-relaxed">{upboard.upboardContent}</p>

        {/* 댓글 컴포넌트 */}
        <CommentSection upboardNum={upboard.upboardNum} comments={processedComments} />

        {/* 뒤로가기 버튼 */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate("/review/UpboardList")}
            className="px-6 py-3 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            목록
          </button>

          {/* 작성자만 수정/삭제 버튼 보이기 */}
          {upboard.userNum === user.userNum && (
            <div className="flex space-x-2">
              {/* 수정 버튼 */}
              <button
                onClick={() =>
                  navigate(`/review/UpboardList/UpboardEdit/${upboard.upboardNum}`)
                }
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition font-medium"
              >
                수정
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition font-medium"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpboardDetail;