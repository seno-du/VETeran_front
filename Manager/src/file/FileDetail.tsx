import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ 문서 데이터 인터페이스
interface Document {
  mfileNum: number;
  mfileTitle: string;
  mfileContent: string;
  mfileDate: Date;
  mfileModifiedDate: Date;
  mfileDownloadCount: number;
  mfileUploader: string;
  mfileName: string;
  mfileRealName: string;
  mfileCategory: number;
}

// ✅ 카테고리 매핑
const categories = [
  "내과 & 영상의학과",
  "심장 & 신장 내외과",
  "외과 & 마취과",
  "치과 & 안과",
  "피부과 & 면역과",
  "정형외과 & 재활의학과",
  "종양학 & 혈액학",
];

const FileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 mfileNum 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [file, setFile] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // 파일 상세 정보 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:7124/back/api/mfile/detail/${id}`)
      .then((response) => {
        if (response.data) {
          setFile(response.data);
        } else {
          throw new Error("파일 정보를 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("파일 정보를 불러오는 중 오류 발생:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 다운로드를 바로 실행하도록 수정
  const handleDownload = () => {
    if (!file) return;
    window.location.href = `http://localhost:7124/back/api/mfile/download/${id}`;
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/mfile/getAll/${id}`);
  };

  // 날짜 형식 변환 함수
  const formatDate = (mfileDate: Date) => {
    const mfiledate = new Date(mfileDate);
    return mfiledate.toLocaleDateString() + " " + mfiledate.toLocaleTimeString();
  };

  const formatModifiedDate = (mfileModifiedDate: Date) => {
    const date = new Date(mfileModifiedDate);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // 삭제 핸들러 함수
  const handleDelete = async () => {
    try {
      await axios.put(`http://localhost:7124/back/api/mfile/status/${id}`);
      alert("파일이 삭제되었습니다.");

      // 파일 상태를 '비활성'으로 업데이트하여 UI에서 반영
      // setFile(prevFile => prevFile ? { ...prevFile, mfileStatus: "비활성" } : null);
      setFile(null);
      navigate("/mfile/all", { state: { deletedFileId: id } });
    } catch (error) {
      console.error("파일 삭제 중 오류 발생:", error);
    }
  };


  if (loading) return <div className="text-center p-6">파일 정보를 불러오는 중...</div>;
  if (!file) return <div className="text-center p-6 text-red-500">파일 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
        {/* 파일 제목 & 정보 */}
        <h2 className="text-2xl font-bold mb-4">{file.mfileTitle}</h2>
        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span className="mr-4">📅 등록일: {formatDate(file.mfileDate)}</span>
          <span>👀 다운로드 횟수: {file.mfileDownloadCount}</span>
        </div>

        {/* 파일 정보 */}
        <div className="space-y-4 text-gray-800">
          <p><strong>작성자:</strong> {file.mfileUploader}</p>
          <p><strong>카테고리:</strong> {categories[file.mfileCategory - 1] || "미정"}</p>
          <p><strong>제목:</strong> {file.mfileTitle}</p>
          <p><strong>내용:</strong> {file.mfileContent}</p>
          <p><strong>업로드 날짜:</strong> {formatDate(file.mfileDate)}</p>
          <p><strong>최근 수정:</strong> {formatModifiedDate(file.mfileModifiedDate)}</p>
        </div>

        {/* 🔹 버튼 영역 (수정 & 다운로드) */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-teal-600 transition"
          >
            파일 다운로드
          </button>
          <button
            onClick={handleEdit}
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
        </div>

      </div>
    </div>
  );
};

export default FileDetail;
