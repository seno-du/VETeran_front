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

const FileEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 파일 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [file, setFile] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedFile, setUpdatedFile] = useState<File | null>(null); // 새 파일 업로드

  // ✅ 기존 파일 정보 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:7124/back/api/mfile/getAll/${id}`)
      .then((response) => {
        if (response.data) {
          setFile(response.data);
        } else {
          throw new Error("파일 정보를 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("🚨 파일 정보를 불러오는 중 오류 발생:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ 입력 값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (file) {
      setFile({ ...file, [e.target.name]: e.target.value });
    }
  };

  // ✅ 파일 업로드
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUpdatedFile(e.target.files[0]);
    }
  };

  // ✅ 수정 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("mfileNum", file.mfileNum.toString());
    formData.append("mfileTitle", file.mfileTitle);
    formData.append("mfileContent", file.mfileContent);
    formData.append("mfileRealName", file.mfileRealName);
    formData.append("mfileName", file.mfileName);
    formData.append("mfileUploader", file.mfileUploader);
    formData.append("mfileCategory", file.mfileCategory.toString());
    // formData.append("mfileModifiedDate", file.mfileModifiedDate());

    if (updatedFile) {
      formData.append("mFile", updatedFile);
    }

    try {
      await axios.put(`http://localhost:7124/back/api/mfile/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ 파일이 수정되었습니다.");
      navigate(`/mfile/all`); // 수정 후 상세 페이지로 이동
    } catch (error) {
      console.error("🚨 파일 수정 실패:", error);
      alert("❌ 파일 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="text-center p-6">🔄 파일 정보를 불러오는 중...</div>;
  if (!file) return <div className="text-center p-6 text-red-500">❌ 파일 정보를 찾을 수 없습니다.</div>;

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
        <h2 className="text-2xl font-bold mb-6">📝 파일 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 제목 입력 */}
          <div>
            <label className="block text-gray-700">제목</label>
            <input
              type="text"
              name="mfileTitle"
              value={file.mfileTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* 🔹 내용 입력 */}
          <div>
            <label className="block text-gray-700">내용</label>
            <textarea
              name="mfileContent"
              value={file.mfileContent}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-lg"
              required
            ></textarea>
          </div>

          {/* 🔹 카테고리 선택 */}
          <div>
            <label className="block text-gray-700">카테고리</label>
            <select
              name="mfileCategory"
              value={file.mfileCategory}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              {categories.map((category, index) => (
                <option key={index} value={index + 1}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 파일 업로드 */}
          <div>
            <label className="block text-gray-700">새 파일 업로드 (선택 사항)</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded-lg" />
            {file.mfileName && (
              <p className="text-sm text-gray-500 mt-2">현재 파일: {file.mfileName}</p>
            )}
          </div>

          {/* 🔹 버튼 */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              ✅ 수정하기
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              🔙 취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileEdit;
