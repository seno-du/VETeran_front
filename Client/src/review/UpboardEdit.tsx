import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:7124/back";

const UpboardEdit: React.FC = () => {
  const { num } = useParams<{ num: string }>();
  const postId = Number(num);
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);

  const [formData, setFormData] = useState({
    upboardNum: postId,
    upboardTitle: "",
    upboardContent: "",
    upboardImgn: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // ✅ 기존 게시글 정보 불러오기
  useEffect(() => {
    axios.get(`${API_BASE_URL}/upboard/detail/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("📌 불러온 데이터:", res.data.data);
      setFormData(res.data.data);
    })
    .catch(err => console.error("❌ 게시글 불러오기 실패:", err));
  }, [postId, token]);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  // ✅ 수정된 게시글 저장 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("❌ 로그인 상태가 아닙니다.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("upboardNum", String(formData.upboardNum));
    formDataToSend.append("upboardTitle", formData.upboardTitle);
    formDataToSend.append("upboardContent", formData.upboardContent);

    if (file) {
      formDataToSend.append("upboardImgn", file);
    }

    console.log("📌 전송 데이터:", formDataToSend);

    await axios.post(`${API_BASE_URL}/upboard/update`, formDataToSend, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    })
    .then(() => {
      alert("✅ 게시글이 수정되었습니다.");
      navigate(`/review/UpboardList/${postId}`);
    })
    .catch(err => {
      alert("❌ 수정 실패");
      console.error("게시글 수정 실패", err);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">게시글 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">제목</label>
            <input
              type="text"
              name="upboardTitle"
              value={formData.upboardTitle}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">내용</label>
            <textarea
              name="upboardContent"
              value={formData.upboardContent}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg h-40"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">이미지</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {formData.upboardImgn && !file && (
              <img
                src={`${API_BASE_URL}${formData.upboardImgn}`}
                alt="현재 이미지"
                className="mt-2 w-40 h-40 object-cover"
              />
            )}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpboardEdit;
