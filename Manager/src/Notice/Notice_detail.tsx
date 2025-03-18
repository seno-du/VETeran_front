import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Notice {
  noticeNum: number;
  noticeTitle: string;
  noticeContent: string;
  noticeDate: Date;
  noticeImage: string | null;
  noticeHit: number;
  noticeStatus: string;
}

const Notice_detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 mfileNum 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [notice, setNotice] = useState<Notice | null>(null);
  const [file, setFile] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const filePath = "http://localhost:7124/back/uploads/";


  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get<Notice>(`http://localhost:7124/back/api/notice/detail/${id}`);
        console.log("API Response:", response.data);  // 응답 확인
        setNotice(response.data);
        setLoading(false);
      } catch (error) {
        console.error("공지사항 데이터를 가져오는 중 오류 발생:", error);
        setError("공지사항을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  // 날짜 형식 변환 함수
  const formatDate = (noticeDate: Date) => {
    const noticedate = new Date(noticeDate);
    return noticedate.toLocaleDateString() + " " + noticedate.toLocaleTimeString();
  };

  // 삭제 핸들러 함수    
  const handleDelete = async () => {
    try {
      await axios.put(`http://localhost:7124/back/api/notice/status/${id}`);
      alert("공지사항이 삭제되었습니다.");
      setNotice(prevNotice => prevNotice ? { ...prevNotice, noticeStatus: "삭제됨" } : null);  // 공지사항 상태를 '삭제됨'으로 업데이트

      navigate("/notice/all");  // 삭제 후 공지사항 목록 페이지로 이동
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      setError("공지사항 삭제에 실패했습니다.");
    }
  };


  if (loading) return <div className="text-center">로딩 중...</div>;
  if (error) return <div className="text-red-500 text-center font-bold">{error}</div>;
  if (!notice) return <div className="text-center">공지사항을 찾을 수 없습니다.</div>;

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
        {/* 파일 제목 & 정보 */}
        <h2 className="text-2xl font-bold mb-4">{notice.noticeTitle}</h2>
        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span className="mr-4">📅 등록일: {formatDate(notice.noticeDate)}</span>
          <span>👀조회수: {notice.noticeHit}</span>
        </div>

        {/* 파일 정보 */}
        <div className="space-y-4 text-gray-800">
          <p><strong>작성자:</strong> {notice.noticeTitle}</p>
          <p><strong>내용:</strong> {notice.noticeContent}</p>
          {/* 🔹 공지 이미지 (있으면 표시) */}
          {notice.noticeImage && (
            <div className="mb-6">
              <img
                src={`${filePath}${notice.noticeImage}`}
                alt="공지 이미지"
                className="w-full object-cover rounded-md mb-8"
              />
            </div>
          )}
        </div>

        {/* 🔹 버튼 영역 (수정 & 다운로드) */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => navigate(`/notice/getAll/${id}`)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-teal-600 transition"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-teal-600 transition"
          >
            삭제
          </button>
          <button
            onClick={() => navigate("/notice/all")}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-teal-600 transition"
          >
            목록
          </button>
        </div>

      </div>
    </div>
  );
};

export default Notice_detail;
