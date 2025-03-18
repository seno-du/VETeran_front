import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:7124/back";

interface RootState {
  auth: {
    token: string;
  };
}


const UpboardForm: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const [formData, setFormData] = useState({
    upboardTitle: "",
    upboardContent: "",
    upboardImgn: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, upboardImgn: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("upboardTitle", formData.upboardTitle);
    data.append("upboardContent", formData.upboardContent);

    // 파일이 존재할 때만 파일을 추가
    if (formData.upboardImgn) {
      data.append("upboardImgn", formData.upboardImgn);
    }

    // [추가] 콘솔에서 실제 FormData 내용을 확인
    console.log(">>> FormData entries:");
    for (const [key, value] of data.entries()) {
      console.log(" -", key, value);
    }

    try {
      await axios.post(`${API_BASE_URL}/upboard/add`, data, {
        // 절대 Content-Type 설정하지 말기!
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ 등록 완료!");
      navigate("/review/UpboardList");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // AxiosError 타입임을 확인한 후 처리
        alert("❌ 등록 실패");
        console.error("게시글 등록 실패", error.response || error.message);
      } else {
        alert("❌ 알 수 없는 오류");
        console.error("알 수 없는 오류", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-6xl w-full border border-gray-400">
        <h2 className="text-3xl font-bold text-center text-black mb-8">게시글 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 text-lg font-semibold">제목</label>
            <input
              type="text"
              name="upboardTitle"
              value={formData.upboardTitle}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-400 rounded-lg shadow-md focus:ring-black focus:border-black text-lg"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-semibold">내용</label>
            <textarea
              name="upboardContent"
              value={formData.upboardContent}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-400 rounded-lg shadow-md focus:ring-black focus:border-black text-lg h-48"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-800 text-lg font-semibold">파일 업로드</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-400 rounded-lg shadow-md focus:ring-black focus:border-black"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-400 transition w-36 text-lg font-semibold"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpboardForm;
