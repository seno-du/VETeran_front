import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

interface Comment {
  userNum: number,
  upboardCommNum: number,
  upboardCommContent: string,
  upboardNum: number,
  upboardCommState: string,
  parentNum: number,
  upboardCommDate: Date,
  userName: string,
}

const API_BASE_URL = "http://localhost:7124/back";

const CommentSection: React.FC<{ upboardNum: number }> = ({ upboardNum }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Map<number, boolean>>(new Map());
  const [loggedInUserNum, setLoggedInUserNum] = useState<number | null>(null);
  const token = useSelector((state: any) => state.auth.token);

  // 서버에서 로그인된 사용자 userNum 가져오기
  const UserAPI = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/one`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoggedInUserNum(response.data.userNum);
    } catch (error) {
      alert("에러 발생");
    }
  };

  useEffect(() => {
    fetchComments();
    if (token) {
      UserAPI();
    } else {
      setLoggedInUserNum(null);
    }
  }, [token]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upboard/comment/list/${upboardNum}`);
      // 비활성 댓글을 클라이언트에서 제외하고 "삭제된 메시지입니다."로 처리
      const updatedComments = response.data.map((comment: Comment) => {
        if (comment.upboardCommState === "비활성") {
          comment.upboardCommContent = "삭제된 메시지입니다."; // 삭제된 메시지로 표시
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("❌ 댓글을 불러오는 중 오류 발생:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const data = {
      upboardNum: upboardNum,
      parentNum: null,
      upboardCommContent: newComment,
    };

    try {
      await axios.post(`${API_BASE_URL}/upboard/comment/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewComment(""); // 입력창 초기화
      fetchComments(); // 댓글 목록 갱신
    } catch (error) {
      console.error("❌ 댓글 등록 중 오류 발생:", error);
    }
  };

  const handleReplySubmit = async (parentCommentNum: number) => {
    if (!replyContent.trim()) return;

    const data = {
      upboardNum: upboardNum,
      parentNum: parentCommentNum, // 부모 댓글의 ID를 parentNum으로 설정
      upboardCommContent: replyContent,
    };

    try {
      await axios.post(`${API_BASE_URL}/upboard/comment/reply`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReplyContent(""); // 입력 필드 초기화
      setReplyingTo(prevState => {
        const updatedState = new Map(prevState);
        updatedState.set(parentCommentNum, false); // 대댓글 입력 상태 닫기
        return updatedState;
      });
      fetchComments(); // 댓글 목록 갱신
    } catch (error) {
      console.error("❌ 답글 등록 중 오류 발생:", error);
    }
  };

  const handleDisableComment = async (commentNum: number) => {
    try {
      await axios.put(`${API_BASE_URL}/upboard/comment/disable/${commentNum}`);
      setComments((prev) =>
        prev.map((c) =>
          c.upboardCommNum === commentNum
            ? { ...c, upboardCommState: "비활성" }
            : c
        )
      );
    } catch (error) {
      console.error("❌ 댓글 비활성화 중 오류 발생:", error);
    }
  };

  const toggleReplyingTo = (commentNum: number) => {
    setReplyingTo((prevState) => {
      const updatedState = new Map(prevState);
      updatedState.set(commentNum, !updatedState.get(commentNum)); // 답글 입력창 상태 변경
      return updatedState;
    });
  };

  return (
    <div className="mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">댓글</h2>

      <div className="flex items-center space-x-2">
        <textarea
          className="flex-grow border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-black focus:border-black transition"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 text-sm rounded-lg shadow-md hover:bg-gray-800 transition"
          onClick={handleCommentSubmit}
        >
          등록
        </button>
      </div>

      <ul className="mt-6 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li
              key={comment.upboardCommNum}
              className={`p-4 rounded-lg shadow-sm ${comment.parentNum
                ? "ml-8 bg-gray-100 border-l-4 border-black text-sm"
                : "bg-white"
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">{comment.userName}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.upboardCommDate).toLocaleDateString("ko-KR")}
                </span>
              </div>

              {/* 댓글 내용 */}
              <p className="text-gray-800 mt-2 leading-relaxed">{comment.upboardCommContent}</p>

              <div className="mt-2 flex space-x-3">
                {/* 답글 달기 버튼 */}
                {comment.upboardCommState !== "비활성" && (
                  <button
                    className="text-sm text-black hover:text-gray-800 font-semibold transition"
                    onClick={() => toggleReplyingTo(comment.upboardCommNum)}
                  >
                    답글 달기
                  </button>
                )}

                {/* 댓글 삭제 버튼 */}
                {Number(comment.userNum) === Number(loggedInUserNum) &&
                  comment.upboardCommState !== "비활성" && (
                    <button
                      className="text-sm text-red-500 hover:text-red-700 font-semibold transition"
                      onClick={() => handleDisableComment(comment.upboardCommNum)}
                    >
                      삭제
                    </button>
                  )}
              </div>

              {/* 답글 입력창 */}
              {replyingTo.get(comment.upboardCommNum) && (
                <div className="mt-4 ml-10 p-3 bg-white border border-gray-300 rounded-lg shadow-md">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black transition"
                    placeholder="답글을 입력하세요..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    className="mt-2 bg-black text-white px-4 py-2 text-sm rounded-lg shadow-md hover:bg-gray-800 transition w-full"
                    onClick={() => toggleReplyingTo(comment.upboardCommNum)}
                  >
                    닫기
                  </button>
                  <button
                    className="mt-2 bg-black text-white px-4 py-2 text-sm rounded-lg shadow-md hover:bg-gray-800 transition w-full"
                    onClick={() => handleReplySubmit(comment.upboardCommNum)}
                  >
                    답글 등록
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">등록된 댓글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default CommentSection;