import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Notice_Write: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: any) => state.auth.token);
  const [formData, setFormData] = useState({
    noticeNum: 0,
    noticeDate: '',
    noticeTitle: '',
    noticeContent: '',
    noticeImage: null as File | null, // 파일 데이터를 저장
    noticeHit: 0,
    noticeStatus: '활성'
  });

  console.log("token", token);
  // // 토큰이 없다면 401 에러를 방지하기 위해 요청을 보내지 않도록 합니다.
  // if (!token) {
  //   alert("로그인이 필요합니다.");
  //   navigate("/login/form");  // 로그인 페이지로 리디렉션
  //   return null;
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        noticeImage: files[0] // ✅ null 체크 후 단일 파일 저장
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted"); // 이벤트 발생 여부 확인

    const data = new FormData();

    data.append('noticeNum', formData.noticeNum.toString());
    data.append('noticeTitle', formData.noticeTitle); // 제목
    data.append('noticeContent', formData.noticeContent); // 내용
    data.append('noticeHit', formData.noticeHit.toString()); //조회수
    data.append('noticeStatus', formData.noticeStatus); // 상태
    // 파일이 있는 경우에만 추가
    if (formData.noticeImage) {
      data.append("img", formData.noticeImage); // 한 장만 업로드 가능
    }

    try {
      const response = await axios.post(
        'http://localhost:7124/back/api/notice/add',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('공지사항이 성공적으로 추가되었습니다!');
        navigate('/notice/all', { state: { reload: true } }); // 작성 완료 후 리스트로 이동
      }
    } catch (error) {
      console.error('공지사항 작성 중 오류 발생:', error);
      alert('공지사항 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg mb-32">
      <h2 className="text-2xl font-bold mb-4">공지사항 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">제목</label>
          <input
            type="text"
            name="noticeTitle"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            value={formData.noticeTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">내용</label>
          <textarea
            name="noticeContent"
            className="w-full border border-gray-300 p-2 rounded mt-1 h-40"
            value={formData.noticeContent}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">이미지 업로드 (한 장만 가능)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 p-2 rounded mt-1"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3 py-2 bg-black text-white font-semibold rounded hover:bg-white hover:text-black border border-transparent hover:border-black transition"
            disabled={loading}
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Notice_Write;